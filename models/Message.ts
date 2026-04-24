import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Message = (mongoose.models.Message as Model<IMessage>) ?? mongoose.model<IMessage>("Message", messageSchema);