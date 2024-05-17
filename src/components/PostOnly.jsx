import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { fetchInitialData } from '../utils/fetchUtils';

export default function PostOnly() {
  // get initial load data based on url
  const location = useLocation();
  const { data, error, loading } = fetchInitialData(
    location.pathname,
    'GET',
    null,
  );

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
    console.log(e.target.getAttribute('data-id'));
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
            <li className="text-dutch font-bold italic">
              checking action with server..
            </li>
          )}
          {deleteError !== '' && (
            <li className="text-flame font-bold italic">{deleteError}</li>
          )}
        </>
      )}
    </>
  );
}
