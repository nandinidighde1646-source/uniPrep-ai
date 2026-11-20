import type { UserProfile } from "../../types/user";
import { UserRound } from "lucide-react";

type ProfileCardProps = {
  user: UserProfile;
  onEdit: () => void;
};

function ProfileCard({
  user,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

      <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
        <UserRound className="w-16 h-16 text-gray-500" />
      </div>

      <h2 className="text-2xl font-bold text-center mt-4">
        {user.name}
      </h2>

      <p className="text-gray-600 text-center">
        {user.email}
      </p>

      <p className="text-center mt-2">
        {user.college}
      </p>

      <button
        onClick={onEdit}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>

    </div>
  );
}

export default ProfileCard;