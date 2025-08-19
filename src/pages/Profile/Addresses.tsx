import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@components/SectionHeader";
import Address from "@components/Address";
import Button from "@components/Button";
import SmallSpinner from "@components/SmallSpinner";
import ContextMenu from "@components/ContextMenu";
import NewAddress from "./NewAddress";

import {
  getUserAdresses,
  addAddress as addAddressAPI,
  removeAddress as removeAddressAPI,
} from "@services/address";

export type TNewAddress = {
  governorate: string;
  city: string;
  street: string;
  flatNumber: string | number;
  buildingNumber: string | number;
};
const initialAddress = {
  governorate: "",
  city: "",
  street: "",
  flatNumber: "",
  buildingNumber: "",
};
const Addresses = () => {
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<TNewAddress>(initialAddress);
  const [updateAddressId, setUpdateAddressId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const canUpdate = isNewAddress
    ? Object.values(newAddress).reduce((prev, curr) => prev && !!curr, true)
    : false;
  const { data: address, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAdresses,
  });
  const { mutateAsync: addddress, isPending: isAdding } = useMutation({
    mutationKey: ["addresses"],
    mutationFn: addAddressAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["addresses"] }),
  });
  const { mutate: removeAddress } = useMutation({
    mutationKey: ["addresses"],
    mutationFn: removeAddressAPI,
    onSuccess: () => queryClient.resetQueries({ queryKey: ["addresses"] }),
  });
  return (
    <div className="space-y-5 ">
      <SectionHeader>Addresses</SectionHeader>
      {isLoading ? (
        <SmallSpinner color="white" className="mx-auto" />
      ) : (
        <ul className=" space-y-5">
          <ContextMenu>
            {(address?.addresses || []).length <= 0 && (
              <p className="text-center my-20 text-heading-h3">
                You don’t have a saved address yet. Please add one.
              </p>
            )}
            {(address?.addresses || []).map((address) => (
              <Address
                address={address}
                options={true}
                type="editable"
                delete={removeAddress}
                edit={() => setUpdateAddressId(address._id)}
                update={address._id == updateAddressId}
                closeUpdate={() => setUpdateAddressId(null)}
              />
            ))}
            {isNewAddress && (
              <>
                <SectionHeader>Add new Address</SectionHeader>
                <NewAddress
                  isLoading={isAdding}
                  disabled={!canUpdate || isAdding}
                  setNewAddress={setNewAddress}
                  newAddress={newAddress}
                  onSubmit={async () => {
                    if (!canUpdate) return;
                    await addddress(newAddress);
                    setNewAddress(initialAddress);
                    setIsNewAddress(false);
                  }}
                  onCancel={() => setIsNewAddress(false)}
                />
              </>
            )}
            {!isNewAddress && (
              <Button
                type="primary"
                className="ml-auto"
                onClick={() => setIsNewAddress(true)}
              >
                + Add new address
              </Button>
            )}
          </ContextMenu>
        </ul>
      )}
    </div>
  );
};

export default Addresses;
