import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Loader from "@components/Loader";
import Error from "@components/Error";
import ContextMenu from "@components/ContextMenu";
import Modal from "@components/Modal";
import Button from "@components/Button";
import SectionHeader from "@components/SectionHeader";
import TablesTable from "./TablesTable";
import TableForm from "./TableForm";

import { getAllTables, addTable as addTableAPI } from "@services/tables";

import { isToday, toLocalTime } from "@/utils";

const Tables = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getAllTables,
  });
  const { mutateAsync: addTable, isPending: isAdding } = useMutation({
    mutationKey: ["tables"],
    mutationFn: addTableAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["tables"] }),
  });
  const filteredTables = useMemo(() => {
    if (!data?.tables) return [];

    return data?.tables.map((table) => ({
      ...table,
      reservations: table.reservations.filter((res) =>
        isToday({
          dateString: toLocalTime({ dateString: res.reservationDate }),
        })
      ),
    }));
  }, [data]);
  if (data?.error) return <Error message={data.error} />;
  if (isLoading) return <Loader />;
  return (
    <Modal>
      <ContextMenu alignment="left">
        {filteredTables?.length ? (
          <div className="">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-heading-h2">Tables</h1>
              <Modal.Open opens="add table">
                <Button type="outline"> add table</Button>
              </Modal.Open>
            </div>
            <TablesTable tables={filteredTables} />
          </div>
        ) : (
          <div className="fixed top-1/2 left-1/2 flex flex-col items-center gap-10 -translate-y-1/2 ">
            <p className=" text-heading-h2">There are no tables yet.</p>
            <Modal.Open opens="add table">
              <Button type="primary">add table</Button>
            </Modal.Open>
          </div>
        )}
      </ContextMenu>
      <Modal.Window name="add table">
        <TableForm
          table={{
            type: "add",
            number: (data?.tables?.length || 0) + 1,
            capacity: 4,
          }}
          isLoading={isAdding}
          onSubmit={async (values) => {
            await addTable({
              number: values.number,
              capacity: values.capacity,
            });
          }}
        >
          <SectionHeader>
            <h2 className=" text-heading-h3 my-10">Add Table</h2>
          </SectionHeader>
        </TableForm>
      </Modal.Window>
    </Modal>
  );
};

export default Tables;
