import { useRouteError } from 'react-router-dom';

export default function Error() {
  const error = useRouteError();
  console.log(error.error);
  return (
    <div className="p-6">
      <h1 className="text-xl text-white font-bold">{error.status} Error!</h1>
      <p className="text-white">{error.data}</p>
    </div>
  );
}
