import React from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stack, 
  Tag, 
  Text, 
  Skeleton, 
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

function Stat({ label, value, icon }) {
  const bg = useColorModeValue('gray.50', 'whiteAlpha.100');
  return (
    <Box p={4} rounded="md" bg={bg}>
      <HStack spacing={2} mb={1}>
        {icon && <Text fontSize="lg">{icon}</Text>}
        <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>
      </HStack>
      <Heading size="md" color={useColorModeValue('gray.800', 'white')}>{value}</Heading>
    </Box>
  );
}

export function SummarySkeleton() {
  return (
    <Box layerStyle="card">
      <Skeleton height="20px" mb={4} />
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Skeleton height="80px" />
        <Skeleton height="80px" />
        <Skeleton height="80px" />
        <Skeleton height="80px" />
      </SimpleGrid>
      <Skeleton height="16px" mb={2} />
      <Stack spacing={2}>
        <Skeleton height="32px" />
        <Skeleton height="32px" />
        <Skeleton height="32px" />
      </Stack>
    </Box>
  );
}

export default function Summary({ summary }) {
  if (!summary) return null;
  
  return (
    <Box borderWidth="1px" borderColor="borderSubtle" rounded="md" overflow="hidden" bg="bgCard" boxShadow="sm">
      <Box bg="linkedinBlue" color="white" px={6} py={4}>
        <Heading size="md">Content Analysis Summary</Heading>
        <Text fontSize="sm" opacity={0.9} mt={1}>AI-generated insights and trends</Text>
      </Box>
      
      <Box p={6}>
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          <Stat 
            label="Trends Identified" 
            value={summary.trends?.length || 0} 
            icon="📈"
          />
          <Stat 
            label="Content Angles" 
            value={summary.angles?.length || 0} 
            icon="🎯"
          />
          <Stat 
            label="Post Drafts" 
            value={summary.post_drafts?.length || 0} 
            icon="📝"
          />
          <Stat 
            label="Similar Posts" 
            value={summary.similar_posts?.length || 0} 
            icon="🔗"
          />
        </SimpleGrid>

        {/* Trends Section */}
        {summary.trends && summary.trends.length > 0 && (
          <Box mb={6}>
            <Heading size="sm" mb={3} color={useColorModeValue('gray.800', 'white')}>
              🔥 Trending Topics
            </Heading>
            <Wrap spacing={2}>
              {summary.trends.slice(0, 3).map((trend, idx) => (
                <WrapItem key={idx}>
                  <Tag size="md" colorScheme="orange" variant="subtle">
                    {trend}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {/* Content Angles */}
        {summary.angles && summary.angles.length > 0 && (
          <Box mb={6}>
            <Heading size="sm" mb={3} color={useColorModeValue('gray.800', 'white')}>
              💡 Content Angles
            </Heading>
            <VStack align="stretch" spacing={2}>
              {summary.angles.slice(0, 3).map((angle, idx) => (
                <Box 
                  key={idx} 
                  p={3} 
                  bg={useColorModeValue('blue.50', 'blue.900')} 
                  rounded="md"
                  borderLeft="3px solid"
                  borderColor="linkedinBlue"
                >
                  <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
                    {angle}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Similar Posts */}
        {summary.similar_posts && summary.similar_posts.length > 0 && (
          <Box>
            <Heading size="sm" mb={3} color={useColorModeValue('gray.800', 'white')}>
              🎯 Similar Engaging Posts
            </Heading>
            <VStack align="stretch" spacing={3}>
              {summary.similar_posts.slice(0, 2).map((post, idx) => (
                <Box 
                  key={idx} 
                  p={4} 
                  bg={useColorModeValue('green.50', 'green.900')} 
                  rounded="md"
                  borderWidth="1px"
                  borderColor={useColorModeValue('green.200', 'green.700')}
                >
                  <Text fontWeight="semibold" mb={2} fontSize="sm">
                    {post.title}
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                    {post.why_it_is_engaging}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
