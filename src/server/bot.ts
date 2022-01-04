import {avatarGenerator} from "../helpers/avatar-generator.js";

export type PublishMessageMethod = (message: MessageModel) => void;

enum BotState {
  NEUTRAL,
  PENDING_FOR_ANSWER,
  PENDING_FOR_ANSWER_CONFIRMATION,
}

export class Bot {

  state: BotState = BotState.NEUTRAL;

  profile: MemberModel = {
    name: 'James Bot',
    isBot: true,
    avatar: avatarGenerator([], true)
  }

  constructor(private messagePublisher: PublishMessageMethod) {}

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
    if (message.username === this.profile.name) {
      return;
    }

    if (this.isGreeting(message)) {
      return this.sayHi(message);
    }

    if (this.isQuestion(message)) {
      this.sayHi(message);
      return;
    }
  }

  isGreeting(message: MessageModel): boolean {
    const needle = ['hello', 'hi', 'yo'];
    const pattern = new RegExp(`([^a-z]|^)(${needle.join('|')})([^a-z]|$)`, 'gmi');
    return pattern.test(message.text);
  }

  isQuestion(message: MessageModel): boolean {
    return /\?$/gm.test(message.text.trim());
  }

  sayHi(message: MessageModel): void {
    const response = this.createRandom([
      `Hello there!`,
      `Hey, ${message.username}! Whats up?`
    ]);
    this.publish(response);
  }

  publish(message: MessageModel) {
    this.messagePublisher(message);
  }

  private createRandom(items: string[]): MessageModel {
    return this.createMessage(this.rand(items));
  }
  private rand(items: string[]): string {
    return items[Math.floor(Math.random() * items.length)]
  }
}
