import { Link } from "react-router";

import Button from "@components/Button";
import Loader from "@components/Loader";
import CartProduct from "./CartProduct";
import CartTable from "./CartTable";

import { useCart } from "@/context/CartContext";

import texture from "@images/texture.png";

const Cart = () => {
  const { cart, isLoading } = useCart();
  if (isLoading) return <Loader />;
  return (
    <div
      className=" overflow-y-auto lg:pt-48 p-10 lg:px-14 w-full h-full overflow-hidden rounded-2xl backdrop-brightness-150"
      style={{ backgroundImage: `url(${texture})` }}
    >
      {cart.products.length > 0 ? (
        <CartTable totalPrice={cart.totalPrice}>
          {cart.products.map((cartItem) => (
            <CartProduct
              product={cartItem.product}
              quantity={cartItem.quantity}
              key={cartItem.product._id}
              mutationEnabled={true}
            />
          ))}
        </CartTable>
      ) : (
        <div className="h-full px-8 flex flex-col gap-10 items-center justify-center">
          <p className="text-heading-h3">
            Your cart is empty. Start adding items to place an order.
          </p>
          <Link to="/menu">
            <Button type="outline">Browse menu</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
