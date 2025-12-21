import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
  Puzzle,
  Link2,
  CreditCard,
  Settings,
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
  section?: 'main' | 'account';
}

const mainNavigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard", section: 'main' },
  { id: "extension", name: "Extension", icon: Puzzle, href: "/dashboard/extension", section: 'main' },
  { id: "connections", name: "Extension Connections", icon: Link2, href: "/dashboard/connections", section: 'main' },
];

const accountNavigationItems: NavigationItem[] = [
  { id: "billing", name: "Billing", icon: CreditCard, href: "/dashboard/billing", section: 'account' },
  { id: "settings", name: "Settings", icon: Settings, href: "/dashboard/settings", section: 'account' },
];

export const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveItem('dashboard');
    } else if (path === '/dashboard/extension') {
      setActiveItem('extension');
    } else if (path === '/dashboard/connections') {
      setActiveItem('connections');
    } else if (path === '/dashboard/billing') {
      setActiveItem('billing');
    } else if (path === '/dashboard/settings') {
      setActiveItem('settings');
    }
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    navigate(item.href);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.length > 0 ? name[0].toUpperCase() : 'U';
  };

  // Subscription tier - default to "LIVE" for now (as requested)
  const subscriptionTier = 'LIVE'; // TODO: Get from user subscription data

  const getSubscriptionBadge = () => {
    if (subscriptionTier === 'LIVE') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 border border-orange-400">
          Proofy Live
        </span>
      );
    } else if (subscriptionTier === 'BASIC') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
          Proofy Basic
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
          Proofy Free
        </span>
      );
    }
  };

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <li key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`
            w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative
            ${isActive
              ? "bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-white shadow-lg shadow-orange-500/20 border-l-2 border-orange-500"
              : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }
            ${isCollapsed ? "justify-center px-2" : ""}
          `}
          title={isCollapsed ? item.name : undefined}
        >
          <div className="flex items-center justify-center min-w-[24px]">
            <Icon
              className={`
                h-5 w-5 flex-shrink-0
                ${isActive 
                  ? "text-orange-400" 
                  : "text-gray-500 group-hover:text-gray-300"
                }
              `}
            />
          </div>
          
          {!isCollapsed && (
            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
              {item.name}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
              {item.name}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45 border-l border-b border-gray-700" />
            </div>
          )}
        </button>
      </li>
    );
  };

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900/80 shadow-lg border border-gray-800/50 md:hidden hover:bg-gray-800/80 transition-all duration-200 backdrop-blur-sm"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-white" /> : 
          <Menu className="h-5 w-5 text-white" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-black/80 backdrop-blur-md border-r border-orange-500/20 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0 md:fixed
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-orange-500/20 bg-black/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <img src="/favicon.png" alt="Proofy" className="h-9 w-9 object-contain rounded" />
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base">Proofy</span>
                <span className="text-xs text-gray-400">Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 mx-auto">
              <img src="/favicon.png" alt="Proofy" className="h-9 w-9 object-contain rounded" />
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-orange-400"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Main Navigation */}
          <ul className="space-y-0.5 mb-6">
            {mainNavigationItems.map(renderNavItem)}
          </ul>

          {/* Account Section */}
          {!isCollapsed && (
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Account
              </div>
            </div>
          )}
          <ul className="space-y-0.5">
            {accountNavigationItems.map(renderNavItem)}
          </ul>
        </nav>

        {/* Bottom section with logout */}
        <div className="mt-auto border-t border-orange-500/20 p-3">
          <button
            onClick={handleSignOut}
            className={`
              w-full flex items-center rounded-lg text-left transition-all duration-200 group
              text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20
              ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
            `}
            title={isCollapsed ? "Se déconnecter" : undefined}
          >
            <div className="flex items-center justify-center min-w-[24px]">
              <LogOut className="h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-300" />
            </div>
            
            {!isCollapsed && (
              <span className="text-sm">Se déconnecter</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                Se déconnecter
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45 border-l border-b border-gray-700" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Header with Profile */}
      <header 
        className="fixed top-0 right-0 z-30 border-b border-orange-500/20 bg-black/80 backdrop-blur-md transition-all duration-300"
        style={{
          left: isMobile ? '0' : (isCollapsed ? '80px' : '256px'),
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30">
                <span className="text-white font-medium text-sm">{getUserInitials()}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white font-medium">{getUserDisplayName()}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getSubscriptionBadge()}
                </div>
              </div>
              <div className="sm:hidden">
                {getSubscriptionBadge()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300 ease-in-out min-h-screen pt-20
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          ${isOpen ? "ml-0" : ""}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};
