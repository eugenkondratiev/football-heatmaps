//==============================================================================
let maximumValue = MAX_VALUE;
let heatmapInstance;
let heatmapInstance2;
let heatmapInstance3;
let heatmapInstance4;
let heatmapInstance5;
let heatmapInstance7;
let heatmapInstance8;
let heatmapInstance9;

let rep;
//-------------------------------------------------
function calculateAvgPositions(_points) {
  const _avgPoints = [];
  for (let i = 0; i <= MAX_PLAYERS; i++) {
    _avgPoints.push({ x: 0, y: 0, points: 0 });
  }
  _points.forEach((rawHmap, _n) => {
    const hmap = rawHmap.filter(point => point != null);
    const avg = hmap.length;
    if (_n === 0 || avg < 1) return;

    hmap.forEach((point, i) => {
      _avgPoints[_n].x += point.x / avg;
      _avgPoints[_n].y += point.y / avg;
      _avgPoints[_n].points++
    })

    const order = _avgPoints.map((pl, i) => {
      const playerPoints = { playerRank: i, points: pl.points }
      return playerPoints;
    })
      .slice(1).sort((a, b) => (+b.points - +a.points));
    _avgPoints[0].order = order;
  })
  return _avgPoints;
}
//--------------------------------------------------------------------
function calculatePlayerClosestToBall(coords, _secondTime) {
  const ball = coords.ball;
  // console.log("calculatePlayerClosestToBall secondtime", _secondTime);

  const players = [];
  const closestPlayer = { n: 0, length: 10000 };
  const prevPlayer = { n: 0, length: 10000 };

  // let minLength = 10000;

  coords.home.forEach(pl => {
    const length = getLengthToBall(pl, ball, false);
    // console.log("pl, ball, length  home", pl, ball, length, minLength);

    if (length < closestPlayer.length) {
      // players.push({ n: pl.n, length: length });
      prevPlayer.n = closestPlayer.n
      prevPlayer.length = closestPlayer.length
      closestPlayer.n = pl.n
      closestPlayer.length = length
    } else if (length < prevPlayer.length) {
      prevPlayer.n = pl.n
      prevPlayer.length = length
    }

  });

  coords.away.forEach(pl => {
    const length = getLengthToBall(pl, ball, true);
    // console.log("pl, ball, length away", pl, ball, length, minLength);

    if (length < closestPlayer.length) {
      // players.push({ n: pl.n, length: length });
      prevPlayer.n = closestPlayer.n
      prevPlayer.length = closestPlayer.length
      closestPlayer.n = pl.n + MAX_PLAYERS
      closestPlayer.length = length
    } else if (length < prevPlayer.length) {
      prevPlayer.n = pl.n + MAX_PLAYERS
      prevPlayer.length = length
    }
  });
  return [closestPlayer, prevPlayer];
}
//==============================================================================
//==============================================================================

