$(document).ready(function () {
  let leaderboardData = document.getElementById("leaderboardDiv").innerText;
  document.getElementById("leaderboardTableBody").innerHTML = "";
  leaderboardData = JSON.parse(leaderboardData);
  let leaderboardRow = "";
  let leaderboardHeadRow = "";
  let tableHeadersArray = ["teamName", "hintsUsed", "finishTime"];

  tableHeadersArray.forEach((item, index) => {
    leaderboardHeadRow += `<th scope="col">${item}</th>`;
  });

  leaderboardData.forEach((leader, index) => {
    leaderboardRow = "<tr>";
    tableHeadersArray.forEach((leaderField, index2) => {
      leaderboardRow += `<td>${leader[leaderField]}</td>`;
    });
    document.getElementById("leaderboardTableBody").innerHTML +=
      leaderboardRow + "</tr>";
  });
  document.getElementsByTagName("thead")[0].rows[0].innerHTML =
    leaderboardHeadRow;
});
