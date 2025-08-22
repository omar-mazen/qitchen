import Modal from "@components/Modal";
import ContextMenu from "@components/ContextMenu";
import Categories from "./Categories";

const MenuManagement = () => {
  return (
    <Modal>
      <ContextMenu alignment="left" size="md">
        <Categories />
      </ContextMenu>
    </Modal>
  );
};

export default MenuManagement;
