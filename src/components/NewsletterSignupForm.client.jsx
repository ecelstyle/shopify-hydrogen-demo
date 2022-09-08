export default function NewsletterSignupForm() {
  async function connect() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    alert(accounts[0]);
    callSetApi(accounts[0]);
  }

  async function callSetApi({ value }) {
    try {
      const res = await fetch(`/account/wallet`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
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
