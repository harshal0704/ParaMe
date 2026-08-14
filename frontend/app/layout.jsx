import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Pavtar — Omnichannel AI Persona & 3D Digital Twin',
  description: 'Create your photorealistic 3D digital twin with cloned voice, multimodal memory RAG, and omnichannel WebRTC calling.',
};

export default function RootLayout({ children }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en" className="dark">
      <body className="bg-[#070604] text-[#f4efe6] antialiased min-h-screen">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );

  // If Clerk publishable key is set, wrap with ClerkProvider; otherwise render fallback
  if (clerkKey && !clerkKey.includes('placeholder')) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
