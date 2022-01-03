import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";
import "./chat-room-messages-item.js";

@customElement('chat-room-messages')
export class ChatRoomMessages extends LitElement {
  static override styles = css`
    :host {
      width: 600px;
      overflow: scroll;
      flex-grow: 1;
      border-radius: 8px;
    }`;

  @property()
  messages: MessageModel[] = [];

  override render() {
    return html`
      ${this.messages?.map((message, index) =>
        html`<chat-room-messages-item 
            .message=${message}
            .displayAuthor=${!this.sameAuthorAsBefore(index)}
        ></chat-room-messages-item>`,
      )}`;
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
