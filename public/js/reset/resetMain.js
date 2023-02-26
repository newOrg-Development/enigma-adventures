//https://web.dev/getusermedia-intro/

$(document).ready(function () {
  //get pictures from public\images\resetImgs

  //   let carouselTemplate = document.getElementById(
  //     "carouselItemTemplate"
  //   ).innerHTML;
  //   let dlUrl = document.getElementById("dlUrl").innerText;
  //   console.log(dlUrl);
  //   dlUrl = dlUrl.split(",");

  //   //carousel change event

  //   //download img from dlUrl

  //   //display dlurl as img
  //   document.getElementById("dlImg").src = dlUrl[0].trim();

  $("#carouselMain").on("slid.bs.carousel", function (e) {
    let innerCarouselChildren =
      document.getElementById("innerCarousel").children;
    let innerClientCarouselChildren = document.getElementById(
      "innerClientCarousel"
    ).children;
    for (let j = 0; j < innerClientCarouselChildren.length; j++) {
      if (innerClientCarouselChildren[j].classList.contains("active")) {
        console.log("removing");
        innerClientCarouselChildren[j].classList.remove("active");
      }
    }
    for (let i = 0; i < innerCarouselChildren.length; i++) {
      if (innerCarouselChildren[i].classList.contains("active")) {
        {
          innerClientCarouselChildren[i].classList.add("active");
          document.getElementById("mainCarouselTitle").innerText =
            "Picture To Match Number: " + (i + 1);
        }
      }
    }
  });

  $("#clientCarousel").on("slid.bs.carousel", function (e) {
    let innerCarouselChildren =
      document.getElementById("innerCarousel").children;
    let innerClientCarouselChildren = document.getElementById(
      "innerClientCarousel"
    ).children;

    for (let j = 0; j < innerCarouselChildren.length; j++) {
      if (innerCarouselChildren[j].classList.contains("active")) {
        innerCarouselChildren[j].classList.remove("active");
      }
    }
    for (let i = 0; i < innerClientCarouselChildren.length; i++) {
      if (innerClientCarouselChildren[i].classList.contains("active")) {
        {
          innerCarouselChildren[i].classList.add("active");
          document.getElementById("mainCarouselTitle").innerText =
            "Picture To Match Number: " + (i + 1);
        }
      }
    }
  });
  let resetImgs = document.getElementById("dlUrl").innerText;
  resetImgs = resetImgs.trim();
  resetImgs = resetImgs.split(",");

  resetImgs.forEach((img, index) => {
    let carouselItemTemplate = document.getElementById("carouselItemTemplate")
      .children[0]; // .cloneNode(true)
    let newCarouselItem = carouselItemTemplate.cloneNode(true);
    let newClientCarouselItem = carouselItemTemplate.cloneNode(true);

    // let serverImg =   "/images/resetImgs/" + img.trim();
    let googleDriveImg = img;
    //  console.log(googleDriveImg);
    //  console.log("img ", img, " times ", index);
    newCarouselItem.getElementsByTagName("img")[0].src = img;

    //get /proxy
    // $.ajax({
    //   url: "/proxy",
    //   type: "GET",
    //   data: { url: googleDriveImg },
    //   success: function (data) {
    //     console.log("data");
    //     // newCarouselItem.getElementsByTagName("img")[0].src = data;
    //   },
    //   error: function (err) {
    //     console.log("err", err);
    //   },
    // });

    newClientCarouselItem.getElementsByTagName("img")[0].src =
      "./images/placeholder-400X200.png";

    //make the first image active
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
    //function sendImages() {
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
        console.log("RESULT:", dataUrl);

        //console.log("firstImg", firstImg);
        $.ajax({
          url: "/download",
          type: "POST",
          data: { url: dataUrl, number: i + 1 },
          success: function (data) {
            console.log("data");
            console.log(data);
          },
          error: function (err) {
            console.log("err", err);
          },
        });
      });
    }

    // sendImages();
  });

  //setTimeout(sendImages, 5000);

  // Navigator video stream
  var video = document.getElementById("video");
  // var picture = document.getElementById("shot");
  async function videoStream() {
    try {
      console.log(video);
      //console.log(picture);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      // Set video source
      video.srcObject = stream;

      //Take a picture on K press
      document.getElementById("takePicture").addEventListener("click", (e) => {
        // console.log(e.code);
        // const video = document.getElementById("video");
        // const picture = document.getElementById("shot");
        // Create a Canvas
        const canvas = document.createElement("canvas");
        // Set canvas width and height
        canvas.width = video.width;
        canvas.height = video.height;
        console.log("heights", canvas.width, canvas.height);
        // Draw a new image
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, video.width, video.height);
        // Take a shot
        // console.log("vancs", canvas);
        let img = canvas
          .toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");
        console.log("img", img);
        // Set Image src
        // picture.src = img;
        // resetImgs.forEach((img, index) => {
        let carouselItemTemplate = document.getElementById(
          "carouselItemTemplate"
        ).children[0]; // .cloneNode(true)
        let newCarouselItem = carouselItemTemplate.cloneNode(true);
        console.log(newCarouselItem);
        newCarouselItem.getElementsByTagName("img")[0].src = img;
        //   newCarouselItem.getElementsByTagName("img")[0].src =
        //     "/images/resetImgs/" + img.trim();

        //get the active carousel item from innerCarousel
        let innerCarouselChildren =
          document.getElementById("innerCarousel").children;

        //check  carouselItems for active class
        for (let i = 0; i < innerCarouselChildren.length; i++) {
          if (innerCarouselChildren[i].classList.contains("active")) {
            {
              document
                .getElementById("innerClientCarousel")
                .children[i].getElementsByTagName("img")[0].src = img;
              console.log("i", i);
              //add active class
              let clientCarouselItems = document.getElementById(
                "innerClientCarousel"
              ).children;
              //check  carouselItems for active class
              for (let i = 0; i < clientCarouselItems.length; i++) {
                if (clientCarouselItems[i].classList.contains("active")) {
                  //remove active class
                  clientCarouselItems[i].classList.remove("active");
                }
              }
              clientCarouselItems[i].classList.add("active");
            }
          }
        }
        //get all carousel items from innerClientCarousel

        // let innerCarouselItems =
        //   document.getElementById("innerCarousel").children;
        // for (let i = 0; i < innerCarouselItems.length; i++) {
        //   //add active class to last item
        //   if (innerCarouselItems[i].classList.contains("active")) {
        //     //remove active class
        //     innerCarouselItems[i].classList.remove("active");
        //   }
        //   clientCarouselItems[clientCarouselItems.length - 1].classList.add(
        //     "active"
        //   );
        //   innerCarouselItems[clientCarouselItems.length - 1].classList.add(
        //     "active"
        //   );
        // }

        //  });
        // Save image file
        // const anchorTag = document.createElement("a");
        // anchorTag.href = img;
        // anchorTag.download = "my-image.jpeg";
        // document.body.appendChild(anchorTag);
        // anchorTag.click();
      });
    } catch (err) {
      console.log(err);
    }
  }
  // Run function
  document.getElementById("requestCam").addEventListener("click", (e) => {
    document.getElementById("videoDiv").style.display = "block";
    videoStream();
  });
  //document.getElementById("requestCam").click();
});
