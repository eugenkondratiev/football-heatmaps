; const DEFAULT_TV_URL = window.location.href.replace(/\/index.html/, "/").replace(/\/heatmaps.html/, "/")  + "/tv/#/j=1&z=c12345";
const getImagesUrl = () => window.location.href.replace(/\/index.html/, "/").replace(/\/heatmaps.html/, "/")  + "public/images"

// ; const tvurl = "http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c";

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

const HOME = 1;
const AWAY = 2;
const SUB_OUT = 1;
const SUB_IN = 2;
const SHOW = true;
const HIDE = false;
const MIN_MINUTES_FOR_SHOW_TACTIC = 3;

const shotsCoords = { x1: 39, y1: 38, x2: 712, y2: 458 };
const jsonCoords = { x1: 0, y1: 0, x2: 720, y2: 450 };
const hmCoords = { x1: 18.98, y1: 19, x2: 346.56, y2: 229.5 };
const ZONE_WIDTH = (shotsCoords.x2 - shotsCoords.x1) / 6.0;
const ZONE_HEIGHT = (shotsCoords.y2 - shotsCoords.y1) / 3.0;
const ZONES = [...Array(18)].map((_, i) => { return { x: ((i) / 3 >> 0), y: ((i) % 3) } })
const ZONES_COORDS = ZONES.map(z => { return { x: shotsCoords.x1 + z.x * ZONE_WIDTH, y: shotsCoords.y1 + z.y * ZONE_HEIGHT } })
const ZONES_FIND_ORDER = [8, 11, 5, 14, 7, 10, 9, 12, 2, 17, 4, 6, 13, 15, 1, 3, 16, 18]


const FIELD_LONGTITUDE = 105;
const RE_CENTER_MSG = /разыг|розыг/gi;
const RE_GOAL_LOW_PASS_MSG = /разыг|розыг/gi;

const RE_PASS_FROM_GOALKICK = /пас|переда|смотри/gi;

const RE_LONG_PASS = /авес|аброс|линны/g;
const RE_SCORE_WITH_PENALTIES = /\d+:\d+/g;

const RE_PLAYER_NUMBERS = /[0-9]+/gi;

const MILEAGE_KEFF = FIELD_LONGTITUDE / (hmCoords.x2 - hmCoords.x1);

const SHOT_TOOLTIP = "Удары|В створ|Голы-автоголы   |Блокированные|Каркас"
;
const outData = {
  home: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: [],
  },
  away: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: [],
  },
}
const ballPoints = [];
const minutesStarts = [0];

const strangePoints = { home: [], away: [] };
const oldshots = { home: [], away: [] };
const shots = { home: [], away: [] };
let sumInterval = 0;

outData["home"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });
outData["away"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });

const showableTacticks = [];
const oldpasses = [[]];
const passes = [[]];
const passFilter = {
  playersCheckboxes: [],
  start: 0,
  end: 125,
  zoneTo: 0,
  zoneFrom: 0,
  homePlayers: 18,
  awayPlayers: 18,
  high: true,
  head: true,
  good: true,
  failed: true,
  throw: true,
  freekick: true,
  goalkick: true,
  fromout: true,
  fighted: true
}

for (let i = 0; i <= MAX_PLAYERS; i++) {
  function createInitTeamsData(team) {
    const _team = team || "home";
    outData[_team].Points.push([]);
    outData[_team].Mileage.push(0);
    outData[_team].AvgPoints.push({ x: 0, y: 0 });
    outData[_team].TacticPoints[0].averages.push([{ x: 0, y: 0 }]);
    outData[_team].PointsFull.push([]);
  }
  createInitTeamsData("home")
  createInitTeamsData("away")
}
for (let i = 1; i <= MAX_PLAYERS * 2; i++) {
  oldpasses.push([]);
  passes.push([]);
  passFilter.playersCheckboxes.push(true)

}
let secondTime = false;
var penalties = false;

// ; const JSON_URL_START = 'http://pefl.ru/jsonreport.php';
; const JSON_URL_START = window.location.origin + '/public/json/';
//==============================================================================
function formJsonUrl({ tvurl, test = false }) {

  console.log("###window.location.origin + tvurl - ", window.location.origin + tvurl, test);
  if (test) return window.location.origin + tvurl;
  const _tvurl = tvurl || DEFAULT_TV_URL
  const urlString = window.location.href.match(/j\=\d+\&z\=.+/i)
    // ? window.location.href 
    ? window.location.href.replace(/\/index.html/, "/")
    : _tvurl;
  const zIndex = urlString.indexOf('&z=');
  const jIndex = urlString.indexOf('j=');
  console.log(window.location.href.match(/j\=\d+\&z\=.+/i), urlString, zIndex, jIndex);

  console.log(`__${urlString.substring(2 + jIndex, zIndex)}.json`);
  return JSON_URL_START + `__${urlString.substring(2 + jIndex, zIndex)}.json`
  // return JSON_URL_START + `?j=${urlString.substring(2 + jIndex, zIndex)}&z=${urlString.substring(3 + zIndex)}`;
}
//==============================================================================
function limitPoint(point, secondTime = false, coords1 = hmCoords, coords2 = jsonCoords) {
  const x = point.x;
  const y = point.y;
  let newX;
  let newY;
  if (secondTime) {
    newX = Math.round(coords1.x2 - (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1));
    newY = Math.round(coords1.y2 - (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1));
  } else {
    newX = Math.round(coords1.x1 + (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1));
    newY = Math.round(coords1.y1 + (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1));
  }
  return { x: newX, y: newY, value: point.value }
}
//==============================================================================
function normalizePoint(point, away = false, coords2 = jsonCoords) {
  if (away) {
    return { n: point.n, h: (coords2.y2 - point.h), w: (coords2.x2 - point.w), value: 1 };
  }
  return { n: point.n, h: point.h, w: point.w, value: 1 }
}

