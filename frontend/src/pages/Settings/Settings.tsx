import { useState } from "react";
import SettingsForm from "../../components/SettingsForm/SettingsForm";
import toast from "react-hot-toast";

function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const handleSave = () => {
  console.log("Save button clicked");
  toast.success("Settings saved successfully!");
};

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>

      <p className="mb-8 text-gray-600">
        Manage your account preferences.
      </p>

      <SettingsForm
        emailNotifications={emailNotifications}
        setEmailNotifications={setEmailNotifications}
        aiSuggestions={aiSuggestions}
        setAiSuggestions={setAiSuggestions}
        onSave={handleSave}
      />
    </div>
  );
}

export default Settings;