$(document).ready(function () {
  let table = document.getElementById("leaderboardTable");
  let leaderboardData = document.getElementById("leaderboardDiv").innerText;
  document.getElementById("leaderboardTableBody").innerHTML = "";
  leaderboardData = JSON.parse(leaderboardData);
  let fieldsIn = Object.keys(leaderboardData[0]);
  function displayTable(fields) {
    table.getElementsByTagName("tbody")[0].innerHTML = "";
    let tableRow = "";
    let gameboardHeadRow = "";
    fields.forEach((item, index) => {
      gameboardHeadRow += `<th scope="col">${item}</th>`;
    });

    leaderboardData.forEach((game, index) => {
      tableRow = "<tr>";
      fields.forEach((gameField, index2) => {
        tableRow += `<td>${game[gameField]}</td>`;
      });
      table.getElementsByTagName("tbody")[0].innerHTML += tableRow + "</tr>";
    });
    document.getElementsByTagName("thead")[0].rows[0].innerHTML =
      gameboardHeadRow;
  }
  displayTable(fieldsIn);

  let checkTemplate =
    document.getElementById("checkBoxTemplate").firstElementChild;
  fieldsIn.forEach((item, index) => {
    let newCheck = checkTemplate.cloneNode(true);
    newCheck.getElementsByTagName("input")[0].id = item;
    newCheck.getElementsByTagName("label")[0].htmlFor = item;
    newCheck.getElementsByTagName("label")[0].innerText = item;
    if (
      item != "uuid" &&
      item != "teamEmail" &&
      item != "startTime" &&
      item != "puzzleCount"
    ) {
      newCheck.getElementsByTagName("input")[0].checked = true;
    }
    document.getElementById("checkboxDiv").appendChild(newCheck);
    newCheck
      .getElementsByTagName("input")[0]
      .dispatchEvent(new Event("change"));
  });
  let checks = document
    .getElementById("checkboxDiv")
    .getElementsByTagName("input");
  for (let i = 0; i < checks.length; i++) {
    checks[i].addEventListener("change", function () {
      let fieldsOut = [];
      for (let j = 0; j < checks.length; j++) {
        if (checks[j].checked) {
          fieldsOut.push(checks[j].id);
        }
      }
      displayTable(fieldsOut);
    });
  }
  document.getElementsByTagName("input")[1].dispatchEvent(new Event("change"));
});
