import {css, html, LitElement} from 'lit';
import {customElement, query} from "lit/decorators.js";
import {buttonCss} from "../css/button.css";
import {inputTextCss} from "../css/input-text.css";
const sendIcon = new URL('../../../assets/icon-send.svg', import.meta.url).href;

@customElement('chat-room-message-form')
export class ChatRoomMessageForm extends LitElement {

  static override styles = [
    buttonCss,
    css`
      input, input:focus {
        border: 1px solid #fff;
        border-radius: 8px 0 0 8px ;
        padding: 6px;
        font-size: 16px;
        background: transparent;
        outline: none;
      }
      form {
        padding: 10px;
        display: flex;
        justify-content: stretch;
        align-items: stretch;
        background: #fff;
      }
      input {
        flex-grow: 1;
      }
      img {
        height: 24px;
        width: 24px;
      }
    `
  ];

  @query('#text')
  textInput!: HTMLInputElement;

  override render() {
    return html`<form @submit=${this.onFormSubmit}>
        <input id="text" type="text" placeholder="Message…" autocomplete="off" />
        <button>
          <img src="${sendIcon}" alt="Enter">
        </button>
    </form>`;
  }

  private onFormSubmit(event: Event): void {
    event.preventDefault();
    const text = this.textInput.value.trim();
    this.dispatchEvent(new CustomEvent('message', {
      detail: { text },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room-message-form': ChatRoomMessageForm,
  }
}
