//import { hinter } from "./getHint.js";
$(document).ready(function () {
  //toggle display for signUphidder with qrCodeData is signUp

  document.getElementById("qrCodeData").addEventListener("change", function () {
    if (
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text == "signUp"
    ) {
      //toggle signUpDiv display
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
  function updateHints() {
    if ((document.getElementById("qrCodeData").value = "hint")) {
      let sessionData = document.getElementById("sessionData").innerText;
      if (document.getElementById("sessionData").innerText != "") {
        sessionData = JSON.parse(sessionData);
        console.log("sessionData: " + sessionData.uuid);
      } else {
        console.log("not logged in");
      }
      $.ajax({
        type: "POST",
        url: "/updateHint",
        data: {
          uuid: sessionData.uuid,
        },
        success: function (msg) {
          if (msg == "false") {
          } else {
            console.log("msg: " + JSON.stringify(msg));
          }
        },
      });
    }
  }

  function onScanSuccess(decodedText, decodedResult) {
    document.getElementById("qrCodeData").value = decodedText;

    updateHints();
  }

  function onScanFailure(error) {
    // console.warn(`Code scan error = ${error}`);
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "scanner",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);

  // document.getElementById("signUp").addEventListener("click", function () {
  //   let teamName = document.getElementById("teamName").value;
  //   let teamEmail = document.getElementById("teamEmail").value;
  //   // let teamPassword = document.getElementById("teamPassword").value;
  //   // let qrCodeData = document.getElementById("qrCodeData").value;
  //   // get selected value from qrCodeData select
  //   //     let qrCodeData = document.getElementById("qrCodeData").value;
  //   // console.log("qrCodeData: " + qrCodeData);

  //   //get timestamp
  //   let timestamp = new Date().getTime();
  //   console.log("timestamp: " + timestamp);
  //   $.ajax({
  //     type: "POST",
  //     url: "/signUp",
  //     data: {
  //       teamName: teamName,
  //       teamEmail: teamEmail,
  //       timestamp: timestamp,
  //       //teamPassword: teamPassword,
  //       qrCodeData: qrCodeData,
  //       username: "user1",
  //       password: "mypassword",
  //     },
  //     success: function (msg) {
  //       if (msg == "false") {
  //       } else {
  //         console.log("msg: " + JSON.stringify(msg));
  //         document.getElementById("logoutDiv").style.display = "block";
  //         document.getElementById("sessionData").innerText =
  //           JSON.stringify(msg);

  //         //make a url out of the msg

  //         if (msg.env == "production") {
  //           document.getElementById("magicUrl").innerText =
  //             "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
  //             msg.uuid;
  //         } else {
  //           let url = "https://localhost:3000/magicLink?uuid=" + msg.uuid;
  //           document.getElementById("magicUrl").innerText = url;
  //         }
  //         // $("#success-saved").removeAttr("hidden");
  //         // $("#success-saved").show("fade");
  //         // document.getElementById("alert-successsaveClose").onclick =
  //         //   function () {
  //         //     document
  //         //       .getElementById("success-saved")
  //         //       .setAttribute("hidden", "true");
  //         //   };
  //       }
  //     },
  //   });
  // });

  document.getElementById("submitData").addEventListener("click", function () {
    // let teamName = document.getElementById("teamName").value;
    // let teamEmail = document.getElementById("teamEmail").value;
    //let teamPassword = document.getElementById("teamPassword").value || "";

    let qrCodeData =
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text;

    if (qrCodeData == "signUp") {
      let teamName = document.getElementById("teamName").value;
      let teamEmail = document.getElementById("teamEmail").value;
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
          username: "user1",
          password: "mypassword",
        },
        success: function (msg) {
          if (msg == "false") {
          } else {
            console.log("msg: " + JSON.stringify(msg));
            document.getElementById("logoutDiv").style.display = "block";
            document.getElementById("sessionData").innerText =
              JSON.stringify(msg);

            //make a url out of the msg

            if (msg.env == "production") {
              document.getElementById("magicUrl").innerText =
                "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
                msg.uuid;
            } else {
              let url = "https://localhost:3000/magicLink?uuid=" + msg.uuid;
              document.getElementById("magicUrl").innerText = url;
            }
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
    } else {
      // console.log("qrCodeData: " + qrCodeData);
      let session = document.getElementById("sessionData").innerText;
      session = JSON.parse(session);
      let uuid = session.uuid;
      let timestamp = session.timestamp;
      let teamName = session.teamName;
      let cluesUsed = session.cluesUsed;
      if (uuid == undefined) {
        uuid = "";
      }
      if (qrCodeData == "hint" && uuid != "") {
        //hinter();
        $.ajax({
          type: "POST",
          url: "/updateHint",
          data: {
            uuid,
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
      } else if (qrCodeData == "email") {
        $.ajax({
          type: "POST",
          url: "/email",
          data: {
            teamName: teamName,
            teamEmail: teamEmail,
            //teamPassword: teamPassword,
            qrCodeData: qrCodeData,
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
      } else if (qrCodeData == "hint" && uuid == "") {
        alert("You must be logged in to get a hint");
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
  });
});
