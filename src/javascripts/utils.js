; const JSON_URL_START = 'http://pefl.ru/jsonreport.php';
//==============================================================================
function formJsonUrl(tvurl) {
  const urlString = window.location.href.match(/j\=\d+\&z\=.+/i)
    ? window.location.href
    : tvurl;
  const zIndex = urlString.indexOf('&z=');
  const jIndex = urlString.indexOf('j=');

  return JSON_URL_START + `?j=${urlString.substring(2 + jIndex, zIndex)}&z=${urlString.substring(3 + zIndex)}`;

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
function normalizePoint(point, secondTime = false, away = false, coords2 = jsonCoords) {
  if (away) {
    // if (secondTime && away || !secondTime && away) {
    return {h: (coords2.y2 - point.h), w: (coords2.x2 - point.w), value: 1 };
  }
  return { h: point.h, w: point.w, value: 1 }
}

//==============================================================================
function getSegmentLength(point1, point2) {
  const dX = point2.x - point1.x;
  const dY = point2.y - point1.y;
  return Math.sqrt(dX * dX + dY * dY)
}
//==============================================================================
function getLength(coord1, coord2) {
  const dX = coord2.w - coord1.w;
  const dY = coord2.h - coord1.h;
  return Math.sqrt(dX * dX + dY * dY)
}
//==================================================
function getLengthToBall(coord, ball, _secondTime = false, _away = false) {
  const point = normalizePoint(coord, _secondTime, _away);
  const length = getLength(point, ball);
  // console.log(_secondTime, _away, coord, point, ball, length );
  return length;
  // return getLength(point, ball);
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
function getPlayerFromMessage(message, num = 1) {
  // console.log(typeof message, message);
  if (!message) return 0;
  const playerNumbers = message.mes.match(/(?<=\[)\d+(?=\])/g);
  // console.log("playerNumbers -", playerNumbers);
  return playerNumbers != null && playerNumbers[num - 1] ? +playerNumbers[num - 1] : 0;
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
function isOneTeam(firstPlayer, secondPlayer) {
  return firstPlayer < 19 && secondPlayer < 19 || firstPlayer > 18 && secondPlayer > 18;
}
/**===================================================================================================== */
function getSubArrow(_sub) {
  const sub = _sub || SUB_OUT;
  const arrRef = sub == SUB_OUT ? 'http://pefl.ru/system/img/gm/out.gif' : 'http://pefl.ru/system/img/gm/in.gif';
  const arrow = document.createElement("img");
  arrow.src = arrRef;
  return arrow;
}
/**===================================================================================================== */
function createEye(toolTip) {
  const eye = document.createElement('img');
  eye.src = "http://pefl.ru/images/eye.png";
  eye.alt = "";
  const tp = document.createElement('div');
  tp.className = "tooltiptext";
  // tp.display = "none";
  tp.innerText = toolTip;
  eye.appendChild(tp);
  return eye;
}