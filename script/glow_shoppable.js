let origin = "https://www.glowvideos.com",
    analytics_unique_id_global = 0,
    user_interactions = [];
function openModalOnVisiting() {
    var e = window.location.href,
        t = new URLSearchParams(e.split("?")[1]),
        o = t.get("block_id"),
        i = t.get("m_id");
    if (o && i) {
        let e;
        (e = window.innerWidth < 650 ? document.querySelector(`.v-${o}-mob-m-vid-${i}`).getAttribute("data-swipe-index") : document.querySelector(`.v-${o}-desk-m-vid-${i}`).getAttribute("data-swipe-index")), openModalTW(e, "", "", o);
    }
}
function provideSharebleURL(e, t) {
    let o = `${window.location.href.split("?")[0]}?block_id=${e}&m_id=${t}`;
    navigator.share
        ? navigator
            .share({ title: document.title, text: "Checkout this video", url: o })
            .then(() => { })
            .catch((e) => { })
        : openIOSShareWidget(o, "Watch this cool shoppable video: ", document.title);
}
function copyToClipboard(e) {
    const t = document.createElement("textarea");
    (t.value = e), document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t), showToast("Copied to clipboard!");
}
function muteUnmute(e) {
    let t = document.querySelector(`.${e}`),
        o = document.querySelector(`#${e}-controller .speaker`),
        i = document.querySelector(`#${e}-controller .nospeaker`);
    t.muted ? ((t.muted = !1), (o.style.display = "block"), (i.style.display = "none")) : ((t.muted = !0), (o.style.display = "none"), (i.style.display = "block"));
}
function muteUnmuteAll() {
    let e = document.querySelectorAll(".sj-vid-mute-unmute .speaker"),
        t = document.querySelectorAll(".sj-vid-mute-unmute .nospeaker"),
        o = [...document.querySelectorAll(".video-wrapper-mobile video"), ...document.querySelectorAll(".modal-video-wrapper video")],
        i = !0;
    o.forEach((e) => {
        e.muted ? ((e.muted = !1), (i = !1)) : ((e.muted = !0), (i = !0));
    }),
        i
            ? (e.forEach((e) => {
                e.style.display = "none";
            }),
                t.forEach((e) => {
                    e.style.display = "block";
                }))
            : (e.forEach((e) => {
                e.style.display = "block";
            }),
                t.forEach((e) => {
                    e.style.display = "none";
                }));
}
function updateVideoSource(e) {
    const t = e;
    if (t && t.getAttribute("data-src")) {
        t.getAttribute("src") !== t.getAttribute("data-src") && ((t.src = t.getAttribute("data-src")), e.load());
    }
}
function handleIntersection(e, t) {
    e.forEach((e) => {
        const t = e.target;
        console.log("************* ", t);
        e.isIntersecting ? (updateVideoSource(t), t.play()) : t.pause();
    });
}
function handleCardVideoPlay(e) {
    let t = e.getAttribute("data-vlc");
    (document.getElementById(`${t}`).style.display = "none"), e.play();
}
function handleLoadImg() {
    document.querySelectorAll(".tw-shoppable img").forEach((img) => { let dataSrc = img.getAttribute("data-src"); if (dataSrc) { img.src = dataSrc } })

}
function handleCardVideoWaiting(e) {
    let t = e.getAttribute("data-vlc");
    document.getElementById(`${t}`).style.display = "flex";
}
const glow_observer = new IntersectionObserver(handleIntersection, { root: null, rootMargin: "0px", threshold: 0.1 }),
    videos = document.querySelectorAll("video.tw-viewport-video[data-src]");
videos.forEach((e) => {
    glow_observer.observe(e);
});
let swiperDesktop = [],
    swiperMobile = [];
const swiperDesktopSliders = document.querySelectorAll(".swiper-slider");
swiperDesktopSliders.forEach((e) => {
    let t = e.getAttribute("data-block-id");
    swiperDesktop["" + t] = new Swiper(".modal-desktop-block-" + t, {
        centeredSlides: !0,
        slidesPerView: 2,
        grabCursor: !0,
        freeMode: !1,
        loop: !1,
        mousewheel: !1,
        keyboard: { enabled: !0 },
        pagination: { el: ".swiper-pagination", dynamicBullets: !1, clickable: !0 },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: {
            0: { slidesPerView: 1, spaceBetween: 20 },
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 1, spaceBetween: 5 },
            1024: { slidesPerView: 1, spaceBetween: 10 },
            1280: { slidesPerView: 2, spaceBetween: 10 },
        },
        on: {
            slideChange: function () {
                const e = this.realIndex;
                handleVideoPlayback(e, this), slideChangeCapture(e, this, t), validateViews(e, this, t), setCurrentMediaPlaylistID(e, this), closeAllProductDetailsModal(), showCartCount();
            },
        },
    });
});
var interleaveOffset = 0.75;
const swiperMobileSliders = document.querySelectorAll(".swiper-mobile-slider");
function loadMultipleScripts(e, t) {
    let o = 0;
    e.forEach((i) =>
        (function (i) {
            const n = document.createElement("script");
            (n.type = "text/javascript"),
                (n.src = i),
                (n.onload = function () {
                    o++, o === e.length && t && t();
                }),
                document.head.appendChild(n);
        })(i)
    );
}
function loadMultipleStylesheets(e) {
    e.forEach((e) => {
        const t = document.createElement("link");
        (t.rel = "stylesheet"), (t.href = e), document.head.appendChild(t);
    });
}
swiperMobileSliders.forEach((e) => {
    let t = e.getAttribute("data-block-id");
    swiperMobile["" + t] = new Swiper(".modal-mobile-block-" + t, {
        direction: "vertical",
        mousewheel: !0,
        lazy: !0,
        loop: !0,
        on: {
            slideChange: function () {
                clearInterval(currentIntervalId),
                    document.querySelectorAll(".swipe-up-indicator").forEach((e) => {
                        e.style.display = "none";
                    });
                const e = this.activeIndex;
                handleVideoPlayback(e, this), slideChangeCapture(e, this, t), validateViews(e, this, t), setCurrentMediaPlaylistID(e, this), executeAfterResizeStop(), closeAllProductDetailsModal(), showCartCount();
            },
        },
    });
});
const jsFiles = ["https://cdn.jsdelivr.net/npm/toastify-js"],
    cssFiles = ["https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"];
function showToast(e) {
    Toastify({
        text: e,
        duration: 3e3,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: !0,
        close: !1,
        gravity: "bottom",
        position: "right",
        stopOnFocus: !0,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
        onClick: function () { },
    }).showToast();
}
loadMultipleScripts(jsFiles, function () { }), loadMultipleStylesheets(cssFiles);
let page = window.location.href,
    shop = Shopify.shop,
    anonymous_id = localStorage.getItem("anonymousIdTWS"),
    customer_id = localStorage.getItem("customerIdTWS"),
    session = getItemWithExpiry("twsSession"),
    currentMediaID = null,
    currentPlaylistId = null;
const currentDate = new Date(),
    isoString = currentDate.toISOString();
let session_obj = { session: session, time_stamp: isoString };
const parentSelector = ".shopify-section";
let sendMediaId,
    sendWatchtime,
    sendViews,
    global_element = document.querySelector(".tws-playlist-wrapper-desktop"),
    global_playListId = global_element?.getAttribute("data-playlist-id"),
    currentIntervalId = 23432,
    offerviewsr = 0;
