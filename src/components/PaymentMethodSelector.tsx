import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Tabs from "@/components/tabs";
import SmallSpinner from "@components/SmallSpinner";
import { getActivePaymentMethods } from "@/services/payment-methods";

interface PaymentMethodSelectorProps {
  control: Control<any>;
  name?: string;
  errors?: FieldErrors;
  required?: boolean;
  label?: string;
}

const PaymentMethodSelector = ({
  control,
  name = "paymentMethod",
  errors,
  required = true,
  label = "Payment Method",
}: PaymentMethodSelectorProps) => {
  const { data: activePaymentMethods, isLoading: paymentMethodLoading } =
    useQuery({
      queryKey: ["active-payment-methods"],
      queryFn: getActivePaymentMethods,
    });

  return (
    <section className="space-y-3">
      <h2 title={required ? "required" : ""}>
        {label} {required && <span className="text-red-300">*</span>}
      </h2>
      {paymentMethodLoading ? (
        <SmallSpinner color="white" className="my-5 mx-auto" />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Tabs
              values={activePaymentMethods?.methods.map((m) => m.name) || []}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      )}
      {errors?.[name] && (
        <p className="text-red-500 text-large">
          {errors[name]?.message as string}
        </p>
      )}
    </section>
  );
};

export default PaymentMethodSelector;
