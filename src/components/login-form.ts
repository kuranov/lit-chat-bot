import {css, html, LitElement} from 'lit';
import {customElement, query} from "lit/decorators.js";
import {inputTextCss} from "../css/input-text.css";
import {buttonCss} from "../css/button.css";

const loginIcon = new URL('../../../assets/icon-arrow-circle.svg', import.meta.url).href;

@customElement('login-form')
export class LoginFormElement extends LitElement {
  static override styles = [
    inputTextCss,
    buttonCss,
    css`
    * {
      font-family: var(--app-font-family);
    }
    form {
      display: flex;
      justify-content: center;
      align-items: stretch;
    }
    img {
      width: 24px;
      height: 24px;
    }
  `];

  @query('#name')
  nameInput!: HTMLInputElement;

  override render() {
    return html`<form @submit=${this.onFormSubmit}>
        <input id="name" type="text" placeholder="username" autocomplete="off" />
        <button>
          <img src="${loginIcon}" alt="Enter">
        </button>
    </form>`;
  }

  private onFormSubmit(event: Event): void {
    event.preventDefault();
    const name = this.nameInput.value.trim();
    const options = {
      detail: { name },
    };
    this.dispatchEvent(new CustomEvent('login', options));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "login-form": LoginFormElement,
  }
}
