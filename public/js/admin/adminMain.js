$(document).ready(function () {
  let temp = [
    [
      ["g1p1h1", "g1p1h2"],
      ["g1p2h1", "g1p2h2"],
    ],
    [
      ["g2p1h1", "g2p1h2"],
      ["g2p2h1", "g2p2h2"],
    ],
    [
      ["g3p1h1", "g3p1h2"],
      ["g3p2h1", "g3p2h2"],
    ],
  ];

  // console.log("temp: " + JSON.stringify(temp));

  document
    .getElementById("saveHintArray")
    .addEventListener("click", function () {
      let gameNumberSelect = document.getElementById("gameNumber");
      let gameNumber = document.getElementById("gameNumber").value;
      let puzzleNumber = document.getElementById("puzzleNumber").value;
      let hintNumber = document.getElementById("hintNumber").value;

      gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1] =
        document.getElementById("hint").value +
        "," +
        document.getElementById("qrString").value;
      resetGameHintData(gameDataParsed);
      document.getElementById("gameNumber").value = gameNumber;
      puzzleNumber = document.getElementById("puzzleNumber").value =
        puzzleNumber;
      document.getElementById("hintNumber").value = hintNumber;
      document.getElementById("hintNumber").dispatchEvent(new Event("change"));
      //console.log("changing hint");

      let tempDivData = document.getElementById("gameDataDiv").innerText;

      tempDivData = "[" + tempDivData + "]";
      console.log("tempDivData: " + tempDivData);
      let gameHintArray = JSON.parse(tempDivData);
      // console.log(
      //   "gameHintArray: " + gameHintArray,
      //   " length: ",
      //   gameHintArray.length
      // );
      // console.log(
      //   "gameHintArray: " + gameHintArray[0],
      //   " length: ",
      //   gameHintArray[0].length
      // );

      let payload = [];
      let pusher = [];
      for (let i = 0; i < gameHintArray.length; i++) {
        let tempArr = [];
        // tempArr.push(gameNames[i]);
        // tempArr.push(gameHintArray[i]);
        // let stringer = gameHintArray[i].toString();
        let stringer = gameHintArray[i];

        // pusher.push(stringer);
        // if not last element
        if (i != gameHintArray.length - 1) {
          pusher += gameNames[i] + ";;" + JSON.stringify(stringer) + "&&";
        } else {
          pusher += gameNames[i] + ";;" + JSON.stringify(stringer);
        }
      }
      payload.push(pusher);
      // console.log("payload: " + payload);
      // payload = payload.toString();
      //post to server
      $.ajax({
        url: "/admin/saveHintArray",
        type: "POST",
        data: { gameHintArray: payload },
        success: function (data) {
          console.log("data: " + data);
          document.getElementById("saveHintArray").text = "Saved";
          setTimeout(function () {
            document.getElementById("saveHintArray").text = "Save Hints";
          }, 5000);
        },
      });
    });

  let gameData = document.getElementById("gameDataDiv").innerText;
  gameData = gameData.split("@@");

  //populate states dropdown with gameData.Length
  let states = document.getElementById("states");
  for (let i = 0; i < gameData.length; i++) {
    let option = document.createElement("option");
    option.text = "State " + (i + 1);
    option.value = i + 1;
    states.add(option);
  }

  // event list
  document.getElementById("states").addEventListener("change", function () {
    let statesSelected = document.getElementById("states").value - 1;
    populateGameTreefunction(statesSelected);
  });

  let gamesArr = gameData[0].split("&&");
  let gameDataParsedArr = [];
  let gameDataForDiv = [];
  var gameDataParsed = [];
  var gameDataParsed = [];
  var gameNames = [];
  function populateGameTreefunction(gameDataNumber) {
    gamesArr = gameData[gameDataNumber].split("&&");
    gameDataParsedArr = [];
    gameDataForDiv = [];
    for (let i = 0; i < gamesArr.length; i++) {
      let gameDataArr = gamesArr[i].split(";;");
      gameDataArr[1] = JSON.parse(gameDataArr[1]);
      gameDataParsedArr.push(gameDataArr[1]);
      gameDataForDiv.push(JSON.stringify(gameDataArr[1]));
    }
    document.getElementById("gameDataDiv").innerText = gameDataForDiv;
    gameDataParsed = [];
    gameDataParsed = gameDataParsedArr;

    gameNames = [];
    let gameNumberSelect = document.getElementById("gameNumber");
    gameNumberSelect.innerHTML = "";
    for (let i = 0; i < gamesArr.length; i++) {
      let option = document.createElement("option");
      let gameName = gamesArr[i].split(";;");
      gameNames.push(gameName[0]);
      option.text = gameName[0];
      option.value = i + 1;
      gameNumberSelect.add(option);
    }

    let gameNumberSelected = document.getElementById("gameNumber").value;
    let temperCounter = gameDataParsed[0].length;
    let puzzleNumberSelect = document.getElementById("puzzleNumber");
    puzzleNumberSelect.innerHTML = "";
    for (let i = 0; i < temperCounter; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      puzzleNumberSelect.add(option);
    }
    // console.log("gameDataParsed[0][0]: " + gameDataParsed[0][0]);
    temperCounter = gameDataParsed[0][0].length;
    let hintNumberSelect = document.getElementById("hintNumber");
    hintNumberSelect.innerHTML = "";
    for (let i = 0; i < temperCounter; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      hintNumberSelect.add(option);
    }

    //  let hint = gameDataParsed[0][0][0];
    let hintArr = gameDataParsed[0][0][0].split(",");
    document.getElementById("hint").value = hintArr[0];
    document.getElementById("qrString").value = hintArr[1];
  }
  populateGameTreefunction(0);

  document.getElementById("gameNumber").addEventListener("change", function () {
    let gameNumberSelected = document.getElementById("gameNumber").value;
    let puzzleNumberSelect = document.getElementById("puzzleNumber");
    //  gameNumberSelected = document.getElementById("gameNumber").innerHTML = "";
    puzzleNumberSelect.innerHTML = "";
    let temperCounter = gameDataParsed[gameNumberSelected - 1].length;
    for (let i = 0; i < temperCounter; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      puzzleNumberSelect.add(option);
    }
    let hintNumberSelect = document.getElementById("hintNumber");
    hintNumberSelect.innerHTML = "";
    let puzzlesArr = gameDataParsed[gameNumberSelected - 1][0];
    for (let i = 0; i < puzzlesArr.length; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      hintNumberSelect.add(option);
    }
    //let hint = gameDataParsed[gameNumberSelected - 1][0][0];
    let hintArr = gameDataParsed[gameNumberSelected - 1][0][0].split(",");
    document.getElementById("hint").value = hintArr[0];
    document.getElementById("qrString").value = hintArr[1];
    // document.getElementById("hint").value = hint;
  });

  document
    .getElementById("puzzleNumber")
    .addEventListener("change", function () {
      let gameNumberSelected = document.getElementById("gameNumber").value;
      let puzzleNumberSelected = document.getElementById("puzzleNumber").value;
      let hintNumberSelect = document.getElementById("hintNumber");
      hintNumberSelect.innerHTML = "";
      console.log("gameDataParsed ", gameDataParsedArr);
      let puzzlesArr =
        gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1];
      console.log(
        "puzzlesArr: " + puzzlesArr,
        " gameNumberSelected: " + gameNumberSelected,
        " puzzleNumberSelected: " + puzzleNumberSelected,
        " gameDataParsed: ",
        gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1]
      );
      for (let i = 0; i < puzzlesArr.length; i++) {
        let option = document.createElement("option");
        option.text = i + 1;
        option.value = i + 1;
        hintNumberSelect.add(option);
      }
      let hintArr = [];
      // gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1];
      if (
        gameDataParsed[gameNumberSelected - 1][
          puzzleNumberSelected - 1
        ][0].split(",")
      ) {
        hintArr =
          gameDataParsed[gameNumberSelected - 1][
            puzzleNumberSelected - 1
          ][0].split(",");
        document.getElementById("hint").value = hintArr[0];
        document.getElementById("qrString").value = hintArr[1];
      } else {
        document.getElementById("hint").value = "hintArr[0]";
        document.getElementById("qrString").value = "hintArr[1]";
      }

      // document.getElementById("hint").value = hints[0];
    });

  document.getElementById("hintNumber").addEventListener("change", function () {
    let gameNumberSelected = document.getElementById("gameNumber").value;
    let puzzleNumberSelected = document.getElementById("puzzleNumber").value;
    let hintNumberSelected = document.getElementById("hintNumber").value;
    //  let hint =
    gameDataParsed[
      gameNumberSelected - 1
    ][puzzleNumberSelected - 1][hintNumberSelected - 1];

    let hintArr =
      gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1][
        hintNumberSelected - 1
      ].split(",");
    document.getElementById("hint").value = hintArr[0];
    document.getElementById("qrString").value = hintArr[1];
    //  document.getElementById("hint").value = hint;
  });

  document.getElementById("addGame").addEventListener("click", function () {
    console.log("addGame");
    let gameNumber = document.getElementById("gameNumber").value;
    console.log("!!!! zer ", gamesArr[0]);
    let gameString = '"newGame";;[[""]]';
    //add gamestring as first element of gameArr
    console.log("gamesArrbef: " + gamesArr.length);
    gamesArr.unshift(gameString);
    console.log("gamesArrafter: " + gamesArr.length);
    // gamesArr = gameData[gameDataNumber].split("&&");
    // gameDataParsedArr = [];
    //gamesArr = gameData[gameDataNumber].split("&&");
    gameDataParsedArr = [];
    gameDataForDiv = [];
    for (let i = 0; i < gamesArr.length; i++) {
      let gameDataArr = gamesArr[i].split(";;");
      gameDataArr[1] = JSON.parse(gameDataArr[1]);
      gameDataParsedArr.push(gameDataArr[1]);
      gameDataForDiv.push(JSON.stringify(gameDataArr[1]));
    }
    document.getElementById("gameDataDiv").innerText = gameDataForDiv;
    gameDataParsed = [];
    gameDataParsed = gameDataParsedArr;
    //gameDataParsed =
    // gamesArr.push();
    //gameDataParsed[gameNumber - 1].push([[[]]]);
    gameNames = [];
    let gameNumberSelect = document.getElementById("gameNumber");
    gameNumberSelect.innerHTML = "";
    for (let i = 0; i < gamesArr.length; i++) {
      let option = document.createElement("option");
      let gameName = gamesArr[i].split(";;");
      gameNames.push(gameName[0]);
      option.text = gameName[0];
      option.value = i + 1;
      gameNumberSelect.add(option);
    }

    resetGameHintData(gameDataParsed);
    document.getElementById("gameNumber").value = 1;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
  });

  document.getElementById("removeGame").addEventListener("click", function () {
    let doomedGame = document.getElementById("gameNumber").value;
    let index = gameDataParsed.indexOf(gameDataParsed[doomedGame - 1]);
    console.log("gameDataParsedbef: " + gameDataParsed[0]);
    gameDataParsed.splice(index, 1);
    gameNames.splice(index, 1);
    console.log("gameDataParsedaf: " + gameDataParsed[0]);
    resetGameHintData(gameDataParsed);

    document.getElementById("gameNumber").value = doomedGame;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
  });
  document.getElementById("addPuzzle").addEventListener("click", function () {
    // document.getElementById("gameDataDiv").innerText =
    //   JSON.stringify(gameDataParsed);
    let gameNumber = document.getElementById("gameNumber").value;
    // console.log("gameDataParsedBefore: " + gameDataParsed.length);
    // console.log(
    //   "gameDataParsed[gameNumber - 1]: " + gameDataParsed[gameNumber - 1].length
    // );
    gameDataParsed[gameNumber - 1].push(["hint1"]);
    // console.log(
    //   "after gameDataParsed[gameNumber - 1]: " +
    //     gameDataParsed[gameNumber - 1].length
    // );
    // console.log("gameDataParsedafter: " + gameDataParsed.length);
    resetGameHintData(gameDataParsed);
    document.getElementById("gameNumber").value = gameNumber;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
    //select game number
  });

  document
    .getElementById("removePuzzle")
    .addEventListener("click", function () {
      let gameNumber = document.getElementById("gameNumber").value;
      let doomedPuzzle = document.getElementById("puzzleNumber").value;
      let index = gameDataParsed.indexOf(
        gameDataParsed[gameNumber - 1][doomedPuzzle - 1]
      );
      gameDataParsed[gameNumber - 1].splice(index, 1);
      resetGameHintData(gameDataParsed);
      document.getElementById("gameNumber").value = gameNumber;
      document.getElementById("gameNumber").dispatchEvent(new Event("change"));
    });

  // document.getElementById("changeHint").addEventListener("click", function () {
  //   let gameNumber = document.getElementById("gameNumber").value;
  //   let puzzleNumber = document.getElementById("puzzleNumber").value;
  //   let hintNumber = document.getElementById("hintNumber").value;
  //   gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1] =
  //     document.getElementById("hint").value +
  //     "," +
  //     document.getElementById("qrString").value;
  //   resetGameHintData(gameDataParsed);
  //   document.getElementById("gameNumber").value = gameNumber;
  //   puzzleNumber = document.getElementById("puzzleNumber").value = puzzleNumber;
  //   document.getElementById("hintNumber").value = hintNumber;
  //   document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  // });

  // document.getElementById("hint").addEventListener("input", function () {
  //   let gameNumber = document.getElementById("gameNumber").value;
  //   let puzzleNumber = document.getElementById("puzzleNumber").value;
  //   let hintNumber = document.getElementById("hintNumber").value;
  //   gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1] =
  //     document.getElementById("hint").value +
  //     "," +
  //     document.getElementById("qrString").value;
  //   resetGameHintData(gameDataParsed);
  //   document.getElementById("gameNumber").value = gameNumber;
  //   puzzleNumber = document.getElementById("puzzleNumber").value = puzzleNumber;
  //   document.getElementById("hintNumber").value = hintNumber;
  //   document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  //   console.log("changing hint");
  // });

  // //setup before functions
  // let typingTimer; //timer identifier
  // let doneTypingInterval = 2000; //time in ms (5 seconds)
  // let hintInput = document.getElementById("hint");

  // //on keyup, start the countdown
  // hintInput.addEventListener("keyup", () => {
  //   clearTimeout(typingTimer);
  //   if (myInput.value) {
  //     typingTimer = setTimeout(doneTyping, doneTypingInterval);
  //   }
  // });

  // //user is "finished typing," do something
  // function doneTyping() {
  //   let gameNumber = document.getElementById("gameNumber").value;
  //   let puzzleNumber = document.getElementById("puzzleNumber").value;
  //   let hintNumber = document.getElementById("hintNumber").value;
  //   gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1] =
  //     document.getElementById("hint").value +
  //     "," +
  //     document.getElementById("qrString").value;
  //   resetGameHintData(gameDataParsed);
  //   document.getElementById("gameNumber").value = gameNumber;
  //   puzzleNumber = document.getElementById("puzzleNumber").value = puzzleNumber;
  //   document.getElementById("hintNumber").value = hintNumber;
  //   document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  //   console.log("changing hint");
  // }

  document.getElementById("addHint").addEventListener("click", function () {
    let gameNumber = document.getElementById("gameNumber").value;
    let puzzleNumber = document.getElementById("puzzleNumber").value;

    console.log(
      "hinter",
      gameDataParsed[gameNumber - 1][puzzleNumber - 1],
      " text ",
      document.getElementById("hint").value
    );

    gameDataParsed[gameNumber - 1][puzzleNumber - 1].push("newHint,newQString");
    resetGameHintData(gameDataParsed);

    document.getElementById("gameNumber").value = gameNumber;
    document.getElementById("puzzleNumber").value = puzzleNumber;
    document.getElementById("hintNumber").value =
      document.getElementById("hintNumber").length;
    document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  });

  document.getElementById("removeHint").addEventListener("click", function () {
    console.log("removeHint");

    let gameNumber = document.getElementById("gameNumber").value;
    let puzzleNumber = document.getElementById("puzzleNumber").value;
    let hintNumber = document.getElementById("hintNumber").value;

    console.log(
      "gameNumber: " +
        gameNumber +
        " puzzleNumber: " +
        puzzleNumber +
        " hintNumber: " +
        hintNumber
    );

    let index = gameDataParsed[gameNumber - 1][puzzleNumber - 1].indexOf(
      gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1]
    );

    gameDataParsed[gameNumber - 1][puzzleNumber - 1].splice(index, 1);
    resetGameHintData(gameDataParsed);
  });

  function resetGameHintData(newGameDataParsed) {
    let gameNumberSelect = document.getElementById("gameNumber");

    gameNumberSelect.innerHTML = "";
    let numberOfGames = newGameDataParsed.length;
    for (let i = 0; i < numberOfGames; i++) {
      let option = document.createElement("option");
      option.text = gameNames[i];
      option.value = i + 1;
      gameNumberSelect.add(option);
    }

    let puzzleNumberSelect = document.getElementById("puzzleNumber");
    puzzleNumberSelect.innerHTML = "";

    let numberOfPuzzles = newGameDataParsed[gameNumberSelect.value - 1].length;
    for (let i = 0; i < numberOfPuzzles; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      puzzleNumberSelect.add(option);
    }

    let hintNumberSelect = document.getElementById("hintNumber");
    hintNumberSelect.innerHTML = "";
    let numberofHints = newGameDataParsed[gameNumberSelect.value - 1][0].length;
    for (let i = 0; i < numberofHints; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      hintNumberSelect.add(option);
    }

    let hintArr =
      newGameDataParsed[gameNumberSelect.value - 1][0][0].split(",");
    //console.log("hint: " + hint);
    document.getElementById("hint").value = hintArr[0];
    document.getElementById("qrString").value = hintArr[1];

    let tempJser = JSON.stringify(newGameDataParsed);
    //remove first and last character
    tempJser = tempJser.substring(1, tempJser.length - 1);

    document.getElementById("gameDataDiv").innerText = tempJser;
  }
});
