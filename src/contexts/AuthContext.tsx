
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our authentication context
type AuthUser = {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
};

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
// In a real application, this would be handled by a backend service
const MOCK_USERS_KEY = 'mock_users';

type StoredUser = {
  id: string;
  email: string;
  name?: string;
  password: string;
  verified: boolean;
};

// Provider component that wraps your app and makes auth object available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we have a stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock email verification
  const sendVerificationEmail = (email: string, token: string) => {
    console.log(`Verification email sent to ${email} with token: ${token}`);
    // In a real app, this would call an API to send an email
  };

  // Sign up a new user
  const signUp = async (email: string, password: string) => {
    // Validate email domain
    if (!email.endsWith('@refactore.co')) {
      throw new Error('Only refactore.co email addresses are allowed to register');
    }

    // Get existing users or initialize empty array
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    const existingUsers: StoredUser[] = existingUsersJSON 
      ? JSON.parse(existingUsersJSON) 
      : [];

    // Check if user already exists
    if (existingUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    // Create verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    
    // Create new user
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      verified: false,
    };

    // Store user
    localStorage.setItem(
      MOCK_USERS_KEY, 
      JSON.stringify([...existingUsers, newUser])
    );

    // Send verification email
    sendVerificationEmail(email, verificationToken);

    // Store verification token
    localStorage.setItem(`verification_${email}`, verificationToken);

    // Don't automatically log in the user - require verification first
  };

  // Log in an existing user
  const login = async (email: string, password: string) => {
    // Get users
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    if (!existingUsersJSON) {
      throw new Error('Invalid email or password');
    }

    const existingUsers: StoredUser[] = JSON.parse(existingUsersJSON);
    const foundUser = existingUsers.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    if (!foundUser.verified) {
      throw new Error('Please verify your email before logging in');
    }

    // Set the current user
    const currentUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      verified: foundUser.verified
    };

    setUser(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  // Log out the current user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Verify email address
  const verifyEmail = async (token: string): Promise<boolean> => {
    // Get all users
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    if (!existingUsersJSON) {
      return false;
    }

    const existingUsers: StoredUser[] = JSON.parse(existingUsersJSON);
    
    // Find the user with the pending verification
    for (const user of existingUsers) {
      const storedToken = localStorage.getItem(`verification_${user.email}`);
      
      if (storedToken === token) {
        // Update user's verified status
        user.verified = true;
        
        // Update in storage
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(existingUsers));
        
        // Clean up the token
        localStorage.removeItem(`verification_${user.email}`);
        
        return true;
      }
    }
    
    return false;
  };

  // Context values to provide
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    login,
    logout,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
