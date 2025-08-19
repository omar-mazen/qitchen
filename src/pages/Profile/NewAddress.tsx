import type React from "react";

import Input from "@components/Input";
import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import type { TNewAddress } from "./Addresses";

interface IProps {
  isLoading: boolean;
  disabled: boolean;
  newAddress: TNewAddress;
  setNewAddress: React.Dispatch<React.SetStateAction<TNewAddress>>;
  onSubmit: () => void;
  onCancel: () => void;
}
const NewAddress = ({
  newAddress,
  setNewAddress,
  onSubmit,
  disabled,
  isLoading,
  onCancel,
}: IProps) => {
  return (
    <>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input
          placeholder="governorate"
          value={newAddress.governorate}
          setValue={(value) =>
            setNewAddress((state) => ({ ...state, governorate: value }))
          }
        />
        <Input
          placeholder="city"
          value={newAddress.city}
          setValue={(value) =>
            setNewAddress((state) => ({ ...state, city: value }))
          }
        />
        <Input
          placeholder="street"
          value={newAddress.street}
          setValue={(value) =>
            setNewAddress((state) => ({ ...state, street: value }))
          }
        />
        <Input
          placeholder="building number"
          value={newAddress.buildingNumber}
          setValue={(value) =>
            setNewAddress((state) => ({
              ...state,
              buildingNumber: value,
            }))
          }
        />
        <Input
          placeholder="flat number"
          value={newAddress.flatNumber}
          setValue={(value) =>
            setNewAddress((state) => ({ ...state, flatNumber: value }))
          }
        />
        <div className="flex items-center justify-end gap-5">
          <Button
            type="primary"
            className="inline-block"
            disabled={disabled}
            onClick={onSubmit}
          >
            Submit {isLoading ? <DotsLoader /> : ""}
          </Button>
          <Button
            disabled={isLoading}
            type="primary"
            className="inline-block"
            onClick={onCancel}
          >
            cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewAddress;
