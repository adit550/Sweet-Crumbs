let app: any;
let initError: any;

try {
  // Use dynamic import to catch top-level initialization errors (like Prisma missing ENV)
  const module = await import('../index.js');
  app = module.app;
} catch (e: any) {
  initError = e;
}

export default async function fetch(request: Request) {
  if (initError) {
    return new Response(JSON.stringify({ 
      error: 'Initialization Failed', 
      details: initError.message, 
      stack: initError.stack 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
  
  try {
    return await app.handle(request);
  } catch (e: any) {
    return new Response(JSON.stringify({ 
      error: 'Runtime Failed', 
      details: e.message, 
      stack: e.stack 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}
