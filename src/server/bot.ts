import {avatarGenerator} from "../helpers/avatar-generator.js";

export type PublishMessageMethod = (message: MessageModel) => void;

export class Bot {

  profile: MemberModel = {
    name: 'James Bot',
    isBot: true,
    avatar: avatarGenerator([], true)
  }

  private publishMessage?: PublishMessageMethod;

  constructor(publishMessage?: PublishMessageMethod) {
    this.publishMessage = publishMessage;
  }

  registerPublisher(publishMessage: PublishMessageMethod): void {
    this.publishMessage = publishMessage;
  }

  createMessage(text: string): MessageModel {
    return {
      text: text,
      username: this.profile.name,
      time: new Date(),
    }
  }

  onMemberRegister(member: MemberModel): void {

  }

  onMemberOnline(member: MemberModel): void {

  }

  onMessage(message: MessageModel): void {
    if (message.text.match(/(hello|hi)/)) {
      this.greeting(message);
      return;
    }
  }

  greeting(message: MessageModel): void {
    const response = this.createRandom([
      'Hello there!',
      'Whats up, man?'
    ]);
    if (this.publishMessage) {
      this.publishMessage(response);
    }
  }

  private createRandom(items: string[]): MessageModel {
    return this.createMessage(this.rand(items));
  }
  private rand(items: string[]): string {
    return items[Math.floor(Math.random() * items.length)]
  }
}
