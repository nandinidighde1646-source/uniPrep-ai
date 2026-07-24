interface SettingsFormProps {
  emailNotifications: boolean;
  setEmailNotifications: React.Dispatch<React.SetStateAction<boolean>>;

  aiSuggestions: boolean;
  setAiSuggestions: React.Dispatch<React.SetStateAction<boolean>>;

  onSave: () => void;
}

function SettingsForm({
  emailNotifications,
  setEmailNotifications,
  aiSuggestions,
  setAiSuggestions,
  onSave,
}: SettingsFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-6">
        {/* Email Notifications */}
        <label className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">
              Email Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Receive updates about your account and new study material.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-5 w-5 cursor-pointer"
          />
        </label>

        {/* AI Suggestions */}
        <label className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">
              AI Study Suggestions
            </h3>
            <p className="text-sm text-gray-500">
              Get personalized AI recommendations while studying.
            </p>
          </div>

          <input
            type="checkbox"
            checked={aiSuggestions}
            onChange={(e) => setAiSuggestions(e.target.checked)}
            className="h-5 w-5 cursor-pointer"
          />
        </label>

        <button
          onClick={onSave}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsForm;