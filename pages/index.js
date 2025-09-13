import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Skeleton,
  SkeletonText,
  useToast,
  VStack,
  ScaleFade,
  usePrefersReducedMotion,
  chakra,
  shouldForwardProp,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@chakra-ui/icons';
import { FiArrowRight } from 'react-icons/fi';
import PostCard from '../components/PostCard';
import Summary, { SummarySkeleton } from '../components/Summary';
import HeroSection from '../components/HeroSection';
import AnimatedSearch from '../components/AnimatedSearch';
import Navbar from '../components/Navbar';

// Animation components
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'transition',
});

// Define animations as objects for better compatibility
const fadeIn = {
  'from': { opacity: 0, transform: 'translateY(20px)' },
  'to': { opacity: 1, transform: 'translateY(0)' },
};

const float = {
  '0%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-10px)' },
  '100%': { transform: 'translateY(0px)' },
};

// Animation strings for direct usage
const fadeInAnimation = 'fadeIn 0.6s ease-out forwards';
const floatAnimation = 'float 6s ease-in-out infinite';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

// Mock data for demonstration
const mockData = {
  trends: [
    { id: 1, name: 'AI in Business', volume: 12000 },
    { id: 2, name: 'Remote Work', volume: 8500 },
    { id: 3, name: 'Digital Transformation', volume: 10200 },
  ],
  angles: [
    'How AI is revolutionizing remote work in 2023',
    'The future of digital transformation with AI',
    'Case studies of successful AI implementation'
  ],
  post: {
    title: 'The Future of Work: AI and Remote Collaboration',
    content: `The way we work is changing rapidly, and AI is at the forefront of this transformation. With the rise of remote work, companies are leveraging AI to enhance collaboration and productivity across distributed teams.

Key benefits include:
• Intelligent scheduling and meeting summaries
• Automated documentation and note-taking
• Real-time language translation for global teams
• AI-powered project management tools

What's your experience with AI in remote work? Let's discuss in the comments! 👇 #FutureOfWork #AI #RemoteWork #DigitalTransformation`,
    hashtags: ['#FutureOfWork', '#AI', '#RemoteWork', '#DigitalTransformation', '#Productivity']
  },
  similarPosts: [
    {
      id: 1,
      title: '5 Ways AI is Transforming Remote Work',
      content: 'AI tools are making remote work more efficient than ever before...',
      likes: 124,
      comments: 23,
      shares: 15
    },
    {
      id: 2,
      title: 'The Role of AI in Digital Transformation',
      content: 'Digital transformation is being accelerated by AI technologies...',
      likes: 98,
      comments: 12,
      shares: 8
    }
  ]
};

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const toast = useToast();
  const [testMode, setTestMode] = useState(false);
  const { isOpen: isTestModeOn, onToggle: toggleTestMode } = useDisclosure({ defaultIsOpen: false });
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Mock payload for Test Mode (matches n8n webhook response shape)
  function getMockPayload() {
    // Transform local mockData into the expected API shape
    const output = {
      trends: mockData.trends.map(t => t.name),
      angles: mockData.angles,
      post_drafts: [
        {
          title: mockData.post.title,
          content: mockData.post.content,
          hashtags: mockData.post.hashtags,
        }
      ],
      similar_posts: mockData.similarPosts.map(sp => ({
        title: sp.title,
        why_it_is_engaging: sp.content,
        post_url: undefined,
      }))
    };
    return {
      ok: true,
      payload: {
        output
      }
    };
  }

  const onSubmit = async (e) => {
    // Check if this is a synthetic event or real form submission
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    setError('');

    if (!keywords.trim()) {
      setError('Please enter keywords to generate content.');
      toast({ title: 'Missing input', description: 'Enter keywords to generate LinkedIn posts.', status: 'warning' });
      return;
    }

    setLoading(true);
    setData(null);
    try {
      // Test Mode: mock the API call
      if (testMode) {
        await new Promise((r) => setTimeout(r, 1500));
        const payload = getMockPayload();
        setData(payload.payload.output);
        if (payload.payload.output.post_drafts?.length > 0) {
          toast({ title: 'Test mode', description: `Generated ${payload.payload.output.post_drafts.length} post drafts`, status: 'info' });
        }
        return;
      }

      const body = { keywords: keywords.trim() };

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }

      const rawText = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        throw new Error('Invalid JSON response from webhook');
      }

      // Handle array response format from n8n webhook
      const response = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!response?.ok || !response?.payload?.output) {
        throw new Error(response?.error || 'Webhook returned unsuccessful response');
      }
      
      setData(response.payload.output);
      if (response.payload.output.post_drafts?.length > 0) {
        toast({ 
          title: 'Content generated', 
          description: `Generated ${response.payload.output.post_drafts.length} post drafts`, 
          status: 'success' 
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to generate content.');
      toast({ title: 'Error', description: err.message || 'Failed to generate content.', status: 'error' });
    } finally {
      setLoading(false);
    }
  }

  // Handle search from AnimatedSearch component
  const handleGenerate = (searchQuery) => {
    setKeywords(searchQuery);
    // Create a synthetic event for onSubmit
    const syntheticEvent = { preventDefault: () => {} };
    onSubmit(syntheticEvent);
  };

  // Animation for the test mode badge
  const testModeBadgeAnimation = prefersReducedMotion
    ? undefined
    : 'float 3s ease-in-out infinite';
  
  return (
    <Box 
      minH="100vh" 
      bg={pageBg} 
      overflowX="hidden"
      sx={{
        '@keyframes fadeIn': fadeIn,
        '@keyframes float': float,
      }}
    >
      <Navbar />
      {/* Test mode indicator */}
      <AnimatePresence>
        {testMode && (
          <MotionBox
            position="fixed"
            top={4}
            right={4}
            zIndex={1000}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            bgGradient="linear(to-r, #48BB78, #38B2AC)"
            color="white"
            px={4}
            py={2}
            borderRadius="full"
            display="flex"
            alignItems="center"
            boxShadow="lg"
            animation={testModeBadgeAnimation}
          >
            <Box w={2} h={2} bg="white" borderRadius="full" mr={2} />
            <Text fontSize="sm" fontWeight="semibold">Test Mode Active</Text>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Box as="main" py={12} position="relative">
        {/* Animated background elements */}
        <MotionBox
          position="absolute"
          top="20%"
          left="10%"
          w="200px"
          h="200px"
          borderRadius="full"
          bgGradient="linear(to-br, #0077b5, #00a0dc)"
          opacity={0.1}
          filter="blur(40px)"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <MotionBox
          position="absolute"
          bottom="10%"
          right="10%"
          w="300px"
          h="300px"
          borderRadius="full"
          bgGradient="linear(to-br, #00c4ff, #00e5ff)"
          opacity={0.1}
          filter="blur(60px)"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          {/* Search Section */}
          <ScaleFade in={!data} initialScale={0.9}>
            <VStack spacing={8} textAlign="center" mb={16}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatedSearch 
                  onSearch={handleGenerate} 
                  isLoading={loading} 
                />
              </MotionBox>
            </VStack>
          </ScaleFade>

          {error && (
            <Alert status="error" rounded="md" maxW="2xl" mx="auto" mb={6}>
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !data && (
            <Box 
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
              textAlign="center" 
              py={16} 
              maxW="2xl" 
              mx="auto"
            >
              <Box mb={4}>
                <Image 
                  src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" 
                  alt="AI Content Generation" 
                  boxSize="80px" 
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
              <Heading size="md" mb={2}>Your Generated Posts</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Enter a topic above to generate professional LinkedIn content.
              </Text>
            </Box>
          )}

          {loading && (
            <Stack spacing={6} maxW="4xl" mx="auto">
              <SummarySkeleton />
              <Stack spacing={6}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Box 
                    key={i} 
                    bg={useColorModeValue('white', 'gray.800')}
                    p={6}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <Skeleton height="24px" width="80%" mb={4} />
                    <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} />
                    <Skeleton height="16px" width="60%" />
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}

          {data && (
            <Stack spacing={8} maxW="6xl" mx="auto">
              <Summary summary={data} />
              <Stack spacing={6}>
                {data.post_drafts?.map((post, idx) => (
                  <PostCard key={idx} post={post} index={idx} />
                ))}
              </Stack>
            </Stack>
          )}
        </Container>
      </Box>
    </Box>
  );
}
