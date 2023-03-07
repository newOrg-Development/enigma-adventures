$(document).ready(function () {
  let gameStates = document.getElementById("gameStates").innerText;
  gameStates = JSON.parse(gameStates);
  let table = document.getElementById("gamesTable");
  let tHead = table.getElementsByTagName("thead")[0];
  tHead.rows[0].innerHTML = "";
  table.getElementsByTagName("tbody")[0].innerHTML = "";

  let fieldsAA = ["uuid", "teamName", "teamEmail", "hintsUsed", "startTime"];
  let tableRow = "";
  let leaderboardHeadRow = "";

  fieldsAA.forEach((item, index) => {
    leaderboardHeadRow += `<th scope="col">${item}</th>`;
  });

  gameStates.forEach((leader, index) => {
    tableRow = "<tr>";
    fieldsAA.forEach((leaderField, index2) => {
      tableRow += `<td>${leader[leaderField]}</td>`;
    });
    table.getElementsByTagName("tbody")[0].innerHTML +=
      "<tr>" + tableRow + "</tr>";
  });
  document.getElementsByTagName("thead")[0].rows[0].innerHTML =
    leaderboardHeadRow;
});
