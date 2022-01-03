import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";

import "./chat-room-messages-item.js";

@customElement('chat-room-messages')
export class ChatRoomMessages extends LitElement {
  static override styles = css`
    :host {
      width: 600px;
      flex-grow: 1;
      border-radius: 8px;
    }`;

  @property()
  messages: MessageModel[] = [];

  override render() {
    return html`<ul></ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages': ChatRoomMessages,
  }
}
