import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useUpdatePost } from "../../hooks/usePost";

type Props = {
  post: any;
  onClose: () => void;
};

const EditPostModal = ({ post, onClose }: Props) => {
  const updatePost = useUpdatePost();

  const [caption, setCaption] = useState(post.caption || "");
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string | null>(post.images?.[0]?.url || null);

  useEffect(() => {
    if (!files || files.length === 0) return;

    const url = URL.createObjectURL(files[0]);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [files]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    updatePost.mutate(
      { postId: post._id, formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-72 object-cover rounded-lg border"
            />
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            rows={4}
            placeholder="Caption"
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePost.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {updatePost.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
