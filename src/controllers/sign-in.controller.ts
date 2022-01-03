import {ReactiveController, ReactiveControllerHost} from 'lit';

const url = (path: string) => `/api/${path}`

export class SignInController implements ReactiveController {
  host: ReactiveControllerHost;
  username: string = '';
  private task!: Task;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    // this.task = new Task<[Names.Kind], Names.Result>(host,
    //   async ([kind]: [Names.Kind]) => {
    //     if (!kind?.trim()) {
    //       return initialState;
    //     }
    //     const response = await fetch(`${Names.baseUrl}${Names.kindIdMap[kind]}`);
    //     const result = await response.json();
    //     const error = (result as Names.Error).error;
    //     if (error !== undefined) {
    //       throw new Error(error);
    //     }
    //     return result as Names.Result;
    //   }, () => [this.kind]
    // );
  }

  hostConnected() {

  }

  hostDisconnected() {}

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