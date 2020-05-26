/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2016-09-05 01:16
 */
(function(a,b,c){if(typeof module!=="undefined"&&module.exports){module.exports=c()}else if(typeof define==="function"&&define.amd){define(c)}else{b[a]=c()}})("h337",this,function(){var a={defaultRadius:40,defaultRenderer:"canvas2d",defaultGradient:{.25:"rgb(0,0,255)",.55:"rgb(0,255,0)",.85:"yellow",1:"rgb(255,0,0)"},defaultMaxOpacity:1,defaultMinOpacity:0,defaultBlur:.85,defaultXField:"x",defaultYField:"y",defaultValueField:"value",plugins:{}};var b=function h(){var b=function d(a){this._coordinator={};this._data=[];this._radi=[];this._min=10;this._max=1;this._xField=a["xField"]||a.defaultXField;this._yField=a["yField"]||a.defaultYField;this._valueField=a["valueField"]||a.defaultValueField;if(a["radius"]){this._cfgRadius=a["radius"]}};var c=a.defaultRadius;b.prototype={_organiseData:function(a,b){var d=a[this._xField];var e=a[this._yField];var f=this._radi;var g=this._data;var h=this._max;var i=this._min;var j=a[this._valueField]||1;var k=a.radius||this._cfgRadius||c;if(!g[d]){g[d]=[];f[d]=[]}if(!g[d][e]){g[d][e]=j;f[d][e]=k}else{g[d][e]+=j}var l=g[d][e];if(l>h){if(!b){this._max=l}else{this.setDataMax(l)}return false}else if(l<i){if(!b){this._min=l}else{this.setDataMin(l)}return false}else{return{x:d,y:e,value:j,radius:k,min:i,max:h}}},_unOrganizeData:function(){var a=[];var b=this._data;var c=this._radi;for(var d in b){for(var e in b[d]){a.push({x:d,y:e,radius:c[d][e],value:b[d][e]})}}return{min:this._min,max:this._max,data:a}},_onExtremaChange:function(){this._coordinator.emit("extremachange",{min:this._min,max:this._max})},addData:function(){if(arguments[0].length>0){var a=arguments[0];var b=a.length;while(b--){this.addData.call(this,a[b])}}else{var c=this._organiseData(arguments[0],true);if(c){if(this._data.length===0){this._min=this._max=c.value}this._coordinator.emit("renderpartial",{min:this._min,max:this._max,data:[c]})}}return this},setData:function(a){var b=a.data;var c=b.length;this._data=[];this._radi=[];for(var d=0;d<c;d++){this._organiseData(b[d],false)}this._max=a.max;this._min=a.min||0;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},removeData:function(){},setDataMax:function(a){this._max=a;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},setDataMin:function(a){this._min=a;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},setCoordinator:function(a){this._coordinator=a},_getInternalData:function(){return{max:this._max,min:this._min,data:this._data,radi:this._radi}},getData:function(){return this._unOrganizeData()}};return b}();var c=function i(){var a=function(a){var b=a.gradient||a.defaultGradient;var c=document.createElement("canvas");var d=c.getContext("2d");c.width=256;c.height=1;var e=d.createLinearGradient(0,0,256,1);for(var f in b){e.addColorStop(f,b[f])}d.fillStyle=e;d.fillRect(0,0,256,1);return d.getImageData(0,0,256,1).data};var b=function(a,b){var c=document.createElement("canvas");var d=c.getContext("2d");var e=a;var f=a;c.width=c.height=a*2;if(b==1){d.beginPath();d.arc(e,f,a,0,2*Math.PI,false);d.fillStyle="rgba(0,0,0,1)";d.fill()}else{var g=d.createRadialGradient(e,f,a*b,e,f,a);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=g;d.fillRect(0,0,2*a,2*a)}return c};var c=function(a){var b=[];var c=a.min;var d=a.max;var e=a.radi;var a=a.data;var f=Object.keys(a);var g=f.length;while(g--){var h=f[g];var i=Object.keys(a[h]);var j=i.length;while(j--){var k=i[j];var l=a[h][k];var m=e[h][k];b.push({x:h,y:k,value:l,radius:m})}}return{min:c,max:d,data:b}};function d(b){var c=b.container;var d=this.shadowCanvas=document.createElement("canvas");var e=this.canvas=b.canvas||document.createElement("canvas");var f=this._renderBoundaries=[1e4,1e4,0,0];var g=getComputedStyle(b.container)||{};e.className="heatmap-canvas";this._width=e.width=d.width=b.width||+g.width.replace(/px/,"");this._height=e.height=d.height=b.height||+g.height.replace(/px/,"");this.shadowCtx=d.getContext("2d");this.ctx=e.getContext("2d");e.style.cssText=d.style.cssText="position:absolute;left:0;top:0;";c.style.position="relative";c.appendChild(e);this._palette=a(b);this._templates={};this._setStyles(b)}d.prototype={renderPartial:function(a){if(a.data.length>0){this._drawAlpha(a);this._colorize()}},renderAll:function(a){this._clear();if(a.data.length>0){this._drawAlpha(c(a));this._colorize()}},_updateGradient:function(b){this._palette=a(b)},updateConfig:function(a){if(a["gradient"]){this._updateGradient(a)}this._setStyles(a)},setDimensions:function(a,b){this._width=a;this._height=b;this.canvas.width=this.shadowCanvas.width=a;this.canvas.height=this.shadowCanvas.height=b},_clear:function(){this.shadowCtx.clearRect(0,0,this._width,this._height);this.ctx.clearRect(0,0,this._width,this._height)},_setStyles:function(a){this._blur=a.blur==0?0:a.blur||a.defaultBlur;if(a.backgroundColor){this.canvas.style.backgroundColor=a.backgroundColor}this._width=this.canvas.width=this.shadowCanvas.width=a.width||this._width;this._height=this.canvas.height=this.shadowCanvas.height=a.height||this._height;this._opacity=(a.opacity||0)*255;this._maxOpacity=(a.maxOpacity||a.defaultMaxOpacity)*255;this._minOpacity=(a.minOpacity||a.defaultMinOpacity)*255;this._useGradientOpacity=!!a.useGradientOpacity},_drawAlpha:function(a){var c=this._min=a.min;var d=this._max=a.max;var a=a.data||[];var e=a.length;var f=1-this._blur;while(e--){var g=a[e];var h=g.x;var i=g.y;var j=g.radius;var k=Math.min(g.value,d);var l=h-j;var m=i-j;var n=this.shadowCtx;var o;if(!this._templates[j]){this._templates[j]=o=b(j,f)}else{o=this._templates[j]}var p=(k-c)/(d-c);n.globalAlpha=p<.01?.01:p;n.drawImage(o,l,m);if(l<this._renderBoundaries[0]){this._renderBoundaries[0]=l}if(m<this._renderBoundaries[1]){this._renderBoundaries[1]=m}if(l+2*j>this._renderBoundaries[2]){this._renderBoundaries[2]=l+2*j}if(m+2*j>this._renderBoundaries[3]){this._renderBoundaries[3]=m+2*j}}},_colorize:function(){var a=this._renderBoundaries[0];var b=this._renderBoundaries[1];var c=this._renderBoundaries[2]-a;var d=this._renderBoundaries[3]-b;var e=this._width;var f=this._height;var g=this._opacity;var h=this._maxOpacity;var i=this._minOpacity;var j=this._useGradientOpacity;if(a<0){a=0}if(b<0){b=0}if(a+c>e){c=e-a}if(b+d>f){d=f-b}var k=this.shadowCtx.getImageData(a,b,c,d);var l=k.data;var m=l.length;var n=this._palette;for(var o=3;o<m;o+=4){var p=l[o];var q=p*4;if(!q){continue}var r;if(g>0){r=g}else{if(p<h){if(p<i){r=i}else{r=p}}else{r=h}}l[o-3]=n[q];l[o-2]=n[q+1];l[o-1]=n[q+2];l[o]=j?n[q+3]:r}k.data=l;this.ctx.putImageData(k,a,b);this._renderBoundaries=[1e3,1e3,0,0]},getValueAt:function(a){var b;var c=this.shadowCtx;var d=c.getImageData(a.x,a.y,1,1);var e=d.data[3];var f=this._max;var g=this._min;b=Math.abs(f-g)*(e/255)>>0;return b},getDataURL:function(){return this.canvas.toDataURL()}};return d}();var d=function j(){var b=false;if(a["defaultRenderer"]==="canvas2d"){b=c}return b}();var e={merge:function(){var a={};var b=arguments.length;for(var c=0;c<b;c++){var d=arguments[c];for(var e in d){a[e]=d[e]}}return a}};var f=function k(){var c=function h(){function a(){this.cStore={}}a.prototype={on:function(a,b,c){var d=this.cStore;if(!d[a]){d[a]=[]}d[a].push(function(a){return b.call(c,a)})},emit:function(a,b){var c=this.cStore;if(c[a]){var d=c[a].length;for(var e=0;e<d;e++){var f=c[a][e];f(b)}}}};return a}();var f=function(a){var b=a._renderer;var c=a._coordinator;var d=a._store;c.on("renderpartial",b.renderPartial,b);c.on("renderall",b.renderAll,b);c.on("extremachange",function(b){a._config.onExtremaChange&&a._config.onExtremaChange({min:b.min,max:b.max,gradient:a._config["gradient"]||a._config["defaultGradient"]})});d.setCoordinator(c)};function g(){var g=this._config=e.merge(a,arguments[0]||{});this._coordinator=new c;if(g["plugin"]){var h=g["plugin"];if(!a.plugins[h]){throw new Error("Plugin '"+h+"' not found. Maybe it was not registered.")}else{var i=a.plugins[h];this._renderer=new i.renderer(g);this._store=new i.store(g)}}else{this._renderer=new d(g);this._store=new b(g)}f(this)}g.prototype={addData:function(){this._store.addData.apply(this._store,arguments);return this},removeData:function(){this._store.removeData&&this._store.removeData.apply(this._store,arguments);return this},setData:function(){this._store.setData.apply(this._store,arguments);return this},setDataMax:function(){this._store.setDataMax.apply(this._store,arguments);return this},setDataMin:function(){this._store.setDataMin.apply(this._store,arguments);return this},configure:function(a){this._config=e.merge(this._config,a);this._renderer.updateConfig(this._config);this._coordinator.emit("renderall",this._store._getInternalData());return this},repaint:function(){this._coordinator.emit("renderall",this._store._getInternalData());return this},getData:function(){return this._store.getData()},getDataURL:function(){return this._renderer.getDataURL()},getValueAt:function(a){if(this._store.getValueAt){return this._store.getValueAt(a)}else if(this._renderer.getValueAt){return this._renderer.getValueAt(a)}else{return null}}};return g}();var g={create:function(a){return new f(a)},register:function(b,c){a.plugins[b]=c}};return g});
const tvurl="http://pefl.ru/tv/#/j=1099079&z=c3121c566116e3f04f0fba27f99d502c",MAX_VALUE=60,MAX_OPACITY=.7,MIN_OPACITY=.05,POINT_RADIUS=35,MAX_PLAYERS=18,GK_VALUE=.2,BALL_RADIUS_KEFF=.67,BALL_MAX_KEFF=.33,BALL_TACTICS_RADIUS_KEFF=1.1,BALL_TACTICS_MAX_KEFF=.35,TEAM_RADIUS_KEFF=.65,TEAM_MAX_KEFF=1.1,HOME=1,AWAY=2,SUB_OUT=1,SUB_IN=2,SHOW=!0,HIDE=!1,MIN_MINUTES_FOR_SHOW_TACTIC=3,shotsCoords={x1:39,y1:38,x2:712,y2:458},jsonCoords={x1:0,y1:0,x2:720,y2:450},hmCoords={x1:18.98,y1:19,x2:346.56,y2:229.5},FIELD_LONGTITUDE=105,MILEAGE_KEFF=105/(hmCoords.x2-hmCoords.x1),SHOT_TOOLTIP="Удары|В створ|Голы-автоголы   |Блокированные|Каркас";
const ballPoints=[],minutesStarts=[0],strangePoints={home:[],away:[]},homeTacticChanges=[0],awayTacticChanges=[0],homeTacticPoints=[],awayTacticPoints=[],shots={home:[],away:[]};let sumInterval=0;homeTacticPoints.push({start:0,end:1,period:0,startPoint:0,endPoint:1,team:[],ball:[],averages:[]}),awayTacticPoints.push({start:0,end:1,period:0,startPoint:0,endPoint:1,team:[],ball:[],averages:[]});const init_HomeTacticPoints=[];init_HomeTacticPoints.push({start:0,end:1,period:0,team:[],ball:[],averages:[]});const homePoints=[],awayPoints=[],homeAvgPoints=[],awayAvgPoints=[],homeMileage=[],awayMileage=[],homePointsFull=[],awayPointsFull=[],showableTacticks=[];for(let a=0;a<=MAX_PLAYERS;a++)homePoints.push([]),awayPoints.push([]),homeMileage.push(0),awayMileage.push(0),homeAvgPoints.push({x:0,y:0}),awayAvgPoints.push({x:0,y:0}),homeTacticPoints[0].averages.push([{x:0,y:0}]),awayTacticPoints[0].averages.push([{x:0,y:0}]),init_HomeTacticPoints[0].averages.push([{x:0,y:0}]),homePointsFull.push([]),awayPointsFull.push([]);let secondTime=!1;var penalties=!1;
const JSON_URL_START="http://pefl.ru/jsonreport.php";function formJsonUrl(t){const n=window.location.href.match(/j\=\d+\&z\=.+/i)?window.location.href:t,e=n.indexOf("&z="),r=n.indexOf("j=");return JSON_URL_START+`?j=${n.substring(2+r,e)}&z=${n.substring(3+e)}`}function limitPoint(t,n=!1,e=hmCoords,r=jsonCoords){const o=t.x,i=t.y;let u,c;return n?(u=Math.round(e.x2-(o-r.x1)*(e.x2-e.x1)/(r.x2-r.x1)),c=Math.round(e.y2-(i-r.y1)*(e.y2-e.y1)/(r.y2-r.y1))):(u=Math.round(e.x1+(o-r.x1)*(e.x2-e.x1)/(r.x2-r.x1)),c=Math.round(e.y1+(i-r.y1)*(e.y2-e.y1)/(r.y2-r.y1))),{x:u,y:c,value:t.value}}function getSegmentLength(t,n){const e=n.x-t.x,r=n.y-t.y;return Math.sqrt(e*e+r*r)}function getSegmentAngle(t,n){const e=n.x-t.x,r=n.y-t.y;return(e<0?r<0?-180:180:0)+180*Math.atan(r/e)/Math.PI}function getMileage(t,n){return MILEAGE_KEFF*getSegmentLength(t,n)}function leaveValuablePoints(t){return t.filter(t=>!t)}function getPointsSet(t,n,e){return t.slice(n,e)}function clearPoint(t){return t.filter(t=>null!=t)}function getSubArrow(t){const n=(t||SUB_OUT)==SUB_OUT?"http://pefl.ru/system/img/gm/out.gif":"http://pefl.ru/system/img/gm/in.gif",e=document.createElement("img");return e.src=n,e}function createEye(t){const n=document.createElement("img");n.src="http://pefl.ru/images/eye.png",n.alt="";const e=document.createElement("div");return e.className="tooltiptext",e.innerText=t,n.appendChild(e),n}
function createShotLine(t,e,o){const n=document.createElement("div");return n.classList.add("shotline"),n.style.top=t.startpoint.y-1+"px",n.style.left=t.startpoint.x-1+"px",n.style.width=getSegmentLength(t.startpoint,t.endpoint)+"px",n.style.transform="rotate("+getSegmentAngle(t.startpoint,t.endpoint)+"deg)",n.style.borderTopColor=o,n}function createShotStart(t,e,o){const n=document.createElement("div");n.classList.add("shotstart"),n.style.borderColor=o,n.style.backgroundColor=o,n.style.top=t.startpoint.y-5+"px",n.style.left=t.startpoint.x-5+"px";const s="G"==t.type?"Гол":"V"==t.type?"Удар в створ":"W"==t.type?"Автогол":"Block"==t.type?"Блок":"B"==t.type?"Каркас ворот":"Мимо";return n.addEventListener("mouseenter",(function(o){const n=document.querySelector("#one-shot-legend"),l=" Минута "+t.minute+", "+s+",\n\r "+t.player+"."+e.playerName;n.textContent=l,n.style.display="inline-block"})),n.addEventListener("mouseleave",(function(t){document.querySelector("#one-shot-legend").style.display="none"})),n}function createShotEnd(t,e,o){const n=document.createElement("div");return n.classList.add("shotend"),n.style.borderColor=o,n.style.backgroundColor=o,n.style.top=t.endpoint.y-2+"px",n.style.left=t.endpoint.x-1+"px",n}function createShot(t,e){const o="G"==t.type?"red":"V"==t.type?"yellow":"Block"==t.type?"black":"B"==t.type?"black":"W"==t.type?"darkkhaki":"blue",n=document.createElement("div");n.classList.add("shot");const s=e.team+"Shot";return n.classList.add(s),n.setAttribute("player",t.player),n.setAttribute("shotType",t.type),n.setAttribute("minute",t.minute),n.appendChild(createShotLine(t,e,o)),n.appendChild(createShotEnd(t,e,o)),n.appendChild(createShotStart(t,e,o)),n}function drawTeamShots(t,e,o,n){t.forEach((t,n)=>{const s={playerName:e[t.player-1].name,team:o};document.querySelector("#chalkboard").appendChild(createShot(t,s))})}function countShot(t,e){if("U"==t){if(!e.miss)return void(e.miss=1);e.miss++}if("G"==t){if(!e.goals)return void(e.goals=1);e.goals++}if("B"==t){if(!e.bar)return void(e.bar=1);e.bar++}if("Block"==t){if(!e.block)return void(e.block=1);e.block++}if("V"==t){if(!e.stvor)return void(e.stvor=1);e.stvor++}if("W"==t){if(!e.autogoals)return void(e.autogoals=1);e.autogoals++}}function formShotsString(t){const e=t.autogoals?""+-parseInt(t.autogoals):"",o=t.goals?parseInt(t.goals):0,n=o+(t.stvor?parseInt(t.stvor):0),s=n+(t.miss?parseInt(t.miss):0),l="|"+o+e,i=t.bar?"|"+parseInt(t.bar):" ",r=t.block?"|"+parseInt(t.block):" ";return s+i+r==0&&""==e?" ":0==s?"        "+e+r+i:(s>9?s:" "+s)+"|"+n+l+" "+r+i}function displayAllShots(t,e,o=!0){const n="."+e+"Shot";document.querySelectorAll(n).forEach(n=>{const s=document.querySelector("#"+e+"-player-list_"+n.getAttribute("player")+" input");let l=!!s&&s.checked;n.style.display=t?"block":l&&!o?"block":"none"})}function filterShotsByTime(t,e){document.querySelectorAll("[class$=Shot]").forEach(o=>{const n=+o.getAttribute("minute"),s=n>=+t&&n<=+e;o.style.display=s?"block":"none"})}function changeCheckboxCount(t=-1,e="home"){const o=document.querySelectorAll(".shots-container-wrapper")[0];let n=parseInt("home"==e?o.getAttribute("data-homes"):o.getAttribute("data-aways"));return-1==t?n--:n++,n<0&&(n=0),"home"==e?o.setAttribute("data-homes",n):o.setAttribute("data-aways",n),n}function createShotCheckbox(t){const e=document.createElement("input");return e.type="checkbox",e.checked=!1,e.style.cursor="pointer",e.addEventListener("click",(function(e){this.checked?(changeCheckboxCount(1,t.team),displayAllShots(!1,t.team,!1)):0==changeCheckboxCount(-1,t.team)?displayAllShots(!0,t.team):displayAllShots(!1,t.team,!1)})),e}function changeVisibilityByType(t){t.preventDefault();const e=this.getAttribute("data-type"),o=".shot[shottype="+e+"]",n="bold"==this.style.fontWeight;document.querySelectorAll(o).forEach(t=>{t.style.display=n?"none":"block"}),"G"==e&&document.querySelectorAll(".shot[shottype=W]").forEach(t=>{t.style.display=n?"none":"block"}),this.style.fontWeight=n?"normal":"bold"}const fGoals=document.getElementById("filterGoals");fGoals.addEventListener("click",changeVisibilityByType.bind(fGoals));const fStvor=document.getElementById("filterStvor");fStvor.addEventListener("click",changeVisibilityByType.bind(fStvor));const fMiss=document.getElementById("filterMiss");fMiss.addEventListener("click",changeVisibilityByType.bind(fMiss));const fBars=document.getElementById("filterBars");fBars.addEventListener("click",changeVisibilityByType.bind(fBars));const fBlocks=document.getElementById("filterBlocks");function showAllShots(){displayAllShots(!0,"home"),displayAllShots(!0,"away"),document.querySelectorAll(".squadAndShots-containers-wrapper input[type=checkbox]").forEach(t=>{t.checked=!1});const t=document.getElementById("shots-time-filter");console.log(),t.setAttribute("start",0),t.setAttribute("end",125),t.dispatchEvent(new Event("change",{bubbles:!0}))}fBlocks.addEventListener("click",changeVisibilityByType.bind(fBlocks)),document.getElementsByClassName("shots-container")[0].addEventListener("click",(function(t){showAllShots()})),document.getElementById("filter-show-all").addEventListener("click",(function(t){t.preventDefault(),showAllShots()}));
function createHeatMap(e,t,a){}let startTime=Date.now();window.onload=function(){var e=new XMLHttpRequest;e.overrideMimeType("application/json"),e.onreadystatechange=function(){if(this.readyState==this.OPENED&&e.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01"),4==this.readyState){if(200==this.status){const e=this.responseText.match(/\d+:\d+/g),i=e?e.pop():["0:0"],c=JSON.parse(this.responseText);function t(){const e=document.querySelector("#player_default_away .player_shape").style,t=document.querySelector("#player_default_home .player_shape").style;e.backgroundColor="#"+c.away.team.back,e.borderColor="#"+c.away.team.color,e.color="#"+c.away.team.color,t.color="#"+c.home.team.color,t.borderColor="#"+c.home.team.color,t.backgroundColor="#"+c.home.team.back}t();const l=c.game;l.shift(),l.pop();let r="0:0";try{l.forEach((e,t,a)=>{if(e.interval&&(sumInterval+=parseInt(e.interval)),minutesStarts[e.minute]||(minutesStarts[e.minute]=homePoints[1].length),e.S&&(1==e.S.team?(c.home.players[e.S.in-1].sub=SUB_IN,c.home.players[e.S.out-1].sub=SUB_OUT):(c.away.players[e.S.in-1].sub=SUB_IN,c.away.players[e.S.out-1].sub=SUB_OUT)),e.messages[0]&&(e.messages.forEach(e=>{e.mes.indexOf(" СЧЕТ ")>-1&&(r=e.mes.replace(" СЧЕТ ",""))}),"Серия пенальти!..."==e.messages[0].mes||"Матч переходит к послематчевым одиннадцатиметровым!..."==e.messages[0].mes||"Назначаются послематчевые пенальти!..."==e.messages[0].mes))throw penalties=!0,"Серия пенальти!...";if(e.ZT)if(1==e.ZT.team){homeTacticPoints[0].end=e.minute,homeTacticPoints[0].period=e.minute-homeTacticPoints[0].start,homeTacticPoints.push(homeTacticPoints[0]),homeTacticPoints[0]={start:e.minute,end:125,period:125-e.minute,team:[],ball:[],averages:[]};for(let e=0;e<=MAX_PLAYERS;e++)homeTacticPoints[0].averages.push([{x:0,y:0}]);homeTacticChanges.push(homePoints[0].length)}else{awayTacticPoints[0].end=e.minute,awayTacticPoints[0].period=e.minute-awayTacticPoints[0].start,awayTacticPoints.push(awayTacticPoints[0]),awayTacticPoints[0]={start:e.minute,end:125,period:125-e.minute,team:[],ball:[],averages:[]},awayTacticChanges.push(awayPoints[0].length);for(let e=0;e<=MAX_PLAYERS;e++)awayTacticPoints[0].averages.push([{x:0,y:0}])}let o;try{if((e.U||e.W)&&!penalties){const o=e.coordinates.ball,n={x:o.w,y:o.h,value:1},s=e.G?"G":e.V?"V":e.W?"W":e.B?"B":e.U.team>2?"Block":"U",i=a[t-1].messages.length>0&&a[t-1].coordinates?a[t-1].coordinates.ball:a[t-2].messages.length>0&&a[t-2].coordinates?a[t-2].coordinates.ball:a[t-3].messages.length>0&&a[t-3].coordinates?a[t-3].coordinates.ball:a[t-4].coordinates.ball,c={x:i.w,y:i.h,value:1},l={endpoint:limitPoint(n,secondTime,shotsCoords,jsonCoords),startpoint:limitPoint(c,secondTime,shotsCoords,jsonCoords),episode:t,type:s,minute:e.minute,player:e.U?e.U.player:e.W.player};e.U&&(1==e.U.team||3==e.U.team)||e.W&&(2==e.W.team||4==e.W.team)?shots.home.push(l):shots.away.push(l)}if((e.G||e.V||e.B)&&!e.U){const o=e.coordinates.ball;console.log("goal event in next episode -  min=",e.minute," U=",e.U," W=",e.W," V=",e.V," G=",e.G," B=",e.B,o);const n={x:o.w,y:o.h,value:1},s=limitPoint(n,secondTime,shotsCoords,jsonCoords);let i;i=e.G&&(1==e.G.team||3==e.G.team)||e.V&&(1==e.V.team||3==e.V.team)||e.B&&(1==e.B.team||3==e.B.team)?shots.home[shots.home.length-1]:shots.away[shots.away.length-1],a[t-1].messages.length>0&&a[t-1].messages.some(e=>e.mes.match(/авес|аброс|линны/g))&&(i.startpoint=i.endpoint),i.type=e.G?"G":e.V?"V":"B",i.endpoint=s,i.player=e.G?e.G.player:e.V?e.V.player:e.B.player}}catch(o){console.log("Что то не так с обсчетом удара",e.minute,e.n,o),console.log(e,a[t-1],a[t-2])}function n(e,t){for(let a=1;a<=MAX_PLAYERS;a++)e[a].push(t[a])}if(e.M&&(secondTime=!secondTime),e.coordinates){const t=e.coordinates.ball,a={x:t.w,y:t.h,value:1},s=e.coordinates.home,i=e.coordinates.away,c=[],l=[];for(let e=0;e<=MAX_PLAYERS;e++)c.push(null),l.push(null);s.forEach(e=>{if(o=1==e.n?{x:e.w,y:e.h,value:GK_VALUE}:{x:e.w,y:e.h,value:1},e.n<=MAX_PLAYERS){const t=limitPoint(o,secondTime);if(homePoints[e.n].push(t),homePoints[0].push(t),homeTacticPoints[0].team.push(t),homeTacticPoints[0].averages[e.n].push(t),homePoints[e.n].length>1){const t=homePoints[e.n].length-1;homeMileage[e.n]+=getMileage(homePoints[e.n][t],homePoints[e.n][t-1])}c[e.n]=t}else strangePoints.home.push(e)}),i.forEach(e=>{if(o=1==e.n?{x:e.w,y:e.h,value:GK_VALUE}:{x:e.w,y:e.h,value:1},e.n<=MAX_PLAYERS){const t=limitPoint(o,!secondTime);if(awayPoints[e.n].push(t),awayPoints[0].push(t),awayTacticPoints[0].team.push(t),awayTacticPoints[0].averages[e.n].push(t),awayPoints[e.n].length>1){const t=awayPoints[e.n].length-1;awayMileage[e.n]+=getMileage(awayPoints[e.n][t],awayPoints[e.n][t-1])}l[e.n]=t}else strangePoints.away.push(e)});const r=limitPoint(a,secondTime);ballPoints.push(r),homeTacticPoints[0].ball.push(r),awayTacticPoints[0].ball.push(r),n(homePointsFull,c),n(awayPointsFull,l)}})}catch(e){console.log("game.forEach ",e)}homeTacticPoints.push(homeTacticPoints[0]),awayTacticPoints.push(awayTacticPoints[0]);const m=r+(i==r?"":`(${function(e,t){const a=e.split(":"),o=t.split(":");return`${o[0]-a[0]}:${o[1]-a[1]}`}(r,i)})`),h=c.date+". "+(c.stadium.city?c.stadium.city+". ":"")+c.stadium.name+". "+c.home.team.name+" - "+c.away.team.name+" "+m;function a(e,t=TEAM_RADIUS_KEFF,a=MIN_OPACITY,o=MAX_OPACITY){return h337.create({container:document.querySelector(e),maxOpacity:o,minOpacity:a,radius:POINT_RADIUS*t})}document.querySelector("#game-info").textContent=h,shots.home.forEach(e=>{countShot(e.type,c.home.players[e.player-1])}),shots.away.forEach(e=>{countShot(e.type,c.away.players[e.player-1])});const y=a("#heatmap-home"),d=a("#heatmap-away"),p=a("#heatmap-ball",BALL_RADIUS_KEFF),u=a("#heatmap-avgHome"),P=a("#heatmap-avgAway"),T=a("#chalkboard"),w=a("#heatmap-avgBoth"),_=[{x:19,y:19,value:1,radius:1},{x:346.56,y:229.5,value:200,radius:1},{x:19,y:229.5,value:1,radius:1},{x:346.56,y:19,value:1,radius:1}],g=MAX_VALUE,S={max:g*TEAM_MAX_KEFF,data:homePoints[0]},A={max:g*TEAM_MAX_KEFF,data:_};if(y.setData(S),d.setData({max:g*TEAM_MAX_KEFF,data:awayPoints[0]}),p.setData({max:g*BALL_MAX_KEFF,data:ballPoints}),u.setData(A),P.setData(A),T.setData(A),w.setData(A),document.querySelector("#home-tacticks-heatmaps + .bojan__label > .bojan__label__header").textContent="Смены тактик "+c.home.team.name,homeTacticPoints.length>1)for(let e=1;e<homeTacticPoints.length;e++){if(homeTacticPoints[e].period<MIN_MINUTES_FOR_SHOW_TACTIC)continue;homeTacticPoints[e].rankByMinutes=[],homeTacticPoints[e].averages.forEach((t,a)=>{const o=t.length;homeTacticPoints[e].rankByMinutes[a]=[a,o],0===a||o<2||t.forEach((e,a,n)=>{t[0].x+=e.x/o,t[0].y+=e.y/o})}),homeTacticPoints[e].rankByMinutes.sort((e,t)=>t[1]-e[1]);const t=document.getElementsByClassName("heatmap2-containers-wrapper")[0].cloneNode(!0),o="#heatmap-tactichome"+e,n="#heatmap-ballhome"+e,s=(homeTacticPoints[e].start>0?"от "+homeTacticPoints[e].start:"")+" "+(homeTacticPoints[e].end<125?"до "+homeTacticPoints[e].end:"")+".  "+c.home.team.name;t.querySelector("#heatmap-home").id="heatmap-tactichome"+e,t.querySelector(o+" > div").textContent="Игроки "+s,t.querySelector("#heatmap-away").id="heatmap-ballhome"+e,t.querySelector(n+" > div").textContent="Мяч "+s,document.querySelector("#home-tacticks-heatmaps ~ .bojan__content").appendChild(t);const i=document.getElementsByClassName("heatmap-container-wrapper")[1].cloneNode(!0);i.className="heatmap-container-wrapper",t.className="heatmap3-containers-wrapper",i.querySelector(".heatmap-container").id="avgPositionsHome"+e,i.querySelector(".heatmap-container > div").textContent="Ср.поз."+s,t.appendChild(i);for(let t=1;t<=MAX_PLAYERS;t++){const a=document.querySelector("#player_default_home").cloneNode(!0);a.id="homeAvgPoints_"+e+"_"+t;const o=homeTacticPoints[e].rankByMinutes;a.style.display=o.indexOf(o.find(e=>e[0]==t))<11?"inherit":"none",a.style.left=homeTacticPoints[e].averages[t][0].x-5+"px",a.style.top=homeTacticPoints[e].averages[t][0].y-5+"px",a.querySelector(".player_number").textContent=c.home.players[t-1].number,a.querySelector(".tooltiptext").textContent=c.home.players[t-1].name+"    "+c.home.players[t-1].number,document.querySelector("#avgPositionsHome"+e).appendChild(a)}a("#avgPositionsHome"+e).setData(A),h337.create({container:document.querySelector(o),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS}).setData({max:g,data:homeTacticPoints[e].team}),h337.create({container:document.querySelector(n),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS*BALL_RADIUS_KEFF*BALL_TACTICS_RADIUS_KEFF}).setData({max:g*BALL_MAX_KEFF*BALL_TACTICS_MAX_KEFF,data:homeTacticPoints[e].ball})}if(document.querySelector("#away-tacticks-heatmaps + .bojan__label .bojan__label__header").textContent="Смены тактик "+c.away.team.name,awayTacticPoints.length>1)for(let e=1;e<awayTacticPoints.length;e++){if(awayTacticPoints[e].period<MIN_MINUTES_FOR_SHOW_TACTIC)continue;awayTacticPoints[e].rankByMinutes=[],awayTacticPoints[e].averages.forEach((t,a)=>{const o=t.length;awayTacticPoints[e].rankByMinutes[a]=[a,o],0===a||o<2||t.forEach((e,a,n)=>{t[0].x+=e.x/o,t[0].y+=e.y/o})}),awayTacticPoints[e].rankByMinutes.sort((e,t)=>t[1]-e[1]);const t=document.getElementsByClassName("heatmap2-containers-wrapper")[0].cloneNode(!0),a="#heatmap-tacticaway"+e,o="#heatmap-ballaway"+e,n=(awayTacticPoints[e].start>0?"от "+awayTacticPoints[e].start:"")+" "+(awayTacticPoints[e].end<125?"до "+awayTacticPoints[e].end:"")+".  "+c.away.team.name;t.querySelector("#heatmap-home").id="heatmap-tacticaway"+e,t.querySelector(a+" > div").textContent="Игроки "+n,t.querySelector("#heatmap-away").id="heatmap-ballaway"+e,t.querySelector(o+" > div").textContent="Мяч "+n,document.querySelector("#away-tacticks-heatmaps ~ .bojan__content").appendChild(t);const s=document.getElementsByClassName("heatmap-container-wrapper")[1].cloneNode(!0);s.className="heatmap-container-wrapper",t.className="heatmap3-containers-wrapper",s.querySelector(".heatmap-container").id="avgPositionsAway"+e,s.querySelector(".heatmap-container > div").textContent="Ср.поз."+n,t.appendChild(s);for(let t=1;t<=MAX_PLAYERS;t++){const a=document.querySelector("#player_default_away").cloneNode(!0);a.id="awayAvgPoints_"+e+"_"+t;const o=awayTacticPoints[e].rankByMinutes;a.style.display=o.indexOf(o.find(e=>e[0]==t))<11?"inherit":"none",a.style.left=awayTacticPoints[e].averages[t][0].x-5+"px",a.style.top=awayTacticPoints[e].averages[t][0].y-5+"px",a.querySelector(".player_number").textContent=c.away.players[t-1].number,a.querySelector(".tooltiptext").textContent=c.away.players[t-1].name+"    "+c.away.players[t-1].number,document.querySelector("#avgPositionsAway"+e).appendChild(a)}h337.create({container:document.querySelector(a),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS}).setData({max:g,data:awayTacticPoints[e].team}),h337.create({container:document.querySelector(o),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS*BALL_RADIUS_KEFF*BALL_TACTICS_RADIUS_KEFF}).setData({max:g*BALL_MAX_KEFF*BALL_TACTICS_MAX_KEFF,data:awayTacticPoints[e].ball})}function o(){for(let e=1;e<=MAX_PLAYERS;e++){const t=document.getElementsByClassName("heatmap2-containers-wrapper")[0].cloneNode(!0),a="#heatmap-home"+e,o="#heatmap-away"+e;t.querySelector("#heatmap-home").id="heatmap-home"+e,t.querySelector(a+" > div").textContent=c.home.players[e-1].number+". "+c.home.players[e-1].name,t.querySelector("#heatmap-away").id="heatmap-away"+e,t.querySelector(o+" > div").textContent=c.away.players[e-1].number+". "+c.away.players[e-1].name,document.querySelector("#separate-heatmaps ~ .bojan__content").appendChild(t),h337.create({container:document.querySelector(a),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS}).setData({max:g*TEAM_MAX_KEFF,data:homePoints[e]}),h337.create({container:document.querySelector(o),maxOpacity:MAX_OPACITY,minOpacity:MIN_OPACITY,radius:POINT_RADIUS}).setData({max:g,data:awayPoints[e]})}}function n(e,t,a,o=SHOW){const n=e||"home",s=t||1,i=a||homeTacticPoints,c=n+"AvgPoints"+s,l="both"+n+"AvgPoints"+s,r=document.getElementById(c).style,m=document.getElementById(l).style;if(r.display=o?"inherit":"none",m.display=o?"inherit":"none",i.length>1)for(let e=1;e<i.length;e++){if(i[e].period<MIN_MINUTES_FOR_SHOW_TACTIC)continue;const t=n+"AvgPoints_"+e+"_"+s;document.getElementById(t).style.display=o?"inherit":"none"}}function s(){for(let e=1;e<=MAX_PLAYERS;e++){const t=document.querySelector("#player_default_home").cloneNode(!0),a=document.querySelector("#player_default_away").cloneNode(!0);a.id="awayAvgPoints"+e,a.plId="aw"+e,a.style.display=e<12?"inherit":"none",a.style.left=awayAvgPoints[e].x-5+"px",a.style.top=awayAvgPoints[e].y-5+"px";const o="away-player-list_"+e;let s=document.createElement("div");s.className="playerRow",s.id=o;const i=document.createElement("div");i.innerText=c.away.players[e-1].number+". ",i.className="player-list-num";const l=document.createElement("div");l.className="player-list-name";const r=document.createElement("a");r.style.fontWeight=e<12?"bold":"normal",r.id=o+"_name",r.innerText=c.away.players[e-1].name,r.href="#",r.addEventListener("click",(function(e){e.preventDefault(),this.style.fontWeight="bold"==this.style.fontWeight?"normal":"bold",n("away",this.id.replace("away-player-list_","").replace("_name",""),awayTacticPoints,"bold"==this.style.fontWeight?SHOW:HIDE)})),c.away.players[e-1].sub&&r.appendChild(getSubArrow(c.away.players[e-1].sub)),l.appendChild(r),s.appendChild(i),s.appendChild(l);const m=document.createElement("div");m.className="player-list-eye",m.innerText=" ",s.appendChild(m);const h=document.createElement("div");h.className="player-list-shots";const y=formShotsString(c.away.players[e-1]);h.innerText=y;const d=document.createElement("div");if(d.className="playerShotCheckbox"," "==y)d.innerText=" ";else{d.appendChild(createShotCheckbox({player:e,team:"away"}));const t=document.createElement("div");t.className="tooltiptext",t.innerText=SHOT_TOOLTIP,h.appendChild(t)}s.appendChild(d),s.appendChild(h);const p=document.createElement("div");p.className="player-list-mileage",p.innerText=Number(awayMileage[e]/1e3).toFixed(2)+" км",s.appendChild(p),document.querySelector("#squadAway").appendChild(s),a.querySelector(".player_number").textContent=c.away.players[e-1].number,a.querySelector(".tooltiptext").textContent=c.away.players[e-1].name+"    "+c.away.players[e-1].number,document.getElementById("heatmap-avgAway").appendChild(a);const u=a.cloneNode(!0);u.id="both"+u.id,document.getElementById("heatmap-avgBoth").appendChild(u);const P=a.cloneNode(!0);P.style.display=awayAvgPoints[e].x>8&&awayAvgPoints[e].y>8?"inherit":"none",P.id=P.id+"_individual",document.querySelector("#heatmap-away"+e).appendChild(P),t.id="homeAvgPoints"+e,t.plId="hm"+e,t.style.display=e<12?"inherit":"none",t.style.left=homeAvgPoints[e].x-5+"px",t.style.top=homeAvgPoints[e].y-5+"px";const T="home-player-list_"+e,w=document.createElement("div");w.id=T,w.className="playerRow";const _=document.createElement("div");_.innerText=c.home.players[e-1].number+". ",_.className="player-list-num",w.appendChild(_);const g=document.createElement("div");g.className="player-list-name";const S=document.createElement("a");S.style.fontWeight=e<12?"bold":"normal",S.id=T+"_name",S.innerText=c.home.players[e-1].name,S.href="#",S.addEventListener("click",(function(e){e.preventDefault(),this.style.fontWeight="bold"==this.style.fontWeight?"normal":"bold",n("home",this.id.replace("home-player-list_","").replace("_name",""),homeTacticPoints,"bold"==this.style.fontWeight?SHOW:HIDE)})),c.home.players[e-1].sub&&S.appendChild(getSubArrow(c.home.players[e-1].sub)),g.appendChild(S),w.appendChild(g);const A=document.createElement("div");A.className="player-list-eye",A.innerText=" ",w.appendChild(A);const C=document.createElement("div");C.className="player-list-shots";const x=formShotsString(c.home.players[e-1]);C.innerText=x;const v=document.createElement("div");if(v.className="playerShotCheckbox"," "==x)v.innerText=" ";else{v.appendChild(createShotCheckbox({player:e,team:"home"}));const t=document.createElement("div");t.className="tooltiptext",t.innerText=SHOT_TOOLTIP,C.appendChild(t)}w.appendChild(v),w.appendChild(C);const f=document.createElement("div");f.className="player-list-mileage",f.innerText=Number(homeMileage[e]/1e3).toFixed(2)+" км",w.appendChild(f),document.querySelector("#squadHome").appendChild(w),t.querySelector(".player_number").textContent=c.home.players[e-1].number,t.querySelector(".tooltiptext").textContent=c.home.players[e-1].name+"    "+c.home.players[e-1].number,document.getElementById("heatmap-avgHome").appendChild(t);const E=t.cloneNode(!0);E.id="both"+E.id,document.getElementById("heatmap-avgBoth").appendChild(E);const b=t.cloneNode(!0);b.style.display=homeAvgPoints[e].x>8&&homeAvgPoints[e].y>8?"inherit":"none",b.id=b.id+"_individual",document.querySelector("#heatmap-home"+e).appendChild(b)}}showableTacticks.push(homeTacticPoints.filter((e,t)=>t>0&&e.period>3).map(e=>[e.start,e.end])),showableTacticks.push(awayTacticPoints.filter((e,t)=>t>0&&e.period>3).map(e=>[e.start,e.end])),setTimeout(o,10),document.querySelector("#heatmap-home .overlay").textContent=c.home.team.name,document.querySelector("#heatmap-away .overlay").textContent=c.away.team.name,document.querySelector("#heatmap-avgHome .overlay").textContent="Средние позиции "+c.home.team.name,document.querySelector("#heatmap-avgAway .overlay").textContent="Средние позиции "+c.away.team.name,homeTacticChanges.push(homePoints[0].length-1),awayTacticChanges.push(awayPoints[0].length-1),homePoints.forEach((e,t)=>{const a=e.length;0===t||a<1||e.forEach((e,o)=>{homeAvgPoints[t].x+=e.x/a,homeAvgPoints[t].y+=e.y/a})}),awayPoints.forEach((e,t)=>{const a=e.length;0===t||a<1||e.forEach((e,o)=>{awayAvgPoints[t].x+=e.x/a,awayAvgPoints[t].y+=e.y/a})}),setTimeout(s,200),setTimeout((function(){document.body.removeChild(document.querySelector(".loader-wrapper"))}),1e3);const C=document.querySelector("#chalkboard .heatmap-canvas");if(C.getContext){const e=C.getContext("2d");drawTeamShots(shots.away,c.away.players,"away",e),drawTeamShots(shots.home,c.home.players,"home",e)}}else alert("Вставьте верно ссылку на матч!");setTimeout(afterLoadEvents,1e3)}},e.open("GET",formJsonUrl(tvurl),!0),e.send()};
function afterLoadEvents(){function t(t){return window.location.origin+window.location.pathname+"?"+t.replace("http://pefl.ru/tv/#/","")}const e=document.querySelector("#tv-url-input");document.getElementById("tv-url").href=function(){let t=window.location.href;return t=t.replace("http://pefl.ru/heatmaps.html?","http://pefl.ru/tv/#/").replace("http://localhost:8080//heatmaps.html?","http://pefl.ru/tv/#/")}(),document.getElementById("json-url").href=formJsonUrl(),document.querySelector("#updateButton").addEventListener("click",n=>{n.preventDefault(),e.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)?window.location.assign(t(e.value)):alert("Вставьте корректную ссылку на ТВ матча в поле ввода!")}),document.querySelector("#newWindow").addEventListener("click",n=>{n.preventDefault(),e.value.match(/http\:\/\/pefl.ru\/tv\/\#\/j\=\d+\&z\=.+/i)?window.open(t(e.value),"_blank"):alert("Вставьте корректную ссылку на ТВ матча в поле ввода!")}),setTimeout(()=>{document.querySelector("#shots-chalkboard ~ .bojan__content").appendChild(createSlider("shots",showableTacticks,filterShotsByTime)),document.querySelector("#norm-tactic-avg").addEventListener("click",(function(t){t.preventDefault(),function(){if(homeTacticPoints.length>1)for(let t=1;t<homeTacticPoints.length;t++)if(!(homeTacticPoints[t].period<MIN_MINUTES_FOR_SHOW_TACTIC))for(let e=1;e<=MAX_PLAYERS;e++){const n=document.querySelector("#homeAvgPoints_"+t+"_"+e),o=homeTacticPoints[t].rankByMinutes;n.style.display=o.indexOf(o.find(t=>t[0]==e))<11?"inherit":"none"}if(awayTacticPoints.length>1)for(let t=1;t<awayTacticPoints.length;t++)if(!(awayTacticPoints[t].period<MIN_MINUTES_FOR_SHOW_TACTIC))for(let e=1;e<=MAX_PLAYERS;e++){const n=document.querySelector("#awayAvgPoints_"+t+"_"+e),o=awayTacticPoints[t].rankByMinutes;n.style.display=o.indexOf(o.find(t=>t[0]==e))<11?"inherit":"none"}}()}))},2e3)}
function createSlider(t="",e=[[[0,125]],[[0,125]]],n){const i=document.createElement("div");function a(t=[0,125],e="home"){const n=document.createElement("div");n.classList.add("time-slider__tacticks");const i=document.createElement("span");i.innerText="home"===e?"Тактики хозяев":"Тактики гостей",n.appendChild(i);const a=document.createElement("ul");return t.forEach(t=>{const e=document.createElement("li");e.innerText=t[0]+" - "+t[1],e.classList.add("time-slider__tacticks__ref"),e.addEventListener("click",(function(e){e.preventDefault(),u(t[0],t[1]),l()})),a.appendChild(e)}),n.appendChild(a),n}i.classList.add("time-slider"),i.id=t+"-time-filter",i.addEventListener("change",(function(t){t.preventDefault(),l()})),u(0,125);const d=document.createElement("div");d.classList.add("time-slider__inputs");const r=document.createElement("input");r.type="number",r.min=0,r.max=125,r.value=0,r.id=t+"-start-input";const s=r.cloneNode(!0);s.id=t+"-end-input",r.addEventListener("change",(function(t){var e;t.preventDefault(),+this.value>+i.getAttribute("end")-3&&(this.value=+i.getAttribute("end")-3),e=this.value,i.setAttribute("start",e),l()})),s.addEventListener("change",(function(t){var e;t.preventDefault(),+this.value<+i.getAttribute("start")+3&&(this.value=+i.getAttribute("start")+3),e=this.value,i.setAttribute("end",e),l()}));const c=document.createElement("span");function u(t,e){i.setAttribute("start",t),i.setAttribute("end",e)}function l(){const t=+i.getAttribute("start"),e=+i.getAttribute("end");r.value=t,s.value=e,n(t,e)}return c.innerText="Границы периода",d.appendChild(r),d.appendChild(c),d.appendChild(s),e[0].length>0&&i.appendChild(a(e[0])),e[1].length>0&&i.appendChild(a(e[1],"away")),i.appendChild(d),l(),i}
//# sourceMappingURL=hm.js.map
