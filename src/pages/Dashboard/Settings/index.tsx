import Icons from "@/components/Icons";
import SectionHeader from "@/components/SectionHeader";
import SmallSpinner from "@/components/SmallSpinner";
import Toggler from "@/components/Toggler";
import {
  getPaymentMethods,
  updatePaymentMethods,
} from "@/services/payment-methods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const Settings = () => {
  const queryClient = useQueryClient();
  const { data: paymentMethods, isLoading: paymentLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });
  const { mutateAsync: toggleActive, isPending: isActiveToggling } =
    useMutation({
      mutationKey: ["payment-methods"],
      mutationFn: ({
        id,
        isActive,
        description,
        displayName,
      }: {
        id: string;
        isActive?: boolean;
        description?: string;
        displayName?: string;
      }) =>
        updatePaymentMethods({
          id,
          isActive,
          description,
          displayName,
        }),
      onSuccess: () =>
        queryClient.refetchQueries({
          exact: false,
          queryKey: ["payment-methods"],
        }),
    });

  return (
    <div className="space-y-10">
      <section className="space-y-10">
        <SectionHeader size="small">Payment settings</SectionHeader>
        <div>
          {paymentLoading ? (
            <div className="min-h-96 flex items-center justify-center ">
              <SmallSpinner className="mx-auto" />
            </div>
          ) : paymentMethods?.methods.length >= 0 ? (
            <ul className="flex items-stretch justify-start gap-10">
              {paymentMethods?.methods.map((method) => (
                <li className=" border border-border rounded-2xl w-[300px] font-normal flex flex-col">
                  <div className="h-36 max-h-36 min-h-36 p-2 border-border border-b">
                    {method.name == "COD" ? (
                      <Icons.CashOnDelivery className=" w-auto h-full mx-auto" />
                    ) : (
                      <Icons.Stripe className=" w-auto h-full mx-auto" />
                    )}
                  </div>
                  <div className="py-4 px-3 flex flex-col flex-1">
                    <h2 className="font-semibold text-xlarge text-center">
                      {method.displayName} ({method.name})
                    </h2>
                    <p
                      title={method.description}
                      className=" text-large text-primary-muted line-clamp-3 my-2"
                    >
                      {method.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto w-full ">
                      <span className=" text-primary-muted text-medium">
                        Availability
                      </span>
                      <Toggler
                        checked={method.isActive}
                        disabled={isActiveToggling}
                        toggle={async () =>
                          await toast.promise(
                            toggleActive({
                              id: method._id,
                              isActive: !method.isActive,
                            }),
                            {
                              pending: method.isActive
                                ? "Deactivating payment method..."
                                : "Activating payment method...",

                              success: method.isActive
                                ? "Payment method deactivated successfully"
                                : "Payment method activated successfully",

                              error: "Failed to update payment method",
                            },
                          )
                        }
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="min-h-96 flex items-center justify-center">
              <p className="text-red-500 font-normal text-4xl uppercase my-3 min-h-8">
                no payment methods added yet
              </p>
            </div>
          )}
        </div>
      </section>
      {/* <section className="space-y-10">
        <SectionHeader size="small">Order settings (order type)</SectionHeader>
        <ul>
          <li>Dine-in</li>
          <li>Online</li>
          <li>Takeaway</li>
        </ul>
      </section> */}
    </div>
  );
};

export default Settings;
