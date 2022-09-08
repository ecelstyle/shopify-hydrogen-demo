import { useSession, fetchSync, CacheNone } from '@shopify/hydrogen';

export async function api(request, { session }) {
  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  switch (request.method) {
    case 'GET':
      var sessionData = await session.get();

      var wallet = sessionData.customerWalletAddress;
      //TODO REMOVE , READ SESSION SUCCESS
      wallet = '0xd1f6d50ca8f245db6358cea2680675e6039f9caa';
      //console.log(customerWalletAddress: wallet);
      return { customerWalletAddress: wallet };
    case 'POST':
      const jsonBody = await request.json();
      //console.log(jsonBody);

      if (!jsonBody.address) {
        return new Response(
          JSON.stringify({ error: 'Incorrect wallet address' }),
          {
            status: 400,
          }
        );
      }

      await session.set('customerWalletAddress', jsonBody.address);

      var test = await session.get('customerWalletAddress');

      console.log('set edildi');
      console.log(test);

      return { customerWalletAddress: jsonBody.customerWalletAddress };
  }
}
