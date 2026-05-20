// src/pages/index.tsx
import { useState, useEffect } from 'react';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // 加载 Todo 列表
  async function loadTodos() {
    const res = await fetch('/api/todos');
    if (!res.ok) return;
    const data = await res.json();
    setTodos(data);
  }

  // 创建 Todo
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle('');
    await loadTodos();
    setLoading(false);
  }

  // 切换完成状态
  async function toggleTodo(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    await loadTodos();
  }

  // 删除 Todo
  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    await loadTodos();
  }

  // 首次加载
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          ✅ Todo 应用 - Day 2
        </h1>

        {/* 添加表单 */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="输入新任务..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? '添加中...' : '添加'}
          </button>
        </form>

        {/* Todo 列表 */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无任务，添加一个吧！</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="w-5 h-5 accent-blue-500"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}