interface Env {
  DB: D1Database;
}

interface CreateTodoRequest {
  title: string;
}

interface UpdateTodoRequest {
  completed: boolean;
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Set CORS headers for all responses
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    try {
        // GET all todos
      if (method === 'GET' && path === '/api/todos') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM todos ORDER BY created_at DESC'
        ).all();
        return Response.json(results, { headers });
      }

        // POST new todo
      if (method === 'POST' && path === '/api/todos') {
        const { title } = await request.json() as CreateTodoRequest;
        const { success } = await env.DB.prepare(
          'INSERT INTO todos (title) VALUES (?)'
        )
        .bind(title)
        .run();
        return Response.json({ success }, { headers });
      }

        // PUT update todo
        if (method === 'PUT' && path.startsWith('/api/todos/')) {
            const id = path.split('/').pop();
            const { completed } = await request.json() as UpdateTodoRequest;
            const { success } = await env.DB.prepare(
                'UPDATE todos SET completed = ? WHERE id = ?'
            )
                .bind(completed, id)
                .run();
          return Response.json({ success }, { headers });
        }

        // DELETE todo
        if (method === 'DELETE' && path.startsWith('/api/todos/')) {
            const id = path.split('/').pop();
            const { success } = await env.DB.prepare(
                'DELETE FROM todos WHERE id = ?'
            )
                .bind(id)
                .run();
          return Response.json({ success }, { headers });
        }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : 'Unknown error'  }, { status: 500, headers });
    }
  },
};