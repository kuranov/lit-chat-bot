import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import "./components/login-form.js";
import "./components/app-container.js";
import "./components/chat-room.js";
import {SignController} from "./controllers/sign.controller";

@customElement('app-index')
export class AppElement extends LitElement {
  @state()
  currentMember!: MemberModel;

  sign = new SignController(this, (member) => {
    this.currentMember = member;
  });

  onLogin(event: CustomEvent) {
    this.sign.in(event.detail.name);
  }

  override render() {
    const content = this.currentMember
      ? html`<chat-room .currentMember=${this.currentMember}></chat-room>`
      : html`<login-form @login=${this.onLogin}></login-form>`;

    return html`<app-container>${content}</app-container>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-index": AppElement,
  }
}
