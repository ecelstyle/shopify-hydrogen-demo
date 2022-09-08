import NewsletterSignupForm from '~/components/NewsletterSignupForm.client';

export default function NewsletterSignup() {
  return (
    <div>
      <p className="text-sm mb-2">Connect your wallet for special offers!</p>
      <NewsletterSignupForm />
    </div>
  );
}
