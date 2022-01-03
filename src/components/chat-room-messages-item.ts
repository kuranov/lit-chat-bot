import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";

@customElement('chat-room-messages-item')
export class ChatRoomMessagesItem extends LitElement {
  static override styles = css`
    main {
      background: #fff;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      border-radius: 12px;
      margin: 7px 16px;
      padding: 8px 16px;
      position: relative;
    }
    header {
      font-size: 16px;
      font-weight: bold;
    }
    time {
      position: absolute;
      right: 16px;
      top: 16px;
      font-size: 8px;
      color: #999;
    }
    p {
      margin: 0px;
      font-size: 14px;
    }
  `;

  @property()
  message?: MessageModel;

  @property()
  displayAuthor: boolean = true;

  override render() {
    const time  = this.message?.time ? timeFormat.format(this.message?.time) : '';
    return html`<main>
      <time>${time}</time>
      ${this.displayAuthor ? html`<header>${this.message?.username}</header>`: ''}
      <p>${this.message?.text}</p>
    </main>`;
  }
}

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: 'numeric', second: 'numeric',
});

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-messages-item': ChatRoomMessagesItem,
  }
}
