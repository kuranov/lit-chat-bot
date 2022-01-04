import {ReactiveController, ReactiveControllerHost} from 'lit';
import {apiUrl} from "../helpers/api-url";
import {fetchPost} from "../helpers/fetch-post";
import {serverConfig} from "../server/server-config";

const socketConnectionString = `ws://${serverConfig.host}:${serverConfig.port}/${serverConfig.wsMessagesPath}`;

export class ChatRoomController implements ReactiveController {
  host: ReactiveControllerHost;
  members: MemberModel[] = [];
  messages: MessageModel[] = [];
  socket: WebSocket = new WebSocket(socketConnectionString);

  constructor(host: ReactiveControllerHost, currentMember: MemberModel) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.loadData();
    this.subscribeToSocket();
  }

  hostDisconnected() {}

  publishMessage(member: MemberModel, text: string): void {
    fetchPost('messages', {
      text,
      username: member.name,
      time: new Date()
    }).then(() => {});
  }

  private subscribeToSocket(): void {
    this.socket.addEventListener('message', ({data}) => {
      const message = JSON.parse(data);
      this.convertMessageDate(message);
      this.messages = [...this.messages, message];
      this.host.requestUpdate();
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
        this.convertMessageDate(m);
      });
      this.messages = messages;
      this.host.requestUpdate();
    });
  }

  private convertMessageDate(message: MessageModel): void {
    message.time = new Date(Date.parse(message.time as unknown as string));
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