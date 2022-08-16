(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

;
var DEFAULT_TV_URL = window.location.href.replace(/\/index.html/, "/").replace(/\/heatmaps.html/, "/") + "/tv/#/j=1&z=c12345";

var getImagesUrl = function getImagesUrl() {
  return window.location.href.replace(/\/index.html/, "/").replace(/\/heatmaps.html/, "/") + "public/images";
}; // ; const tvurl = "http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c";


var MAX_VALUE = 60;
var MAX_OPACITY = .7;
var MIN_OPACITY = .05;
var POINT_RADIUS = 35;
var MAX_PLAYERS = 18;
var GK_VALUE = .2;
var BALL_RADIUS_KEFF = .67;
var BALL_MAX_KEFF = 0.33;
var BALL_TACTICS_RADIUS_KEFF = 1.1;
var BALL_TACTICS_MAX_KEFF = 0.35;
var TEAM_RADIUS_KEFF = .65;
var TEAM_MAX_KEFF = 1.1;
var HOME = 1;
var AWAY = 2;
var SUB_OUT = 1;
var SUB_IN = 2;
var SHOW = true;
var HIDE = false;
var MIN_MINUTES_FOR_SHOW_TACTIC = 3;
var shotsCoords = {
  x1: 39,
  y1: 38,
  x2: 712,
  y2: 458
};
var jsonCoords = {
  x1: 0,
  y1: 0,
  x2: 720,
  y2: 450
};
var hmCoords = {
  x1: 18.98,
  y1: 19,
  x2: 346.56,
  y2: 229.5
};
var ZONE_WIDTH = (shotsCoords.x2 - shotsCoords.x1) / 6.0;
var ZONE_HEIGHT = (shotsCoords.y2 - shotsCoords.y1) / 3.0;

var ZONES = _toConsumableArray(Array(18)).map(function (_, i) {
  return {
    x: i / 3 >> 0,
    y: i % 3
  };
});

var ZONES_COORDS = ZONES.map(function (z) {
  return {
    x: shotsCoords.x1 + z.x * ZONE_WIDTH,
    y: shotsCoords.y1 + z.y * ZONE_HEIGHT
  };
});
var ZONES_FIND_ORDER = [8, 11, 5, 14, 7, 10, 9, 12, 2, 17, 4, 6, 13, 15, 1, 3, 16, 18];
var FIELD_LONGTITUDE = 105;
var RE_CENTER_MSG = /разыг|розыг/gi;
var RE_GOAL_LOW_PASS_MSG = /разыг|розыг/gi;
var RE_PASS_FROM_GOALKICK = /пас|переда|смотри/gi;
var RE_LONG_PASS = /авес|аброс|линны/g;
var RE_SCORE_WITH_PENALTIES = /\d+:\d+/g;
var RE_PLAYER_NUMBERS = /[0-9]+/gi;
var MILEAGE_KEFF = FIELD_LONGTITUDE / (hmCoords.x2 - hmCoords.x1);
var SHOT_TOOLTIP = "Удары|В створ|Голы-автоголы   |Блокированные|Каркас";
var outData = {
  home: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: []
  },
  away: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: []
  }
};
var ballPoints = [];
var minutesStarts = [0];
var strangePoints = {
  home: [],
  away: []
};
var oldshots = {
  home: [],
  away: []
};
var shots = {
  home: [],
  away: []
};
var sumInterval = 0;
outData["home"].TacticPoints.push({
  start: 0,
  end: 1,
  period: 0,
  startPoint: 0,
  endPoint: 1,
  team: [],
  ball: [],
  averages: []
});
outData["away"].TacticPoints.push({
  start: 0,
  end: 1,
  period: 0,
  startPoint: 0,
  endPoint: 1,
  team: [],
  ball: [],
  averages: []
});
var showableTacticks = [];
var oldpasses = [[]];
var passes = [[]];
var passFilter = {
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
};

for (var i = 0; i <= MAX_PLAYERS; i++) {
  var createInitTeamsData = function createInitTeamsData(team) {
    var _team = team || "home";

    outData[_team].Points.push([]);

    outData[_team].Mileage.push(0);

    outData[_team].AvgPoints.push({
      x: 0,
      y: 0
    });

    outData[_team].TacticPoints[0].averages.push([{
      x: 0,
      y: 0
    }]);

    outData[_team].PointsFull.push([]);
  };

  createInitTeamsData("home");
  createInitTeamsData("away");
}

for (var _i = 1; _i <= MAX_PLAYERS * 2; _i++) {
  oldpasses.push([]);
  passes.push([]);
  passFilter.playersCheckboxes.push(true);
}

var secondTime = false;
var penalties = false; // ; const JSON_URL_START = 'http://pefl.ru/jsonreport.php';

;
var JSON_URL_START = window.location.origin + '/public/data/'; //==============================================================================

function formJsonUrl(_ref) {
  var tvurl = _ref.tvurl,
      _ref$test = _ref.test,
      test = _ref$test === void 0 ? false : _ref$test;
  console.log("###window.location.origin + tvurl - ", window.location.origin + tvurl, test);
  if (test) return window.location.origin + tvurl;

  var _tvurl = tvurl || DEFAULT_TV_URL;

  var urlString = window.location.href.match(/j\=\d+\&z\=.+/i) // ? window.location.href 
  ? window.location.href.replace(/\/index.html/, "/") : _tvurl;
  var zIndex = urlString.indexOf('&z=');
  var jIndex = urlString.indexOf('j=');
  console.log(window.location.href.match(/j\=\d+\&z\=.+/i), urlString, zIndex, jIndex);
  console.log("__".concat(urlString.substring(2 + jIndex, zIndex), ".json"));
  return JSON_URL_START + "__".concat(urlString.substring(2 + jIndex, zIndex), ".json"); // return JSON_URL_START + `?j=${urlString.substring(2 + jIndex, zIndex)}&z=${urlString.substring(3 + zIndex)}`;
} //==============================================================================


function limitPoint(point) {
  var secondTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var coords1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : hmCoords;
  var coords2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : jsonCoords;
  var x = point.x;
  var y = point.y;
  var newX;
  var newY;

  if (secondTime) {
    newX = Math.round(coords1.x2 - (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1));
    newY = Math.round(coords1.y2 - (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1));
  } else {
    newX = Math.round(coords1.x1 + (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1));
    newY = Math.round(coords1.y1 + (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1));
  }

  return {
    x: newX,
    y: newY,
    value: point.value
  };
} //==============================================================================


function normalizePoint(point) {
  var away = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var coords2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jsonCoords;

  if (away) {
    return {
      n: point.n,
      h: coords2.y2 - point.h,
      w: coords2.x2 - point.w,
      value: 1
    };
  }

  return {
    n: point.n,
    h: point.h,
    w: point.w,
    value: 1
  };
} //==============================================================================


function getSegmentLength(point1, point2) {
  var dX = point2.x - point1.x;
  var dY = point2.y - point1.y;
  return Math.sqrt(dX * dX + dY * dY);
} //==============================================================================


function isPointMatchZone() {
  var pointX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var pointY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var zoneNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 14;
  if (!zoneNumber) return false;
  if (!ZONES_COORDS[zoneNumber]) return false;
  var _zone = ZONES_COORDS[zoneNumber];
  if (pointX < _zone.x || pointY < _zone.y) return false;
  if (pointX > _zone.x + ZONE_WIDTH || pointY > _zone.y + ZONE_HEIGHT) return false;
  return true;
} //==============================================================================


function getLength(coord1, coord2) {
  var dX = coord2.w - coord1.w;
  var dY = coord2.h - coord1.h;
  return Math.sqrt(dX * dX + dY * dY);
} //==================================================


function getLengthToBall(coord, ball) {
  var _away = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var point = normalizePoint(coord, _away);
  var length = getLength(point, ball); // console.log("ball, point, _away, length ", ball, point, _away, length);

  return length;
} //==============================================================================


function getSegmentAngle(startPoint, endPoint) {
  var dX = endPoint.x - startPoint.x;
  var dY = endPoint.y - startPoint.y;
  var keff = dX < 0 ? dY < 0 ? -180 : 180 : 0;
  return keff + Math.atan(dY / dX) * 180 / Math.PI;
  ;
} //==============================================================================


function getMileage(point1, point2) {
  return MILEAGE_KEFF * getSegmentLength(point1, point2);
} //==============================================================================


function leaveValuablePoints(pointsArr) {
  return pointsArr.filter(function (point) {
    return !point;
  }); // if not null
} //==============================================================================


function getOwnerFromMessages(_messages) {
  if (!_messages) return null;
  if (!_messages[0]) return null;
  return _messages[0].owner;
} //==============================================================================


function getPlayerFromMessage(_message) {
  var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (!_message || !_message.mes) return 0; // const playerNumbersOld = String(_message.mes).match(/(?<=\[)\d+(?=\])/g);
  // return playerNumbers != null && playerNumbers[num - 1] ? +playerNumbers[num - 1] : 0;
  // replace nice regexp by some kind of polifill for IE

  var message = String(_message.mes);
  var messageLength = message.length;
  var openingSquareIndex = 0;
  var playerNumbers = [];

  for (var _i2 = 0; _i2 < messageLength; _i2++) {
    if (message[_i2] === '[') {
      openingSquareIndex = _i2 + 1;
    } else if (message[_i2] === ']' && openingSquareIndex < _i2 && openingSquareIndex > 0) {
      // console.log("openingSquareIndex - ", openingSquareIndex, i, message.substr(openingSquareIndex, i - openingSquareIndex));
      playerNumbers.push(+message.substr(openingSquareIndex, _i2 - openingSquareIndex));
    }
  } // console.log("playerNumbers - ", playerNumbers, "playerNumbersOld - ", playerNumbersOld, message);


  return openingSquareIndex ? playerNumbers[num - 1] ? +playerNumbers[num - 1] : 0 : null;
} //==============================================================================


function getPointsSet(pointsArr, start, end) {
  return pointsArr.slice(start, end);
}
/**===================================================================================================== */


function clearPoint(arr) {
  return arr.filter(function (el) {
    return el != null;
  });
}
/**===================================================================================================== */


function isOneTeam(firstPlayerNumber, secondPlayerNumber) {
  return firstPlayerNumber < MAX_PLAYERS + 1 && secondPlayerNumber < MAX_PLAYERS + 1 || firstPlayerNumber > MAX_PLAYERS && secondPlayerNumber > MAX_PLAYERS;
}
/**===================================================================================================== */


function getSubArrow(_sub) {
  var sub = _sub || SUB_OUT;
  var imgUrl = getImagesUrl();
  var arrRef = sub == SUB_OUT ? imgUrl + '/out.gif' : imgUrl + '/in.gif'; // const arrRef = sub == SUB_OUT ? 'http://pefl.ru/system/img/gm/out.gif' : 'http://pefl.ru/system/img/gm/in.gif';

  var arrow = document.createElement("img");
  arrow.src = arrRef;
  return arrow;
}
/**===================================================================================================== */


function createEye(toolTip) {
  var eye = document.createElement('img');
  var imgUrl = getImagesUrl();
  eye.src = imgUrl + "/eye.png"; // eye.src = "http://pefl.ru/images/eye.png";

  eye.alt = "";
  var tp = document.createElement('div');
  tp.className = "tooltiptext";
  tp.innerText = toolTip;
  eye.appendChild(tp);
  return eye;
} //**========================================================================================================= */


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
} //**========================================================================================================= */


if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}
/**===================================================================================================== */


;

