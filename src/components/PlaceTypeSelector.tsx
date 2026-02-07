import { Controller, type Control, type FieldErrors } from "react-hook-form";
import Tabs from "@/components/tabs";
import { PlaceType } from "@/constants/order";
interface PlaceTypeSelectorProps {
  control: Control<any>;
  name?: string;
  errors?: FieldErrors;
  required?: boolean;
  label?: string;
}

const PlaceTypeSelector = ({
  control,
  name = "placeType",
  errors,
  required = true,
  label = "Place Type",
}: PlaceTypeSelectorProps) => {
  return (
    <section className="space-y-3">
      <h2
        className={required ? "required" : ""}
        title={required ? "required" : ""}
      >
        {label} {required && <span className="text-red-300">*</span>}
      </h2>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Tabs
            values={PlaceType}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-large">
          {errors[name]?.message as string}
        </p>
      )}
    </section>
  );
};

export default PlaceTypeSelector;
