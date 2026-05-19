import { processChatRequest } from '../src/lib/chatService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const responseText = await processChatRequest(req.body);
    res.json({ text: responseText });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "An error occurred" });
  }
}
