import { useNavigate } from "react-router-dom";
import { useCreateChatMutation } from "../generated/graphql-types";
import { getUserIdFromCookie } from "../utils/cookieHelper";

interface ChatButtonProps {
  userHelperId: string;
}

export default function ChatButton({ userHelperId }: ChatButtonProps) {
  const navigate = useNavigate();
  const [createChat] = useCreateChatMutation();

  const handleCreateChat = async () => {
    try {
      const userRequesterId = getUserIdFromCookie();

      if (!userRequesterId) {
        throw new Error("User requester ID is null");
      }

      const { data } = await createChat({
        variables: {
          chatData: {
            adId : "1",
            userRequesterId: userRequesterId,
            userHelperId: userHelperId,
          },
        },
      });

      if (data?.createChat.id) {
        navigate(`/chat/${data.createChat.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du chat:", error);
    }
  };

  return <button onClick={handleCreateChat}>Démarrer le chat</button>;
}
