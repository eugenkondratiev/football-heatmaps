function showHideAllColoboks(team, n, _tacticPoints){
    const _home =  team || "home";
    const _n = n || 1;
    const tacticPoints = _tacticPoints || homeTacticPoints;

    const _colobokId = _home +"AvgPoints"+ _n;
    const _colobokId2 = "both" + _home + "AvgPoints"+ _n;
  //  console.log(_colobokId, _colobokId2);
/**hpNameDiv.style.fontWeight = n < 12 ? "bold" : "normal"; */
    const _style = document.getElementById(_colobokId).style;
    const _style2 = document.getElementById(_colobokId2).style;
        _style.display = _style.display == "none"? "inherit" : "none";

         _style2.display = _style2.display == "none"  ? "inherit"  : "none";

    if (tacticPoints.length > 1) {
            for (let t = 1; t < tacticPoints.length ; t++) { 
                if (tacticPoints[t].period < MIN_MINUTES_FOR_SHOW_TACTIC) continue;
                const _colobokId = _home +"AvgPoints_"+ t +"_" + _n;

                document.getElementById(_colobokId).style.display = document.getElementById(_colobokId).style.display == "none" 
                ? "inherit"
                : "none";
            }
    }

  };
/**
 * ================================================================================
 */

function showMainAvgPositions() {
    for (let n = 1; n <= MAX_PLAYERS; n++) {
      // for (let n = 1; n < 12; n++) {
      const hp = document.querySelector('#player_default_home').cloneNode(true);
      const ap = document.querySelector('#player_default_away').cloneNode(true);
      ap.id = "awayAvgPoints" + n;
      ap.plId = "aw" + n;
      ap.style.display = n < 12 ? "inherit" : "none";
      ap.style.left = awayAvgPoints[n].x  - 5 + "px";
      ap.style.top = awayAvgPoints[n].y  - 5  + "px";
      const apRow = "awayPlayerList_" + n;
      // const newPlayer = document.createElement('div',{id: apRow});
      let newPlayer = document.createElement('div');
      newPlayer.className = "playerRow";
      newPlayer.id =apRow;
      const apNumDiv = document.createElement('div');
      apNumDiv.innerText = rep.away.players[n - 1].number + ". ";
      apNumDiv.className = "playerListNum";
      const apNameDiv = document.createElement('div');
      apNameDiv.className = "playerListName";
      const apName = document.createElement('a');
      apName.style.fontWeight = n < 12 ? "bold" : "normal";
      apName.id = apRow + '_name';
      apName.innerText =  rep.away.players[n - 1].name;
      apName.href =  '#';
      apName.addEventListener('click', function(e){
        e.preventDefault();

        this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";

        showHideAllColoboks("away", this.id.replace("awayPlayerList_", '').replace("_name", ''), awayTacticPoints);
      });
      if (rep.away.players[n - 1].sub) {
        apName.appendChild(getSubArrow(rep.away.players[n -1].sub)) ;
      }

      apNameDiv.appendChild(apName);

      newPlayer.appendChild(apNumDiv);
      newPlayer.appendChild(apNameDiv);

      const apEye = document.createElement('div');
      apEye.className = "playerListEye";
      apEye.innerText = " ";
      newPlayer.appendChild(apEye);

      const apMileage = document.createElement('div');
      apMileage.className = "playerListMileage";
      apMileage.innerText = Number(awayMileage[n]/ 1000.0).toFixed(2) + " км";
      newPlayer.appendChild(apMileage);

      document.querySelector('#squadAway').appendChild(newPlayer);

      ap.querySelector('.player_number').textContent = rep.away.players[n - 1].number;
      ap.querySelector('.tooltiptext').textContent = rep.away.players[n - 1].name + "    " + rep.away.players[n - 1].number;;
      document.getElementById('heatmapAvgAway').appendChild(ap);
      const apBoth = ap.cloneNode(true);
      apBoth.id = "both" + apBoth.id;
      document.getElementById('heatmapAvgBoth').appendChild(apBoth);
      const apToINdividualHeatmap = ap.cloneNode(true);
      apToINdividualHeatmap.id = apToINdividualHeatmap.id +"_individual";
      // //console.log('#heatmapAway' + n, "     ", document.querySelector('#heatmapAway' + n));
      document.querySelector('#heatmapAway' + n).appendChild(apToINdividualHeatmap);
  
      hp.id = "homeAvgPoints" + n;
      hp.plId = "hm" + n;
      hp.style.display = n < 12 ? "inherit" : "none";
      hp.style.left = homeAvgPoints[n].x  - 5  + "px";
      hp.style.top = homeAvgPoints[n].y  - 5  + "px";
      const hpRow = "homePlayerList_" + n;
      // const newPlayer = document.createElement('div',{id: hpRow});
      const newHomePlayer = document.createElement('div');
      newHomePlayer.id =hpRow;
      newHomePlayer.className = "playerRow";

      const hpNumDiv = document.createElement('div');
      hpNumDiv.innerText = rep.home.players[n - 1].number + ". ";
      hpNumDiv.className = "playerListNum";
      newHomePlayer.appendChild(hpNumDiv);

      const hpNameDiv = document.createElement('div');
      hpNameDiv.className = "playerListName";
      const hpName = document.createElement('a');
      hpName.style.fontWeight = n < 12 ? "bold" : "normal";
      hpName.id = hpRow + '_name';
      hpName.innerText =  rep.home.players[n - 1].name;
      hpName.href =  '#';
      hpName.addEventListener('click', function(e){
        e.preventDefault();
        this.style.fontWeight = this.style.fontWeight == "bold" ? "normal" : "bold";
        showHideAllColoboks("home", this.id.replace("homePlayerList_", '').replace("_name", ''), homeTacticPoints);
      });
      if (rep.home.players[n - 1].sub) {
        hpName.appendChild(getSubArrow(rep.home.players[n -1].sub)) ;
      }

      hpNameDiv.appendChild(hpName);
      newHomePlayer.appendChild(hpNameDiv);

      const hpEye = document.createElement('div');
      hpEye.className = "playerListEye";
      hpEye.innerText = " ";
      newHomePlayer.appendChild(hpEye);

      const hpMileage = document.createElement('div');
      hpMileage.className = "playerListMileage";
      hpMileage.innerText = Number(homeMileage[n]/ 1000.0).toFixed(2) + " км";
      newHomePlayer.appendChild(hpMileage);

      document.querySelector('#squadHome').appendChild(newHomePlayer);
      hp.querySelector('.player_number').textContent = rep.home.players[n - 1].number;
      hp.querySelector('.tooltiptext').textContent = rep.home.players[n - 1].name + "    " + rep.home.players[n - 1].number;
      document.getElementById('heatmapAvgHome').appendChild(hp);
      const hpBoth = hp.cloneNode(true);
      hpBoth.id = "both" + hpBoth.id;
          document.getElementById('heatmapAvgBoth').appendChild(hpBoth);
          const hpToINdividualHeatmap = hp.cloneNode(true);
          hpToINdividualHeatmap.id = hpToINdividualHeatmap.id +"_individual";
          document.querySelector('#heatmapHome' + n).appendChild(hpToINdividualHeatmap);
          //  //console.log('#heatmapHome' + n, "     ", document.querySelector('#heatmapHome' + n));
    }
  }