//==============================================================================
let startTime = Date.now();
window.onload = function () {
  //--------------------------------------------------------------------
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");
  xmlhttp.onreadystatechange = function () {
    // setTimeout(function () {
    if (this.readyState == this.OPENED) {
      xmlhttp.setRequestHeader('Accept', "application/json, text/javascript, */*; q=0.01");
    }
    if (this.readyState == 4 /*&& this.status == 200*/) {
      if (this.status == 200) {
        const scoreWithPensFound = this.responseText.match(RE_SCORE_WITH_PENALTIES);
        const scoreWithPens = scoreWithPensFound ? scoreWithPensFound.pop() : ["0:0"];
        rep = JSON.parse(this.responseText);
        //--------------------------------------------------------------------
        function setTeamsColors() {
          const away = document.querySelector("#player_default_away .player_shape").style;
          const home = document.querySelector("#player_default_home .player_shape").style;
          away.backgroundColor = "#" + rep.away.team.back;
          away.borderColor = "#" + rep.away.team.color;
          away.color = "#" + rep.away.team.color;
          home.color = "#" + rep.home.team.color;
          home.borderColor = "#" + rep.home.team.color;
          home.backgroundColor = "#" + rep.home.team.back;
        }
        setTeamsColors();
        //--------------------------------------------------------------------
        const game = rep.game;
        console.log("rep  - ", rep);
        const flags = {
          corner: false,
          throwIn: false,
          deadBall: false,
          goalKick: false,
          center: true,
          team: 0,
          ballOwner: 0
        }
        const isBallOwnedByHomeTeam = () => flags.ballOwner = 1;
        const isHomePlayer = (numberInCommonPlayersList) => numberInCommonPlayersList <= MAX_PLAYERS;
        const capitalTeamName = _team => (_team === "home" ? "Home" : "Away")

        let currentPlayer = 0;

        game.slice(1, -1);
        let score = "0:0";
        let passObject = null

        try {
          game.forEach((element, episode, episodes) => {
            let lastEpisode = episode > 0 ? episodes[episode - 1] : null;
            //===================================================================
            if (element.C) { flags.corner = true; flags.team = element.C; }
            if (element.A) { flags.throwIn = true; flags.team = element.A; }
            if (element.F) { flags.deadBall = true; flags.team = element.F; }
            if (element.T) {
              flags.goalKick = true; flags.team = element.T.team;
            }
            if (element.N) { flags.center = true; flags.team = element.N; }
            //===================================================================

            let coords;
            let playersCloseToBall = []
            let prevplayersCloseToBall = []
            let closestPlayer
            let prevclosestPlayer
            let prevclosestPlayer2
            let closestPlayer2

            //** ---- */
            // if (!element.coordinates) console.log("NO COORDINATES", element);
            // if (episode === 0) {
            //   console.log("Start element - ", element);
            //   playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime);
            // }
            if (element.coordinates) {
              // if (element.coordinates && episode > 0) {


              const ball = element.coordinates.ball

              function isPlayerOwnsBall() {
                return closestPlayer && closestPlayer.length === 0
              }
              //==============================================================================
              function isBallMovedFromPlayer() {
                if (!prevclosestPlayer || !closestPlayer) return false
                return prevclosestPlayer.length === 0
                  && (
                    prevclosestPlayer.n === closestPlayer.n && closestPlayer.length > 0
                    || prevclosestPlayer.n !== closestPlayer.n
                  )
              }
              //==============================================================================
              function isClosestPlayerChanged() {
                if (!prevclosestPlayer) return false

                return prevclosestPlayer.n !== closestPlayer.n
              }
              //==============================================================================
              function isPlayerMovedBall() {
                if (!prevclosestPlayer || !closestPlayer) return false
                return closestPlayer.length === 0 && prevclosestPlayer.length === 0
                  &&
                  prevclosestPlayer.n === closestPlayer.n
                  && closestPlayer2.length > 0
                  && prevclosestPlayer2.length > 0

              }
              //==============================================================================
              function isItClearPass() {
                return prevclosestPlayer && prevclosestPlayer2 && closestPlayer && closestPlayer2
                  && prevclosestPlayer.length === 0 && prevclosestPlayer2.length > 0
                  && closestPlayer.length === 0 && closestPlayer2.length > 0
              }
              //==============================================================================
              function isItPassFromCenter() {
                if (!passObject) return
                console.log(" passObject  closestPlayer isPassOpened()", passObject, closestPlayer, isPassOpened());
                return passObject.N && closestPlayer
                  && isPassOpened() && closestPlayer.length === 0
              }
              //==============================================================================
              function isPrevAndClosestFromSameTeam() {
                if (!prevclosestPlayer || !closestPlayer) return false
                return isOneTeam(prevclosestPlayer.n, closestPlayer.n)
              }
              //==============================================================================
              function isPassOpened() {
                if (!passObject) return false
                return !!passObject.start
              }
              //==============================================================================
              function resetPass() {
                passObject.start = null
              }
              //==============================================================================
              function savePass() {
                const pass = {

                  high: (ball.z === 1),
                  minute: element.minute,
                  episode: element.num,
                  good: passObject.good,
                  endpoint: null,
                  startpoint: null,
                  type: null,
                  player: passObject.start.player
                }

                const ballcoords = {
                  x: passObject.end.ball.w,
                  y: passObject.end.ball.h
                };

                pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);

                const startballcoords = {
                  x: passObject.start.ball.w,
                  y: passObject.start.ball.h
                };
                pass.startpoint = limitPoint(startballcoords, secondTime, shotsCoords, jsonCoords);
                console.log(" save pass - ", passObject, pass);
                passes[pass.player].push({ ...pass });

              }
              //==============================================================================
              function isShotElement() {
                // return element.G
                return element.G || element.W || element.B || element.U || element.V
              }
              //==============================================================================
              function startPass(player) {
                passObject = {
                  start: {
                    ball: { ...ball },
                    player: player.n
                  }
                }
              }
              //==============================================================================
              function endThisPass(player) {
                passObject.end = {
                  ball: { ...ball },
                  player: player.n
                }

              }
              //==============================================================================

              //==============================================================================
              function isItFight() {
                return closestPlayer2 && closestPlayer
                  && closestPlayer.length === closestPlayer2.length
                  && closestPlayer.length === 0
              }
              //==============================================================================
              function checkAfterPassFight() {
                if (!isItFight()) return false
                return !(closestPlayer.n === prevclosestPlayer.n || closestPlayer2.n === prevclosestPlayer.n)
              }
              //==============================================================================
              //==============================================================================
              //==============================================================================
              //==============================================================================

              try {
                prevplayersCloseToBall = lastEpisode && lastEpisode.coordinates && calculatePlayerClosestToBall(lastEpisode.coordinates, secondTime);
                playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime);
                //** ---- */
                console.log(" playersCloseToBall - ", playersCloseToBall, prevplayersCloseToBall, element);
                closestPlayer = playersCloseToBall[0]
                closestPlayer2 = playersCloseToBall[1]
                prevclosestPlayer = prevplayersCloseToBall && prevplayersCloseToBall[0]
                prevclosestPlayer2 = prevplayersCloseToBall && prevplayersCloseToBall[1]

                if (element.N) {

                  if (passObject) {
                    console.log('closestPlayer- ', closestPlayer);
                    startPass(closestPlayer)
                  }
                  if (!passObject) startPass(closestPlayer)

                  passObject.N = true
                  console.log("STARTED N ", passObject);
                }
                // if (isItFight()) {
                //   console.log(checkAfterPassFight()
                //     ? "FIGHT "
                //     : "DRIBBLE ",
                //     closestPlayer, closestPlayer2, element, prevclosestPlayer);

                // }
                function processBallMoving() {
                  if (penalties) {
                    resetPass()
                    return
                  }

                  if (!isPassOpened()) {
                    if (isPlayerOwnsBall()) {
                      startPass(closestPlayer)
                      console.log('PLAYER OWNS BALL');
                      return
                    }
                  }

                  if (isShotElement()) {
                    resetPass();
                    //process shot
                    // console.log(" ShotElement  playersCloseToBall - ", playersCloseToBall, prevplayersCloseToBall, element);

                    return
                  }

                  if (isPlayerMovedBall()) {
                    startPass(closestPlayer);
                    ;// proceedrun with ball
                    console.log('START PASS');
                    return
                  }
                  if (isItPassFromCenter()) {
                    passObject.good = 1
                    // but may be check for bad ball handling
                    endThisPass(closestPlayer)
                    savePass()
                    startPass(closestPlayer)
                  }

                  if (isItClearPass()) {
                    if (isPrevAndClosestFromSameTeam()) {
                      ;//ok pass 
                      passObject.good = 1
                      // but may be check for bad ball handling
                      endThisPass(closestPlayer)
                      savePass()
                      startPass(closestPlayer)
                    } else {
                      ; // failed pass
                      passObject.good = 0
                      // but may be check for bad ball handling from opponent
                      endThisPass(closestPlayer)

                      savePass()
                      startPass(closestPlayer)
                    }
                    return
                  }

                }
                if (episode === 0) {
                  console.log("Start element - ", element);
                  // startPass(closestPlayer)
                }
                const ballMovingResponce = processBallMoving();

              } catch (error) {
                console.log("closest players error", error, element);
              }
            }

            function tryMes(messageNumber, regExp) {
              return element.messages[messageNumber].mes.match(regExp);
            }

            if (element.interval) sumInterval += parseInt(element.interval);
            if (!minutesStarts[element.minute]) minutesStarts[element.minute] = outData.home.Points[1].length;
            if (element.S) { // substitutes handle
              if (element.S.team == 1) {
                rep.home.players[element.S.in - 1].sub = SUB_IN;
                rep.home.players[element.S.out - 1].sub = SUB_OUT;
              } else {
                rep.away.players[element.S.in - 1].sub = SUB_IN;
                rep.away.players[element.S.out - 1].sub = SUB_OUT;
              }
            }
            if (element.messages[0]) { // изменение счета и пенальти  and calculate passes
              const pass = {};
              let passPlayer;
              let receivePlayer;
              let isPassOpened = false;

              try {
                if (element.coordinates) {
                  // prevplayersCloseToBall = lastEpisode.coordinates && calculatePlayerClosestToBall(lastEpisode.coordinates, secondTime);
                  // playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime);
                  // // console.log(" playersCloseToBall - ", playersCloseToBall, element);
                  // closestPlayer = playersCloseToBall[0]
                  // closestPlayer2 = playersCloseToBall[1]
                  // prevclosestPlayer = prevplayersCloseToBall && prevplayersCloseToBall[0]
                  // prevclosestPlayer2 = prevplayersCloseToBall && prevplayersCloseToBall[1]

                  // if (closestPlayer2 && closestPlayer.length === closestPlayer2.length) {
                  //   console.log((closestPlayer.n === prevclosestPlayer.n || closestPlayer2.n === prevclosestPlayer.n)
                  //     ? "DRIBBLE "
                  //     : "FIGHT ",
                  //     closestPlayer, closestPlayer2, element, prevclosestPlayer);

                  // }
                  try {
                    if (flags.center && element.messages && element.messages.some(mes => mes.mes.match(RE_CENTER_MSG))) { // from center
                      flags.center = false;
                      currentPlayer = prevclosestPlayer.n;
                    }
                  } catch (error) {
                    console.log(" N error", error, element);
                  };

                  const ball = element.coordinates.ball;
                  let lastBall = lastEpisode.coordinates ? lastEpisode.coordinates.ball : undefined;

                  const ballcoords = {
                    x: ball.w,
                    y: ball.h
                  };

                  if (flags.corner && element.messages[1]) { //handle corner kick

                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = (ball.z === 1);
                    pass.minute = element.minute;
                    pass.episode = element.num;

                    pass.type = "corner";
                    flags.corner = false;
                    const lastBallcoords = {
                      x: lastBall.w,
                      y: lastBall.h
                    };
                    passPlayer = getPlayerFromMessage(element.messages[0]);

                    pass.startpoint = limitPoint(lastBallcoords, secondTime, shotsCoords, jsonCoords);
                    if (element.messages[2]) { // high pass , 2 episodes
                      receivePlayer = getPlayerFromMessage(element.messages[2]);
                      pass.good = isOneTeam(receivePlayer, passPlayer);
                    } else {
                      pass.good = true;
                      receivePlayer = getPlayerFromMessage(element.messages[1]);

                    }
                    currentPlayer = receivePlayer;
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);

                  }
                  else if (flags.throwIn && element.messages[0]) { // handle out

                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = (ball.z === 1);
                    pass.minute = element.minute;
                    pass.episode = element.num;

                    pass.type = "throw";
                    flags.throwIn = false;
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    if (!passPlayer) lastEpisode = episodes[episode - 2];
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    if (!passPlayer) lastEpisode = episodes[episode - 3];
                    lastBall = lastEpisode.coordinates.ball;
                    const lastBallcoords = {
                      x: lastBall.w,
                      y: lastBall.h
                    };
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    pass.startpoint = limitPoint(lastBallcoords, secondTime, shotsCoords, jsonCoords);
                    receivePlayer = getPlayerFromMessage(element.messages[element.messages.length - 1]);
                    pass.good = isOneTeam(receivePlayer, passPlayer);
                    currentPlayer = receivePlayer;
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);
                    ;
                  } else if (flags.deadBall) { // handle free kick
                    ; flags.deadBall = false;
                  } else if (flags.goalKick) { // handle pass from goalkick

                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = (ball.z === 1);
                    pass.minute = element.minute;
                    pass.episode = element.num;
                    isPassOpened = true;

                    pass.type = "goalkick";
                    const lastBallcoords = {
                      x: lastBall.w,
                      y: lastBall.h
                    };

                    flags.goalKick = false;
                    // console.log("T - Lastelement ", lastEpisode);
                    // console.log("T - element ", element);
                    currentPlayer = prevclosestPlayer.n;
                    // console.log(" T - currentPlayer -", currentPlayer);
                    passPlayer = currentPlayer;
                    pass.startpoint = limitPoint(lastBallcoords, secondTime, shotsCoords, jsonCoords);
                    // console.log("T - Nextlement ", episodes[episode + 1]);
                    // console.log("T - Nextlement2 ", episodes[episode + 2]);
                    // if (!episodes[episode + 2].messages[0]) {
                    // console.log("T - Nextlement3 ", episodes[episode + 3]);
                    // }
                    // }
                    if (element.messages[0]) {
                      if (tryMes(0, RE_PASS_FROM_GOALKICK)) {
                        if (element.messages[1]) {
                          receivePlayer = +tryMes(1, RE_PLAYER_NUMBERS)[0];
                          pass.good = isOneTeam(passPlayer, receivePlayer);
                          // console.log("T short pass - ", element.minute, element.num, pass.good, receivePlayer, passPlayer, pass.player)
                        } else {
                          ;// "open" pass
                          isPassOpened = true;
                        }
                      };
                      if (pass.type === "goalkick" && isPassOpened) {
                        const firstPlayer = +tryMes(0, RE_PLAYER_NUMBERS)[0];
                        pass.good = (tryMes(0, RE_PASS_FROM_GOALKICK) || firstPlayer);
                        isPassOpened = false;
                      }
                    };
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);
                  } else { //just pass
                    ;
                  }
                };
              } catch (error) {
                console.log("error ", lastEpisode);
                console.log("Что то не так с обсчетом паса", element.minute, element.n, error);
              }
              element.messages.forEach(mes => {
                if (mes.mes.indexOf(' СЧЕТ ') > -1) {
                  score = mes.mes.replace(' СЧЕТ ', '');
                };
              });
              if (element.messages[0].mes == "Серия пенальти!..." ||
                element.messages[0].mes == "Матч переходит к послематчевым одиннадцатиметровым!..." ||
                element.messages[0].mes == "Назначаются послематчевые пенальти!...") {
                penalties = true; //может на будущее
                throw "Серия пенальти!...";
              }
            }
            if (element.ZT) { // смена тактики
              function calcTacticChange(_team = "home") {
                outData[_team].TacticPoints[0].end = element.minute;
                outData[_team].TacticPoints[0].period = element.minute - outData[_team].TacticPoints[0].start;
                outData[_team].TacticPoints.push(outData[_team].TacticPoints[0]);
                outData[_team].TacticPoints[0] = {
                  start: element.minute,
                  end: 125,
                  period: (125 - element.minute),
                  team: [],
                  ball: [],
                  averages: []
                };
                outData[_team].TacticChanges.push(outData[_team].Points[0].length);
                for (let i = 0; i <= MAX_PLAYERS; i++) {
                  outData[_team].TacticPoints[0].averages.push([{
                    x: 0,
                    y: 0
                  }]);
                }
              }
              if (element.ZT.team == 1) {
                calcTacticChange("home")
                outData.home.TacticChanges.push(outData.home.Points[0].length);
              } else {
                calcTacticChange("away")
              }
            }

            try {
              if ((element.U || element.W) && !penalties) { // shots handle
                const ball = element.coordinates.ball;
                const ballcoords = {
                  x: ball.w,
                  y: ball.h,
                  value: 1
                };
                const shotType = element.G
                  ? "G"
                  : element.V
                    ? "V"
                    : element.W
                      ? "W"
                      : element.B
                        ? "B"
                        : element.U.team > 2 ? "Block" : "U";
                const shotStart = (episodes[episode - 1].coordinates) ?
                  episodes[episode - 1].coordinates.ball :
                  (episodes[episode - 2].coordinates) ?
                    episodes[episode - 2].coordinates.ball :
                    (episodes[episode - 3].coordinates) ?
                      episodes[episode - 3].coordinates.ball :
                      episodes[episode - 4].coordinates.ball;
                const startCoords = {
                  x: shotStart.w,
                  y: shotStart.h,
                  value: 1
                };

                const endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                const startpoint = limitPoint(startCoords, secondTime, shotsCoords, jsonCoords);

                const newShot = {
                  endpoint: endpoint,
                  startpoint: startpoint,
                  episode: episode,
                  type: shotType,
                  minute: element.minute,
                  player: element.U ? element.U.player : element.W.player,
                  xG: element.U
                    ? element.U.xG ? element.U.xG : "ждем xG"
                    : element.W.xG ? element.W.xG : "ждем xG",
                };
                if (element.U && (element.U.team == 1 || element.U.team == 3)
                  || element.W && (element.W.team == 2 || element.W.team == 4)
                ) {
                  oldshots.home.push(newShot);
                } else {
                  oldshots.away.push(newShot);
                };
              }
              if ((element.G || element.V || element.B) && !element.U) { // goal/block/ event in next episode
                const ball = element.coordinates.ball;
                console.log("goal event in next episode -  min=", element.minute, " U=", element.U, " W=", element.W,
                  " V=", element.V, " G=", element.G, " B=", element.B, ball)
                const ballcoords = {
                  x: ball.w,
                  y: ball.h,
                  value: 1
                };
                const endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                let lastShot;
                if (element.G && (element.G.team == 1 || element.G.team == 3)
                  || element.V && (element.V.team == 1 || element.V.team == 3)
                  || element.B && (element.B.team == 1 || element.B.team == 3)
                ) {
                  lastShot = oldshots.home[oldshots.home.length - 1];
                } else {
                  lastShot = oldshots.away[oldshots.away.length - 1];
                }
                if (episodes[episode - 1].messages.length > 0 && episodes[episode - 1].messages.some(el => el.mes.match(RE_LONG_PASS))
                ) {
                  lastShot.startpoint = lastShot.endpoint;
                }
                lastShot.type = element.G ? "G" : element.V ? "V" : "B";
                lastShot.endpoint = endpoint;
                lastShot.player = element.G ? element.G.player : element.V ? element.V.player : element.B.player;
              }
            } catch (error) {
              console.log("Что то не так с обсчетом удара", element.minute, element.n, error);
              console.log(element, episodes[episode - 1], episodes[episode - 2]);
            }

            if (element.M) { // смена сторон. конец тайма.                         
              secondTime = !secondTime;
            };

            function pushFullPoint(arr, fullPoints) {
              for (let p = 1; p <= MAX_PLAYERS; p++) {
                arr[p].push(fullPoints[p]);
              }
            }
            if (element.coordinates) {
              const ball = element.coordinates.ball;
              const ballcoords = {
                x: ball.w,
                y: ball.h,
                value: 1
              };

              const ballHeatMap = limitPoint(ballcoords, secondTime);
              ballPoints.push(ballHeatMap)

              function calcTeamFullPoints(_team = "home") {
                const theTeam = element.coordinates[_team];
                const currentTeamPositions = [];

                for (let p = 0; p <= MAX_PLAYERS; p++) {
                  currentTeamPositions.push(null);
                }

                theTeam.forEach(pl => {
                  coords = pl.n == 1 ?
                    {
                      x: pl.w,
                      y: pl.h,
                      value: GK_VALUE
                    } :
                    {
                      x: pl.w,
                      y: pl.h,
                      value: 1
                    };
                  if (pl.n <= MAX_PLAYERS) {
                    const playerPoints = limitPoint(coords, _team === "home" ? secondTime : !secondTime);
                    outData[_team].Points[pl.n].push(playerPoints);
                    outData[_team].Points[0].push(playerPoints);
                    outData[_team].TacticPoints[0].team.push(playerPoints);
                    outData[_team].TacticPoints[0].averages[pl.n].push(playerPoints);
                    if (outData[_team].Points[pl.n].length > 1) {
                      const l = outData[_team].Points[pl.n].length - 1;
                      outData[_team].Mileage[pl.n] += getMileage(outData[_team].Points[pl.n][l], outData[_team].Points[pl.n][l - 1]);
                    }
                    currentTeamPositions[pl.n] = playerPoints;

                  } else {
                    strangePoints[_team].push(pl);
                  }
                });
                outData[_team].TacticPoints[0].ball.push(ballHeatMap);
                pushFullPoint(outData[_team].PointsFull, currentTeamPositions);
              }
              calcTeamFullPoints("home")
              calcTeamFullPoints("away")
            }
          });
        } catch (error) {
          console.log("game.forEach ", error);
        }
        outData.home.TacticPoints.push(outData.home.TacticPoints[0]);
        outData.away.TacticPoints.push(outData.away.TacticPoints[0]);

        function getPenalties(s, p) {
          const score = s.split(':');
          const withpens = p.split(':');
          return `${withpens[0] - score[0]}:${withpens[1] - score[1]}`
        }
        const finalScore = score + (scoreWithPens == score ? '' : `(${getPenalties(score, scoreWithPens)})`);
        const gameInfoSrting = rep.date + ". "
          +
          (rep.stadium.city ? rep.stadium.city + ". " : "") +
          rep.stadium.name +
          ". " + rep.home.team.name + " - " + rep.away.team.name + " " + finalScore;

        document.querySelector("#game-info").textContent = gameInfoSrting;
        console.log("oldpasses -", oldpasses);
        console.log("passes -", passes);

        const gkPasses = oldpasses.reduce((acc, pl, i) => {
          const goalKicks = pl.filter(pass => (pass.type === "goalkick"));
          return goalKicks[0]
            ? [...acc, ...goalKicks]
            : [...acc]
        }, []);

        console.log("gkPasses   ", gkPasses);

        /**=========================================================================== */
        // oldpasses.slice(1,18).forEach(pass => {
        //   countPass(pass.type, rep.home.players[pass.player - 1]);
        // });
        // passes.slice(19).forEach(pass => {
        //   countPass(pass.type, rep.away.players[pass.player - 1]);
        // });

        /**=========================================================================== */
        oldshots.home.forEach(shot => {
          countShot(shot.type, rep.home.players[shot.player - 1]);
        });
        oldshots.away.forEach(shot => {
          countShot(shot.type, rep.away.players[shot.player - 1]);
        });
        /**===================================================================================================== */
        function avgMapCreate(_id, radiusKef = TEAM_RADIUS_KEFF, min = MIN_OPACITY, max = MAX_OPACITY) {
          return h337.create({
            container: document.querySelector(_id), //'#heatmap-avgSubHome'),
            maxOpacity: max,
            minOpacity: min,
            radius: POINT_RADIUS * radiusKef
          });
        }

        heatmapInstance = avgMapCreate('#heatmap-home');
        heatmapInstance2 = avgMapCreate('#heatmap-away');
        heatmapInstance3 = avgMapCreate('#heatmap-ball', BALL_RADIUS_KEFF);
        updateMainMaps(outData.home.PointsFull, outData.away.PointsFull, ballPoints);

        heatmapInstance4 = avgMapCreate('#heatmap-avgHome');
        heatmapInstance5 = avgMapCreate('#heatmap-avgAway');
        heatmapInstance7 = avgMapCreate('#chalkboard');
        heatmapInstance8 = avgMapCreate('#heatmap-avgBoth');
        heatmapInstance9 = avgMapCreate('#passesboard');

        const heatPoints = [{
          x: 19,
          y: 19,
          value: 1,
          radius: 1
        },
        {
          x: 346.56,
          y: 229.5,
          value: 200,
          radius: 1
        },
        {
          x: 19,
          y: 229.5,
          value: 1,
          radius: 1
        },
        {
          x: 346.56,
          y: 19,
          value: 1,
          radius: 1
        }
        ];

        const defaultData = {
          max: maximumValue * TEAM_MAX_KEFF,
          data: heatPoints
        };

        /**===================================================================================================== */
        function showTeamTacticHeamaps(_team = "home") {
          document.querySelector("#" + _team + "-tacticks-heatmaps + .bojan__label .bojan__label__header").textContent = "Смены тактик " + rep[_team].team.name;
          if (outData[_team].TacticPoints.length > 1) {
            for (let t = 1; t < outData[_team].TacticPoints.length; t++) {
              if (outData[_team].TacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
              outData[_team].TacticPoints[t].rankByMinutes = [];
              outData[_team].TacticPoints[t].averages.forEach((positions, _n) => {
                const avg = positions.length;
                outData[_team].TacticPoints[t].rankByMinutes[_n] = [_n, avg];
                if (_n === 0 || avg < 2) return;
                positions.forEach((pos, i, _arr) => {
                  positions[0].x += (pos.x / avg);
                  positions[0].y += (pos.y / avg);
                })
              })
              outData[_team].TacticPoints[t].rankByMinutes.sort((a, b) => b[1] - a[1]);

              const divWrapper = document.getElementsByClassName('heatmap2-containers-wrapper')[0];
              const newDiv = divWrapper.cloneNode(true);
              const tacticId = "#heatmap-tactic" + _team + t;
              const ballId = "#heatmap-ball" + _team + t;
              const tacticLabel = (outData[_team].TacticPoints[t].start > 0 ? ("от " + outData[_team].TacticPoints[t].start) : "") + " " +
                (outData[_team].TacticPoints[t].end < 125 ? ("до " + outData[_team].TacticPoints[t].end) : "") + ".  " + rep[_team].team.name;
              newDiv.querySelector('#heatmap-home').id = "heatmap-tactic" + _team + t;
              newDiv.querySelector(tacticId + ' > div').textContent = "Игроки " + tacticLabel;
              newDiv.querySelector('#heatmap-away').id = "heatmap-ball" + _team + t;
              newDiv.querySelector(ballId + ' > div').textContent = "Мяч " + tacticLabel;;
              document.querySelector("#" + _team + "-tacticks-heatmaps ~ .bojan__content").appendChild(newDiv);
              const theWrapper = document.getElementsByClassName('heatmap-container-wrapper')[1];

              const thirdField = theWrapper.cloneNode(true);
              thirdField.className = "heatmap-container-wrapper";
              newDiv.className = "heatmap3-containers-wrapper";
              thirdField.querySelector(".heatmap-container").id = "avgPositions" + capitalTeamName(_team) + t;
              thirdField.querySelector(".heatmap-container > div").textContent = "Ср.поз." + tacticLabel;
              newDiv.appendChild(thirdField);

              for (let n = 1; n <= MAX_PLAYERS; n++) {
                const pl = document.querySelector('#player_default_' + _team).cloneNode(true);
                pl.id = _team + "AvgPoints_" + t + "_" + n;
                const rank = outData[_team].TacticPoints[t].rankByMinutes
                pl.style.display = rank.indexOf(rank.find(el => { return el[0] == n })) < 11 ? "inherit" : "none";
                pl.style.left = outData[_team].TacticPoints[t].averages[n][0].x - 5 + "px";
                pl.style.top = outData[_team].TacticPoints[t].averages[n][0].y - 5 + "px";
                pl.querySelector('.player_number').textContent = rep[_team].players[n - 1].number;
                pl.querySelector('.tooltiptext').textContent = rep[_team].players[n - 1].name + "    " + rep[_team].players[n - 1].number;
                document.querySelector('#avgPositions' + capitalTeamName(_team) + t).appendChild(pl);

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
                data: outData[_team].TacticPoints[t].team
              });

              const heatmapball = h337.create({
                container: document.querySelector(ballId),
                maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS * BALL_RADIUS_KEFF * BALL_TACTICS_RADIUS_KEFF

              });
              heatmapball.setData({
                max: maximumValue * BALL_MAX_KEFF * BALL_TACTICS_MAX_KEFF,
                data: outData[_team].TacticPoints[t].ball
              });

            }
          }

          showableTacticks.push(outData[_team].TacticPoints.filter((t, n) => (n > 0 && t.period > 3)).map(el => [el.start, el.end]));

        }
        showTeamTacticHeamaps("home")
        showTeamTacticHeamaps("away")

        function showPlayersHeatmaps() {

          for (let i = 1; i <= MAX_PLAYERS; i++) {
            const divWrapper = document.getElementsByClassName('heatmap2-containers-wrapper')[0];

            const newDiv = divWrapper.cloneNode(true);


            function showOnePlayerHeatmap(_team = "home") {
              const playerId = "#heatmap-" + _team + i;
              newDiv.querySelector("#heatmap-" + _team).id = "heatmap-" + _team + i;
              newDiv.querySelector(playerId + ' > div').textContent = rep[_team].players[i - 1].number + '. ' + rep[_team].players[i - 1].name;
              if (_team === "home") document.querySelector("#separate-heatmaps ~ .bojan__content").appendChild(newDiv);

              const _heatmapPlayer = h337.create({
                container: document.querySelector(playerId),
                maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS

              });
              _heatmapPlayer.setData({
                max: maximumValue,
                data: outData[_team].Points[i]
              });
            }

            showOnePlayerHeatmap("home")
            showOnePlayerHeatmap("away")
          }
        }
        setTimeout(
          showPlayersHeatmaps,
          10
        )

        document.querySelector("#heatmap-home .overlay").textContent = rep.home.team.name;
        document.querySelector("#heatmap-away .overlay").textContent = rep.away.team.name;
        document.querySelector("#heatmap-avgHome .overlay").textContent = "Средние позиции " + rep.home.team.name;
        document.querySelector("#heatmap-avgAway .overlay").textContent = "Средние позиции " + rep.away.team.name;
        /**===================================================================================================== */
        /**=========================СРЕДНИЕ ПОЗИЦИИ================================================== */
        outData.home.TacticChanges.push(outData.home.Points[0].length - 1);
        outData.away.TacticChanges.push(outData.away.Points[0].length - 1);
        outData.home.AvgPoints = calculateAvgPositions(outData.home.Points).slice();
        outData.away.AvgPoints = calculateAvgPositions(outData.away.Points).slice();

        //-------------------------------------------------------------------------
        function showHideAllColoboks(team, n, _tacticPoints, isVisible = SHOW) {
          const _team = team || "home";
          const _n = n || 1;
          const tacticPoints = _tacticPoints || outData.home.TacticPoints;

          const _colobokId = _team + "AvgPoints" + _n;
          const _colobokId2 = "both" + _team + "AvgPoints" + _n;
          //  console.log(_colobokId, _colobokId2);
          const _style = document.getElementById(_colobokId).style;
          const _style2 = document.getElementById(_colobokId2).style;
          _style.display = isVisible ? "inherit" : "none";
          _style2.display = isVisible ? "inherit" : "none";
          if (tacticPoints.length > 1) {
            for (let t = 1; t < tacticPoints.length; t++) {
              if (tacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
              const _colobokId = _team + "AvgPoints_" + t + "_" + _n;

              document.getElementById(_colobokId).style.display = isVisible ?
                // document.getElementById(_colobokId).style.display = document.getElementById(_colobokId).style.display == "none" ?
                "inherit" :
                "none";
            }
          }
        };
        //-------------------------------------------------------------------------

        function showTeamAvgPositions(_team) {
          for (let n = 1; n <= MAX_PLAYERS; n++) {
            const pl = document.querySelector('#player_default_' + _team).cloneNode(true);

            pl.id = _team + "AvgPoints" + n;
            pl.plId = (_team === "home" ? "hm" : "aw") + n;
            const plRow = _team + "-player-list_" + n;
            let newPlayer = document.createElement('div');
            newPlayer.className = "playerRow";
            newPlayer.id = plRow;
            const plNumDiv = document.createElement('div');
            plNumDiv.innerText = rep[_team].players[n - 1].number + ". ";
            plNumDiv.className = "player-list-num";
            const plNameDiv = document.createElement('div');
            plNameDiv.className = "player-list-name";
            const plName = document.createElement('a');
            // plName.style.fontWeight = n < 12 ? "bold" : "normal";
            plName.id = plRow + '_name';
            plName.innerText = rep[_team].players[n - 1].name;
            plName.href = '#';

            plName.addEventListener('click', function (e) {
              e.preventDefault();
              this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";
              showHideAllColoboks(_team, this.id.replace(_team + "-player-list_", '').replace("_name", '')
                , outData[_team].TacticPoints
                , this.style.fontWeight == "bold" ? SHOW : HIDE
              );
            });
            if (rep[_team].players[n - 1].sub) {
              plName.appendChild(getSubArrow(rep[_team].players[n - 1].sub));
            }
            plNameDiv.appendChild(plName);

            newPlayer.appendChild(plNumDiv);
            newPlayer.appendChild(plNameDiv);

            const plEye = document.createElement('div');
            plEye.className = "player-list-eye";
            plEye.innerText = " ";
            //<img src="http://pefl.ru/images/eye.png" alt="" border="0">
            // apEye.appendChild(createEye(`Тут планируются 
            // скилы игрока`));
            // apEye.appendChild(createEye(`Тут планируется 
            // статистика игрока`));
            newPlayer.appendChild(plEye);
            const plShots = document.createElement('div');
            plShots.className = "player-list-shots";
            const plShotsString = formShotsString(rep[_team].players[n - 1]);
            plShots.innerText = plShotsString;
            const plShotsCheckbox = document.createElement('div');
            plShotsCheckbox.className = "playerShotCheckbox";
            if (plShotsString == " ") {
              plShotsCheckbox.innerText = " ";
            } else {
              plShotsCheckbox.appendChild(createShotCheckbox({
                player: n,
                team: _team
              }))
              const plShotsTooltip = document.createElement('div');
              plShotsTooltip.className = "tooltiptext";
              plShotsTooltip.innerText = SHOT_TOOLTIP;
              plShots.appendChild(plShotsTooltip);
            }
            newPlayer.appendChild(plShotsCheckbox);
            newPlayer.appendChild(plShots);
            const plMileage = document.createElement('div');
            plMileage.className = "player-list-mileage";
            plMileage.innerText = Number(outData[_team].Mileage[n] / 1000.0).toFixed(2) + "км";
            newPlayer.appendChild(plMileage);

            document.querySelector('#squad' + capitalTeamName(_team)).appendChild(newPlayer);

            pl.querySelector('.player_number').textContent = rep[_team].players[n - 1].number;
            pl.querySelector('.tooltiptext').textContent = rep[_team].players[n - 1].name + "    " + rep[_team].players[n - 1].number;;
            document.getElementById('heatmap-avg' + capitalTeamName(_team)).appendChild(pl);
            const plBoth = pl.cloneNode(true);
            plBoth.id = "both" + plBoth.id;
            document.getElementById('heatmap-avgBoth').appendChild(plBoth);
            const plToINdividualHeatmap = pl.cloneNode(true);
            plToINdividualHeatmap.style.display = (outData[_team].AvgPoints[n].x > 8 && outData[_team].AvgPoints[n].y > 8) ? "inherit" : "none";
            plToINdividualHeatmap.id = plToINdividualHeatmap.id + "_individual";
            plToINdividualHeatmap.style.left = outData[_team].AvgPoints[n].x - 5 + "px";
            plToINdividualHeatmap.style.top = outData[_team].AvgPoints[n].y - 5 + "px";
            document.querySelector('#heatmap-' + _team + n).appendChild(plToINdividualHeatmap);
          }
        }
        function showMainAvgPositions() {
          showTeamAvgPositions("home")
          showTeamAvgPositions("away")
        }

        setTimeout(
          showMainAvgPositions
          , 50
        )
        /**===================================================================================================== */
        setTimeout(function () {
          document.body.removeChild(document.querySelector('.loader-wrapper'));
        },
          200)
        /**===================================================================================================== */
        const _chalkboard = document.querySelector('#chalkboard .heatmap-canvas');
        const _passesboard = document.querySelector('#passesboard .heatmap-canvas');
        /**===================================================================================================== */
        if (_chalkboard.getContext) {
          const context = _chalkboard.getContext('2d');
          drawTeamShots(oldshots.away, rep.away.players, "away", context);
          drawTeamShots(oldshots.home, rep.home.players, "home", context);
        }
        if (_passesboard.getContext) {
          const context = _passesboard.getContext('2d');
          // drawTeamPasses(oldpasses.slice(19), rep.away.players, "away", context);
          // drawTeamPasses(oldpasses.slice(1, 18), rep.home.players, "home", context);
          drawTeamPasses(passes.slice(19), rep.away.players, "away", context);
          drawTeamPasses(passes.slice(1, 18), rep.home.players, "home", context);
        }
        /**===================================================================================================== */
      } else {
        alert('Вставьте верно ссылку на матч!');
      }
      setTimeout(afterLoadEvents, 200);

    }

  };

  xmlhttp.open("GET", formJsonUrl(tvurl), true);
  xmlhttp.send();
  //"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
}
//--------------------------------------------------------------------
function updateMainMaps(_homePoints, _awayPoints, _ballPoints) {
  heatmapInstance.setData({
    max: maximumValue * TEAM_MAX_KEFF,
    data: _homePoints
  });
  heatmapInstance2.setData({
    max: maximumValue * TEAM_MAX_KEFF,
    data: _awayPoints
  });
  heatmapInstance3.setData({
    max: maximumValue * BALL_MAX_KEFF,
    data: _ballPoints
  });
}
