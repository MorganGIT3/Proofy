import React from 'react';

export const BillingPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
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

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto text-center">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-medium mb-6"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}
        >
          Billing
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Gestion de la facturation et des abonnements.
        </p>
        <p className="text-gray-500 text-sm">
          (Fonctionnalité à venir)
        </p>
      </div>
    </div>
  );
};
