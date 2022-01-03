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
  members: MemberModel[] = [];

  override render() {
    return html`<ul>
      ${this.members?.map(member => 
        html`<li>
          <i class="${member.isBot ? 'bot' : 'human'}"></i>
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
