import Badge from "@components/Badge";
import Icons from "@components/Icons";
import Table from "@components/Table";

import { useCart } from "@/context/CartContext";

import type { TProduct } from "@cTypes/product";
const CartProduct = ({
  product,
  quantity,
  mutationEnabled = false,
}: {
  product: TProduct;
  quantity: number;
  mutationEnabled?: boolean;
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
        {mutationEnabled && (
          <Badge
            onClick={() =>
              updateCartProductQuantity({
                action: "decrease",
                product,
                quantity,
              })
            }
          >
            -
          </Badge>
        )}
        <span>× {quantity}</span>
        {mutationEnabled && (
          <Badge
            onClick={() =>
              updateCartProductQuantity({
                action: "increase",
                product,
                quantity,
              })
            }
          >
            +
          </Badge>
        )}
      </Table.Cell>
      <Table.Cell>{product.price * quantity}</Table.Cell>
      {mutationEnabled && (
        <Table.Cell>
          <Icons.Trash
            onClick={() => removeFromCart({ product, quantity })}
            className=" cursor-pointer hover:text-red-700 transition-colors ease-in-out lg:w-full"
          />
        </Table.Cell>
      )}
    </Table.Row>
  );
};

export default CartProduct;
