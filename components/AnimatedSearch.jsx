import { useState, useEffect } from 'react';
import { 
  Input, 
  InputGroup, 
  InputRightElement, 
  Button, 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Tag, 
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiZap } from 'react-icons/fi';

const suggestions = [
  'Artificial Intelligence',
  'Digital Marketing',
  'Remote Work',
  'Productivity',
  'Leadership'
];

const AnimatedSearch = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // Auto-hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isFocused) return;
      setShowSuggestions(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFocused]);

  return (
    <Box position="relative" w="100%" maxW="2xl" mx="auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <InputGroup size="lg" boxShadow="lg" borderRadius="xl" overflow="hidden" w="auto" flex="1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="What topic would you like to post about?"
            border="none"
            _focus={{
              boxShadow: '0 0 0 2px rgba(0, 119, 181, 0.4)'
            }}
            bg={bgColor}
            fontSize="lg"
            minW={{ base: '250px', sm: '350px', md: '450px' }}
            px={6}
            py={6}
            h="auto"
          />
        </InputGroup>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}
        >
              <Button
                as={motion.button}
                onClick={handleSearch}
                isLoading={isLoading}
                loadingText=""
                size="lg"
                rightIcon={
                  <motion.span
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut'
                      }
                    }}
                  >
                    <FiZap />
                  </motion.span>
                }
                borderRadius="full"
                fontWeight="semibold"
                bgGradient="linear(135deg, #0077b5 0%, #00a0dc 100%)"
                color="white"
                textTransform="uppercase"
                letterSpacing="wider"
                position="relative"
                overflow="hidden"
                px={5}
                py={4}
                h="auto"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
                _hover={{
                  bgGradient: 'linear(135deg, #0066a0 0%, #0088cc 100%)',
                  boxShadow: '0 10px 25px -5px rgba(0, 119, 181, 0.4), 0 10px 10px -5px rgba(0, 119, 181, 0.2)',
                  transform: 'translateY(-2px)',
                  _before: {
                    opacity: 1,
                  },
                }}
                _active={{
                  transform: 'translateY(0)',
                  boxShadow: '0 5px 10px -3px rgba(0, 0, 0, 0.2)',
                  bgGradient: 'linear(135deg, #00558b 0%, #0077b5 100%)',
                }}
                _focus={{
                  boxShadow: '0 0 0 3px rgba(0, 119, 181, 0.5)',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                sx={{
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
                    transform: 'translateX(-100%) rotate(45deg)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover::after': {
                    transform: 'translateX(100%) rotate(45deg)',
                  },
                }}
              >
                Generate
              </Button>
            </motion.div>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && query.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              width: '100%',
              zIndex: 10,
              marginTop: '0.5rem'
            }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              backdropFilter={useColorModeValue('none', 'blur(8px)')}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              borderRadius="xl"
              boxShadow="lg"
              py={2}
              px={4}
            >
              <Text 
                fontSize="xs" 
                color={useColorModeValue('gray.600', 'gray.300')} 
                mb={3} 
                fontWeight="bold"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Trending Topics
              </Text>
              <Flex wrap="wrap" gap={2}>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, type: 'spring', stiffness: 300 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Tag
                      size="sm"
                      variant={useColorModeValue('subtle', 'solid')}
                      colorScheme={useColorModeValue('gray', 'blue')}
                      cursor="pointer"
                      px={3}
                      py={1}
                      fontWeight="medium"
                      borderWidth={useColorModeValue('1px', '0')}
                      borderColor={useColorModeValue('gray.200', 'transparent')}
                      bg={useColorModeValue('white', 'blue.600')}
                      color={useColorModeValue('gray.700', 'white')}
                      _hover={{
                        bg: useColorModeValue('gray.50', 'blue.500'),
                        transform: 'translateY(-1px)',
                        boxShadow: 'sm'
                      }}
                      transition="all 0.2s"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Tag>
                  </motion.div>
                ))}
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AnimatedSearch;