//==============================================================================
function getSegmentLength(point1, point2) {
  const dX = point2.x - point1.x;
  const dY = point2.y - point1.y;
  return Math.sqrt(dX * dX + dY * dY)
}
//==============================================================================
function isPointMatchZone(pointX = 0, pointY = 0, zoneNumber = 14) {
  if (!zoneNumber) return false
  if (!ZONES_COORDS[zoneNumber]) return false
  const _zone = ZONES_COORDS[zoneNumber]
  if (pointX < _zone.x || pointY < _zone.y) return false
  if (pointX > (_zone.x + ZONE_WIDTH) || pointY > (_zone.y + ZONE_HEIGHT)) return false
  return true
}
//==============================================================================
function getLength(coord1, coord2) {
  const dX = coord2.w - coord1.w;
  const dY = coord2.h - coord1.h;
  return Math.sqrt(dX * dX + dY * dY)
}
//==================================================
function getLengthToBall(coord, ball, _away = false) {
  const point = normalizePoint(coord, _away);
  const length = getLength(point, ball);
  // console.log("ball, point, _away, length ", ball, point, _away, length);
  return length;
}
//==============================================================================
function getSegmentAngle(startPoint, endPoint) {
  const dX = endPoint.x - startPoint.x;
  const dY = endPoint.y - startPoint.y;
  const keff = dX < 0 ? (dY < 0 ? -180 : 180) : 0;

  return keff + Math.atan(dY / dX) * 180 / Math.PI;;
}
//==============================================================================
function getMileage(point1, point2) {
  return MILEAGE_KEFF * getSegmentLength(point1, point2);
}
//==============================================================================
function leaveValuablePoints(pointsArr) {
  return pointsArr.filter(point => !point); // if not null
}
//==============================================================================
function getOwnerFromMessages(_messages) {
  if (!_messages) return null
  if (!_messages[0]) return null
  return _messages[0].owner
}
//==============================================================================
function getPlayerFromMessage(_message, num = 1) {
  if (!_message || !_message.mes) return 0;
  // const playerNumbersOld = String(_message.mes).match(/(?<=\[)\d+(?=\])/g);
  // return playerNumbers != null && playerNumbers[num - 1] ? +playerNumbers[num - 1] : 0;
  // replace nice regexp by some kind of polifill for IE
  const message = String(_message.mes)
  const messageLength = message.length
  let openingSquareIndex = 0
  const playerNumbers = []
  for (let i = 0; i < messageLength; i++) {
    if (message[i] === '[') {
      openingSquareIndex = i + 1
    } else if (message[i] === ']' && openingSquareIndex < i && openingSquareIndex > 0) {
      // console.log("openingSquareIndex - ", openingSquareIndex, i, message.substr(openingSquareIndex, i - openingSquareIndex));
      playerNumbers.push(+message.substr(openingSquareIndex, i - openingSquareIndex))
    }
  }
  // console.log("playerNumbers - ", playerNumbers, "playerNumbersOld - ", playerNumbersOld, message);
  return openingSquareIndex
    ? playerNumbers[num - 1] ? +playerNumbers[num - 1] : 0
    : null
}
//==============================================================================
function getPointsSet(pointsArr, start, end) {
  return pointsArr.slice(start, end);
}
/**===================================================================================================== */
function clearPoint(arr) {
  return arr.filter(el => (el != null));
}
/**===================================================================================================== */
function isOneTeam(firstPlayerNumber, secondPlayerNumber) {
  return firstPlayerNumber < MAX_PLAYERS + 1 && secondPlayerNumber < MAX_PLAYERS + 1 || firstPlayerNumber > MAX_PLAYERS && secondPlayerNumber > MAX_PLAYERS;
}
/**===================================================================================================== */
function getSubArrow(_sub) {
  const sub = _sub || SUB_OUT;
  const imgUrl = getImagesUrl()
  const arrRef = sub == SUB_OUT ? imgUrl + '/out.gif' : imgUrl + '/in.gif';
  // const arrRef = sub == SUB_OUT ? 'http://pefl.ru/system/img/gm/out.gif' : 'http://pefl.ru/system/img/gm/in.gif';
  const arrow = document.createElement("img");
  arrow.src = arrRef;
  return arrow;
}
/**===================================================================================================== */
function createEye(toolTip) {
  const eye = document.createElement('img');
  const imgUrl = getImagesUrl()
  eye.src = imgUrl + "/eye.png";
  // eye.src = "http://pefl.ru/images/eye.png";
  eye.alt = "";
  const tp = document.createElement('div');
  tp.className = "tooltiptext";
  tp.innerText = toolTip;
  eye.appendChild(tp);
  return eye;
}
//**========================================================================================================= */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
//**========================================================================================================= */

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}
/**===================================================================================================== */
; function createShotLine(shot, shotinfo, color) {
  const line = document.createElement('div');
  line.classList.add('shotline');
  line.style.top = shot.startpoint.y - 1 + "px";
  line.style.left = shot.startpoint.x - 1 + "px";
  line.style.width = getSegmentLength(shot.startpoint, shot.endpoint) + "px";
  line.style.transform = "rotate(" + getSegmentAngle(shot.startpoint, shot.endpoint) + "deg)";
  line.style.borderTopColor = color;

  return line;
}
/**===================================================================================================== */
function createShotStart(shot, shotinfo, color) {
  const shotStart = document.createElement('div');
  shotStart.classList.add('shotstart');
  shotStart.style.borderColor = color;
  shotStart.style.backgroundColor = color;
  shotStart.style.top = shot.startpoint.y - 5 + "px";
  shotStart.style.left = shot.startpoint.x - 5 + "px";
  const typeString = shot.type == "G"
    ? 'Гол'
    : shot.type == "V"
      ? 'Удар в створ'
      : shot.type == "W"
        ? 'Автогол'
        : shot.type == "Block"
          ? 'Блок'
          : shot.type == "B" ? 'Каркас ворот' : 'Мимо';

  shotStart.addEventListener('mouseenter', function (e) {
    const shotLegend = document.querySelector('#one-shot-legend');
    const shotString = " Минута " + shot.minute + ", " + typeString+ ", " + shot.xG + ",\n\r " + shot.player + "." + shotinfo.playerName;
    shotLegend.textContent = shotString;
    shotLegend.style.display = "inline-block";
  })

  shotStart.addEventListener('mouseleave', function (e) {
    document.querySelector('#one-shot-legend').style.display = "none";
  })
  return shotStart;
}
/**===================================================================================================== */
function createShotEnd(shot, shotinfo, color) {
  const shotEnd = document.createElement('div');
  shotEnd.classList.add('shotend');
  shotEnd.style.borderColor = color;
  shotEnd.style.backgroundColor = color;
  shotEnd.style.top = shot.endpoint.y - 2 + "px";
  shotEnd.style.left = shot.endpoint.x - 1 + "px";
  return shotEnd;
}/**===================================================================================================== */
function createShot(shot, shotinfo) {
  const _strokeStyle = shot.type == "G"
    ? 'red'
    : shot.type == "V"
      ? 'yellow'
      : shot.type == "Block"
        ? 'black'
        : shot.type == "B"
          ? 'black'
          : shot.type == "W" ? "#FFA500" : 'blue';

  const shotPict = document.createElement('div');
  shotPict.classList.add('shot');
  const teamClass = shotinfo.team + "Shot";
  shotPict.classList.add(teamClass);

  shotPict.setAttribute("player", shot.player);
  shotPict.setAttribute("shotType", shot.type);
  shotPict.setAttribute("minute", shot.minute);

  shotPict.appendChild(createShotLine(shot, shotinfo, _strokeStyle));
  shotPict.appendChild(createShotEnd(shot, shotinfo, _strokeStyle));
  shotPict.appendChild(createShotStart(shot, shotinfo, _strokeStyle));

  return shotPict;
}
/**===================================================================================================== */
function drawTeamShots(teamShots, players, team, ctx) {
  teamShots.forEach((shot, shotNum) => {
    const shotInfo = { playerName: players[shot.player - 1].name, team: team };
    document.querySelector('#chalkboard').appendChild(createShot(shot, shotInfo));
  });
}
/**===================================================================================================== */
function countShot(newShotType, player) {
  if (newShotType == "U") {
    if (!player.miss) {
      player.miss = 1; return;
    }
    player.miss++
  }

  if (newShotType == "G") {
    if (!player.goals) {
      player.goals = 1; return;
    }
    player.goals++
  }
  if (newShotType == "B") {
    if (!player.bar) {
      player.bar = 1; return;
    }
    player.bar++
  }
  if (newShotType == "Block") {
    if (!player.block) {
      player.block = 1; return;
    }
    player.block++
  }
  if (newShotType == "V") {
    if (!player.stvor) {
      player.stvor = 1; return;
    }
    player.stvor++
  }
  if (newShotType == "W") {
    if (!player.autogoals) {
      player.autogoals = 1; return;
    }
    player.autogoals++
  }

}
/**===================================================================================================== */
function formShotsString(player) {
  const autogoals = player.autogoals ? ("" + -parseInt(player.autogoals)) : ""
  const goals = player.goals ? parseInt(player.goals) : 0;
  const stvor = goals + (player.stvor ? parseInt(player.stvor) : 0);
  const sum = stvor + (player.miss ? parseInt(player.miss) : 0);
  const goalsString = "|" + goals + autogoals;
  const bars = player.bar ? "|" + (parseInt(player.bar)) : " ";
  const blocks = player.block ? "|" + (parseInt(player.block)) : " ";

  return (sum + bars + blocks == 0) && autogoals == ""
    ? " "
    : sum == 0
      ? "        " + autogoals + blocks + bars
      : (sum > 9 ? sum : " " + sum) + "|" + stvor + goalsString + " " + blocks + bars;
}
/**===================================================================================================== */
function displayAllShots(display, team, hard = true, allHide = false) {
  const shotsSelector = "." + team + "Shot";
  document.querySelectorAll(shotsSelector).forEach(shot => {
    if (allHide) {
      shot.style.display = "none";
      return;
    }
    const checkbox = document.querySelector("#" + team + "-player-list_" + shot.getAttribute("player") + " input");
    let checked = checkbox ? checkbox.checked : false;
    shot.style.display = (display)
      ? "block"
      : (checked && !hard) ? "block" : "none";
  })
}
function filterShotsByTime(start, end) {
  document.querySelectorAll("[class$=Shot]").forEach(shot => {
    const minute = +shot.getAttribute("minute");
    const matchPeriod = (minute >= +start && minute <= +end);
    shot.style.display = (matchPeriod)
      ? "block"
      : "none";
  });
}

