import {avatarGenerator} from "../helpers/avatar-generator.js";

export type PublishMessageMethod = (message: MessageModel) => void;

enum BotState {
  NEUTRAL,
  PENDING_FOR_ANSWER,
  PENDING_FOR_ANSWER_CONFIRMATION,
}

export class Bot {

  state: BotState = BotState.NEUTRAL;

  pendingQuestion?: MessageModel;

  profile: MemberModel = {
    name: 'James Bot',
    isBot: true,
    avatar: avatarGenerator([], true)
  }

  questionsAndAnswers: QuestionAndAnswerModel[] = [];

  constructor(private messagePublisher: PublishMessageMethod) {}

  createMessage(text: string): MessageModel {
    return {
      text: text,
      username: this.profile.name,
      time: new Date(),
    }
  }

  onMemberRegister(member: MemberModel): void {
    this.publish(this.createRandom([
      `${member.name}, haven't seen you here before! Glad to see you!`,
      `Wow, new faces! Hi, ${member.name}!`,
      `Welcome abroad, ${member.name}!`,
    ]));
    return;
  }

  onMemberOnline(member: MemberModel): void {
  }

  onMessage(message: MessageModel): void {
    if (message.username === this.profile.name) {
      return;
    }

    if (this.state === BotState.PENDING_FOR_ANSWER) {
      return this.handlePendingForAnswer(message);
    }

    if (this.state === BotState.PENDING_FOR_ANSWER_CONFIRMATION) {
      return this.handlePendingForAnswerConfirmation(message);
    }

    if (this.isQuestion(message)) {
      this.pendingQuestion = message;
      this.state = BotState.PENDING_FOR_ANSWER;
      return;
    }

    if (this.isGreeting(message)) {
      return this.sayHi(message);
    }
  }

  handlePendingForAnswer(message: MessageModel): void {
    [
      'Seems like it is answer for previous question, right?',
      `Question: "${this.pendingQuestion?.text}"`,
      `Save answer? Type 'Yes' or 'No'`,
    ]
    .forEach(txt => this.publish(this.createMessage(txt)));

    this.state = BotState.PENDING_FOR_ANSWER_CONFIRMATION;
  }

  handlePendingForAnswerConfirmation(message: MessageModel): void {
    if (!this.pendingQuestion) {
      return;
    }

    const [yes, no] = [this.isYes(message), this.isNo(message)];

    if (!yes && !no) {
      this.publish(this.createRandom([
        'Please, just Yes or No',
        'Not clear… I\'m just a robot, help me to understand you, say Yes or No',
        'Hm-m, I wait for Yes or No, simple deal',
      ]));
      return;
    }

    if (yes) {
      this.questionsAndAnswers.push({
        question: this.pendingQuestion!,
        answer: message,
      });
      this.publish(this.createRandom([
        'Okay, got it!',
        'Yep, saved!',
        'I will keep it!',
      ]));
    }

    if (no) {
      this.publish(this.createRandom([
        'Nevermind…',
        ':(',
        'Fine.'
      ]));
    }

    this.pendingQuestion = undefined;
    this.state = BotState.NEUTRAL;
  }

  isYes(message: MessageModel): boolean {
    return /^yes/i.test(message.text.trim());
  }

  isNo(message: MessageModel): boolean {
    return /^no/i.test(message.text.trim());
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
      `${message.username}, glad to see you here :)`,
      `Hey, ${message.username}! Whats up?`,
      `How it's going, ${message.username}?`,
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
