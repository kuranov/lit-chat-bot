import {ReactiveController, ReactiveControllerHost} from 'lit';
import {apiUrl} from "../helpers/api-url";
import {fetchPost} from "../helpers/fetch-post";
import {serverConfig} from "../server/server-config";
import {MemberModel} from "../models/member.model";
import {MessageModel} from "../models/message.model";
import {MemberEvent} from "../models/member.event";
import {ChatRoom} from "../components/chat-room";

const socketConnectionString = `ws://${serverConfig.host}:${serverConfig.port}/${serverConfig.wsMessagesPath}`;

export class ChatRoomController implements ReactiveController {
  host: ChatRoom;
  members: MemberModel[] = [];
  messages: MessageModel[] = [];
  socket: WebSocket  = new WebSocket(socketConnectionString);
  currentMember!: MemberModel;

  constructor(host: ChatRoom) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.loadData();
    this.subscribeToSocket();
    this.socketIntroduce();
  }

  hostDisconnected() {
    this.socket.close();
  }

  publishMessage(member: MemberModel, text: string): void {
    fetchPost('messages', {
      text,
      username: member.name,
      time: new Date()
    });
  }

  private subscribeToSocket(): void {
    this.socket.addEventListener('message', ({data}) => {
      const json = JSON.parse(data);
      if (json.messageEvent) {
        this.onNewMessage(json.messageEvent);
      }
      if (json.memberEvent) {
        this.onMember(json.memberEvent);
      }
      this.host.requestUpdate();
    });
  }

  onNewMessage(message: MessageModel): void {
    this.convertMessageDate(message);
    this.messages = [...this.messages, message];
  }

  onMember(memberEvent: MemberEvent): void {
    if (memberEvent.type === 'online') {
      this.members = [...this.members, memberEvent.member];
    }
    if (memberEvent.type === 'offline') {
      const memberIndex = this.members.findIndex(m => m.name === memberEvent.member.name);
      this.members = [
        ...this.members.slice(0, memberIndex),
        ...this.members.slice(memberIndex + 1),
      ];
    }
    this.host.requestUpdate();
  }

  private socketIntroduce(): void {
    this.socket.addEventListener('open', (event) => {
      this.socket.send(JSON.stringify({
        username: this.host.currentMember.name,
      }));
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