function changeCheckboxCount(action = -1, team = "home") {
  const shotsContainer = document.querySelectorAll('.shots-container-wrapper')[0];
  let chboxCount = parseInt(team == "home" ? shotsContainer.getAttribute("data-homes") : shotsContainer.getAttribute("data-aways"));
  if (action == -1) { chboxCount-- } else { chboxCount++ };
  if (chboxCount < 0) chboxCount = 0;
  if (team == "home") {
    shotsContainer.setAttribute("data-homes", chboxCount);
  } else {
    shotsContainer.setAttribute("data-aways", chboxCount);
  }
  return chboxCount;
}
/**===================================================================================================== */
function createShotCheckbox(params) {
  const chbox = document.createElement('input');
  chbox.type = "checkbox";
  chbox.checked = false;
  chbox.style.cursor = "pointer"
  chbox.addEventListener('click', function (e) {
    if (this.checked) {
      changeCheckboxCount(1, params.team);
      displayAllShots(false, params.team, false)
    } else {
      if (changeCheckboxCount(-1, params.team) == 0) {
        displayAllShots(true, params.team);
      } else {
        displayAllShots(false, params.team, false);
      }
    }
  })
  return chbox;
}
//=================================================
function changeVisibilityByType(e) {
  e.preventDefault();
  const type = this.getAttribute("data-type");
  const shotsSelector = ".shot[shottype=" + type + "]";
  const checked = this.style.fontWeight == "bold";
  document.querySelectorAll(shotsSelector).forEach(shot => {
    shot.style.display = !checked ? "block" : "none";
  });
  if (type == "G") { // цепляем и автоголы
    document.querySelectorAll(".shot[shottype=W]").forEach(shot => {
      shot.style.display = !checked ? "block" : "none";
    });
  }
  this.style.fontWeight = checked ? "normal" : "bold";
}
//=================================================
const fGoals = document.getElementById("filterGoals");
fGoals.addEventListener('click', changeVisibilityByType.bind(fGoals));

