import {LitElement, ReactiveController, ReactiveControllerHost} from 'lit';
import {fetchPost} from "../helpers/fetch-post";
import {MemberModel} from "../models/member.model";

type HostMemberSetter = (member: MemberModel) => void;

export class SignController implements ReactiveController {
  host: LitElement | ReactiveControllerHost;
  memberSetter!: HostMemberSetter;

  constructor(host: ReactiveControllerHost, memberSetter: HostMemberSetter) {
    (this.host = host).addController(this);
    this.memberSetter = memberSetter;
  }

  hostConnected() {}

  hostDisconnected() {}

  in(username: string): void {
    fetchPost('signin', {username}).then((res) => {
      this.memberSetter({
        name: username,
        isBot: false,
        avatar: username,
      });
      this.host.requestUpdate();
    });
  }
}
