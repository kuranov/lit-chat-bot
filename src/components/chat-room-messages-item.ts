import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";
import {MessageModel} from "../models/message.model";
import {AnimateController, flyAbove, flyBelow} from "@lit-labs/motion";

@customElement('chat-room-messages-item')
export class ChatRoomMessagesItem extends LitElement {
  static override styles = css`
    main {
      background: #fff;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      border-radius: 12px;
      margin: 4px 16px;
      padding: 8px 66px 8px 16px;
      position: relative;
    }
    header {
      font-size: 16px;
      font-weight: bold;
    }
    time {
      position: absolute;
      right: 16px;
      top: 12px;
      font-size: 8px;
      color: #999;
    }
    p {
      margin: 0px;
      font-size: 13px;
      color: #555;
    }
  `;

  @property()
  message?: MessageModel;

  @property()
  displayAuthor: boolean = true;

  override render() {
    return html`<main>
      <time>${formatTime(this.message?.time)}</time>
      ${this.displayAuthor ? html`<header>${this.message?.username}</header>`: ''}
      <p>${this.message?.text}</p>
    </main>`;
  }
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: 'numeric', second: 'numeric',
});
const formatTime = (time: Date | undefined): string => {
  return time ? timeFormatter.format(time) : '';
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages-item': ChatRoomMessagesItem,
  }
}