function createShotLine(shot, shotinfo, color) {
  var line = document.createElement('div');
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
  var shotStart = document.createElement('div');
  shotStart.classList.add('shotstart');
  shotStart.style.borderColor = color;
  shotStart.style.backgroundColor = color;
  shotStart.style.top = shot.startpoint.y - 5 + "px";
  shotStart.style.left = shot.startpoint.x - 5 + "px";
  var typeString = shot.type == "G" ? 'Гол' : shot.type == "V" ? 'Удар в створ' : shot.type == "W" ? 'Автогол' : shot.type == "Block" ? 'Блок' : shot.type == "B" ? 'Каркас ворот' : 'Мимо';
  shotStart.addEventListener('mouseenter', function (e) {
    var shotLegend = document.querySelector('#one-shot-legend');
    var shotString = " Минута " + shot.minute + ", " + typeString + ", " + shot.xG + ",\n\r " + shot.player + "." + shotinfo.playerName;
    shotLegend.textContent = shotString;
    shotLegend.style.display = "inline-block";
  });
  shotStart.addEventListener('mouseleave', function (e) {
    document.querySelector('#one-shot-legend').style.display = "none";
  });
  return shotStart;
}
/**===================================================================================================== */


function createShotEnd(shot, shotinfo, color) {
  var shotEnd = document.createElement('div');
  shotEnd.classList.add('shotend');
  shotEnd.style.borderColor = color;
  shotEnd.style.backgroundColor = color;
  shotEnd.style.top = shot.endpoint.y - 2 + "px";
  shotEnd.style.left = shot.endpoint.x - 1 + "px";
  return shotEnd;
}
/**===================================================================================================== */


function createShot(shot, shotinfo) {
  var _strokeStyle = shot.type == "G" ? 'red' : shot.type == "V" ? 'yellow' : shot.type == "Block" ? 'black' : shot.type == "B" ? 'black' : shot.type == "W" ? "#FFA500" : 'blue';

  var shotPict = document.createElement('div');
  shotPict.classList.add('shot');
  var teamClass = shotinfo.team + "Shot";
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
  teamShots.forEach(function (shot, shotNum) {
    var shotInfo = {
      playerName: players[shot.player - 1].name,
      team: team
    };
    document.querySelector('#chalkboard').appendChild(createShot(shot, shotInfo));
  });
}
/**===================================================================================================== */


function countShot(newShotType, player) {
  if (newShotType == "U") {
    if (!player.miss) {
      player.miss = 1;
      return;
    }

    player.miss++;
  }

  if (newShotType == "G") {
    if (!player.goals) {
      player.goals = 1;
      return;
    }

    player.goals++;
  }

  if (newShotType == "B") {
    if (!player.bar) {
      player.bar = 1;
      return;
    }

    player.bar++;
  }

  if (newShotType == "Block") {
    if (!player.block) {
      player.block = 1;
      return;
    }

    player.block++;
  }

  if (newShotType == "V") {
    if (!player.stvor) {
      player.stvor = 1;
      return;
    }

    player.stvor++;
  }

  if (newShotType == "W") {
    if (!player.autogoals) {
      player.autogoals = 1;
      return;
    }

    player.autogoals++;
  }
}
/**===================================================================================================== */


function formShotsString(player) {
  var autogoals = player.autogoals ? "" + -parseInt(player.autogoals) : "";
  var goals = player.goals ? parseInt(player.goals) : 0;
  var stvor = goals + (player.stvor ? parseInt(player.stvor) : 0);
  var sum = stvor + (player.miss ? parseInt(player.miss) : 0);
  var goalsString = "|" + goals + autogoals;
  var bars = player.bar ? "|" + parseInt(player.bar) : " ";
  var blocks = player.block ? "|" + parseInt(player.block) : " ";
  return sum + bars + blocks == 0 && autogoals == "" ? " " : sum == 0 ? "        " + autogoals + blocks + bars : (sum > 9 ? sum : " " + sum) + "|" + stvor + goalsString + " " + blocks + bars;
}
/**===================================================================================================== */


function displayAllShots(display, team) {
  var hard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var allHide = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var shotsSelector = "." + team + "Shot";
  document.querySelectorAll(shotsSelector).forEach(function (shot) {
    if (allHide) {
      shot.style.display = "none";
      return;
    }

    var checkbox = document.querySelector("#" + team + "-player-list_" + shot.getAttribute("player") + " input");
    var checked = checkbox ? checkbox.checked : false;
    shot.style.display = display ? "block" : checked && !hard ? "block" : "none";
  });
}

function filterShotsByTime(start, end) {
  document.querySelectorAll("[class$=Shot]").forEach(function (shot) {
    var minute = +shot.getAttribute("minute");
    var matchPeriod = minute >= +start && minute <= +end;
    shot.style.display = matchPeriod ? "block" : "none";
  });
}

function changeCheckboxCount() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  var team = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "home";
  var shotsContainer = document.querySelectorAll('.shots-container-wrapper')[0];
  var chboxCount = parseInt(team == "home" ? shotsContainer.getAttribute("data-homes") : shotsContainer.getAttribute("data-aways"));

  if (action == -1) {
    chboxCount--;
  } else {
    chboxCount++;
  }

  ;
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
  var chbox = document.createElement('input');
  chbox.type = "checkbox";
  chbox.checked = false;
  chbox.style.cursor = "pointer";
  chbox.addEventListener('click', function (e) {
    if (this.checked) {
      changeCheckboxCount(1, params.team);
      displayAllShots(false, params.team, false);
    } else {
      if (changeCheckboxCount(-1, params.team) == 0) {
        displayAllShots(true, params.team);
      } else {
        displayAllShots(false, params.team, false);
      }
    }
  });
  return chbox;
} //=================================================


function changeVisibilityByType(e) {
  e.preventDefault();
  var type = this.getAttribute("data-type");
  var shotsSelector = ".shot[shottype=" + type + "]";
  var checked = this.style.fontWeight == "bold";
  document.querySelectorAll(shotsSelector).forEach(function (shot) {
    shot.style.display = !checked ? "block" : "none";
  });

  if (type == "G") {
    // цепляем и автоголы
    document.querySelectorAll(".shot[shottype=W]").forEach(function (shot) {
      shot.style.display = !checked ? "block" : "none";
    });
  }

  this.style.fontWeight = checked ? "normal" : "bold";
} //=================================================


var fGoals = document.getElementById("filterGoals");
fGoals.addEventListener('click', changeVisibilityByType.bind(fGoals));
var fStvor = document.getElementById("filterStvor");
fStvor.addEventListener('click', changeVisibilityByType.bind(fStvor));
var fMiss = document.getElementById("filterMiss");
fMiss.addEventListener('click', changeVisibilityByType.bind(fMiss));
var fBars = document.getElementById("filterBars");
fBars.addEventListener('click', changeVisibilityByType.bind(fBars));
var fBlocks = document.getElementById("filterBlocks");
fBlocks.addEventListener('click', changeVisibilityByType.bind(fBlocks));

function filterRangeMaximize(_timeFilterId) {
  var timeFilter = document.getElementById(_timeFilterId);
  timeFilter.setAttribute("start", 0);
  timeFilter.setAttribute("end", 125);
  timeFilter.dispatchEvent(new Event('change', {
    bubbles: true
  }));
}