const fStvor = document.getElementById("filterStvor")
fStvor.addEventListener('click', changeVisibilityByType.bind(fStvor));
const fMiss = document.getElementById("filterMiss");
fMiss.addEventListener('click', changeVisibilityByType.bind(fMiss));
const fBars = document.getElementById("filterBars");
fBars.addEventListener('click', changeVisibilityByType.bind(fBars));
const fBlocks = document.getElementById("filterBlocks");
fBlocks.addEventListener('click', changeVisibilityByType.bind(fBlocks));

function filterRangeMaximize(_timeFilterId) {
  const timeFilter = document.getElementById(_timeFilterId);
  timeFilter.setAttribute("start", 0);
  timeFilter.setAttribute("end", 125);
  timeFilter.dispatchEvent(new Event('change', { bubbles: true }));
}
function showAllShots(_show = true) {
  displayAllShots(_show, "home", true, !_show);
  displayAllShots(_show, "away", true, !_show);
  if (_show) {
    document.querySelectorAll(".squadAndShots-containers-wrapper input[type=checkbox]").forEach(chbox => {
      chbox.checked = HIDE;
    });
    filterRangeMaximize("shots-time-filter");

  }
  document.querySelectorAll("a[id^=filter]:nth-of-type(-n+5)").forEach(aButton => {
    aButton.style.fontWeight = _show ? "bold" : "normal";
  });
}
document.getElementsByClassName("shots-container")[0].addEventListener('click', function (e) {
  showAllShots();
});
document.getElementById("filter-show-all").addEventListener('click', function (e) {
  e.preventDefault();
  showAllShots();
});
document.getElementById("filter-hide-all").addEventListener('click', function (e) {
  e.preventDefault();
  showAllShots(HIDE);
});

