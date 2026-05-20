import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    try {
      const res = await fetch('/api/hello');
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  async function postData() {
    setLoading(true);
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '前端工程师' }),
      });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          🚀 AI Coding 学习之旅 - Day 1
        </h1>

        <div className="space-x-4 mb-6">
          <button
            onClick={getData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
          >
            GET 请求
          </button>
          <button
            onClick={postData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            POST 请求
          </button>
        </div>

        {data && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-2">响应数据：</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}