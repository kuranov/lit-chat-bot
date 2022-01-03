import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";

@customElement('chat-room-members')
export class ChatRoomMembers extends LitElement {
  static override styles = css`
    ul {
      padding: 16px;
    }
    li {
      list-style: none;
    }
  `;

  @property()
  membersList: any[] = [
    'bot'
  ];

  override render() {
    if (!Array.isArray(this.membersList)) {
      this.membersList = [this.membersList];
    }
    return html`<ul>
      ${this.membersList?.map(member => html`<li>${member}</li>`)}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-members': ChatRoomMembers,
  }
}
