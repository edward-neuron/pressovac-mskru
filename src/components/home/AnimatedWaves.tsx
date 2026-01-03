import { motion } from 'framer-motion';

export const AnimatedWaves = () => {
  // Generate smooth flowing wave paths
  const generateWavePath = (yOffset: number, amplitude: number, frequency: number, phase: number) => {
    const points = [];
    const width = 1440;
    for (let x = 0; x <= width; x += 10) {
      const y = yOffset + 
        Math.sin((x / width) * Math.PI * frequency + phase) * amplitude +
        Math.sin((x / width) * Math.PI * frequency * 0.5 + phase * 1.3) * (amplitude * 0.5);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  // Create multiple line variations for each wave group
  const createWaveGroup = (
    baseY: number,
    color: string,
    lineCount: number,
    spacing: number,
    amplitude: number,
    frequency: number,
    animationDelay: number
  ) => {
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const yOffset = baseY + i * spacing;
      const phase1 = i * 0.3;
      const phase2 = i * 0.3 + 2;
      const phase3 = i * 0.3 + 4;
      
      lines.push(
        <motion.path
          key={i}
          d={generateWavePath(yOffset, amplitude - i * 2, frequency, phase1)}
          stroke={color}
          strokeWidth={1 + (lineCount - i) * 0.1}
          fill="none"
          strokeOpacity={0.15 + (lineCount - i) * 0.05}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            d: [
              generateWavePath(yOffset, amplitude - i * 2, frequency, phase1),
              generateWavePath(yOffset, amplitude - i * 2, frequency, phase2),
              generateWavePath(yOffset, amplitude - i * 2, frequency, phase3),
              generateWavePath(yOffset, amplitude - i * 2, frequency, phase1),
            ]
          }}
          transition={{ 
            pathLength: { duration: 2, delay: animationDelay + i * 0.1 },
            opacity: { duration: 1, delay: animationDelay + i * 0.1 },
            d: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: animationDelay }
          }}
        />
      );
    }
    return lines;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Silver/Gray wave group */}
      <motion.svg
        className="absolute top-[55%] left-0 w-full h-[300px]"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        initial={{ x: -50 }}
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        {createWaveGroup(80, 'hsl(220, 10%, 70%)', 8, 6, 40, 2, 0)}
      </motion.svg>

      {/* Blue wave group */}
      <motion.svg
        className="absolute top-[65%] left-0 w-full h-[300px]"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        initial={{ x: 50 }}
        animate={{ x: [0, -25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        {createWaveGroup(120, 'hsl(210, 100%, 55%)', 7, 5, 35, 2.5, 0.5)}
      </motion.svg>

      {/* Purple wave group */}
      <motion.svg
        className="absolute top-[75%] left-0 w-full h-[300px]"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        initial={{ x: 0 }}
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        {createWaveGroup(100, '#8248fa', 6, 5, 30, 2.2, 1)}
      </motion.svg>

      {/* Interweaving accent lines */}
      <motion.svg
        className="absolute top-[70%] left-0 w-full h-[200px] opacity-60"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        animate={{ x: [10, -10, 10] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Silver accent */}
        <motion.path
          d={generateWavePath(60, 25, 3, 0)}
          stroke="hsl(220, 15%, 80%)"
          strokeWidth={0.8}
          fill="none"
          strokeOpacity={0.3}
          animate={{ 
            d: [
              generateWavePath(60, 25, 3, 0),
              generateWavePath(60, 25, 3, 2),
              generateWavePath(60, 25, 3, 4),
              generateWavePath(60, 25, 3, 0),
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Blue accent */}
        <motion.path
          d={generateWavePath(80, 20, 2.8, 1)}
          stroke="hsl(210, 100%, 60%)"
          strokeWidth={0.8}
          fill="none"
          strokeOpacity={0.25}
          animate={{ 
            d: [
              generateWavePath(80, 20, 2.8, 1),
              generateWavePath(80, 20, 2.8, 3),
              generateWavePath(80, 20, 2.8, 5),
              generateWavePath(80, 20, 2.8, 1),
            ]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        {/* Purple accent */}
        <motion.path
          d={generateWavePath(100, 22, 2.6, 2)}
          stroke="#8248fa"
          strokeWidth={0.8}
          fill="none"
          strokeOpacity={0.2}
          animate={{ 
            d: [
              generateWavePath(100, 22, 2.6, 2),
              generateWavePath(100, 22, 2.6, 4),
              generateWavePath(100, 22, 2.6, 6),
              generateWavePath(100, 22, 2.6, 2),
            ]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.svg>
    </div>
  );
};
