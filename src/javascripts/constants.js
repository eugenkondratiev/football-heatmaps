; const DEFAULT_TV_URL = window.location.origin +"/tv/#/j=1&z=c12345";
// ; const tvurl = "http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c";

const MAX_VALUE = 60;
const MAX_OPACITY = .7;
const MIN_OPACITY = .05;
const POINT_RADIUS = 35;
const MAX_PLAYERS = 18;

const GK_VALUE = .2;

const BALL_RADIUS_KEFF = .67;
const BALL_MAX_KEFF = 0.33;

const BALL_TACTICS_RADIUS_KEFF = 1.1;
const BALL_TACTICS_MAX_KEFF = 0.35;

const TEAM_RADIUS_KEFF = .65;
const TEAM_MAX_KEFF = 1.1;

const HOME = 1;
const AWAY = 2;
const SUB_OUT = 1;
const SUB_IN = 2;
const SHOW = true;
const HIDE = false;
const MIN_MINUTES_FOR_SHOW_TACTIC = 3;

const shotsCoords = { x1: 39, y1: 38, x2: 712, y2: 458 };
const jsonCoords = { x1: 0, y1: 0, x2: 720, y2: 450 };
const hmCoords = { x1: 18.98, y1: 19, x2: 346.56, y2: 229.5 };
const ZONE_WIDTH = (shotsCoords.x2 - shotsCoords.x1) / 6.0;
const ZONE_HEIGHT = (shotsCoords.y2 - shotsCoords.y1) / 3.0;
const ZONES = [...Array(18)].map((_, i) => { return { x: ((i) / 3 >> 0), y: ((i) % 3) } })
const ZONES_COORDS = ZONES.map(z => { return { x: shotsCoords.x1 + z.x * ZONE_WIDTH, y: shotsCoords.y1 + z.y * ZONE_HEIGHT } })
const ZONES_FIND_ORDER = [8,11,5,14,7,10,9,12,2,17,4,6,13,15,1,3,16,18]


const FIELD_LONGTITUDE = 105;
const RE_CENTER_MSG = /разыг|розыг/gi;
const RE_GOAL_LOW_PASS_MSG = /разыг|розыг/gi;

const RE_PASS_FROM_GOALKICK = /пас|переда|смотри/gi;

const RE_LONG_PASS = /авес|аброс|линны/g;
const RE_SCORE_WITH_PENALTIES = /\d+:\d+/g;

const RE_PLAYER_NUMBERS = /[0-9]+/gi;

const MILEAGE_KEFF = FIELD_LONGTITUDE / (hmCoords.x2 - hmCoords.x1);

const SHOT_TOOLTIP = "Удары|В створ|Голы-автоголы   |Блокированные|Каркас"