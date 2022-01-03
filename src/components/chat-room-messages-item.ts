import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";

@customElement('chat-room-messages-item')
export class ChatRoomMessagesItem extends LitElement {
  static override styles = css`
    :host {
      width: 600px;
      flex-grow: 1;
      border-radius: 8px;
    }`;

  @property()
  message?: MessageModel;

  override render() {
    return html`<main>
      <header>${this.message?.username}</header>
      <section>${this.message?.text}</section>
    </main>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages-item': ChatRoomMessagesItem,
  }
}