async function injectCustomer() {
    try {
        let e,
            t = localStorage.getItem("anonymousIdTWS"),
            o = getItemWithExpiry("twsSession"),
            i = document.getElementById("nltk-expc");
        i && null != i && (e = JSON.parse(i.innerText));
        let n = { Accept: "*/*", "User-Agent": "Thunder Client (https://www.thunderclient.com)", "Content-Type": "application/json" },
            l = JSON.stringify({ current_anonymous_id: t, shopifyCustomerData: e, current_session: o, shop: shop }),
            s = await fetch(`${origin}/client/inject-customer`, { method: "POST", body: l, headers: n }),
            r = await s.json();
        r.anonymouys_id && localStorage.setItem("anonymousIdTWS", r.anonymouys_id),
            r.customer_id && localStorage.setItem("customerIdTWS", r.customer_id),
            r.current_anonymous_id && localStorage.setItem("customerIdTWS", r.customer_id),
            r.session && (setItemWithExpiry("twsSession", { session: r.session }, 1e3), (session_obj = { session: r.session, time_stamp: isoString })),
            (anonymous_id = localStorage.getItem("anonymousIdTWS")),
            (customer_id = localStorage.getItem("customerIdTWS")),
            (plan_data = r?.plan_data);
    } catch (e) { }
}
async function eventToBackend(e, t, o, i, n, l, s) {
    let r = deviceTypeDetect(),
        c = JSON.stringify({
            anonymous_id: anonymous_id || "",
            customer_id: customer_id || "",
            event_name: e,
            session_obj: t,
            media_id: o,
            screen: i,
            page: n,
            shop: shop,
            product_id: null != l ? l : "",
            playlist_id: null != s ? s : "",
            device: r,
            browser: "chrome",
        }),
        a = await fetch(`${origin}/client/capture-events`, { method: "POST", body: c, headers: { Accept: "*/*", "User-Agent": "Thunder Client (https://www.thunderclient.com)", "Content-Type": "application/json" } });
    (await a.json()).status;
}
function sendMobileProductSwipe(e, t, o) { }
function glbReset() {
    offerviewsr = 0;
}
sendMobileProductSwipe();
let totalVideoViews = 0,
    mediaViews = {},
    mobile_media_views = {},
    desktop_media_views = {},
    interactions = { mobile_media_views: mobile_media_views, desktop_media_views: desktop_media_views };
function sectionSwipe() {
    const e = document.querySelector(".card-grid-wrapper.desktop-view");
    let t,
        o = !1;
    switch (deviceTypeDetect()) {
        case "mobile":
            e.addEventListener("scroll", function () {
                o || (o = !0),
                    clearTimeout(t),
                    (t = setTimeout(function () {
                        (o = !1), null != interactions.mobile_section_swipe ? (interactions.mobile_section_swipe = parseInt(interactions.mobile_section_swipe) + 1) : (interactions.mobile_section_swipe = 1);
                    }, 250));
            });
            break;
        case "desktop":
            e.addEventListener("scroll", function () {
                o || (o = !0),
                    clearTimeout(t),
                    (t = setTimeout(function () {
                        (o = !1), null != interactions.desktop_section_swipe ? (interactions.desktop_section_swipe = parseInt(interactions.desktop_section_swipe) + 1) : (interactions.desktop_section_swipe = 1);
                    }, 250));
            });
    }
}
function viewButtonClick() {
    switch (deviceTypeDetect()) {
        case "mobile":
            interactions.mobile_view_button_click ? (interactions.mobile_view_button_click = parseInt(interactions.mobile_view_button_click) + 1) : (interactions.mobile_view_button_click = 1);
            break;
        case "desktop":
            interactions.desktop_view_button_click ? (interactions.desktop_view_button_click = parseInt(interactions.desktop_view_button_click) + 1) : (interactions.desktop_view_button_click = 1);
    }
}
function setCurrentMediaPlaylistID(e, t) {
    let o = t.slides[e];
    (currentPlaylistId = o.getAttribute("data-playlist-id")), (currentMediaID = o.getAttribute("data-media-id"));
}
function validateViews(e, t, o) {
    try {
        const i = document.querySelector(`#type-${o}`).innerText;
        let n = t.slides[e],
            l = n.getAttribute("data-playlist-id"),
            s = n.getAttribute("data-media-id"),
            r = n.querySelector("video"),
            c = (deviceTypeDetect(), `media_views_${s}_${l}_${i}`),
            a = 0;
        r.addEventListener("timeupdate", function () {
            const e = r.currentTime;
            a = e;
            let t = { event_name: "media_views", media_id: s, screen: "media_modal", page: page, playlist_id: l, count: 1, data_capture_id: c, section: i, device: deviceTypeDetect(), screen: "media_modal", watchtime: e };
            isObjectInArrayExcludingCount(t, user_interactions) || user_interactions.push(t);
        }),
            (currentIntervalId = intervalID);
    } catch (e) { }
}
async function sendMediaDurationToBackend(e, t, o, i, n, l, s, r, c) {
    if (plan_data?.capture_views) {
        let a = { Accept: "*/*", "User-Agent": "Thunder Client (https://www.thunderclient.com)", "Content-Type": "application/json" },
            d = JSON.stringify({ anonymous_id: anonymous_id, event_name: e, session_obj: t, media_id: o, playlist_id: l, duration: s, screen: i, page: n, shop: shop, views: r, device_type: c }),
            u = await fetch(`${origin}/client/capture-media-views`, { method: "POST", body: d, headers: a });
        (await u.json()).status;
    }
}
function recordCardModalClick() {
    switch (deviceTypeDetect()) {
        case "mobile":
            interactions.mobile_card_video_click ? (interactions.mobile_card_video_click = parseInt(interactions.mobile_card_video_click) + 1) : (interactions.mobile_card_video_click = 1);
            break;
        case "desktop":
            interactions.desktop_card_video_click ? (interactions.desktop_card_video_click = parseInt(interactions.desktop_card_video_click) + 1) : (interactions.desktop_card_video_click = 1);
    }
}
function recordMediaChange() {
    switch (deviceTypeDetect()) {
        case "mobile":
            interactions.mobile_slide_change ? (interactions.mobile_slide_change = parseInt(interactions.mobile_slide_change) + 1) : (interactions.mobile_slide_change = 1);
            break;
        case "desktop":
            interactions.desktop_slide_change ? (interactions.desktop_slide_change = parseInt(interactions.desktop_slide_change) + 1) : (interactions.desktop_slide_change = 1);
    }
}
function recordATCButtonClicked() {
    switch (deviceTypeDetect()) {
        case "mobile":
            interactions.mobile_atc_click ? (interactions.mobile_atc_click = parseInt(interactions.mobile_atc_btn_click) + 1) : (interactions.mobile_atc_click = 1);
            break;
        case "desktop":
            interactions.desktop_atc_click ? (interactions.desktop_atc_click = parseInt(interactions.desktop_atc_btn_click) + 1) : (interactions.desktop_atc_click = 1);
    }
}
function recordBuyNowButtonClicked() {
    switch (deviceTypeDetect()) {
        case "mobile":
            interactions.mobile_buy_now_click ? (interactions.mobile_buy_now_click = parseInt(interactions.mobile_buy_now_click) + 1) : (interactions.mobile_buy_now_click = 1), alert("checking buy now click");
            break;
        case "desktop":
            interactions.desktop_buy_now_click ? (interactions.desktop_buy_now_click = parseInt(interactions.desktop_buy_now_click) + 1) : (interactions.desktop_buy_now_click = 1), alert("checking buy now click");
    }
}
async function sendAnalytics() {
    const e = await fetch(`${origin}/client/set-analytics`, { headers: { "Content-Type": "application/json" }, method: "POST", body: JSON.stringify({ MEDIA_VIEWS: mediaViews, shop: window.Shopify.shop }) });
    if (e) {
        await e.json();
    }
}
async function getAnalytics() {
    try {
        const e = await fetch(`${origin}/client/get-analytics`, { headers: { "Content-Type": "application/json" }, method: "POST", body: JSON.stringify({ shop: window.Shopify.shop }) });
        if (e) {
            (await e.json()).data.forEach((e) => {
                (mediaViews[e.media_id] = e.views), (totalVideoViews += parseInt(e.views));
            });
        }
    } catch (e) { }
}
function deviceTypeDetect() {
    const e = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    /iPad|Android|Tablet/i.test(navigator.userAgent);
    return e ? "mobile" : "desktop";
}
function deviceCheck() {
    var e = navigator.userAgent,
        t = { Apple: /iPhone|iPad|iPod/, Samsung: /Samsung/, Google: /Pixel/, Huawei: /Huawei/, Xiaomi: /Xiaomi/, OnePlus: /OnePlus/, LG: /LG/, Sony: /Sony/ };
    Object.keys(t).forEach(function (o) {
        t[o].test(e) && o;
    });
}
function getBroswerType() {
    if (navigator.userAgentData) {
        const e = navigator.userAgentData.brands;
        let t = "Unknown";
        return (
            e.some((e) => "google chrome" === e.brand.toLowerCase())
                ? (t = "Chrome")
                : e.some((e) => "firefox" === e.brand.toLowerCase())
                    ? (t = "Firefox")
                    : e.some((e) => "safari" === e.brand.toLowerCase())
                        ? (t = "Safari")
                        : e.some((e) => "microsoft edge" === e.brand.toLowerCase())
                            ? (t = "Microsoft Edge")
                            : e.some((e) => "opera" === e.brand.toLowerCase()) && (t = "Opera"),
            t
        );
    }
    return browserName;
}
function setItemWithExpiry(e, t, o) {
    const i = { value: t, expiry: new Date().getTime() + 1e3 * o };
    localStorage.setItem(e, JSON.stringify(i));
}
function getItemWithExpiry(e) {
    const t = localStorage.getItem(e);
    if (!t) return null;
    const o = JSON.parse(t),
        i = new Date().getTime();
    return o.expiry < i ? (localStorage.removeItem(e), null) : o.value;
}
getAnalytics();
var windowSize = window.innerWidth;
function closeModalTW(e) {
    try {
        let t,
            o = document.querySelector(`#shopify-block-${e}`).parentElement;
        if (windowSize < 650) t = document.querySelector(`#shopify-block-${e}`).querySelector("#card-modal-mobile");
        else {
            t = document.querySelector(`#shopify-block-${e}`).querySelector("#card-modal-desktop");
            let o = document.querySelector(".shoppable-in-product-sticky-wrapper");
            o && (o.style.display = "block");
        }
        let i = document.querySelectorAll(`#shopify-block-${e} .product-details-modal-mobile`);
        for (let e = 0; e < i.length; e++) (i[e].style.display = "none"), (i[e].style.visibility = "hidden"), (i[e].style.bottom = "-100%");
        (t.style.transform = "scale(0)"), (t.style.height = "0"), unstickFromTop(o), document.querySelector(`#shopify-block-${e}`).scrollIntoView(), closeAllProductDetailsModal(), storeAllAnalytics();
    } catch (e) { }
    document.querySelectorAll(".swiper-slide video").forEach((e) => {
        e.pause();
    }),
        (document.body.style.overflow = "auto"),
        playCardVideos();
}
var twParentElement = "";
function stickToTop(e) {
    try {
        return (
            document.querySelectorAll(".sj-scroll-bar").forEach((e) => {
                e.style.display = "none";
            }),
            !!e && ((twParentElement = e), e.classList.add("tw-section-position"), document.querySelector("html").classList.add("tw-position"), !0)
        );
    } catch (e) { }
}
function unstickFromTop() {
    try {
        return (
            document.querySelectorAll(".sj-scroll-bar").forEach((e) => {
                e.style.display = "block";
            }),
            !!twParentElement && (twParentElement.classList.remove("tw-section-position"), document.querySelector("html").classList.remove("tw-position"), !0)
        );
    } catch (e) { }
}
let isResizeStopped,
    pausedVideoIndexesTW = [];
