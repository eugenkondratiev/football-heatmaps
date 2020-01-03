const DEST_PATH = 'public/';
const SRC_PATH = 'src/';

const DEST_FILES_PATH = DEST_PATH + '*';
const CSS_PATH = SRC_PATH + 'stylesheets/';
const JS_PATH = SRC_PATH + 'javascripts/';

const cssfiles = [
    CSS_PATH + "loader.css",
    CSS_PATH + "nav.css",
    CSS_PATH + "mainsheet.css",
    CSS_PATH + "players.css",
    CSS_PATH + "hmsheet.css",
    CSS_PATH + "shots.css",
    CSS_PATH + "style.css"
]

const scripts = [
    JS_PATH + "heatmap.min.js",
    JS_PATH + "constants.js",
    JS_PATH + "init.js",
    JS_PATH + "utils.js",
    JS_PATH + "shots.js",
    JS_PATH + "heatmaps.js"
]

module.exports = {
    DEST_PATH,
    DEST_FILES_PATH,
    SRC_PATH,
    CSS_PATH,
    cssfiles,
    scripts
}
