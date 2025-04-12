import React from "react";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import SaveTreeModal from "./SaveTreeModal";

const ModalManager = ({
  isEditModalOpen,
  tempValue,
  setTempValue,
  handleCancelEdit,
  handleSaveEdit,
  errorMessage,
  isDeleteModalOpen,
  confirmDelete,
  handleCancelDelete,
  deleteTarget,
  deleteType,
  isSaveTreeModalOpen,
  setIsSaveTreeModalOpen,
  notificationType,
  notificationMessage,
}) => {
  return (
    <>
      <EditModal
        isOpen={isEditModalOpen}
        setTempValue={setTempValue}
        tempValue={tempValue}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        errorMessage={errorMessage}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen && deleteTarget}
        confirmDelete={confirmDelete}
        handleCancelDelete={handleCancelDelete}
        deleteTarget={deleteTarget}
        deleteType={deleteType}
      />

      <SaveTreeModal
        isOpen={isSaveTreeModalOpen}
        isNotification
        notificationType={notificationType}
        notificationMessage={notificationMessage}
        onClose={() => setIsSaveTreeModalOpen(false)}
      />
    </>
  );
};

export default ModalManager;
