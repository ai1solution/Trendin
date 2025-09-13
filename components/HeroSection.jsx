import { Box, Text, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

// Define animations as objects for better compatibility
const fadeIn = {
  'from': { opacity: 0, transform: 'translateY(20px)' },
  'to': { opacity: 1, transform: 'translateY(0)' },
};

const pulse = {
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
};

const HeroSection = () => {
  const textColor = useColorModeValue('gray.800', 'white');
  const highlightBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
  
  return (
    <Box 
      position="relative" 
      py={20} 
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.900')}
    >
      <AnimatedBackground />
      <VStack
        spacing={8}
        textAlign="center"
        px={4}
        maxW="4xl"
        mx="auto"
        position="relative"
        zIndex={1}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': pulse,
          }}
          transition={{ duration: 0.6 }}
        >
          <Box
            as={motion.div}
            bg={highlightBg}
            backdropFilter="blur(10px)"
            display="inline-block"
            px={6}
            py={3}
            borderRadius="full"
            mb={6}
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(0, 119, 181, 0.4)',
                '0 0 0 10px rgba(0, 119, 181, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            <Text 
              fontSize="sm" 
              fontWeight="semibold" 
              color={useColorModeValue('blue.600', 'blue.300')}
              letterSpacing="wider"
            >
              AI-Powered Content Generation
            </Text>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': pulse,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Heading
            as="h1"
            size="2xl"
            fontWeight="bold"
            lineHeight="1.2"
            maxW="2xl"
            mx="auto"
          >
            <Box as="span" display="block" mb={4} color={textColor}>
              <Text as="span" display="block" mb={2} fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} fontWeight="bold">
                Generate Engaging
              </Text>
              <Box as="span" position="relative" display="inline-block" mx={2}>
                <Text
                  as="span"
                  position="relative"
                  zIndex={1}
                  bgGradient="linear(to-r, #0077b5, #00a0dc)"
                  bgClip="text"
                  color="transparent"
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  fontWeight="extrabold"
                  _dark={{
                    bgGradient: 'linear(to-r, #00a0dc, #0091ea)'
                  }}
                >
                  LinkedIn Content
                </Text>
                <Box
                  position="absolute"
                  bottom={1}
                  left={0}
                  right={0}
                  h="8px"
                  bg="blue.100"
                  zIndex={0}
                  opacity={0.7}
                />
              </Box>
              in Seconds
            </Box>
          </Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': pulse,
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color={useColorModeValue('gray.600', 'gray.300')}
            maxW="2xl"
            mx="auto"
            lineHeight="tall"
            px={4}
            textShadow={useColorModeValue('none', '0 1px 2px rgba(0,0,0,0.5)')}
            bg={useColorModeValue('whiteAlpha.500', 'blackAlpha.500')}
            p={4}
            borderRadius="lg"
            backdropFilter="blur(8px)"
          >
            Let AI help you create professional, engaging posts that resonate with your network.
            No more staring at a blank screen.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': pulse,
          }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box
            as={motion.div}
            mt={8}
            p={1}
            bgGradient="linear(to-r, #0077b5, #00a0dc)"
            borderRadius="xl"
            display="inline-block"
            animate={{
              boxShadow: [
                '0 4px 14px 0 rgba(0, 119, 181, 0.2)',
                '0 6px 20px 0 rgba(0, 160, 220, 0.3)',
                '0 4px 14px 0 rgba(0, 119, 181, 0.2)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              px={6}
              py={3}
              borderRadius="lg"
              fontWeight="semibold"
              color={useColorModeValue('gray.800', 'white')}
              _hover={{
                transform: 'translateY(-2px)',
              }}
              sx={{
                animation: 'fadeIn 0.6s ease-out forwards',
                '@keyframes fadeIn': fadeIn,
              }}
              cursor="pointer"
            >
              Try it now - it's free!
            </Box>
          </Box>
        </motion.div>
      </VStack>
    </Box>
  );
};

export default HeroSection;
