import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostCreate() {
  const navigate = useNavigate();

  // inputs
  const [titleInput, setTitleInput] = useState('');
  const [overviewInput, setOverviewInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isPublishedInput, setIsPublishedInput] = useState(false);

  // loading and error state
  const [formLoading, setFormLoading] = useState(false);
  const [postError, setPostError] = useState('');

  function handleTitleChange(e) {
    setTitleInput(e.target.value);
  }

  function handleOverviewChange(e) {
    setOverviewInput(e.target.value);
  }

  function handleTextChange(e) {
    setTextInput(e.target.value);
  }

  function handleIsPublishedChange() {
    setIsPublishedInput(!isPublishedInput);
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setPostError('');

    async function sendPost() {
      try {
        const response = await fetch(
          `https://blog-api-maximilian.fly.dev/api/private/posts/create`,
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('private-jwt')}`,
            },
            body: JSON.stringify({
              title: titleInput,
              overview: overviewInput,
              text: textInput,
              isPublished: isPublishedInput,
            }),
          },
        );

        const data = await response.json();

        if (data.error) {
          setFormLoading(false);
          setPostError(data.error);
          return;
        }

        setFormLoading(false);
        setPostError('');
        navigate(`/posts/${data.newPost._id}`);
      } catch (err) {
        setFormLoading(false);
        setPostError('something went wrong');
      }
    }

    sendPost();
  }

  return (
    <div className="flex-initial w-96 flex flex-col gap-2">
      <h2 className="text-xl text-white font-bold">Create New Post</h2>
      <form
        onSubmit={handlePostSubmit}
        className="rounded bg-dutch shadow p-4 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="italic text-olive">
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="p-2 rounded shadow-inner"
            value={titleInput}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="overview" className="italic text-olive">
            Overview:
          </label>
          <textarea
            id="overview"
            className="p-2 rounded shadow-inner h-20"
            value={overviewInput}
            onChange={handleOverviewChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="text" className="italic text-olive">
            Text:
          </label>
          <textarea
            id="text"
            className="p-2 rounded shadow-inner h-40"
            value={textInput}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="isPublished" className="italic text-olive">
            Published:
          </label>
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublishedInput}
            onChange={handleIsPublishedChange}
            className="hover:cursor-pointer w-8 border-olive"
          />
        </div>
        <input
          type="submit"
          value="Create Post"
          className="rounded p-4 font-bold bg-true text-white hover:cursor-pointer mt-2"
        />
      </form>
      {formLoading && (
        <p className="text-dutch font-bold italic">
          checking action with server..
        </p>
      )}
      {postError !== '' && (
        <p className="text-flame font-bold italic">{postError}</p>
      )}
    </div>
  );
}
