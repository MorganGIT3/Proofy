import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Connection {
  id: string;
  browser: string;
  version: string;
  os: string;
  ip: string;
  lastUsed: string;
  connected: string;
}

// Mock data
const mockConnections: Connection[] = [
  {
    id: '1',
    browser: 'Chrome',
    version: '143.0.0.0',
    os: 'Windows 10',
    ip: '86.229.140.47',
    lastUsed: 'Dec 15, 2025 at 15:38',
    connected: 'Dec 15, 2025 at 15:38',
  },
  {
    id: '2',
    browser: 'Chrome',
    version: '142.0.0.0',
    os: 'Windows 10',
    ip: '86.229.140.47',
    lastUsed: 'Dec 13, 2025 at 16:24',
    connected: 'Dec 13, 2025 at 16:23',
  },
];

export const ExtensionConnectionsPage: React.FC = () => {
  const maxConnections = 2; // Based on subscription tier

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Extension Connections
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your active Chrome extension sessions. Maximum {maxConnections} connections allowed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800/50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800/50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {mockConnections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-semibold text-white">
                          {connection.browser} {connection.version}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Operating System</p>
                          <p className="text-white">{connection.os}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">IP Address</p>
                          <p className="text-white">{connection.ip}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Last used</p>
                          <p className="text-white">{connection.lastUsed}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Connected</p>
                          <p className="text-white">{connection.connected}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors ml-4"
                    >
                      <X className="h-4 w-4" />
                      <span>Disconnect</span>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
