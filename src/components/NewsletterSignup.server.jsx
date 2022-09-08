import NewsletterSignupForm from '~/components/NewsletterSignupForm.client';
import { useSession, fetchSync, CacheNone } from '@shopify/hydrogen';

export default function NewsletterSignup() {
  //const { customerWalletAddress } = useSession();

  var customerWalletAddress = '';

  const wallet = fetchSync('/account/wallet', {
    preload: true,
    cache: CacheNone(),
  }).json();

  customerWalletAddress = wallet.customerWalletAddress;

  return (
    <div>
      <p className="text-sm mb-2">
        Connect your wallet for special offers!
        <br />
        Address : {customerWalletAddress}
      </p>
      <NewsletterSignupForm />
    </div>
  );
}

export async function api(request, { params, queryShop }) {
  console.log('calisti');
}
