import Modal from "../Modal";

const DeleteModal = ({ isOpen, handleCancelDelete, deleteTarget, confirmDelete, deleteType }) => {
    return (
        <Modal isOpen={isOpen} onClose={handleCancelDelete}
            confirmText={deleteType === "key" ? "Delete Key" : "Delete Value"}
            isDelete={true}
            onConfirm = {confirmDelete}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete:</p>
            <div className="delete-details">
                <strong>Key:</strong> {deleteTarget?.key}
                <br />
                <strong>Value:</strong> {JSON.stringify(deleteTarget?.value, null, 2)}
            </div>
        </Modal>
    )
}

export default DeleteModal;