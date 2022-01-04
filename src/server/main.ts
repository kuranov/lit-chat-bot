import express, {Response} from "express";
import expressWs from "express-ws";
import {avatarGenerator} from "../helpers/avatar-generator.js";
import {Bot} from "./bot.js";
import WebSocket from "ws";
import {serverConfig} from "./server-config.js";

const app = express();
const webSocket = expressWs(app).app;
const socketConnections: WebSocket[] = [];

const successResponse = (res: Response) => res.send({result: 'success'})
const members: MemberModel[] = [];
const messages: MessageModel[] = [];
const qa: QuestionAndAnswerModel[] = [];
const bot: Bot = new Bot(publishMessage);

// function searchForAnswer(message: MessageModel): QuestionAndAnswerModel {
//
// }

function publishMessage(message: MessageModel) {
  messages.push(message);
  socketConnections.forEach(ws => ws.send(JSON.stringify(message)));
  bot.onMessage(message);
}

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
webSocket.ws('/messages-stream', function (ws, req) {
  socketConnections.push(ws);
  ws.on('close', () => {

  });
});
app.get('/members', (req, res) => {
  res.send(members);
});
app.get('/messages', (req, res) => {
  res.send(messages);
});
app.post('/messages', (req, res) => {
  const message: MessageModel = req.body;
  publishMessage(message);
  successResponse(res);
});
app.post('/signin', function (req, res) {
  const name = req.body.username;
  onMemberOnline(name);
  successResponse(res);
});
app.listen(serverConfig.port, () => {
  console.log(`Example app listening at http://${serverConfig.host}:${serverConfig.port}`)
});