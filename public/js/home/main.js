$(document).ready(function () {
  // document.getElementById("eBool").addEventListener("change", function () {
  //   console.log("eBool", document.getElementById("ebool").checked);
  // });

  document.getElementById("eBool").addEventListener("change", function () {
    this.value = this.checked ? "true" : "false";
    console.log("eBool", document.getElementById("eBool").checked);
  });

  (function () {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();

  document.getElementById("qrCodeData").addEventListener("change", function () {
    if (
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text == "signUp"
    ) {
      document.getElementById("signUpHidder").style.display = "block";
      document.getElementById("signIn").style.display = "block";
      document.getElementById("submitData").style.display = "none";
    } else {
      document.getElementById("signUpHidder").style.display = "none";
      document.getElementById("signIn").style.display = "none";
      document.getElementById("submitData").style.display = "block";
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
  // Fetch all the forms we want to apply custom Bootstrap validation styles to

  $("#loginForm").on("submit", function () {
    signIn();
    function signIn() {
      // console.log("signing in frsit ");
      // console.log("signing in", document.getElementById("emailBool").value);
      if (qrCodeData == "signUp") {
        console.log("teamName: ");
        let teamName = document.getElementById("teamName").value;
        let teamEmail = document.getElementById("teamEmail").value;
        let gameNumber = document.getElementById("gameNumber").value;
        let emailBool = document.getElementById("emailBool").checked;
        // let tempBooler = "";
        // if (emailBool) {
        //   tempBooler = "true";
        // } else {
        //   tempBooler = "false";
        // }
        console.log("teamName: ");
        //     console.log("meailBool: " + tempBooler);
        if (teamName && teamEmail) {
          console.log("sending: ");
          $.ajax({
            type: "POST",
            url: "/signUp",
            data: {
              teamName: teamName,
              teamEmail: teamEmail,
              gameNumber: gameNumber,
              emailBool: "true",
            },
            success: function (msg) {
              if (msg == "failed") {
                alert("Failed to create session.");
              } else {
                console.log("early");
                // document.getElementById("sessionData").innerText = "";
                // document.getElementById("sessionData").innerText =
                //   JSON.stringify(msg);
                let sendEmailBool =
                  document.getElementById("sendEmail").checked;
                if (msg.env == "production") {
                  let magicLink =
                    "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
                    msg.uuid;
                  // document.getElementById("magicUrl").innerText = magicLink;
                  if (sendEmailBool) {
                    sendEmail(magicLink);
                  }
                } else {
                  let magicLink =
                    "https://localhost:3000/magicLink?uuid=" + msg.uuid;
                  //  document.getElementById("magicUrl").innerText = magicLink;
                  if (sendEmailBool) {
                    sendEmail(magicLink);
                  }
                }
                function sendEmail(link) {
                  let teamName = document.getElementById("teamName").value;
                  let teamEmail = document.getElementById("teamEmail").value;
                  $.ajax({
                    type: "POST",
                    url: "/email",
                    data: {
                      teamName: teamName,
                      teamEmail: teamEmail,
                      magicLink: link,
                    },
                    success: function (msg) {
                      if (msg == "false") {
                      } else {
                      }
                    },
                  });
                }
                console.log("late");
                //redirects
                // window.location.assign("/");
                //   return false;
              }
            },
          });
        } else {
          alert("You must enter a team name and email to continue.");
        }
      }
    }
  });

  document.getElementById("submitData").addEventListener("click", function () {
    let qrCodeData =
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text;

    // let session = document.getElementById("sessionData").innerText;
    // if (session != "") {
    //   session = JSON.parse(session);
    // }

    let gameId = document.getElementById("gameNumForHint").value;
    let puzzleNum = document.getElementById("puzzleNumForHint").value;

    if (qrCodeData == "hint") {
      $.ajax({
        type: "POST",
        url: "/getHint",
        data: {
          // uuid,
          puzzleNum,
          gameId,
        },
        success: function (msg) {
          if (msg === "false") {
            alert("No more hints for this puzzle!");
          } else if (msg === "noAuth") {
            alert("You are not logged in!");
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
          timestamp,
        },
        success: function (data) {
          if (data === "noAuth") {
            alert("You are not logged in!");
          } else if (data === "false") {
            alert("Already Finished");
          } else {
            alert("Finished game at time:" + data);
          }
        },
      });
    } else if (qrCodeData == "clue") {
      $.ajax({
        type: "GET",
        url: "/clue",
        data: {},
        success: function (linkPairs) {
          if (linkPairs === "noAuth") {
            alert("You are not logged in!");
          } else if (linkPairs == "false") {
            alert("You aren't signed in!");
          } else {
            linkPairs.forEach((linkPair) => {
              if (linkPair[0].includes("clue1.mp4")) {
                document.getElementById("clueIframe").src = linkPair[1];
                $("#clueModal").modal("show");
              }
            });
          }
        },
      });
    }
  });
});
