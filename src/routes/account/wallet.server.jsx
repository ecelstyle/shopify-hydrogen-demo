export async function api(request, { session }) {
  if (request.method !== 'POST') {
    return new Response('Post required', {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    });
  }

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  const jsonBody = await request.json();

  if (!jsonBody.address) {
    return new Response(JSON.stringify({ error: 'Incorrect wallet address' }), {
      status: 400,
    });
  }

  await session.set('customerWalletAddress', jsonBody.address);

  return new Response();
}
