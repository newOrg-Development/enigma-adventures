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
      // sendEmail = document.getElementById("sendEmail").checked;
      // console.log("sendEmail: " + sendEmail);
      // let teamPassword = document.getElementById("teamPassword").value;
      // let qrCodeData = document.getElementById("qrCodeData").value;
      // get selected value from qrCodeData select
      //     let qrCodeData = document.getElementById("qrCodeData").value;
      // console.log("qrCodeData: " + qrCodeData);

      //get timestamp
      let timestamp = new Date().getTime();
      console.log("timestamp: " + timestamp);
      $.ajax({
        type: "POST",
        url: "/signUp",
        data: {
          teamName: teamName,
          teamEmail: teamEmail,
          timestamp: timestamp,
          //teamPassword: teamPassword,
          qrCodeData: "signUp",
          // username: "user1",
          //  password: "mypassword",
        },
        success: function (msg) {
          if (msg == "false") {
          } else {
            console.log("msg: " + JSON.stringify(msg));
            document.getElementById("logoutDiv").style.display = "block";
            document.getElementById("sessionData").innerText =
              JSON.stringify(msg);

            //make a url out of the msg
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
            // $("#success-saved").removeAttr("hidden");
            // $("#success-saved").show("fade");
            // document.getElementById("alert-successsaveClose").onclick =
            //   function () {
            //     document
            //       .getElementById("success-saved")
            //       .setAttribute("hidden", "true");
            //   };

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
                  //teamPassword: teamPassword,
                  magicLink: magicLink,
                },
                success: function (msg) {
                  if (msg == "false") {
                  } else {
                    // $("#success-saved").removeAttr("hidden");
                    // $("#success-saved").show("fade");
                    // document.getElementById("alert-successsaveClose").onclick =
                    //   function () {
                    //     document
                    //       .getElementById("success-saved")
                    //       .setAttribute("hidden", "true");
                    //   };
                  }
                },
              });
            }
          }
        },
      });
    } else {
      let session = document.getElementById("sessionData").innerText;
      if (session != "") {
        session = JSON.parse(session);
      }

      let timestamp = session.timestamp;
      let teamName = session.teamName;
      let cluesUsed = session.cluesUsed;
      let uuid = session.uuid;
      if (!uuid) {
        alert("You must be logged in to do that.");
      } else if (qrCodeData == "hint") {
        $.ajax({
          type: "POST",
          url: "/getHint",
          data: {
            uuid,
          },
          success: function (msg) {
            if (msg == "false") {
            } else {
            }
          },
        });
      } else if (qrCodeData == "gameEnd") {
        $.ajax({
          type: "POST",
          url: "/gameEnd",
          data: {
            uuid,
            timestamp,
            teamName,
            cluesUsed,
          },
          success: function (msg) {
            if (msg == "false") {
            } else {
            }
          },
        });
      } else if (qrCodeData == "clue") {
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
