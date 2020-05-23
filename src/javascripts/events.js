//"http://pefl.ru/tv/#/j=1099441&z=614c69293214e3c2e1ea1fdae3d6dd2d";
;

function afterLoadEvents(showableTacticks) {
    function formHeatmapUrl(_urlINput) {
        return window.location.origin + window.location.pathname + "?" + _urlINput.replace('http://pefl.ru/tv/#/', '');
    };
    function formTVUrl() {
        let locationString = window.location.href;
        locationString = locationString
            .replace("http://pefl.ru/heatmaps.html?", "http://pefl.ru/tv/#/")
            .replace("http://localhost:8080//heatmaps.html?", 'http://pefl.ru/tv/#/');
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
    setTimeout(() => {
        document.querySelector("#shots-chalkboard ~ .bojan__content")
            .appendChild(
                createSlider("_", showableTacticks, filterShotsByTime)
            )
    }, 2000);

};
