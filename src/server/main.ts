import express, {Response} from "express";
import {avatarGenerator} from "../helpers/avatar-generator.js";
import {Bot} from "./bot.js";
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
    avatar: avatarGenerator(members.map(m => m.avatar)),
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