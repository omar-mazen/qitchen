import { useCallback, useEffect, useMemo, useState } from "react";

import Input from "@components/Input";
import SectionHeader from "@components/SectionHeader";
import PageLayout from "@components/PageLayout";

import { useMutation } from "@tanstack/react-query";
import {
  createReservation as createReservationAPI,
  getSlotsForTables,
} from "@/services/reservations";
import Button from "@/components/Button";
import DotsLoader from "@/components/DotsLoader";
import clsx from "clsx";
import SmallSpinner from "@/components/SmallSpinner";
import { ReservationBanner } from "@/constants/images";

const today = new Date().toISOString().split("T")[0];
const Reservation = () => {
  const [date, setDate] = useState(today);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const {
    data,
    mutateAsync: getSlots,
    isPending: isLoading,
  } = useMutation({
    mutationKey: ["tables-slots", date],
    mutationFn: getSlotsForTables,
  });
  const { mutateAsync: createReservation, isPending: isAdding } = useMutation({
    mutationKey: ["reservations"],
    mutationFn: createReservationAPI,
  });
  const tables = useMemo(
    () =>
      data?.tables
        ?.filter((table) => table.availableSlots?.length >= 4)
        ?.reduce((prev, curr) => [...prev, `table ${curr.tableNumber}`], []),
    [data]
  );
  const slots = useMemo(
    () =>
      data?.tables
        ?.filter(
          (table) =>
            table.tableNumber ===
            Number((selectedTable as string)?.split(" ")[1])
        )?.[0]
        ?.availableSlots.map((date) =>
          new Date(date).toLocaleString("en-us", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
            hourCycle: "h23",
          })
        ),
    [(data, selectedTable)]
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!selectedSlot || !selectedTable || !date) return;
      createReservation({
        date,
        slot: selectedSlot,
        tableNumber: +selectedTable.split(" ")[1],
      });
    },
    [slots, tables, tables]
  );
  useEffect(() => {
    getSlots({ date });
  }, [date]);
  useEffect(() => {
    if (!!data?.tables) setSelectedTable(`table ${data.tables[0].tableNumber}`);
  }, [data]);
  useEffect(() => {
    if (!!slots?.length) setSelectedSlot(slots?.[0]);
  }, [selectedTable]);

  return (
    <PageLayout
      banner={ReservationBanner}
      caption={
        <>
          Book <br />a table
        </>
      }
    >
      {data && !tables ? (
        <div className="h-full flex items-center justify-center">
          <p className="">
            Sorry, no tables are available right now. Please check back later.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-y-scroll h-full px-10">
          <SectionHeader className="pt-20">
            <h1 className=" text-heading-h4 sm:text-heading-h2">reservation</h1>
          </SectionHeader>
          <p className=" text-medium text-center mx-auto mt-6 sm:text-large font-thin font-normal max-w-[400px]">
            Secure your spot at Qitchen, where exceptional sushi and a
            remarkable dining experience await.
          </p>
          <form className="mt-20 w-full" onSubmit={onSubmit}>
            <div className="my-10">
              <p className="text-nowrap mb-2">select date</p>
              <Input
                placeholder="day"
                type="date"
                value={date}
                setValue={(value) => {
                  if (today.localeCompare(value) < 0) setDate(value);
                  else setDate(today);
                }}
                rest={{
                  defaultValue: today,
                  min: today,
                  max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                }}
              />
              {/* <Input placeholder="year" /> */}
            </div>
            {isLoading ? (
              <SmallSpinner color="white" className="mx-auto" />
            ) : (
              <>
                <div className="border border-border rounded-2xl grid grid-cols-[30%_70%] overflow-hidden">
                  <ul className=" border-r border-border">
                    {tables?.map((table) => (
                      <li
                        onClick={() => setSelectedTable(table)}
                        className={clsx(
                          " px-4 py-2 border-border not-last:border-b cursor-pointer hover:bg-primary/20 transition-all",
                          selectedTable == table && "bg-primary/20"
                        )}
                      >
                        {table}
                      </li>
                    ))}
                  </ul>
                  {slots ? (
                    <ul>
                      <li className="py-2 px-4 border-border border-b">
                        Available slots on {date}:
                      </li>
                      {slots?.map((slot) => (
                        <li
                          onClick={() => setSelectedSlot(slot)}
                          className={clsx(
                            "px-4 py-2 cursor-pointer hover:bg-primary/20 transition-all border-border not-last:border-b",
                            selectedSlot == slot && "bg-primary/20"
                          )}
                        >
                          <span className="inline-block w-16">{slot}</span>-
                          <span className="inline-block w-16 ml-1">
                            {String(
                              (Number(slot.split(":")[0]) + 2) % 24
                            ).padStart(2, "0")}
                            :00
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className=" text-large text-center my-auto">
                      There are no available slots for {selectedTable} on {date}
                    </p>
                  )}
                </div>
                <Button
                  type="primary"
                  className="mt-10 ml-auto w-72"
                  disabled={
                    isAdding || !selectedSlot || !selectedTable || !date
                  }
                >
                  submit {isAdding && <DotsLoader />}
                </Button>
              </>
            )}
          </form>
        </div>
      )}
    </PageLayout>
  );
};

export default Reservation;
/*
          <div className="flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-5 ">
              <p className=" text-large">select table</p>
              <SelectOption
                label="select table"
                options={tables}
                selectedValue={selectedTable}
                setSelectedValue={(value) => setSelectedTable(value)}
                search={false}
                disable={!selectedTable || isLoading}
              />
            </div>
            <div className="flex items-center gap-5">
              <p className="text-large">select time</p>
              <SelectOption
                label="select slot"
                options={slots}
                selectedValue={selectedSlot}
                setSelectedValue={(value) => setSelectedSlot(value)}
                search={false}
                disable={!selectedSlot || isLoading}
              />
            </div>
          </div>
*/
