//import { hinter } from "./getHint.js";
$(document).ready(function () {
  document.getElementById("showScanner").addEventListener("click", function () {
    let x = document.getElementById("scanner");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  });

  function onScanSuccess(decodedText, decodedResult) {
    document.getElementById("qrCodeData").value = decodedText;
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

  document.getElementById("submitData").addEventListener("click", function () {
    let teamName = document.getElementById("teamName").value || "";
    let teamEmail = document.getElementById("teamEmail").value || "";
    let teamPassword = document.getElementById("teamPassword").value || "";
    let qrCodeData = document.getElementById("qrCodeData").value || "";

    if (qrCodeData == "hint") {
      hinter();
    } else if (qrCodeData == "new") {
      $.ajax({
        type: "POST",
        url: "/email",
        data: {
          teamName: teamName,
          teamEmail: teamEmail,
          teamPassword: teamPassword,
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
