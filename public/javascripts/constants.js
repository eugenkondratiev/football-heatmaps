const tvurl = "http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c";


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

const MIN_MINUTES_FOR_SHOW_TACTIC = 3;

// const leftTopX = 18.98;
// const leftTopY = 19;
// const rightBottomX = 346.56;
// const rightBottomY = 229.5;

// const jsonX1 = 0;
// const jsonY1 = 0;
// const jsonX2 = 720;
// const jsonY2 = 450;

const shotsCoords = {x1: 39, y1:38, x2:712, y2:458};
const jsonCoords = {x1: 0, y1:0, x2:720, y2:450};
const hmCoords = {x1: 18.98, y1:19, x2:346.56, y2:229.5};

const FIELD_LONGTITUDE = 105;

const MILEAGE_KEFF = FIELD_LONGTITUDE / (hmCoords.x2 - hmCoords.x1) ;
// const MILEAGE_KEFF = FIELD_LONGTITUDE / (rightBottomX - leftTopX) ;
