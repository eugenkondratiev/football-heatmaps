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

function getMileage(point1, point2) {
  const dX = point2.x - point1.x;
  const dY = point2.y - point1.y;
  // console.log(MILEAGE_KEFF * Math.sqrt(dX*dX + dY*dY));
  return MILEAGE_KEFF * Math.sqrt(dX*dX + dY*dY)
}  
//==============================================================================

function leaveValuablePoints(pointsArr) {
return pointsArr.filter(point => !point); // if not null
}
//==============================================================================

function getPointsSet(pointsArr, start, end) {
  return pointsArr.slice(start, end);
}