import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// Disable Next.js default body parsing for API routes
export const config = {
  api: {
    bodyParser: false,
  },
};