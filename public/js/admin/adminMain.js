import { GameStructure } from "./adminClasses.js";

$(document).ready(function () {
  let gameStructureArray = [];
  $.ajax({
    type: "GET",
    url: "admin/getStates",
    success: function (data) {
      let gameDataArr = data;
      gameDataArr.forEach((game) => {
        let gameStructure = new GameStructure(game);
        gameStructureArray.push(gameStructure);
      });
      populatePage(gameStructureArray);
    },
  });
  let selects = document.getElementsByTagName("select");
  function populatePage(gameStructureArrayData) {
    selects[0].innerHTML = "";
    gameStructureArrayData.forEach((gameStructureData, index) => {
      let option = document.createElement("option");
      option.text = gameStructureData.gameName;
      option.value = index;
      selects[0].add(option);
    });
    loadPuzzles(0);
    loadHints(0, 0, 0);
  }

  function loadPuzzles(gameNum) {
    selects[1].innerHTML = "";
    gameStructureArray[gameNum].hintTree.forEach((puzzleArr, index) => {
      let option = document.createElement("option");
      option.text = index + 1;
      option.value = index;
      selects[1].add(option);
    });
  }
  function loadHints(gameNum, puzzleNum, hintNum) {
    selects[2].innerHTML = "";
    gameStructureArray[gameNum].hintTree[puzzleNum].forEach((puzzle, index) => {
      let option = document.createElement("option");
      option.text = index + 1;
      option.value = index;
      selects[2].add(option);
    });
    loadHintPairs(gameNum, puzzleNum, hintNum);
  }

  function loadHintPairs(gameNum, puzzleNum, hintNum) {
    document.getElementById("hint").value =
      gameStructureArray[gameNum].hintTree[puzzleNum][hintNum].hint;
    document.getElementById("qrString").value =
      gameStructureArray[gameNum].hintTree[puzzleNum][hintNum].qrCode;
  }

  let showScannerSwitch = document.getElementById("showScannerSwitch");
  showScannerSwitch.addEventListener("change", function () {
    //console.log("showScannerSwitch: " + showScannerSwitch.checked);
    if (showScannerSwitch.checked) {
      document.getElementById("scanner").style.display = "block";
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    } else {
      document.getElementById("scanner").style.display = "none";
    }
  });

  function onScanSuccess(decodedText, decodedResult) {
    //let select = document.getElementById("qrCodeData");
    // for (let i = 0; i < select.options.length; i++) {
    if (decodedText) {
      alert("decodedText: " + decodedText);
      document.getElementById("qrString").value = decodedText;
      document.getElementById("html5-qrcode-button-camera-stop").click();
      //  break;
    } else {
      alert("no text!");
    }
    // }
    return;
  }

  function onScanFailure(error) {
    console.log("error: " + error);
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "scanner",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );

  document
    .getElementById("saveHintArray")
    .addEventListener("click", function () {
      let gameNumber = parseInt(document.getElementById("gameNumber").value);
      let puzzleNumber = parseInt(
        document.getElementById("puzzleNumber").value
      );
      let hintNumber = parseInt(document.getElementById("hintNumber").value);
      let hint = document.getElementById("hint").value;
      let qrString = document.getElementById("qrString").value;
      gameStructureArray[gameNumber].setHint(puzzleNumber, hintNumber, hint);
      gameStructureArray[gameNumber].setQrcode(
        puzzleNumber,
        hintNumber,
        qrString
      );
      $.ajax({
        url: "/admin/saveHintArray",
        type: "POST",
        data: { gameStructureArray },
        success: function (data) {
          document.getElementById("saveHintArray").innerHTML = "Saved!";
          setTimeout(function () {
            document.getElementById("saveHintArray").innerHTML = "Save";
          }, 5000);
        },
      });
    });

  document.getElementById("gameNumber").addEventListener("change", function () {
    loadPuzzles(parseInt(document.getElementById("gameNumber").value));
    loadHints(parseInt(document.getElementById("gameNumber").value), 0, 0);
  });

  document
    .getElementById("puzzleNumber")
    .addEventListener("change", function () {
      loadHints(
        parseInt(document.getElementById("gameNumber").value),
        parseInt(document.getElementById("puzzleNumber").value),
        0
      );
    });

  document.getElementById("hintNumber").addEventListener("change", function () {
    loadHintPairs(
      parseInt(document.getElementById("gameNumber").value),
      parseInt(document.getElementById("puzzleNumber").value),
      parseInt(document.getElementById("hintNumber").value)
    );
  });

  document.getElementById("addGame").addEventListener("click", function () {
    let gameStructure = new GameStructure("newGame", "~new game~");
    gameStructureArray.push(gameStructure);
    populatePage(gameStructureArray);
    document.getElementById("gameNumber").value = gameStructureArray.length - 1;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
    $("#adminModal").modal("show");
  });

  document.getElementById("removeGame").addEventListener("click", function () {
    let doomedGame = parseInt(document.getElementById("gameNumber").value);
    gameStructureArray.splice(doomedGame, 1);
    populatePage(gameStructureArray);
    document.getElementById("gameNumber").value = gameStructureArray.length - 1;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
  });

  document.getElementById("addPuzzle").addEventListener("click", function () {
    let gameNumber = parseInt(document.getElementById("gameNumber").value);
    gameStructureArray[gameNumber].addPuzzle();
    loadPuzzles(gameNumber);
    loadHints(gameNumber, 0, 0);
    loadHintPairs(gameNumber, 0, 0);
    let selector = document.getElementById("puzzleNumber");
    selector.value = parseInt(
      selector.options[selector.options.length - 1].value
    );
    document.getElementById("puzzleNumber").dispatchEvent(new Event("change"));
  });

  document
    .getElementById("removePuzzle")
    .addEventListener("click", function () {
      let gameNumber = parseInt(document.getElementById("gameNumber").value);
      gameStructureArray[gameNumber].delPuzzle(
        document.getElementById("puzzleNumber").value
      );
      loadPuzzles(gameNumber);
      loadHints(gameNumber, 0, 0);
      //  loadHintPairs(gameNumber, 0, 0);
      let selector = document.getElementById("puzzleNumber");
      selector.value = parseInt(selector.options[0].value);
      document
        .getElementById("puzzleNumber")
        .dispatchEvent(new Event("change"));
    });

  document.getElementById("changeName").addEventListener("click", function () {
    $("#adminModal").modal("show");
  });

  document.getElementById("okNewName").addEventListener("click", function () {
    let gameNumber = document.getElementById("gameNumber").value;
    let newName = document.getElementById("newGameName").value;
    let gameStructure = new GameStructure(gameStructureArray[gameNumber]);
    gameStructure.gameName = newName;
    gameStructureArray.splice(gameNumber, 1, gameStructure);
    selects[0].innerHTML = "";
    gameStructureArray.forEach((gameStructureData, index) => {
      let option = document.createElement("option");
      option.text = gameStructureData.gameName;
      option.value = index;
      document.getElementById("gameNumber").add(option);
    });
    document.getElementById("gameNumber").value = gameNumber;
    document.getElementById("gameNumber").dispatchEvent(new Event("change"));
    $("#adminModal").modal("hide");
  });

  document.getElementById("addHint").addEventListener("click", function () {
    let gameNumber = parseInt(document.getElementById("gameNumber").value);
    let puzzleNumber = parseInt(document.getElementById("puzzleNumber").value);
    gameStructureArray[gameNumber].addHint(puzzleNumber);
    loadHints(
      gameNumber,
      puzzleNumber,
      gameStructureArray[gameNumber].hintTree[puzzleNumber].length - 1
    );
    document.getElementById("hintNumber").value =
      document.getElementById("hintNumber").length - 1;
    document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  });

  document.getElementById("removeHint").addEventListener("click", function () {
    let gameNumber = parseInt(document.getElementById("gameNumber").value);
    let puzzleNumber = parseInt(document.getElementById("puzzleNumber").value);
    gameStructureArray[gameNumber].delHint(
      document.getElementById("puzzleNumber").value,
      document.getElementById("hintNumber").value
    );
    loadHints(gameNumber, puzzleNumber, 0);
    document.getElementById("hintNumber").value = 0;
    document.getElementById("hintNumber").dispatchEvent(new Event("change"));
  });
});
