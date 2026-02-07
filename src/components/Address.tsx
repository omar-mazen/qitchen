import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import ContextMenu from "@components/ContextMenu";
import Icons from "@components/Icons";
import NewAddress from "../pages/User/Profile/NewAddress";

import type { TAddress } from "@cTypes/address";
import type { TNewAddress } from "../pages/User/Profile/Addresses";

import { updateAddress as updateAddressAPI } from "@services/address";

interface IBaseAddress {
  address: TAddress;
  variant?: "presentation" | "editable";
}

interface IPresentationAddress extends IBaseAddress {
  variant?: "presentation";
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

interface IEditableAddress extends IBaseAddress {
  variant: "editable";
  onDelete?: (addressId: string) => void;
  onEdit?: (addressId: string) => void;
}

type TAddressProps = IPresentationAddress | IEditableAddress;

const Address = (props: TAddressProps) => {
  const { address, variant = "presentation" } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState<TNewAddress>({
    governorate: address.governorate,
    city: address.city,
    street: address.street,
    buildingNumber: address.buildingNumber,
    flatNumber: address.flatNumber,
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useMutation({
    mutationKey: ["addresses"],
    mutationFn: updateAddressAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["addresses"] }),
  });

  const isSelected = variant === "presentation" && props.isSelected;
  const showActions = variant === "editable";

  // Edit mode
  if (isEditing && variant === "editable") {
    return (
      <NewAddress
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        onSubmit={async () => {
          await updateAddress({ addressId: address._id, ...newAddress });
          setIsEditing(false);
        }}
        isLoading={isUpdating}
        disabled={isUpdating}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => {
          if (variant === "presentation" && props.onSelect) {
            props.onSelect(address._id);
          }
        }}
        className={clsx(
          "group relative flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all",
          isSelected
            ? "border-transparent bg-primary text-background"
            : "border-border bg-background-muted text-primary hover:border-border/70",
          variant === "editable" && "cursor-default"
        )}
      >
        {/* Radio indicator (only for presentation mode) */}
        {variant === "presentation" && (
          <span
            className={clsx(
              "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
              isSelected ? "border-background" : "border-border/70"
            )}
          >
            {isSelected && (
              <span className="h-2.5 w-2.5 rounded-full bg-background" />
            )}
          </span>
        )}

        {/* Address content */}
        <div className="flex-1 space-y-1">
          <p
            className={clsx(
              "text-xlarge font-medium",
              isSelected ? "text-background" : "text-primary"
            )}
          >
            {address.governorate}, {address.city}
          </p>
          <p
            className={clsx(
              "text-large",
              isSelected ? "text-background-muted" : "text-primary-muted"
            )}
          >
            {address.street}
          </p>
          {(address.buildingNumber || address.flatNumber) && (
            <p
              className={clsx(
                "text-large",
                isSelected ? "text-background-muted" : "text-primary-muted"
              )}
            >
              {address.buildingNumber && `Building ${address.buildingNumber}`}
              {address.flatNumber && `, Flat ${address.flatNumber}`}
            </p>
          )}
        </div>
      </button>

      {/* Map icon decoration */}
      <Icons.MapIcon
        className={clsx(
          "absolute right-10 top-1/2 -translate-y-1/2 size-20 pointer-events-none",
          isSelected ? "text-background/20" : "text-primary/20"
        )}
      />

      {/* Context menu for editable variant */}
      {showActions && (
        <div className="absolute right-2 top-3">
          <ContextMenu.Toggle name={`address-${address._id}`}>
            <Icons.Dots className={clsx(isSelected && "text-background")} />
          </ContextMenu.Toggle>
        </div>
      )}
      <ContextMenu.List name={`address-${address._id}`}>
        <ContextMenu.Item
          icon={<Icons.Pencil />}
          onClick={() => {
            setIsEditing(true);
            if (props.onEdit) props.onEdit(address._id);
          }}
        >
          Edit
        </ContextMenu.Item>
        <ContextMenu.Item
          icon={<Icons.Trash />}
          onClick={() => {
            if (props.onDelete) props.onDelete(address._id);
          }}
        >
          Delete
        </ContextMenu.Item>
      </ContextMenu.List>
    </li>
  );
};

export default Address;
