import { CircularProgress, Typography } from "@mui/material";
import { useGetAdByIdQuery } from "../../generated/graphql-types";
import GenericModal from "../Modal/GenericModal";
import AdModalForm from "./modalComponents/AdModalForm";

interface AdModalProps {
  open: boolean;
  onClose: () => void;
  isEditing?: boolean;
  adId?: string;
}

export default function AdModal({
  open,
  onClose,
  isEditing,
  adId,
}: AdModalProps) {
  // If adId is provided, fetch the existing ad from the database
  const {
    loading: adLoading,
    error: adError,
    data: adData,
  } = useGetAdByIdQuery({ variables: { id: adId || "" }, skip: !adId });

  const ad = adData?.getAdById;

  return (
    <>
      <GenericModal open={open} onClose={onClose} maxWidth="md">
        <AdModalForm isEditing={isEditing} ad={ad} onClose={onClose} />
      </GenericModal>

      {adLoading && <CircularProgress />}
      {adError && <Typography>Erreur : {adError.message}</Typography>}
      {isEditing && !adData && <Typography>Aucune donnée trouvée</Typography>}
    </>
  );
}
