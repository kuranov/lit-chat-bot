import {css, html, LitElement} from 'lit';
import {customElement, property} from "lit/decorators.js";

@customElement('chat-room-members')
export class ChatRoomMembers extends LitElement {
  static override styles = css`
    header {
      margin: 6px 0 0 16px;
      font-size: 12px;
      color: #999;
    }
    ul {
      padding: 0 16px;
      margin: 4px 0 0 0;
    }
    li {
      list-style: none;
      font-size: 16px;
      color: #444;
    }
    i {
      display: inline-block;
      font-style: normal;
    }
  `;

  @property()
  members: MemberModel[] = [];

  override render() {
    return html`<header>Active users</header>
      <ul>
      ${this.members?.map(member => 
        html`<li>
          <i>${member.avatar}</i>
          ${member.name}
        </li>`
      )}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-members': ChatRoomMembers,
  }
}
