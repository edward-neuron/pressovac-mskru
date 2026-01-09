import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

// Memoized wave component for better performance
export const AnimatedWaves = memo(() => {
  // Pre-generate static wave paths (computed once)
  const wavePaths = useMemo(() => {
    const generatePath = (yOffset: number, amplitude: number, frequency: number, phase: number) => {
      const points: string[] = [];
      const width = 1440;
      for (let x = 0; x <= width; x += 20) { // Increased step for performance
        const y = yOffset + 
          Math.sin((x / width) * Math.PI * frequency + phase) * amplitude +
          Math.sin((x / width) * Math.PI * frequency * 0.5 + phase * 1.3) * (amplitude * 0.5);
        points.push(`${x},${y.toFixed(1)}`);
      }
      return `M ${points.join(' L ')}`;
    };

    return {
      silver: generatePath(100, 35, 2, 0),
      blue: generatePath(120, 30, 2.5, 0.5),
      accent: generatePath(80, 25, 3, 0),
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static silver wave */}
      <motion.svg
        className="absolute top-[60%] left-0 w-full h-[200px]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, 20, 0] }}
        transition={{ 
          opacity: { duration: 0.5 },
          x: { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <path
          d={wavePaths.silver}
          stroke="hsl(220, 10%, 70%)"
          strokeWidth={1.5}
          fill="none"
          strokeOpacity={0.2}
        />
      </motion.svg>

      {/* Static blue wave */}
      <motion.svg
        className="absolute top-[70%] left-0 w-full h-[200px]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, -15, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.2 },
          x: { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <path
          d={wavePaths.blue}
          stroke="hsl(210, 100%, 55%)"
          strokeWidth={1.2}
          fill="none"
          strokeOpacity={0.25}
        />
      </motion.svg>

      {/* Accent wave */}
      <motion.svg
        className="absolute top-[75%] left-0 w-full h-[150px] opacity-60"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, x: [5, -5, 5] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.3 },
          x: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <path
          d={wavePaths.accent}
          stroke="hsl(212, 100%, 50%)"
          strokeWidth={0.8}
          fill="none"
          strokeOpacity={0.3}
        />
      </motion.svg>
    </div>
  );
});

AnimatedWaves.displayName = 'AnimatedWaves';
