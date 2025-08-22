import { useCallback, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import Input from "@components/Input";

import { regex } from "@constants/regex";

import { handleInput } from "@/utils";

export type CategorytFormInputBase = {
  name: string;
  description: string;
};
type CategoryFormInputAdd = CategorytFormInputBase & {
  type: "add";
};
type CategoryFormInputEdit = CategorytFormInputBase & {
  type: "edit";
  categoryId: string;
};

type CategoryFormInput = CategoryFormInputAdd | CategoryFormInputEdit;

type ProductFormProps = {
  category: CategoryFormInput;
  isLoading: boolean;
  onSubmit: (values: CategoryFormInput) => Promise<unknown>; // <-- ✅ generic
  onCloseModal?: () => void;
  children?: React.ReactNode;
};
const CategoryForm = ({
  category,
  isLoading,
  onSubmit,
  onCloseModal,
  children,
}: ProductFormProps) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [error, setError] = useState({
    name: "",
    description: "",
    price: "",
    ingredients: "",
  });
  const errMessage = useMemo(
    () => Object.values(error).filter((err) => !!err)[0],
    [error]
  );
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (errMessage) return;
      await toast.promise(
        () =>
          onSubmit({
            type: category.type,
            categoryId: category.type == "edit" ? category.categoryId! : "",
            name,
            description,
          }),
        {
          pending: `${category.type == "edit" ? "Updating" : "Adding"} category...`,
          success: `Category ${category.type == "add" ? "updating" : "adding"}`,
          error: `Failed to ${category.type == "edit" ? "update" : "add"} category`,
        }
      );
      onCloseModal?.();
    },
    [name, description, errMessage, onCloseModal, onSubmit, category]
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
          placeholder="name"
          value={name}
          disabled={isLoading}
          setValue={(value) =>
            handleInput({
              key: "name",
              value,
              setValue: setName,
              regex: regex.title,
              setError,
            })
          }
        />
        <Input
          placeholder="description"
          multiple={true}
          disabled={isLoading}
          value={description}
          setValue={(value) =>
            handleInput({
              key: "description",
              value,
              setValue: setDescription,
              regex: regex.description,
              setError,
            })
          }
        />
        <div className="flex items-center gap-5 ">
          <p className=" text-red-600">{errMessage}</p>
          <Button
            type="primary"
            className="ml-auto"
            disabled={!!errMessage || isLoading}
          >
            Submit {isLoading && <DotsLoader />}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CategoryForm;
