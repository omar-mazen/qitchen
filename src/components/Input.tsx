interface IProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const Input = ({ placeholder, value, setValue }: IProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={value}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className=" w-full border border-border bg-background-muted py-4 px-6 rounded-xl focus:outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5"
    />
  );
};

export default Input;
