import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './Root';
import Login from './Login';
import AllPosts from './AllPosts';
import PostCreate from './PostCreate';
import Post from './Post';
import Error from './Error';

export default function Router() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/posts',
          element: <AllPosts />,
        },
        {
          path: '/posts/create',
          element: <PostCreate />,
        },
        {
          path: 'posts/:postId',
          element: <Post />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
