import {css, html, LitElement} from 'lit';
import {customElement} from "lit/decorators.js";

@customElement('chat-room-messages')
export class ChatRoomMessages extends LitElement {
  static override styles = css`
    :host {
      width: 600px;
      flex-grow: 1;
      border-radius: 8px;
    }`;

  override render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages': ChatRoomMessages,
  }
}
