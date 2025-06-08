import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import bodyParser from 'body-parser';

// Middleware helper
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

const corsMiddleware = cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

const jsonParser = bodyParser.json();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run middleware
  await runMiddleware(req, res, corsMiddleware);
  await runMiddleware(req, res, jsonParser);

  // Sample messages database
  const messages = [
    { id: 1, text: "Hello from the backend!", timestamp: new Date().toISOString() },
    { id: 2, text: "This data comes from Next.js API", timestamp: new Date().toISOString() },
	{ id: 3, text: "Tell about you!", timestamp: new Date().toISOString() },
  ];

  switch (req.method) {
    case 'GET':
      res.status(200).json({
        success: true,
        messages,
        serverInfo: {
          name: "Next.js API Server",
          version: "1.0",
          time: new Date().toISOString(),
        }
      });
      break;

    case 'POST':
      if (!req.body.message) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }
      
      const newMessage = {
        id: messages.length + 1,
        text: req.body.message,
        timestamp: new Date().toISOString(),
      };
      
      messages.push(newMessage); // In a real app, you'd save to a database
      
      res.status(201).json({
        success: true,
        message: "Message received!",
        newMessage,
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}