import type { TCARTProduct } from "@cTypes/cart";

const CheckoutProductCard = ({ product }: { product: TCARTProduct }) => {
  return (
    <div
      key={product.product._id}
      className="flex gap-10 border border-border rounded-2xl p-4"
    >
      <figure className="md:w-[120px] md:h-[70px] shrink-0">
        <img
          src={product.product.images[0]}
          alt={`Image of ${product.product.name}`}
          className="rounded-2xl w-full !h-full object-cover"
        />
      </figure>
      <div className="flex justify-between w-full items-center">
        <p>
          {product.product.name} × {product.quantity}
        </p>
        <div>
          <p>price: {product.product.price}$</p>
          <p>total: {product.product.price * product.quantity}$</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProductCard;
