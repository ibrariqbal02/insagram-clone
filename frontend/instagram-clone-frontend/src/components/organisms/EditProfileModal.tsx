import { useEffect, useState } from "react";
import { useUpdateProfile } from "../../hooks/useAuth";


type User = {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
};

type Props = {
  user: User;
  onClose: () => void;
};

const EditProfileModal = ({ user, onClose }: Props) => {
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.profilePicture);

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("userId", user._id);

    if (image) {
      formData.append("profilePicture", image);
    }

    updateProfile.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="flex justify-center">

            <img
              src={preview}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Bio"
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {updateProfile.isPending
                ? "Saving..."
                : "Save"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
