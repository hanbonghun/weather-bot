const Discord = require('discord.js');  //discode.js를 가져옴
const client = new Discord.Client();    //봇 클라이언트 생성
const schedule = require('node-schedule'); // node-schedule 가져옴 
const axios = require('axios');

//.env 사용
const dotenv = require('dotenv');
dotenv.config();

let lat,lon;
let location;
let job;

// event schedule
const everysecond = "* * * * * *";  //every second 
const every8AM = "* * 8 * * *"; //every 8AM
const everyMin = "* * * * *"; //every Minute

//위치설정
function getCoord(location){
    const locationURI = encodeURI(location); //location 인코딩 해줌
    return axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${locationURI}`,
      {headers: {
          Authorization: `KakaoAK ${process.env.kakaoAPIKey}`  
        } 
      }
    )
    .then((response) => {
        lon = response.data.documents[0].address.x;
        lat = response.data.documents[0].address.y;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
// 날씨 얻는 함수
function getWeather(){
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.weatherAPIKey}`;
    return axios.get(url).then(function(response){
        return response.data;
    })
  }

//로그인 되었을 때  -> console.log 출력
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//메세지가 들어왔을 때
client.on('message', async msg => {
    //메세지 들어옴
  if (msg.content === '인사') {
        msg.reply('안녕하세요!');
  }

  else if (msg.content === '그만') {
    job.cancel();
    msg.reply('취소되었습니다.');
  }

  //위치 설정 명령어 
  else if(msg.content.split(' ')[0] === "위치"){
      location  = msg.content.split(' ')[1];
      await getCoord(location);
      msg.reply(`위치가 ${location}으로 설정되었습니다.`);
  }


  // 알람 시작
  else if(msg.content === '시작'){
      job = schedule.scheduleJob(every8AM, async function(){
      if(location){
        let weatherData = await getWeather();
        msg.author.send(location +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
        msg.author.send(location +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + "도 입니다.");
      }
      else{
        msg.author.send('위치 정보를 먼저 정해주세요');
      }
    });
  }
});
  
//로그인 토근은 유포되면 안됨
client.login(process.env.token);
