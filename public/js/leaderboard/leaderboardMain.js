$(document).ready(function () {
  let leaderboardData = document.getElementById("leaderboardDiv").innerText;
  leaderboardData = leaderboardData.split("&&");
  console.log(leaderboardData);
  let leaderboardRow = "";
  leaderboardData.forEach((element, index) => {
    let elementArray = element.split(";");
    console.log(elementArray);

    //     <tr>
    //     <th scope="row">1</th>
    //     <td>Mark</td>
    //     <td>Otto</td>
    //     <td>@mdo</td>
    //   </tr>

    leaderboardRow += `<tr><th scope="row">${index + 1}</th><td>${
      elementArray[0]
    }</td><td>${elementArray[1]}</td><td>${elementArray[2]}</td></tr>`;
  });
  document.getElementById("leaderboardTableBody").innerHTML = leaderboardRow;
  console.log(leaderboardRow);
});
