//wait for the DOM to finish loading
$(document).ready(function () {
  // all code to manipulate the DOM
  // goes inside this function

  console.log("main.js");
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
    document.getElementById("qrCode").innerHTML = decodedText;
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  //   function onScanSuccess(decodedText, decodedResult) {
  //     // Handle on success condition with the decoded text or result.
  //     console.log(`Scan result: ${decodedText}`, decodedResult);
  //   }

  //   var html5QrcodeScanner = new Html5QrcodeScanner("reader", {
  //     fps: 10,
  //     qrbox: 250,
  //   });
  //   html5QrcodeScanner.render(onScanSuccess);
});
