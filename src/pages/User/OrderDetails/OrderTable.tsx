import Table from "@components/Table";

const OrderTable = ({
  children,
  totalQuantity,
  totalPrice,
}: {
  children: React.ReactNode;
  totalQuantity: number;
  totalPrice: number;
}) => {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell head={true}>image</Table.Cell>
          <Table.Cell head={true}>name</Table.Cell>
          <Table.Cell head={true}>price</Table.Cell>
          <Table.Cell head={true}>quantity</Table.Cell>
          <Table.Cell head={true}>total price</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{children}</Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>
            <p className="py-3">Total: </p>
          </Table.Cell>
          <Table.Cell children="" />
          <Table.Cell children="" />
          <Table.Cell children={`x ${totalQuantity}`} />
          <Table.Cell children={`${totalPrice} $`} />
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default OrderTable;
