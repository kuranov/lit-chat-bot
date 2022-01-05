import {MessageModel} from "./message.model";

export type PublishMessage = (message: MessageModel) => void;
