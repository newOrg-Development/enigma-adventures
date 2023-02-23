//import { hinter } from "./getHint.js";
$(document).ready(function () {
  // let sessionData = document.getElementById("sessionData").innerText;
  // sessionData = sessionData.split("&&");
  // console.log("sessionData: " + sessionData.length);
  // sessionData.forEach(gameState => {
  //   let gameStateElements = gameState.split(';');

  // });
  // //get data betweeen uuid and TeamName
  // let uuid = sessionData[0].split("uuid")[1];
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

  document.getElementById("signUp").addEventListener("click", function () {
    let teamName = document.getElementById("teamName").value;
    let teamEmail = document.getElementById("teamEmail").value;
    // let teamPassword = document.getElementById("teamPassword").value;
    let qrCodeData = document.getElementById("qrCodeData").value;

    $.ajax({
      type: "POST",
      url: "/signUp",
      data: {
        teamName: teamName,
        teamEmail: teamEmail,
        //teamPassword: teamPassword,
        qrCodeData: qrCodeData,
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
  });

  document.getElementById("submitData").addEventListener("click", function () {
    // let teamName = document.getElementById("teamName").value;
    // let teamEmail = document.getElementById("teamEmail").value;
    //let teamPassword = document.getElementById("teamPassword").value || "";
    let qrCodeData = document.getElementById("qrCodeData").value;
    let session = document.getElementById("sessionData").innerText;
    session = JSON.parse(session);
    let uuid = session.uuid;
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
    } else if (qrCodeData == "new") {
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
    }
  });
});
