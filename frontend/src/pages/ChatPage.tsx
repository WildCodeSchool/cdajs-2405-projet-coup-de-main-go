import { useParams } from "react-router-dom";
import { useGetChatsByUserIdQuery } from "../generated/graphql-types";
import { getUserIdFromCookie } from "../utils/cookieHelper";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const userId = getUserIdFromCookie();

  const { loading, error, data } = useGetChatsByUserIdQuery({
    variables: { userId: userId! },
    skip: !userId,
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const chat = data?.getChatsByUserId?.find((c) => c.id === chatId);

  if (!chat) return <p>Chat non trouvé</p>;

  return (
    <div>
      <h2>Conversation - {chat.ad.title}</h2>
      <div style={{ display: "flex", flexDirection: "column-reverse", marginTop: "1rem" }}>
        {chat.messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.author.id === userId ? "flex-end" : "flex-start",
              backgroundColor: message.author.id === userId ? "#blue" : "#e5e5e5",
              color: message.author.id === userId ? "white" : "black",
              padding: "10px",
              borderRadius: "10px",
              maxWidth: "60%",
              marginBottom: "0.5rem",
            }}
          >
            <p>{message.message}</p>
            <small>{new Date(message.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
