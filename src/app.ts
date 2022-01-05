import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./components/login-form.js";
import "./components/app-container.js";
import "./components/chat-room.js";
import {SignController} from "./controllers/sign.controller";
import {animate, AnimateController, fadeOut, flyAbove, flyBelow} from "@lit-labs/motion";
import {TemplateResult} from "lit-html";
import {MemberModel} from "./models/member.model";

@customElement('app-index')
export class AppElement extends LitElement {
  animationController = new AnimateController(this, {
    defaultOptions: {
      keyframeOptions: {
        fill: 'backwards',
      },
    },
  });

  private animations = {
    chatRoom: {
      keyframeOptions: {
        delay: 100,
        duration: 400
      },
      in: flyAbove,
      out: flyBelow
    },
    login: {
      duration: 100,
      out: flyAbove
    }
  };

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
      ? html`<chat-room 
            .currentMember=${this.currentMember}
            ${animate(this.animations.chatRoom)}
        ></chat-room>`
      : html`<login-form 
            @login=${this.onLogin}
            ${animate(this.animations.login)}
        ></login-form>`;

    return html`<app-container>${content}</app-container>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-index": AppElement,
  }
}
