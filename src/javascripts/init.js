;const ballPoints = [];
const minutesStarts = [0];

  const strangePoints = {home: [], away: []};
  const homeTacticChanges = [0];
  const awayTacticChanges = [0];

 const homeTacticPoints = [];
 const awayTacticPoints = [];
 const shots = {home: [], away: []};
let sumInterval = 0;

 homeTacticPoints.push({start:0, end:1, period:0, startPoint:0, endPoint:1, team: [], ball: [], averages:[]});
 awayTacticPoints.push({start:0, end:1, period:0, startPoint:0, endPoint:1, team: [], ball: [], averages:[]});
 const init_HomeTacticPoints = [];
init_HomeTacticPoints.push({start:0, end:1, period:0, team: [], ball: [], averages:[]});


const homePoints = [];
const awayPoints = [];
const homeAvgPoints = [];
const awayAvgPoints = [];
const homeMileage = [];
const awayMileage = [];     

const homePointsFull = [];
const awayPointsFull = [];

for (let i = 0; i <= MAX_PLAYERS ; i++) {
    homePoints.push([]);
    awayPoints.push([]);
    homeMileage.push(0);
    awayMileage.push(0);
    homeAvgPoints.push({x:0, y:0});
    awayAvgPoints.push({x:0, y:0});
    homeTacticPoints[0].averages.push([{x:0, y:0}]);
    awayTacticPoints[0].averages.push([{x:0, y:0}]);

    init_HomeTacticPoints[0].averages.push([{x:0, y:0}]);
    homePointsFull.push([]);
    awayPointsFull.push([]);


}

let secondTime = false;
var penalties = false;
