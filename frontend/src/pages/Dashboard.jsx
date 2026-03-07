import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { 
  Menu, 
  Home, 
  Wallet, 
  Users, 
  LifeBuoy, 
  LayoutDashboard,
  User,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Link as LinkIcon,
  Plus,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package,
  Eye
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const { toast } = useToast();
  const [creator, setCreator] = useState(null);
  const [creators, setCreators] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCreator, setExpandedCreator] = useState(creatorId || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchData = async () => {
      if (!creatorId) {
        navigate('/creators');
        return;
      }

      try {
        // Fetch current creator
        const creatorResponse = await axios.get(`${API_URL}/api/creators/${creatorId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCreator(creatorResponse.data);

        // Fetch all creators for sidebar
        const creatorsResponse = await axios.get(`${API_URL}/api/creators`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCreators(creatorsResponse.data);

        // Fetch organization
        const orgResponse = await axios.get(`${API_URL}/api/organizations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrganization(orgResponse.data);

        setExpandedCreator(creatorId);
      } catch (error) {
        toast({
          title: "Failed to load data",
          description: "Redirecting to creators list...",
          variant: "destructive",
        });
        setTimeout(() => navigate('/creators'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId, token, API_URL, navigate, toast]);

  const toggleCreatorExpand = (id) => {
    setExpandedCreator(expandedCreator === id ? null : id);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Organization Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          {organization?.logo_url ? (
            <img src={organization.logo_url} alt={organization.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{organization?.name || 'Organization'}</p>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          <button
            onClick={() => { navigate('/creators'); setSidebarOpen(false); }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Users className="h-5 w-5" />
            <span>Members</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <LifeBuoy className="h-5 w-5" />
            <span>Support</span>
          </button>
        </nav>

        {/* Creators Section */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Creators</h3>
            <button
              onClick={() => { navigate('/create-creator'); setSidebarOpen(false); }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Creator List */}
          <div className="space-y-1">
            {creators.map((c) => (
              <div key={c.id} className="border-l-2 border-gray-200">
                <button
                  onClick={() => toggleCreatorExpand(c.id)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {c.profile_picture ? (
                      <img src={c.profile_picture} alt={c.name} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{c.name}</span>
                  </div>
                  {expandedCreator === c.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {/* Expanded Creator Menu */}
                {expandedCreator === c.id && (
                  <div className="ml-6 space-y-0.5 pb-2">
                    <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</p>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                      <LinkIcon className="h-4 w-4" />
                      <span>Links</span>
                    </button>

                    <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Creator</p>
                    <button
                      onClick={() => { navigate(`/creator/${c.id}/dashboard`); setSidebarOpen(false); }}
                      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded transition-colors ${
                        creatorId === c.id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                      <TrendingUp className="h-4 w-4" />
                      <span>Analytics</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Customers</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                      <CreditCard className="h-4 w-4" />
                      <span>Transactions</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start"
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <Sidebar />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
          </div>

          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
          >
            Create Link
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-700">Total Sales</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">$0.00 <span className="text-lg text-gray-500">($0.00 gross)</span></p>
          <p className="text-sm text-gray-600">Available: $0.00 | Pending: $0.00</p>
        </Card>

        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <LinkIcon className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-700">Links sold</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0 <span className="text-lg text-gray-500">(based on 0 links)</span></p>
        </Card>

        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-700">Customers</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </Card>

        {/* Top Links Section */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-700">Top Links</h3>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No links created yet</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded-full">
              Create Your First Link
            </Button>
          </div>
        </Card>
      </main>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 border-r bg-white z-50 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Adjust content for desktop sidebar */}
      <style jsx>{`
        @media (min-width: 1024px) {
          main {
            margin-left: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
