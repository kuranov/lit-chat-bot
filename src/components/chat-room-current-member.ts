import {css, html, LitElement} from 'lit';
import {customElement, property, state} from "lit/decorators.js";
import {ChatRoomController} from "../controllers/chat-room.controller";
import {ScrollToBottomAfterUpdateDirective} from "../directives/scroll-to-bottom-after-update.directive";
import {directive} from 'lit/directive.js';

import "./chat-room-messages.js";
import "./chat-room-members.js";
import "./chat-room-message-form.js";

@customElement('chat-room-current-member')
export class ChatRoomCurrentMember extends LitElement {
  @property()
  currentMember!: MemberModel;

  override render() {
    return html`<main>${this.currentMember.avatar} ${this.currentMember.name}</main>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chat-room-current-member": ChatRoomCurrentMember,
  }
}
