import { fetchInitialData } from '../utils/fetchUtils';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { DateTime } from 'luxon';

export default function AllPosts() {
  const { data, error, loading } = fetchInitialData('/posts', 'GET', null);

  const { handleLogout } = useOutletContext();
  if (data && data.error && data.error.name === 'TokenExpiredError') {
    // this is such bad practice - need to find a better way to logout after expired jwt
    return handleLogout();
  }

  if (data && data.error && data.error.name === 'JsonWebTokenError') {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="flex-initial w-fullscreen flex flex-col gap-2">
      <h2 className="text-xl text-white font-bold">All Posts</h2>
      {loading && <p>loading posts...</p>}
      {error && <p>network error - try again </p>}
      {data && (
        <ul className="flex flex-col gap-4">
          <li className="bg-true p-4 text-white font-bold rounded shadow">
            <Link to="/posts/create" className="hover:cursor-pointer">
              <p className="text-center">Create New Post</p>
            </Link>
          </li>
          {data.allPosts.map((post) => {
            return (
              <li
                key={post._id}
                className="bg-dutch p-4 text-olive rounded shadow border-l-4 border-l-true hover:border-l-flame"
              >
                <Link to={`/posts/${post._id}`}>
                  <p className="font-bold">{post.title}</p>
                  <p className="text-sm italic">
                    {DateTime.fromISO(post.createdAt).toLocaleString(
                      DateTime.DATE_MED,
                    )}
                  </p>
                  <hr className="border-olive mb-1 mt-1" />
                  <p>{post.overview}</p>
                  {post.isPublished === true ? (
                    <p className="text-end text-true italic text-sm">
                      published
                    </p>
                  ) : (
                    <p className="text-end text-flame italic text-sm">
                      unpublished
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
