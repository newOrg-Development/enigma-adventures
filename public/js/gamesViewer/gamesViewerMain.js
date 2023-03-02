$(document).ready(function () {
  let gamesHeaders = [
    "", //blank 0,0 table cell
    "gameId",
    "TeamName",
    "teamEmail",
    "hintsUsed",
    "startTime",
  ];

  let table = document.getElementById("gamesTable");
  let tHead = table.getElementsByTagName("thead")[0];
  tHead.rows[0].innerHTML = "";
  table.getElementsByTagName("tbody")[0].innerHTML = "";
  for (let i = 0; i < gamesHeaders.length; i++) {
    let th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.innerHTML = gamesHeaders[i];
    tHead.rows[0].appendChild(th);
  }

  let gameStates = document.getElementById("gameStates").innerText;
  gameStates = gameStates.replace(/(\r \n|\n|\r)/gm, "");
  gameStates = gameStates.split("&&");
  let gameStatesDataArray = [];
  gameStates.forEach((gameState, index) => {
    gameStatesDataArray.push(gameState.split(";"));
  });

  gameStatesDataArray.forEach((gameState, index) => {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = index + 1;
    tr.appendChild(th);
    for (let i = 0; i < gameState.length; i++) {
      let td = document.createElement("td");
      if (gameState[i] == gameState[4]) {
        let date = new Date(parseInt(gameState[i]));
        let dateStr = date.toDateString();
        let timeStr = date.toLocaleTimeString();
        let dateTimeStr = dateStr + " " + timeStr;
        td.innerHTML = dateTimeStr;
      } else {
        td.innerHTML = gameState[i];
      }
      tr.appendChild(td);
    }
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  });
});
