;
function filterMapsByTime(_start, end) {
    const start = _start == 0 ? 1 : _start;
    console.log(start, end, start < end, (+end - +start));
    if ((start > end) || ((+end - +start) <= MIN_MINUTES_FOR_SHOW_TACTIC)) return;
    // document.querySelectorAll("[class$=Shot]").forEach(shot => {
    //   const minute = +shot.getAttribute("minute");
    //   const matchPeriod = (minute >= +start && minute <= +end);
    //   // console.log(matchPeriod, +shot.getAttribute("minute"), shot);
    //   shot.style.display = (matchPeriod)
    //     ? "block"
    //     : "none";
    // });
    const startEpisode = minutesStarts[start];
    const endEpisode = minutesStarts[end];
    console.log(startEpisode, endEpisode);
    const filteredBall = ballPoints.slice(startEpisode, endEpisode);
    const filteredHomePoints = [];
    homePointsFull.map(pl => pl.slice(startEpisode, endEpisode)).forEach((row, n) => {
        if (n === 0) return;
        row.filter(el=> el != null).forEach(point => filteredHomePoints.push(point))
    });

    const filteredAwayPoints = [];
    awayPointsFull.map(pl => pl.slice(startEpisode, endEpisode)).forEach((row, n) => {
        if (n === 0) return;
        row.filter(el=> el != null).forEach(point => filteredAwayPoints.push(point))
    });

    console.log(endEpisode - startEpisode, filteredBall);
    console.log(endEpisode - startEpisode, filteredHomePoints);
    console.log(endEpisode - startEpisode, filteredAwayPoints);

    updateMainMaps(filteredHomePoints, filteredAwayPoints, filteredBall);

}