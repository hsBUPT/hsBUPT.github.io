/*
作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

// 背景图片 Cookies
function setBgImg(bg_img) {
  if (bg_img) {
    Cookies.set("bg_img", bg_img, {
      expires: 36500,
    });
    return true;
  }
  return false;
}

// 获取背景图片 Cookies
function getBgImg() {
  let bg_img_local = Cookies.get("bg_img");
  if (bg_img_local && bg_img_local !== "{}") {
    return JSON.parse(bg_img_local);
  } else {
    setBgImg(bg_img_preinstall);
    return bg_img_preinstall;
  }
}

function setBgImgDefault() {
  let imgIndex = 1 + ~~(Math.random() * 3); //3为图片数量
  // console.log(imgIndex);
  let imgUrl = `./img/background${imgIndex}.webp`;
  let attempts = 0;
  const maxAttempts = 3;

  // 避免重复随机到同一张图片
  // 前提是背景图片有多张
  let bg_img = getBgImg();
  console.log(bg_img[1])
  while (attempts++ < maxAttempts) {
    console.log(attempts);
    if (bg_img[1] === imgUrl) {
      imgIndex = 1 + ~~(Math.random() * 3);
      imgUrl = `./img/background${imgIndex}.webp`;
    } else {
      bg_img[1] = imgUrl;
      setBgImg(bg_img);
      console.log(imgUrl);
      break;
    }
  }

  return (callback) => {
    const img = new Image();

    img.onload = () => {
      if (img.naturalWidth !== 0) {
        callback(imgUrl); // 图片加载成功，调用回调函数并传入图片URL
      } else {
        callback("./img/background1.webp"); // 使用默认图片URL
      }
    };

    img.onerror = () => {
      callback("./img/background1.webp"); // 图片加载失败，使用默认图片URL
    };

    img.src = imgUrl;
  }
}

let bg_img_preinstall = {
  type: "1", // 1:默认背景 2:每日一图 3:随机风景 4:随机动漫
  1: "./img/background1.webp", // 默认背景
  2: "https://api.dujin.org/bing/1920.php", // 每日一图
  3: "https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images", // 随机风景
  4: "https://www.dmoe.cc/random.php", // 随机动漫
};

// 随机默认壁纸url加载
if (getBgImg()["type"] === "1") {
  setBgImgDefault()((imgUrl) => {
    console.log(imgUrl);
    bg_img_preinstall[1] = imgUrl;
  });
}

// 更改背景图片
function setBgImgInit() {
  let bg_img = getBgImg();
  $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

  // switch (bg_img["type"]) {
  //   case "1":
  //     // $("#bg").attr(
  //     //   "src",
  //     //   `./img/background${1 + ~~(Math.random() * 10)}.webp`
  //     // ); //随机默认壁纸
  //     break;
  //   case "2":
  //     // $("#bg").attr("src", bg_img_preinstall[2]); //必应每日
  //     break;
  //   case "3":
  //     // $("#bg").attr("src", bg_img_preinstall[3]); //随机风景
  //     break;
  //   case "4":
  //     // $("#bg").attr("src", bg_img_preinstall[4]); //随机动漫
  //     break;
  // }
  // 初始背景加载
  $("body").css("background-image", `url("${bg_img_preinstall[bg_img["type"]]}")`);
}

// 即时切换背景图片
function changeBg(type) {
  let bg_img = getBgImg();
  bg_img["type"] = type;
  setBgImg(bg_img);

  $("body").css("background-image", `url("${bg_img_preinstall[type]}")`);
}

$(document).ready(function () {
  // 壁纸数据加载
  setBgImgInit();
  // 设置背景图片
  $("#wallpaper").on("click", ".set-wallpaper", function () {
    let type = $(this).val();
    // let bg_img = getBgImg();
    // bg_img["type"] = type;
    changeBg(type);
    iziToast.show({
      icon: "fa-solid fa-image",
      timeout: 2500,
      message: "壁纸设置成功，刷新后生效",
    });
    // setBgImg(bg_img);
  });
});
