//"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
;

function afterLoadEvents() {
    //showableTacticks) {
    function formHeatmapUrl(_urlINput) {
        return window.location.origin + window.location.pathname + "?" + _urlINput.replace('http://pefl.ru/tv/#/', '');
    };
    function formTVUrl() {
        let locationString = window.location.href;
        locationString = locationString
            .replace("http://pefl.ru/heatmaps.html?", "http://pefl.ru/tv/#/")
            .replace("http://localhost:8080//heatmaps.html?", 'http://pefl.ru/tv/#/')
            .replace("http://localhost:8080/heatmaps.html?", 'http://pefl.ru/tv/#/');
        // console.log(locationString);

        return locationString;
    }

    /**===================================================================================================== */
    // const urlPaste = document.querySelector('#pasteButton');
    const urlInput = document.querySelector("#tv-url-input");
    // if (navigator.clipboard) {
    //   urlPaste.addEventListener('click', e => {
    //     // e.preventDefault();
    //     navigator.clipboard.readText()
    //       .then(
    //         clipText => {
    //           urlInput.value = clipText;
    //         })
    //       .catch(e => {
    //         console.log("Работа с буфером сейчас не разрешена или не доступна в вашем браузере!");
    //       });
    //   });
    // } else {
    //   urlPaste.remove();
    // }
    document.getElementById("tv-url").href = formTVUrl();
    document.getElementById("json-url").href = formJsonUrl();
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
    function normalizeTacticAvgPositions() {
        if (homeTacticPoints.length > 1) {
            for (let t = 1; t < homeTacticPoints.length; t++) {
                if (homeTacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                for (let n = 1; n <= MAX_PLAYERS; n++) {
                    const hp = document.querySelector("#homeAvgPoints_" + t + "_" + n);
                    const rank = homeTacticPoints[t].rankByMinutes
                    hp.style.display = rank.indexOf(rank.find(el => { return el[0] == n })) < 11 ? "inherit" : "none";
                }
            }
        }
        if (awayTacticPoints.length > 1) {
            for (let t = 1; t < awayTacticPoints.length; t++) {
                if (awayTacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                for (let n = 1; n <= MAX_PLAYERS; n++) {
                    const ap = document.querySelector("#awayAvgPoints_" + t + "_" + n);
                    const rank = awayTacticPoints[t].rankByMinutes
                    ap.style.display = rank.indexOf(rank.find(el => { return el[0] == n })) < 11 ? "inherit" : "none";
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
        document.getElementById("norm-tactic-avg").addEventListener("click", function (e) {
            e.preventDefault();
            normalizeTacticAvgPositions();
        });
        document.getElementById("reset-maps-filtering").addEventListener("click", function (e) {
            e.preventDefault();
            filterMapsByTime(0, 125);
            filterRangeMaximize("maps-time-filter");
        })
    }, 200);

};
