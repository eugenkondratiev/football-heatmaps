
/**
 *  Нужно ставить сюда ссылку на тв отчет, в кавычки.
 * Сохранить. Обновить или открыть снова файл index.html
 */
const tvurl = "http://pefl.ru/tv/#/j=1054002&z=51b806bbe7b6e3db62cf09e3e110355c";








const MAX_VALUE = 60;
const MAX_OPACITY = .7;
const MIN_OPACITY = .05;
const POINT_RADIUS = 35;
const MAX_PLAYERS = 18;

const GK_VALUE = .2;

const BALL_RADIUS_KEFF = .67;
const BALL_MAX_KEFF = 0.33;

const BALL_TACTICS_RADIUS_KEFF = 1.1;
const BALL_TACTICS_MAX_KEFF = 0.35;

const TEAM_RADIUS_KEFF = .65;
const TEAM_MAX_KEFF = 1.1;
//==============================================================================
function formJsonUrl(tvurl) {
    const zIndex =tvurl.indexOf('&z=');
    const jIndex =tvurl.indexOf('#/j=');

    return `http://pefl.ru/jsonreport.php?j=${ tvurl.substring(4 + jIndex, zIndex)}&z=${ tvurl.substring(3+ zIndex)}`;
}

console.log("jsonurl   - ", formJsonUrl(tvurl));
//==============================================================================
function createHeatMap(rep, corners, jsoncorners) {
    const leftTopX = corners.leftTopX || 20;
    const leftTopY =  corners.leftTopY ||  20;
    const rightBottomX =  corners.rightBottomX || 347;
    const rightBottomY = corners.rightBottomY || 230;
    
    const jsonX1 = jsoncorners.X1 || 0;
    const jsonY1 = jsoncorners.Y1 || 0;
    const jsonX2 = jsoncorners.X2 || 720;
    const jsonY2 = jsoncorners.Y2 || 450;

    function limitPoint(point, secondTime = false) {
        const x = point.x;
        const y = point.y;
        let newX;
        let newY;
        if (secondTime) {
            newX = Math.round(rightBottomX - (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
            newY = Math.round(rightBottomY - (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
        } else {
            newX = Math.round(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
            newY = Math.round(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
        }

        return { x: newX, y: newY, value: point.value }
    }

    const game = rep.game;
    game.shift();
    game.pop();
    
    // console.log(game);
    // const ballPoints = [];

    const homeTeamPoints = [];
    const awayTeamPoints = [];

//TODO  вынести расчет в функцию (jsonreport) => массив тепловых карты мяча,команд, игроков команд.

}

//==============================================================================

window.onload = function() {

      var xmlhttp = new XMLHttpRequest();
    //   xmlhttp.overrideMimeType("application/json");
      
      xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 /*&& this.status == 200*/) {
          if (this.status == 200) {
            const scoreWithPens = this.responseText.match(/\d+:\d+/g).pop();
            console.log(scoreWithPens);

            const rep = JSON.parse(this.responseText);
            console.log(rep);

  
              console.log(rep.home.players);
              const leftTopX = 18.98;
              const leftTopY = 19;
              const rightBottomX = 346.56;
              const rightBottomY = 229.5;
              
              const jsonX1 = 0;
              const jsonY1 = 0;
              const jsonX2 = 720;
              const jsonY2 = 450;
              
              function limitPoint(point, secondTime = false) {
                  const x = point.x;
                  const y = point.y;
                  let newX;
                  let newY;
                  if (secondTime) {
                      newX = Math.round(rightBottomX - (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                      newY = Math.round(rightBottomY - (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                  } else {
                      newX = Math.round(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                      newY = Math.round(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                  }
  
                  return { x: newX, y: newY, value: point.value }
              }
  
  
              const game = rep.game;
              game.shift();
              game.pop();
              
              // console.log(game);
              const ballPoints = [];
   
                const strangePoints = {home: [], away: []};
  
               const homeTacticPoints = [];
               const awayTacticPoints = [];
               homeTacticPoints.push({start:0, end:1, period:0, team: [], ball: []});
               awayTacticPoints.push({start:0, end:1, period:0, team: [], ball: []});

              const homePoints = [];
              const awayPoints = [];
              for (let i = 0; i <= MAX_PLAYERS ; i++) {
                  homePoints.push([]);
                  awayPoints.push([]);
              }

              let secondTime = false;
              var penalties = false;
              let score = ""; 
            try {
                game.forEach(element => {
                    if (element.messages[0]) { // изменение счета и пенальти
                        element.messages.forEach(mes => {
                            if (mes.mes.indexOf(' СЧЕТ ') > -1){
                                score = mes.mes.replace(' СЧЕТ ','');
                                console.log(score);
                            };
                        });

                        if (element.messages[0].mes == "Серия пенальти!...") {
                            penalties = true; //может на будущее
                          throw "Серия пенальти!...";
                        }
                        
                    }
                    if (element.ZT) { // смена тактики
                        if (element.ZT.team == 1) {
                            homeTacticPoints[0].end = element.minute;
                            homeTacticPoints[0].period = element.minute - homeTacticPoints[0].start;
                            homeTacticPoints.push(homeTacticPoints[0]);
                            homeTacticPoints[0] = {start: element.minute , end: 125, period: (125 - element.minute), team: [], ball: []};
                            
                        } else {
                            awayTacticPoints[0].end = element.minute;
                            awayTacticPoints[0].period = element.minute - awayTacticPoints[0].start;
                            awayTacticPoints.push(awayTacticPoints[0]);
                            awayTacticPoints[0] = {start: element.minute , end: 125, period: (125 - element.minute), team: [], ball: []};
                         }
                    }

                    let coords;
                      if (element.M) { // смена сторон. конец тайма.
                          
                          secondTime = !secondTime;
                          console.log(secondTime, element)
                        };
                           
                    if (element.coordinates) 
                        {
                            const ball = element.coordinates.ball;
                            const ballcoords = {x: ball.w, y: ball.h, value:1};
    
                            const hometeam = element.coordinates.home;
                            const awayteam = element.coordinates.away;
    
                            hometeam.forEach(pl => {
                                coords = pl.n == 1 
                                        ?{x: pl.w, y: pl.h, value:GK_VALUE}
                                        :{x: pl.w, y: pl.h, value:1};
                                if (pl.n <= MAX_PLAYERS ){
                                    const playerPoints = limitPoint(coords, secondTime);

                                    homePoints[pl.n].push(playerPoints);
                                    homePoints[0].push(playerPoints);
                                    homeTacticPoints[0].team.push(playerPoints);
                                } else {
                                    strangePoints.home.push(pl);
                                }
                            });
                            awayteam.forEach(pl => {
                                coords = pl.n == 1 
                                        ?{x: pl.w, y: pl.h, value:GK_VALUE}
                                        :{x: pl.w, y: pl.h, value:1};
                                if (pl.n <= MAX_PLAYERS ){
                                    const playerPoints = limitPoint(coords, !secondTime);
                                    awayPoints[pl.n].push(playerPoints);
                                    awayPoints[0].push(playerPoints);
                                    awayTacticPoints[0].team.push(playerPoints);
                                } else {
                                    strangePoints.away.push(pl);
                                }
    
             
                             });       
    
                             const ballHeatMap = limitPoint(ballcoords, secondTime);
                            ballPoints.push(ballHeatMap)
                            homeTacticPoints[0].ball.push(ballHeatMap);
                            awayTacticPoints[0].ball.push(ballHeatMap);

                        } 
                }); 
            } catch (error) {
                console.log(error);
            }
            homeTacticPoints.push(homeTacticPoints[0]);
            awayTacticPoints.push(awayTacticPoints[0]);

            const finalScore = score + (scoreWithPens == score ? '' : `(${scoreWithPens})`);

            const gameInfoSrting = rep.date + ". " + rep.stadium.city + ". "+ rep.stadium.name 
            + ". " + rep.home.team.name + " - " + rep.away.team.name + " " + finalScore;
      
            document.querySelector("#gameInfo").textContent = gameInfoSrting;

            const heatmapInstance = h337.create({
              // only container is required, the rest will be defaults
              container: document.querySelector('#heatmapHome'),
              // gradient: {
              //     // enter n keys between 0 and 1 here
              //     // for gradient color customization
              //     '.5': 'blue',
              //     '.8': 'green',
              //     '.95': 'red'
              //   },
                // the maximum opacity (the value with the highest intensity will have it)
              //   blur: 0.4, //Default value: 0.85
                   maxOpacity: MAX_OPACITY,
                // minimum opacity. any value > 0 will produce
                // no transparent gradient transition
                  minOpacity: MIN_OPACITY,
              //    opacity: 0.8
              radius: POINT_RADIUS * TEAM_RADIUS_KEFF
              // radius: POINT_RADIUS
            });
            const heatmapInstance2 = h337.create({
              container: document.querySelector('#heatmapAway'),
              maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS * TEAM_RADIUS_KEFF 
  
            });
  
            const heatmapInstance3 = h337.create({
              container: document.querySelector('#heatmapBall'),
              maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS * BALL_RADIUS_KEFF
  
            });
            const heatPoints = [
              {
                  x: 19,
                  y: 19,
                  value: 200,
                  radius: 2
              },
              {
                  x: 347,
                  y: 230,
                  value: 200,
                  radius: 2
              }
            //   ,
            //   {
            //       x: 200,
            //       y: 200,
            //       value: 70
            //   }
              
                 
                 
            ];
  
            const maximumValue = MAX_VALUE;
      
          const data = {
              max: maximumValue * TEAM_MAX_KEFF,
              data: homePoints[0]
          };
      
          heatmapInstance.setData(data);
          heatmapInstance2.setData({
                  max: maximumValue * TEAM_MAX_KEFF,
                  data: awayPoints[0]
               });
          heatmapInstance3.setData({
                  max: maximumValue * BALL_MAX_KEFF,
                  data: ballPoints
               });
  
          console.log(strangePoints.away);
  
  /**===================================================================================================== */
  
              for (let i = 1; i <=18; i++) {
                  const divWrapper = document.getElementsByClassName('heatmap2ContainersWrapper')[0];
                  const newDiv = divWrapper.cloneNode(true);
                  const homePlayerId = "#heatmapHome" + i;
                  const awayPlayerId = "#heatmapAway" + i;
  
                  newDiv.querySelector('#heatmapHome').id = "heatmapHome" + i;
                  newDiv.querySelector(homePlayerId + ' > div').textContent = rep.home.players[i - 1].number + '. ' + rep.home.players[i - 1].name;
                  newDiv.querySelector('#heatmapAway').id = "heatmapAway" + i;
                  newDiv.querySelector(awayPlayerId + ' > div').textContent = rep.away.players[i - 1].number + '. ' + rep.away.players[i - 1].name;
  
                  document.body.appendChild(newDiv);
  
                  const heatmapPlayer1 = h337.create({
                      container: document.querySelector(homePlayerId),
                      maxOpacity: MAX_OPACITY,
                         minOpacity: MIN_OPACITY,
                        radius: POINT_RADIUS
         
                    });
                    heatmapPlayer1.setData({
                      max: maximumValue * TEAM_MAX_KEFF,
                      data: homePoints[i]
                  });
  
                  const heatmapPlayer2 = h337.create({
                      container: document.querySelector(awayPlayerId),
                      maxOpacity: MAX_OPACITY,
                        minOpacity: MIN_OPACITY,
                        radius: POINT_RADIUS
          
                    });
                    heatmapPlayer2.setData({
                      max: maximumValue,
                      data: awayPoints[i]
                  });
  
              }
              console.log(homeTacticPoints);
              console.log(awayTacticPoints);

              const newTactics1 = document.querySelector("#gameInfo").cloneNode(true);
              newTactics1.id = "homeTacticsInfo";
              newTactics1.textContent = "Смены тактик " + rep.home.team.name; 
              document.body.appendChild(newTactics1);

            if (homeTacticPoints.length > 1) {
                for (let t = 1; t < homeTacticPoints.length ; t++) { 
                    if (homeTacticPoints[t].period < 2) continue;
                    const divWrapper = document.getElementsByClassName('heatmap2ContainersWrapper')[0];
                    const newDiv = divWrapper.cloneNode(true);
                    const tacticId = "#heatmapTactichome" + t;
                    const ballId = "#heatmapBallhome" + t;
                    const tacticLabel = (homeTacticPoints[t].start > 0 ? ( "от " + homeTacticPoints[t].start) : "")  + " " +
                                        (homeTacticPoints[t].end < 125 ? ( "до " + homeTacticPoints[t].end) : "") + ".  " + rep.home.team.name;
                    newDiv.querySelector('#heatmapHome').id = "heatmapTactichome" + t;
                    newDiv.querySelector(tacticId + ' > div').textContent = "Игроки " + tacticLabel;
                    newDiv.querySelector('#heatmapAway').id = "heatmapBallhome" + t;
                    newDiv.querySelector(ballId + ' > div').textContent = "Мяч " + tacticLabel;
                        ;
                  document.body.appendChild(newDiv);

                  const heatmapPlayers = h337.create({
                    container: document.querySelector(tacticId),
                    maxOpacity: MAX_OPACITY,
                       minOpacity: MIN_OPACITY,
                      radius: POINT_RADIUS
       
                  });
                  heatmapPlayers.setData({
                    max: maximumValue,
                    data: homeTacticPoints[t].team
                });

                const heatmapBall = h337.create({
                    container: document.querySelector(ballId),
                    maxOpacity: MAX_OPACITY,
                      minOpacity: MIN_OPACITY,
                      radius: POINT_RADIUS * BALL_RADIUS_KEFF *BALL_TACTICS_RADIUS_KEFF
        
                  });
                  heatmapBall.setData({
                    max: maximumValue * BALL_MAX_KEFF * BALL_TACTICS_MAX_KEFF,
                    data: homeTacticPoints[t].ball
                });

                }             
            }

            const newTactics2 = document.querySelector("#gameInfo").cloneNode(true);
            newTactics2.id = "awayTacticsInfo";
            newTactics2.textContent = "Смены тактик " + rep.away.team.name; 
            document.body.appendChild(newTactics2);
            if (awayTacticPoints.length > 1) {
                for (let t = 1; t < awayTacticPoints.length ; t++) { 
                    if (awayTacticPoints[t].period < 2) continue;
                    const divWrapper = document.getElementsByClassName('heatmap2ContainersWrapper')[0];
                    const newDiv = divWrapper.cloneNode(true);
                    const tacticId = "#heatmapTacticaway" + t;
                    const ballId = "#heatmapBallaway" + t;
                    const tacticLabel = (awayTacticPoints[t].start > 0 ? ( "от " + awayTacticPoints[t].start) : "")  + " " +
                                        (awayTacticPoints[t].end < 125 ? ( "до " + awayTacticPoints[t].end) : "") + ".  " + rep.away.team.name;
                    newDiv.querySelector('#heatmapHome').id = "heatmapTacticaway" + t;
                    newDiv.querySelector(tacticId + ' > div').textContent = "Игроки " + tacticLabel;
                    newDiv.querySelector('#heatmapAway').id = "heatmapBallaway" + t;
                    newDiv.querySelector(ballId + ' > div').textContent = "Мяч " + tacticLabel;
                        ;
                  document.body.appendChild(newDiv);

                  const heatmapPlayers = h337.create({
                    container: document.querySelector(tacticId),
                    maxOpacity: MAX_OPACITY,
                       minOpacity: MIN_OPACITY,
                      radius: POINT_RADIUS
       
                  });
                  heatmapPlayers.setData({
                    max: maximumValue,
                    data: awayTacticPoints[t].team
                });

                const heatmapBall = h337.create({
                    container: document.querySelector(ballId),
                    maxOpacity: MAX_OPACITY,
                      minOpacity: MIN_OPACITY,
                      radius: POINT_RADIUS * BALL_RADIUS_KEFF *BALL_TACTICS_RADIUS_KEFF
        
                  });
                  heatmapBall.setData({
                    max: maximumValue * BALL_MAX_KEFF * BALL_TACTICS_MAX_KEFF,
                    data: awayTacticPoints[t].ball
                });

                }             
            }

              document.querySelector("#heatmapHome .overlay").textContent = rep.home.team.name;
              document.querySelector("#heatmapAway .overlay").textContent = rep.away.team.name;
     
          } else {
              alert('Вставьте верно ссылку на матч!');
          }

          }
      
           };
      
      xmlhttp.open("GET", formJsonUrl(tvurl), true);
      xmlhttp.send();  




}