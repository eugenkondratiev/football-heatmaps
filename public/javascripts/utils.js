//==============================================================================
function formJsonUrl(tvurl) {
    const urlString = window.location.href.match(/j\=\d+\&z\=.+/i)
              ? window.location.href
              : tvurl;
    // //console.log("urlString = ",  urlString);
    // //console.log(window.location.href, "   " , window.location.href.match(/j\=\d+\&z\=.+/i));
  
      const zIndex =urlString.indexOf('&z=');
      const jIndex =urlString.indexOf('j=');
      // //console.log(zIndex, jIndex, urlString.substring(2 + jIndex, zIndex), urlString.substring(3+ zIndex));
  
      return `http://pefl.ru/jsonreport.php?j=${ urlString.substring(2 + jIndex, zIndex)}&z=${ urlString.substring(3+ zIndex)}`;
    
    
  }

//==============================================================================
  
  function limitPoint(point, secondTime = false, coords1 = hmCoords, coords2 = jsonCoords) {
    const x = point.x;
    const y = point.y;
    let newX;
    let newY;
    if (secondTime) {
       newX = Math.round(coords1.x2 - (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1) );
        newY = Math.round(coords1.y2 - (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1) );    
    } else {
       newX = Math.round(coords1.x1 + (x - coords2.x1) * (coords1.x2 - coords1.x1) / (coords2.x2 - coords2.x1) );
        newY = Math.round(coords1.y1 + (y - coords2.y1) * (coords1.y2 - coords1.y1) / (coords2.y2 - coords2.y1) );    
    }
    return { x: newX, y: newY, value: point.value }
}
//==============================================================================
function getSegmentLength(point1, point2) {
  const dX = point2.x - point1.x;
  const dY = point2.y - point1.y;
  return Math.sqrt(dX*dX + dY*dY)
}  
//==============================================================================
function getSegmentAngle(startPoint, endPoint) {
  const dX = endPoint.x - startPoint.x;
  const dY = endPoint.y - startPoint.y;
  const keff = dX < 0 ? (dY < 0 ? -180 : 180) : 0;

  return keff + Math.atan(dY/dX) * 180 / Math.PI;;
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

function getPointsSet(pointsArr, start, end) {
  return pointsArr.slice(start, end);
}
/**===================================================================================================== */
function clearPoint(arr) {
  return arr.filter(el => (el != null));
}
/**===================================================================================================== */
function getSubArrow(_sub) {
  const sub = _sub || SUB_OUT;
  const arrRef = sub == SUB_OUT ? 'http://pefl.ru/system/img/gm/out.gif' : 'http://pefl.ru/system/img/gm/in.gif';
  const arrow = document.createElement("img");
  arrow.src =  arrRef;
  return arrow;
}
/**===================================================================================================== */
