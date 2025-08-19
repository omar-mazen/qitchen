import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import ContextMenu from "@components/ContextMenu";
import Icons from "@components/Icons";
import NewAddress from "../pages/Profile/NewAddress";

import type { TAddress } from "@cTypes/address";
import type { TNewAddress } from "../pages/Profile/Addresses";

import { updateAddress as updateAddressAPI } from "@services/address";

interface IBase {
  address: TAddress;
}
interface IPresentationlAddress extends IBase {
  type: "presentation";
  isSelected?: boolean;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
}
interface IEditableAddress extends IBase {
  type: "editable";
  options: boolean;
  delete: ({ addressId }: { addressId: string }) => void;
  edit: () => void;
  update: boolean;
  closeUpdate: () => void;
}
type TProps = IPresentationlAddress | IEditableAddress;
const Address = (props: TProps) => {
  const [newAddress, setNewAddress] = useState<TNewAddress>({
    governorate: props.address.governorate,
    city: props.address.city,
    street: props.address.street,
    buildingNumber: props.address.buildingNumber,
    flatNumber: props.address.flatNumber,
  });
  const queryClient = useQueryClient();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useMutation({
    mutationKey: ["addresses"],
    mutationFn: updateAddressAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["addresses"] }),
  });

  if (props.type == "editable" && props.update)
    return (
      <NewAddress
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        onSubmit={async () => {
          await updateAddress({ addressId: props.address._id, ...newAddress });
          props.closeUpdate();
        }}
        isLoading={isUpdating}
        disabled={isUpdating}
        onCancel={props.closeUpdate}
      />
    );
  return (
    <li
      className={clsx(
        "font-normal border border-border rounded-2xl py-4 px-6 cursor-pointer text-xlarge grid grid-cols-[1fr_auto] gap-5",
        props.type == "presentation" &&
          props.isSelected &&
          "bg-primary text-background",
      )}
      onClick={() => {
        if (props.type == "presentation")
          props.setSelectedAddressId(props.address._id);
      }}
    >
      {(props.type == "presentation" || props.type == "editable") && (
        <div>
          <p>
            {props.address.governorate}, {props.address.city},{" "}
            {props.address.street}
          </p>
          <p>
            <span>Building Number: </span>
            {props.address.buildingNumber}
          </p>
          <p>
            <span>Falt Number: </span>
            {props.address.flatNumber}
          </p>
        </div>
      )}
      {props.type == "editable" && props.options && (
        <div className="flex flex-col justify-between">
          <ContextMenu.Toggle name={props.address._id}>
            <Icons.Dots className="inline-block" />
          </ContextMenu.Toggle>
          <ContextMenu.List name={props.address._id}>
            <ContextMenu.Item icon={<Icons.Pencil />} onClick={props.edit}>
              edit
            </ContextMenu.Item>
            <ContextMenu.Item
              icon={<Icons.Trash />}
              onClick={async () =>
                props.delete({ addressId: props.address._id })
              }
            >
              delete
            </ContextMenu.Item>
          </ContextMenu.List>
        </div>
      )}
    </li>
  );
};

export default Address;
