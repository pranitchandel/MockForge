import Modal from "../Modal";

const SaveTreeModal = ({
    notificationMessage,
    notificationType,
    onClose,
    isOpen
}) => {
    return (
        <Modal
            isOpen={isOpen}
            isNotification
            notificationType={notificationType}
            notificationMessage={notificationMessage}
            onClose={onClose}
        />

    )
}

export default SaveTreeModal;
