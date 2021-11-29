;
const outData = {
  home: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: [],
  },
  away: {
    TacticChanges: [0],
    TacticPoints: [],
    Points: [],
    AvgPoints: [],
    Mileage: [],
    PointsFull: [],
  },
}
const ballPoints = [];
const minutesStarts = [0];

const strangePoints = { home: [], away: [] };
const oldshots = { home: [], away: [] };
const shots = { home: [], away: [] };
let sumInterval = 0;

outData["home"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });
outData["away"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });

const showableTacticks = [];
const oldpasses = [[]];
const passes = [[]];
const passFilter = {
  playersCheckboxes: [],
  start: 0,
  end: 125,
  zoneTo: 0,
  zoneFrom: 0,
  homePlayers: 18,
  awayPlayers: 18,
  high: true,
  head: true,
  ok: true,
  failed: true,
  fighted: true
}

for (let i = 0; i <= MAX_PLAYERS; i++) {
  function createInitTeamsData(team) {
    const _team = team || "home";
    outData[_team].Points.push([]);
    outData[_team].Mileage.push(0);
    outData[_team].AvgPoints.push({ x: 0, y: 0 });
    outData[_team].TacticPoints[0].averages.push([{ x: 0, y: 0 }]);
    outData[_team].PointsFull.push([]);
  }
  createInitTeamsData("home")
  createInitTeamsData("away")
}
for (let i = 1; i <= MAX_PLAYERS * 2; i++) {
  oldpasses.push([]);
  passes.push([]);
  passFilter.playersCheckboxes.push(true)

}
let secondTime = false;
var penalties = false;
