import {LitElement, ReactiveController, ReactiveControllerHost} from 'lit';
import {fetchPost} from "../helpers/fetch-post";

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
      console.log('res', res);
      this.memberSetter({
        name: username,
        isBot: false,
        avatar: username,
      });
      this.host.requestUpdate();
    });
  }
}