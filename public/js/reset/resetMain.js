$(document).ready(function () {
  $("#carouselMain").on("slide.bs.carousel", function (e) {
    if (e.direction == "right") {
      document.getElementsByClassName("carousel-control-prev")[1].click();
    } else {
      document.getElementsByClassName("carousel-control-next")[1].click();
    }
  });

  $("#carouselMain").on("slid.bs.carousel", function (e) {
    let activeImgCounter = 0;
    let carItems = document
      .getElementById("innerCarousel")
      .getElementsByClassName("carousel-item");
    for (let i = 0; i < carItems.length; i++) {
      if (carItems[i].classList.contains("active")) {
        activeImgCounter = carItems[i]
          .getElementsByTagName("img")[0]
          .getAttribute("counter");
      }
      document.getElementById(
        "mainCarouselTitle"
      ).innerText = `Picture To Match Number: ${parseInt(activeImgCounter)}`;
    }
  });

  $("#clientCarousel").on("slide.bs.carousel", function (e) {
    if (e.direction == "right") {
      document.getElementsByClassName("carousel-control-prev")[0].click();
    } else {
      document.getElementsByClassName("carousel-control-next")[0].click();
    }
  });

  let resetImgs = document.getElementById("dlUrl").innerText;
  resetImgs = resetImgs.trim();
  resetImgs = resetImgs.split(",");
  resetImgs.forEach((img, index) => {
    let carouselItemTemplate = document.getElementById("carouselItemTemplate")
      .children[0];
    let newCarouselItem = carouselItemTemplate.cloneNode(true);
    let newClientCarouselItem = carouselItemTemplate.cloneNode(true);
    newCarouselItem.getElementsByTagName("img")[0].src = img;
    newCarouselItem.getElementsByTagName("img")[0].alt = "asdf";
    //add attribute to img
    newCarouselItem
      .getElementsByTagName("img")[0]
      .setAttribute("counter", index + 1);
    newClientCarouselItem
      .getElementsByTagName("img")[0]
      .setAttribute("counter", index + 1);
    newClientCarouselItem.getElementsByTagName("img")[0].src =
      "./images/placeholder.png";
    newClientCarouselItem.getElementsByTagName("img")[0].alt = "asdfasdf";
    if (index == 0) {
      newCarouselItem.classList.add("active");
      newClientCarouselItem.classList.add("active");
    }
    document.getElementById("innerCarousel").appendChild(newCarouselItem);
    document
      .getElementById("innerClientCarousel")
      .appendChild(newClientCarouselItem);
  });

  document.getElementById("submitPictures").addEventListener("click", (e) => {
    let innerClientCarouselChildren = document.getElementById(
      "innerClientCarousel"
    ).children;
    for (let i = 0; i < innerClientCarouselChildren.length; i++) {
      let clientImg =
        innerClientCarouselChildren[i].getElementsByTagName("img")[0].src;
      console.log("img", clientImg);
      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
      }
      toDataURL(clientImg, function (dataUrl) {
        $.ajax({
          url: "/download",
          type: "POST",
          data: { url: dataUrl, number: i + 1 },
          success: function (data) {},
          error: function (err) {
            console.log("err", err);
          },
        });
      });
    }
  });
  var video = document.getElementById("video");
  async function videoStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      video.srcObject = stream;
      document.getElementById("takePicture").addEventListener("click", (e) => {
        const canvas = document.createElement("canvas");
        canvas.width = video.width;
        canvas.height = video.height;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, video.width, video.height);
        let img = canvas
          .toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");
        let carouselItemTemplate = document.getElementById(
          "carouselItemTemplate"
        ).children[0];
        let newCarouselItem = carouselItemTemplate.cloneNode(true);
        console.log(newCarouselItem);
        newCarouselItem.getElementsByTagName("img")[0].src = img;
        let innerCarouselChildren =
          document.getElementById("innerCarousel").children;
        for (let i = 0; i < innerCarouselChildren.length; i++) {
          if (innerCarouselChildren[i].classList.contains("active")) {
            {
              document
                .getElementById("innerClientCarousel")
                .children[i].getElementsByTagName("img")[0].src = img;
              let clientCarouselItems = document.getElementById(
                "innerClientCarousel"
              ).children;
              for (let i = 0; i < clientCarouselItems.length; i++) {
                if (clientCarouselItems[i].classList.contains("active")) {
                  clientCarouselItems[i].classList.remove("active");
                }
              }
              clientCarouselItems[i].classList.add("active");
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  document.getElementById("requestCam").addEventListener("click", (e) => {
    document.getElementById("videoDiv").style.display = "block";
    videoStream();
  });
});
