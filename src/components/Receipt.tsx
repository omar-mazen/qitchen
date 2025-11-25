import clsx from "clsx";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

type ReceiptProps = {
  orderId?: string;
  restaurantName?: string;
  table?: string | null;
  address?: string;
  user?: {
    name: string;
    phone: string;
    address: string;
  } | null;
  items: OrderItem[];
  vatPercent?: number;
  servicePercent?: number;
  staff?: string;
  paymentMethod?: string;
};

export type ReceiptRef = {
  print: () => void;
};

// Singleton portal container
let portalContainer: HTMLDivElement | null = null;
const getPortalContainer = () => {
  if (!portalContainer) {
    portalContainer = document.createElement("div");
    portalContainer.id = "receipt-portal";
    portalContainer.style.display = "none";
    document.body.appendChild(portalContainer);
  }
  return portalContainer;
};

const Receipt = forwardRef<ReceiptRef, ReceiptProps>(
  (
    {
      restaurantName = "QITCHEN",
      table = null,
      address = null,
      user = null,
      items,
      vatPercent = 16,
      servicePercent = 2,
      staff = "Administrator",
      paymentMethod = "Cash",
      orderId,
    },
    ref
  ) => {
    const [printedAt, setPrintedAt] = useState<{
      date: string;
      time: string;
    } | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      // Initialize container reference
      containerRef.current = getPortalContainer();
    }, []);

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    let orderType = "Takeaway";
    if (table) orderType = `Dine-in (Table ${table})`;
    else if (address || user) orderType = "Online";

    const vat = (subtotal * vatPercent) / 100;
    const service = address || user ? 0 : (subtotal * servicePercent) / 100;
    const grandTotal = subtotal + vat + service;
    const handlePrint = () => {
      const now = new Date();
      setPrintedAt({
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        // Keep content rendered briefly after print dialog closes
        setTimeout(() => setIsPrinting(false), 1000);
      }, 100);
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    // Only render when actually printing
    if (!isPrinting || !containerRef.current) return null;

    const receiptContent = (
      <>
        <div className="font-mono text-sm leading-relaxed bg-white text-black p-4">
          <div className="text-center">
            <div className="font-bold text-lg">{restaurantName}</div>
          </div>
          <div className="flex items-center justify-center my-2">
            <div
              style={{ height: "-webkit-fill-available" }}
              className="inline-block w-full bg-[radial-gradient(black_1px,transparent_0)] bg-[length:5px_5px] opacity-50"
            />
            <div className="px-1 font-bold tracking-[2px] whitespace-nowrap mx-4 flex flex-col items-center">
              {orderId && <span>RECEIPT#: {orderId}</span>}
              {table ? <span>Table: {table}</span> : <span>{orderType}</span>}
            </div>
            <div
              style={{ height: "-webkit-fill-available" }}
              className="inline-block w-full bg-[radial-gradient(black_1px,transparent_0)] bg-[length:5px_5px] opacity-50"
            />
          </div>
          <div className="py-2">
            {printedAt && (
              <div className="flex items-center justify-between flex-wrap">
                <p>Date: {printedAt.date}</p>
                <p>Time: {printedAt.time}</p>
              </div>
            )}
            <p>STAFF: {staff}</p>
          </div>
          {orderType === "Online" && user && (
            <div className="border-y border-dashed border-black/20 py-2">
              <div>
                <strong>Name:</strong> {user.name}
              </div>
              <div>
                <strong>Phone:</strong> {user.phone}
              </div>
              <div>
                <strong>Address:</strong> {user.address || address}
              </div>
            </div>
          )}

          <div className="border-b-[0.5px] border-black py-2 mb-2 ">
            <div
              className="grid font-bold text-xs mb-1 pb-1 gap-x-4 gap-y-2"
              style={{
                gridTemplateColumns: "1fr auto auto auto",
              }}
            >
              <span>Item</span>
              <span className="text-center">Qty</span>
              <span className="text-center">Unit</span>
              <span className="text-center">Total</span>
              <div className="bg-black h-[0.5px] w-full col-span-4"></div>
              {items.map((item, idx) => (
                <React.Fragment key={`${orderId}-${idx}`}>
                  <span className="break-words leading-snug">
                    - {item.name}
                  </span>
                  <span className="text-center">{item.qty}</span>
                  <span className="text-center">{item.price.toFixed(2)}</span>
                  <span className="text-center">
                    {(item.price * item.qty).toFixed(2)}
                  </span>
                  <div className="bg-black/20 h-[0.5px] w-full col-span-4 last:hidden"></div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <span>subtotal :</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className={clsx("flex justify-between", service <= 0 && "pb-2")}>
            <span>VAT {vatPercent}%:</span>
            <span>{vat.toFixed(2)}</span>
          </div>
          {service > 0 && (
            <div className="flex justify-between pb-2">
              <span>Service {servicePercent}%:</span>
              <span>{service.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-dashed border-black/20 py-2 font-bold">
            <span>GRAND TOTAL:</span>
            <span>{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>PAID BY: {paymentMethod}</span>
          </div>
        </div>
        <style>
          {`
          @page {
            margin: 5mm;
          }
          
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              color: black !important;
            }

            body > :not(#receipt-portal) {
              display: none !important;
            }

            #receipt-portal {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        `}
        </style>
      </>
    );

    return createPortal(receiptContent, containerRef.current);
  }
);

Receipt.displayName = "Receipt";

export default Receipt;
