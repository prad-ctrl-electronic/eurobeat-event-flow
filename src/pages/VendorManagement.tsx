
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Users, TagIcon, Filter, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";
import { vendors } from "@/data/vendorData";
import { Vendor } from "@/types/vendor";
import VendorCard from "@/components/vendors/VendorCard";

const VendorManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedEventId, setSelectedEventId } = useEvent();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  // Filter vendors based on search term, event, and categories
  const filteredVendors = vendors.filter((vendor) => {
    // Search filter
    const searchMatch = 
      searchTerm === "" ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.servicesProvided?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const categoryMatch = 
      selectedCategories.length === 0 ||
      vendor.serviceCategories.some(cat => selectedCategories.includes(cat));
    
    // Status filter (tab)
    const statusMatch = 
      activeTab === "all" || 
      (activeTab === "active" && vendor.status === "Active") ||
      (activeTab === "new" && vendor.status === "New") ||
      (activeTab === "inactive" && vendor.status === "Inactive") ||
      (activeTab === "donotuse" && vendor.status === "Do Not Use");
    
    return searchMatch && categoryMatch && statusMatch;
  });

  // Get all unique categories from vendors
  const allCategories = Array.from(
    new Set(vendors.flatMap(vendor => vendor.serviceCategories))
  ).sort();

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
            
            <EventFilter 
              selectedEvent={selectedEventId}
              onEventChange={setSelectedEventId}
              className="w-full md:w-auto"
            />
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button className="gap-2" onClick={() => navigate("/vendors/new")}>
                <Plus className="h-4 w-4" /> Add Vendor
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" /> Invite Vendor
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2">
              <TagIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="all">All Vendors</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="donotuse">Do Not Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <VendorCard 
                      key={vendor.id} 
                      vendor={vendor} 
                      onClick={() => navigate(`/vendors/${vendor.id}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center h-64 text-muted-foreground">
                    No vendors found matching your criteria.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default VendorManagement;
