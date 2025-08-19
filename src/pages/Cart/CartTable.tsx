import React from "react";
import Table from "@components/Table";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/Auth";
import { Link } from "react-router";
import Button from "@/components/Button";
import Icons from "@/components/Icons";

const CartTable = ({
  children,
  totalPrice,
}: {
  children: React.ReactNode;
  totalPrice: number;
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell head={true}>image</Table.Cell>
          <Table.Cell head={true}>name</Table.Cell>
          <Table.Cell head={true}>price</Table.Cell>
          <Table.Cell head={true}>quantity</Table.Cell>
          <Table.Cell head={true}>total price</Table.Cell>
          <Table.Cell head={true} children="" />
        </Table.Row>
      </Table.Head>
      <Table.Body>{children}</Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.Cell center={false}>
            <p className="py-3">Total: {totalPrice}$</p>
          </Table.Cell>
          <Table.Cell children="" />
          <Table.Cell children="" />
          <Table.Cell children="" />
          <Table.Cell children="" />
          <Table.Cell>
            <Link to={ROUTES.MAKE_ORDER}>
              {isAuthenticated ? (
                <Button
                  type="primary"
                  className=" absolute top-1/2 -translate-y-1/2 right-10"
                >
                  Order now
                </Button>
              ) : (
                <Link to={"/login"}>
                  <Button type="icon" icon={<Icons.Arrow />}>
                    Login to continue
                  </Button>
                </Link>
              )}
            </Link>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default CartTable;
