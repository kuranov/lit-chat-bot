import {ReactiveController, ReactiveControllerHost} from 'lit';
import {serverConfig} from "../server/server-config";

export class ChatRoomController implements ReactiveController {
  host: ReactiveControllerHost;

  // serverUrl = `localhost:${serverConfig.port}`;
  members: MemberModel[] = [];
  messages: MessageModel[] = [];

  constructor(host: ReactiveControllerHost, timeout = 1000) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.fetchMembers();
  }

  hostDisconnected() {
  }

  private url(path: string): string {
    return `/api/${path}`;
  }

  private fetchMembers(): void {
    fetch(this.url(`members`))
      .then(members => {
        console.log('members response', members);
        // this.members = members;
      });
  }
}