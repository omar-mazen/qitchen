import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Table from "@components/Table";
import Toggler from "@components/Toggler";
import ContextMenu from "@components/ContextMenu";
import Icons from "@components/Icons";
import Modal from "@components/Modal";
import ConfirmDelete from "@components/ConfirmDelete";
import SectionHeader from "@components/SectionHeader";
import TableForm from "./TableForm";

import type { TTableWithReservations } from "@cTypes/table";

import { isSameTime, toLocalTime } from "@/utils";

import {
  deleteTable as deleteTableAPI,
  updateTable as updateTableAPI,
} from "@services/tables";

const TablesTable = ({ tables }: { tables: TTableWithReservations[] }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTable, isPending: isLoading } = useMutation({
    mutationKey: ["tables"],
    mutationFn: deleteTableAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["tables"] }),
  });
  const { mutateAsync: updateTable, isPending: isUpdating } = useMutation({
    mutationKey: ["tables"],
    mutationFn: updateTableAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["tables"] }),
  });
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell head={true}>table</Table.Cell>
          <Table.Cell head={true}>capacity</Table.Cell>
          <Table.Cell head={true}>availability</Table.Cell>
          <Table.Cell head={true}>slot 16:00 - 18:00</Table.Cell>
          <Table.Cell head={true}>slot 18:00 - 20:00</Table.Cell>
          <Table.Cell head={true}>slot 20:00 - 22:00</Table.Cell>
          <Table.Cell head={true}>slot 22:00 - 24:00</Table.Cell>
          <Table.Cell head={true} children />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tables?.map((table) => (
          <>
            <Table.Row key={table._id} disabled={!table.isActive || isLoading}>
              <Table.Cell>Table {table.number}</Table.Cell>
              <Table.Cell>{table.capacity}</Table.Cell>
              <Table.Cell>
                {<Toggler checked={table.isActive} toggle={() => {}} />}
              </Table.Cell>
              <Table.Cell>
                {table.reservations.filter((res) =>
                  isSameTime({
                    dateString: toLocalTime({
                      dateString: res.reservationDate,
                    }),
                    timeString: "16:00",
                  })
                )?.[0]?.user?.name ?? "-"}
              </Table.Cell>
              <Table.Cell>
                {table.reservations.filter((res) =>
                  isSameTime({
                    dateString: toLocalTime({
                      dateString: res.reservationDate,
                    }),
                    timeString: "18:00",
                  })
                )?.[0]?.user?.name ?? "-"}
              </Table.Cell>
              <Table.Cell>
                {table.reservations.filter((res) =>
                  isSameTime({
                    dateString: toLocalTime({
                      dateString: res.reservationDate,
                    }),
                    timeString: "20:00",
                  })
                )?.[0]?.user?.name ?? "-"}
              </Table.Cell>
              <Table.Cell>
                {table.reservations.filter((res) =>
                  isSameTime({
                    dateString: toLocalTime({
                      dateString: res.reservationDate,
                    }),
                    timeString: "22:00",
                  })
                )?.[0]?.user?.name ?? "-"}
              </Table.Cell>
              <Table.Cell>
                <ContextMenu.Toggle name={`actions-${table._id}`}>
                  <Icons.Dots />
                </ContextMenu.Toggle>
                <ContextMenu.List name={`actions-${table._id}`}>
                  <Modal.Open opens={`edit table-${table.id}`}>
                    <ContextMenu.Item icon={<Icons.Pencil />}>
                      edit
                    </ContextMenu.Item>
                  </Modal.Open>
                  <Modal.Open opens={"delete table-" + table._id}>
                    <ContextMenu.Item icon={<Icons.Trash />}>
                      delete
                    </ContextMenu.Item>
                  </Modal.Open>
                </ContextMenu.List>
              </Table.Cell>
            </Table.Row>
            <Modal.Window name={"delete table-" + table._id}>
              <ConfirmDelete
                resourceName={`table ${table.number}`}
                onConfirm={async () => {
                  await toast.promise(
                    () => deleteTable({ tableId: table._id }),
                    {
                      pending: `Deleting table...`,
                      success: `Table deleted`,
                      error: `Failed to delete table`,
                    }
                  );
                }}
              />
            </Modal.Window>
            <Modal.Window name={"edit table-" + table._id}>
              <TableForm
                table={{
                  type: "edit",
                  tableId: table._id,
                  number: table.number,
                  capacity: table.capacity,
                }}
                isLoading={isUpdating}
                onSubmit={async (values) => {
                  await updateTable({
                    tableId: table._id,
                    number: values.number,
                    capacity: values.capacity,
                  });
                }}
              >
                <SectionHeader>
                  <h2 className=" text-heading-h3 my-10">Edit Table</h2>
                </SectionHeader>
              </TableForm>
            </Modal.Window>
          </>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell children />
          <Table.Cell children />
          <Table.Cell children />
          <Table.Cell>
            avilable:{" "}
            {tables?.length ||
              0 -
                tables?.reduce(
                  (prev, curr) =>
                    prev +
                    curr.reservations.filter(
                      (res) =>
                        isSameTime({
                          dateString: res.reservationDate,
                          timeString: "16:00",
                        }) && curr.isActive
                    )?.length,
                  0
                ) ||
              0}
          </Table.Cell>
          <Table.Cell>
            avilable:{" "}
            {tables?.length ||
              0 -
                tables?.reduce(
                  (prev, curr) =>
                    prev +
                    curr.reservations.filter((res) =>
                      isSameTime({
                        dateString: res.reservationDate,
                        timeString: "18:00",
                      })
                    )?.length,
                  0
                ) ||
              0}
          </Table.Cell>
          <Table.Cell>
            avilable:{" "}
            {tables?.length ||
              0 -
                tables?.reduce(
                  (prev, curr) =>
                    prev +
                    curr.reservations.filter((res) =>
                      isSameTime({
                        dateString: res.reservationDate,
                        timeString: "20:00",
                      })
                    )?.length,
                  0
                ) ||
              0}
          </Table.Cell>
          <Table.Cell>
            avilable:{" "}
            {tables?.length ||
              0 -
                tables?.reduce(
                  (prev, curr) =>
                    prev +
                    curr.reservations.filter((res) =>
                      isSameTime({
                        dateString: res.reservationDate,
                        timeString: "22:00",
                      })
                    )?.length,
                  0
                ) ||
              0}
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default TablesTable;
