import AdModalForm from "./modalComponents/AdModalForm";
import AdModalTopRow from "./modalComponents/AdModalTopRow";
import { Box, Modal } from "@mui/material";

interface NewAdModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function NewAdModal({
  isModalOpen,
  closeModal,
}: NewAdModalProps) {
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          width: "90%",
          maxWidth: "65rem",
          height: "auto",
          maxHeight: "90vh",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "auto",
          backgroundColor: "var(--background)",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        {/* Top row */}
        <AdModalTopRow closeModal={closeModal} />

        {/* Form */}
        <AdModalForm closeModal={closeModal} />
      </Box>
    </Modal>
  );
}
