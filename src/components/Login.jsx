import { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

export default function Login() {
  const { handleLoginSuccess, token } = useOutletContext();

  if (token) {
    return <Navigate to="/posts" replace={true} />;
  }

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  function handleEmailChange(e) {
    setEmailInput(e.target.value);
  }

  function handlePasswordChange(e) {
    setPasswordInput(e.target.value);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setLoginError('');

    async function sendLoginPost() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/log-in`,
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              email: emailInput,
              password: passwordInput,
            }),
          },
        );

        const data = await response.json();

        if (data.error) {
          setFormLoading(false);
          setLoginError(data.error);
          return;
        }

        setFormLoading(false);
        setLoginError('');
        handleLoginSuccess(data.token, data.user);
      } catch (err) {
        setFormLoading(false);
        setLoginError('something went wrong');
      }
    }

    sendLoginPost();
  }

  return (
    <div className="flex-initial w-96 flex flex-col gap-2">
      <h2 className="text-xl text-white font-bold">Admin Login Page</h2>
      <form
        onSubmit={handleLoginSubmit}
        className="rounded bg-dutch shadow p-4 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="italic text-olive">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="p-2 rounded shadow-inner"
            value={emailInput}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="italic text-olive">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="p-2 rounded shadow-inner"
            value={passwordInput}
            onChange={handlePasswordChange}
            minLength={6}
            required
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="rounded p-4 font-bold bg-true text-white hover:cursor-pointer mt-2"
        />
      </form>
      {formLoading && (
        <p className="text-dutch font-bold italic">
          checking action with server..
        </p>
      )}
      {loginError !== '' && (
        <p className="text-flame font-bold italic">{loginError}</p>
      )}
    </div>
  );
}
