;
function createSlider(prefix = "", tacticksArray = [[[0, 125]], [[0, 125]]], cb) {

    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("time-slider-wrapper");
    filterWrapper.id = prefix + "Filter";
    setLimits(0, 125);

    const ht = document.createElement("div");
    ht.classList.add("time-slider__tacticks");
    const at = document.createElement("div");
    at.classList.add("time-slider__tacticks");

    const inputs = document.createElement("div");
    inputs.classList.add("time-slider__inputs");
    const sinput = document.createElement("input");
    sinput.type = "number"; sinput.min = 0; sinput.max = 125; sinput.value = 0;
    sinput.id = prefix + "-start-input";

    const einput = sinput.cloneNode(true);
    einput.id = prefix + "-end-input";
    sinput.addEventListener('change', function (e) {
        e.preventDefault();
        console.log(this.value.this);
        if (+this.value > +filterWrapper.getAttribute("end") - 3) {
            this.value = +filterWrapper.getAttribute("end") - 3;
        }
        start(this.value);
        updateValues();
    })
    einput.addEventListener('change', function (e) {
        e.preventDefault();
        console.log("END  ", this.value);
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
    filterWrapper.appendChild(ht);
    filterWrapper.appendChild(at);
    filterWrapper.appendChild(inputs);

    updateValues();

    // cb(filterWrapper.getAttribute("start"), filterWrapper.getAttribute("end"));

    return filterWrapper;
}