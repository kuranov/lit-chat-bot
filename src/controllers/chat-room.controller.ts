import {ReactiveController, ReactiveControllerHost} from 'lit';

const url = (path: string) => `/api/${path}`

export class ChatRoomController implements ReactiveController {
  host: ReactiveControllerHost;
  members: MemberModel[] = [];
  messages: MessageModel[] = [];

  constructor(host: ReactiveControllerHost, timeout = 1000) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.loadData();
  }

  hostDisconnected() {
  }

  private loadData(): void {
    this.fetchMembers().then(members => {
      this.members = members;
      this.host.requestUpdate();
    });

    this.fetchMessages().then(messages => {
      this.messages = messages;
      this.host.requestUpdate();
    });
  }

  private async fetchMembers(): Promise<MemberModel[]> {
    return this.fetchJson<MemberModel[]>('members');
  }

  private fetchMessages(): Promise<MessageModel[]> {
    return this.fetchJson<MessageModel[]>('messages');
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const res = await fetch(url(path));
    return res.json();
  }
}