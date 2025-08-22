import DotsLoader from "./DotsLoader";

const Loader = () => {
  return (
    <div className="fixed bg-background top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
      Loading <DotsLoader />
    </div>
  );
};

export default Loader;
