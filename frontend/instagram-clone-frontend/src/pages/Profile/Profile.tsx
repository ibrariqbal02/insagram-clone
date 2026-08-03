import { useParams } from "react-router-dom";
import { useUserProfile } from "../../hooks/useProfile";

const Profile = () => {
  const { userId } = useParams();

  const { data, isLoading } = useUserProfile(userId!);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-10">
      <img
        src={data.user.profilePicture}
        className="w-32 h-32 rounded-full"
        alt={data.user.name}
      />

      <h1>{data.user.name}</h1>

      <p>@{data.user.username}</p>

      <p>{data.user.bio}</p>
    </div>
  );
};

export default Profile;