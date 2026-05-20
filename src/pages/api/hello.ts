import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  timestamp: string;
  method: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const name = req.body?.name || req.query?.name || '匿名用户';
  
  res.status(200).json({
    message: `你好，${name}！这是 AI Coding 第 1 天`,
    timestamp: new Date().toISOString(),
    method: req.method || 'UNKNOWN',
  });
}