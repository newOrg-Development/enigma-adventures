$(document).ready(function () {
  let gameStates = document.getElementById("gameStates").innerText;
  gameStates = JSON.parse(gameStates);
  let table = document.getElementById("gamesTable");
  let tHead = table.getElementsByTagName("thead")[0];
  tHead.rows[0].innerHTML = "";
  table.getElementsByTagName("tbody")[0].innerHTML = "";
  //get all fields from the first object in the array
  let fieldsIn = Object.keys(gameStates[0]);
  function displayTable(fields) {
    //clear table
    table.getElementsByTagName("tbody")[0].innerHTML = "";
    //let fieldsAA = ["uuid", "teamName", "teamEmail", "hintsUsed", "startTime"];
    let tableRow = "";
    let gameboardHeadRow = "";

    fields.forEach((item, index) => {
      gameboardHeadRow += `<th scope="col">${item}</th>`;
    });

    gameStates.forEach((game, index) => {
      tableRow = "<tr>";
      fields.forEach((gameField, index2) => {
        tableRow += `<td>${game[gameField]}</td>`;
      });
      table.getElementsByTagName("tbody")[0].innerHTML +=
        "<tr>" + tableRow + "</tr>";
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
    //checked by default
    newCheck.getElementsByTagName("input")[0].checked = true;
    document.getElementById("checkboxDiv").appendChild(newCheck);
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
});
