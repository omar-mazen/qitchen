import Logo from "@icons/logo.svg?react";
const Loader = () => {
  return (
    <div className="fixed bg-background top-0 left-0 w-screen h-screen z-50">
      <Logo className="logo-stroke w-[90%] sm:w-[70%] md:w-[50%] h-[90%] sm:h-[70%] md:h-[50%]" />
      <Logo className="logo-loader w-[90%] sm:w-[70%] md:w-[50%] h-[90%] sm:h-[70%] md:h-[50%]" />
    </div>
  );
};

export default Loader;