function showAllShots() {
  var _show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  displayAllShots(_show, "home", true, !_show);
  displayAllShots(_show, "away", true, !_show);

  if (_show) {
    document.querySelectorAll(".squadAndShots-containers-wrapper input[type=checkbox]").forEach(function (chbox) {
      chbox.checked = HIDE;
    });
    filterRangeMaximize("shots-time-filter");
  }

  document.querySelectorAll("a[id^=filter]:nth-of-type(-n+5)").forEach(function (aButton) {
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
  return pass.type == "corner" ? 'угловой' : pass.type == "throw" ? 'аут' : pass.type == "freekick" ? 'штрафной' : pass.type == "goalkick" ? 'от ворот' : '';
}
/**===================================================================================================== */


function formPassString(pass, passinfo) {
  return " Минута " + pass.minute + ", " + (pass.good ? "точно" : "неточно") + (pass.high ? ", верхом ," : ", низом ,") + getTypeString(pass) + ",\n\r " + passinfo.player + "." + passinfo.playerName;
}
/**===================================================================================================== */


;

function createPassLine(pass, passinfo, color) {
  var line = document.createElement('div');
  line.classList.add('pass-line');
  line.style.top = pass.startpoint.y - 1 + "px";
  line.style.left = pass.startpoint.x - 1 + "px";
  line.style.width = getSegmentLength(pass.startpoint, pass.endpoint) + "px";
  line.style.transform = "rotate(" + getSegmentAngle(pass.startpoint, pass.endpoint) + "deg)";
  line.style.borderTopColor = color;
  line.addEventListener('mouseenter', function (e) {
    var passLegend = document.querySelector('#one-pass-legend');
    passLegend.textContent = formPassString(pass, passinfo);
    passLegend.style.display = "inline-block";
  });
  line.addEventListener('mouseleave', function (e) {
    document.querySelector('#one-pass-legend').style.display = "none";
  });
  return line;
}
/**===================================================================================================== */


function createPassStart(pass, passinfo, color) {
  var passStart = document.createElement('div');
  passStart.classList.add('pass-start');
  passStart.style.borderColor = color;
  passStart.style.backgroundColor = color;
  passStart.style.top = pass.startpoint.y - 5 + "px";
  passStart.style.left = pass.startpoint.x - 5 + "px";
  var typeString = getTypeString(pass);
  passStart.addEventListener('mouseenter', function (e) {
    var passLegend = document.querySelector('#one-pass-legend');
    passLegend.textContent = formPassString(pass, passinfo);
    passLegend.style.display = "inline-block";
  });
  passStart.addEventListener('mouseleave', function (e) {
    document.querySelector('#one-pass-legend').style.display = "none";
  });
  return passStart;
}
/**===================================================================================================== */


function createPass(pass, passinfo) {
  var _strokeStyle = !pass.good ? 'red' : 'blue';

  var passPict = document.createElement('div');
  passPict.classList.add('pass');
  var teamClass = passinfo.team + "Pass";
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
  passFilter.start = start;
  passFilter.end = end;
  document.querySelectorAll("[class$=Pass]").forEach(function (pass) {
    var minute = +pass.getAttribute("minute");
    var matchPeriod = minute >= +start && minute <= +end;
    pass.style.display = matchPeriod ? "block" : "none";
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
    return a && !b || b && !a;
  }

  function isDiffers(a, b) {
    if (!a) return;
    return a && !b || b && !a;
  }

  if (isDiffers(passFilter.good, pass.good)) return false;
  if (isDiffers(passFilter.failed, pass.failed)) return false;
  if (isDiffers(passFilter.high, pass.high)) return false;
  if (isDiffers(passFilter.head, pass.head)) return false;
  if (pass.type === 'throw' && !passFilter.throw) return false;
  if (pass.type === 'freekick' && !passFilter.freekick) return false;
  if (pass.type === 'goalkick' && !passFilter.goalkick) return false;
  if (pass.type === 'fromout' && !passFilter.fromout) return false;
  var minute = +pass.getAttribute("minute");
  if (minute < start || minute > end) return false;
  var startpointX = +pass.getAttribute("startpoint-x");
  var startpointY = +pass.getAttribute("startpoint-y");
  if (passFilter.zoneFrom && !isPointMatchZone(startpointX, startpointY, passFilter.zoneFrom)) return false;
  var endpointX = +pass.getAttribute("endpoint-x");
  var endpointY = +pass.getAttribute("endpoint-y");
  if (passFilter.zoneTo && !isPointMatchZone(endpointX, endpointY, passFilter.zoneTo)) return false;
  return true;
}
/**===================================================================================================== */


function filterPassesByMainFilter() {
  document.querySelectorAll("[class$=Pass]").forEach(function (pass) {
    // const minute = +pass.getAttribute("minute");
    var matchPass = filterPass(pass, passFilter);
    pass.style.display = matchPass ? "block" : "none";
  });
}
/**===================================================================================================== */


function drawTeamPasses(teamPasses, players, team, ctx) {
  var passboard = document.querySelector('#passesboard');
  passboard.querySelectorAll('.pass').forEach(function (el, key, parent) {
    el.parentNode.removeChild(el); // console.log("el - ", el, parent);
  });
  ZONES_COORDS.forEach(function (z, i) {
    var zone = document.createElement('div');
    zone.classList.add('zone-border');
    zone.style.top = z.y - 1 + "px";
    zone.textContent = i + 1;
    zone.style.left = z.x - 1 + "px";
    zone.style.width = ZONE_WIDTH + "px";
    zone.style.height = ZONE_HEIGHT + "px"; // line.style.transform = "rotate(" + getSegmentAngle(pass.startpoint, pass.endpoint) + "deg)";

    passboard.appendChild(zone);
    ;
  });
  teamPasses.forEach(function (playerPasses, _player) {
    if (!playerPasses[0]) return;
    playerPasses.forEach(function (pass) {
      var passInfo = {
        playerName: players[_player].name,
        team: team,
        player: _player + 1
      };
      passboard.appendChild(createPass(pass, passInfo));
      ;
    }); //===================================================
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


var maximumValue = MAX_VALUE;
var heatmapInstance;
var heatmapInstance2;
var heatmapInstance3;
var heatmapInstance4;
var heatmapInstance5;
var heatmapInstance7;
var heatmapInstance8;
var heatmapInstance9;
var rep; //-------------------------------------------------

function calculateAvgPositions(_points) {
  var _avgPoints = [];

  for (var _i3 = 0; _i3 <= MAX_PLAYERS; _i3++) {
    _avgPoints.push({
      x: 0,
      y: 0,
      points: 0
    });
  }

  _points.forEach(function (rawHmap, _n) {
    var hmap = rawHmap.filter(function (point) {
      return point != null;
    });
    var avg = hmap.length;
    if (_n === 0 || avg < 1) return;
    hmap.forEach(function (point, i) {
      _avgPoints[_n].x += point.x / avg;
      _avgPoints[_n].y += point.y / avg;
      _avgPoints[_n].points++;
    });

    var order = _avgPoints.map(function (pl, i) {
      var playerPoints = {
        playerRank: i,
        points: pl.points
      };
      return playerPoints;
    }).slice(1).sort(function (a, b) {
      return +b.points - +a.points;
    });

    _avgPoints[0].order = order;
  });

  return _avgPoints;
} //--------------------------------------------------------------------


function calculatePlayerClosestToBall(coords, _secondTime) {
  var ball = coords.ball; // console.log("calculatePlayerClosestToBall secondtime", _secondTime);

  var players = [];
  var closestPlayer = {
    n: 0,
    length: 10000
  };
  var prevPlayer = {
    n: 0,
    length: 10000
  }; // let minLength = 10000;

  coords.home.forEach(function (pl) {
    var length = getLengthToBall(pl, ball, false); // console.log("pl, ball, length  home", pl, ball, length, minLength);

    if (length < closestPlayer.length) {
      // players.push({ n: pl.n, length: length });
      prevPlayer.n = closestPlayer.n;
      prevPlayer.length = closestPlayer.length;
      closestPlayer.n = pl.n;
      closestPlayer.length = length;
    } else if (length < prevPlayer.length) {
      prevPlayer.n = pl.n;
      prevPlayer.length = length;
    }
  });
  coords.away.forEach(function (pl) {
    var length = getLengthToBall(pl, ball, true); // console.log("pl, ball, length away", pl, ball, length, minLength);

    if (length < closestPlayer.length) {
      // players.push({ n: pl.n, length: length });
      prevPlayer.n = closestPlayer.n;
      prevPlayer.length = closestPlayer.length;
      closestPlayer.n = pl.n + MAX_PLAYERS;
      closestPlayer.length = length;
    } else if (length < prevPlayer.length) {
      prevPlayer.n = pl.n + MAX_PLAYERS;
      prevPlayer.length = length;
    }
  });
  return [closestPlayer, prevPlayer];
} //==============================================================================
//==============================================================================
//==============================================================================


var startTime = Date.now();

window.onload = function () {
  //--------------------------------------------------------------------
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");

  xmlhttp.onreadystatechange = function () {
    // setTimeout(function () {
    if (this.readyState == this.OPENED) {
      xmlhttp.setRequestHeader('Accept', "application/json, text/javascript, */*; q=0.01");
    }

    if (this.readyState == 4
    /*&& this.status == 200*/
    ) {
      if (this.status == 200) {
        //--------------------------------------------------------------------
        var setTeamsColors = function setTeamsColors() {
          var away = document.querySelector("#player_default_away .player_shape").style;
          var home = document.querySelector("#player_default_home .player_shape").style;
          away.backgroundColor = "#" + rep.away.team.back;
          away.borderColor = "#" + rep.away.team.color;
          away.color = "#" + rep.away.team.color;
          home.color = "#" + rep.home.team.color;
          home.borderColor = "#" + rep.home.team.color;
          home.backgroundColor = "#" + rep.home.team.back;
        };

        var getPenalties = function getPenalties(s, p) {
          var score = s.split(':');
          var withpens = p.split(':');
          return "".concat(withpens[0] - score[0], ":").concat(withpens[1] - score[1]);
        };

        /**===================================================================================================== */
        var avgMapCreate = function avgMapCreate(_id) {
          var radiusKef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEAM_RADIUS_KEFF;
          var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MIN_OPACITY;
          var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_OPACITY;
          return h337.create({
            container: document.querySelector(_id),
            //'#heatmap-avgSubHome'),
            maxOpacity: max,
            minOpacity: min,
            radius: POINT_RADIUS * radiusKef
          });
        };

        /**===================================================================================================== */
        var showTeamTacticHeamaps = function showTeamTacticHeamaps() {
          var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

          document.querySelector("#" + _team + "-tacticks-heatmaps + .bojan__label .bojan__label__header").textContent = "Смены тактик " + rep[_team].team.name;

          if (outData[_team].TacticPoints.length > 1) {
            var _loop = function _loop(t) {
              if (outData[_team].TacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) return "continue";
              outData[_team].TacticPoints[t].rankByMinutes = [];

              outData[_team].TacticPoints[t].averages.forEach(function (positions, _n) {
                var avg = positions.length;
                outData[_team].TacticPoints[t].rankByMinutes[_n] = [_n, avg];
                if (_n === 0 || avg < 2) return;
                positions.forEach(function (pos, i, _arr) {
                  positions[0].x += pos.x / avg;
                  positions[0].y += pos.y / avg;
                });
              });

              outData[_team].TacticPoints[t].rankByMinutes.sort(function (a, b) {
                return b[1] - a[1];
              });

              var divWrapper = document.getElementsByClassName('heatmap2-containers-wrapper')[0];
              var newDiv = divWrapper.cloneNode(true);
              var tacticId = "#heatmap-tactic" + _team + t;
              var ballId = "#heatmap-ball" + _team + t;
              var tacticLabel = (outData[_team].TacticPoints[t].start > 0 ? "от " + outData[_team].TacticPoints[t].start : "") + " " + (outData[_team].TacticPoints[t].end < 125 ? "до " + outData[_team].TacticPoints[t].end : "") + ".  " + rep[_team].team.name;
              newDiv.querySelector('#heatmap-home').id = "heatmap-tactic" + _team + t;
              newDiv.querySelector(tacticId + ' > div').textContent = "Игроки " + tacticLabel;
              newDiv.querySelector('#heatmap-away').id = "heatmap-ball" + _team + t;
              newDiv.querySelector(ballId + ' > div').textContent = "Мяч " + tacticLabel;
              ;
              document.querySelector("#" + _team + "-tacticks-heatmaps ~ .bojan__content").appendChild(newDiv);
              var theWrapper = document.getElementsByClassName('heatmap-container-wrapper')[1];
              var thirdField = theWrapper.cloneNode(true);
              thirdField.className = "heatmap-container-wrapper";
              newDiv.className = "heatmap3-containers-wrapper";
              thirdField.querySelector(".heatmap-container").id = "avgPositions" + capitalTeamName(_team) + t;
              thirdField.querySelector(".heatmap-container > div").textContent = "Ср.поз." + tacticLabel;
              newDiv.appendChild(thirdField);

              var _loop2 = function _loop2(n) {
                var pl = document.querySelector('#player_default_' + _team).cloneNode(true);
                pl.id = _team + "AvgPoints_" + t + "_" + n;
                var rank = outData[_team].TacticPoints[t].rankByMinutes;
                pl.style.display = rank.indexOf(rank.find(function (el) {
                  return el[0] == n;
                })) < 11 ? "inherit" : "none";
                pl.style.left = outData[_team].TacticPoints[t].averages[n][0].x - 5 + "px";
                pl.style.top = outData[_team].TacticPoints[t].averages[n][0].y - 5 + "px";
                pl.querySelector('.player_number').textContent = rep[_team].players[n - 1].number;
                pl.querySelector('.tooltiptext').textContent = rep[_team].players[n - 1].name + "    " + rep[_team].players[n - 1].number;
                document.querySelector('#avgPositions' + capitalTeamName(_team) + t).appendChild(pl);
              };

              for (var n = 1; n <= MAX_PLAYERS; n++) {
                _loop2(n);
              } //------------------------------------------------------------


              var heatmapPlayers = h337.create({
                container: document.querySelector(tacticId),
                maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS
              });
              heatmapPlayers.setData({
                max: maximumValue,
                data: outData[_team].TacticPoints[t].team
              });
              var heatmapball = h337.create({
                container: document.querySelector(ballId),
                maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS * BALL_RADIUS_KEFF * BALL_TACTICS_RADIUS_KEFF
              });
              heatmapball.setData({
                max: maximumValue * BALL_MAX_KEFF * BALL_TACTICS_MAX_KEFF,
                data: outData[_team].TacticPoints[t].ball
              });
            };

            for (var t = 1; t < outData[_team].TacticPoints.length; t++) {
              var _ret = _loop(t);

              if (_ret === "continue") continue;
            }
          }

          showableTacticks.push(outData[_team].TacticPoints.filter(function (t, n) {
            return n > 0 && t.period > 3;
          }).map(function (el) {
            return [el.start, el.end];
          }));
        };

        var showPlayersHeatmaps = function showPlayersHeatmaps() {
          var _loop3 = function _loop3(_i5) {
            var divWrapper = document.getElementsByClassName('heatmap2-containers-wrapper')[0];
            var newDiv = divWrapper.cloneNode(true);

            function showOnePlayerHeatmap() {
              var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

              var playerId = "#heatmap-" + _team + _i5;
              newDiv.querySelector("#heatmap-" + _team).id = "heatmap-" + _team + _i5;
              newDiv.querySelector(playerId + ' > div').textContent = rep[_team].players[_i5 - 1].number + '. ' + rep[_team].players[_i5 - 1].name;
              if (_team === "home") document.querySelector("#separate-heatmaps ~ .bojan__content").appendChild(newDiv);

              var _heatmapPlayer = h337.create({
                container: document.querySelector(playerId),
                maxOpacity: MAX_OPACITY,
                minOpacity: MIN_OPACITY,
                radius: POINT_RADIUS
              });

              _heatmapPlayer.setData({
                max: maximumValue,
                data: outData[_team].Points[_i5]
              });
            }

            showOnePlayerHeatmap("home");
            showOnePlayerHeatmap("away");
          };

          for (var _i5 = 1; _i5 <= MAX_PLAYERS; _i5++) {
            _loop3(_i5);
          }
        };

        //-------------------------------------------------------------------------
        var showHideAllColoboks = function showHideAllColoboks(team, n, _tacticPoints) {
          var isVisible = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SHOW;

          var _team = team || "home";

          var _n = n || 1;

          var tacticPoints = _tacticPoints || outData.home.TacticPoints;

          var _colobokId = _team + "AvgPoints" + _n;

          var _colobokId2 = "both" + _team + "AvgPoints" + _n; //  console.log(_colobokId, _colobokId2);


          var _style = document.getElementById(_colobokId).style;
          var _style2 = document.getElementById(_colobokId2).style;
          _style.display = isVisible ? "inherit" : "none";
          _style2.display = isVisible ? "inherit" : "none";

          if (tacticPoints.length > 1) {
            for (var t = 1; t < tacticPoints.length; t++) {
              if (tacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;

              var _colobokId3 = _team + "AvgPoints_" + t + "_" + _n;

              document.getElementById(_colobokId3).style.display = isVisible ? // document.getElementById(_colobokId).style.display = document.getElementById(_colobokId).style.display == "none" ?
              "inherit" : "none";
            }
          }
        };

        //-------------------------------------------------------------------------
        var showTeamAvgPositions = function showTeamAvgPositions(_team) {
          for (var n = 1; n <= MAX_PLAYERS; n++) {
            var pl = document.querySelector('#player_default_' + _team).cloneNode(true);
            pl.id = _team + "AvgPoints" + n;
            pl.plId = (_team === "home" ? "hm" : "aw") + n;
            var plRow = _team + "-player-list_" + n;
            var newPlayer = document.createElement('div');
            newPlayer.className = "playerRow";
            newPlayer.id = plRow;
            var plNumDiv = document.createElement('div');
            plNumDiv.innerText = rep[_team].players[n - 1].number + ". ";
            plNumDiv.className = "player-list-num";
            var plNameDiv = document.createElement('div');
            plNameDiv.className = "player-list-name";
            var plName = document.createElement('a'); // plName.style.fontWeight = n < 12 ? "bold" : "normal";

            plName.id = plRow + '_name';
            plName.innerText = rep[_team].players[n - 1].name;
            plName.href = '#';
            plName.addEventListener('click', function (e) {
              e.preventDefault();
              this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";
              showHideAllColoboks(_team, this.id.replace(_team + "-player-list_", '').replace("_name", ''), outData[_team].TacticPoints, this.style.fontWeight == "bold" ? SHOW : HIDE);
            });

            if (rep[_team].players[n - 1].sub) {
              plName.appendChild(getSubArrow(rep[_team].players[n - 1].sub));
            }

            plNameDiv.appendChild(plName);
            newPlayer.appendChild(plNumDiv);
            newPlayer.appendChild(plNameDiv);
            var plEye = document.createElement('div');
            plEye.className = "player-list-eye";
            plEye.innerText = " "; //<img src="http://pefl.ru/images/eye.png" alt="" border="0">
            // apEye.appendChild(createEye(`Тут планируются 
            // скилы игрока`));
            // apEye.appendChild(createEye(`Тут планируется 
            // статистика игрока`));

            newPlayer.appendChild(plEye);
            var plShots = document.createElement('div');
            plShots.className = "player-list-shots";
            var plShotsString = formShotsString(rep[_team].players[n - 1]);
            plShots.innerText = plShotsString;
            var plShotsCheckbox = document.createElement('div');
            plShotsCheckbox.className = "playerShotCheckbox";

            if (plShotsString == " ") {
              plShotsCheckbox.innerText = " ";
            } else {
              plShotsCheckbox.appendChild(createShotCheckbox({
                player: n,
                team: _team
              }));
              var plShotsTooltip = document.createElement('div');
              plShotsTooltip.className = "tooltiptext";
              plShotsTooltip.innerText = SHOT_TOOLTIP;
              plShots.appendChild(plShotsTooltip);
            }

            newPlayer.appendChild(plShotsCheckbox);
            newPlayer.appendChild(plShots);
            var plMileage = document.createElement('div');
            plMileage.className = "player-list-mileage";
            plMileage.innerText = Number(outData[_team].Mileage[n] / 1000.0).toFixed(2) + "км";
            newPlayer.appendChild(plMileage);
            document.querySelector('#squad' + capitalTeamName(_team)).appendChild(newPlayer);
            pl.querySelector('.player_number').textContent = rep[_team].players[n - 1].number;
            pl.querySelector('.tooltiptext').textContent = rep[_team].players[n - 1].name + "    " + rep[_team].players[n - 1].number;
            ;
            document.getElementById('heatmap-avg' + capitalTeamName(_team)).appendChild(pl);
            var plBoth = pl.cloneNode(true);
            plBoth.id = "both" + plBoth.id;
            document.getElementById('heatmap-avgBoth').appendChild(plBoth);
            var plToINdividualHeatmap = pl.cloneNode(true);
            plToINdividualHeatmap.style.display = outData[_team].AvgPoints[n].x > 8 && outData[_team].AvgPoints[n].y > 8 ? "inherit" : "none";
            plToINdividualHeatmap.id = plToINdividualHeatmap.id + "_individual";
            plToINdividualHeatmap.style.left = outData[_team].AvgPoints[n].x - 5 + "px";
            plToINdividualHeatmap.style.top = outData[_team].AvgPoints[n].y - 5 + "px";
            document.querySelector('#heatmap-' + _team + n).appendChild(plToINdividualHeatmap);
          }
        };

        var showMainAvgPositions = function showMainAvgPositions() {
          showTeamAvgPositions("home");
          showTeamAvgPositions("away");
        };

        var scoreWithPensFound = this.responseText.match(RE_SCORE_WITH_PENALTIES);
        var scoreWithPens = scoreWithPensFound ? scoreWithPensFound.pop() : ["0:0"];
        rep = JSON.parse(this.responseText);
        setTeamsColors(); //--------------------------------------------------------------------

        var game = rep.game;
        console.log("rep  - ", rep);
        var flags = {
          corner: false,
          throwIn: false,
          deadBall: false,
          goalKick: false,
          center: true,
          team: 0,
          ballOwner: 0
        };

        var isBallOwnedByHomeTeam = function isBallOwnedByHomeTeam() {
          return flags.ballOwner = 1;
        };

        var isHomePlayer = function isHomePlayer(numberInCommonPlayersList) {
          return numberInCommonPlayersList <= MAX_PLAYERS;
        };

        var capitalTeamName = function capitalTeamName(_team) {
          return _team === "home" ? "Home" : "Away";
        };

        var currentPlayer = 0;
        game.slice(1, -1);
        var score = "0:0";
        var passObject = null;
        var ballowner = 0;

        try {
          game.forEach(function (element, episode, episodes) {
            var lastEpisode = episode > 0 ? episodes[episode - 1] : null;
            var nextEpisode = episodes[episode + 1] ? episodes[episode + 1] : null;
            var nextEpisode2 = episodes[episode + 2] ? episodes[episode + 2] : null; //===================================================================

            if (element.C) {
              flags.corner = true;
              flags.team = element.C;
            }

            if (element.A) {
              flags.throwIn = true;
              flags.team = element.A;
            }

            if (element.F) {
              flags.deadBall = true;
              flags.team = element.F;
            }

            if (element.T) {
              flags.goalKick = true;
              flags.team = element.T.team;
            }

            if (element.N) {
              flags.center = true;
              flags.team = element.N;
            } //===================================================================


            var newBallOwner = false;
            var currentBallOwner = getOwnerFromMessages(element.messages);

            if (currentBallOwner || currentBallOwner !== ballowner) {
              //new ballowner
              newBallOwner = true;
              ballowner = currentBallOwner;
            } //===================================================================


            function isBallOwnerWillChangeIn2NextEpisodes() {
              var nextBallOwner = nextEpisode && getOwnerFromMessages(nextEpisode);
              var nextBallOwner2 = nextEpisode2 && getOwnerFromMessages(nextEpisode2);
              if (nextBallOwner && nextBallOwner !== ballowner) return true;
              if (!nextBallOwner && nextBallOwner2 && nextBallOwner2 !== ballowner) return true;
              return false;
            }

            var coords;
            var playersCloseToBall = [];
            var prevplayersCloseToBall = [];
            var closestPlayer;
            var prevclosestPlayer;
            var prevclosestPlayer2;
            var closestPlayer2; //** ---- */
            // if (!element.coordinates) console.log("NO COORDINATES", element);
            // if (episode === 0) {
            //   console.log("Start element - ", element);
            //   playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime);
            // }

            if (element.coordinates) {
              var isPlayerOwnsBall = function isPlayerOwnsBall() {
                return closestPlayer && closestPlayer.length === 0;
              }; //==============================================================================


              var isBallMovedFromPlayer = function isBallMovedFromPlayer() {
                if (!prevclosestPlayer || !closestPlayer) return false;
                return prevclosestPlayer.length === 0 && (prevclosestPlayer.n === closestPlayer.n && closestPlayer.length > 0 || prevclosestPlayer.n !== closestPlayer.n);
              }; //==============================================================================


              var isClosestPlayerChanged = function isClosestPlayerChanged() {
                if (!prevclosestPlayer) return false;
                return prevclosestPlayer.n !== closestPlayer.n;
              }; //==============================================================================


              var isPlayerMovedBall = function isPlayerMovedBall() {
                if (!prevclosestPlayer || !closestPlayer) return false;
                return closestPlayer.length === 0 && prevclosestPlayer.length === 0 && prevclosestPlayer.n === closestPlayer.n && closestPlayer2.length > 0 && prevclosestPlayer2.length > 0;
              }; //==============================================================================


              var isItClearPass = function isItClearPass() {
                return prevclosestPlayer && prevclosestPlayer2 && closestPlayer && closestPlayer2 && prevclosestPlayer.length === 0 && prevclosestPlayer2.length > 0 && closestPlayer.length === 0 && closestPlayer2.length > 0;
              }; //==============================================================================


              var isItPassFromCenter = function isItPassFromCenter() {
                if (!passObject) return; // if (passObject.N && closestPlayer
                // && isPassOpened() && closestPlayer.length === 0) console.log(" passObject  closestPlayer isPassOpened()", passObject, closestPlayer, isPassOpened());

                return passObject.N && closestPlayer && isPassOpened() && closestPlayer.length === 0;
              }; //==============================================================================


              var isPrevAndClosestFromSameTeam = function isPrevAndClosestFromSameTeam() {
                if (!prevclosestPlayer || !closestPlayer) return false;
                return isOneTeam(prevclosestPlayer.n, closestPlayer.n);
              }; //==============================================================================


              var isPassstarterAndClosestFromSameTeam = function isPassstarterAndClosestFromSameTeam(_player) {
                if (!passObject.start || !_player) return false;
                return isOneTeam(passObject.start.player, _player.n);
              }; //==============================================================================


              var isPassOpened = function isPassOpened() {
                if (!passObject) return false;
                return !!passObject.start;
              }; //==============================================================================
              //==============================================================================


              var isBallOutfield = function isBallOutfield() {
                if (ball.w <= jsonCoords.x1 || ball.w >= jsonCoords.x2) return true;
                if (ball.h <= jsonCoords.y1 || ball.h >= jsonCoords.y2) return true;
                return false;
              }; //==============================================================================


              var isItFight = function isItFight() {
                return closestPlayer2 && closestPlayer && closestPlayer.length === closestPlayer2.length && closestPlayer.length === 0;
              }; //==============================================================================


              var checkAfterPassFight = function checkAfterPassFight() {
                if (!isItFight()) return false;
                return !(closestPlayer.n === prevclosestPlayer.n || closestPlayer2.n === prevclosestPlayer.n);
              }; //==============================================================================


              var checkDribbling = function checkDribbling() {
                return false;
              }; //==============================================================================


              var resetPass = function resetPass() {
                passObject.start = null;
              }; //==============================================================================


              var savePass = function savePass() {
                var pass = {
                  high: ball.z === 1,
                  minute: element.minute,
                  episode: element.num,
                  good: passObject.good,
                  endpoint: null,
                  startpoint: null,
                  type: null,
                  outfield: passObject.outfield,
                  player: passObject.start.player,
                  address: passObject.end.player
                };
                var ballcoords = {
                  x: passObject.end.ball.w,
                  y: passObject.end.ball.h
                };
                pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                var startballcoords = {
                  x: passObject.start.ball.w,
                  y: passObject.start.ball.h
                };
                pass.startpoint = limitPoint(startballcoords, secondTime, shotsCoords, jsonCoords); // if (pass.outfield) console.log(" save pass - ", passObject, pass);

                passes[pass.player].push(_objectSpread({}, pass));
              }; //==============================================================================


              var isShotElement = function isShotElement() {
                // return element.G
                return element.G || element.W || element.B || element.U || element.V;
              }; //==============================================================================


              var startPass = function startPass(player) {
                passObject = {
                  start: {
                    ball: _objectSpread({}, ball),
                    player: player.n
                  }
                }; // console.log('START PASS', player);
              }; //==============================================================================


              var endThisPass = function endThisPass(player) {
                passObject.end = {
                  ball: _objectSpread({}, ball),
                  player: player.n
                };
              }; //==============================================================================
              //==============================================================================
              //==============================================================================


              // if (element.coordinates && episode > 0) {
              var ball = element.coordinates.ball;

              try {
                // if (isItFight()) {
                //   console.log(checkAfterPassFight()
                //     ? "FIGHT "
                //     : "DRIBBLE ",
                //     closestPlayer, closestPlayer2, element, prevclosestPlayer);
                // }
                var processBallMoving = function processBallMoving() {
                  if (penalties) {
                    resetPass();
                    return;
                  }

                  if (!isPassOpened()) {
                    if (isPlayerOwnsBall()) {
                      startPass(closestPlayer); // console.log('PLAYER OWNS BALL');

                      return;
                    }

                    return;
                  }

                  if (isShotElement()) {
                    resetPass(); //process shot
                    // console.log(" ShotElement  playersCloseToBall - ", playersCloseToBall, prevplayersCloseToBall, element);

                    return;
                  }

                  if (isPlayerMovedBall()) {
                    startPass(closestPlayer);
                    ; // proceedrun with ball

                    return;
                  }

                  if (isBallOutfield()) {
                    passObject.good = 0;
                    passObject.outfield = true; // console.log("Ball outfield", ball, element);

                    endThisPass(closestPlayer);
                    savePass();
                    resetPass();
                    return;
                  }

                  if (isItPassFromCenter()) {
                    passObject.good = 1; // but may be check for bad ball handling

                    endThisPass(closestPlayer);
                    savePass();
                    startPass(closestPlayer);
                  }

                  if (isItClearPass()) {
                    if (isPrevAndClosestFromSameTeam()) {
                      ; //ok pass 

                      passObject.good = 1; // but may be check for bad ball handling

                      endThisPass(closestPlayer);
                      savePass();
                      startPass(closestPlayer);
                    } else {
                      ; // failed pass

                      passObject.good = 0; // but may be check for bad ball handling from opponent

                      endThisPass(closestPlayer);
                      savePass();
                      startPass(closestPlayer);
                    }

                    return;
                  }

                  if (isItFight()) {
                    if (checkAfterPassFight()) {
                      // console.log("FIGHT AFTER PASS -", closestPlayer, closestPlayer2, prevclosestPlayer, prevclosestPlayer2, element, passObject);
                      var passFailed = isBallOwnerWillChangeIn2NextEpisodes();
                      passObject.good = passFailed ? 0 : 1;
                      var adress = isPassstarterAndClosestFromSameTeam(closestPlayer) ? passFailed ? closestPlayer2 : closestPlayer : passFailed ? closestPlayer : closestPlayer2;
                      endThisPass(adress);
                      savePass();
                      startPass(adress);
                      return;
                    }

                    ;

                    if (checkDribbling()) {
                      return;
                    }
                  }
                };

                prevplayersCloseToBall = lastEpisode && lastEpisode.coordinates && calculatePlayerClosestToBall(lastEpisode.coordinates, secondTime);
                playersCloseToBall = calculatePlayerClosestToBall(element.coordinates, secondTime); //** ---- */
                // console.log(" playersCloseToBall - ", playersCloseToBall, prevplayersCloseToBall, element);

                closestPlayer = playersCloseToBall[0];
                closestPlayer2 = playersCloseToBall[1];
                prevclosestPlayer = prevplayersCloseToBall && prevplayersCloseToBall[0];
                prevclosestPlayer2 = prevplayersCloseToBall && prevplayersCloseToBall[1];

                if (element.N) {
                  if (passObject) {
                    // console.log('closestPlayer- ', closestPlayer);
                    startPass(closestPlayer);
                  }

                  if (!passObject) startPass(closestPlayer);
                  passObject.N = true; // console.log("STARTED N ", passObject);
                }

                if (episode === 0) {
                  console.log("Start element - ", element); // startPass(closestPlayer)
                }

                var ballMovingResponce = processBallMoving();
              } catch (error) {
                console.log("closest players error", error, element);
              }
            }

            function tryMes(messageNumber, regExp) {
              return element.messages[messageNumber].mes.match(regExp);
            }

            if (element.interval) sumInterval += parseInt(element.interval);
            if (!minutesStarts[element.minute]) minutesStarts[element.minute] = outData.home.Points[1].length;

            if (element.S) {
              // substitutes handle
              if (element.S.team == 1) {
                rep.home.players[element.S.in - 1].sub = SUB_IN;
                rep.home.players[element.S.out - 1].sub = SUB_OUT;
              } else {
                rep.away.players[element.S.in - 1].sub = SUB_IN;
                rep.away.players[element.S.out - 1].sub = SUB_OUT;
              }
            }

            if (element.messages[0]) {
              // изменение счета и пенальти  and calculate passes
              var pass = {};
              var passPlayer;
              var receivePlayer;
              var _isPassOpened = false;

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
                    if (flags.center && element.messages && element.messages.some(function (mes) {
                      return mes.mes.match(RE_CENTER_MSG);
                    })) {
                      // from center
                      flags.center = false;
                      currentPlayer = prevclosestPlayer.n;
                    }
                  } catch (error) {
                    console.log(" N error", error, element);
                  }

                  ;
                  var _ball = element.coordinates.ball;
                  var lastBall = lastEpisode.coordinates ? lastEpisode.coordinates.ball : undefined;
                  var ballcoords = {
                    x: _ball.w,
                    y: _ball.h
                  };

                  if (flags.corner && element.messages[1]) {
                    //handle corner kick
                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = _ball.z === 1;
                    pass.minute = element.minute;
                    pass.episode = element.num;
                    pass.type = "corner";
                    flags.corner = false;
                    var lastBallcoords = {
                      x: lastBall.w,
                      y: lastBall.h
                    };
                    passPlayer = getPlayerFromMessage(element.messages[0]);
                    pass.startpoint = limitPoint(lastBallcoords, secondTime, shotsCoords, jsonCoords);

                    if (element.messages[2]) {
                      // high pass , 2 episodes
                      receivePlayer = getPlayerFromMessage(element.messages[2]);
                      pass.good = isOneTeam(receivePlayer, passPlayer);
                    } else {
                      pass.good = true;
                      receivePlayer = getPlayerFromMessage(element.messages[1]);
                    }

                    currentPlayer = receivePlayer;
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);
                  } else if (flags.throwIn && element.messages[0]) {
                    // handle out
                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = _ball.z === 1;
                    pass.minute = element.minute;
                    pass.episode = element.num;
                    pass.type = "throw";
                    flags.throwIn = false;
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    if (!passPlayer) lastEpisode = episodes[episode - 2];
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    if (!passPlayer) lastEpisode = episodes[episode - 3];
                    lastBall = lastEpisode.coordinates.ball;
                    var _lastBallcoords = {
                      x: lastBall.w,
                      y: lastBall.h
                    };
                    passPlayer = getPlayerFromMessage(lastEpisode.messages[lastEpisode.messages.length - 1]);
                    pass.startpoint = limitPoint(_lastBallcoords, secondTime, shotsCoords, jsonCoords);
                    receivePlayer = getPlayerFromMessage(element.messages[element.messages.length - 1]);
                    pass.good = isOneTeam(receivePlayer, passPlayer);
                    currentPlayer = receivePlayer;
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);
                    ;
                  } else if (flags.deadBall) {
                    // handle free kick
                    ;
                    flags.deadBall = false;
                  } else if (flags.goalKick) {
                    // handle pass from goalkick
                    pass.endpoint = limitPoint(ballcoords, secondTime, shotsCoords, jsonCoords);
                    pass.high = _ball.z === 1;
                    pass.minute = element.minute;
                    pass.episode = element.num;
                    _isPassOpened = true;
                    pass.type = "goalkick";
                    var _lastBallcoords2 = {
                      x: lastBall.w,
                      y: lastBall.h
                    };
                    flags.goalKick = false; // console.log("T - Lastelement ", lastEpisode);
                    // console.log("T - element ", element);

                    currentPlayer = prevclosestPlayer.n; // console.log(" T - currentPlayer -", currentPlayer);

                    passPlayer = currentPlayer;
                    pass.startpoint = limitPoint(_lastBallcoords2, secondTime, shotsCoords, jsonCoords); // console.log("T - Nextlement ", episodes[episode + 1]);
                    // console.log("T - Nextlement2 ", episodes[episode + 2]);
                    // if (!episodes[episode + 2].messages[0]) {
                    // console.log("T - Nextlement3 ", episodes[episode + 3]);
                    // }
                    // }

                    if (element.messages[0]) {
                      if (tryMes(0, RE_PASS_FROM_GOALKICK)) {
                        if (element.messages[1]) {
                          receivePlayer = +tryMes(1, RE_PLAYER_NUMBERS)[0];
                          pass.good = isOneTeam(passPlayer, receivePlayer); // console.log("T short pass - ", element.minute, element.num, pass.good, receivePlayer, passPlayer, pass.player)
                        } else {
                          ; // "open" pass

                          _isPassOpened = true;
                        }
                      }

                      ;

                      if (pass.type === "goalkick" && _isPassOpened) {
                        var firstPlayer = +tryMes(0, RE_PLAYER_NUMBERS)[0];
                        pass.good = tryMes(0, RE_PASS_FROM_GOALKICK) || firstPlayer;
                        _isPassOpened = false;
                      }
                    }

                    ;
                    pass.player = passPlayer;
                    oldpasses[passPlayer].push(pass);
                  } else {
                    //just pass
                    ;
                  }
                }

                ;
              } catch (error) {
                ; // console.log("error ", lastEpisode);
                // console.log("Что то не так с обсчетом паса", element.minute, element.n, error);
              }

              element.messages.forEach(function (mes) {
                if (mes.mes.indexOf(' СЧЕТ ') > -1) {
                  score = mes.mes.replace(' СЧЕТ ', '');
                }

                ;
              });

              if (element.messages[0].mes == "Серия пенальти!..." || element.messages[0].mes == "Матч переходит к послематчевым одиннадцатиметровым!..." || element.messages[0].mes == "Назначаются послематчевые пенальти!...") {
                penalties = true; //может на будущее

                throw "Серия пенальти!...";
              }
            }

            if (element.ZT) {
              // смена тактики
              var calcTacticChange = function calcTacticChange() {
                var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

                outData[_team].TacticPoints[0].end = element.minute;
                outData[_team].TacticPoints[0].period = element.minute - outData[_team].TacticPoints[0].start;

                outData[_team].TacticPoints.push(outData[_team].TacticPoints[0]);

                outData[_team].TacticPoints[0] = {
                  start: element.minute,
                  end: 125,
                  period: 125 - element.minute,
                  team: [],
                  ball: [],
                  averages: []
                };

                outData[_team].TacticChanges.push(outData[_team].Points[0].length);

                for (var _i4 = 0; _i4 <= MAX_PLAYERS; _i4++) {
                  outData[_team].TacticPoints[0].averages.push([{
                    x: 0,
                    y: 0
                  }]);
                }
              };

              if (element.ZT.team == 1) {
                calcTacticChange("home");
                outData.home.TacticChanges.push(outData.home.Points[0].length);
              } else {
                calcTacticChange("away");
              }
            }

            try {
              if ((element.U || element.W) && !penalties) {
                // shots handle
                var _ball2 = element.coordinates.ball;
                var _ballcoords = {
                  x: _ball2.w,
                  y: _ball2.h,
                  value: 1
                };
                var shotType = element.G ? "G" : element.V ? "V" : element.W ? "W" : element.B ? "B" : element.U.team > 2 ? "Block" : "U";
                var shotStart = episodes[episode - 1].coordinates ? episodes[episode - 1].coordinates.ball : episodes[episode - 2].coordinates ? episodes[episode - 2].coordinates.ball : episodes[episode - 3].coordinates ? episodes[episode - 3].coordinates.ball : episodes[episode - 4].coordinates.ball;
                var startCoords = {
                  x: shotStart.w,
                  y: shotStart.h,
                  value: 1
                };
                var endpoint = limitPoint(_ballcoords, secondTime, shotsCoords, jsonCoords);
                var startpoint = limitPoint(startCoords, secondTime, shotsCoords, jsonCoords);
                var newShot = {
                  endpoint: endpoint,
                  startpoint: startpoint,
                  episode: episode,
                  type: shotType,
                  minute: element.minute,
                  player: element.U ? element.U.player : element.W.player,
                  xG: element.U ? element.U.xG ? element.U.xG : "ждем xG" : element.W.xG ? element.W.xG : "ждем xG"
                };

                if (element.U && (element.U.team == 1 || element.U.team == 3) || element.W && (element.W.team == 2 || element.W.team == 4)) {
                  oldshots.home.push(newShot);
                } else {
                  oldshots.away.push(newShot);
                }

                ;
              }

              if ((element.G || element.V || element.B) && !element.U) {
                // goal/block/ event in next episode
                var _ball3 = element.coordinates.ball;
                console.log("goal event in next episode -  min=", element.minute, " U=", element.U, " W=", element.W, " V=", element.V, " G=", element.G, " B=", element.B, _ball3);
                var _ballcoords2 = {
                  x: _ball3.w,
                  y: _ball3.h,
                  value: 1
                };

                var _endpoint = limitPoint(_ballcoords2, secondTime, shotsCoords, jsonCoords);

                var lastShot;

                if (element.G && (element.G.team == 1 || element.G.team == 3) || element.V && (element.V.team == 1 || element.V.team == 3) || element.B && (element.B.team == 1 || element.B.team == 3)) {
                  lastShot = oldshots.home[oldshots.home.length - 1];
                } else {
                  lastShot = oldshots.away[oldshots.away.length - 1];
                }

                if (episodes[episode - 1].messages.length > 0 && episodes[episode - 1].messages.some(function (el) {
                  return el.mes.match(RE_LONG_PASS);
                })) {
                  lastShot.startpoint = lastShot.endpoint;
                }

                lastShot.type = element.G ? "G" : element.V ? "V" : "B";
                lastShot.endpoint = _endpoint;
                lastShot.player = element.G ? element.G.player : element.V ? element.V.player : element.B.player;
              }
            } catch (error) {
              console.log("Что то не так с обсчетом удара", element.minute, element.n, error);
              console.log(element, episodes[episode - 1], episodes[episode - 2]);
            }

            if (element.M) {
              // смена сторон. конец тайма.                         
              secondTime = !secondTime;
            }

            ;

            function pushFullPoint(arr, fullPoints) {
              for (var p = 1; p <= MAX_PLAYERS; p++) {
                arr[p].push(fullPoints[p]);
              }
            }

            if (element.coordinates) {
              var calcTeamFullPoints = function calcTeamFullPoints() {
                var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

                var theTeam = element.coordinates[_team];
                var currentTeamPositions = [];

                for (var p = 0; p <= MAX_PLAYERS; p++) {
                  currentTeamPositions.push(null);
                }

                theTeam.forEach(function (pl) {
                  coords = pl.n == 1 ? {
                    x: pl.w,
                    y: pl.h,
                    value: GK_VALUE
                  } : {
                    x: pl.w,
                    y: pl.h,
                    value: 1
                  };

                  if (pl.n <= MAX_PLAYERS) {
                    var playerPoints = limitPoint(coords, _team === "home" ? secondTime : !secondTime);

                    outData[_team].Points[pl.n].push(playerPoints);

                    outData[_team].Points[0].push(playerPoints);

                    outData[_team].TacticPoints[0].team.push(playerPoints);

                    outData[_team].TacticPoints[0].averages[pl.n].push(playerPoints);

                    if (outData[_team].Points[pl.n].length > 1) {
                      var l = outData[_team].Points[pl.n].length - 1;
                      outData[_team].Mileage[pl.n] += getMileage(outData[_team].Points[pl.n][l], outData[_team].Points[pl.n][l - 1]);
                    }

                    currentTeamPositions[pl.n] = playerPoints;
                  } else {
                    strangePoints[_team].push(pl);
                  }
                });

                outData[_team].TacticPoints[0].ball.push(ballHeatMap);

                pushFullPoint(outData[_team].PointsFull, currentTeamPositions);
              };

              var _ball4 = element.coordinates.ball;
              var _ballcoords3 = {
                x: _ball4.w,
                y: _ball4.h,
                value: 1
              };
              var ballHeatMap = limitPoint(_ballcoords3, secondTime);
              ballPoints.push(ballHeatMap);
              calcTeamFullPoints("home");
              calcTeamFullPoints("away");
            }
          });
        } catch (error) {
          console.log("game.forEach ", error);
        }

        outData.home.TacticPoints.push(outData.home.TacticPoints[0]);
        outData.away.TacticPoints.push(outData.away.TacticPoints[0]);
        var finalScore = score + (scoreWithPens == score ? '' : "(".concat(getPenalties(score, scoreWithPens), ")"));
        var gameInfoSrting = rep.date + ". " + (rep.stadium.city ? rep.stadium.city + ". " : "") + rep.stadium.name + ". " + rep.home.team.name + " - " + rep.away.team.name + " " + finalScore;
        document.querySelector("#game-info").textContent = gameInfoSrting;
        console.log("oldpasses -", oldpasses);
        console.log("passes -", passes);
        var gkPasses = oldpasses.reduce(function (acc, pl, i) {
          var goalKicks = pl.filter(function (pass) {
            return pass.type === "goalkick";
          });
          return goalKicks[0] ? [].concat(_toConsumableArray(acc), _toConsumableArray(goalKicks)) : _toConsumableArray(acc);
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

        oldshots.home.forEach(function (shot) {
          countShot(shot.type, rep.home.players[shot.player - 1]);
        });
        oldshots.away.forEach(function (shot) {
          countShot(shot.type, rep.away.players[shot.player - 1]);
        });
        heatmapInstance = avgMapCreate('#heatmap-home');
        heatmapInstance2 = avgMapCreate('#heatmap-away');
        heatmapInstance3 = avgMapCreate('#heatmap-ball', BALL_RADIUS_KEFF);
        updateMainMaps(outData.home.PointsFull, outData.away.PointsFull, ballPoints);
        heatmapInstance4 = avgMapCreate('#heatmap-avgHome');
        heatmapInstance5 = avgMapCreate('#heatmap-avgAway');
        heatmapInstance7 = avgMapCreate('#chalkboard');
        heatmapInstance8 = avgMapCreate('#heatmap-avgBoth');
        heatmapInstance9 = avgMapCreate('#passesboard');
        var heatPoints = [{
          x: 19,
          y: 19,
          value: 1,
          radius: 1
        }, {
          x: 346.56,
          y: 229.5,
          value: 200,
          radius: 1
        }, {
          x: 19,
          y: 229.5,
          value: 1,
          radius: 1
        }, {
          x: 346.56,
          y: 19,
          value: 1,
          radius: 1
        }];
        var defaultData = {
          max: maximumValue * TEAM_MAX_KEFF,
          data: heatPoints
        };
        showTeamTacticHeamaps("home");
        showTeamTacticHeamaps("away");
        setTimeout(showPlayersHeatmaps, 10);
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
        ;
        setTimeout(showMainAvgPositions, 50);
        /**===================================================================================================== */

        setTimeout(function () {
          document.body.removeChild(document.querySelector('.loader-wrapper'));
        }, 200);
        /**===================================================================================================== */

        var _chalkboard = document.querySelector('#chalkboard .heatmap-canvas');

        var _passesboard = document.querySelector('#passesboard .heatmap-canvas');
        /**===================================================================================================== */


        if (_chalkboard.getContext) {
          var context = _chalkboard.getContext('2d');

          drawTeamShots(oldshots.away, rep.away.players, "away", context);
          drawTeamShots(oldshots.home, rep.home.players, "home", context);
        }

        if (_passesboard.getContext) {
          var _context = _passesboard.getContext('2d'); // drawTeamPasses(oldpasses.slice(19), rep.away.players, "away", context);
          // drawTeamPasses(oldpasses.slice(1, 18), rep.home.players, "home", context);


          drawTeamPasses(passes.slice(19), rep.away.players, "away", _context);
          drawTeamPasses(passes.slice(1, 18), rep.home.players, "home", _context);
        }
        /**===================================================================================================== */

      } else {
        alert('Вставьте верно ссылку на матч!');
      }

      setTimeout(afterLoadEvents, 200);
    }
  };

  xmlhttp.open("GET", formJsonUrl({
    DEFAULT_TV_URL: DEFAULT_TV_URL,
    test: false
  }));
  xmlhttp.send(); //"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
}; //--------------------------------------------------------------------


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
    var filterTeamPoints = function filterTeamPoints() {
      var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

      playersFiltered[_team] = outData[_team].PointsFull.map(function (pl) {
        return pl.slice(startEpisode, endEpisode);
      });

      playersFiltered[_team].forEach(function (row, n) {
        if (n === 0) return;
        row.filter(function (el) {
          return el != null;
        }).forEach(function (point) {
          return filteredPoints[_team].push(point);
        });
      });
    };

    var displayTeamAvgPoints = function displayTeamAvgPoints() {
      var _team = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "home";

      var _avgPoints = calculateAvgPositions(playersFiltered[_team]).slice();

      var _rank = _avgPoints[0].order;

      var _loop4 = function _loop4(n) {
        var pl = document.getElementById(_team + "AvgPoints" + n);

        var plRank = _rank.indexOf(_rank.find(function (_) {
          return _.playerRank == n;
        }));

        pl.style.display = plRank < 11 ? "inherit" : "none";
        pl.style.left = _avgPoints[n].x - 5 + "px";
        pl.style.top = _avgPoints[n].y - 5 + "px";
        var plBoth = document.getElementById("both" + _team + "AvgPoints" + n);
        plBoth.style.display = pl.style.display;
        plBoth.style.left = pl.style.left;
        plBoth.style.top = pl.style.top;
        var plName = document.getElementById(_team + "-player-list_" + n + '_name');
        plName.style.fontWeight = plRank < 11 ? "bold" : "normal";
      };

      for (var n = 1; n <= MAX_PLAYERS; n++) {
        _loop4(n);
      }
    };

    var _start2 = _start == 0 ? 1 : _start;

    if (_start2 > end || +end - +_start2 <= MIN_MINUTES_FOR_SHOW_TACTIC) return;
    var startEpisode = minutesStarts[_start2];
    var endEpisode = minutesStarts[end];
    var filteredPoints = {
      home: [],
      away: [],
      ball: []
    };
    var playersFiltered = {
      home: [],
      away: []
    };
    filteredPoints.ball = ballPoints.slice(startEpisode, endEpisode);
    filterTeamPoints("home");
    filterTeamPoints("away");
    updateMainMaps(filteredPoints.home, filteredPoints.away, filteredPoints.ball);
    displayTeamAvgPoints("home");
    displayTeamAvgPoints("away");
  } catch (error) {
    console.log(error);
  }
} //"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";


;

function afterLoadEvents() {
  function formHeatmapUrl(_urlINput) {
    return window.location.origin + window.location.pathname + "?" + _urlINput.replace('http://pefl.ru/tv/#/', '');
  }

  ;

  function formTVUrl() {
    var locationString = window.location.href;
    locationString = locationString.replace("http://pefl.ru/heatmaps.html?", "http://pefl.ru/tv/#/").replace(":8080//", ':8080/').replace("http://localhost:8080/heatmaps.html?", 'http://pefl.ru/tv/#/');
    return locationString;
  }
  /**===================================================================================================== */


  var urlInput = document.querySelector("#tv-url-input");
  document.getElementById("tv-url").href = formTVUrl();
  document.getElementById("json-url").href = formJsonUrl({
    test: false
  });
  document.querySelector('#updateButton').addEventListener('click', function (e) {
    e.preventDefault();

    if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
      alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
      return;
    }

    window.location.assign(formHeatmapUrl(urlInput.value));
  });
  document.querySelector('#newWindow').addEventListener('click', function (e) {
    e.preventDefault();

    if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
      alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
      return;
    }

    window.open(formHeatmapUrl(urlInput.value), '_blank');
  });

  function normalizeTacticAvgPositions(_team) {
    if (outData[_team].TacticPoints.length > 1) {
      for (var t = 1; t < outData[_team].TacticPoints.length; t++) {
        if (outData[_team].TacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;

        var _loop5 = function _loop5(n) {
          var pl = document.querySelector("#" + _team + "AvgPoints_" + t + "_" + n);
          var rank = outData[_team].TacticPoints[t].rankByMinutes;
          pl.style.display = rank.indexOf(rank.find(function (el) {
            return el[0] == n;
          })) < 11 ? "inherit" : "none";
        };

        for (var n = 1; n <= MAX_PLAYERS; n++) {
          _loop5(n);
        }
      }
    }
  }

  setTimeout(function () {
    document.querySelector("#shots-chalkboard ~ .bojan__content").appendChild(createSlider("shots", showableTacticks, filterShotsByTime));
    document.querySelector("#maps-filtered ~ .bojan__content").appendChild(createSlider("maps", showableTacticks, filterMapsByTime));
    document.querySelector("#pass-chalkboard ~ .bojan__content").appendChild(createSlider("pass", showableTacticks, filterPassesByTime));
    document.getElementById("norm-tactic-avg").addEventListener("click", function (e) {
      e.preventDefault();
      normalizeTacticAvgPositions("home");
      normalizeTacticAvgPositions("away");
    });
    document.getElementById("reset-maps-filtering").addEventListener("click", function (e) {
      e.preventDefault();
      filterMapsByTime(0, 125);
      filterRangeMaximize("maps-time-filter");
    });
  }, 200);
}

;
;

function createSlider() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var tacticksArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [[[0, 125]], [[0, 125]]];
  var cb = arguments.length > 2 ? arguments[2] : undefined;
  var filterWrapper = document.createElement("div");
  filterWrapper.classList.add("time-slider");
  filterWrapper.id = prefix + "-time-filter";
  filterWrapper.addEventListener("change", function (e) {
    e.preventDefault();
    updateValues();
  });
  setLimits(0, 125);

  function formTackticksRow() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 125];
    var team = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "home";
    var t = document.createElement("div");
    t.classList.add("time-slider__tacticks");

    var _label = document.createElement("span");

    _label.innerText = team === "home" ? "Тактики хозяев" : "Тактики гостей";
    t.appendChild(_label);

    var _ul = document.createElement("ul");

    data.forEach(function (el) {
      ;

      var _li = document.createElement("li");

      _li.innerText = el[0] + " - " + el[1];

      _li.classList.add("time-slider__tacticks__ref");

      _li.addEventListener("click", function (e) {
        e.preventDefault();
        setLimits(el[0], el[1]);
        updateValues();
      });

      _ul.appendChild(_li);
    });
    t.appendChild(_ul);
    return t;
  }

  var inputs = document.createElement("div");
  inputs.classList.add("time-slider__inputs");
  var sinput = document.createElement("input");
  sinput.type = "number";
  sinput.min = 0;
  sinput.max = 125;
  sinput.value = 0;
  sinput.id = prefix + "-start-input";
  var einput = sinput.cloneNode(true);
  einput.id = prefix + "-end-input";
  sinput.addEventListener('change', function (e) {
    e.preventDefault();

    if (+this.value > +filterWrapper.getAttribute("end") - 3) {
      this.value = +filterWrapper.getAttribute("end") - 3;
    }

    start(this.value);
    updateValues();
  });
  einput.addEventListener('change', function (e) {
    e.preventDefault();

    if (+this.value < +filterWrapper.getAttribute("start") + 3) {
      this.value = +filterWrapper.getAttribute("start") + 3;
    }

    end(this.value);
    updateValues();
  });
  var inputsLabel = document.createElement("span");
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
    var _start = +filterWrapper.getAttribute("start");

    var _end = +filterWrapper.getAttribute("end");

    sinput.value = _start;
    einput.value = _end;
    cb(_start, _end);
  }

  if (tacticksArray[0].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[0]));
  if (tacticksArray[1].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[1], "away"));
  filterWrapper.appendChild(inputs);
  updateValues(); // cb(filterWrapper.getAttribute("start"), filterWrapper.getAttribute("end"));

  return filterWrapper;
}

},{}]},{},[1]);

