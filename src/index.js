const Discord = require('discord.js');  //discode.js를 가져옴
const client = new Discord.Client();    //봇 클라이언트 생성
const schedule = require('node-schedule'); // node-schedule 가져옴 
//.env 사용
const dotenv = require('dotenv');
dotenv.config();

//로그인 되었을 때  -> console.log 출력
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const everysecond = "* * * * * *";  //every second 
const every8AM = "* * 8 * * *"; //every 8AM

//메세지가 들어왔을 때
client.on('message', msg => {
  if (msg.content === 'ping') {
    schedule.scheduleJob(every8AM,function(){
        msg.reply('Pong!');
    })
  }
});

//로그인 토근은 유포되면 안됨
client.login(process.env.token);