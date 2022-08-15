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

