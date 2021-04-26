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

    passPict.setAttribute("player", pass.player);
    passPict.setAttribute("passType", pass.type);
    passPict.setAttribute("minute", pass.minute);
    passPict.setAttribute("high", pass.high);
    passPict.setAttribute("good", pass.good);

    passPict.appendChild(createPassLine(pass, passinfo, _strokeStyle));
    passPict.appendChild(createPassStart(pass, passinfo, _strokeStyle));

    return passPict;
}
/**===================================================================================================== */
function drawTeamPasses(teamPasses, players, team, ctx) {
    teamPasses.forEach((playerPasses, _player) => {
        if (!playerPasses[0]) return;
        playerPasses.forEach(pass => {
            const passInfo = { playerName: players[_player].name, team: team, player: _player + 1 };
            document.querySelector('#passesboard').appendChild(createPass(pass, passInfo));;
        })
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