/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2016-09-05 01:16
 */
;(function (name, context, factory) {

  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    context[name] = factory();
  }

})("h337", this, function () {

// Heatmap Config stores default values and will be merged with instance config
var HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: 'canvas2d',
  defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: .85,
  defaultXField: 'x',
  defaultYField: 'y',
  defaultValueField: 'value', 
  plugins: {}
};
var Store = (function StoreClosure() {

  var Store = function Store(config) {
    this._coordinator = {};
    this._data = [];
    this._radi = [];
    this._min = 10;
    this._max = 1;
    this._xField = config['xField'] || config.defaultXField;
    this._yField = config['yField'] || config.defaultYField;
    this._valueField = config['valueField'] || config.defaultValueField;

    if (config["radius"]) {
      this._cfgRadius = config["radius"];
    }
  };

  var defaultRadius = HeatmapConfig.defaultRadius;

  Store.prototype = {
    // when forceRender = false -> called from setData, omits renderall event
    _organiseData: function(dataPoint, forceRender) {
        var x = dataPoint[this._xField];
        var y = dataPoint[this._yField];
        var radi = this._radi;
        var store = this._data;
        var max = this._max;
        var min = this._min;
        var value = dataPoint[this._valueField] || 1;
        var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

        if (!store[x]) {
          store[x] = [];
          radi[x] = [];
        }

        if (!store[x][y]) {
          store[x][y] = value;
          radi[x][y] = radius;
        } else {
          store[x][y] += value;
        }
        var storedVal = store[x][y];

        if (storedVal > max) {
          if (!forceRender) {
            this._max = storedVal;
          } else {
            this.setDataMax(storedVal);
          }
          return false;
        } else if (storedVal < min) {
          if (!forceRender) {
            this._min = storedVal;
          } else {
            this.setDataMin(storedVal);
          }
          return false;
        } else {
          return { 
            x: x, 
            y: y,
            value: value, 
            radius: radius,
            min: min,
            max: max 
          };
        }
    },
    _unOrganizeData: function() {
      var unorganizedData = [];
      var data = this._data;
      var radi = this._radi;

      for (var x in data) {
        for (var y in data[x]) {

          unorganizedData.push({
            x: x,
            y: y,
            radius: radi[x][y],
            value: data[x][y]
          });

        }
      }
      return {
        min: this._min,
        max: this._max,
        data: unorganizedData
      };
    },
    _onExtremaChange: function() {
      this._coordinator.emit('extremachange', {
        min: this._min,
        max: this._max
      });
    },
    addData: function() {
      if (arguments[0].length > 0) {
        var dataArr = arguments[0];
        var dataLen = dataArr.length;
        while (dataLen--) {
          this.addData.call(this, dataArr[dataLen]);
        }
      } else {
        // add to store  
        var organisedEntry = this._organiseData(arguments[0], true);
        if (organisedEntry) {
          // if it's the first datapoint initialize the extremas with it
          if (this._data.length === 0) {
            this._min = this._max = organisedEntry.value;
          }
          this._coordinator.emit('renderpartial', {
            min: this._min,
            max: this._max,
            data: [organisedEntry]
          });
        }
      }
      return this;
    },
    setData: function(data) {
      var dataPoints = data.data;
      var pointsLen = dataPoints.length;


      // reset data arrays
      this._data = [];
      this._radi = [];

      for(var i = 0; i < pointsLen; i++) {
        this._organiseData(dataPoints[i], false);
      }
      this._max = data.max;
      this._min = data.min || 0;
      
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    removeData: function() {
      // TODO: implement
    },
    setDataMax: function(max) {
      this._max = max;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setDataMin: function(min) {
      this._min = min;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setCoordinator: function(coordinator) {
      this._coordinator = coordinator;
    },
    _getInternalData: function() {
      return { 
        max: this._max,
        min: this._min, 
        data: this._data,
        radi: this._radi 
      };
    },
    getData: function() {
      return this._unOrganizeData();
    }/*,

      TODO: rethink.

    getValueAt: function(point) {
      var value;
      var radius = 100;
      var x = point.x;
      var y = point.y;
      var data = this._data;

      if (data[x] && data[x][y]) {
        return data[x][y];
      } else {
        var values = [];
        // radial search for datapoints based on default radius
        for(var distance = 1; distance < radius; distance++) {
          var neighbors = distance * 2 +1;
          var startX = x - distance;
          var startY = y - distance;

          for(var i = 0; i < neighbors; i++) {
            for (var o = 0; o < neighbors; o++) {
              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                if (data[startY+i] && data[startY+i][startX+o]) {
                  values.push(data[startY+i][startX+o]);
                }
              } else {
                continue;
              } 
            }
          }
        }
        if (values.length > 0) {
          return Math.max.apply(Math, values);
        }
      }
      return false;
    }*/
  };


  return Store;
})();

var Canvas2dRenderer = (function Canvas2dRendererClosure() {

  var _getColorPalette = function(config) {
    var gradientConfig = config.gradient || config.defaultGradient;
    var paletteCanvas = document.createElement('canvas');
    var paletteCtx = paletteCanvas.getContext('2d');

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
    for (var key in gradientConfig) {
      gradient.addColorStop(key, gradientConfig[key]);
    }

    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, 256, 1);

    return paletteCtx.getImageData(0, 0, 256, 1).data;
  };

  var _getPointTemplate = function(radius, blurFactor) {
    var tplCanvas = document.createElement('canvas');
    var tplCtx = tplCanvas.getContext('2d');
    var x = radius;
    var y = radius;
    tplCanvas.width = tplCanvas.height = radius*2;

    if (blurFactor == 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(0,0,0,1)';
      tplCtx.fill();
    } else {
      var gradient = tplCtx.createRadialGradient(x, y, radius*blurFactor, x, y, radius);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2*radius, 2*radius);
    }



    return tplCanvas;
  };

  var _prepareData = function(data) {
    var renderData = [];
    var min = data.min;
    var max = data.max;
    var radi = data.radi;
    var data = data.data;

    var xValues = Object.keys(data);
    var xValuesLen = xValues.length;

    while(xValuesLen--) {
      var xValue = xValues[xValuesLen];
      var yValues = Object.keys(data[xValue]);
      var yValuesLen = yValues.length;
      while(yValuesLen--) {
        var yValue = yValues[yValuesLen];
        var value = data[xValue][yValue];
        var radius = radi[xValue][yValue];
        renderData.push({
          x: xValue,
          y: yValue,
          value: value,
          radius: radius
        });
      }
    }

    return {
      min: min,
      max: max,
      data: renderData
    };
  };


  function Canvas2dRenderer(config) {
    var container = config.container;
    var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
    var canvas = this.canvas = config.canvas || document.createElement('canvas');
    var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

    var computed = getComputedStyle(config.container) || {};

    canvas.className = 'heatmap-canvas';

    this._width = canvas.width = shadowCanvas.width = config.width || +(computed.width.replace(/px/,''));
    this._height = canvas.height = shadowCanvas.height = config.height || +(computed.height.replace(/px/,''));

    this.shadowCtx = shadowCanvas.getContext('2d');
    this.ctx = canvas.getContext('2d');

    // @TODO:
    // conditional wrapper

    canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;';

    container.style.position = 'relative';
    container.appendChild(canvas);

    this._palette = _getColorPalette(config);
    this._templates = {};

    this._setStyles(config);
  };

  Canvas2dRenderer.prototype = {
    renderPartial: function(data) {
      if (data.data.length > 0) {
        this._drawAlpha(data);
        this._colorize();
      }
    },
    renderAll: function(data) {
      // reset render boundaries
      this._clear();
      if (data.data.length > 0) {
        this._drawAlpha(_prepareData(data));
        this._colorize();
      }
    },
    _updateGradient: function(config) {
      this._palette = _getColorPalette(config);
    },
    updateConfig: function(config) {
      if (config['gradient']) {
        this._updateGradient(config);
      }
      this._setStyles(config);
    },
    setDimensions: function(width, height) {
      this._width = width;
      this._height = height;
      this.canvas.width = this.shadowCanvas.width = width;
      this.canvas.height = this.shadowCanvas.height = height;
    },
    _clear: function() {
      this.shadowCtx.clearRect(0, 0, this._width, this._height);
      this.ctx.clearRect(0, 0, this._width, this._height);
    },
    _setStyles: function(config) {
      this._blur = (config.blur == 0)?0:(config.blur || config.defaultBlur);

      if (config.backgroundColor) {
        this.canvas.style.backgroundColor = config.backgroundColor;
      }

      this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
      this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;


      this._opacity = (config.opacity || 0) * 255;
      this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
      this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
      this._useGradientOpacity = !!config.useGradientOpacity;
    },
    _drawAlpha: function(data) {
      var min = this._min = data.min;
      var max = this._max = data.max;
      var data = data.data || [];
      var dataLen = data.length;
      // on a point basis?
      var blur = 1 - this._blur;

      while(dataLen--) {

        var point = data[dataLen];

        var x = point.x;
        var y = point.y;
        var radius = point.radius;
        // if value is bigger than max
        // use max as value
        var value = Math.min(point.value, max);
        var rectX = x - radius;
        var rectY = y - radius;
        var shadowCtx = this.shadowCtx;




        var tpl;
        if (!this._templates[radius]) {
          this._templates[radius] = tpl = _getPointTemplate(radius, blur);
        } else {
          tpl = this._templates[radius];
        }
        // value from minimum / value range
        // => [0, 1]
        var templateAlpha = (value-min)/(max-min);
        // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
        shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha;

        shadowCtx.drawImage(tpl, rectX, rectY);

        // update renderBoundaries
        if (rectX < this._renderBoundaries[0]) {
            this._renderBoundaries[0] = rectX;
          }
          if (rectY < this._renderBoundaries[1]) {
            this._renderBoundaries[1] = rectY;
          }
          if (rectX + 2*radius > this._renderBoundaries[2]) {
            this._renderBoundaries[2] = rectX + 2*radius;
          }
          if (rectY + 2*radius > this._renderBoundaries[3]) {
            this._renderBoundaries[3] = rectY + 2*radius;
          }

      }
    },
    _colorize: function() {
      var x = this._renderBoundaries[0];
      var y = this._renderBoundaries[1];
      var width = this._renderBoundaries[2] - x;
      var height = this._renderBoundaries[3] - y;
      var maxWidth = this._width;
      var maxHeight = this._height;
      var opacity = this._opacity;
      var maxOpacity = this._maxOpacity;
      var minOpacity = this._minOpacity;
      var useGradientOpacity = this._useGradientOpacity;

      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x + width > maxWidth) {
        width = maxWidth - x;
      }
      if (y + height > maxHeight) {
        height = maxHeight - y;
      }

      var img = this.shadowCtx.getImageData(x, y, width, height);
      var imgData = img.data;
      var len = imgData.length;
      var palette = this._palette;


      for (var i = 3; i < len; i+= 4) {
        var alpha = imgData[i];
        var offset = alpha * 4;


        if (!offset) {
          continue;
        }

        var finalAlpha;
        if (opacity > 0) {
          finalAlpha = opacity;
        } else {
          if (alpha < maxOpacity) {
            if (alpha < minOpacity) {
              finalAlpha = minOpacity;
            } else {
              finalAlpha = alpha;
            }
          } else {
            finalAlpha = maxOpacity;
          }
        }

        imgData[i-3] = palette[offset];
        imgData[i-2] = palette[offset + 1];
        imgData[i-1] = palette[offset + 2];
        imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;

      }

      img.data = imgData;
      this.ctx.putImageData(img, x, y);

      this._renderBoundaries = [1000, 1000, 0, 0];

    },
    getValueAt: function(point) {
      var value;
      var shadowCtx = this.shadowCtx;
      var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
      var data = img.data[3];
      var max = this._max;
      var min = this._min;

      value = (Math.abs(max-min) * (data/255)) >> 0;

      return value;
    },
    getDataURL: function() {
      return this.canvas.toDataURL();
    }
  };


  return Canvas2dRenderer;
})();


var Renderer = (function RendererClosure() {

  var rendererFn = false;

  if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
    rendererFn = Canvas2dRenderer;
  }

  return rendererFn;
})();


