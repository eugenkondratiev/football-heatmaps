
/**
 *  Нужно ставить сюда ссылку на тв отчет, в кавычки.
 * Сохранить. ОБновить или открыть снова файл index.html
 */
const tvurl = "http://pefl.ru/tv/#/j=1054001&z=758588f59fe4f29f4ab031097f44842f";








const MAX_VALUE = 60    ;
const MAX_OPACITY = .7;
const MIN_OPACITY = .05;
const POINT_RADIUS = 35;
const MAX_PLAYERS = 18;

const BALL_RADIUS_KEFF = .67;
const BALL_MAX_KEFF = 0.33;

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
            newX = Math.floor(rightBottomX - (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
            newY = Math.floor(rightBottomY - (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
        } else {
            newX = Math.floor(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
            newY = Math.floor(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
        }

        return { x: newX, y: newY, value: point.value }
    }

    const game = rep.game;
    game.shift();
    game.pop();
    
    // console.log(game);
    const ballPoints = [];
    const homeTeamPoints = [];
    const awayTeamPoints = [];

    const homePoints = [];
    const awayPoints = [];

//TODO  вынести расчет в функцию (jsonreport) => массив тепловых карты мяча,команд, игроков команд.

}

//==============================================================================

window.onload = function() {

      var xmlhttp = new XMLHttpRequest();
    //   xmlhttp.overrideMimeType("application/json");
      
      xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 /*&& this.status == 200*/) {
          if (this.status == 200) {
            const rep = JSON.parse(this.responseText);
            console.log(rep);
            const gameInfoSrting = rep.date + ". " + rep.stadium.city + ". "+ rep.stadium.name 
                  + ". " + rep.home.team.name + " - " + rep.away.team.name;
            
            document.querySelector("#gameInfo").textContent = gameInfoSrting;
  
              console.log(rep.home.players);
              const leftTopX = 20;
              const leftTopY = 20;
              const rightBottomX = 347;
              const rightBottomY = 230;
              
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
                      newX = Math.floor(rightBottomX - (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                      newY = Math.floor(rightBottomY - (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                  } else {
                      newX = Math.floor(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                      newY = Math.floor(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                  }
  
                  return { x: newX, y: newY, value: point.value }
              }
  
  
              const game = rep.game;
              game.shift();
              game.pop();
              
              // console.log(game);
              const ballPoints = [];
   
               const strangePoints = {home: [], away: []};
  
              const homePoints = [];
              const awayPoints = [];
              for (let i = 0; i <= MAX_PLAYERS ; i++) {
                  homePoints.push([]);
                  awayPoints.push([]);
              }
              
              game.forEach(element => {
                  let coords;
                  const secondTime = element.minute > 45 && element.minute < 94 || element.minute > 105;
  
                  if (element.coordinates) 
                      {
                          const ball = element.coordinates.ball;
                          const ballcoords = {x: ball.w, y: ball.h, value:1};
  
                          const hometeam = element.coordinates.home;
                          const awayteam = element.coordinates.away;
  
                          hometeam.forEach(pl => {
                              coords = {x: pl.w, y: pl.h, value:1};
                              if (pl.n <= MAX_PLAYERS ){
                                  homePoints[pl.n].push(limitPoint(coords, secondTime));
                                  homePoints[0].push(limitPoint(coords, secondTime));
                              } else {
                                  strangePoints.home.push(pl);
                              }
                          });
                          awayteam.forEach(pl => {
                              coords = {x: pl.w, y: pl.h, value:1};
                              if (pl.n <= MAX_PLAYERS ){
                                  awayPoints[pl.n].push(limitPoint(coords, !secondTime));
                                  awayPoints[0].push(limitPoint(coords, !secondTime));
                              } else {
                                  strangePoints.away.push(pl);
                              }
  
           
                           });       
  
   
                          ballPoints.push(limitPoint(ballcoords, secondTime))
                      } 
              });
          
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
                  x: 10,
                  y: 10,
                  value: 90
              },
              {
                  x: 100,
                  y: 100,
                  value: 50
              },
              {
                  x: 200,
                  y: 200,
                  value: 70
              }
              
                 
                 
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
  
  /**==================================================== */
  
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
                      max: maximumValue,
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