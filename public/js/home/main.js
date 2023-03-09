$(document).ready(function () {
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

  document.getElementById("submitData").addEventListener("click", function () {
    let qrCodeData =
      document.getElementById("qrCodeData").options[
        document.getElementById("qrCodeData").selectedIndex
      ].text;

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
