;
function filterMapsByTime(_start, end) {
    try {
        const start = _start == 0 ? 1 : _start;
        // console.log(start, end, start < end, (+end - +start));
        if ((start > end) || ((+end - +start) <= MIN_MINUTES_FOR_SHOW_TACTIC)) return;

        const startEpisode = minutesStarts[start];
        const endEpisode = minutesStarts[end];
        // console.log(startEpisode, endEpisode);
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

        // const filteredHomePoints = [];

        function filterTeamPoints(_team = "home") {
            playersFiltered[_team] = outData[_team].PointsFull.map(pl => pl.slice(startEpisode, endEpisode));
            playersFiltered[_team].forEach((row, n) => {
                if (n === 0) return;
                row.filter(el => el != null).forEach(point => filteredPoints[_team].push(point))
            });
        }

        filterTeamPoints("home")
        filterTeamPoints("away")
        {
            // const homePlayersFiltered = homePointsFull.map(pl => pl.slice(startEpisode, endEpisode));
            // homePlayersFiltered.forEach((row, n) => {
            //     if (n === 0) return;
            //     row.filter(el => el != null).forEach(point => filteredHomePoints.push(point))
            // });

            // // const filteredAwayPoints = [];
            // const awayPlayersFiltered = awayPointsFull.map(pl => pl.slice(startEpisode, endEpisode));
            // awayPlayersFiltered.forEach((row, n) => {
            //     if (n === 0) return;
            //     row.filter(el => el != null).forEach(point => filteredAwayPoints.push(point))
            // });
        }


        updateMainMaps(filteredPoints.home, filteredPoints.away, filteredPoints.ball);



        // const awayRank = _awayAvgPoints[0].order;
        // const _awayAvgPoints = calculateAvgPositions(playersFiltered.away).slice();

        function displayTeamAvgPoints(_team = "home") {
            const _avgPoints = calculateAvgPositions(playersFiltered[_team]).slice();
            const _rank = _avgPoints[0].order;

            for (let n = 1; n <= MAX_PLAYERS; n++) {
                const pl = document.getElementById(_team + "AvgPoints" + n);
                const plRank = _rank.indexOf(_rank.find(pl => pl.playerRank == n));
                pl.style.display = hpRank < 11 ? "inherit" : "none";
                pl.style.left = _avgPoints[n].x - 5 + "px";
                pl.style.top = _avgPoints[n].y - 5 + "px";
                const plBoth = document.getElementById("bothhomeAvgPoints" + n);
                plBoth.style.display = pl.style.display;
                plBoth.style.left = pl.style.left;
                plBoth.style.top = pl.style.top;
                plName = document.getElementById(_team + "-player-list_" + n + '_name');
                plName.style.fontWeight = plRank < 11 ? "bold" : "normal";
            }
        }
        displayTeamAvgPoints("home")
        displayTeamAvgPoints("away")
     {   
        // for (let n = 1; n <= MAX_PLAYERS; n++) {
        //     // const hp = document.getElementById("homeAvgPoints" + n);
        //     // const hpRank = homeRank.indexOf(homeRank.find(pl => pl.playerRank == n));
        //     // hp.style.display = hpRank < 11 ? "inherit" : "none";
        //     // hp.style.left = _homeAvgPoints[n].x - 5 + "px";
        //     // hp.style.top = _homeAvgPoints[n].y - 5 + "px";
        //     // const hpBoth = document.getElementById("bothhomeAvgPoints" + n);
        //     // hpBoth.style.display = hp.style.display;
        //     // hpBoth.style.left = hp.style.left;
        //     // hpBoth.style.top = hp.style.top;
        //     // hpName = document.getElementById("home-player-list_" + n + '_name');
        //     // hpName.style.fontWeight = hpRank < 11 ? "bold" : "normal";

        //     // const ap = document.getElementById("awayAvgPoints" + n);
        //     // const apRank = awayRank.indexOf(awayRank.find(pl => pl.playerRank == n));
        //     // ap.style.display = apRank < 11 ? "inherit" : "none";
        //     // ap.style.left = _awayAvgPoints[n].x - 5 + "px";
        //     // ap.style.top = _awayAvgPoints[n].y - 5 + "px";
        //     // const apBoth = document.getElementById("bothawayAvgPoints" + n);
        //     // apBoth.style.display = ap.style.display;
        //     // apBoth.style.left = ap.style.left;
        //     // apBoth.style.top = ap.style.top;

        //     // apName = document.getElementById("away-player-list_" + n + '_name');
        //     // apName.style.fontWeight = apRank < 11 ? "bold" : "normal";

        // }
    }
    } catch (error) {
        console.log(error)
    }


}