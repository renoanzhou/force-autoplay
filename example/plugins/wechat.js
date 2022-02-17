const wechatAutoplayPlugin = (checkResult) => {
  const { media } = checkResult;

  function checkInWeChat() {
    return new Promise((resolve) => {
      window.WeixinJSBridge.invoke("getNetworkType", {}, () => {
        console.log(media);
        media
          .play()
          .then(() => {
            console.log("微信支持自动播放");
            resolve({
              media,
              result: true,
            });
          })
          .catch(() => {
            console.log("微信不支持自动播放");
          });
      });
    });
  }

  return new Promise((resolve) => {
    if (window.WeixinJSBridge) {
      checkInWeChat().then((rs) => {
        resolve(rs);
      });
    } else {
      document.addEventListener(
        "WeixinJSBridgeReady",
        () => {
          checkInWeChat().then((rs) => {
            resolve(rs);
          });
        },
        false
      );
    }
  });
};

window.wechatAutoplayPlugin = wechatAutoplayPlugin;