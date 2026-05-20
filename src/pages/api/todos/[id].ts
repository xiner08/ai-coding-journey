import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  const prisma = getPrisma();

  try {
    switch (req.method) {
      case 'GET': {
        const todo = await prisma.todo.findUnique({ where: { id } });

        if (!todo) {
          return res.status(404).json({ error: 'Todo not found' });
        }

        return res.status(200).json(todo);
      }

      case 'PATCH': {
        const { title, completed } = req.body;

        const todo = await prisma.todo.update({
          where: { id },
          data: {
            ...(title !== undefined && { title: String(title).trim() }),
            ...(completed !== undefined && { completed: Boolean(completed) }),
          },
        });

        return res.status(200).json(todo);
      }

      case 'DELETE': {
        await prisma.todo.delete({ where: { id } });

        return res.status(204).end();
      }

      default: {
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
      }
    }
  } catch (error) {
    console.error('[api/todos/[id]]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
