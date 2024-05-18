import { useState } from 'react';
import {
  Navigate,
  useLocation,
  Link,
  useOutletContext,
  useNavigate,
} from 'react-router-dom';
import { fetchInitialData } from '../utils/fetchUtils';

export default function PostOnly() {
  const navigate = useNavigate();

  // get initial load data based on url
  const location = useLocation();
  const { data, error, loading } = fetchInitialData(
    location.pathname,
    'GET',
    null,
  );

  // jwt expired
  const { handleLogout } = useOutletContext();
  if (data && data.error && data.error.name === 'TokenExpiredError') {
    // this is such bad practice - need to find a better way to logout after expired jwt
    return handleLogout();
  }

  if (data && data.error && data.error.name === 'JsonWebTokenError') {
    return <Navigate to="/" replace={true} />;
  }

  if (data && data.error === 'could not find resource') {
    return <Navigate to={'/error'} />;
  }

  // interactive state
  const [formLoading, setFormLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function handleDeletePost(e) {
    setFormLoading(true);
    setDeleteError('');

    async function sendPostDelete() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/posts/${e.target.getAttribute('data-id')}/delete`,
          {
            method: 'DELETE',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
            },
          },
        );

        const data = await response.json();

        // if jwt expired
        if (data && data.error && data.error.name === 'TokenExpiredError') {
          // this is such bad practice - need to find a better way to logout after expired jwt
          return handleLogout();
        }

        if (data.error) {
          setFormLoading(false);
          setDeleteError(data.error);
        }

        setFormLoading(false);
        setDeleteError('');
        navigate(`/posts`);
      } catch (err) {
        setFormLoading(false);
        setDeleteError('something went wrong');
      }
    }

    sendPostDelete();
  }

  return (
    <>
      {loading && <p>loading post...</p>}
      {error && <p>network error - try again </p>}
      {data && (
        <>
          <h2 className="text-xl text-white font-bold">{data.post.title}</h2>
          <p className="text-sm text-white italic">
            {data.post.author.fullName} -{' '}
            {data.post.isPublished ? (
              <span className="text-true rounded bg-gray-300 px-1">
                published
              </span>
            ) : (
              <span className="text-flame rounded bg-gray-300 px-1">
                unpublished
              </span>
            )}
          </p>
          <div className="p-4 my-4 text-olive bg-dutch rounded shadow flex flex-col gap-4">
            <p>{data.post.text}</p>
            <div className="flex gap-2">
              <Link
                className="flex-1 rounded p-2 bg-true shadow text-center font-bold text-lg text-white"
                to={`/posts/${data.post._id}/update`}
              >
                Edit
              </Link>
              <button
                className="flex-1 rounded p-2 bg-flame shadow text-center font-bold text-lg text-white"
                data-id={data.post._id}
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
          {formLoading && (
            <li className="text-dutch font-bold italic list-none mb-2">
              checking action with server..
            </li>
          )}
          {deleteError !== '' && (
            <li className="text-flame font-bold italic list-none mb-2">
              {deleteError}
            </li>
          )}
        </>
      )}
    </>
  );
}