var Util = {
  merge: function() {
    var merged = {};
    var argsLen = arguments.length;
    for (var i = 0; i < argsLen; i++) {
      var obj = arguments[i]
      for (var key in obj) {
        merged[key] = obj[key];
      }
    }
    return merged;
  }
};
// Heatmap Constructor
var Heatmap = (function HeatmapClosure() {

  var Coordinator = (function CoordinatorClosure() {

    function Coordinator() {
      this.cStore = {};
    };

    Coordinator.prototype = {
      on: function(evtName, callback, scope) {
        var cStore = this.cStore;

        if (!cStore[evtName]) {
          cStore[evtName] = [];
        }
        cStore[evtName].push((function(data) {
            return callback.call(scope, data);
        }));
      },
      emit: function(evtName, data) {
        var cStore = this.cStore;
        if (cStore[evtName]) {
          var len = cStore[evtName].length;
          for (var i=0; i<len; i++) {
            var callback = cStore[evtName][i];
            callback(data);
          }
        }
      }
    };

    return Coordinator;
  })();


  var _connect = function(scope) {
    var renderer = scope._renderer;
    var coordinator = scope._coordinator;
    var store = scope._store;

    coordinator.on('renderpartial', renderer.renderPartial, renderer);
    coordinator.on('renderall', renderer.renderAll, renderer);
    coordinator.on('extremachange', function(data) {
      scope._config.onExtremaChange &&
      scope._config.onExtremaChange({
        min: data.min,
        max: data.max,
        gradient: scope._config['gradient'] || scope._config['defaultGradient']
      });
    });
    store.setCoordinator(coordinator);
  };


  function Heatmap() {
    var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
    this._coordinator = new Coordinator();
    if (config['plugin']) {
      var pluginToLoad = config['plugin'];
      if (!HeatmapConfig.plugins[pluginToLoad]) {
        throw new Error('Plugin \''+ pluginToLoad + '\' not found. Maybe it was not registered.');
      } else {
        var plugin = HeatmapConfig.plugins[pluginToLoad];
        // set plugin renderer and store
        this._renderer = new plugin.renderer(config);
        this._store = new plugin.store(config);
      }
    } else {
      this._renderer = new Renderer(config);
      this._store = new Store(config);
    }
    _connect(this);
  };

  // @TODO:
  // add API documentation
  Heatmap.prototype = {
    addData: function() {
      this._store.addData.apply(this._store, arguments);
      return this;
    },
    removeData: function() {
      this._store.removeData && this._store.removeData.apply(this._store, arguments);
      return this;
    },
    setData: function() {
      this._store.setData.apply(this._store, arguments);
      return this;
    },
    setDataMax: function() {
      this._store.setDataMax.apply(this._store, arguments);
      return this;
    },
    setDataMin: function() {
      this._store.setDataMin.apply(this._store, arguments);
      return this;
    },
    configure: function(config) {
      this._config = Util.merge(this._config, config);
      this._renderer.updateConfig(this._config);
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    repaint: function() {
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    getData: function() {
      return this._store.getData();
    },
    getDataURL: function() {
      return this._renderer.getDataURL();
    },
    getValueAt: function(point) {

      if (this._store.getValueAt) {
        return this._store.getValueAt(point);
      } else  if (this._renderer.getValueAt) {
        return this._renderer.getValueAt(point);
      } else {
        return null;
      }
    }
  };

  return Heatmap;

})();


// core
var heatmapFactory = {
  create: function(config) {
    return new Heatmap(config);
  },
  register: function(pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  }
};

return heatmapFactory;


});
//# sourceMappingURL=hm.js.map
