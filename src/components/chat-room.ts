import {css, html, LitElement} from 'lit';
import {customElement, property, state} from "lit/decorators.js";

import "./chat-room-messages.js";
import "./chat-room-members.js";
import "./chat-room-message-form.js";
import {ChatRoomController} from "../controllers/chat-room.controller";

@customElement('chat-room')
export class ChatRoom extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: stretch;
      overflow: hidden;
      height: 80%;
      border-top: 16px solid #cecece;
      border-radius: 8px;
      padding: 0;
      background: url('/assets/ep_naturalwhite.png');
    }
    nav {
      width: 175px;
      background: #fefefe;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      border-right: 1px rgba(99, 99, 99, 0.1) solid;
    }
    main {
      display: flex;
      flex-direction: column;
    }
  `;

  @property()
  username?: String;

  private dataSource = new ChatRoomController(this);

  override render() {
    return html`<nav>
        <chat-room-members .members=${this.dataSource.members}></chat-room-members>
      </nav>
      <main>
        <chat-room-messages .messages=${this.dataSource.messages}></chat-room-messages>
        <chat-room-message-form></chat-room-message-form>
      </main>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chat-room": ChatRoom,
  }
}
