import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import "./components/login-form.js";
import "./components/app-container.js";
import "./components/chat-room.js";

@customElement('app-index')
export class AppElement extends LitElement {

  @state()
  name?: string = 'Anton';

  onLogin(event: CustomEvent) {
    this.name = event.detail.name;
  }

  override render() {
    const content = this.name
      ? html`<chat-room username=${this.name}></chat-room>`
      : html`<login-form @login=${this.onLogin}></login-form>`;

    return html`<app-container>${content}</app-container>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-index": AppElement,
  }
}
