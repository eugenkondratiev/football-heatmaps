/**===================================================================================================== */
;function createShotLine(shot, shotinfo, color) {
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
  // shotStart.style.top = shot.startpoint.y - .7 + "%";
  // shotStart.style.left = shot.startpoint.x - .7 + "%";
  const typeString = shot.type == "G"
    ? 'Гол'
    : shot.type == "V"
      ? 'Удар в створ'
      : shot.type == "Block"
        ? 'Блок'
        : shot.type == "B" ? 'Каркас ворот' : 'Мимо';

  shotStart.addEventListener('mouseenter', function (e) {
    // console.log(shot.minute, shot.episode, shot.player, shotinfo.playerName, typeString);
    const shotLegend = document.querySelector('#one-shot-legend');
    const shotString = " Минута " + shot.minute + ", " + typeString + ",\n\r " + shot.player + "." + shotinfo.playerName;
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
      : shot.type == "Block" ? 'black' : 'blue';

  const shotPict = document.createElement('div');
  shotPict.classList.add('shot');
  const teamClass = shotinfo.team + "Shot";
  shotPict.classList.add(teamClass);

  shotPict.setAttribute("player", shot.player);
  shotPict.setAttribute("shotType", shot.type);

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
}
/**===================================================================================================== */
function formShotsString(player) {
  const goals = player.goals ? parseInt(player.goals) : 0;
  const stvor = goals + (player.stvor ? parseInt(player.stvor) : 0);
  const sum = stvor + (player.miss ? parseInt(player.miss) : 0);
  const goalsString = "|" + goals;
  const bars = player.bar ? "|" + (parseInt(player.bar)) : " ";
  const blocks = player.block ? "|" + (parseInt(player.block)) : " ";

  return sum + bars + blocks == 0
    ? " "
    : sum == 0
      ? "        " + blocks + bars
      : (sum > 9 ? sum : " " + sum) + "|" + stvor + goalsString + " " + blocks + bars;
}
/**===================================================================================================== */
function displayAllShots(display, team, hard = true) {
  const shotsSelector = "." + team + "Shot";
  document.querySelectorAll(shotsSelector).forEach(shot => {
    const checkbox = document.querySelector("#" + team + "PlayerList_" + shot.getAttribute("player") + " input");
    let checked = checkbox ? checkbox.checked : false;
    shot.style.display = (display)
      ? "block"
      : (checked && !hard) ? "block" : "none";
  })
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


function showAllShots() {
  displayAllShots(true, "home");
  displayAllShots(true, "away");
  document.querySelectorAll(".squadAndShots-containers-wrapper input[type=checkbox]").forEach(chbox => {
    chbox.checked = false;
  })
}
document.getElementsByClassName("shots-container")[0].addEventListener('click', function (e) {
  showAllShots();
});
document.getElementById("filter-show-all").addEventListener('click', function (e) {
  e.preventDefault();
  showAllShots();
});
