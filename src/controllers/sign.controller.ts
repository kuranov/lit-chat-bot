import {LitElement, ReactiveController, ReactiveControllerHost} from 'lit';

const url = (path: string) => `/api/${path}`
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
    this.postSignIn(username).then(() => {
      this.memberSetter({
        name: username,
        isBot: false,
      });
      this.host.requestUpdate();
    });
  }

  async postSignIn(username: string): Promise<any> {
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    const res = await fetch(url('signin'), {
      method: 'POST',
      body: JSON.stringify({username}),
      headers,
    });
    return res.json();
  }
}