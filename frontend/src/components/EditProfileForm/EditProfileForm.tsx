import { useState } from "react";
import type { UserProfile } from "../../types/user";

type EditProfileFormProps = {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onCancel: () => void;
};

function EditProfileForm({
  user,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">
        Edit Profile
      </h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full mb-4 px-4 py-3 border rounded-lg"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full mb-4 px-4 py-3 border rounded-lg"
      />

      <input
        type="text"
        name="college"
        value={formData.college}
        onChange={handleChange}
        placeholder="College"
        className="w-full mb-6 px-4 py-3 border rounded-lg"
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;