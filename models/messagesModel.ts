import { model, Schema } from "mongoose";
import messagesInterface from "../types/messagesType";

const messageSchema = new Schema<messagesInterface>({
  text: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: String, required: true }
})

const messageModel = model<messagesInterface>("Messages", messageSchema)

export default messageModel
