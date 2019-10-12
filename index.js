const playerNumber = 9;
const playerNumber2 = 5;
const MAX_VALUE = 60    ;
const MAX_OPACITY = 0.7;
const MIN_OPACITY = 0.05;
const POINT_RADIUS = 35;

window.onload = function() {

      var xmlhttp = new XMLHttpRequest();
    //   xmlhttp.overrideMimeType("application/json");
      var url = "http://pefl.ru/jsonreport.php?j=1054000&z=79e6bb99a05b83f4490f455cf902e2cb";
      
      xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          const rep = JSON.parse(this.responseText);
            console.log(rep.home.players);
            const leftTopX = 20;
            const leftTopY = 20;
            const rightBottomX = 347;
            const rightBottomY = 230;
            
            const jsonX1 = 0;
            const jsonY1 = 0;
            const jsonX2 = 720;
            const jsonY2 = 450;
            
            function limitPoint(point, secondTime = false) {
                const x = point.x;
                const y = point.y;
                let newX;
                let newY;
                if (secondTime) {
                    newX = Math.floor(rightBottomX - (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                    newY = Math.floor(rightBottomY - (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                } else {
                    newX = Math.floor(leftTopX + (x - jsonX1) * (rightBottomX - leftTopX) / (jsonX2 - jsonX1) );
                    newY = Math.floor(leftTopY + (y - jsonY1) * (rightBottomY - leftTopY) / (jsonY2 - jsonY1) );    
                }

                return { x: newX, y: newY, value: point.value }
            }


            const game = rep.game;
            game.shift();
            game.pop();
            
            // console.log(game);
            const ballPoints = [];
            const ferr = [];
            const ferr2 = [];
            const allLimits = [];

            game.forEach(element => {
                let coords;
                const secondTime = element.minute > 45;

                if (element.coordinates) 
                    {
                        const ball = element.coordinates.ball;
                        const ballcoords = {x: ball.w, y: ball.h, value:1};

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
                        const plCurentCoords2 = hometeam.filter(pl => (pl.n === playerNumber2));

                        if (plCurentCoords[0]) {        
                            coords = {x: plCurentCoords[0].w, y: plCurentCoords[0].h, value:1};
                            ferr.push(limitPoint(coords, secondTime));
                        }
                        if (plCurentCoords2[0]) {        
                            coords = {x: plCurentCoords2[0].w, y: plCurentCoords2[0].h, value:1};
                            ferr2.push(limitPoint(coords, secondTime));
                        }   
                        ballPoints.push(limitPoint(ballcoords, false))
                        // coords = plCurentCoords[0];
                    } 
            });
        
        
            // console.log(ferr);

            allLimits.forEach(el => {
                console.log(`${el.n} :  x = [${el.minX}..${el.maxX}],    y = [${el.minY}..${el.maxY}]`);
            })

          var heatmapInstance = h337.create({
            // only container is required, the rest will be defaults
            container: document.querySelector('#heatmap1'),
            // gradient: {
            //     // enter n keys between 0 and 1 here
            //     // for gradient color customization
            //     '.5': 'blue',
            //     '.8': 'green',
            //     '.95': 'red'
            //   },
              // the maximum opacity (the value with the highest intensity will have it)
            //   blur: 0.4, //Default value: 0.85
                 maxOpacity: MAX_OPACITY,
              // minimum opacity. any value > 0 will produce
              // no transparent gradient transition
                minOpacity: MIN_OPACITY,
            //    opacity: 0.8
             radius: POINT_RADIUS
          });
          var heatmapInstance2 = h337.create({
            container: document.querySelector('#heatmap2'),
            maxOpacity: MAX_OPACITY,
            // minimum opacity. any value > 0 will produce
            // no transparent gradient transition
              minOpacity: MIN_OPACITY,
              radius: POINT_RADIUS / 1.5

          });

          const heatPoints = [
            {
                x: 10,
                y: 10,
                value: 90
            },
            {
                x: 100,
                y: 100,
                value: 50
            },
            {
                x: 200,
                y: 200,
                value: 70
            }
            
               
               
          ];
          const currentHeatPoints = ferr;

          const maximumValue = MAX_VALUE;
    
          // heatmap data format
        var data = {
            max: maximumValue,
            data: currentHeatPoints
        };
    
        heatmapInstance.setData(data);
        heatmapInstance2.setData({
            max: maximumValue / 3,
            data: ballPoints
        });

        allLimits.forEach(el => {
            console.log(`${el.n} :  x = [${el.minX}..${el.maxX}],    y = [${el.minY}..${el.maxY}]`);
        })

          }
      };
      
      xmlhttp.open("GET", url, true);
      xmlhttp.send();  

 

}