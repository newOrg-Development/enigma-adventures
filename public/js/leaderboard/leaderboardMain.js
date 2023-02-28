$(document).ready(function () {
  let leaderboardData = document.getElementById("leaderboardDiv").innerText;
  leaderboardData = leaderboardData.split("&&");
  let leaderboardRow = "";
  leaderboardData.forEach((element, index) => {
    let elementArray = element.split(";");
    leaderboardRow += `<tr><th scope="row">${index + 1}</th><td>${
      elementArray[0]
    }</td><td>${elementArray[1]}</td><td>${elementArray[2]}</td></tr>`;
  });
  document.getElementById("leaderboardTableBody").innerHTML = leaderboardRow;
});
