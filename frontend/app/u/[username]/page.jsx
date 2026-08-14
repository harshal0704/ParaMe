import React from 'react';
import PublicTwinClient from '../../../components/PublicTwinClient';

export function generateStaticParams() {
  return [
    { username: 'harshal' },
    { username: 'demo' }
  ];
}

export default async function PublicTwinPage({ params }) {
  const { username } = await params;
  return <PublicTwinClient username={username || 'harshal'} />;
}
