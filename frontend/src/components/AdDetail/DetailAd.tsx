import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  GetAdByIdQuery,
  useGetChatByUserAndAdIdQuery,
  useCreateChatMutation,
  useUpdateChatHelpProposalMutation,
  useSendMessageMutation,
} from "../../generated/graphql-types";
import { useAuth } from "../../contexts/AuthContext";
import DetailAdSlider from "./DetailAdSlider";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import MapWithLocation from "./MapWithLocation";
import Hands from "/images/picture.png";
import theme from "../../mui";
import {
  GET_USER_CHATS,
  GET_CHAT_BY_USER_AND_AD_ID,
} from "../../graphql/chatQueries";
import { useNavigate } from "react-router-dom";

interface DetailAdProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailAd({ ad }: DetailAdProps) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const timeAgo = formatDistanceToNow(new Date(ad.updatedAt), {
    locale: fr,
    addSuffix: true,
  });

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes}`;
    }
  };

  const adWithPictures = Boolean(ad.picture1 || ad.picture2 || ad.picture3);

  const { data: existingChatData } = useGetChatByUserAndAdIdQuery({
    variables: {
      userId: userId || "",
      adId: ad.id,
    },
  });

  const existingChat = existingChatData?.getChatByUserAndAdId?.[0];
  const isHelpRejected = existingChat?.isHelpProposed === false;
  const isHelpProposed = existingChat?.isHelpProposed === true;

  const isUserRequester = ad.userRequester?.id === userId;

  const isButtonDisabled = isHelpProposed || isUserRequester || isHelpRejected;

  const buttonText = isHelpRejected
    ? "Aide refusée"
    : isHelpProposed
    ? "En attente d'acceptation"
    : isUserRequester
    ? "Vous êtes l'aidant sur cette annonce"
    : "Je propose mon aide";

  const [createChat] = useCreateChatMutation();
  const [updateChatHelpProposal] = useUpdateChatHelpProposalMutation();
  const [sendMessage] = useSendMessageMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId } },
      { query: GET_CHAT_BY_USER_AND_AD_ID, variables: { userId, adId: ad.id } },
    ],
  });

  const handleProposeHelp = async () => {
    try {
      if (!userId) {
        return navigate("/login");
      }

      const { data } = await createChat({
        variables: {
          chatData: {
            adId: ad.id,
            userRequesterId: ad.userRequester.id,
            userHelperId: userId,
          },
        },
      });

      if (data?.createChat.id) {
        await updateChatHelpProposal({
          variables: {
            chatId: data.createChat.id,
            isHelpProposed: true,
          },
        });

        await sendMessage({
          variables: {
            messageData: {
              message: "Bonjour ! Je serais ravi(e) de vous aider 😊",
              chatId: data.createChat.id,
              authorId: userId,
              isViewedByRequester: false,
              isViewedByHelper: false,
            },
            currentUserId: userId,
          },
        });

        navigate(`/chat`);
      }
    } catch (error) {
      console.error("Erreur lors de la proposition d'aide :", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "14rem",
          borderRadius: "1rem 1rem 0 0",
        }}
      >
        {adWithPictures ? (
          <DetailAdSlider ad={ad} />
        ) : (
          <img
            src={Hands}
            alt="shaking hands"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        )}
      </Box>

      <Stack sx={{ padding: "0 1.5rem 2rem 1.5rem" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" component="h1">
            {ad.title}
          </Typography>
          <Typography variant="message">{timeAgo}</Typography>
        </Stack>

        <Typography>{ad.description}</Typography>

        <Divider sx={{ width: "80%" }} />

        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Durée
        </Typography>
        <Typography>{formatDuration(ad.duration)}</Typography>

        <Divider sx={{ width: "80%" }} />

        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Localisation
        </Typography>
        {ad.latitude && ad.longitude ? (
          <MapWithLocation latitude={ad.latitude} longitude={ad.longitude} />
        ) : (
          <Typography>Carte non disponible</Typography>
        )}
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Compétence
        </Typography>
        <Chip label={ad.skill.name} variant="outlined" sx={{ maxWidth: 128 }} />

        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={isMobile ? 5 : 0}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              alignSelf: isMobile ? "flex-start" : "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {ad.mangoAmount}
            </Typography>
            <img
              src="/images/mango.png"
              alt="mango"
              style={{ width: 20, height: 20 }}
            />
          </Stack>
          <Button
            onClick={handleProposeHelp}
            disabled={isButtonDisabled}
            sx={{
              px: 4,
              textAlign: "center",
            }}
          >
            {buttonText}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
