import Error from "@/components/Error";
import SelectOption from "@/components/SelectOptions";
import SmallSpinner from "@/components/SmallSpinner";
import Table from "@/components/Table";
import { ReservationsStatus } from "@/constants/reservations";
import {
  getAllReservations,
  updateReservation as updateReservationAPI,
} from "@/services/reservations";
import { toBackendDateFormat, toFrontendDateLabel } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

const today = new Date();
const dates = [
  new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  today,
  ...Array.from(
    { length: 5 },
    (_, i) => new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
  ),
].map((d) => ({
  backend: toBackendDateFormat(new Date(d)),
  frontend: toFrontendDateLabel(new Date(d)),
}));
const Reservations = () => {
  const queryClient = useQueryClient();
  const [serchParams, setSearchParams] = useSearchParams();
  const dateParam = serchParams.get("date") || dates[1].frontend;
  const { data, isLoading } = useQuery({
    queryKey: ["reservations", dateParam],
    queryFn: () =>
      getAllReservations({
        date: dates.filter((date) => date.frontend == dateParam)[0].backend,
      }),
  });
  const sortedReservations = data?.reservations?.sort(
    (a, b) =>
      a.table?.number - b.table?.number ||
      a.reservationDate.localeCompare(b.reservationDate)
  );
  const { mutateAsync: updateReservation, isPending: isUpdating } = useMutation(
    {
      mutationKey: ["reservations"],
      mutationFn: updateReservationAPI,
      onSuccess: () =>
        queryClient.refetchQueries({
          queryKey: ["reservations"],
          exact: false,
        }),
    }
  );
  if (data?.error) return <Error message={data.error} />;
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-10 gap-10 flex-wrap">
        <h1 className="text-heading-h2">Reservations</h1>
        <ul className="rounded-2xl flex items-center lg:w-fit flex-wrap">
          {dates.map((date, i) => (
            <li
              key={date.frontend}
              className={clsx(
                "p-4 cursor-pointer !h-full first-of-type:rounded-l-2xl last-of-type:rounded-r-2xl border border-border text-large select-auto text-nowrap",
                date.frontend == dateParam && "bg-primary text-background"
              )}
              onClick={() => {
                serchParams.set("date", date.frontend);
                setSearchParams(serchParams);
              }}
            >
              {i == 0 ? "yesterday" : i == 1 ? "today" : date.frontend}
            </li>
          ))}
        </ul>
      </div>
      <section className="h-auto">
        {!isLoading && !data?.reservations?.length && (
          <div className="flex items-center justify-center absolute top-1/2 left-1/2 w-full -translate-x-1/2 px-4">
            <p className="text-heading-h2 text-red-500">
              There Are no reservations for this day.
            </p>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center absolute top-1/2 left-1/2">
            <SmallSpinner color="white" />
          </div>
        ) : (
          !!data?.reservations?.length && (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell head={true}>table</Table.Cell>
                  <Table.Cell head={true}>capacity</Table.Cell>
                  <Table.Cell head={true}>table availability</Table.Cell>
                  <Table.Cell head={true}>Reservation status</Table.Cell>
                  <Table.Cell head={true}>Reservation time</Table.Cell>
                  <Table.Cell head={true}>client</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {sortedReservations?.map((res) => (
                  <Table.Row disabled={isLoading || isUpdating}>
                    <Table.Cell>{res.table?.number}</Table.Cell>
                    <Table.Cell>{res.table?.capacity}</Table.Cell>
                    <Table.Cell>
                      {res.table?.isActive ? "avilable" : "not avilable"}
                    </Table.Cell>
                    <Table.Cell>
                      <SelectOption
                        label={res.status}
                        selectedValue={res.status}
                        setSelectedValue={async (status) =>
                          await toast.promise(
                            () =>
                              updateReservation({
                                reservationId: res._id,
                                status,
                              }),
                            {
                              pending: "Updating status ...",
                              success: "Status Uupdated",
                              error: "Failed to update status",
                            }
                          )
                        }
                        search={false}
                        options={ReservationsStatus}
                        full={true}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(res.reservationDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hourCycle: "h23",
                          timeZone: "UTC",
                        }
                      )}
                      -
                      {new Date(
                        new Date(res.reservationDate).getTime() +
                          2 * 60 * 60 * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23",
                        timeZone: "UTC",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      {res.user.name} <br /> {res.user?.phoneNumber}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )
        )}
      </section>
    </div>
  );
};

export default Reservations;
