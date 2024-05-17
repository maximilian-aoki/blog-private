import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './Root';
import Login from './Login';
import AllPosts from './AllPosts';
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
          element: <AllPosts />,
        },
        {
          path: 'log-in',
          element: <Login />,
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
