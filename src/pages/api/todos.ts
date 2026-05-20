import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = getPrisma();

  try {
    switch (req.method) {
      case 'GET': {
        const todos = await prisma.todo.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(todos);
      }

      case 'POST': {
        const { title } = req.body;

        if (!title || typeof title !== 'string') {
          return res.status(400).json({ error: 'title is required' });
        }

        const todo = await prisma.todo.create({
          data: { title: title.trim() },
        });

        return res.status(201).json(todo);
      }

      default: {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
      }
    }
  } catch (error) {
    console.error('[api/todos]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
