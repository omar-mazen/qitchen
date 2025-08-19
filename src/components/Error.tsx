import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

import Icons from "./Icons";
import Button from "./Button";

import { ROUTES } from "@constants/routes";

import texture from "@images/texture.png";
type RouterErrorProps = object;

type CustomErrorProps = {
  statusCode?: string;
  message: string;
  navigateTo: string;
};

// Union type: either empty OR full custom props
type ErrorProps = RouterErrorProps | CustomErrorProps;
const Error = (props: ErrorProps) => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.log("error");
  if (isRouteErrorResponse(error))
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-background backdrop-brightness-150 flex flex-col items-center justify-center space-y-5"
        style={{ background: `url(${texture})` }}
      >
        {/* <Icons.Warning className="w-48 h-48 " /> */}
        <p className="text-9xl">{error?.status}</p>
        <p className="max-w-[400px] text-center text-xlarge">
          {error?.statusText}
        </p>
        <p>{error?.data}</p>
        <Button
          type="icon"
          icon={<Icons.Arrow />}
          onClick={() => navigate(ROUTES.HOME, { replace: true })}
        >
          Go to home
        </Button>
      </div>
    );
  if ("message" in props)
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-background backdrop-brightness-150 flex flex-col items-center justify-center space-y-5"
        style={{ background: `url(${texture})` }}
      >
        <Icons.Warning className="w-48 h-48 " />
        {props.statusCode && (
          <p className="text-heading-h1">{props.statusCode}</p>
        )}
        <p className="max-w-[400px] text-center text-xlarge">{props.message}</p>
        <Button
          type="icon"
          icon={<Icons.Arrow />}
          onClick={() => navigate(props.navigateTo, { replace: true })}
        >
          Go to home
        </Button>
      </div>
    );
};

export default Error;
