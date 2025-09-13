import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  HStack,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  VStack,
  IconButton,
  Tooltip,
  useToast,
  Wrap,
  WrapItem,
  Tag,
  Textarea,
  Button,
  Flex,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CopyIcon, 
  EditIcon, 
  CheckIcon, 
  ViewIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons';
import { FiLinkedin, FiShare2, FiThumbsUp, FiMessageSquare, FiSend } from 'react-icons/fi';

const MotionBox = motion(Box);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

export default function PostCard({ post, index = 0 }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || '');
  const [editedTitle, setEditedTitle] = useState(post?.title || '');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const isContentClamped = useRef(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const cardRef = useRef(null);
  
  // Check if content is too long and needs to be truncated
  useEffect(() => {
    if (contentRef.current) {
      isContentClamped.current = 
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
    }
  }, [editedContent]);

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast({ 
      title: 'Post updated', 
      description: 'Your changes have been saved locally', 
      status: 'success', 
      duration: 2000 
    });
  };

  const handleCopyPost = async () => {
    const fullPost = `${editedTitle}\n\n${editedContent}\n\n${post.hashtags?.join(' ') || ''}`;
    try {
      await navigator.clipboard.writeText(fullPost);
      toast({
        position: 'top-right',
        render: () => (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
              color: '#1a365d'
            }}
          >
            <Box color="green.500">
              <CheckIcon />
            </Box>
            Copied to clipboard!
          </motion.div>
        ),
        duration: 2000,
        isClosable: true,
      });
    } catch (_) {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        position: 'top-right'
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: editedTitle,
        text: editedContent,
        url: window.location.href,
      }).catch(console.error);
    } else {
      onOpen();
    }
  };

  const handleSendToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(editedTitle)}&summary=${encodeURIComponent(editedContent)}`;
    window.open(linkedinUrl, '_blank');
  };

  const cardAnimation = {
    initial: 'hidden',
    animate: 'visible',
    variants: cardVariants,
    whileHover: 'hover',
    custom: index
  };

  return (
    <MotionBox
      ref={cardRef}
      layerStyle="card"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      p={6}
      position="relative"
      {...cardAnimation}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.1
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bgGradient: 'linear(to-r, #0077b5, #00a0dc)',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }}
      _hover={{
        _before: {
          opacity: 1
        }
      }}
    >
      <VStack align="stretch" spacing={5}>
        {/* Header with avatar and metadata */}
        <HStack spacing={3} align="flex-start">
          <Box
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            cursor="pointer"
          >
            <Box
              w="48px"
              h="48px"
              borderRadius="full"
              bgGradient="linear(to-br, #0077b5, #00a0dc)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="xl"
            >
              AI
            </Box>
          </Box>
          
          <VStack align="flex-start" spacing={0} flex={1}>
            <HStack spacing={2} align="center">
              <Text fontWeight="semibold">AI Content Assistant</Text>
              <Badge 
                colorScheme="linkedin" 
                variant="subtle" 
                fontSize="xs"
                borderRadius="md"
                px={2}
                py={0.5}
              >
                AI
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500">Just now</Text>
          </VStack>
          
          <IconButton
            icon={<Icon as={FiLinkedin} />}
            aria-label="Share on LinkedIn"
            variant="ghost"
            size="sm"
            colorScheme="linkedin"
            onClick={handleSendToLinkedIn}
          />
        </HStack>
        {/* Post content */}
        <Box>
          {isEditing ? (
            <Textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Post title..."
              size="lg"
              fontWeight="semibold"
              mb={3}
              variant="filled"
              _focus={{
                borderColor: 'linkedin.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-linkedin-500)'
              }}
            />
          ) : (
            <Heading 
              as="h3" 
              size="md" 
              mb={3} 
              color={useColorModeValue('gray.800', 'white')}
              lineHeight="tall"
            >
              {editedTitle}
            </Heading>
          )}
          
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Write your post content here..."
              minH="120px"
              variant="filled"
              _focus={{
                borderColor: 'linkedin.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-linkedin-500)'
              }}
            />
          ) : (
            <Box position="relative">
              <Box
                ref={contentRef}
                maxH={showFullContent ? 'none' : '120px'}
                overflow="hidden"
                position="relative"
                css={{
                  '&::after': {
                    content: !showFullContent && isContentClamped.current ? '""' : 'none',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)',
                    _dark: {
                      background: 'linear-gradient(to bottom, rgba(26, 32, 44, 0) 0%, rgba(26, 32, 44, 0.95) 100%)',
                    }
                  }
                }}
              >
                <Text 
                  color={useColorModeValue('gray.700', 'gray.300')} 
                  lineHeight="tall"
                  whiteSpace="pre-line"
                >
                  {editedContent}
                </Text>
              </Box>
              
              {isContentClamped.current && !showFullContent && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="linkedin"
                  onClick={() => setShowFullContent(true)}
                  mt={2}
                  leftIcon={<ChevronDownIcon />}
                >
                  Read more
                </Button>
              )}
              
              {showFullContent && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="linkedin"
                  onClick={() => setShowFullContent(false)}
                  mt={2}
                  leftIcon={<ChevronUpIcon />}
                >
                  Show less
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Hashtags and engagement */}
        <Box>
          <Wrap spacing={2} mb={4}>
            {post.hashtags?.map((hashtag, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tag 
                  size="md" 
                  colorScheme="linkedin" 
                  variant="subtle"
                  cursor="pointer"
                  _hover={{
                    bg: useColorModeValue('linkedin.50', 'linkedin.900')
                  }}
                  transition="all 0.2s"
                >
                  {hashtag}
                </Tag>
              </motion.div>
            ))}
          </Wrap>
          
          {/* Engagement bar */}
          <HStack 
            spacing={4} 
            color={useColorModeValue('gray.600', 'gray.400')}
            fontSize="sm"
            pt={3}
            borderTopWidth="1px"
            borderTopColor={borderColor}
          >
            <HStack spacing={1}>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <IconButton
                  icon={<Icon as={FiThumbsUp} />}
                  aria-label="Like"
                  variant="ghost"
                  size="sm"
                  colorScheme={liked ? 'linkedin' : 'gray'}
                  onClick={handleLike}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.700')
                  }}
                />
              </motion.div>
              <Text>{likes}</Text>
            </HStack>
            
            <HStack spacing={1}>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <IconButton
                  icon={<Icon as={FiMessageSquare} />}
                  aria-label="Comment"
                  variant="ghost"
                  size="sm"
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.700')
                  }}
                />
              </motion.div>
              <Text>{Math.floor(Math.random() * 20)}</Text>
            </HStack>
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              style={{ marginLeft: 'auto' }}
            >
              <IconButton
                icon={<Icon as={FiShare2} />}
                aria-label="Share"
                variant="ghost"
                size="sm"
                onClick={handleShare}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              />
            </motion.div>
            
            {!isEditing && (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <IconButton
                  icon={<CopyIcon />}
                  aria-label="Copy post"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPost}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.700')
                  }}
                />
              </motion.div>
            )}
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <IconButton
                icon={isEditing ? <CheckIcon /> : <EditIcon />}
                aria-label={isEditing ? 'Save changes' : 'Edit post'}
                variant="ghost"
                size="sm"
                onClick={isEditing ? handleSaveEdit : () => setIsEditing(true)}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              />
            </motion.div>
          </HStack>
        </Box>
      </VStack>
      
      {/* Share Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <ModalHeader>Share Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Share this post on your favorite platform:</Text>
            <VStack spacing={3}>
              <Button
                leftIcon={<Icon as={FiLinkedin} />}
                colorScheme="linkedin"
                w="full"
                onClick={handleSendToLinkedIn}
              >
                Share on LinkedIn
              </Button>
              <Button
                leftIcon={<CopyIcon />}
                variant="outline"
                w="full"
                onClick={handleCopyPost}
              >
                Copy Link
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
}
