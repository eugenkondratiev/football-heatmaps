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
