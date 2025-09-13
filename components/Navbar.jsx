import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useColorMode,
  useColorModeValue,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  const brandColor = useColorModeValue('brand.600', 'brand.400');

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={border}
      backdropFilter="saturate(180%) blur(6px)"
    >
      <Flex maxW={{ base: 'container.lg', lg: '85vw', xl: '80vw' }} mx="auto" px={{ base: 4, md: 3 }} h={16} align="center">
        <HStack spacing={3}>
          <Box
            w="28px"
            h="28px"
            borderRadius="sm"
            bgGradient="linear(to-br, #0077b5, #00a0dc)"
          />
          <Text fontWeight="700" color={brandColor}>
            TrendIn
          </Text>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            variant="ghost"
            onClick={toggleColorMode}
            mr={2}
          />
          <Button colorScheme="brand" size="sm">Get Started</Button>
        </HStack>
      </Flex>
    </Box>
  );
}
