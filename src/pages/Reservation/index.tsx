import { useState } from "react";

import Input from "@components/Input";
import Button from "@components/Button";
import SectionHeader from "@components/SectionHeader";
import PageLayout from "@components/PageLayout";

import banner from "@images/reservation.png";
const Reservation = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  return (
    <PageLayout
      banner={banner}
      caption={
        <>
          Book <br />a table
        </>
      }
    >
      <div className="border border-border rounded-2xl overflow-y-scroll h-full px-10 sm:px-40">
        <SectionHeader className="pt-20">
          <h1 className=" text-heading-h4 sm:text-heading-h2">reservation</h1>
        </SectionHeader>
        <p className=" text-medium text-center mx-auto mt-6 sm:text-large font-thin font-normal max-w-[400px]">
          Secure your spot at Qitchen, where exceptional sushi and a remarkable
          dining experience await.
        </p>
        <form action="" className="mt-20 w-full ">
          <div className="flex flex-col space-y-5">
            <Input placeholder="Name" value={name} setValue={setName} />
            <Input
              placeholder="Phone Number"
              value={phone}
              setValue={setPhone}
            />
            <Input placeholder="Email" value={email} setValue={setEmail} />
          </div>
          <div className="max-w-full w-full flex items-center gap-4 mt-5">
            <Input placeholder="Guests" value={guests} setValue={setGuests} />
            <Input placeholder="Date" value={date} setValue={setDate} />
            <Input placeholder="Time" value={time} setValue={setTime} />
          </div>
          <Button type="primary" className="w-full mt-5">
            reserve
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};

export default Reservation;
