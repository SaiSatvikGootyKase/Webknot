import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Settings,
  ChevronRight,
  Home,
  Users,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/modern-design-system.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    { 
      name: 'Events', 
      href: '/events', 
      icon: Calendar,
      description: 'Browse and discover events'
    },
    { 
      name: 'My Registrations', 
      href: '/my-registrations', 
      icon: User,
      description: 'Manage your registrations'
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: BarChart3,
      description: 'Analytics and insights'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-50)' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EventPortal</h1>
                <p className="text-sm text-white text-opacity-80">Campus Events</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`nav-item w-full ${active ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  {active && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="sidebar-footer">
          <div className="card">
            <div className="card-body" style={{ padding: 'var(--space-4)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-gray-500">{user?.college_name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Modern Header */}
        <header className="main-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {navigation.find(item => isActive(item.href))?.description || 'Welcome back'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, reports..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-body">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
