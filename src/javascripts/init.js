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
const shots = { home: [], away: [] };
let sumInterval = 0;

outData["home"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });
outData["away"].TacticPoints.push({ start: 0, end: 1, period: 0, startPoint: 0, endPoint: 1, team: [], ball: [], averages: [] });

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
}
for (let i = 1; i <= MAX_PLAYERS * 2; i++) {
  passes.push([]);

}
let secondTime = false;
var penalties = false;
