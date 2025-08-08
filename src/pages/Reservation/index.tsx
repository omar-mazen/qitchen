import texture from "@images/texture.png";
import banner from "@images/reservation.png";
import Input from "@/components/Input";
import { useState } from "react";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
const Reservation = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  return (
    <div
      style={{ backgroundImage: `url(${texture})` }}
      className="grid gap-5 lg:grid-cols-2 min-h-full h-full rounded-2xl overflow-hidden"
    >
      <aside className="relative hidden overflow-hidden lg:block">
        <figure className="reltive rounded-2xl overflow-hidden w-full h-full after:bg-gradient-to-t after:from-background/50 after:to-transparent after:absolute after:bottom-0 after:z-1 after:w-full after:h-1/2 after:rounded-2xl after:overflow-hidden">
          <img
            src={banner}
            alt="Decorative reservation banner"
            role="presentation"
            className="w-full !h-full object-cover"
          />
          <figcaption className="absolute bottom-20 left-20 text-heading-large z-2">
            Book <br />a table
          </figcaption>
        </figure>
      </aside>
      <main className="border border-border rounded-2xl overflow-y-scroll h-full px-40">
        <SectionHeader className="pt-20">
          <h1 className=" text-heading-h2">reservation</h1>
        </SectionHeader>
        <p className="text-center mx-auto mt-6 text-large font-thin font-normal max-w-[400px]">
          Secure your spot at Qitchen, where exceptional sushi and a remarkable
          dining experience await.
        </p>
        <form action="" className="mt-20 w-full">
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
      </main>
    </div>
  );
};

export default Reservation;
