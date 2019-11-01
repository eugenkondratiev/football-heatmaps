/**===================================================================================================== */
function createShotLine (shot, shotinfo, color) {
    const line = document.createElement('div');
    line.classList.add('shotline');
    line.style.top = shot.startpoint.y - 1 + "px";
    line.style.left = shot.startpoint.x + "px";
    line.style.width = getSegmentLength(shot.startpoint, shot.endpoint)  + "px";
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
    shotStart.style.top = shot.startpoint.y - 5 +  "px";
    shotStart.style.left = shot.startpoint.x - 5 +  "px";
    const typeString = shot.type == "G"
        ? 'Гол'
        : shot.type == "V" 
          ? 'Удар в створ' 
          : shot.type == "Block" 
            ? 'Блок' 
            : shot.type == "B" ? 'Каркас ворот' :'Мимо';

  shotStart.addEventListener('mouseenter', function(e) {
    console.log(shot.minute, shot.episode, shot.player, shotinfo.playerName, typeString);
    const shotLegend = document.querySelector('#oneShotLegend');
    const shotString = "Минута " + shot.minute + ", " + typeString + ",\n\r " + shot.player + "." + shotinfo.playerName;
    shotLegend.textContent = shotString;
    shotLegend.style.display  = "inline-block";
  })

  shotStart.addEventListener('mouseleave', function(e) {
    document.querySelector('#oneShotLegend').style.display  = "none";
  })
        return shotStart;
}
/**===================================================================================================== */
function createShotEnd(shot, shotinfo, color) {
    const shotEnd = document.createElement('div');
    shotEnd.classList.add('shotend'); 
    shotEnd.style.borderColor = color;
    shotEnd.style.backgroundColor = color;
    shotEnd.style.top = shot.endpoint.y - 2 +  "px";
    shotEnd.style.left = shot.endpoint.x - 2 +  "px";
     return shotEnd;
}/**===================================================================================================== */
function createShot (shot, shotinfo) {
  const _strokeStyle = shot.type == "G"
        ? 'red'
        : shot.type == "V" 
          ? 'yellow' 
          : shot.type == "Block" ? 'black' : 'blue';

    const shotPict = document.createElement('div');
    shotPict.classList.add('shot');
    shotPict.setAttribute("player", shot.player);
    shotPict.setAttribute("shotType", shot.type);

    shotPict.appendChild(createShotLine(shot, shotinfo, _strokeStyle));
    shotPict.appendChild(createShotEnd(shot, shotinfo, _strokeStyle));
    shotPict.appendChild(createShotStart(shot, shotinfo, _strokeStyle));

    return shotPict;
}
/**===================================================================================================== */
function drawTeamShots(teamShots, players, ctx) {
    teamShots.forEach((shot, shotNum) => {
      // const _strokeStyle = shot.type == "G"
      //   ? 'red'
      //   : shot.type == "V" 
      //     ? 'yellow' 
      //     : shot.type == "Block" ? 'black' : 'blue';

    const shotInfo = {playerName: players[shot.player - 1].name};

    document.querySelector('#chalkboard').appendChild(createShot(shot, shotInfo));


      // ctx.beginPath(); 
      // ctx.fillStyle = _strokeStyle;
      // ctx.arc(shot.startpoint.x, shot.startpoint.y, 4, 0, 2 * Math.PI, false);
      // ctx.fill();              
      // ctx.moveTo(shot.startpoint.x, shot.startpoint.y);
      // ctx.lineWidth = 2;
      // ctx.lineTo(shot.endpoint.x, shot.endpoint.y);
      // ctx.arc(shot.endpoint.x, shot.endpoint.y, 2, 0, 2 * Math.PI, false);
      // ctx.strokeStyle = _strokeStyle;
      // ctx.stroke();

    });
  }
