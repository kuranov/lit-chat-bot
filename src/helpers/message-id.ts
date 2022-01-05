import {MessageModel} from "../models/message.model";

export const messageId = (msg: MessageModel) => `${msg.username}_${msg.time.getTime()}`;
