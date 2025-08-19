import UserData from "./UserData";
import ChangePassword from "./ChangePassword";
import Addresses from "./Addresses";

import Texture from "@images/texture.png";
const Profile = () => {
  return (
    <div
      className="lg:pt-48 overflow-y-auto h-full lg:px-14 w-full backdrop-brightness-150 pb-10 px-8"
      style={{ backgroundImage: `url(${Texture})` }}
    >
      <div className="container mx-auto space-y-20">
        <UserData />
        <ChangePassword />
        <Addresses />
      </div>
    </div>
  );
};

export default Profile;
