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

  console.log("temp: " + JSON.stringify(temp));

  let gameData = document.getElementById("gameDataDiv").innerText;
  let gameDataParsed = JSON.parse(gameData);
  let gameNumberSelect = document.getElementById("gameNumber");
  for (let i = 0; i < gameDataParsed.length; i++) {
    let option = document.createElement("option");
    option.text = i + 1;
    option.value = i + 1;
    gameNumberSelect.add(option);
  }

  //get selcted game number
  let gameNumberSelected = document.getElementById("gameNumber").value;

  //populate puzzleNumber select with puzzle numbers
  let temperCounter = gameDataParsed[0][gameNumberSelected].length;
  let puzzleNumberSelect = document.getElementById("puzzleNumber");
  for (let i = 0; i < temperCounter; i++) {
    let option = document.createElement("option");
    option.text = i + 1;
    option.value = i + 1;
    puzzleNumberSelect.add(option);
  }

  temperCounter = gameDataParsed[0][gameNumberSelected][0][0].length;
  let hintNumberSelect = document.getElementById("hintNumber");
  for (let i = 0; i < temperCounter; i++) {
    let option = document.createElement("option");
    option.text = i + 1;
    option.value = i + 1;
    hintNumberSelect.add(option);
  }

  let hint = gameDataParsed[0][0][0];
  document.getElementById("hint").value = hint;

  document.getElementById("gameNumber").addEventListener("change", function () {
    // let gameDataParsed = JSON.parse(gameData);
    console.log(gameDataParsed);
    let gameNumberSelected = document.getElementById("gameNumber").value;
    console.log("gameNumberSelected: " + gameNumberSelected);
    let puzzleNumberSelect = document.getElementById("puzzleNumber");
    //remove all options
    puzzleNumberSelect.innerHTML = "";

    let temperCounter = gameDataParsed[gameNumberSelected - 1].length;
    console.log("temperCounter: " + temperCounter);
    for (let i = 0; i < temperCounter; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      puzzleNumberSelect.add(option);
    }

    //get hints
    let hintNumberSelect = document.getElementById("hintNumber");
    //remove all options
    hintNumberSelect.innerHTML = "";

    let puzzlesArr = gameDataParsed[gameNumberSelected - 1][0];
    console.log("temperCounter2: " + puzzlesArr);
    for (let i = 0; i < puzzlesArr.length; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      hintNumberSelect.add(option);
    }

    //get hint
    let hint = gameDataParsed[gameNumberSelected - 1][0][0];
    console.log("hint: " + hint);
    document.getElementById("hint").value = hint;
  });

  document
    .getElementById("puzzleNumber")
    .addEventListener("change", function () {
      let gameNumberSelected = document.getElementById("gameNumber").value;
      let puzzleNumberSelected = document.getElementById("puzzleNumber").value;
      let hintNumberSelect = document.getElementById("hintNumber");
      //remove all options
      hintNumberSelect.innerHTML = "";

      let puzzlesArr =
        gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1];
      for (let i = 0; i < puzzlesArr.length; i++) {
        let option = document.createElement("option");
        option.text = i + 1;
        option.value = i + 1;
        hintNumberSelect.add(option);
      }

      let hint =
        gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1][0];
      document.getElementById("hint").textContent = hint;
    });

  document
    .getElementById("puzzleNumber")
    .addEventListener("change", function () {
      let gameNumberSelected = document.getElementById("gameNumber").value;
      let puzzleNumberSelected = document.getElementById("puzzleNumber").value;
      let hintNumberSelected = document.getElementById("hintNumber").value;
      let hint =
        gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1][
          hintNumberSelected - 1
        ];
      console.log("hint: " + hint);
      document.getElementById("hint").value = hint;
    });

  document.getElementById("hintNumber").addEventListener("change", function () {
    let gameNumberSelected = document.getElementById("gameNumber").value;
    let puzzleNumberSelected = document.getElementById("puzzleNumber").value;
    let hintNumberSelected = document.getElementById("hintNumber").value;
    let hint =
      gameDataParsed[gameNumberSelected - 1][puzzleNumberSelected - 1][
        hintNumberSelected - 1
      ];
    document.getElementById("hint").value = hint;
  });

  document.getElementById("removeGame").addEventListener("click", function () {
    let doomedGame = document.getElementById("gameNumber").value;
    let index = gameDataParsed.indexOf(gameDataParsed[doomedGame - 1]);
    gameDataParsed.splice(index, 1);
    resetGameHintData(gameDataParsed);
  });
  document.getElementById("addPuzzle").addEventListener("click", function () {
    //get game
    let gameNumber = document.getElementById("gameNumber").value;
    gameDataParsed[gameNumber - 1].push([]);

    resetGameHintData(gameDataParsed);
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
    });
  document.getElementById("changeHint").addEventListener("click", function () {
    let gameNumber = document.getElementById("gameNumber").value;
    let puzzleNumber = document.getElementById("puzzleNumber").value;
    let hintNumber = document.getElementById("hintNumber").value;
    gameDataParsed[gameNumber - 1][puzzleNumber - 1][hintNumber - 1] =
      document.getElementById("hint").value;
    resetGameHintData(gameDataParsed);
  });
  document.getElementById("addHint").addEventListener("click", function () {
    let gameNumber = document.getElementById("gameNumber").value;
    let puzzleNumber = document.getElementById("puzzleNumber").value;

    console.log(
      "hinter",
      gameDataParsed[gameNumber - 1][puzzleNumber - 1],
      " text ",
      document.getElementById("hint").value
    );
    gameDataParsed[gameNumber - 1][puzzleNumber - 1].push(
      document.getElementById("hint").value
    );
    resetGameHintData(gameDataParsed);
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

  function resetGameHintData() {
    let gameNumberSelect = document.getElementById("gameNumber");
    gameNumberSelect.innerHTML = "";
    let numberOfGames = gameDataParsed.length;
    for (let i = 0; i < numberOfGames; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      gameNumberSelect.add(option);
    }

    let puzzleNumberSelect = document.getElementById("puzzleNumber");
    puzzleNumberSelect.innerHTML = "";

    let numberOfPuzzles = gameDataParsed[gameNumberSelected - 1].length;
    for (let i = 0; i < numberOfPuzzles; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      puzzleNumberSelect.add(option);
    }

    let hintNumberSelect = document.getElementById("hintNumber");
    hintNumberSelect.innerHTML = "";
    let numberofHints = gameDataParsed[gameNumberSelected - 1][0].length;
    for (let i = 0; i < numberofHints; i++) {
      let option = document.createElement("option");
      option.text = i + 1;
      option.value = i + 1;
      hintNumberSelect.add(option);
    }

    let hint = gameDataParsed[gameNumberSelected - 1][0][0];
    console.log("hint: " + hint);
    document.getElementById("hint").value = hint;
    document.getElementById("gameDataDiv").innerText =
      JSON.stringify(gameDataParsed);
  }
});
