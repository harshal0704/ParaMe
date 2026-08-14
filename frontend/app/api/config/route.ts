export const runtime = 'edge';

export async function GET() {
  return Response.json({
    appName: 'ParaMe',
    livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880',
    features: {
      voiceCalls: true,
      textChat: true,
      avatarStage: true,
      spotify: !!process.env.SPOTIFY_CLIENT_ID,
    },
  });
}
