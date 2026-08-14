import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const metadata = {
  title: 'ParaMe — Omnichannel AI Persona & 3D Digital Twin',
  description: 'Create your photorealistic 3D digital twin with cloned voice, multimodal memory RAG, and omnichannel WebRTC calling.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({ children }) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuaGVyby5kZXYk';

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#d4af37',
          colorBackground: '#0c0a07',
          colorInputBackground: '#14120e',
          colorInputText: '#ffffff',
          colorText: '#f5f1e8',
          colorTextSecondary: '#9c9586',
          borderRadius: '1rem',
          fontFamily: '"Albert Sans", sans-serif'
        },
        elements: {
          card: 'bg-[#0c0a07] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] plinth-card',
          formButtonPrimary: 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-semibold shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all',
          headerTitle: 'text-white font-bold text-lg',
          headerSubtitle: 'text-stone-400 text-xs',
          socialButtonsBlockButton: 'border border-white/10 hover:border-amber-500/30 hover:bg-white/5 text-stone-200 transition-all',
          formFieldInput: 'bg-[#14120e] border border-white/10 focus:border-amber-500/40 text-white rounded-xl',
          footerActionLink: 'text-amber-400 hover:text-amber-300 font-medium'
        }
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className="bg-[#070604] text-[#f4efe6] antialiased min-h-screen">
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