function pauseAllCardVideos() {
    let e = document.querySelectorAll(".inner-video-wrapper video"),
        t = 0;
    for (let o = 0; o < e.length; o++) e[o].paused || (e[o].pause(), (pausedVideoIndexesTW[t] = o), t++);
}
function playCardVideos() {
    let e = document.querySelectorAll(".inner-video-wrapper video");
    pausedVideoIndexesTW.forEach((t) => {
        e[t].play();
    }),
        (pausedVideoIndexesTW = []);
}
function openModalTW(e, t, o, i) {
    if ((stickToTop(document.querySelector(`#shopify-block-${i}`).parentElement), windowSize < 650)) {
        let t = window.innerHeight,
            o = document.querySelector("#shopify-block-" + i).querySelector("#card-modal-mobile");
        (o.style.transform = "scale(1)"), (o.style.height = `${t}px`), o.classList.add("mobile-modal-opened"), swiperMobile[i].slideTo(e);
        let n = swiperMobile[i].realIndex;
        const l = swiperMobile[i];
        handleVideoPlayback(n, l), validateViews(n, l, i), setCurrentMediaPlaylistID(n, l);
    } else {
        let t = document.querySelector(`#shopify-block-${i}`).querySelector("#card-modal-desktop");
        (t.style.transform = "scale(1)"), (t.style.height = "100%"), t.classList.add("desktop-modal-opened"), swiperDesktop[i].slideTo(e);
        let o = swiperDesktop[i].realIndex;
        const n = swiperDesktop[i];
        handleVideoPlayback(o, n), fixHeightOnIosOnResize(), validateViews(o, n, i), setCurrentMediaPlaylistID(o, n);
    }
    pauseAllCardVideos(), videoCardClickCapture(t, i, o), (document.body.style.overflow = "hidden");
}
function isIOS() {
    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}
