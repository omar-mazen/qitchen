const Toggler = ({
  toggle,
  checked,
  disabled,
}: {
  toggle: () => void;
  checked: boolean;
  disabled?: boolean;
}) => {
  return (
    <label
      className="inline-flex items-center cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      aria-disabled={disabled}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          if (!disabled) toggle();
        }}
        className="sr-only peer"
      />
      <div
        aria-disabled={disabled}
        className="relative w-22 h-12 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute peer-checked:after:left-[10px] after:top-1/2 after:-translate-y-1/2 after:start-[6px] after:bg-white  after:rounded-full after:h-8 after:w-8 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600/50 dark:peer-checked:bg-blue-600/50"
      ></div>
    </label>
  );
};

export default Toggler;
