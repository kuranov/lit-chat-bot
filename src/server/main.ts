import express, {Response} from "express";
export type PublishMessageMethod = (message: MessageModel) => void;

export function generateAvatar(existing: string[] = [], forBot = false): string {
  if (forBot) {
    return '🤖';
  }
  const rangeStart = 0x1F400;
  const rangeEnd = 0x1F43C;

  let unique = false;
  let avatar = '';
  while (!unique) {
    const randomCharCode = Math.random() * Math.abs(rangeStart - rangeEnd);
    avatar = String.fromCharCode(randomCharCode);
    unique = !existing.includes(avatar);
  }
  return avatar;
}

export class Bot {

  profile: MemberModel = {
    name: 'James Bot',
    isBot: true,
    avatar: generateAvatar([], true)
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
    if (message.text.match(/hi/)) {
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

const serverConfig = {
  port: 3000,
};
const app = express();
const successResponse = (res: Response) => res.send({result: 'success'})
const members: MemberModel[] = [];
const messages: MessageModel[] = [];
const bot: Bot = new Bot();

function onPublishMessage(message: MessageModel) {
  messages.push(message);
  bot.onMessage(message);
}
bot.registerPublisher(onPublishMessage);

function onMemberOnline(username: string): MemberModel {
  const existing = members.find(m => m.name === username);
  if (existing) {
    bot.onMemberOnline(existing);
    return existing;
  }
  return registerMember(username);
}

function registerMember(username: string): MemberModel {
  const member: MemberModel = {
    name: username,
    avatar: generateAvatar(members.map(m => m.avatar)),
    isBot: false,
  };
  members.push(member);
  bot.onMemberRegister(member);
  return member;
}

// Bot join the chat!
members.push(bot.profile);

app.use(express.json());
app.get('/members', (req, res) => {
  res.send(members);
});
app.get('/messages', (req, res) => {
  res.send(messages);
});
app.post('/messages', (req, res) => {
  const message: MessageModel = req.body;
  onPublishMessage(message);
  successResponse(res);
});
app.post('/signin', function (req, res) {
  const name = req.body.username;
  onMemberOnline(name);
  successResponse(res);
});
app.listen(serverConfig.port, () => {
  console.log(`Example app listening at http://localhost:${serverConfig.port}`)
});