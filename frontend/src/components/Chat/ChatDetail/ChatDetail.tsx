import { Box, Paper, Typography } from "@mui/material";
import ChatDetailProfile from "./ChatDetailProfile";
import { Ad, Chat, User } from "../../../types";
import { useEffect, useState } from "react";
import ChatDetailPicture from "./ChatDetailPicture";
import ChatDetailExtraInformation from "./ChatDetailExtraInformation";
import ChatDetailDescription from "./ChatDetailDescription";
import { Status } from "../../../generated/graphql-types";

type ChatDetailProps = {
  chats: Chat[];
  chatId?: string;
};

export default function ChatDetail({ chats, chatId }: ChatDetailProps) {
  const [userRequester, setUserRequester] = useState<User | undefined>(
    undefined
  );
  const [ad, setAd] = useState<Ad | undefined>(undefined);

  const currentChat = chats.find((chat: Chat) => chat.id === chatId);

  useEffect(() => {
    if (currentChat?.userRequester) {
      setUserRequester(currentChat.userRequester);
    }
    if (currentChat?.ad) {
      setAd(currentChat.ad);
    }
  }, [currentChat]);

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: 0,
        borderRadius: "12px",
      }}
    >
      <ChatDetailProfile userRequester={userRequester} />
      {ad && ad.status === Status.Deleted ? (
        <Box
          sx={{
            p: 1,
            pl: 2,
            borderBottom: 2,
            borderColor: "divider",
          }}
        >
          <Typography variant="body2">
            Annonce supprimée par l'utilisateur
          </Typography>
        </Box>
      ) : (
        <>
          <ChatDetailPicture ad={ad} />
          <ChatDetailDescription ad={ad} />
          <ChatDetailExtraInformation ad={ad} />
        </>
      )}
    </Paper>
  );
}
