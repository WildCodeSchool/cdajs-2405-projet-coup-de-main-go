import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ChatList from "./ChatList";
import { useGetChatsByUserIdQuery } from "../generated/graphql-types";
import { getUserIdFromCookie } from "../utils/cookieHelper";

export default function ChatLayout() {
  const navigate = useNavigate();
  const userId = getUserIdFromCookie();
  const { data } = useGetChatsByUserIdQuery({
    variables: { userId: userId! },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getChatsByUserId && data.getChatsByUserId.length > 0) {
      navigate(`/chat/${data.getChatsByUserId[0].id}`);
    }
  }, [data, navigate]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <ChatList chats={data?.getChatsByUserId || []} />
      </div>
      <div style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
}