import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Using CSS animation directly for better compatibility
const gradientAnimation = {
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' },
};

const AnimatedBackground = () => {
  return (
    <Box
      as={motion.div}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      background="linear-gradient(-45deg, #0077b5, #00a0dc, #00c4ff, #00e5ff)"
      backgroundSize="400% 400%"
      sx={{
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': gradientAnimation,
      }}
      opacity={0.1}
    />
  );
};

export default AnimatedBackground;
