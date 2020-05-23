;
function createSlider(prefix = "", tacticksArray = [[[0, 125]], [[0, 125]]], cb) {


    console.log(tacticksArray[0]);
    console.log(tacticksArray[1]);

    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("time-slider");
    filterWrapper.id = prefix + "-time-filter";
    setLimits(0, 125);
    function formTackticksRow(data = [0, 125], team = "home") {
        const t = document.createElement("div");
        t.classList.add("time-slider__tacticks");
        const _label = document.createElement("span");
        _label.innerText = team === "home" ? "Тактики хозяев" : "Тактики гостей";
        t.appendChild(_label);
        const _ul = document.createElement("ul");
        data.forEach(el => {
            ; const _li = document.createElement("li");
            _li.innerText = el[0] + " - " + el[1];
            _li.classList.add("time-slider__tacticks__ref");
            _li.addEventListener("click", function (e) {
                e.preventDefault();
                setLimits(el[0], el[1]);
                updateValues();
            })

            _ul.appendChild(_li);
        })
        t.appendChild(_ul);

        return t;

    }



    const inputs = document.createElement("div");
    inputs.classList.add("time-slider__inputs");
    const sinput = document.createElement("input");
    sinput.type = "number"; sinput.min = 0; sinput.max = 125; sinput.value = 0;
    sinput.id = prefix + "-start-input";

    const einput = sinput.cloneNode(true);
    einput.id = prefix + "-end-input";
    sinput.addEventListener('change', function (e) {
        e.preventDefault();
        if (+this.value > +filterWrapper.getAttribute("end") - 3) {
            this.value = +filterWrapper.getAttribute("end") - 3;
        }
        start(this.value);
        updateValues();
    })
    einput.addEventListener('change', function (e) {
        e.preventDefault();
        if (+this.value < +filterWrapper.getAttribute("start") + 3) {
            this.value = +filterWrapper.getAttribute("start") + 3;
        }
        end(this.value);
        updateValues();
    })

    const inputsLabel = document.createElement("span");
    inputsLabel.innerText = "Границы периода";

    inputs.appendChild(sinput);
    inputs.appendChild(inputsLabel);
    inputs.appendChild(einput);

    function start(_start) {
        filterWrapper.setAttribute("start", _start);
    }
    function end(_end) {
        filterWrapper.setAttribute("end", _end);
    }
    function setLimits(start, end) {
        filterWrapper.setAttribute("start", start);
        filterWrapper.setAttribute("end", end);
    }

    function updateValues() {
        const _start = +filterWrapper.getAttribute("start");
        const _end = +filterWrapper.getAttribute("end");

        sinput.value = _start;
        einput.value = _end;


        cb(_start, _end);

    }

    if (tacticksArray[0].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[0]));

    if (tacticksArray[1].length > 0) filterWrapper.appendChild(formTackticksRow(tacticksArray[1], "away"));

    filterWrapper.appendChild(inputs);

    updateValues();

    // cb(filterWrapper.getAttribute("start"), filterWrapper.getAttribute("end"));

    return filterWrapper;
}