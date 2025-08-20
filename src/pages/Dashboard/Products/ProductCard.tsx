import ConfirmDelete from "@/components/ConfirmDelete";
import ContextMenu from "@/components/ContextMenu";
import Icons from "@/components/Icons";
import Modal from "@/components/Modal";
import Toggler from "@/components/Toggler";
import type { TProduct } from "@/types/product";
import EditProduct from "./EditProduct";

const ProductCard = ({ product }: { product: TProduct }) => {
  return (
    <>
      <div className="inline-block border border-border rounded-2xl overflow-hidden relative">
        <div className=" absolute right-4 top-4 ">
          <ContextMenu.Toggle name={product._id}>
            <div className="bg-neutral-900 p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer">
              <Icons.Dots />
            </div>
          </ContextMenu.Toggle>
          <ContextMenu.List name={product._id}>
            <Modal.Open opens="edit">
              <ContextMenu.Item icon={<Icons.Pencil />} onClick={() => {}}>
                edit
              </ContextMenu.Item>
            </Modal.Open>
            <Modal.Open opens="delete">
              <ContextMenu.Item icon={<Icons.Trash />} onClick={() => {}}>
                delete
              </ContextMenu.Item>
            </Modal.Open>
          </ContextMenu.List>
        </div>
        <figure className="w-full h-[200px] overflow-hidden shrink-0 border-b border-border">
          <img
            src={product.images[0]}
            alt={`Image of ${product.name}`}
            className="rounded-t-2xl w-full !h-full object-cover"
          />
        </figure>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-heading-h3">{product.name}</p>
            <p className="grow text-right">{product.price}$</p>
          </div>
          <p className="font-normal font-thin text-large">
            <span className="font-medium">Description: </span>
            <span className="text-primary/90">{product.description}</span>
          </p>
          <p className="font-normal font-thin text-large">
            <span className="font-medium">Ingredients: </span>
            <span className="text-primary/80">
              {product.ingredients.join(", ")}
            </span>
          </p>
          <div className="flex items-center justify-between">
            <p className="font-normal font-thin text-xlarge text-primary/80">
              Availability
            </p>
            <Toggler toggle={() => console.log("hh")} />
          </div>
        </div>
      </div>
      <Modal.Window name="edit">
        <EditProduct />
      </Modal.Window>
      <Modal.Window name="delete">
        <ConfirmDelete
          resourceName={product.name}
          onCloseModal={() => {}}
          onConfirm={() => {}}
        />
      </Modal.Window>
    </>
  );
};

export default ProductCard;
