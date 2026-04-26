import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";

type MessageDoc = {
  _id: { toString: () => string; getTimestamp?: () => Date };
  senderId?: unknown;
  receiverId?: unknown;
  sender?: unknown;
  receiver?: unknown;
  from?: unknown;
  to?: unknown;
  content?: unknown;
  message?: unknown;
  text?: unknown;
  read?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

function normalizeId(value: unknown) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    return value.toString();
  }

  return "";
}

function normalizeDate(value: unknown, fallback?: Date) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  if (fallback) {
    return fallback.toISOString();
  }

  return new Date().toISOString();
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const peerId = searchParams.get("peerId")?.trim();

  if (!peerId) {
    return NextResponse.json({ message: "Peer id is required." }, { status: 400 });
  }

  let userId = "";

  try {
    const authToken = verifyAuthToken(token);
    userId = authToken.userId;
  } catch {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection is not ready.");
    }

    const idCandidates = (id: string) => {
      const values: Array<string | Types.ObjectId> = [id];

      if (Types.ObjectId.isValid(id)) {
        values.push(new Types.ObjectId(id));
      }

      return values;
    };

    const userIdCandidates = idCandidates(userId);
    const peerIdCandidates = idCandidates(peerId);

    const senderFields = ["senderId", "sender", "from"];
    const receiverFields = ["receiverId", "receiver", "to"];

    const fieldCombos = senderFields.flatMap((senderField) =>
      receiverFields.map((receiverField) => ({ senderField, receiverField })),
    );

    const conditions = fieldCombos.flatMap(({ senderField, receiverField }) => [
      {
        [senderField]: { $in: userIdCandidates },
        [receiverField]: { $in: peerIdCandidates },
      },
      {
        [senderField]: { $in: peerIdCandidates },
        [receiverField]: { $in: userIdCandidates },
      },
    ]);

    const rawMessages = (await db
      .collection("messages")
      .find({ $or: conditions })
      .sort({ createdAt: 1, _id: 1 })
      .toArray()) as MessageDoc[];

    return NextResponse.json({
      messages: rawMessages.map((message) => {
        const createdFallback = message._id.getTimestamp?.();

        return {
          id: message._id.toString(),
          senderId: normalizeId(message.senderId ?? message.sender ?? message.from),
          receiverId: normalizeId(message.receiverId ?? message.receiver ?? message.to),
          content: String(message.content ?? message.message ?? message.text ?? ""),
          read: Boolean(message.read),
          createdAt: normalizeDate(message.createdAt ?? message.created_at, createdFallback),
          updatedAt: normalizeDate(message.updatedAt ?? message.updated_at, createdFallback),
        };
      }),
    });
  } catch {
    return NextResponse.json({ message: "Unable to load messages right now." }, { status: 500 });
  }
}