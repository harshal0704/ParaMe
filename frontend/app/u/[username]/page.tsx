import React from 'react';
import PublicTwinClient from '@/components/PublicTwinClient';

export default async function PublicTwinPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const valid = /^[a-zA-Z0-9_-]+$/.test(username);
  if (!valid) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-white">Invalid Username</div>
          <p className="text-stone-400 text-sm">The requested twin URL is not valid.</p>
        </div>
      </div>
    );
  }
  return <PublicTwinClient username={username} />;
}
