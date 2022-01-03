import express from "express";
import {serverConfig} from "./server-config";

const app = express();
const members: MemberModel[] = [];
const messages: MessageModel[] = [];

// Bot join the chat!
members.push({name: 'James Bot', isBot: true});

app.get('/members', (req, res) => {
  res.send(members);
});

app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/messages', (req, res) => {
  res.send(members);
});

app.post('/sign', function (req, res) {
  members.push({
    name: `${req.get('username')}`,
    isBot: false
  })
});

app.listen(serverConfig.port, () => {
  console.log(`Example app listening at http://localhost:${serverConfig.port}`)
});