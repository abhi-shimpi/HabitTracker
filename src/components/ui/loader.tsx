import React from 'react';
import { Trophy, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiLoaderProps {
  message?: string;
  fullScreen?: boolean;
  showLoader?: boolean;
}

export function ApiLoader({
  message = 'Loading your quest data...',
  fullScreen = false,
  showLoader = false
}: ApiLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Main Animated Group */}
      <div className="relative w-32 h-32">
        {/* Rotating Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Second Ring - Counter Rotate */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-orange-secondary"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Pulsing Background Glow */}
        <motion.div
          className="absolute inset-4 rounded-full bg-orange-primary/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Center Trophy Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Trophy className="w-12 h-12 text-orange-primary" />
          </motion.div>
        </div>

        {/* Orbiting Flame - Top */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: '50% 64px' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame className="w-6 h-6 text-orange-secondary" />
          </motion.div>
        </motion.div>

        {/* Orbiting Sparkle - Right */}
        <motion.div
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          style={{ transformOrigin: '-64px 50%' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-orange-primary fill-orange-primary" />
          </motion.div>
        </motion.div>

        {/* Orbiting Sparkle - Left */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          style={{ transformOrigin: '64px 50%' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Sparkles className="w-5 h-5 text-orange-light fill-orange-light" />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Message */}
      <div className="space-y-2 text-center">
        <motion.p
          className="text-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-orange-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      {showLoader && content}
    </div>
  );
}

