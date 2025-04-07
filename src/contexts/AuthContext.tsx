
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

// Debug helper function
const logDebug = (message: string, data?: any) => {
  console.log(`[Auth] ${message}`, data || '');
};

// Master user credentials
const MASTER_USER = {
  email: "prad@refactore.co",
  password: "Prad2025"
};

// Provider component that wraps your app and makes auth object available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we have a stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    logDebug('Checking for stored user session', storedUser ? 'Found' : 'None');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        logDebug('User session restored', parsedUser.email);
      } catch (e) {
        logDebug('Error parsing stored user, clearing session', e);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock email verification
  const sendVerificationEmail = (email: string, token: string) => {
    logDebug(`Verification email sent to ${email} with token: ${token}`);
    // In a real app, this would call an API to send an email
  };

  // Sign up a new user
  const signUp = async (email: string, password: string) => {
    logDebug('Attempting to sign up user', email);
    
    // Validate email domain
    if (!email.endsWith('@refactore.co')) {
      logDebug('Sign up failed: Invalid email domain');
      throw new Error('Only refactore.co email addresses are allowed to register');
    }

    // Get existing users or initialize empty array
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    const existingUsers: StoredUser[] = existingUsersJSON 
      ? JSON.parse(existingUsersJSON) 
      : [];

    // Check if user already exists
    if (existingUsers.some(u => u.email === email)) {
      logDebug('Sign up failed: User already exists');
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
    logDebug('User created successfully, verification required', email);

    // Store verification token
    localStorage.setItem(`verification_${email}`, verificationToken);
    
    // Send verification email
    sendVerificationEmail(email, verificationToken);
  };

  // Log in an existing user
  const login = async (email: string, password: string) => {
    logDebug('Attempting to log in user', email);
    
    // Check for master user login
    if (email === MASTER_USER.email && password === MASTER_USER.password) {
      logDebug('Master user login detected - bypassing verification');
      
      // Create or get master user
      const masterUser: AuthUser = {
        id: 'master-user',
        email: MASTER_USER.email,
        name: 'Master User',
        verified: true
      };
      
      setUser(masterUser);
      localStorage.setItem('currentUser', JSON.stringify(masterUser));
      return;
    }
    
    // Regular user login flow
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    if (!existingUsersJSON) {
      logDebug('Login failed: No users found in storage');
      throw new Error('Invalid email or password');
    }

    const existingUsers: StoredUser[] = JSON.parse(existingUsersJSON);
    logDebug(`Found ${existingUsers.length} users in storage`);
    
    const foundUser = existingUsers.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      logDebug('Login failed: Invalid credentials');
      throw new Error('Invalid email or password');
    }

    if (!foundUser.verified) {
      logDebug('Login failed: Email not verified', email);
      throw new Error('Please verify your email before logging in');
    }

    // Set the current user
    const currentUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      verified: foundUser.verified
    };

    logDebug('Login successful', email);
    setUser(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  // Log out the current user
  const logout = () => {
    logDebug('User logged out');
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Verify email address
  const verifyEmail = async (token: string): Promise<boolean> => {
    logDebug('Attempting to verify email with token', token);
    
    // Get all users
    const existingUsersJSON = localStorage.getItem(MOCK_USERS_KEY);
    if (!existingUsersJSON) {
      logDebug('Verification failed: No users found');
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
        
        logDebug('Email verification successful', user.email);
        return true;
      }
    }
    
    logDebug('Email verification failed: Invalid token');
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
