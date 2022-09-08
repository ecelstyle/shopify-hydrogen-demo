import { useNavigate, useServerProps } from '@shopify/hydrogen';

export default function NewsletterSignupForm() {
  const navigate = useNavigate();

  async function connect() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    //alert(accounts[0]);
    await callSetApi(accounts[0]);
  }

  async function callSetApi(value) {
    var reqBody = {};
    reqBody['address'] = value;
    try {
      const res = await fetch(`/account/wallet`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    } catch (error) {
      return {
        error: error.toString(),
      };
    }
  }

  return (
    <>
      <button
        className="text-white p-2 text-sm uppercase border "
        onClick={() => {
          connect();
        }}
      >
        CONNECT METAMASK
      </button>
    </>
  );
}
