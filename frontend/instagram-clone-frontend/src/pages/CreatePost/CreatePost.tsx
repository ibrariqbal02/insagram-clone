import { useState } from "react";
import { useCreatePost } from "../../hooks/usePost";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    const formData = new FormData();

    formData.append("caption", caption);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    console.log(createPost)
    createPost.mutate(formData, {
      onSuccess: () => {
        setCaption("");
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-6">
        Create Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <textarea
          placeholder="Write caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
        />

        <button
          type="submit"
          disabled={createPost.isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {createPost.isPending
            ? "Uploading..."
            : "Create Post"}
        </button>

      </form>
    </div>
  );
};

export default CreatePost;