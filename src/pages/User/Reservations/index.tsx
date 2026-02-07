import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router";
import clsx from "clsx";

import Error from "@components/Error";
import Button from "@components/Button";
import SmallSpinner from "@components/SmallSpinner";
import Icons from "@components/Icons";
import Pagination from "@components/Pagination";

import { getUserReservations } from "@services/reservations";

import texture from "@images/texture.png";
import { formatDate, formatShortDate, formatTime } from "@/utils";

const TReservationStatusColors: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-500",
  Confirmed: "bg-green-500/20 text-green-500",
  Cancelled: "bg-gray-500/20 text-gray-500",
};

const Reservations = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reservations", page],
    queryFn: () => getUserReservations({ page }),
  });

  // Prefetch next and previous pages
  useEffect(() => {
    if (!data?.pagination) return;
    const totalPages = Number(data.pagination.totalPages);
    const currentPage = Number(data.pagination.currentPage);

    // Prefetch NEXT page
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["reservations", currentPage + 1],
        queryFn: () => getUserReservations({ page: currentPage + 1 }),
      });
    }

    // Prefetch PREVIOUS page
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: ["reservations", currentPage - 1],
        queryFn: () => getUserReservations({ page: currentPage - 1 }),
      });
    }
  }, [data?.pagination, queryClient]);

  if (data?.error) return <Error message={data.error} />;

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <SmallSpinner />
      </div>
    );
  }

  const reservations = data?.reservations || [];

  if (reservations.length === 0) {
    return (
      <div className="h-full px-8 flex flex-col items-center justify-center">
        <p>You haven't made any reservations yet.</p>
        <Button type="outline">Book a table now</Button>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full lg:pt-48 p-10 lg:px-14 overflow-x-hidden overflow-y-auto backdrop-brightness-150"
      style={{ backgroundImage: `url(${texture})` }}
    >
      <div className="container mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-serif">My Reservations</h1>
          <p className="text-zinc-400">
            View your reservation history and manage upcoming bookings
          </p>
        </div>

        {/* Reservations List */}
        {reservations.map((reservation) => (
          <Link
            to={`/reservations/${reservation._id}`}
            key={reservation._id}
            className="block"
          >
            <div className="border border-border rounded-2xl flex flex-col bg-background-muted">
              <div className="flex gap-16 items-stretch p-4 pb-6">
                {/* Main Content */}
                <div className="flex-1">
                  <h3 className="text-large font-semibold mb-2">
                    Table #{reservation.table.number} • Capacity:{" "}
                    {reservation.table.capacity} guests
                  </h3>
                  <p className="text-primary text-medium mb-1">
                    {formatDate(reservation.reservationDate)}
                  </p>
                  <p className="text-zinc-400 text-medium">
                    {formatTime(reservation.reservationDate)}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col gap-5 items-end justify-between">
                  <span
                    className={clsx(
                      "rounded-full px-4 py-2 text-small font-semibold uppercase tracking-wider ml-auto text-nowrap",
                      TReservationStatusColors[reservation.status]
                    )}
                  >
                    {reservation.status}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center rounded-b-2xl bg-primary/20 p-4 text-medium">
                <div className="flex gap-2 items-center">
                  <Icons.Calendar className="size-8" />
                  <span className="text-small uppercase tracking-wider text-zinc-400">
                    Booked on: {formatShortDate(reservation.createdAt)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Icons.Table className="size-8" />
                  <span className="text-small uppercase tracking-wider text-zinc-400">
                    Table #{reservation.table.number} • Capacity:{" "}
                    {reservation.table.capacity}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Pagination */}
        <Pagination total={Number(data?.pagination?.totalPages)} />
      </div>
    </div>
  );
};

export default Reservations;
