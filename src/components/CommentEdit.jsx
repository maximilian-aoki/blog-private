import { useState } from 'react';
import { DateTime } from 'luxon';

export default function CommentEdit({ comment, user, onSave, onCancel }) {
  const [editValue, setEditValue] = useState(comment.text);

  function handleEditCommentChange(e) {
    setEditValue(e.target.value);
  }

  function handleSubmitCallback(e) {
    e.preventDefault();
    onSave(editValue);
  }

  return (
    <li
      key={comment._id}
      className="p-2 bg-dutch rounded shadow text-white flex flex-col gap-2"
    >
      <form
        id="saveEditForm"
        onSubmit={handleSubmitCallback}
        className="self-stretch"
      >
        <textarea
          className="rounded shadow-inner resize-none p-2 text-olive w-full"
          value={editValue}
          onChange={handleEditCommentChange}
          required
        />
      </form>
      {user && comment.author._id === user._id && (
        <div className="flex gap-2 justify-end">
          <input
            type="submit"
            form="saveEditForm"
            value="Save"
            className="rounded px-2 text-white bg-true hover:cursor-pointer"
            data-id={comment._id}
          />
          <button
            className="rounded px-2 text-white bg-flame"
            data-id={comment._id}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </li>
  );
}
