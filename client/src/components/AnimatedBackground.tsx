import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  offsetY: number;
}

interface Wave {
  id: number;
  delay: number;
  duration: number;
  opacity: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;
    let time = 0;

    const drawGlow = (x: number, y: number, radius: number, color: string, alpha: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${color}${Math.floor(alpha * 0.3 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Flowing light beams
      for (let i = 0; i < 3; i++) {
        const offset = (i * Math.PI * 2) / 3;
        const x = canvas.width * 0.5 + Math.cos(time + offset) * canvas.width * 0.3;
        const y = canvas.height * 0.5 + Math.sin(time * 0.7 + offset) * canvas.height * 0.25;
        const radius = 150 + Math.sin(time * 2 + offset) * 50;
        const alpha = 0.15 + Math.sin(time * 1.5 + offset) * 0.08;
        
        drawGlow(x, y, radius, '#00AEEF', alpha);
      }

      // Ambient glow particles
      for (let i = 0; i < 8; i++) {
        const offset = (i * Math.PI * 2) / 8;
        const x = canvas.width * 0.5 + Math.cos(time * 0.5 + offset) * canvas.width * 0.4;
        const y = canvas.height * 0.5 + Math.sin(time * 0.3 + offset) * canvas.height * 0.35;
        const radius = 80 + Math.sin(time * 3 + offset) * 30;
        const alpha = 0.08 + Math.sin(time + offset) * 0.04;
        
        drawGlow(x, y, radius, '#0ABEFF', alpha);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    offsetY: Math.random() * 30 - 15,
  }));

  const waves: Wave[] = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 3,
    duration: 12,
    opacity: 0.03 + i * 0.01,
  }));

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Flowing wave overlays */}
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, wave.opacity, wave.opacity, 0],
          }}
          transition={{
            duration: wave.duration,
            delay: wave.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, rgba(0, 174, 239, 0.15) 0%, transparent 70%)`,
              transform: `scale(${1 + wave.id * 0.2})`,
            }}
          />
        </motion.div>
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'radial-gradient(circle, rgba(10, 190, 255, 0.8) 0%, rgba(0, 174, 239, 0.3) 50%, transparent 100%)',
            boxShadow: '0 0 10px rgba(10, 190, 255, 0.5)',
          }}
          animate={{
            y: [0, particle.offsetY, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Horizontal light beam */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          top: '50%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 174, 239, 0.4) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0, 174, 239, 0.3)',
        }}
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Vertical light beam */}
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '50%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 190, 255, 0.3) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(10, 190, 255, 0.2)',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleY: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Central glow pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 174, 239, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer glow ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(10, 190, 255, 0.05) 60%, transparent 80%)',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;