;
/**===================================================================================================== */
function getTypeString(pass) {
    return pass.type == "corner"
        ? 'угловой'
        : pass.type == "throw"
            ? 'аут'
            : pass.type == "freekick"
                ? 'штрафной'
                : pass.type == "goalkick"
                    ? 'от ворот'
                    : '';
}
/**===================================================================================================== */
function formPassString(pass, passinfo) {
    return " Минута " + pass.minute + ", "
        + (pass.good ? "точно" : "неточно") +
        (pass.high ? ", верхом ," : ", низом ,")
        + getTypeString(pass) + ",\n\r "
        + passinfo.player + "." + passinfo.playerName;
}
/**===================================================================================================== */
; function createPassLine(pass, passinfo, color) {
    const line = document.createElement('div');
    line.classList.add('pass-line');
    line.style.top = pass.startpoint.y - 1 + "px";
    line.style.left = pass.startpoint.x - 1 + "px";
    line.style.width = getSegmentLength(pass.startpoint, pass.endpoint) + "px";
    line.style.transform = "rotate(" + getSegmentAngle(pass.startpoint, pass.endpoint) + "deg)";
    line.style.borderTopColor = color;

    line.addEventListener('mouseenter', function (e) {
        const passLegend = document.querySelector('#one-pass-legend');
        passLegend.textContent = formPassString(pass, passinfo);
        passLegend.style.display = "inline-block";
    })
    line.addEventListener('mouseleave', function (e) {
        document.querySelector('#one-pass-legend').style.display = "none";
    })
    return line;
}
/**===================================================================================================== */
function createPassStart(pass, passinfo, color) {
    const passStart = document.createElement('div');
    passStart.classList.add('pass-start');
    passStart.style.borderColor = color;
    passStart.style.backgroundColor = color;
    passStart.style.top = pass.startpoint.y - 5 + "px";
    passStart.style.left = pass.startpoint.x - 5 + "px";
    const typeString = getTypeString(pass);

    passStart.addEventListener('mouseenter', function (e) {
        const passLegend = document.querySelector('#one-pass-legend');
        passLegend.textContent = formPassString(pass, passinfo);
        passLegend.style.display = "inline-block";
    })

    passStart.addEventListener('mouseleave', function (e) {
        document.querySelector('#one-pass-legend').style.display = "none";
    })
    return passStart;
}
/**===================================================================================================== */
function createPass(pass, passinfo) {
    const _strokeStyle = !pass.good
        ? 'red'
        : 'blue';
    const passPict = document.createElement('div');
    passPict.classList.add('pass');
    const teamClass = passinfo.team + "Pass";
    passPict.classList.add(teamClass);

    passPict.setAttribute("startpoint-x", pass.startpoint.x);
    passPict.setAttribute("endpoint-x", pass.endpoint.x);
    passPict.setAttribute("startpoint-y", pass.startpoint.y);
    passPict.setAttribute("endpoint-y", pass.endpoint.y);

    passPict.setAttribute("player", pass.player);
    passPict.setAttribute("passType", pass.type);
    passPict.setAttribute("minute", pass.minute);
    passPict.setAttribute("high", pass.high);
    passPict.setAttribute("good", pass.good);
    passPict.setAttribute("failed", pass.failed);
    passPict.setAttribute("fighted", pass.fighted);

    passPict.appendChild(createPassLine(pass, passinfo, _strokeStyle));
    passPict.appendChild(createPassStart(pass, passinfo, _strokeStyle));

    return passPict;
}


/**===================================================================================================== */
function filterPassesByTime(start, end) {
    passFilter.start = start
    passFilter.end = end

    document.querySelectorAll("[class$=Pass]").forEach(pass => {
        const minute = +pass.getAttribute("minute");


        const matchPeriod = (minute >= +start && minute <= +end);
        pass.style.display = (matchPeriod)
            ? "block"
            : "none";
    });
}

/**===================================================================================================== */
function filterPass(pass, passFilter) {
    /**
     * 
const passFilter = {
  playersCheckboxes: [],
  start: 0,
  end: 125,
  zoneTo: 0,
  zoneFrom: 0,
  homePlayers: 18,
  awayPlayers: 18,
  high: true,
  head: true,
  good: true,
  failed: true,
  fighted: true
}
     */
    function isDiffers(a, b) {
        return a && !b || b && !a
    }
    function isDiffers(a, b) {
        if (!a) return

        return a && !b || b && !a
    }

    if (isDiffers(passFilter.good, pass.good)) return false
    if (isDiffers(passFilter.failed, pass.failed)) return false
    if (isDiffers(passFilter.high, pass.high)) return false
    if (isDiffers(passFilter.head, pass.head)) return false

    if (pass.type === 'throw' && !passFilter.throw) return false
    if (pass.type === 'freekick' && !passFilter.freekick) return false
    if (pass.type === 'goalkick' && !passFilter.goalkick) return false
    if (pass.type === 'fromout' && !passFilter.fromout) return false


    const minute = +pass.getAttribute("minute");
    if (minute < start || minute > end) return false

    const startpointX = +pass.getAttribute("startpoint-x");
    const startpointY = +pass.getAttribute("startpoint-y");
    if (passFilter.zoneFrom && !isPointMatchZone(startpointX, startpointY, passFilter.zoneFrom)) return false
    const endpointX = +pass.getAttribute("endpoint-x");
    const endpointY = +pass.getAttribute("endpoint-y");
    if (passFilter.zoneTo && !isPointMatchZone(endpointX, endpointY, passFilter.zoneTo)) return false




    return true
}
/**===================================================================================================== */
function filterPassesByMainFilter() {
    document.querySelectorAll("[class$=Pass]").forEach(pass => {
        // const minute = +pass.getAttribute("minute");
        const matchPass = filterPass(pass, passFilter);
        pass.style.display = (matchPass)
            ? "block"
            : "none";
    });
}

