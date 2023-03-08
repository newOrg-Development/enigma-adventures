$(document).ready(function () {
  if (document.getElementById("sessionData").innerText != "") {
    let session = document.getElementById("sessionData").innerText;

    document.getElementById("logoutDiv").style.display = "block";
    // document.getElementById("sessionData").innerText = session;
    session = JSON.parse(session);
    if (session.env == "production") {
      document.getElementById("magicUrl").innerText =
        "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
        session.uuid;
    } else {
      let url = "https://localhost:3000/magicLink?uuid=" + session.uuid;
      document.getElementById("magicUrl").innerText = url;
    }
  }

  document.getElementById("qrCodeData").addEventListener("change", function () {
    if (
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text == "signUp"
    ) {
      document.getElementById("signUpHidder").style.display = "block";
    } else {
      document.getElementById("signUpHidder").style.display = "none";
    }
  });

  document.getElementById("qrCodeData").addEventListener("change", function () {
    if (
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text == "hint"
    ) {
      document.getElementById("hintHidder").style.display = "block";
    } else {
      document.getElementById("hintHidder").style.display = "none";
    }
  });

  if (document.getElementById("sessionData").innerText != "") {
    document.getElementById("logoutDiv").style.display = "block";
  }

  document.getElementById("showScanner").addEventListener("click", function () {
    let x = document.getElementById("scanner");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  });

  function onScanSuccess(decodedText, decodedResult) {
    let select = document.getElementById("qrCodeData");
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text == decodedText) {
        select.selectedIndex = i;
        document.getElementById("html5-qrcode-button-camera-stop").click();
        break;
      }
    }
  }

  function onScanFailure(error) {
    console.log("error: " + error);
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "scanner",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);

  document.getElementById("submitData").addEventListener("click", function () {
    let qrCodeData =
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text;

    if (qrCodeData == "signUp") {
      let teamName = document.getElementById("teamName").value;
      let teamEmail = document.getElementById("teamEmail").value;
      if (teamName && teamEmail) {
        $.ajax({
          type: "POST",
          url: "/signUp",
          data: {
            teamName: teamName,
            teamEmail: teamEmail,
            gameNumber: 0,
          },
          success: function (msg) {
            if (msg == "failed") {
              alert("Failed to create session.");
            } else {
              document.getElementById("logoutDiv").style.display = "block";
              document.getElementById("sessionData").innerText = "";
              document.getElementById("sessionData").innerText =
                JSON.stringify(msg);
              let sendEmailBool = document.getElementById("sendEmail").checked;
              if (msg.env == "production") {
                document.getElementById("magicUrl").innerText =
                  "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
                  msg.uuid;
                if (sendEmailBool) {
                  sendEmail();
                }
              } else {
                document.getElementById("magicUrl").innerText =
                  "https://localhost:3000/magicLink?uuid=" + msg.uuid;
                if (sendEmailBool) {
                  sendEmail();
                }
              }
              function sendEmail() {
                let teamName = document.getElementById("teamName").value;
                let teamEmail = document.getElementById("teamEmail").value;
                let magicLink = document.getElementById("magicUrl").innerText;
                $.ajax({
                  type: "POST",
                  url: "/email",
                  data: {
                    teamName: teamName,
                    teamEmail: teamEmail,
                    magicLink: magicLink,
                  },
                  success: function (msg) {
                    if (msg == "false") {
                    } else {
                    }
                  },
                });
              }
            }
          },
        });
      } else {
        alert("You must enter a team name and email to continue.");
      }
    } else {
      let session = document.getElementById("sessionData").innerText;
      if (session != "") {
        session = JSON.parse(session);
      }

      let uuid = session.uuid;
      let gameId = document.getElementById("gameNumForHint").value;
      let puzzleNum = document.getElementById("puzzleNumForHint").value;

      if (!uuid) {
        alert("You must be logged in to do that.");
      } else if (qrCodeData == "hint") {
        $.ajax({
          type: "POST",
          url: "/getHint",
          data: {
            uuid,
            puzzleNum,
            gameId,
          },
          success: function (msg) {
            if (msg === "false") {
              alert("No more hints for this puzzle!");
            } else {
              alert(JSON.stringify(msg));
              console.log(JSON.stringify(msg));
            }
          },
        });
      } else if (qrCodeData == "gameEnd") {
        let timestamp = new Date().getTime();
        $.ajax({
          type: "POST",
          url: "/gameEnd",
          data: {
            uuid,
            timestamp,
          },
          success: function (data) {
            console.log("data", data);
            if (data === "false") {
              alert("Already Finished");
            } else {
              alert("Finished game at time:" + data);
            }
          },
        });
      } else if (qrCodeData == "clue") {
        console.log("clue", uuid);
        $.ajax({
          type: "GET",
          url: "/clue",
          data: {
            uuid,
          },
          success: function (linkPairs) {
            if (linkPairs == "false") {
              alert("You aren't signed in!");
            } else {
              linkPairs.forEach((linkPair) => {
                if (linkPair[0].includes("clue1.mp4")) {
                  console.log("clue: " + linkPair);
                  document.getElementById("clueIframe").src = linkPair[1];
                  $("#clueModal").modal("show");
                }
              });
            }
          },
        });
      }
    }
  });
});
