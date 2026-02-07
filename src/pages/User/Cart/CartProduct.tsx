import Icons from "@components/Icons";
import Table from "@components/Table";

import { useCart } from "@/context/CartContext";

import type { TProduct } from "@cTypes/product";
import QuantitySelector from "@/components/QuantitySelector";
const CartProduct = ({
  product,
  quantity,
  mutationEnabled = false,
  isLoading = false,
}: {
  product: TProduct;
  quantity: number;
  mutationEnabled?: boolean;
  isLoading?: boolean;
}) => {
  const { removeFromCart, updateCartProductQuantity } = useCart();
  return (
    <Table.Row>
      <Table.Cell>
        <figure className="w-[75px] overflow-hidden mx-auto">
          <img
            src={product.images[0]}
            alt={`Image of ${product.name}`}
            className="rounded-2xl w-full !h-full object-contain"
          />
        </figure>
      </Table.Cell>
      <Table.Cell>{product.name}</Table.Cell>
      <Table.Cell>{product.price}$</Table.Cell>
      <Table.Cell>
        {mutationEnabled ? (
          <QuantitySelector
            quantity={quantity}
            isAvailable={mutationEnabled}
            isAccelerates={false}
            onChange={(q) =>
              updateCartProductQuantity({
                action: "decrease",
                product,
                quantity: q,
              })
            }
          />
        ) : (
          `× ${quantity}`
        )}
      </Table.Cell>
      <Table.Cell>{product.price * quantity}</Table.Cell>
      {mutationEnabled && (
        <Table.Cell>
          <button disabled={isLoading}>
            <Icons.Trash
              onClick={() => removeFromCart({ product, quantity })}
              className=" cursor-pointer hover:text-red-700 transition-colors ease-in-out lg:w-full"
            />
          </button>
        </Table.Cell>
      )}
    </Table.Row>
  );
};

export default CartProduct;
