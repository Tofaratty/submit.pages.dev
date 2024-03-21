addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// This is the provided secret key. In production, it's recommended
// to store secret keys securely.
const SECRET_KEY = '0x4AAAAAAAVKDcNri64lv50_A4eF-Z6WFKY';

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // Handle POST requests
  if (request.method === 'POST') {
    return handlePost(request)
  }

  // Return 405 Method Not Allowed for other request methods
  return new Response('Method Not Allowed', { status: 405 })
}

/**
 * Handle POST requests
 * @param {Request} request
 */
async function handlePost(request) {
  try {
    const body = await request.formData();
    // Turnstile injects a token in "cf-turnstile-response".
    const token = body.get('cf-turnstile-response');
    const ip = request.headers.get('CF-Connecting-IP');

    // Validate the token by calling the "/siteverify" API endpoint.
    const formData = new FormData();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json();
    if (outcome.success) {
      // Token is valid, proceed with handling the request
      // Implement your logic here
      return new Response('Success', { status: 200 });
    } else {
      // Token is invalid
      return new Response('Token validation failed', { status: 403 });
    }
  } catch (error) {
    console.error('Error handling POST request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
