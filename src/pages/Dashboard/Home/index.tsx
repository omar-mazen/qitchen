import { useQuery } from "@tanstack/react-query";
import { getStats } from "@services/dashboard";
import Icons from "@/components/Icons";
import Receipt, { type ReceiptRef } from "@/components/Receipt";
import StatsCard from "./StatsCard";
import Loader from "@/components/Loader";
import GlassCard from "@/components/GlassCard";
import { OrderStatus } from "@/constants/order";
import React, { useState } from "react";
import ContextMenu from "@/components/ContextMenu";
import ActiveOrders from "./Orders";
import { getAllReservations } from "@/services/reservations";
import { isSameTime } from "@/utils";
import Table from "@/components/Table";
import SectionHeader from "@/components/SectionHeader";
import SmallSpinner from "@/components/SmallSpinner";

const timeSlots = ["16:00", "18:00", "20:00", "22:00"];

const Home = () => {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(() => {
    if (localStorage.getItem("order-status"))
      return JSON.parse(localStorage.getItem("order-status") || "");
    return ["Processing"];
  });
  const { isLoading, data } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
  const { data: reservations, isLoading: tableLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: () =>
      getAllReservations({
        date: new Date()
          .toLocaleDateString("sv-SE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replaceAll("/", "-"),
      }),
  });
  const groupedReservations = reservations?.reservations?.reduce(
    (acc, res) => {
      const tableNum = res.table.number;

      if (!acc[tableNum]) {
        acc[tableNum] = {};
      }

      // Find which slot this reservation belongs to
      const slot = timeSlots.find((slot) =>
        isSameTime({ dateString: res.reservationDate, timeString: slot })
      );

      if (slot) {
        acc[tableNum][slot] = res; // store the whole reservation for quick access
      }

      return acc;
    },
    {} as Record<
      number,
      Record<string, (typeof reservations.reservations)[number]>
    >
  );

  if (!data?.data) return <p>no data</p>;
  return (
    <ContextMenu>
      <section className=" relative">
        <h2 className=" text-heading-h2 mb-10">{`Today's Overview`}</h2>
        {/* stats */}
        <div className="flex items-center gap-5 justify-start flex-wrap ">
          <StatsCard
            Icon={Icons.Cart}
            label="active orders"
            number={data?.data?.activeOrdersCount}
          />
          <StatsCard
            Icon={Icons.Clipboard}
            label="total orders"
            number={data?.data?.todayOrderCount}
          />
          <StatsCard
            Icon={Icons.Calendar}
            label="reservations"
            number={data?.data?.todayReservationCount}
          />
          <StatsCard
            Icon={Icons.Money}
            label="Revenue"
            number={`${data?.data?.todayTotalRevenue}$`}
          />
        </div>
        {/* active orders & most ordered */}
        <div className="grid grid-cols-[60%_40%] divide-border divide-x my-20">
          {/* active ordered */}
          <div className="pr-8">
            <div className="flex items-center gap-5 justify-between pb-10">
              <h2>active orders</h2>
              <ContextMenu.Toggle name="order-status">
                <Icons.Settings />
              </ContextMenu.Toggle>
            </div>
            <ActiveOrders status={selectedOrderStatus} />
          </div>
          {/* most ordered */}
          <div className="px-8">
            <div>
              <SectionHeader className="mb-10" size="small">
                <h2>most ordered items</h2>
              </SectionHeader>
              <div className="space-y-5">
                {data?.data?.mostOrderdProducts.map((item) => (
                  <GlassCard>
                    <div className="flex items-center gap-5 rounded-2xl border p-3 border-border bg-border/20 backdrop-blur-2xl">
                      <figure className="w-[80px] h-auto shrink-0">
                        <img
                          src={item.image}
                          alt={`Image of ${item.name}`}
                          className="rounded-2xl w-full !h-full object-cover"
                        />
                      </figure>
                      <div className="grow grid grid-cols-2 grid-rows-2 gap-2">
                        <p className=" text-large">{item.name}</p>
                        <p className="font-normal text-base text-right">
                          unit price: {item.price}$
                        </p>
                        <p className="font-normal text-base">
                          Units Sold: {item.totalSold}
                        </p>
                        <p className="font-normal text-base text-right">
                          Total Revenue: {item.price * item.totalSold}$
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <div>
                <SectionHeader size="small">
                  <h2 className="my-10">{`today's reservations`}</h2>
                </SectionHeader>
                <div>
                  {tableLoading ? (
                    <SmallSpinner
                      color="white"
                      className="w-full mx-auto flex items-center justify-center"
                    />
                  ) : reservations?.reservations?.length ? (
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Cell head>table</Table.Cell>
                          <Table.Cell head>16:00-18:00</Table.Cell>
                          <Table.Cell head>18:00-20:00</Table.Cell>
                          <Table.Cell head>20:00-22:00</Table.Cell>
                          <Table.Cell head>22:00-00:00</Table.Cell>
                        </Table.Row>
                      </Table.Head>
                      {Object.keys(groupedReservations).map((tableNum) => (
                        <Table.Row key={tableNum}>
                          <Table.Cell>table {tableNum}</Table.Cell>

                          {timeSlots.map((slot) => {
                            const res = groupedReservations[tableNum][slot];
                            return (
                              <Table.Cell key={slot}>
                                {!!res?.user ? (
                                  <>
                                    {res.user.name} <br />
                                    {res.user.phoneNumber}
                                  </>
                                ) : (
                                  "-"
                                )}
                              </Table.Cell>
                            );
                          })}
                        </Table.Row>
                      ))}
                    </Table>
                  ) : (
                    <p className="text-center text-heading-h3 text-red-500">
                      there are no reservations today
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContextMenu.List name="order-status">
        {OrderStatus.map((st) => (
          <ContextMenu.Item autoClose={false}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  Array.isArray(selectedOrderStatus) &&
                  selectedOrderStatus.includes(st)
                }
                onChange={() => {
                  if (!Array.isArray(selectedOrderStatus)) return;
                  let newStatus;
                  if (selectedOrderStatus.includes(st))
                    newStatus = selectedOrderStatus.filter((opt) => opt != st);
                  else newStatus = [...selectedOrderStatus, st];
                  setSelectedOrderStatus(newStatus);
                  localStorage.setItem(
                    "order-status",
                    JSON.stringify(newStatus)
                  );
                }}
                name=""
                id=""
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              {st}
            </label>
          </ContextMenu.Item>
        ))}
      </ContextMenu.List>
    </ContextMenu>
  );
};

export default Home;

// 1. Business Overview
// Active Orders (activeOrdersCount)
// Today’s Orders (todayOrderCount)
// Today’s Reservations (todayReservationCount)
// Today’s Revenue (todayTotalRevenue)

// 2. Products & Sales
// Total Products (totalProductsCount)
// Total Categories (totalCategoriesCount)
// Most Ordered Products (mostOrderdProducts)

// 3. Users & Tables
// Total Users (totalUsersCount)
// Available Tables (availableTablesCount)

// 1. Orders & Revenue
// import { FaClipboardList } from "react-icons/fa";   // Active Orders
// import { FaShoppingCart } from "react-icons/fa";    // Today’s Orders
// import { FaRegCalendarCheck } from "react-icons/fa"; // Today’s Reservations
// import { FaMoneyBillWave } from "react-icons/fa";   // Today’s Revenue

// // 2. Products & Sales
// import { FaBoxOpen } from "react-icons/fa";         // Total Products
// import { FaThLarge } from "react-icons/fa";         // Total Categories
// import { FaChartLine } from "react-icons/fa";       // Most Ordered Products

// // 3. Users & Tables
// import { FaUsers } from "react-icons/fa";           // Total Users
// import { FaChair } from "react-icons/fa6";          // Available Tables
