import {css, html, LitElement} from 'lit';
import {customElement} from "lit/decorators.js";

@customElement('app-container')
export class AppContainer extends LitElement {

  static override styles = css`
    :host {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-container": AppContainer,
  }
}
