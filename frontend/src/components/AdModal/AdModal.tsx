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
  const {
    loading: adLoading,
    error: adError,
    data: adData,
  } = useGetAdByIdQuery({ variables: { id: adId || "" }, skip: !adId });

  const ad = adData?.getAdById;

  if (isEditing && adLoading) return <CircularProgress />;
  if (isEditing && adError)
    return <Typography>Erreur: {adError.message}</Typography>;
  if (isEditing && !adData)
    return <Typography>Aucune donnée trouvée</Typography>;

  return (
    <GenericModal open={open} onClose={onClose} maxWidth="md">
      <AdModalForm isEditing={isEditing} ad={ad} onClose={onClose} />
    </GenericModal>
  );
}