/**===================================================================================================== */
function drawTeamPasses(teamPasses, players, team, ctx) {
    const passboard = document.querySelector('#passesboard');
    passboard.querySelectorAll('.pass').forEach(function (el, key, parent) {
        el.parentNode.removeChild(el)
        // console.log("el - ", el, parent);
    })


    ZONES_COORDS.forEach((z, i) => {
        const zone = document.createElement('div');
        zone.classList.add('zone-border');
        zone.style.top = z.y - 1 + "px";
        zone.textContent = i + 1;

        zone.style.left = z.x - 1 + "px";
        zone.style.width = ZONE_WIDTH + "px";
        zone.style.height = ZONE_HEIGHT + "px";
        // line.style.transform = "rotate(" + getSegmentAngle(pass.startpoint, pass.endpoint) + "deg)";
        passboard.appendChild(zone);;

    })

    teamPasses.forEach((playerPasses, _player) => {
        if (!playerPasses[0]) return;
        playerPasses.forEach(pass => {
            const passInfo = { playerName: players[_player].name, team: team, player: _player + 1 };
            passboard.appendChild(createPass(pass, passInfo));;
        })

        //===================================================

        // ctx.beginPath(); 
        // ctx.fillStyle = _strokeStyle;
        // ctx.arc(pass.startpoint.x, pass.startpoint.y, 4, 0, 2 * Math.PI, false);
        // ctx.fill();              
        // ctx.moveTo(pass.startpoint.x, pass.startpoint.y);
        // ctx.lineWidth = 2;
        // ctx.lineTo(pass.endpoint.x, pass.endpoint.y);
        // ctx.arc(pass.endpoint.x, pass.endpoint.y, 2, 0, 2 * Math.PI, false);
        // ctx.strokeStyle = _strokeStyle;
        // ctx.stroke();

    });
}
  /**===================================================================================================== */


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
        let ballowner = 0;

        try {
          game.forEach((element, episode, episodes) => {
            let lastEpisode = episode > 0 ? episodes[episode - 1] : null;
            let nextEpisode = episodes[episode + 1] ? episodes[episode + 1] : null
            let nextEpisode2 = episodes[episode + 2] ? episodes[episode + 2] : null

            //===================================================================
            if (element.C) { flags.corner = true; flags.team = element.C; }
            if (element.A) { flags.throwIn = true; flags.team = element.A; }
            if (element.F) { flags.deadBall = true; flags.team = element.F; }
            if (element.T) {
              flags.goalKick = true; flags.team = element.T.team;
            }
            if (element.N) { flags.center = true; flags.team = element.N; }
            //===================================================================
            let newBallOwner = false;
            const currentBallOwner = getOwnerFromMessages(element.messages)
            if (currentBallOwner || currentBallOwner !== ballowner) {
              //new ballowner
              newBallOwner = true
              ballowner = currentBallOwner
            }
            //===================================================================
            function isBallOwnerWillChangeIn2NextEpisodes() {
              const nextBallOwner = nextEpisode && getOwnerFromMessages(nextEpisode)
              const nextBallOwner2 = nextEpisode2 && getOwnerFromMessages(nextEpisode2)
              if (nextBallOwner && nextBallOwner !== ballowner) return true
              if (!nextBallOwner && nextBallOwner2 && nextBallOwner2 !== ballowner) return true
              return false
            }


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
                // if (passObject.N && closestPlayer
                  // && isPassOpened() && closestPlayer.length === 0) console.log(" passObject  closestPlayer isPassOpened()", passObject, closestPlayer, isPassOpened());
                return passObject.N && closestPlayer
                  && isPassOpened() && closestPlayer.length === 0
              }
              //==============================================================================
              function isPrevAndClosestFromSameTeam() {
                if (!prevclosestPlayer || !closestPlayer) return false
                return isOneTeam(prevclosestPlayer.n, closestPlayer.n)
              }
              //==============================================================================
              function isPassstarterAndClosestFromSameTeam(_player) {
                if (!passObject.start || !_player) return false
                return isOneTeam(passObject.start.player, _player.n)
              }
              //==============================================================================
              function isPassOpened() {
                if (!passObject) return false
                return !!passObject.start
              }
              //==============================================================================

              //==============================================================================
              function isBallOutfield() {
                if (ball.w <= jsonCoords.x1 || ball.w >= jsonCoords.x2) return true
                if (ball.h <= jsonCoords.y1 || ball.h >= jsonCoords.y2) return true
                return false
              }
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
              function checkDribbling() {
                return false;
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
                  outfield: passObject.outfield,
                  player: passObject.start.player,
                  address: passObject.end.player
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
                // if (pass.outfield) console.log(" save pass - ", passObject, pass);
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

                // console.log('START PASS', player);

              }
              //==============================================================================
              function endThisPass(player) {
                passObject.end = {
                  ball: { ...ball },
                  player: player.n
                }

              }              //==============================================================================
              //==============================================================================
              //==============================================================================

              try {
                prevplayersCloseToBall = lastEpisode && lastEpisode.coordinates && calculatePlayerClosestToBall(lastEpisode.coordinates, secondTime);
                playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime);
                //** ---- */
                // console.log(" playersCloseToBall - ", playersCloseToBall, prevplayersCloseToBall, element);
                closestPlayer = playersCloseToBall[0]
                closestPlayer2 = playersCloseToBall[1]
                prevclosestPlayer = prevplayersCloseToBall && prevplayersCloseToBall[0]
                prevclosestPlayer2 = prevplayersCloseToBall && prevplayersCloseToBall[1]

                if (element.N) {

                  if (passObject) {
                    // console.log('closestPlayer- ', closestPlayer);
                    startPass(closestPlayer)
                  }
                  if (!passObject) startPass(closestPlayer)

                  passObject.N = true
                  // console.log("STARTED N ", passObject);
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
                      // console.log('PLAYER OWNS BALL');
                      return
                    }
                    return
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
                    return
                  }
                  if (isBallOutfield()) {
                    passObject.good = 0
                    passObject.outfield = true;
                    // console.log("Ball outfield", ball, element);
                    endThisPass(closestPlayer)
                    savePass()
                    resetPass()
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

                  if (isItFight()) {
                    if (checkAfterPassFight()) {
                      // console.log("FIGHT AFTER PASS -", closestPlayer, closestPlayer2, prevclosestPlayer, prevclosestPlayer2, element, passObject);
                      const passFailed = isBallOwnerWillChangeIn2NextEpisodes()
                      passObject.good = passFailed ? 0 : 1

                      const adress = isPassstarterAndClosestFromSameTeam(closestPlayer)
                        ? passFailed ? closestPlayer2 : closestPlayer
                        : passFailed ? closestPlayer : closestPlayer2
                      endThisPass(adress)
                      savePass()
                      startPass(adress)

                      return;
                    };
                    if (checkDribbling()) {
                      return
                    }
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
                ;
                // console.log("error ", lastEpisode);
                // console.log("Что то не так с обсчетом паса", element.minute, element.n, error);
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

  xmlhttp.open("GET", formJsonUrl({ DEFAULT_TV_URL, test: false }));
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

;
function filterMapsByTime(_start, end) {
    try {
        const start = _start == 0 ? 1 : _start;
        if ((start > end) || ((+end - +start) <= MIN_MINUTES_FOR_SHOW_TACTIC)) return;
        const startEpisode = minutesStarts[start];
        const endEpisode = minutesStarts[end];
        const filteredPoints = {
            home: [],
            away: [],
            ball: [],
        }
        const playersFiltered = {
            home: [],
            away: []
        }
        filteredPoints.ball = ballPoints.slice(startEpisode, endEpisode);

        function filterTeamPoints(_team = "home") {
            playersFiltered[_team] = outData[_team].PointsFull.map(pl => pl.slice(startEpisode, endEpisode));
            playersFiltered[_team].forEach((row, n) => {
                if (n === 0) return;
                row.filter(el => el != null).forEach(point => filteredPoints[_team].push(point))
            });
        }

        filterTeamPoints("home")
        filterTeamPoints("away")
        updateMainMaps(filteredPoints.home, filteredPoints.away, filteredPoints.ball);

        function displayTeamAvgPoints(_team = "home") {
            const _avgPoints = calculateAvgPositions(playersFiltered[_team]).slice();
            const _rank = _avgPoints[0].order;
            for (let n = 1; n <= MAX_PLAYERS; n++) {
                const pl = document.getElementById(_team + "AvgPoints" + n);
                const plRank = _rank.indexOf(_rank.find(_ => _.playerRank == n));
                pl.style.display = plRank < 11 ? "inherit" : "none";

                pl.style.left = _avgPoints[n].x - 5 + "px";
                pl.style.top = _avgPoints[n].y - 5 + "px";
                const plBoth = document.getElementById("both" + _team + "AvgPoints" + n);
                plBoth.style.display = pl.style.display;
                plBoth.style.left = pl.style.left;
                plBoth.style.top = pl.style.top;
                const plName = document.getElementById(_team + "-player-list_" + n + '_name');
                plName.style.fontWeight = plRank < 11 ? "bold" : "normal";
            }
        }
        displayTeamAvgPoints("home")
        displayTeamAvgPoints("away")
    } catch (error) {
        console.log(error)
    }
}
//"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
;
function afterLoadEvents() {
    function formHeatmapUrl(_urlINput) {
        return window.location.origin + window.location.pathname + "?" + _urlINput.replace('http://pefl.ru/tv/#/', '');
    };
    function formTVUrl() {
        let locationString = window.location.href;
        locationString = locationString
            .replace("http://pefl.ru/heatmaps.html?", "http://pefl.ru/tv/#/")
            .replace(":8080//", ':8080/')
            .replace("http://localhost:8080/heatmaps.html?", 'http://pefl.ru/tv/#/');

        return locationString;
    }

    /**===================================================================================================== */
    const urlInput = document.querySelector("#tv-url-input");
    document.getElementById("tv-url").href = formTVUrl();
    document.getElementById("json-url").href = formJsonUrl({ test: false });
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
    function normalizeTacticAvgPositions(_team) {

        if (outData[_team].TacticPoints.length > 1) {
            for (let t = 1; t < outData[_team].TacticPoints.length; t++) {
                if (outData[_team].TacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                for (let n = 1; n <= MAX_PLAYERS; n++) {
                    const pl = document.querySelector("#" + _team + "AvgPoints_" + t + "_" + n);
                    const rank = outData[_team].TacticPoints[t].rankByMinutes
                    pl.style.display = rank.indexOf(rank.find(el => { return el[0] == n })) < 11 ? "inherit" : "none";
                }
            }
        }
    }
    setTimeout(() => {
        document.querySelector("#shots-chalkboard ~ .bojan__content")
            .appendChild(
                createSlider("shots", showableTacticks, filterShotsByTime)
            );
        document.querySelector("#maps-filtered ~ .bojan__content")
            .appendChild(
                createSlider("maps", showableTacticks, filterMapsByTime)
            )
        document.querySelector("#pass-chalkboard ~ .bojan__content")
            .appendChild(
                createSlider("pass", showableTacticks, filterPassesByTime)
            );
        document.getElementById("norm-tactic-avg").addEventListener("click", function (e) {
            e.preventDefault();
            normalizeTacticAvgPositions("home");
            normalizeTacticAvgPositions("away");
        });
        document.getElementById("reset-maps-filtering").addEventListener("click", function (e) {
            e.preventDefault();
            filterMapsByTime(0, 125);
            filterRangeMaximize("maps-time-filter");
        })
    }, 200);

};

;
function createSlider(prefix = "", tacticksArray = [[[0, 125]], [[0, 125]]], cb) {

    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("time-slider");
    filterWrapper.id = prefix + "-time-filter";
    filterWrapper.addEventListener("change", function(e){
        e.preventDefault();
        updateValues();
    })
    
    setLimits(0, 125);
    function formTackticksRow(data = [0, 125], team = "home") {
        const t = document.createElement("div");
        t.classList.add("time-slider__tacticks");
        const _label = document.createElement("span");
        _label.innerText = team === "home" ? "Тактики хозяев" : "Тактики гостей";
        t.appendChild(_label);
        const _ul = document.createElement("ul");
        data.forEach(el => {
            ; const _li = document.createElement("li");
            _li.innerText = el[0] + " - " + el[1];
            _li.classList.add("time-slider__tacticks__ref");
            _li.addEventListener("click", function (e) {
                e.preventDefault();
                setLimits(el[0], el[1]);
                updateValues();
            })
            _ul.appendChild(_li);
        })
        t.appendChild(_ul);
        return t;
    }
    const inputs = document.createElement("div");
    inputs.classList.add("time-slider__inputs");
    const sinput = document.createElement("input");
    sinput.type = "number"; sinput.min = 0; sinput.max = 125; sinput.value = 0;
    sinput.id = prefix + "-start-input";

    const einput = sinput.cloneNode(true);
    einput.id = prefix + "-end-input";
    sinput.addEventListener('change', function (e) {
        e.preventDefault();
        if (+this.value > +filterWrapper.getAttribute("end") - 3) {
            this.value = +filterWrapper.getAttribute("end") - 3;
        }
        start(this.value);
        updateValues();
    })
    einput.addEventListener('change', function (e) {
        e.preventDefault();
        if (+this.value < +filterWrapper.getAttribute("start") + 3) {
            this.value = +filterWrapper.getAttribute("start") + 3;
        }
        end(this.value);
        updateValues();
    })

    const inputsLabel = document.createElement("span");
    inputsLabel.innerText = "Границы периода";
    inputs.appendChild(sinput);
    inputs.appendChild(inputsLabel);
    inputs.appendChild(einput);

    function start(_start) {
        filterWrapper.setAttribute("start", _start);
    }
    function end(_end) {
        filterWrapper.setAttribute("end", _end);
    }
    function setLimits(start, end) {
        filterWrapper.setAttribute("start", start);
        filterWrapper.setAttribute("end", end);
    }

    function updateValues() {
        const _start = +filterWrapper.getAttribute("start");
        const _end = +filterWrapper.getAttribute("end");
        sinput.value = _start;
        einput.value = _end;

        cb(_start, _end);
    }

    if (tacticksArray[0].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[0]));
    if (tacticksArray[1].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[1], "away"));
    filterWrapper.appendChild(inputs);
    updateValues();
    // cb(filterWrapper.getAttribute("start"), filterWrapper.getAttribute("end"));

    return filterWrapper;
}
//# sourceMappingURL=hm2.js.map
