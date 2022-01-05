import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";
import "./chat-room-messages-item.js";
import {repeat} from "lit/directives/repeat.js";
import {MessageModel} from "../models/message.model";
import {messageId} from "../helpers/message-id";
import {animate, AnimateController, fadeIn, flyAbove, flyBelow} from "@lit-labs/motion";

@customElement('chat-room-messages')
export class ChatRoomMessages extends LitElement {
  static override styles = css`
    :host {
      width: 600px;
      overflow: scroll;
      flex-grow: 1;
      padding: 10px 0;
    }
    main {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      justify-content: end;
      min-height: 100%;
    }
  `;

  private messageAnimation = {
    keyframeOptions: {
      duration: 350
    },
    in: fadeIn,
    out: flyBelow
  };

  @property()
  messages: MessageModel[] = [];

  override render() {
    return html`<main>
      ${repeat(this.messages, messageId, (message, index) => {
        return html`<chat-room-messages-item
              ${animate(this.messageAnimation)}
              .message=${message}
            .displayAuthor=${!this.sameAuthorAsBefore(index)}
        ></chat-room-messages-item>`;
      })}
    </main>`;
  }

  sameAuthorAsBefore(index: number): boolean {
    const currentUser = this.messages[index]?.username;
    const prevUser = this.messages[index - 1]?.username;

    return currentUser === prevUser;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages': ChatRoomMessages,
  }
}
