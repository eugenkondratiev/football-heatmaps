const DEST_PATH = 'public/';
const SRC_PATH = 'src/';

const DEST_FILES_PATH = DEST_PATH + '*';
const CSS_PATH = SRC_PATH + 'stylesheets/';
const JS_PATH = SRC_PATH + 'javascripts/';
const CSS_DEST_PATH = DEST_PATH + 'css/';
const JS_DEST_PATH = DEST_PATH + 'js/hm/';

const cssfiles = [
    CSS_PATH + "loader.css",
    CSS_PATH + "nav.css",
    CSS_PATH + "mainsheet.css",
    CSS_PATH + "players.css",
    CSS_PATH + "hmsheet.css",
    CSS_PATH + "shots.css",
    CSS_PATH + "passes.css",
    CSS_PATH + "style.css",
    CSS_PATH + "sliders.css"
]

const scripts = [
    // JS_PATH + "heatmap.js",
    // JS_PATH + "heatmap.min.js",
    JS_PATH + "constants.js",
    JS_PATH + "init.js",
    JS_PATH + "utils.js",
    JS_PATH + "shots.js",
    JS_PATH + "passes.js",
    JS_PATH + "heatmaps.js",
    JS_PATH + "maps-filtering.js",
    JS_PATH + "events.js",
    JS_PATH + "doubleSlider.js"
]
const HEATMAP_PATH = JS_PATH + "heatmap.js"

const CLEAN_FILES_ARRAY = [
    CSS_DEST_PATH + "hmsheet.min.css",
    JS_DEST_PATH + "hm.js",
    JS_DEST_PATH + "hm2.js",
];

module.exports = {
    HEATMAP_PATH,
    DEST_PATH,
    DEST_FILES_PATH,
    CSS_DEST_PATH,
    JS_DEST_PATH,
    SRC_PATH,
    JS_PATH,
    CSS_PATH,
    cssfiles,
    scripts,
    CLEAN_FILES_ARRAY
}
