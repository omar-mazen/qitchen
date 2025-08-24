import { useCallback, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import Input from "@components/Input";

export type TableFormInputBase = {
  number: number;
  capacity: number;
};
type CategoryFormInputAdd = TableFormInputBase & {
  type: "add";
};
type CategoryFormInputEdit = TableFormInputBase & {
  type: "edit";
  tableId: string;
};

type CategoryFormInput = CategoryFormInputAdd | CategoryFormInputEdit;

type ProductFormProps = {
  table: CategoryFormInput;
  isLoading: boolean;
  onSubmit: (values: CategoryFormInput) => Promise<unknown>;
  onCloseModal?: () => void;
  children?: React.ReactNode;
};
const TableForm = ({
  table,
  isLoading,
  onSubmit,
  onCloseModal,
  children,
}: ProductFormProps) => {
  const [number, setNumber] = useState<number>(table.number);
  const [capacity, setCapacity] = useState<number>(table.capacity);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await toast.promise(
        () =>
          onSubmit({
            type: table.type,
            tableId: table.type == "edit" ? table.tableId! : "",
            number,
            capacity,
          }),
        {
          pending: `${table.type == "edit" ? "Updating" : "Adding"} table...`,
          success: `Table ${table.type == "add" ? "updating" : "adding"}`,
          error: `Failed to ${table.type == "edit" ? "update" : "add"} table`,
        }
      );
      onCloseModal?.();
    },
    [capacity, onCloseModal, onSubmit, table, number]
  );
  return (
    <>
      {children}
      <form
        className="space-y-10"
        onSubmit={async (e) => {
          await handleSubmit(e);
          onCloseModal?.();
        }}
      >
        <Input
          placeholder="number"
          value={number.toString()}
          type="number"
          disabled={isLoading}
          setValue={(value) => setNumber(Number(value))}
          rest={{
            required: true,
            min: 1,
          }}
        />
        <Input
          placeholder="capacity"
          multiple={true}
          disabled={isLoading}
          value={capacity.toString()}
          setValue={(value) => setCapacity(Number(value))}
          rest={{
            required: true,
            min: 1,
          }}
        />
        <div className="flex items-center gap-5 ">
          <Button
            type="primary"
            className="ml-auto"
            disabled={isLoading || !number || !capacity}
          >
            Submit {isLoading && <DotsLoader />}
          </Button>
        </div>
      </form>
    </>
  );
};

export default TableForm;
