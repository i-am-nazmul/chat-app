import { io, type Socket } from "socket.io-client";

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

const chatServerUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL ?? "http://localhost:5000";

export function createChatSocket(userId: string, peerId: string): Socket {
  return io(chatServerUrl, {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: false,
    auth: {
      userId,
      peerId,
    },
  });
}