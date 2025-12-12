import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Plus, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { AccountModal } from './AccountModal';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Mes dashboards", icon: LayoutDashboard, href: "/dashboard" },
  { id: "create", name: "Ajouter un dashboard", icon: Plus, href: "/dashboard/create" },
];

export const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
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
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      setActiveItem('dashboard');
    } else if (location.pathname.startsWith('/dashboard/create')) {
      setActiveItem('create');
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

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 shadow-lg border border-gray-800 md:hidden hover:bg-gray-800 transition-all duration-200"
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
          fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black border-r border-gray-800/50 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0 md:fixed
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800/50 bg-gray-900/30">
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
            className="hidden md:flex p-1.5 rounded-md hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-white"
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
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative
                      ${isActive
                        ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-lg shadow-white/5"
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
                            ? "text-white" 
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
            })}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-gray-800/50">
          {/* Profile Section */}
          <div className={`border-b border-gray-800/50 bg-gray-900/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div 
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border border-gray-800">
                  <span className="text-white font-medium text-sm">{getUserInitials()}</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-white truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-400 truncate">{getUserEmail()}</p>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
            ) : (
              <div 
                onClick={() => setIsAccountModalOpen(true)}
                className="flex justify-center cursor-pointer"
              >
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border border-gray-800">
                    <span className="text-white font-medium text-sm">{getUserInitials()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-3">
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
      </div>

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300 ease-in-out min-h-screen
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          ${isOpen ? "ml-0" : ""}
        `}
      >
        <Outlet />
      </div>

      {/* Account Modal */}
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
    </>
  );
};
