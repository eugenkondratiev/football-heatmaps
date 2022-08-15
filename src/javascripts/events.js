//"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
;
function afterLoadEvents() {
    function formHeatmapUrl(_urlINput) {
        return window.location.origin + window.location.pathname + "?" + _urlINput.replace('http://pefl.ru/tv/#/', '');
    };
    function formTVUrl() {
        let locationString = window.location.href;
        locationString = locationString
            .replace("http://pefl.ru/heatmaps.html?", "http://pefl.ru/tv/#/")
            .replace(":8080//", ':8080/')
            .replace("http://localhost:8080/heatmaps.html?", 'http://pefl.ru/tv/#/');

        return locationString;
    }

    /**===================================================================================================== */
    const urlInput = document.querySelector("#tv-url-input");
    document.getElementById("tv-url").href = formTVUrl();
    document.getElementById("json-url").href = formJsonUrl({ test: false });
    document.querySelector('#updateButton').addEventListener('click', e => {
        e.preventDefault();
        if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
            alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
            return;
        }
        window.location.assign(formHeatmapUrl(urlInput.value));
    });
    document.querySelector('#newWindow').addEventListener('click', e => {
        e.preventDefault();
        if (!urlInput.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)) {
            alert('Вставьте корректную ссылку на ТВ матча в поле ввода!');
            return;
        }
        window.open(formHeatmapUrl(urlInput.value), '_blank');
    });
    function normalizeTacticAvgPositions(_team) {

        if (outData[_team].TacticPoints.length > 1) {
            for (let t = 1; t < outData[_team].TacticPoints.length; t++) {
                if (outData[_team].TacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                for (let n = 1; n <= MAX_PLAYERS; n++) {
                    const pl = document.querySelector("#" + _team + "AvgPoints_" + t + "_" + n);
                    const rank = outData[_team].TacticPoints[t].rankByMinutes
                    pl.style.display = rank.indexOf(rank.find(el => { return el[0] == n })) < 11 ? "inherit" : "none";
                }
            }
        }
    }
    setTimeout(() => {
        document.querySelector("#shots-chalkboard ~ .bojan__content")
            .appendChild(
                createSlider("shots", showableTacticks, filterShotsByTime)
            );
        document.querySelector("#maps-filtered ~ .bojan__content")
            .appendChild(
                createSlider("maps", showableTacticks, filterMapsByTime)
            )
        document.querySelector("#pass-chalkboard ~ .bojan__content")
            .appendChild(
                createSlider("pass", showableTacticks, filterPassesByTime)
            );
        document.getElementById("norm-tactic-avg").addEventListener("click", function (e) {
            e.preventDefault();
            normalizeTacticAvgPositions("home");
            normalizeTacticAvgPositions("away");
        });
        document.getElementById("reset-maps-filtering").addEventListener("click", function (e) {
            e.preventDefault();
            filterMapsByTime(0, 125);
            filterRangeMaximize("maps-time-filter");
        })
    }, 200);

};
