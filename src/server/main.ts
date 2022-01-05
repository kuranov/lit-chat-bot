import express, {Response} from "express";
import expressWs from "express-ws";
import {avatarGenerator} from "../helpers/avatar-generator.js";
import {Bot} from "./bot.js";
import WebSocket, {Data} from "ws";
import {serverConfig} from "./server-config.js";
import {MessageModel} from "../models/message.model";
import {MemberModel} from "../models/member.model";
import {MemberEvent} from "../models/member.event";

const app = express();
const webSocket = expressWs(app).app;
const socketConnections: WebSocket[] = [];

const successResponse = (res: Response) => res.send({result: 'success'})
const members: MemberModel[] = [];
const messages: MessageModel[] = [];
const bot: Bot = new Bot(publishMessage);

function publishMessage(message: MessageModel) {
  messages.push(message);
  const jsonString = JSON.stringify({
    messageEvent: message,
  });
  socketConnections.forEach(ws => ws.send(jsonString));
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

function publishMemberEvent(member: MemberModel, type: 'online' | 'offline'): void {
  const memberEvent: MemberEvent = { type, member };
  const jsonString = JSON.stringify({memberEvent});
  socketConnections.forEach(ws => ws.send(jsonString));
}

function registerMember(username: string): MemberModel {
  const member: MemberModel = {
    name: username,
    avatar: avatarGenerator(members.map(m => m.avatar)),
    isBot: false,
  };
  members.push(member);
  bot.onMemberRegister(member);
  publishMemberEvent(member, 'online');

  return member;
}

// Bot join the chat!
members.push(bot.profile);

app.use(express.json());
webSocket.ws('/messages-stream', function (ws, req) {
  socketConnections.push(ws);
  let username: string = '';

  ws.on('message', (data: Data) => {
    const json = JSON.parse(data.toString());
    if (json.username) {
      username = json.username;
    }
  });

  ws.on('close', () => {
    if (!username) {
      return;
    }
    const memberIndex = members.findIndex((m) => m.name === username);
    const [removedMember] = members.splice(memberIndex, 1);
    socketConnections.splice(socketConnections.indexOf(ws), 1);
    publishMemberEvent(removedMember, 'offline');
    bot.onMemberOffline(removedMember);
  });
});
app.get('/members', (req, res) => res.send(members));
app.get('/messages', (req, res) => res.send(messages));
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
  console.log(`Listening at http://${serverConfig.host}:${serverConfig.port}`)
});
