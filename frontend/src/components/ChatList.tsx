import { Link } from "react-router-dom";
import type { ChatListProps } from "../types";

export default function ChatList({ chats }: ChatListProps) {
  return (
    <div>
      <h2>Vos Conversations</h2>
      {chats.length === 0 ? (
        <p>Aucune conversation.</p>
      ) : (
        <ul>
          {chats.map((chat) => {
            const otherUser =
              chat.userHelper.id === chat.userRequester.id
                ? chat.userHelper
                : chat.userRequester;
            const lastMessageDate =
              chat.messages[chat.messages.length - 1]?.date;
            return (
              <li key={chat.id} style={{ marginBottom: "1rem" }}>
                <Link
                  to={`/chat/${chat.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={otherUser.picture ?? ""}
                      alt={`${otherUser.firstName} ${otherUser.lastName}`}
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%", marginRight: "0.5rem" }}
                    />
                    <div>
                      <p>
                        {otherUser.firstName} {otherUser.lastName}
                      </p>
                      <small>
                        {new Date(lastMessageDate).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}