function handleVideoPlayback(e, t) {
    let o, i, n;
    e == t.slides.length - 1
        ? ((o = t.slides[e]), (i = t.slides[e - 1]), (n = t.slides[e - 2]))
        : 0 == e
            ? ((o = t.slides[e]), (i = t.slides[e + 1]), (n = t.slides[e + 2]))
            : ((o = t.slides[e]), (i = t.slides[e + 1]), (n = t.slides[e - 1])),
        updateVideoSource(o?.querySelector("video")),
        updateVideoSource(i?.querySelector("video")),
        updateVideoSource(n?.querySelector("video"));
    let l = o?.querySelector("video");
    (l.currentTime = 0),
        o?.querySelector("video").addEventListener("waiting", (e) => {
            o?.querySelector(".sj-vid-loader");
        });
    let s = o?.querySelector("video").style.display;
    if (((s = "none"), navigator.platform.toUpperCase().indexOf("MAC") >= 0)) {
        let e = o?.querySelector(".sj-vid-loader");
        (e.style.display = "none"), o?.querySelector("video").play();
    } else if (isIOS()) {
        let e = o?.querySelector(".sj-vid-loader");
        (e.style.display = "none"), o?.querySelector("video").play();
    } else
        o?.querySelector("video").addEventListener("canplay", (e) => {
            s = "block";
            let t = o?.querySelector(".sj-vid-loader");
            (t.style.display = "none"), o?.querySelector("video").play();
        });
    i?.querySelector("video").pause(), n?.querySelector("video").pause();
}
function closeInnerModal(e) {
    let t = document.querySelectorAll(`#${e}`);
    for (let e = 0; e < t.length; e++) t[e].style.display = "none";
}
function closeAllProductDetailsModal() {
    document.querySelectorAll(".d-inner-product-wrapper").forEach((e) => {
        e.style.display = "none";
    });
}
function openInnerModal(e, t, o, i) {
    if (windowSize > 650) {
        let o = document.querySelectorAll(`#shopify-block-${e} #${t}`);
        for (let e = 0; e < o.length; e++) "block" == o[e].style.display ? (o[e].style.display = "none") : (o[e].style.display = "block");
    } else {
        let o = document.querySelector(`#shopify-block-${e} .product-details-modal-mobile`);
        (o.style.bottom = "0"), (o.style.display = "block"), (o.style.visibility = "visible");
        let i = document.querySelectorAll(`#shopify-block-${e} .inner-product-details-wrapper`);
        for (let e = 0; e < i.length; e++) i[e].style.display = "none";
        let n = document.querySelectorAll(`#shopify-block-${e} #${t}`);
        for (let e = 0; e < n.length; e++) n[e].style.display = "block";
    }
    viewDetailsClickCapture(o, i, e);
}
function openOfferModal() {
    let e = document.getElementsByClassName("offer-modal-wrapper");
    for (let t = 0; t < e.length; t++) e[t].style.display = "block";
}
function closeOfferModal() {
    let e = document.getElementsByClassName("offer-modal-wrapper");
    for (let t = 0; t < e.length; t++) e[t].style.display = "none";
}
function hasChildWithDataBlockHandle(e) {
    let t = document.querySelector("#sticky-position-sj-shoppable");
    if (t) {
        t = t.innerText;
        const o = document.querySelectorAll(e),
            i = window.innerWidth <= 768;
        for (const e of o) {
            e.querySelector('[data-block-handle="in-product-sticky"]') &&
                (t.includes("bottom_right")
                    ? ((e.style.position = "fixed"), i ? ((e.style.bottom = "4%"), (e.style.right = "2%")) : ((e.style.bottom = "10%"), (e.style.right = "10%")))
                    : t.includes("bottom_left")
                        ? ((e.style.position = "fixed"), i ? ((e.style.bottom = "4%"), (e.style.left = "0")) : ((e.style.bottom = "10%"), (e.style.right = "80%")))
                        : t.includes("top_left")
                            ? ((e.style.position = "fixed"), i ? ((e.style.top = "4%"), (e.style.left = "2%")) : ((e.style.top = "40%"), (e.style.right = "80%")))
                            : t.includes("top_right") && ((e.style.position = "fixed"), (e.style.top = i ? "4%" : "40%"), (e.style.right = i ? "2%" : "10%")),
                    (e.style.zIndex = "99999"),
                    (e.style.zIndex = "fit-content"));
        }
    }
    return !1;
}
function getTheChildOutFromParent(e) {
    let t = document.querySelector(`#${e} .shoppable-sticky-video-sj`);
    t.remove(), document.body.appendChild(t);
}
try {
    function closeSticky() {
        document.querySelectorAll(".shoppable-sticky-video-sj").forEach((e) => {
            e.style.opacity = 0;
        });
    }
    function IPSModalOpen(e) {
        const t = document.querySelectorAll(parentSelector);
        window.innerWidth;
        for (const e of t) {
            e.querySelector('[data-block-handle="in-product-sticky"]') && (e.style.position = "unset");
        }
        let o = document.querySelector(".shoppable-in-product-sticky-wrapper");
        o && (o.style.display = "none"), openModalTW("0", "{{ firstMediaKey }}", "sticky-in-product", e);
    }
} catch (e) { }
async function productAddToCart(e, t, o, i, n) {
    const l = document.querySelector(`#type-${n}`).innerText;
    atcClickCapture(i, o, n);
    let s = e.innerHTML;
    const r = document.querySelector(`input[data-product-handle="${t}"]`).getAttribute("id");
    document.querySelectorAll(".product-add-notify");
    e.classList.value.includes("iconBtn") ? ((e.style.transition = "all 1s ease-in-out"), (e.style.transform = "scale(1.5)")) : (e.innerHTML = "ADDING...");
    let c = { quantity: 1, id: r, properties: { _added_from: "TW Shoppable Video", _tw_media_id: i, _tw_playlist_id: global_playListId, _shop: Shopify.shop, _anonymous_id: anonymous_id, _page: page, _section: l } },
        a = await fetch("/cart/add.js", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
    (await a.json()) &&
        (setTimeout(function () {
            e.innerHTML = s;
        }, 1e3),
            setTimeout(function () {
                showCartCount(), productPoupClose();
            }, 1500),
            setTimeout(() => {
                showCartAnimation();
            }, 2e3));
}
function showCartAnimation() {
    document.querySelectorAll(".sj-cart-widget-wrapper").forEach((e) => {
        e.classList.add("cart-icon-animation");
    }),
        document.querySelectorAll(".cart-count").forEach((e) => {
            e.classList.add("cart-count-animation");
        }),
        setTimeout(() => {
            document.querySelectorAll(".sj-cart-widget-wrapper").forEach((e) => {
                e.classList.remove("cart-icon-animation");
            }),
                document.querySelectorAll(".cart-count").forEach((e) => {
                    e.classList.remove("cart-count-animation");
                });
        }, 1e3);
}
async function showCartCount() {
    let e = await fetch("/cart.js", { method: "GET", headers: { "Content-Type": "application/json" } });
    e = await e.json();
    let t = e.item_count,
        o = document.querySelectorAll(".cart-count");
    for (let e = 0; e < o.length; e++) o[e].innerHTML = t;
}
async function showCartCount() {
    let e = await fetch("/cart.js", { method: "GET", headers: { "Content-Type": "application/json" } });
    e = await e.json();
    let t = e.item_count,
        o = document.querySelectorAll(".cart-count");
    for (let e = 0; e < o.length; e++) o[e].innerHTML = t;
}
async function productBuyNow(e, t, o, i) {
    const n = document.querySelector(`input[data-product-handle="${e}"]`).getAttribute("id"),
        l = document.querySelector(`#type-${i}`).innerText;
    buyNowClickCapture(o, t, i);
    let s = await fetch("/cart/clear.js", { method: "GET" });
    if (await s.json()) {
        let e = { quantity: 1, id: n, properties: { _added_from: "TW Shoppable Video", _tw_media_id: o, _tw_playlist_id: global_playListId, _shop: Shopify.shop, _anonymous_id: anonymous_id, _page: page, _section: l } },
            t = (await fetch("/cart/add.js", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) })).json(),
            i = localStorage.getItem("coupon");
        t && (window.location.href = i ? `/checkout?discount=${i}` : "/checkout");
    }
}
function changeSelectedVariant(e, t) {
    const o = document.querySelector(`input[data-product="${t}"]`);
    let i = e.target.value;
    o.setAttribute("id", i);
}
function variantAdder(e) {
    let t = e.getAttribute("data-value"),
        o = (e.getAttribute("data-option"), e.getAttribute("data-option-index")),
        i = e.getAttribute("data-product"),
        n = e.getAttribute("data-media-id");
    console.log("grouping all button ", document.querySelectorAll(`button[data-product='${i}'][data-option='${o}']`));
    let l = document.querySelector(`button[data-product='${i}'][data-option-index='option1'][data-media-id='${n}'].selected`),
        s = l?.getAttribute("data-value"),
        r = document.querySelector(`button[data-product='${i}'][data-option-index='option2'][data-media-id='${n}'].selected`),
        c = r?.getAttribute("data-value"),
        a = document.querySelector(`button[data-product='${i}'][data-option-index='option3'][data-media-id='${n}'].selected`),
        d = a?.getAttribute("data-value");
    (selectedObj = { option1: s, option2: c, option3: d })[o] = t;
    let u = document.querySelectorAll(`button[data-adtc-product='${i}']`),
        p = document.querySelectorAll(`button[data-buybtn-product='${i}']`);
    const y = document.querySelectorAll(`button[data-product='${i}'][data-option-index='${o}'][data-media-id='${n}'].selected`);
    console.log("tmpOption ", y);
    for (let e = 0; e < y.length; e++) y[e].classList.remove("selected");
    e.classList.add("selected"), console.log("OPTION Index :::---\x3e ", o);
    let h = allProducts.products.filter((e) => e.productID == i);
    (h = h[0]), console.log("varDetails:", h), console.log("selectedObj::", selectedObj);
    let m = h.variants.filter((e) => e.option1 == selectedObj.option1 && e.option2 == selectedObj.option2 && e.option3 == selectedObj.option3);
    if (((m = m[0]), m)) {
        let e = document.querySelectorAll(`#inner-price--${i}`),
            t = document.querySelectorAll(`.inner-product-price.mobile#inner-price--${i}`),
            o = parseInt(m.price / 100);
        for (let t = 0; t < e.length; t++) "INR" == store_currency ? (e[t].innerHTML = `&#8377; ${o}`) : (e[t].innerHTML = `${store_currency} ${o}`);
        for (let e = 0; e < t.length; e++) "INR" == store_currency ? (t[e].innerHTML = `&#8377; ${o}`) : (t[e].innerHTML = `${store_currency} ${o}`);
        let n = document.querySelectorAll(`#inner-cmp-price--${i}`),
            l = parseInt(m.compare_at_price / 100);
        for (let e = 0; e < n.length; e++) "INR" == store_currency ? (n[e].innerHTML = `&#8377; ${l}`) : (n[e].innerHTML = `${store_currency} ${l}`);
        let s = document.querySelectorAll(`#inner-sale-amount--${i}`),
            r = parseInt((100 * (l - o)) / l);
        for (let e = 0; e < s.length; e++) s[e].innerHTML = `${r}% off`;
        const c = document.querySelectorAll(`input[data-product="${i}"]`);
        for (let e = 0; e < c.length; e++) c[e].setAttribute("id", m.id);
        if (0 == m.available) {
            for (let e = 0; e < u.length; e++)
                (u[e].innerHTML =
                    '\n\t\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>\n\t\t\t\t\t\tSOLD OUT'),
                    u[e].classList.add("disabled");
            for (let e = 0; e < p.length; e++) (p[e].style.display = "none"), p[e].classList.add("disabled");
        } else {
            for (let e = 0; e < u.length; e++)
                (u[e].innerHTML =
                    '\n\t\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>\n\t\t\t\t\t\tADD TO CART'),
                    u[e].classList.remove("disabled");
            for (let e = 0; e < p.length; e++) (p[e].style.display = "flex"), p[e].classList.remove("disabled");
        }
    } else {
        for (let e = 0; e < u.length; e++)
            (u[e].innerHTML =
                '\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>\n\t\t\t\t\tSOLD OUT'),
                u[e].classList.add("disabled");
        for (let e = 0; e < p.length; e++) (p[e].style.display = "none"), p[e].classList.add("disabled");
    }
}
try {
    const t = document.querySelector("#shoppableProducts");
    var allProducts = JSON.parse(t.textContent);
    const o = document.getElementsByClassName("inner-variant-button");
    var selectedObj = { option1: null, option2: null, option3: null };
    for (let i = 0; i < o.length; i++)
        o[i].addEventListener("click", function (e) {
            variantAdder(this);
        });
} catch (n) {
    console.error(n);
}
try {
    var acc = document.getElementsByClassName("accordion");
    for (let l = 0; l < acc.length; l++)
        acc[l].addEventListener("click", function () {
            this.classList.toggle("active");
            var e = this.nextElementSibling,
                t = this.querySelector("span.acc-plus-icon");
            let o = document.querySelectorAll(".inner-product-details-wrapper");
            if (e.style.maxHeight) {
                for (let e = 0; e < o.length; e++) o[e].style.height = "max-content";
                (e.style.maxHeight = null),
                    (t.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"></path></svg>');
            } else {
                for (let e = 0; e < o.length; e++) o[e].style.height = "610px";
                (e.style.maxHeight = "120px"),
                    (e.style.overflow = "scroll"),
                    (t.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"/></svg>');
            }
        });
} catch (s) { }
function getRandomNumber(e, t) {
    const o = t - e + 1;
    return e + Math.floor(Math.random() * o);
}
function setRandomViews(e) {
    try {
        const o = document.querySelectorAll(`#${e} .random_view_inject`),
            i = document.querySelector(`#${e} #nltk-ds`);
        var t;
        i && (t = JSON.parse(i.innerText)),
            o.forEach((e) => {
                if (t && null != t) {
                    const o = getRandomNumber(parseInt(t.min), parseInt(t.max));
                    e.innerText = `${o}K`;
                }
            });
    } catch (e) { }
}
function setRandomViewsStories() {
    try {
        if (app_block_id_sj_stories && null != app_block_id_sj_stories) {
            const e = document.querySelectorAll('[data-block-handle="shoppable-video-stories"] .random_view_inject'),
                t = JSON.parse(document.querySelector(`#${app_block_id_sj_stories} #nltk-ds`).innerText);
            e.forEach((e) => {
                const o = getRandomNumber(parseInt(t.min), parseInt(t.max));
                e.innerText = `${o}K`;
            });
        }
    } catch (e) { }
}
function mediaUnMute(e, t, o) {
    const i = document.querySelectorAll(`.${e} video[data-media-id="${t}"]`);
    for (const e of i) e.muted = !e.muted;
}
function mediaMuteUnmute(e, t) {
    const o = document.getElementById(e),
        i = document.getElementById(t);
    o.muted
        ? ((o.muted = !1),
            (i.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M15.0791 2.32591C14.9529 2.26445 14.8121 2.2396 14.6726 2.25419C14.533 2.26877 14.4004 2.3222 14.2897 2.40841L7.74219 7.49997H3.5C3.10218 7.49997 2.72064 7.65801 2.43934 7.93931C2.15804 8.22061 2 8.60215 2 8.99997V15C2 15.3978 2.15804 15.7793 2.43934 16.0606C2.72064 16.3419 3.10218 16.5 3.5 16.5H7.74219L14.2897 21.5915C14.4005 21.6777 14.5332 21.731 14.6728 21.7454C14.8124 21.7599 14.9533 21.7349 15.0793 21.6732C15.2054 21.6116 15.3117 21.5158 15.3861 21.3968C15.4604 21.2778 15.4999 21.1403 15.5 21V2.99997C15.5 2.85947 15.4606 2.72178 15.3861 2.6026C15.3117 2.48343 15.2053 2.38755 15.0791 2.32591ZM3.5 8.99997H7.25V15H3.5V8.99997ZM14 19.4662L8.75 15.3834V8.61653L14 4.53372V19.4662ZM19.0625 9.52122C19.6657 10.206 19.9986 11.0873 19.9986 12C19.9986 12.9126 19.6657 13.7939 19.0625 14.4787C18.93 14.6243 18.7456 14.712 18.549 14.7228C18.3524 14.7336 18.1595 14.6667 18.0118 14.5365C17.8642 14.4063 17.7736 14.2233 17.7597 14.0269C17.7458 13.8305 17.8097 13.6365 17.9375 13.4868C18.2992 13.076 18.4988 12.5474 18.4988 12C18.4988 11.4526 18.2992 10.9239 17.9375 10.5131C17.8097 10.3634 17.7458 10.1694 17.7597 9.97305C17.7736 9.77668 17.8642 9.59365 18.0118 9.46346C18.1595 9.33326 18.3524 9.26635 18.549 9.27716C18.7456 9.28796 18.93 9.37562 19.0625 9.52122ZM23.75 12C23.7511 13.8452 23.0711 15.6258 21.8403 17.0006C21.7067 17.1452 21.5216 17.2314 21.325 17.2407C21.1284 17.25 20.936 17.1817 20.7893 17.0504C20.6426 16.9191 20.5535 16.7354 20.541 16.5389C20.5286 16.3425 20.5939 16.149 20.7228 16.0003C21.7066 14.9003 22.2505 13.4762 22.2505 12.0004C22.2505 10.5246 21.7066 9.10062 20.7228 8.0006C20.6553 7.92753 20.603 7.84175 20.5689 7.74827C20.5349 7.65478 20.5197 7.55546 20.5245 7.45607C20.5292 7.35669 20.5536 7.25923 20.5963 7.16939C20.6391 7.07954 20.6993 6.99909 20.7734 6.93273C20.8475 6.86638 20.9341 6.81543 21.0281 6.78287C21.1222 6.7503 21.2217 6.73677 21.321 6.74305C21.4203 6.74934 21.5173 6.77532 21.6065 6.81948C21.6957 6.86364 21.7751 6.9251 21.8403 7.00028C23.0714 8.37449 23.7515 10.155 23.75 12Z" fill="#222222"></path></svg>'))
        : ((o.muted = !0),
            (i.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M15.0791 2.32591C14.9529 2.26445 14.8121 2.2396 14.6726 2.25419C14.533 2.26877 14.4004 2.3222 14.2897 2.40841L7.74219 7.49997H3.5C3.10218 7.49997 2.72064 7.65801 2.43934 7.93931C2.15804 8.22061 2 8.60215 2 8.99997V15C2 15.3978 2.15804 15.7793 2.43934 16.0606C2.72064 16.3419 3.10218 16.5 3.5 16.5H7.74219L14.2897 21.5915C14.4005 21.6777 14.5332 21.731 14.6728 21.7454C14.8124 21.7599 14.9533 21.7349 15.0793 21.6732C15.2054 21.6116 15.3117 21.5158 15.3861 21.3968C15.4604 21.2778 15.4999 21.1403 15.5 21V2.99997C15.5 2.85947 15.4606 2.72178 15.3861 2.6026C15.3117 2.48343 15.2053 2.38755 15.0791 2.32591ZM3.5 8.99997H7.25V15H3.5V8.99997ZM14 19.4662L8.75 15.3834V8.61653L14 4.53372V19.4662ZM23.5306 13.7193C23.6714 13.8601 23.7504 14.0509 23.7504 14.25C23.7504 14.449 23.6714 14.6399 23.5306 14.7806C23.3899 14.9213 23.199 15.0004 23 15.0004C22.801 15.0004 22.6101 14.9213 22.4694 14.7806L20.75 13.0603L19.0306 14.7806C18.8899 14.9213 18.699 15.0004 18.5 15.0004C18.301 15.0004 18.1101 14.9213 17.9694 14.7806C17.8286 14.6399 17.7496 14.449 17.7496 14.25C17.7496 14.0509 17.8286 13.8601 17.9694 13.7193L19.6897 12L17.9694 10.2806C17.8286 10.1399 17.7496 9.94899 17.7496 9.74997C17.7496 9.55095 17.8286 9.36008 17.9694 9.21935C18.1101 9.07861 18.301 8.99955 18.5 8.99955C18.699 8.99955 18.8899 9.07861 19.0306 9.21935L20.75 10.9397L22.4694 9.21935C22.6101 9.07861 22.801 8.99955 23 8.99955C23.199 8.99955 23.3899 9.07862 23.5306 9.21935C23.6714 9.36008 23.7504 9.55095 23.7504 9.74997C23.7504 9.94899 23.6714 10.1399 23.5306 10.2806L21.8103 12L23.5306 13.7193Z" fill="#222222"></path></svg>'));
}
function copyCode(e, t, o, i, n, l) {
    offerCopiedCapture(n, i, e, l);
    var s = document.getElementById(`${e}`);
    s.select(),
        s.setSelectionRange(0, 99999),
        navigator.clipboard.writeText(s.value),
        localStorage.setItem("coupon", s.value),
        (document.getElementById(`${t}`).innerHTML = "CODE COPIED!"),
        (o.innerHTML = "CODE COPIED!"),
        setTimeout(() => {
            o.innerHTML = "COPY";
        }, 2e3);
    localStorage.getItem("coupon");
}
function textExpand(e, t) {
    if ("Read More" == t.innerHTML) {
        document.querySelector(`#${e}`).classList.remove("ellipse"), (t.innerHTML = "Read Less");
    } else {
        document.querySelector(`#${e}`).classList.add("ellipse"), (t.innerHTML = "Read More");
    }
}
function preventBackButton() {
    if (windowSize < 650) {
        if (document.getElementById("card-modal-mobile").classList.value.includes("mobile-modal-opened")) {
            document.getElementById("modal-close-btn-mobile").click();
        } else window.history.back();
    } else {
        if (document.getElementById("card-modal-desktop").classList.value.includes("desktop-modal-opened")) {
            document.getElementById("modal-close-btn").click();
        } else window.history.back();
    }
}
function pauseAllVideos() {
    document.querySelectorAll("video").forEach((e) => {
        e.pause();
    });
}
function playVisibleVideos() {
    const e = document.querySelectorAll("video"),
        t = window.innerHeight / 2,
        o = window.innerWidth / 2,
        i = 0,
        n = t,
        l = 0,
        s = o;
    e.forEach((e) => {
        const t = e.getBoundingClientRect();
        t.top >= i && t.bottom <= n && t.left >= l && t.right <= s ? e.play() : e.pause();
    });
}
function getAllDisplayNoneVid() {
    document.querySelectorAll("*").forEach((e) => {
        !(function (e) {
            getComputedStyle(e).height;
        })(e);
    });
}
function productPoupClose() {
    (selectedObj = { option1: null, option2: null, option3: null }),
        document.querySelectorAll(".product-details-modal-mobile").forEach((e) => {
            (e.style.bottom = "-100%"), (e.style.visibility = "hidden");
        });
}
function changeVideoSrc(e) {
    try {
        if ("" === e.getAttribute("src")) {
            let t = e.getAttribute("data-src");
            e.src = t;
        }
    } catch (e) { }
}
function loadVideoBlobThanPlay(e) {
    let t = e.getAttribute("data-src");
    (e.style.display = "none"),
        "" != e.getAttribute("src")
            ? ((e.style.display = "block"), e.play())
            : fetch(t)
                .then((e) => e.blob())
                .then((t) => {
                    const o = URL.createObjectURL(t);
                    (e.src = o), (e.style.display = "block"), e.play();
                })
                .catch((e) => {
                    console.error("Error fetching the video:", e);
                });
}
function loadVideoBlobSrc(e) {
    if ("" != e.getAttribute("src")) {
        let t = e.getAttribute("data-src");
        fetch(t)
            .then((e) => e.blob())
            .then((t) => {
                const o = URL.createObjectURL(t);
                (e.src = o), (e.style.display = "block"), e.pause();
            })
            .catch((e) => {
                console.error("Error fetching the video:", e);
            });
    }
}
function encodeAmpersands(e) {
    return e.replace(/&/g, "%26");
}
function openIOSShareWidget(e, t, o) {
    let i = encodeURIComponent(`${t} ${e}`),
        n = e,
        l = `\n\t<div id="sj-share-container" >\n\t\t<div class="sj-share-wrapper">\n\t\t\t<div class="sj-share-wrapper-close"><span>Share with</span><span style="cursor:pointer" onclick="closeIOSShareWidget()">✖</span></div>\n\t        <div id="sj-share-buttons">\n\t           <a class="facebook" target="blank" href="https://www.facebook.com/share.php?u=${(e = encodeURIComponent(
            `${e}`
        ))}" >\n\t\t\t   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">\n\t\t\t   <g fill="none" fill-rule="evenodd">\n\t\t\t\t <path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#3B5998" fill-rule="nonzero"></path>\n\t\t\t\t <path d="M25.7305108 45h5.4583577V30.0073333h4.0947673l.8098295-4.6846666h-4.9045968V21.928c0-1.0943333.7076019-2.2433333 1.7188899-2.2433333h2.7874519V15h-3.4161354v.021c-5.3451414.194-6.4433395 3.2896667-6.5385744 6.5413333h-.0099897v3.7603334H23v4.6846666h2.7305108V45z" fill="#FFF"></path>\n\t\t\t   </g>\n\t\t\t </svg>\n\t\t\t </a>\n\t           <a class="twitter" target="blank" href="https://twitter.com/intent/tweet?url=${e}&text=${(t = encodeURIComponent(
            t
        ))}" ><svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">\n\t\t\t   <g fill="none" fill-rule="evenodd">\n\t\t\t\t <path d="M28.486325 59.969298c-6.636404-.569063-11.56302-2.326956-16.321973-5.823932C4.443764 48.472116 0 39.646792 0 29.986934 0 15.11156 10.506778 2.798388 25.274412.36718c6.028107-.992411 12.703853.049265 18.28794 2.85363 13.576275 6.818095 19.7813 22.541053 14.64267 37.103159-3.527955 9.997705-12.789708 17.617785-23.391072 19.244938-2.085625.320112-5.065149.508645-6.327625.400391z" fill="#1DA1F2" fill-rule="nonzero"></path>\n\t\t\t\t <path d="M45.089067 17.577067c-.929778.595555-3.064534 1.460977-4.117334 1.460977v.001778C39.7696 17.784 38.077156 17 36.200178 17c-3.645511 0-6.6016 2.956089-6.6016 6.600178 0 .50631.058666 1.000178.16711 1.473778h-.001066c-4.945066-.129778-10.353422-2.608356-13.609244-6.85049-2.001778 3.46489-.269511 7.3184 2.002133 8.72249-.7776.058666-2.209067-.0896-2.882844-.747023-.045156 2.299734 1.060622 5.346845 5.092622 6.452267-.776533.417778-2.151111.297956-2.7488.209067.209778 1.941333 2.928355 4.479289 5.901155 4.479289C22.46009 38.565156 18.4736 40.788089 14 40.080889 17.038222 41.929422 20.5792 43 24.327111 43c10.650667 0 18.921956-8.631822 18.4768-19.280356-.001778-.011733-.001778-.023466-.002844-.036266.001066-.027378.002844-.054756.002844-.0832 0-.033067-.002844-.064356-.003911-.096356.9696-.66311 2.270578-1.836089 3.2-3.37991-.539022.296888-2.156089.891377-3.6608 1.038932.965689-.521244 2.396444-2.228266 2.749867-3.585777" fill="#FFF"></path>\n\t\t\t   </g>\n\t\t\t </svg></a>\n\t           <a class="linkedin" target="blank" href="https://www.linkedin.com/sharing/share-offsite/?url=${e}" >\n\t\t\t   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">\n\t\t\t   <g fill="none" fill-rule="evenodd">\n\t\t\t\t <path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#0077B5" fill-rule="nonzero"></path>\n\t\t\t\t <g fill="#FFF">\n\t\t\t\t   <path d="M17.88024691 22.0816337c2.14182716 0 3.87817284-1.58346229 3.87817284-3.53891365C21.75841975 16.58553851 20.02207407 15 17.88024691 15 15.73634568 15 14 16.58553851 14 18.54272005c0 1.95545136 1.73634568 3.53891365 3.88024691 3.53891365M14.88888889 44.8468474h6.95851852V24.77777778h-6.95851852zM31.6137778 33.6848316c0-2.3014877 1.0888889-4.552108 3.6925432-4.552108 2.6036543 0 3.2438518 2.2506203 3.2438518 4.4970883v10.960701h6.9274074V33.1816948c0-7.9263084-4.6853333-9.29280591-7.5676049-9.29280591-2.8798518 0-4.4682469.9740923-6.2961975 3.33440621v-2.70185178h-6.9471111V44.5905129h6.9471111V33.6848316z"></path>\n\t\t\t\t </g>\n\t\t\t   </g>\n\t\t\t </svg>  \n\t\t\t   </a>\n\t         \x3c!--  <a class="reddit" target="blank" href="http://www.reddit.com/submit?url=${e}&title=${(o = encodeURIComponent(
            o
        ))}" ><i class="fab fa-reddit"></i> Reddit</a> --\x3e\n\t           <a class="whatsapp" target="blank" href="https://api.whatsapp.com/send?text=${i}" >\n\t\t\t   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">\n\t\t\t   <g fill="none" fill-rule="evenodd">\n\t\t\t\t <circle cx="30" cy="30" r="30" fill="#25D366"></circle>\n\t\t\t\t <path d="M39.7746 19.3513C37.0512 16.5467 33.42 15 29.5578 15C21.6022 15 15.1155 21.6629 15.1155 29.8725C15.1155 32.4901 15.7758 35.0567 17.0467 37.3003L15 45L22.6585 42.9263C24.7712 44.1161 27.148 44.728 29.5578 44.728C37.5134 44.728 44 38.0652 44 29.8555C44 25.8952 42.498 22.1558 39.7746 19.3513ZM29.5578 42.2295C27.3956 42.2295 25.2829 41.6346 23.4508 40.5127L23.0051 40.2408L18.4661 41.4646L19.671 36.9093L19.3904 36.4334C18.1855 34.4618 17.5583 32.1841 17.5583 29.8555C17.5583 23.0397 22.9556 17.4986 29.5743 17.4986C32.7763 17.4986 35.7968 18.7904 38.0581 21.119C40.3193 23.4476 41.5737 26.5581 41.5737 29.8555C41.5572 36.6884 36.1764 42.2295 29.5578 42.2295ZM36.1434 32.966C35.7803 32.779 34.0142 31.8782 33.6841 31.7592C33.354 31.6402 33.1064 31.5722 32.8754 31.9462C32.6278 32.3201 31.9511 33.153 31.7365 33.4079C31.5219 33.6629 31.3238 33.6799 30.9607 33.4929C30.5976 33.306 29.4422 32.915 28.0558 31.6572C26.9829 30.6714 26.2567 29.4476 26.0421 29.0907C25.8275 28.7167 26.0256 28.5127 26.2072 28.3258C26.3722 28.1558 26.5703 27.8839 26.7518 27.6799C26.9334 27.4589 26.9994 27.3059 27.115 27.068C27.2305 26.813 27.181 26.6091 27.082 26.4221C26.9994 26.2351 26.2732 24.3994 25.9761 23.6686C25.679 22.9377 25.3819 23.0397 25.1673 23.0227C24.9528 23.0057 24.7217 23.0057 24.4741 23.0057C24.2265 23.0057 23.8469 23.0907 23.5168 23.4646C23.1867 23.8385 22.2459 24.7394 22.2459 26.5581C22.2459 28.3938 23.5333 30.1445 23.7149 30.3994C23.8964 30.6544 26.2567 34.3938 29.8714 36.0085C30.7297 36.3994 31.4064 36.6204 31.9345 36.7904C32.7928 37.0793 33.5851 37.0283 34.2123 36.9433C34.9055 36.8414 36.3415 36.0425 36.6551 35.1756C36.9522 34.3088 36.9522 33.5609 36.8697 33.4079C36.7541 33.255 36.5065 33.153 36.1434 32.966Z" fill="white"></path>\n\t\t\t   </g>\n\t\t\t </svg>\n\t\t\t   </a>\n\t         \x3c!--  <a class="telegram" target="blank" href="https://telegram.me/share/url?url=${e}&text=${t}" ><i class="fab fa-telegram"></i> Telegram</a> --\x3e\n            </div>\n\n\t\t\t<div id="sj-copy-url"> \n\t\t\t   <input value="${n}"/>\n\t\t\t   <button onclick="copyToClipboard('${n}')">Copy</button>\n\t\t\t</div>\n\n\t\t </div>\n    </div>`;
    document.body.insertAdjacentHTML("afterbegin", l), (document.querySelector("#sj-share-container").style.display = "flex");
}
function closeIOSShareWidget() {
    (document.querySelector("#sj-share-container").style.display = "none"), document.querySelector("#sj-share-container").remove();
}
function fixingHeightIos() {
    if (isIOS()) {
        return setTimeout(function () {
            let e = window.innerHeight;
            document.querySelectorAll(".swiper-slide").forEach((t) => {
                t.style.height = `${e}px`;
            }),
                document.querySelectorAll("#swiper-container-mobile").forEach((e) => {
                    e.style.height = `${window.innerHeight}px`;
                }),
                document.querySelectorAll(".tws-playlist-wrapper-mobile").forEach((e) => {
                    e.style.height = `${window.innerHeight}px`;
                }),
                document.querySelectorAll(".video-wrapper-mobile").forEach((e) => {
                    e.dispatchEvent(new Event("change")), (e.style.height = `${window.innerHeight}px`);
                }),
                document.querySelectorAll(".tws-product-vertical-swipe").forEach((e) => {
                    e.scrollLeft += 1;
                });
        }, 1500);
    }
}
function fixHeightOnIosOnResize() {
    isIOS() &&
        (document.querySelectorAll(".swiper-slide").forEach((e) => {
            e.style.height = `${window.innerHeight}px`;
        }),
            document.querySelectorAll("#swiper-container-mobile").forEach((e) => {
                e.style.height = `${window.innerHeight}px`;
            }),
            document.querySelectorAll(".tws-playlist-wrapper-mobile").forEach((e) => {
                e.style.height = `${window.innerHeight}px`;
            }),
            document.querySelectorAll(".video-wrapper-mobile").forEach((e) => {
                e.style.height = `${window.innerHeight}px`;
            }));
}
function executeAfterResizeStop() {
    fixingHeightIos();
}
function injectGa4Str() {
    let e = document.querySelector(".ga4str").innerText;
    const t = document.createRange().createContextualFragment(e);
    document.body.appendChild(t);
}
function isObjectInArrayExcludingCount(e, t) {
    for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (e.data_capture_id === i.data_capture_id) return "media_views" === i.event_name ? ((i.watchtime = e.watchtime), !0) : ((i.count = i.count + 1), i.count);
    }
    return !1;
}
function videoCardClickCapture(e, t, o) {
    const i = document.querySelector(`#type-${t}`).innerText;
    let n = `video_card_click_${e}_${t}_${o}`,
        l = document.querySelector(`#shopify-block-${t} .sj-scroll-bar`),
        s = l?.getAttribute("data-playlist-id"),
        r = { event_name: "video_card_click", media_id: e, screen: "playlist", page: page, playlist_id: s, count: 1, data_capture_id: n, section: i, device: deviceTypeDetect() };
    isObjectInArrayExcludingCount(r, user_interactions) || user_interactions.push(r);
}
function viewButtonClickCapture(e, t) {
    const o = document.querySelector(`#type-${t}`).innerText;
    let i = document.querySelector(`#shopify-block-${t} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        n = { event_name: "view_button_click", media_id: e, screen: "playlist", page: page, playlist_id: i, count: 1, data_capture_id: `view_button_click_${e}_${t}_${shop}`, section: o, device: deviceTypeDetect() };
    isObjectInArrayExcludingCount(n, user_interactions) || user_interactions.push(n);
}
function sectionSwipeCapture(e) {
    const t = document.querySelector(`#type-${e}`).innerText;
    let o = document.querySelector(`#shopify-block-${e} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        i = { event_name: "section_swipe", screen: "playlist", page: page, playlist_id: o, count: 1, data_capture_id: `section_swipe_${t}_${e}_${shop}`, section: t, device: deviceTypeDetect() };
    isObjectInArrayExcludingCount(i, user_interactions) || user_interactions.push(i);
}
function slideChangeCapture(e, t, o) {
    const i = document.querySelector(`#type-${o}`).innerText;
    let n = t.slides[e],
        l = n.getAttribute("data-playlist-id"),
        s = n.getAttribute("data-media-id"),
        r = { event_name: "slide_change", media_id: s, page: page, screen: "playlist", playlist_id: l, count: 1, data_capture_id: `slide_change_${e}_${l}_${s}_${shop}_${i}`, section: i, device: deviceTypeDetect() };
    isObjectInArrayExcludingCount(r, user_interactions) || user_interactions.push(r);
}
function atcClickCapture(e, t, o) {
    const i = document.querySelector(`#type-${o}`).innerText;
    deviceTypeDetect();
    let n = `atc_click_${e}_${o}_${t}_${shop}_${i}`,
        l = document.querySelector(`#shopify-block-${o} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        s = { event_name: "atc_click", media_id: e, screen: "playlist", page: page, playlist_id: l, count: 1, data_capture_id: n, product_id: t, section: i, device: deviceTypeDetect(), screen: "product_details_drawer" };
    isObjectInArrayExcludingCount(s, user_interactions) || user_interactions.push(s);
}
function buyNowClickCapture(e, t, o) {
    const i = document.querySelector(`#type-${o}`).innerText;
    deviceTypeDetect();
    let n = document.querySelector(`#shopify-block-${o} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        l = {
            event_name: "buy_now_click",
            media_id: e,
            screen: "playlist",
            page: page,
            playlist_id: n,
            count: 1,
            data_capture_id: `buy_now_click_${e}_${t}_${o}_${i}`,
            product_id: t,
            section: i,
            device: deviceTypeDetect(),
            screen: "product_details_drawer",
        };
    isObjectInArrayExcludingCount(l, user_interactions) || user_interactions.push(l);
}
function viewDetailsClickCapture(e, t, o) {
    const i = document.querySelector(`#type-${o}`).innerText;
    deviceTypeDetect();
    let n = document.querySelector(`#shopify-block-${o} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        l = { event_name: "view_details_click", media_id: e, screen: "media_modal", page: page, playlist_id: n, count: 1, data_capture_id: `view_details_click_${e}_${t}_${o}_${i}`, product_id: t, section: i, device: deviceTypeDetect() };
    isObjectInArrayExcludingCount(l, user_interactions) || user_interactions.push(l);
}
function mediaViewsCapture() { }
function mediaDurationCapture() { }
function offerCopiedCapture(e, t, o, i) {
    const n = document.querySelector(`#type-${i}`).innerText;
    let l = deviceTypeDetect(),
        s = document.querySelector(".tws-playlist-wrapper-desktop").getAttribute("data-playlist-id"),
        r = { event_name: "offer_copied", media_id: t, screen: "offers", page: page, playlist_id: s, count: 1, data_capture_id: `offer_copied_${t}_${e}_${i}_${n}`, product_id: e, section: n, device: l };
    isObjectInArrayExcludingCount(r, user_interactions) || user_interactions.push(r);
}
function offerViewCapture(e, t, o) {
    const i = document.querySelector(`#type-${o}`).innerText;
    let n = deviceTypeDetect(),
        l = document.querySelector(`#shopify-block-${o} .sj-scroll-bar`).getAttribute("data-playlist-id"),
        s = { event_name: "offer_viewed", media_id: t, screen: "offers", page: page, playlist_id: l, count: 1, data_capture_id: `offer_viewed_${t}_${e}_${o}_${i}`, product_id: e, section: i, device: n };
    isObjectInArrayExcludingCount(s, user_interactions) || user_interactions.push(s);
}
function productSwipeCapture() { }
async function storeAllAnalytics() {
    try {
        if (plan_data?.extension_analytics) {
            let e = deviceTypeDetect(),
                t = JSON.stringify({ shop: shop, anonymous_id: anonymous_id || "", customer_id: customer_id || "", session_obj: session_obj, device: e, browser: "chrome", interactions: user_interactions }),
                o = await fetch(`${origin}/client/capture-events`, { keepalive: !0, method: "POST", headers: { "Content-Type": "application/json" }, body: t });
            if (o.ok) {
                await o.json();
            } else console.error("Error:", o.status);
            user_interactions = [];
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
history.pushState(null, null, document.URL),
    history.replaceState(null, null, document.URL),
    (window.onpopstate = function (e) {
        history.pushState(null, null, document.URL), preventBackButton();
    }),
    openModalOnVisiting(),
    injectGa4Str(),
    injectCustomer(),
    window.addEventListener("pagehide", () => {
        storeAllAnalytics(), showCartCount();
    }),
    window.addEventListener("beforeunload", function (e) {
        storeAllAnalytics(), showCartCount();
    }),
    window.addEventListener("visibilitychange", (e) => {
        storeAllAnalytics(), showCartCount();
    });
