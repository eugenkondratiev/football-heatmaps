
// const tvurl = "http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c";
// //console.log("jsonurl   - ", formJsonUrl(tvurl));
//==============================================================================
function createHeatMap(rep, corners, jsoncorners) {
//TODO  вынести расчет в функцию (jsonreport) => массив тепловых карты мяча,команд, игроков команд.
}
//==============================================================================

window.onload = function() {
//--------------------------------------------------------------------
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.overrideMimeType("application/json");      
      xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 /*&& this.status == 200*/) {
          if (this.status == 200) {
              const scoreWithPensFound = this.responseText.match(/\d+:\d+/g);
            const scoreWithPens = scoreWithPensFound ? scoreWithPensFound.pop() : ["0:0"];
            // //console.log(scoreWithPens);
            const rep = JSON.parse(this.responseText);
//--------------------------------------------------------------------
            let root = document.documentElement;
            root.style.setProperty('--background-color-home', "#" + rep.home.team.back);
            root.style.setProperty('--border-color-home', "#" + rep.home.team.color);
            root.style.setProperty('--color-home', "#" + rep.home.team.color);
            root.style.setProperty('--background-color-away', "#" + rep.away.team.back);
            root.style.setProperty('--border-color-away', "#" + rep.away.team.color);
            root.style.setProperty('--color-away', "#" + rep.away.team.color);
//--------------------------------------------------------------------
              const game = rep.game;
              game.shift();
              game.pop();
              let score = "0:0"; 
            try {
                game.forEach((element, episode, episodes ) => {
                  if (element.interval) sumInterval += parseInt(element.interval);
                if(!minutesStarts[element.minute]) minutesStarts[element.minute] = homePoints[1].length;
                if (element.S) { // substitutes handle
                  // console.log(element.S);
                  if( element.S.team == 1) {
                    rep.home.players[element.S.in - 1].sub = SUB_IN; 
                    rep.home.players[element.S.out - 1].sub = SUB_OUT; 
                  } else {
                    rep.away.players[element.S.in - 1].sub = SUB_IN; 
                    rep.away.players[element.S.out - 1].sub = SUB_OUT; 
                  }
                }
                    if (element.messages[0]) { // изменение счета и пенальти
                        element.messages.forEach(mes => {
                            if (mes.mes.indexOf(' СЧЕТ ') > -1){
                                score = mes.mes.replace(' СЧЕТ ','');
                                // //console.log(score);
                            };
                        });
                        if (element.messages[0].mes == "Серия пенальти!..." 
                            || element.messages[0].mes =="Матч переходит к послематчевым одиннадцатиметровым!...") {
                            penalties = true; //может на будущее
                          throw "Серия пенальти!...";
                        }                       
                    }
                    if (element.ZT) { // смена тактики
                        if (element.ZT.team == 1) {
                            homeTacticPoints[0].end = element.minute;
                            homeTacticPoints[0].period = element.minute - homeTacticPoints[0].start;
                            homeTacticPoints.push(homeTacticPoints[0]);
                            homeTacticPoints[0] = {start: element.minute , end: 125, period: (125 - element.minute), team: [], ball: [], averages:[]};
                            for (let i = 0; i <= MAX_PLAYERS ; i++) {
                              
                              homeTacticPoints[0].averages.push([{x:0, y:0}]);
                            }
                            homeTacticChanges.push(homePoints[0].length);
                        } else {
                            awayTacticPoints[0].end = element.minute;
                            awayTacticPoints[0].period = element.minute - awayTacticPoints[0].start;
                            awayTacticPoints.push(awayTacticPoints[0]);
                            awayTacticPoints[0] = {start: element.minute , end: 125, period: (125 - element.minute), team: [], ball: [], averages:[]};
                            awayTacticChanges.push(awayPoints[0].length);
                            for (let i = 0; i <= MAX_PLAYERS ; i++) {
                              awayTacticPoints[0].averages.push([{x:0, y:0}]);
                            }
                         }
                    }

                    let coords;
                    try {
                      if (element.U && !penalties) { // shots handle
                        const ball = element.coordinates.ball;
                        // console.log(element.minute, element.U, ball)
                        const ballcoords = {x: ball.w, y: ball.h, value:1};
                        const shotType = element.G ? "G" : element.V ? "V" : element.B ? "B" : element.U.team > 2 ? "Block" : "U";  

                        const shotStart = (episodes[episode - 1].messages.length > 0 && episodes[episode - 1].coordinates)
                            ? episodes[episode - 1].coordinates.ball 
                            : (episodes[episode - 2].messages.length > 0 && episodes[episode - 2].coordinates)
                              ? episodes[episode - 2].coordinates.ball 
                              : (episodes[episode - 3].messages.length > 0 && episodes[episode - 3].coordinates)
                                ? episodes[episode - 3].coordinates.ball
                                : episodes[episode - 4].coordinates.ball; 
                        const startCoords = {x: shotStart.w, y:shotStart.h, value:1};
  
                        const endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                        const startpoint = limitPoint(startCoords, secondTime, shotsCoords, jsonCoords);
  
                        const newShot = {
                          endpoint :endpoint, startpoint:startpoint,
                          episode:episode, type: shotType, minute : element.minute, 
                          player:element.U.player
                        };
                      if (element.U.team == 1 || element.U.team == 3) {  
                          shots.home.push(newShot);
                          // countShot(shotType, rep.home[newShot.player])
                        } else {
                          shots.away.push(newShot);
                          // countShot(shotType, rep.away[newShot.player])
                        };
                      }
                      if (element.G && !element.U) { // goal event in next episode
                        const ball = element.coordinates.ball;
                        console.log(element.minute, element.U, ball)
                        const ballcoords = {x: ball.w, y: ball.h, value:1};
                        const endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                        let lastShot;
                        if (element.G.team == 1 || element.G.team == 3) {
                          lastShot = shots.home[shots.home.length - 1];
                          // countShot("G", rep.home[newShot.player]);
                        } else {
                          lastShot = shots.away[shots.home.length - 1];
                          ;
                        }
                        // console.log(episode);console.log(lastShot);
                        lastShot.type = "G";
                        lastShot.endpoint = endpoint;
                        lastShot.player = element.G.player;
                        
                      }                      
                    } catch (error) {
                      console.log("Что то не так с обсчетом удара", element.minute, element.n, error);
                      console.log(element, episodes[episode - 1], episodes[episode - 2]);

                    }

                          if (element.M) { // смена сторон. конец тайма.                         
                          secondTime = !secondTime;
                          // //console.log(secondTime, element)
                              };
                function pushFullPoint(arr, fullPoints) {
                  for (let p = 1; p <= MAX_PLAYERS; p++) {
                    arr[p].push(fullPoints[p]);
                  }
                  }                 
                    if (element.coordinates) 
                        {
                            const ball = element.coordinates.ball;
                            const ballcoords = {x: ball.w, y: ball.h, value:1};   
                            const hometeam = element.coordinates.home;
                            const awayteam = element.coordinates.away;
                            const currentHomePositions = [];
                            const currentAwayPositions = [];
                            for (let p = 0; p <= MAX_PLAYERS; p++) {
                              currentHomePositions.push(null);
                              currentAwayPositions.push(null);
                            }

                              hometeam.forEach(pl => {
                                coords = pl.n == 1 
                                        ?{x: pl.w, y: pl.h, value:GK_VALUE}
                                        :{x: pl.w, y: pl.h, value:1};
                                if (pl.n <= MAX_PLAYERS ){
                                    const playerPoints = limitPoint(coords, secondTime);

                                    homePoints[pl.n].push(playerPoints);
                                    homePoints[0].push(playerPoints);
                                    homeTacticPoints[0].team.push(playerPoints);
                                    homeTacticPoints[0].averages[pl.n].push(playerPoints);
                                    if (homePoints[pl.n].length > 1) {
                                      const l = homePoints[pl.n].length - 1;
                                       homeMileage[pl.n] += getMileage(homePoints[pl.n][l], homePoints[pl.n][l - 1 ]);
                                    }
                                    currentHomePositions[pl.n] = playerPoints;                                  
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
                                    awayTacticPoints[0].averages[pl.n].push(playerPoints);
                                    if (awayPoints[pl.n].length > 1) {
                                      const l = awayPoints[pl.n].length - 1;
                                       awayMileage[pl.n] += getMileage(awayPoints[pl.n][l], awayPoints[pl.n][l - 1 ]);
                                    }
                                    currentAwayPositions[pl.n] = playerPoints;

                                } else {
                                    strangePoints.away.push(pl);
                                }            
                             });          
                             const ballHeatMap = limitPoint(ballcoords, secondTime);
                            ballPoints.push(ballHeatMap)
                            homeTacticPoints[0].ball.push(ballHeatMap);
                            awayTacticPoints[0].ball.push(ballHeatMap);
                            //debugger;  
                            pushFullPoint(homePointsFull,currentHomePositions);
                            pushFullPoint(awayPointsFull,currentAwayPositions);
                        } 
                }); 
            } catch (error) {
                console.log("game.forEach ", error);
            }
            homeTacticPoints.push(homeTacticPoints[0]);
            awayTacticPoints.push(awayTacticPoints[0]);
 
            const finalScore = score + (scoreWithPens == score ? '' : `(${scoreWithPens})`);
            const gameInfoSrting = rep.date + ". " 
            // + rep.stadium.city + ". "  
            + (rep.stadium.city ? rep.stadium.city + ". " : "") 
              + rep.stadium.name 
            + ". " + rep.home.team.name + " - " + rep.away.team.name + " " + finalScore;
      
            document.querySelector("#gameInfo").textContent = gameInfoSrting;
/**=========================================================================== */
            shots.home.forEach(shot => { countShot(shot.type, rep.home.players[shot.player -1]); });
            shots.away.forEach(shot => { countShot(shot.type, rep.away.players[shot.player -1]); });
/**===================================================================================================== */
          function avgMapCreate(_id) {
              return h337.create({
                container: document.querySelector(_id),//'#heatmapAvgSubHome'),
                maxOpacity: MAX_OPACITY,
                  minOpacity: MIN_OPACITY,
                  radius: POINT_RADIUS * TEAM_RADIUS_KEFF 
    
              });
            }
            const heatmapInstance = h337.create({
              container: document.querySelector('#heatmapHome'),
                   maxOpacity: MAX_OPACITY,
                  minOpacity: MIN_OPACITY,
              radius: POINT_RADIUS * TEAM_RADIUS_KEFF
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
              const heatmapInstance4 = avgMapCreate('#heatmapAvgHome');
              const heatmapInstance5 = avgMapCreate('#heatmapAvgAway');
              // const heatmapInstance6 = avgMapCreate('#heatmapAvgSubHome');
              const heatmapInstance7 = avgMapCreate('#chalkboard');
              const heatmapInstance8 = avgMapCreate('#heatmapAvgBoth');
              
            const heatPoints = [
              { x: 19,  y: 19,  value: 1,  radius: 1},
              {  x: 346.56,  y: 229.5, value: 200, radius: 1},
              {  x: 19,  y: 229.5,  value: 1,  radius: 1 },
               {  x: 346.56, y: 19, value: 1,  radius: 1 }  
            ];
  
            const maximumValue = MAX_VALUE;     
          const data = {
              max: maximumValue * TEAM_MAX_KEFF,
              data: homePoints[0]
          };
          const defaultData = {
            max: maximumValue * TEAM_MAX_KEFF,
            data: heatPoints
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
            heatmapInstance4.setData(defaultData);
            heatmapInstance5.setData(defaultData);
            // heatmapInstance6.setData(defaultData);
            heatmapInstance7.setData(defaultData);   
            heatmapInstance8.setData(defaultData);   
  /**===================================================================================================== */
             // console.log("homeTacticPoints - ", homeTacticPoints);
             // console.log("awayTacticPoints - ", awayTacticPoints);
            //   console.log("minutesStarts --- ", minutesStarts);
              const newTactics1 = document.querySelector("#gameInfo").cloneNode(true);
              newTactics1.id = "homeTacticsInfo";
              newTactics1.textContent = "Смены тактик " + rep.home.team.name; 
              document.body.appendChild(newTactics1);
//-----------------------------------------------------------------------------------
            if (homeTacticPoints.length > 1) {
                for (let t = 1; t < homeTacticPoints.length ; t++) { 
                    if (homeTacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                        //----------- calc avg for different tactics
                    homeTacticPoints[t].averages.forEach((positions, _n) => {
                      const avg = positions.length;
                      if (_n === 0 || avg < 2) return ;
                      positions.forEach((pos, i, _arr) => {
                        positions[0].x += (pos.x / avg);
                        positions[0].y += (pos.y / avg);
                      })
                    })
                    // show tactic
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
                        const theWrapper  = document.getElementsByClassName('heatmapContainerWrapperRight')[0];
                        const thirdField = theWrapper.cloneNode(true);
                        thirdField.className = "thirdHeatmap";
                        newDiv.className = "heatmap3ContainersWrapper";
                        thirdField.querySelector(".heatmapContainer").id = "avgPositionsHome" + t;                        
                        thirdField.querySelector(".heatmapContainer > div").textContent = "Ср.поз." + tacticLabel;                        
                        newDiv.appendChild(thirdField);

                        for (let n = 1; n <= MAX_PLAYERS; n++) { 
                          // for (let n = 1; n < 12; n++) { 
                          const hp = document.querySelector('#player_default_home').cloneNode(true);
                          hp.id = "homeAvgPoints_" + t + "_"+ n;
                              hp.style.display = n < 12 ? "inherit" : "none";
                              hp.style.left = homeTacticPoints[t].averages[n][0].x  - 5 + "px";
                              hp.style.top = homeTacticPoints[t].averages[n][0].y  - 5  + "px";
                          hp.querySelector('.player_number').textContent = rep.home.players[n - 1].number;
                          hp.querySelector('.tooltiptext').textContent = rep.home.players[n - 1].name + "    " + rep.home.players[n - 1].number;
                          document.querySelector('#avgPositionsHome' + t).appendChild(hp);    
                      }

                    const heatmapInstanceAvg = avgMapCreate("#avgPositionsHome" + t);
                    heatmapInstanceAvg.setData(defaultData);

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
//-----------------------------------------------------------------------------------
            const newTactics2 = document.querySelector("#gameInfo").cloneNode(true);
            newTactics2.id = "awayTacticsInfo";
            newTactics2.textContent = "Смены тактик " + rep.away.team.name; 
            document.body.appendChild(newTactics2);
            if (awayTacticPoints.length > 1) {
                for (let t = 1; t < awayTacticPoints.length ; t++) { 
                    if (awayTacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                    awayTacticPoints[t].averages.forEach((positions, _n) => {
                      const avg = positions.length;
                      if (_n === 0 || avg < 2) return ;
                      positions.forEach((pos, i, _arr) => {
                        positions[0].x += (pos.x / avg);
                        positions[0].y += (pos.y / avg);
                      })                     
                    })

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
                  const theWrapper  = document.getElementsByClassName('heatmapContainerWrapperRight')[0];

                  const thirdField = theWrapper.cloneNode(true);
                  thirdField.className = "thirdHeatmap";
                  newDiv.className = "heatmap3ContainersWrapper";
                  thirdField.querySelector(".heatmapContainer").id = "avgPositionsAway" + t;                  
                  thirdField.querySelector(".heatmapContainer > div").textContent = "Ср.поз." + tacticLabel;                  
                  newDiv.appendChild(thirdField);
                  
                  for (let n = 1; n <= MAX_PLAYERS; n++) { 
                    // for (let n = 1; n < 12; n++) { 
                      const ap = document.querySelector('#player_default_away').cloneNode(true);
                      ap.id = "awayAvgPoints_" + t + "_"+ n;
                          ap.style.display = n < 12 ? "inherit" : "none";
                          ap.style.left = awayTacticPoints[t].averages[n][0].x  - 5 + "px";
                          ap.style.top = awayTacticPoints[t].averages[n][0].y  - 5  + "px";
                       ap.querySelector('.player_number').textContent = rep.away.players[n - 1].number;
                      ap.querySelector('.tooltiptext').textContent = rep.away.players[n - 1].name + "    " + rep.away.players[n - 1].number;
                      document.querySelector('#avgPositionsAway' + t).appendChild(ap);

                  }

                  //------------------------------------------------------------
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
            const newHeatmapsHeader = document.querySelector("#gameInfo").cloneNode(true);
            newHeatmapsHeader.id = "playersHeatmapsInfo";
            newHeatmapsHeader.textContent = "Тепловые карты игроков "; 
            document.body.appendChild(newHeatmapsHeader);

            for (let i = 1; i <=MAX_PLAYERS; i++) {
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

              document.querySelector("#heatmapHome .overlay").textContent = rep.home.team.name;
              document.querySelector("#heatmapAway .overlay").textContent = rep.away.team.name;
              document.querySelector("#heatmapAvgHome .overlay").textContent = "Средние позиции " + rep.home.team.name;
              document.querySelector("#heatmapAvgAway .overlay").textContent = "Средние позиции " + rep.away.team.name;
  /**===================================================================================================== */
  /**=========================СРЕДНИЕ ПОЗИЦИИ================================================== */
            const avgH = homePoints[0].length;
            // //console.log("Точек  - ",avgH);

            homeTacticChanges.push(homePoints[0].length -1);
            awayTacticChanges.push(awayPoints[0].length -1);

          //  console.log(" homeTacticChanges -  ", homePoints[0].length, "  -" , homeTacticChanges);
          //  console.log(" awayTacticChanges-  ", awayPoints[0].length, "  -" , awayTacticChanges);
            // function calcAvgPositions(pointsArr, opposite) {
            //   const ;
            // }
          //  console.log("homePoints  - ", homePoints);
          //  console.log("awayPoints  - ", awayPoints);
          // console.log("homePointsFull  - ", homePointsFull);
          // console.log("awayPointsFull  - ", awayPointsFull);

            homePoints.forEach(
              (hmap, _n) => {
              const avg = hmap.length;
              if (_n === 0 || avg < 1) return ;
              
              hmap.forEach((point, i) => {
                  homeAvgPoints[_n].x += point.x / avg;
                  homeAvgPoints[_n].y += point.y / avg;
              })
            })
            awayPoints.forEach((hmap, _n) => {
              const avg = hmap.length;
              if (_n === 0 || avg < 1) return ;
              
              hmap.forEach((point, i) => {
                  awayAvgPoints[_n].x += point.x / avg;
                  awayAvgPoints[_n].y += point.y / avg;
              })
            })
            //console.log('homeAvgPoints  - ', homeAvgPoints);
            //console.log('awayAvgPoints  - ', awayAvgPoints);
            //-------------------------------------------------------------------------
            function showHideAllColoboks(team, n, _tacticPoints){
              const _home =  team || "home";
              const _n = n || 1;
              const tacticPoints = _tacticPoints || homeTacticPoints;

              const _colobokId = _home +"AvgPoints"+ _n;
              const _colobokId2 = "both" + _home + "AvgPoints"+ _n;
            //  console.log(_colobokId, _colobokId2);
              const _style = document.getElementById(_colobokId).style;
              const _style2 = document.getElementById(_colobokId2).style;
                  _style.display = _style.display == "none"? "inherit" : "none";
                   _style2.display = _style2.display == "none"  ? "inherit"  : "none";
              if (tacticPoints.length > 1) {
                      for (let t = 1; t < tacticPoints.length ; t++) { 
                          if (tacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                          const _colobokId = _home +"AvgPoints_"+ t +"_" + _n;

                          document.getElementById(_colobokId).style.display = document.getElementById(_colobokId).style.display == "none" 
                          ? "inherit"
                          : "none";
                      }
              }         
            };
            //-------------------------------------------------------------------------
            function showMainAvgPositions() {
              for (let n = 1; n <= MAX_PLAYERS; n++) {
                // for (let n = 1; n < 12; n++) {
                const hp = document.querySelector('#player_default_home').cloneNode(true);
                const ap = document.querySelector('#player_default_away').cloneNode(true);
                ap.id = "awayAvgPoints" + n;
                ap.plId = "aw" + n;
                ap.style.display = n < 12 ? "inherit" : "none";
                ap.style.left = awayAvgPoints[n].x  - 5 + "px";
                ap.style.top = awayAvgPoints[n].y  - 5  + "px";
                const apRow = "awayPlayerList_" + n;
                // const newPlayer = document.createElement('div',{id: apRow});
                let newPlayer = document.createElement('div');
                newPlayer.className = "playerRow";
                newPlayer.id =apRow;
                const apNumDiv = document.createElement('div');
                apNumDiv.innerText = rep.away.players[n - 1].number + ". ";
                apNumDiv.className = "playerListNum";
                const apNameDiv = document.createElement('div');
                apNameDiv.className = "playerListName";
                const apName = document.createElement('a');
                apName.style.fontWeight = n < 12 ? "bold" : "normal";
                apName.id = apRow + '_name';
                apName.innerText =  rep.away.players[n - 1].name;
                apName.href =  '#';

                apName.addEventListener('click', function(e){
                  e.preventDefault();
                  this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";
                  showHideAllColoboks("away", this.id.replace("awayPlayerList_", '').replace("_name", ''), awayTacticPoints);
                });
                if (rep.away.players[n - 1].sub) {
                  apName.appendChild(getSubArrow(rep.away.players[n -1].sub)) ;
                }
                apNameDiv.appendChild(apName);
                newPlayer.appendChild(apNumDiv);
                newPlayer.appendChild(apNameDiv);
                const apEye = document.createElement('div');
                apEye.className = "playerListEye";
                apEye.innerText = " ";
                newPlayer.appendChild(apEye);
                const apShots = document.createElement('div');
                apShots.className = "playerListShots";
                const apShotsString = formShotsString(rep.away.players[n-1]);
                apShots.innerText = apShotsString;
                const apShotsCheckbox = document.createElement('div');
                apShotsCheckbox.className = "playerShotCheckbox";
                if (apShotsString == " ") {
                  apShotsCheckbox.innerText = " ";
                } else {
                  // apShotsCheckbox.innerText = "v";
                  apShotsCheckbox.appendChild(createShotCheckbox( {
                    player:n,
                    team: "away"
                  }))
                  const apShotsTooltip = document.createElement('div');
                  apShotsTooltip.className = "tooltiptext";
                  apShotsTooltip.innerText = "Удары|В створ|Голы   |Блокированные|Каркас";
                  apShots.appendChild(apShotsTooltip);
                  }
                newPlayer.appendChild(apShotsCheckbox);
                newPlayer.appendChild(apShots);
                // newPlayer.classList.add("awayShot");
                const apMileage = document.createElement('div');
                apMileage.className = "playerListMileage";
                apMileage.innerText = Number(awayMileage[n]/ 1000.0).toFixed(2) + " км";
                newPlayer.appendChild(apMileage);

                document.querySelector('#squadAway').appendChild(newPlayer);

                ap.querySelector('.player_number').textContent = rep.away.players[n - 1].number;
                ap.querySelector('.tooltiptext').textContent = rep.away.players[n - 1].name + "    " + rep.away.players[n - 1].number;;
                document.getElementById('heatmapAvgAway').appendChild(ap);
                const apBoth = ap.cloneNode(true);
                apBoth.id = "both" + apBoth.id;
                document.getElementById('heatmapAvgBoth').appendChild(apBoth);
                const apToINdividualHeatmap = ap.cloneNode(true);
                apToINdividualHeatmap.id = apToINdividualHeatmap.id +"_individual";
                // //console.log('#heatmapAway' + n, "     ", document.querySelector('#heatmapAway' + n));
                document.querySelector('#heatmapAway' + n).appendChild(apToINdividualHeatmap);
            
                hp.id = "homeAvgPoints" + n;
                hp.plId = "hm" + n;
                hp.style.display = n < 12 ? "inherit" : "none";
                hp.style.left = homeAvgPoints[n].x  - 5  + "px";
                hp.style.top = homeAvgPoints[n].y  - 5  + "px";
                const hpRow = "homePlayerList_" + n;
                // const newPlayer = document.createElement('div',{id: hpRow});
                const newHomePlayer = document.createElement('div');
                newHomePlayer.id =hpRow;
                newHomePlayer.className = "playerRow";

                const hpNumDiv = document.createElement('div');
                hpNumDiv.innerText = rep.home.players[n - 1].number + ". ";
                hpNumDiv.className = "playerListNum";
                newHomePlayer.appendChild(hpNumDiv);

                const hpNameDiv = document.createElement('div');
                hpNameDiv.className = "playerListName";
                const hpName = document.createElement('a');
                hpName.style.fontWeight = n < 12 ? "bold" : "normal";
                hpName.id = hpRow + '_name';
                hpName.innerText =  rep.home.players[n - 1].name;
                hpName.href =  '#';
                hpName.addEventListener('click', function(e){
                  e.preventDefault();
                  this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";
                  showHideAllColoboks("home", this.id.replace("homePlayerList_", '').replace("_name", ''), homeTacticPoints);
                });
                if (rep.home.players[n - 1].sub) {
                  hpName.appendChild(getSubArrow(rep.home.players[n -1].sub)) ;
                }

                hpNameDiv.appendChild(hpName);
                newHomePlayer.appendChild(hpNameDiv);
                // newHomePlayer.classList.add("homeShot");

                const hpEye = document.createElement('div');
                hpEye.className = "playerListEye";
                hpEye.innerText = " ";
                newHomePlayer.appendChild(hpEye);
                const hpShots = document.createElement('div');
                hpShots.className = "playerListShots";
                const hpShotsString = formShotsString(rep.home.players[n-1]);
                hpShots.innerText = hpShotsString;

                const hpShotsCheckbox = document.createElement('div');
                hpShotsCheckbox.className = "playerShotCheckbox";

                if (hpShotsString == " ") {
                  hpShotsCheckbox.innerText = " ";
                } else {
                  // hpShotsCheckbox.innerText = "v";
                  hpShotsCheckbox.appendChild(createShotCheckbox( {
                    player:n,
                    team: "home"
                  }))
                  const hpShotsTooltip = document.createElement('div');
                  hpShotsTooltip.className = "tooltiptext";
                  hpShotsTooltip.innerText = "Удары|В створ|Голы   |Блокированные|Каркас";
                  hpShots.appendChild(hpShotsTooltip);
                  }

                newHomePlayer.appendChild(hpShotsCheckbox);
                newHomePlayer.appendChild(hpShots);

                const hpMileage = document.createElement('div');
                hpMileage.className = "playerListMileage";
                hpMileage.innerText = Number(homeMileage[n]/ 1000.0).toFixed(2) + " км";
                newHomePlayer.appendChild(hpMileage);

                document.querySelector('#squadHome').appendChild(newHomePlayer);
                hp.querySelector('.player_number').textContent = rep.home.players[n - 1].number;
                hp.querySelector('.tooltiptext').textContent = rep.home.players[n - 1].name + "    " + rep.home.players[n - 1].number;
                document.getElementById('heatmapAvgHome').appendChild(hp);
                const hpBoth = hp.cloneNode(true);
                hpBoth.id = "both" + hpBoth.id;
                    document.getElementById('heatmapAvgBoth').appendChild(hpBoth);
                    const hpToINdividualHeatmap = hp.cloneNode(true);
                    hpToINdividualHeatmap.id = hpToINdividualHeatmap.id +"_individual";
                    document.querySelector('#heatmapHome' + n).appendChild(hpToINdividualHeatmap);
                    //  //console.log('#heatmapHome' + n, "     ", document.querySelector('#heatmapHome' + n));
              }
            }
            showMainAvgPositions();
            // showSubAvgPositions();
/**===================================================================================================== */
            document.querySelector('.loaderWrapper').remove();
            console.log("allRep - ", rep);
            console.log("shots - ", shots);
            console.log("sum of intervals - ", sumInterval);
/**===================================================================================================== */
            const _chalkboard = document.querySelector('#chalkboard .heatmap-canvas');
            // document.querySelector(".shotslegend").style.display = "inline-block";

/**===================================================================================================== */
            // console.log(_avgHome);
            if (_chalkboard.getContext) 
                  {
                    const context = _chalkboard.getContext('2d');
                    // drawTeamShots(shots.home, context );
                    drawTeamShots(shots.away, rep.away.players, "away",context );
                    drawTeamShots(shots.home, rep.home.players, "home", context );
                    } 
/**===================================================================================================== */
          } else {
              alert('Вставьте верно ссылку на матч!');
          }
          }      
        };
      
      xmlhttp.open("GET", formJsonUrl(tvurl), true);
      xmlhttp.send();  
//-----------------------------------------------------------------
//"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
function formHeatmapUrl(urlINput) {
  return window.location.origin + window.location.pathname + "?" + urlINput.replace('http://pefl.ru/tv/#/', '');
}

/**===================================================================================================== */
const urlPaste = document.querySelector('#pasteButton');
const urlInput = document.querySelector("#tvurlInput");
if (navigator.clipboard) {
  urlPaste.addEventListener('click', e => {
    // e.preventDefault();
    navigator.clipboard.readText()
    .then(
      clipText => { urlInput.value = clipText; })
    .catch(e => {
      console.log("Работа с буфером сейчас не разрешена или не доступна в вашем браузере!");
    });
  });
} else {
  urlPaste.remove();
}

document.querySelector('#updateButton').addEventListener('click', e => {
  e.preventDefault();
  if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
    alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
    return;
  }
    window.location.assign(formHeatmapUrl(urlInput.value));
});
document.querySelector('#newWindow').addEventListener('click', e => {
  e.preventDefault();
  if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
    alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
    return;
  }
    window.open(formHeatmapUrl(urlInput.value), '_blank');
});
}