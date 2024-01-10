function videoCardClickCapture(media_id, block_id, type) {
  const section = document.querySelector(`#type-${block_id}`).innerText;
  let data_capture_id = `video_card_click_${media_id}_${block_id}_${type}`;
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element?.getAttribute("data-playlist-id");
  let objectToPush = {
    event_name: "video_card_click",
    media_id: media_id,
    screen: "playlist",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    section: section,
    device: deviceTypeDetect(),
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function viewButtonClickCapture(media_id, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `view_button_click_${media_id}_${block_id}_${shop}`;
  let objectToPush = {
    event_name: "view_button_click",
    media_id: media_id,
    screen: "playlist",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    section: type,
    device: deviceTypeDetect(),
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function sectionSwipeCapture(block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `section_swipe_${type}_${block_id}_${shop}`;
  let objectToPush = {
    event_name: "section_swipe",
    screen: "playlist",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    section: type,
    device: deviceTypeDetect(),
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function slideChangeCapture(currentIndex, node, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let currentSlide = node.slides[currentIndex];
  let playlist_id = currentSlide.getAttribute("data-playlist-id");
  let media_id = currentSlide.getAttribute("data-media-id");
  let data_capture_id = `slide_change_${currentIndex}_${playlist_id}_${media_id}_${shop}_${type}`;
  let objectToPush = {
    event_name: "slide_change",
    media_id: media_id,
    page: page,
    screen: "playlist",
    playlist_id: playlist_id,
    count: 1,
    data_capture_id: data_capture_id,
    section: type,
    device: deviceTypeDetect(),
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function atcClickCapture(media_id, product_id, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let deviceType = deviceTypeDetect();
  let data_capture_id = `atc_click_${media_id}_${block_id}_${product_id}_${shop}_${type}`;
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let objectToPush = {
    event_name: "atc_click",
    media_id: media_id,
    screen: "playlist",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    product_id: product_id,
    section: type,
    device: deviceTypeDetect(),
    screen: "product_details_drawer",
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function buyNowClickCapture(media_id, product_id, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let deviceType = deviceTypeDetect();
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `buy_now_click_${media_id}_${product_id}_${block_id}_${type}`;
  let objectToPush = {
    event_name: "buy_now_click",
    media_id: media_id,
    screen: "playlist",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    product_id: product_id,
    section: type,
    device: deviceTypeDetect(),
    screen: "product_details_drawer",
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function viewDetailsClickCapture(media_id, product_id, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let deviceType = deviceTypeDetect();
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `view_details_click_${media_id}_${product_id}_${block_id}_${type}`;
  let objectToPush = {
    event_name: "view_details_click",
    media_id: media_id,
    screen: "media_modal",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    product_id: product_id,
    section: type,
    device: deviceTypeDetect(),
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}

function offerCopiedCapture(product_id, media_id, coupon_code, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let device_type = deviceTypeDetect();
  let element = document.querySelector(".tws-playlist-wrapper-desktop");
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `offer_copied_${media_id}_${product_id}_${block_id}_${type}`;
  let objectToPush = {
    event_name: "offer_copied",
    media_id: media_id,
    screen: "offers",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    product_id: product_id,
    section: type,
    device: device_type,
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function offerViewCapture(product_id, media_id, block_id) {
  const type = document.querySelector(`#type-${block_id}`).innerText;
  let device_type = deviceTypeDetect();
  let element = document.querySelector(
    `#shopify-block-${block_id} .sj-scroll-bar`
  );
  let playListId = element.getAttribute("data-playlist-id");
  let data_capture_id = `offer_viewed_${media_id}_${product_id}_${block_id}_${type}`;
  let objectToPush = {
    event_name: "offer_viewed",
    media_id: media_id,
    screen: "offers",
    page: page,
    playlist_id: playListId,
    count: 1,
    data_capture_id: data_capture_id,
    product_id: product_id,
    section: type,
    device: device_type,
  };
  let count = isObjectInArrayExcludingCount(objectToPush, user_interactions);
  if (!count) {
    user_interactions.push(objectToPush);
  }
}
function productSwipeCapture() {}
async function storeAllAnalytics() {
  try {
    if (plan_data?.extension_analytics) {
      let device_type = deviceTypeDetect();
      let bodyContent = JSON.stringify({
        shop: shop,
        anonymous_id: anonymous_id ? anonymous_id : "",
        customer_id: customer_id ? customer_id : "",
        session_obj: session_obj,
        device: device_type,
        browser: "chrome",
        interactions: user_interactions,
      });
      let url = `${origin}/client/data-capture`;
      let response = await fetch(`${origin}/client/capture-events`, {
        keepalive: !0,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyContent,
      });
      if (response.ok) {
        let data = await response.json();
      } else {
        console.error("Error:", response.status);
      }
      user_interactions = [];
    } else {
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
window.addEventListener("pagehide", () => {
  storeAllAnalytics();
  showCartCount();
});
window.addEventListener("beforeunload", function (e) {
  storeAllAnalytics();
  showCartCount();
});
window.addEventListener("visibilitychange", (event) => {
  storeAllAnalytics();
  showCartCount();
});
