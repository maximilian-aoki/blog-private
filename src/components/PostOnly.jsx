import { Navigate, useLocation } from 'react-router-dom';
import { fetchInitialData } from '../utils/fetchUtils';

export default function PostOnly() {
  const location = useLocation();
  const { data, error, loading } = fetchInitialData(
    location.pathname,
    'GET',
    null,
  );

  if (data && data.error === 'could not find resource') {
    return <Navigate to={'/error'} />;
  }

  return (
    <>
      {loading && <p>loading post...</p>}
      {error && <p>network error - try again </p>}
      {data && (
        <>
          <h2 className="text-xl text-white font-bold">{data.post.title}</h2>
          <p className="text-sm text-white italic">
            {data.post.author.fullName}
          </p>
          <div className="p-2 my-4 text-olive bg-dutch rounded shadow">
            <p>{data.post.text}</p>
          </div>
        </>
      )}
    </>
  );
}
