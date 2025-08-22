import { useSearchParams } from "react-router";

import Table from "@components/Table";
import Button from "@components/Button";
import Icons from "@components/Icons";

import type { TPagination } from "@cTypes/common";
const OrdersTable = ({
  children,
  isLoading,
  pagination,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  pagination: TPagination;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>#order id</Table.Cell>
          <Table.Cell>payment status</Table.Cell>
          <Table.Cell>order status</Table.Cell>
          <Table.Cell>items</Table.Cell>
          <Table.Cell>total quantity</Table.Cell>
          <Table.Cell>total price</Table.Cell>
          <Table.Cell>address</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{children}</Table.Body>
      {(pagination?.hasNextPage || pagination?.hasPrevPage) && (
        <Table.Footer>
          <Table.Row>
            <Table.Cell>
              {pagination?.hasPrevPage && (
                <Button
                  type="primary"
                  className="ml-auto"
                  disabled={isLoading}
                  onClick={() => {
                    searchParams.set(
                      "page",
                      `${Number(page) <= 1 ? 1 : Number(page) - 1}`
                    );
                    setSearchParams(searchParams);
                  }}
                >
                  <Icons.ArrowUp className=" -rotate-90" />
                  PREVIOUS
                </Button>
              )}
            </Table.Cell>
            <Table.Cell children />
            <Table.Cell children />
            <Table.Cell children />
            <Table.Cell children />
            <Table.Cell children />
            <Table.Cell>
              {pagination?.hasNextPage && (
                <Button
                  type="primary"
                  className="ml-auto"
                  disabled={isLoading}
                  onClick={() => {
                    searchParams.set("page", `${Number(page) + 1}`);
                    setSearchParams(searchParams);
                  }}
                >
                  NEXT
                  <Icons.ArrowUp className=" rotate-90" />
                </Button>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  );
};

export default OrdersTable;
