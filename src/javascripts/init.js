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
// const homeTacticChanges = [0];
// const awayTacticChanges = [0];

// const homeTacticPoints = [];
// const awayTacticPoints = [];
const shots = { home: [], away: [] };
let sumInterval = 0;

outData["home"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });
outData["away"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });

// const init_HomeTacticPoints = [];
// init_HomeTacticPoints.push({ start: 0, end: 1, period: 0, team: [], ball: [], averages: [] });

// const homePoints = [];.
// const awayPoints = [];
// let homeAvgPoints = [];
// let awayAvgPoints = [];
// const homeMileage = [];
// const awayMileage = [];

// const homePointsFull = [];
// const awayPointsFull = [];
const showableTacticks = [];
const passes = [[]];

for (let i = 0; i <= MAX_PLAYERS; i++) {
  function createInitTeamsData(_team = "home") {
    outData[_team].Points.push([]);
    outData[_team].Mileage.push(0);
    outData[_team].AvgPoints.push({ x: 0, y: 0 });
    outData[_team].TacticPoints[0].averages.push([{ x: 0, y: 0 }]);
    outData[_team].PointsFull.push([]);
  }
  createInitTeamsData("home")
  createInitTeamsData("away")

  // awayPoints.push([]);
  // awayMileage.push(0);
  // awayAvgPoints.push({ x: 0, y: 0 });
  // awayTacticPoints[0].averages.push([{ x: 0, y: 0 }]);
  // awayPointsFull.push([]);

  // init_HomeTacticPoints[0].averages.push([{ x: 0, y: 0 }]);

}
for (let i = 1; i <= MAX_PLAYERS * 2; i++) {
  passes.push([]);

}
// passes.pop();
let secondTime = false;
var penalties = false;
