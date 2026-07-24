type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;