const fs = require('fs');
// const leftTopX = 0;
// const leftTopY = 0;
// const rightBottomX = 367;
// const rightBottomY = 250;

const leftTopX = 10;
const leftTopY = 10;
const rightBottomX = 357;
const rightBottomY = 240;

const jsonX1 = 0;
const jsonY1 = 0;
const jsonX2 = 720;
const jsonY2 = 450;

function limitPoint(point) {
    const x = point.x;
    const y = point.y;
    const newX = Math.floor(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
    const newY = Math.floor(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );
    return { x: newX, y: newY, value: point.value }
}

const js = fs.readFile('jsonreport.json','utf8', (err, data) =>{
    const rep = JSON.parse(data);
    // console.log(rep);
    const game = rep.game;
    game.shift();
    game.pop();
    // console.log(game);
    const ferr = [];
    const allLimits = [];
    let minX = 100000;
    let maxX = 0;
    let minY = 100000;
    let maxY = 0;
    const playerNumber = 1;

    game.forEach(element => {
        let coords;

        

        if (element.coordinates) 
            {
                
                const hometeam = element.coordinates.home;
                hometeam.forEach(pl => {
                    if (!allLimits[pl.n])  {
                        allLimits[pl.n] = {n: pl.n, minX: 100000, minY : 100000, maxX : 0, maxY : 0}
                    }
                    allLimits[pl.n].minX = (pl.w < allLimits[pl.n].minX) ? pl.w : allLimits[pl.n].minX;
                    allLimits[pl.n].minY = (pl.h < allLimits[pl.n].minY) ? pl.h : allLimits[pl.n].minY;
                    allLimits[pl.n].maxX = (pl.w > allLimits[pl.n].maxX) ? pl.w : allLimits[pl.n].maxX;
                    allLimits[pl.n].maxY = (pl.h > allLimits[pl.n].maxY) ? pl.h : allLimits[pl.n].maxY;

                });
                // allLimits.push({n:pl.n, minX:minX, minY:minY, maxX:maxX, maxY:maxY});

                const plCurentCoords = hometeam.filter(pl => (pl.n === playerNumber));
                if (plCurentCoords[0]) {

                    coords = {x: plCurentCoords[0].w, y: plCurentCoords[0].h, value:1};
                    // minX = (coords.x < minX) ? coords.x : minX;
                    // minY = (coords.y < minY) ? coords.y : minY;
                    // maxX = (coords.x > maxX) ? coords.x : maxX;
                    // maxY = (coords.y > maxY) ? coords.y : maxY;
                    ferr.push(limitPoint(coords));
                }
                // coords = plCurentCoords[0];

            }
        
    });


    console.log(ferr);
    allLimits.forEach(el => {
        console.log(`${el.n} :  x = [${el.minX}..${el.maxX}],    y = [${el.minY}..${el.maxY}]`);
    })
    
    // console.log(rep.home.players);

    fs.writeFile('jsontest.json', JSON.stringify(rep, null, " "), err => {if (err) console.log(err)});
    fs.writeFile('data/hm' + playerNumber + '.json', JSON.stringify(ferr, null, " "), err => {if (err) console.log(err)});

});