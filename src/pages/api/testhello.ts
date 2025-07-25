// Simple test API route for legacy pages/api
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Hello from pages/api!" });
}
