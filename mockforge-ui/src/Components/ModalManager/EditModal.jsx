import Modal from "../Modal";

const EditModal = ({ isOpen, setTempValue, tempValue, handleCancelEdit, handleSaveEdit, errorMessage }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancelEdit} 
            onConfirm={handleSaveEdit} 
            confirmText = {"Save"}
            errorMessage={errorMessage}>
            <h3>Edit Value</h3>
            <textarea
                className="edit-input"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
            />
        </Modal>
    )
}

export default EditModal;
