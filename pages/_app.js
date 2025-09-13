import { ChakraProvider, extendTheme, PortalManager } from '@chakra-ui/react';
import Head from 'next/head';
import { useRef } from 'react';

// LinkedIn-themed Chakra theme for professional content generation
const theme = extendTheme({
  config: { initialColorMode: 'system', useSystemColorMode: true },
  colors: {
    brand: {
      50: '#E8F4FD',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#0077B5', // LinkedIn Blue
      600: '#0066A0',
      700: '#00558B',
      800: '#004476',
      900: '#003361',
    },
    linkedinBlue: '#0077B5',
    linkedinDark: '#004182',
  },
  semanticTokens: {
    colors: {
      bgPage: { default: 'gray.50', _dark: 'gray.900' },
      bgCard: { default: 'white', _dark: 'gray.800' },
      borderSubtle: { default: 'gray.200', _dark: 'gray.700' },
      textMuted: { default: 'gray.600', _dark: 'gray.400' },
    },
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
  space: {
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
  },
  shadows: {
    xs: '0 1px 2px rgba(16,24,40,0.04), 0 1px 1px rgba(16,24,40,0.04)',
    sm: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.1)',
    md: '0 2px 4px rgba(16,24,40,0.08), 0 4px 8px rgba(16,24,40,0.08)',
  },
  fonts: {
    heading: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    body: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  layerStyles: {
    card: {
      bg: 'bgCard',
      borderWidth: '1px',
      borderColor: 'borderSubtle',
      rounded: 'md',
      p: 5,
      boxShadow: 'sm',
    },
  },
  textStyles: {
    subtle: { color: 'textMuted' },
  },
  components: {
    Container: {
      defaultProps: { maxW: { base: 'container.lg', lg: '85vw', xl: '80vw' }, px: { base: 4, md: 3 } },
    },
    Button: {
      defaultProps: { colorScheme: 'brand' },
      baseStyle: { borderRadius: '8px', fontWeight: '600' },
      variants: {
        solid: {
          boxShadow: 'sm',
          _hover: { boxShadow: 'md' },
          _active: { transform: 'translateY(1px)' },
        },
        ghost: { _hover: { bg: 'blackAlpha.50' } },
        outline: { _hover: { bg: 'blackAlpha.50' } },
      },
    },
    Tag: {
      baseStyle: { borderRadius: '6px', fontWeight: '600' },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'blackAlpha.50',
            _hover: { bg: 'blackAlpha.100' },
            _focus: { bg: 'transparent', borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' },
          },
        },
      },
      defaultProps: { variant: 'filled' },
    },
    Select: {
      defaultProps: { size: 'sm' },
    },
    Modal: {
      baseStyle: {
        dialog: { rounded: 'md' },
      },
    },
  },
  styles: {
    global: (props) => ({
      'html, body': {
        background: props.colorMode === 'light' ? 'var(--chakra-colors-gray-50)' : 'var(--chakra-colors-gray-900)',
      },
      '*, *::before, *::after': { boxSizing: 'border-box' },
      a: { transition: 'color .2s ease' },
    }),
  },
});

function MyApp({ Component, pageProps }) {
  const portalRef = useRef();
  
  return (
    <ChakraProvider theme={theme}>
      <PortalManager>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>LinkedIn Content Generator</title>
        </Head>
        <div id="app" ref={portalRef}>
          <Component {...pageProps} />
        </div>
        <div id="portal-root" />
      </PortalManager>
    </ChakraProvider>
  );
}

export default MyApp;
