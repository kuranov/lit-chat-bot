import {ReactiveController, ReactiveControllerHost} from 'lit';
import {apiUrl} from "../helpers/api-url";
import {fetchPost} from "../helpers/fetch-post";

export class ChatRoomController implements ReactiveController {
  host: ReactiveControllerHost;
  members: MemberModel[] = [];
  messages: MessageModel[] = [];

  constructor(host: ReactiveControllerHost, currentMember: MemberModel) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.loadData();
  }

  hostDisconnected() {}

  publishMessage(member: MemberModel, text: string): void {
    fetchPost('messages', {
      text,
      username: member.name,
      time: new Date()
    }).then(() => {
      this.loadMessages();
    });
  }

  private loadData(): void {
    this.fetchMembers().then(members => {
      this.members = members;
      this.host.requestUpdate();
    });

    this.loadMessages();
  }

  private loadMessages(): void {
    this.fetchMessages().then(messages => {
      messages.forEach(m => {
        m.time = new Date(Date.parse(m.time as unknown as string));
      });
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
    const res = await fetch(apiUrl(path));
    return res.json();
  }
}