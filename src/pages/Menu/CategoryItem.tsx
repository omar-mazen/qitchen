import { Link } from "react-router";

import DotsFill from "@components/DotsFill";

import type { TProduct } from "@cTypes/product";

const Categoryitem = (props: TProduct) => {
  return (
    <li className="py-10">
      <Link to={`/product/${props._id}`}>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <figure className="md:w-[120px] md:h-[70px] shrink-0">
            <img
              src={props.images[0]}
              alt={`Image of ${props.name}`}
              className="rounded-2xl w-full !h-full object-cover"
            />
          </figure>
          <div className="w-full">
            <div className="flex items-center gap-5">
              <h3 className=" text-heading-h4 text-nowrap">{props.name}</h3>
              <DotsFill />
              <span>{props.price}$</span>
            </div>
            <p className=" font-normal text-primary-muted text-large font-thin pr-8">
              {props.description}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};
export default Categoryitem;
