import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}
