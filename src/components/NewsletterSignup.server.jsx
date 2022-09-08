import NewsletterSignupForm from '~/components/NewsletterSignupForm.client';
import { useSession, useState } from '@shopify/hydrogen';

export default function NewsletterSignup({ address }) {
  const [data, setData] = useState({ address });

  const { customerWalletAddress } = useSession();
  console.log({ customerWalletAddress });

  return (
    <div>
      <p className="text-sm mb-2">
        Connect your wallet for special offers!{customerWalletAddress}
      </p>
      <NewsletterSignupForm />
    </div>
  );
}
