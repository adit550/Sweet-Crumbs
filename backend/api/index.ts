let app: any;
let initError: any;

export default async function handler(req: any, res: any) {
  try {
    // Lazy load the app to catch initialization errors (e.g. Prisma or Elysia)
    if (!app && !initError) {
      try {
        const module = await import('../index.js');
        app = module.app;
      } catch (err: any) {
        initError = err;
      }
    }

    if (initError) {
      res.status(500).json({
        error: 'Initialization Failed',
        details: initError.message,
        stack: initError.stack
      });
      return;
    }

    // 1. Convert Vercel Node Request to Web Standard Request
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const url = new URL(req.url!, `${protocol}://${host}`);

    const init: RequestInit = {
      method: req.method,
      headers: req.headers as any,
    };

    // If it's a POST/PUT request, Vercel already parsed the JSON body into req.body
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const webRequest = new Request(url.toString(), init);

    // 2. Pass to Elysia
    const response = await app.handle(webRequest);

    // 3. Convert Web Standard Response back to Vercel Node Response
    res.status(response.status);
    
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const text = await response.text();
    res.send(text);
  } catch (e: any) {
    console.error("Vercel Handler Error:", e);
    res.status(500).json({ 
      error: 'Runtime Failed', 
      details: e.message,
      stack: e.stack
    });
  }
}

