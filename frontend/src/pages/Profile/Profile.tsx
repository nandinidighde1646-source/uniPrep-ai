import { useState } from "react";

import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";

import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../types/user";

function Profile() {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<UserProfile>({
    name: authUser?.name || "",
    email: authUser?.email || "",
    college: "RGPV",
    avatar: " ",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {isEditing ? (
        <EditProfileForm
          user={user}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileCard
          user={user}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}

export default Profile;