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