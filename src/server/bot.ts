import {avatarGenerator} from "../helpers/avatar-generator.js";
import {compareTwoStrings} from 'string-similarity';
import {PublishMessage} from "../models/publish-message.type";
import {MemberModel} from "../models/member.model";
import {MessageModel} from "../models/message.model";
import {QuestionAndAnswerModel} from "../models/question-and-answer.model";

enum BotState {
  NEUTRAL,
  PENDING_FOR_ANSWER,
  PENDING_FOR_ANSWER_CONFIRMATION,
}

export class Bot {
  profile: MemberModel = {
    name: 'James Bot',
    isBot: true,
    avatar: avatarGenerator([], true)
  }
  state: BotState = BotState.NEUTRAL;
  pendingQuestion?: MessageModel;
  pendingAnswer?: MessageModel;
  questionsAndAnswers: QuestionAndAnswerModel[] = [];
  answerSimilarityLevel = 0.7;

  constructor(private messagePublisher: PublishMessage) {}

  onMemberRegister(member: MemberModel): void {
    this.pickAndPublish([
      `${member.name}, haven't seen you here before! Glad to meet you!`,
      `Wow, new faces! Hi, ${member.name}!`,
      `Welcome abroad, ${member.name}!`,
    ]);
  }

  onMemberOnline(member: MemberModel): void {}

  onMemberOffline(member: MemberModel): void {
    this.pickAndPublish([
      `${member.name}, you didn't even say goodbye!`,
      `I hope ${member.name} left in a good mood!`,
      `Bye, I will miss!`,
    ]);
  }

  onMessage(message: MessageModel): void {
    if (this.isMyOwnMessage(message)) {
      return;
    }

    if (this.isHelpCommand(message)) {
      return this.handleHelp(message);
    }

    if (this.state === BotState.PENDING_FOR_ANSWER) {
      return this.handlePendingForAnswer(message);
    }

    if (this.state === BotState.PENDING_FOR_ANSWER_CONFIRMATION) {
      return this.handlePendingForAnswerConfirmation(message);
    }

    if (this.isQuestion(message) && !this.searchAnswerAndPublish(message)) {
      this.pendingQuestion = message;
      this.state = BotState.PENDING_FOR_ANSWER;
      return;
    }

    if (this.isGreeting(message)) {
      return this.sayHi(message);
    }
  }

  searchAnswerAndPublish(message: MessageModel): boolean {
    const qa = this.searchAnswers(message);
    if (!qa) {
      return false;
    }

    this.publishAll([
      `I've found answer for similar question!`,
      `Q: ${qa.question.text}`,
      `A: ${qa.answer.text}`,
    ]);

    return true;
  }

  searchAnswers(message: MessageModel): QuestionAndAnswerModel | undefined {
    return this.questionsAndAnswers.find(qa =>
      compareTwoStrings(qa.question.text, message.text) > this.answerSimilarityLevel
    );
  }

  handlePendingForAnswer(message: MessageModel): void {
    this.publishAll([
      'Seems like it is answer for previous question, right?',
      `Q: ${this.pendingQuestion?.text}`,
      `A: ${message.text}`,
      `Save answer? Type 'Yes' or 'No'`,
    ]);
    this.pendingAnswer = message;
    this.state = BotState.PENDING_FOR_ANSWER_CONFIRMATION;
  }

  handlePendingForAnswerConfirmation(message: MessageModel): void {
    if (!this.pendingQuestion) {
      return;
    }

    const [yes, no] = [this.isYes(message), this.isNo(message)];

    if (!yes && !no) {
      this.pickAndPublish([
        `Please, just 'Yes' or 'No'`,
        `Not clear… I'm just a robot, help me to understand you, type 'Yes' or 'No'`,
        `Hm-m, I'm waiting for 'Yes' or 'No', simple deal!`,
      ]);
      return;
    }

    if (yes) {
      this.questionsAndAnswers.push({
        question: this.pendingQuestion!,
        answer: this.pendingAnswer!,
      });
      this.pickAndPublish([
        'Okay, got it!',
        'Yep, saved!',
        'I will keep it!',
      ]);
    }

    if (no) {
      this.pickAndPublish([
        'Nevermind',
        'Okay, next time',
        'Fine.'
      ]);
    }

    this.pendingAnswer = undefined;
    this.pendingQuestion = undefined;
    this.state = BotState.NEUTRAL;
  }

  handleHelp(message: MessageModel): void {
    this.publishAll([
      `My name is James Bot!`,
      `I'm a robot`,
      `I have a beautiful metallic head. You could see my face in the left corner of that window`,
      `If you text (hi|hello|yo), I'll greet you`,
      `If you've left a chat I say goodbye`,
      `If you ask a question, I'm listening for an answer and if you don't mind remember it forever!`,
      `Next time if you ask a similar question I immediately answer with the previous answer!`
    ]);
  }

  isMyOwnMessage(message: MessageModel): boolean {
    return message.username === this.profile.name;
  }

  isHelpCommand(message: MessageModel): boolean {
    return /^\/help/i.test(message.text.trim());
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
    this.pickAndPublish([
      `${message.username}, glad to see you here :)`,
      `Hey, ${message.username}! Whats up?`,
      `How it's going, ${message.username}?`,
    ]);
  }

  private publish(message: MessageModel) {
    this.messagePublisher(message);
  }

  private publishAll(items: string[]): void {
    items.forEach(txt => this.publish(this.messageFromText(txt)));
  }

  private pickAndPublish(items: string[]): void {
    this.publish(this.pickRandomAndCreateMessage(items));
  }

  private pickRandomAndCreateMessage(items: string[]): MessageModel {
    return this.messageFromText(this.pickRandomFrom(items));
  }

  private pickRandomFrom(items: string[]): string {
    return items[Math.floor(Math.random() * items.length)]
  }

  private messageFromText(text: string): MessageModel {
    return {
      text: text,
      username: this.profile.name,
      time: new Date(),
    }
  }
}
