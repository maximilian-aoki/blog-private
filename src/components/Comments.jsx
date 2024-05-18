import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { fetchInitialData } from '../utils/fetchUtils';

import CommentAny from './CommentAny';
import CommentEdit from './CommentEdit';

export default function Comments({ token, onRemount }) {
  // get initial load data based on url
  const location = useLocation();
  const { data, error, loading } = fetchInitialData(
    `${location.pathname}/comments`,
    'GET',
    null,
  );

  // get user data from outlet context
  const { user, handleLogout } = useOutletContext();

  // if jwt expired
  if (data && data.error && data.error.name === 'TokenExpiredError') {
    // this is such bad practice - need to find a better way to logout after expired jwt
    return <p>expired authentication session</p>;
  }

  // if user is unauthorized
  if (data && data.error && data.error.name === 'JsonWebTokenError') {
    return <p>failed authentication</p>;
  }

  // if url is malformed
  if (data && data.error === 'could not find resource') {
    return <p>invalid url</p>;
  }

  // interactive state
  const [formLoading, setFormLoading] = useState(false);

  const [addCommentText, setAddCommentText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [commentError, setCommentError] = useState('');

  function handleAddCommentChange(e) {
    setAddCommentText(e.target.value);
  }

  // handle create/update/delete comments

  function handleAddComment(e) {
    e.preventDefault();
    setFormLoading(true);
    setCommentError('');

    async function sendCommentPost() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/${location.pathname}/comments`,
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
            },
            body: JSON.stringify({ text: addCommentText }),
          },
        );

        const data = await response.json();

        // if jwt expired
        if (data && data.error && data.error.name === 'TokenExpiredError') {
          // this is such bad practice - need to find a better way to logout after expired jwt
          return handleLogout();
        }

        if (data.error) {
          if (
            data.error.name === 'JsonWebTokenError' ||
            data.error === 'error parsing Bearer Token'
          ) {
            setFormLoading(false);
            setCommentError('action not authorized');
            return;
          }
        }

        setFormLoading(false);
        setCommentError('');
        onRemount();
      } catch (err) {
        setFormLoading(false);
        setCommentError('something went wrong');
      }
    }

    sendCommentPost();
  }

  function handleEditComment(e) {
    setEditCommentId(e.target.getAttribute('data-id'));
  }

  function handleCancelEditComment() {
    setEditCommentId(null);
  }

  function handleSaveEditComment(newText) {
    setFormLoading(true);
    setCommentError('');

    async function sendCommentPut() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/${location.pathname}/comments/${editCommentId}/update`,
          {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
            },
            body: JSON.stringify({ text: newText }),
          },
        );

        const data = await response.json();

        // if jwt expired
        if (data && data.error && data.error.name === 'TokenExpiredError') {
          // this is such bad practice - need to find a better way to logout after expired jwt
          return handleLogout();
        }

        if (data.error) {
          if (
            data.error.name === 'JsonWebTokenError' ||
            data.error === 'error parsing Bearer Token'
          ) {
            setFormLoading(false);
            setCommentError('action not authorized');
            return;
          }
        }

        setFormLoading(false);
        setCommentError('');
        onRemount();
      } catch (err) {
        setFormLoading(false);
        setCommentError('something went wrong');
      }
    }

    sendCommentPut();
  }

  function handleDeleteComment(e) {
    e.preventDefault();
    setFormLoading(true);
    setCommentError('');

    async function sendCommentDelete() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/${location.pathname}/comments/${e.target.getAttribute('data-id')}/delete`,
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
          setCommentError(data.error);
        }

        setFormLoading(false);
        setCommentError('');
        onRemount();
      } catch (err) {
        setFormLoading(false);
        setCommentError('something went wrong');
      }
    }

    sendCommentDelete();
  }

  return (
    <>
      {loading && <p>loading comments...</p>}
      {error && <p>network error - try again </p>}
      {data && (
        <>
          <h2 className="text-lg mb-2 text-white font-bold">Comments</h2>
          <ul className="flex flex-col gap-2">
            {user && (
              <li className="p-2 bg-true rounded shadow text-white italic flex flex-col gap-2">
                <p>add admin comment, {user.name}:</p>
                <form
                  onSubmit={handleAddComment}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    className="rounded border-2 shadow-inner resize-none p-2 text-olive"
                    value={addCommentText}
                    onChange={handleAddCommentChange}
                    required
                  />
                  <input
                    type="submit"
                    value="Add Comment"
                    className="rounded bg-dutch py-2 text-olive font-bold hover:cursor-pointer"
                  />
                </form>
              </li>
            )}
            {formLoading && (
              <li className="text-dutch font-bold italic">
                checking action with server..
              </li>
            )}
            {commentError !== '' && (
              <li className="text-flame font-bold italic">{commentError}</li>
            )}
            {data.allComments.map((comment) => {
              if (comment._id === editCommentId) {
                return (
                  <CommentEdit
                    key={comment._id}
                    comment={comment}
                    user={user}
                    onSave={handleSaveEditComment}
                    onCancel={handleCancelEditComment}
                  />
                );
              }
              return (
                <CommentAny
                  key={comment._id}
                  comment={comment}
                  user={user}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
