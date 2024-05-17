import { DateTime } from 'luxon';

export default function CommentAny({ comment, user, onDelete, onEdit }) {
  return (
    <li
      key={comment._id}
      className="p-2 bg-olive rounded shadow text-white flex flex-col gap-1"
    >
      <p>{comment.text}</p>
      <p className="text-sm italic text-gray-300 text-end">
        {comment.author.fullName} -{' '}
        {DateTime.fromISO(comment.createdAt).toLocaleString(DateTime.DATE_MED)}
      </p>
      {user && comment.author._id === user._id && (
        <div className="flex gap-2 justify-end">
          <button
            className="rounded px-2 text-white bg-true"
            data-id={comment._id}
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="rounded px-2 text-white bg-flame"
            data-id={comment._id}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
