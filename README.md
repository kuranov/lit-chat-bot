# Lit chat bot 🤖

## Description

Small but charming study project, written using [Lit](https://lit.dev) and [express.js](https://expressjs.com/)

I tried to keep everything very simple. Flat file structure. Each entity in separated file. Minimum external dependencies. There is only one stinking file: `src/server/main.ts`💩 It seems overloaded, but in the same time it's only 100 lines and covers all backend routines. `bot.ts` is pretty ☺️  

This project is not ideal, I had very limited time, and I still have more todo list items in 'to do' state than in 'done' state (listed below).

Demo video: 🎥[https://www.youtube.com/watch?v=yzgIJ80_gV8 ](https://www.youtube.com/watch?v=yzgIJ80_gV8)

## Quickstart

To get started you have to launch web-dev-server for front-end application and node.js script for back-end part.

```sh
npm i
npm run start
npm run start:server
```

## Limitations

* No production build
* Not responsive, fixed layout
* Data stored in memory, no databases, no persistence
* There is no network and backend error handling on UI, expects that everything is perfect 😇
* No pending state indication on UI, expects that server handles requests immediately 🚀

## Features

* Random avatar for each user 🐯
* WebSocket
  * Live update of list of members. Both online and offline user events
  * Push messages from users and from bots to all active chats
* Bot interactions
  * Greeting users, just type _hi_, _hello_ or _yo_ (case insensitive)
  * When bot see a question in the chat, he starts to watch for an answer from other chat members
  * When bot receive answer for asked question it suggest to user a choice to remember that answer or not by typing 'yes' or 'no' to the chat
  * If user types 'yes' bot saves answer 
  * Next time automatically answers for the similar question in the chat
    * Search works with [string-similarity](https://www.npmjs.com/package/string-similarity) package for strings comparison
    * Return strings with more than 70% similarity

## TODO

Things that I dreamed, but not made.

* Good animations 
  * Of messages appearing. Want to spend more time on it. I wanted to build sequence of messages appearing 
  * Transition between login form and chat room, I wanted to write own animations for item in flex container, default isn't working as expected
* Microinteractions
  * Indication of typing: when somebody types something in message input everybody see pencil animation close to active member name
  * Imitation of bot's typing: before bot sends something firstly imitate typing state
* [Markdown](https://www.markdownguide.org/) support
* Use Task from [@lit-labs/task](https://www.npmjs.com/package/@lit-labs/task) for authorization process
* When focus in message text input pressing on KEYBOARD UP pastes previous message as input value
* Different types of information in chat: not only messages, for example logs of events such as `${username} logged in`
* Theming, css variables

## Scripts

- `start` runs web-dev-server for UI application
- `start:server` runs backend application
