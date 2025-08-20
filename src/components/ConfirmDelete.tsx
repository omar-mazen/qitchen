import Button from "@components/Button";

type ConfirmDeleteProps = {
  resourceName: string;
  onCloseModal: () => void;
  onConfirm: () => void;
};

export default function ConfirmDelete({
  resourceName,
  onCloseModal,
  onConfirm,
}: ConfirmDeleteProps) {
  return (
    <div className="space-y-10 mt-5">
      <p className="min-w-[200px] text-xlarge">
        Are you sure you want to delete <strong>{resourceName}</strong>{" "}
        permanently? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <Button
          type="primary"
          onClick={() => {
            onConfirm();
            onCloseModal();
          }}
        >
          Delete
        </Button>
        <Button type="primary" onClick={onCloseModal}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
