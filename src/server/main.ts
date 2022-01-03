import express from "express";
// import {serverConfig} from "./server-config";
const serverConfig = {
  port: 3000,
};
const app = express();
const members: MemberModel[] = [];
const messages: MessageModel[] = [];

// Bot join the chat!
members.push({name: 'James Bot', isBot: true});

app.use(express.json());

app.get('/members', (req, res) => {
  res.send(members);
});

app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/messages', (req, res) => {
  res.send(members);
});

app.post('/signin', function (req, res) {
  const name = req.body.username;
  let member = members.find((el) => el.name === name);

  if (!member) {
    member = { name, isBot: false };
    members.push(member);
  }
  res.send({
    result: 'success',
    member,
  });
});

app.listen(serverConfig.port, () => {
  console.log(`Example app listening at http://localhost:${serverConfig.port}`)
});