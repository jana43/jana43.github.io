let origin = "https://oracle-obesity-family-bachelor.trycloudflare.com";
let analytics_unique_id_global = 0;
let plan_data;
let user_interactions = [];
let page = window.location.href;
let shop = Shopify.shop;
let anonymous_id = localStorage.getItem("anonymousIdTWS");
let customer_id = localStorage.getItem("customerIdTWS");
let session = getItemWithExpiry("twsSession");
let currentMediaID = null;
let currentPlaylistId = null;
const currentDate = new Date();
const isoString = currentDate.toISOString();
let session_obj = { session: session, time_stamp: isoString };
const parentSelector = ".shopify-section";
let global_element = document.querySelector(".tws-playlist-wrapper-desktop");
let global_playListId = global_element?.getAttribute("data-playlist-id");
let currentIntervalId = 23432;
let sendMediaId;
let sendWatchtime;
let sendViews;
let offerviewsr = 0;

function openModalOnVisiting() {
    var url = window.location.href;
    var urlParams = new URLSearchParams(url.split("?")[1]);
    var blockId = urlParams.get("block_id");
    var m_id = urlParams.get("m_id");
    if (blockId && m_id) {
        let active_index;
        if (window.innerWidth < 650) {
            active_index = document
                .querySelector(`.v-${blockId}-mob-m-vid-${m_id}`)
                .getAttribute("data-swipe-index");
        } else {
            active_index = document
                .querySelector(`.v-${blockId}-desk-m-vid-${m_id}`)
                .getAttribute("data-swipe-index");
        }
        openModalTW(active_index, "", "", blockId);
    } else {
    }
}
function provideSharebleURL(block_id, m_id) {
    let url_pattern = `${window.location.href.split("?")[0]
        }?block_id=${block_id}&m_id=${m_id}`;
    if (navigator.share) {
        navigator
            .share({
                title: document.title,
                text: "Checkout this video",
                url: url_pattern,
            })
            .then(() => { })
            .catch((error) => { });
    } else {
        openIOSShareWidget(
            url_pattern,
            "Watch this cool shoppable video: ",
            document.title
        );
    }
}
function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Copied to clipboard!");
}
function muteUnmute(vid_id) {
    let vidElement = document.querySelector(`.${vid_id}`);
    let speakerElement = document.querySelector(`#${vid_id}-controller .speaker`);
    let noSpeakerElement = document.querySelector(
        `#${vid_id}-controller .nospeaker`
    );
    if (vidElement.muted) {
        vidElement.muted = !1;
        speakerElement.style.display = "block";
        noSpeakerElement.style.display = "none";
    } else {
        vidElement.muted = !0;
        speakerElement.style.display = "none";
        noSpeakerElement.style.display = "block";
    }
}
function muteUnmuteAll() {
    let speakerElements = document.querySelectorAll(
        ".sj-vid-mute-unmute .speaker"
    );
    let noSpeakerElements = document.querySelectorAll(
        ".sj-vid-mute-unmute .nospeaker"
    );
    let allVideosInMobile = document.querySelectorAll(
        ".video-wrapper-mobile video"
    );
    let allVideosInDesktop = document.querySelectorAll(
        ".modal-video-wrapper video"
    );
    let allVideos = [...allVideosInMobile, ...allVideosInDesktop];
    let muted = !0;
    allVideos.forEach((video) => {
        if (video.muted) {
            video.muted = !1;
            muted = !1;
        } else {
            video.muted = !0;
            muted = !0;
        }
    });
    if (muted) {
        speakerElements.forEach((node) => {
            node.style.display = "none";
        });
        noSpeakerElements.forEach((node) => {
            node.style.display = "block";
        });
    } else {
        speakerElements.forEach((node) => {
            node.style.display = "block";
        });
        noSpeakerElements.forEach((node) => {
            node.style.display = "none";
        });
    }
}
function updateVideoSource(video) {
    const source = video;
    if (source && source.getAttribute("data-src")) {
        const currentSrc = source.getAttribute("src");
        if (currentSrc !== source.getAttribute("data-src")) {
            source.src = source.getAttribute("data-src");
            video.load();
        }
    }
}
function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
            updateVideoSource(video);
            video.play();
        } else {
            video.pause();
        }
    });
}
function handleIntersectionImg(entries, observer) {
    entries.forEach((entry) => {
        const img = entry.target;
        if (entry.isIntersecting) {
            let src = img.getAttribute("data-src");
            if (src) {
                img.src = src
            }
        }
    });
}
function handleCardVideoPlay(vid) {
    let loader_element_id = vid.getAttribute("data-vlc");
    let loader_element = document.getElementById(`${loader_element_id}`);
    loader_element.style.display = "none";
    vid.play();
}
function handleCardVideoWaiting(vid) {
    let loader_element_id = vid.getAttribute("data-vlc");
    let loader_element = document.getElementById(`${loader_element_id}`);
    loader_element.style.display = "flex";
}
const glow_observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
});

const glow_observer_img = new IntersectionObserver(handleIntersectionImg, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
});
const videos = document.querySelectorAll("video.tw-viewport-video[data-src]");
videos.forEach((video) => {
    glow_observer.observe(video);
});
const images = document.querySelectorAll(".sj-im-lazy-load");
images.forEach((image) => {
    glow_observer_img.observe(image);
});

var interleaveOffset = 0.75;
const swiperMobileSliders = document.querySelectorAll(".swiper-mobile-slider");
swiperMobileSliders.forEach((swiper) => {
    let blockId = swiper.getAttribute("data-block-id");
    swiperMobile["" + blockId + ""] = new Swiper(
        ".modal-mobile-block-" + blockId,
        {
            direction: "vertical",
            mousewheel: !0,
            lazy: !0,
            loop: !0,
            on: {
                slideChange: function () {
                    clearInterval(currentIntervalId);
                    document.querySelectorAll(".swipe-up-indicator").forEach((node) => {
                        node.style.display = "none";
                    });
                    const index_currentSlide = this.activeIndex;
                    handleVideoPlayback(index_currentSlide, this);
                    slideChangeCapture(index_currentSlide, this, blockId);
                    validateViews(index_currentSlide, this, blockId);
                    setCurrentMediaPlaylistID(index_currentSlide, this);
                    executeAfterResizeStop();
                    closeAllProductDetailsModal();
                    showCartCount();
                },
            },
        }
    );
});
function loadMultipleScripts(urls, callback) {
    let loadedCount = 0;
    function loadScript(url) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = function () {
            loadedCount++;
            if (loadedCount === urls.length) {
                if (callback) {
                    callback();
                }
            }
        };
        document.head.appendChild(script);
    }
    urls.forEach((url) => loadScript(url));
}
function loadMultipleStylesheets(urls) {
    urls.forEach((url) => {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = url;
        document.head.appendChild(stylesheet);
    });
}
const jsFiles = ["https://cdn.jsdelivr.net/npm/toastify-js"];
const cssFiles = [
    "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css",
];
loadMultipleScripts(jsFiles, function () { });
loadMultipleStylesheets(cssFiles);
function showToast(text) {
    Toastify({
        text: text,
        duration: 3000,
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

async function injectCustomer() {
    try {
        let currentAnonumousId = localStorage.getItem("anonymousIdTWS");
        let current_session = getItemWithExpiry("twsSession");
        let shopifyCustomerDataDiv = document.getElementById("nltk-expc");
        let shopifyCustomerData;
        if (shopifyCustomerDataDiv && shopifyCustomerDataDiv != undefined) {
            shopifyCustomerData = JSON.parse(shopifyCustomerDataDiv.innerText);
        }
        let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
        };
        let bodyContent = JSON.stringify({
            current_anonymous_id: currentAnonumousId,
            shopifyCustomerData: shopifyCustomerData,
            current_session: current_session,
            shop: shop,
        });
        let response = await fetch(`${origin}/client/inject-customer`, {
            method: "POST",
            body: bodyContent,
            headers: headersList,
        });
        let data = await response.json();
        if (data.anonymouys_id) {
            localStorage.setItem("anonymousIdTWS", data.anonymouys_id);
        }
        if (data.customer_id) {
            localStorage.setItem("customerIdTWS", data.customer_id);
        }
        if (data.current_anonymous_id) {
            localStorage.setItem("customerIdTWS", data.customer_id);
        }
        if (data.session) {
            setItemWithExpiry("twsSession", { session: data.session }, 1000);
            session_obj = { session: data.session, time_stamp: isoString };
        }
        anonymous_id = localStorage.getItem("anonymousIdTWS");
        customer_id = localStorage.getItem("customerIdTWS");
        plan_data = data?.plan_data;
        // if(plan_data){
        //     var scriptElement = document.createElement('script');
        //     scriptElement.src = 'https://jana43.github.io/script/glow.analytics.js';
        //     scriptElement.id = "glow_anlytics_js";
        //     if (!document.querySelector("#glow_anlytics_js")) {
        //         console.log("appending script")
        //         document.body.appendChild(scriptElement);
        //     }
        // }
    } catch (error) { }
}
async function eventToBackend(
    event_name,
    session_obj,
    media_id,
    screen,
    page,
    product_id,
    playlist_id
) {
    let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
    };
    let device_type = deviceTypeDetect();
    let bodyContent = JSON.stringify({
        anonymous_id: anonymous_id ? anonymous_id : "",
        customer_id: customer_id ? customer_id : "",
        event_name: event_name,
        session_obj: session_obj,
        media_id: media_id,
        screen: screen,
        page: page,
        shop: shop,
        product_id: product_id != undefined ? product_id : "",
        playlist_id: playlist_id != undefined ? playlist_id : "",
        device: device_type,
        browser: "chrome",
    });
    let response = await fetch(`${origin}/client/capture-events`, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
    });
    let data = await response.json();
    if (data.status) {
    }
}
function sendMobileProductSwipe(block_id, media_id, playlist_id) { }
sendMobileProductSwipe();
function glbReset() {
    offerviewsr = 0;
}
let totalVideoViews = 0;
let mediaViews = {};
let mobile_media_views = {};
let desktop_media_views = {};
let interactions = {
    mobile_media_views: mobile_media_views,
    desktop_media_views: desktop_media_views,
};
function sectionSwipe() {
    const swipeable_sections = document.querySelector(
        ".card-grid-wrapper.desktop-view"
    );
    let isScrolling = !1;
    let scrollEndTimeout;
    let device_type = deviceTypeDetect();
    switch (device_type) {
        case "mobile":
            swipeable_sections.addEventListener("scroll", function () {
                if (!isScrolling) {
                    isScrolling = !0;
                }
                clearTimeout(scrollEndTimeout);
                scrollEndTimeout = setTimeout(function () {
                    isScrolling = !1;
                    if (interactions.mobile_section_swipe != undefined) {
                        interactions.mobile_section_swipe =
                            parseInt(interactions.mobile_section_swipe) + 1;
                    } else {
                        interactions.mobile_section_swipe = 1;
                    }
                }, 250);
            });
            break;
        case "desktop":
            swipeable_sections.addEventListener("scroll", function () {
                if (!isScrolling) {
                    isScrolling = !0;
                }
                clearTimeout(scrollEndTimeout);
                scrollEndTimeout = setTimeout(function () {
                    isScrolling = !1;
                    if (interactions.desktop_section_swipe != undefined) {
                        interactions.desktop_section_swipe =
                            parseInt(interactions.desktop_section_swipe) + 1;
                    } else {
                        interactions.desktop_section_swipe = 1;
                    }
                }, 250);
            });
            break;
    }
}
function viewButtonClick() {
    let device_type = deviceTypeDetect();
    switch (device_type) {
        case "mobile":
            if (interactions.mobile_view_button_click) {
                interactions.mobile_view_button_click =
                    parseInt(interactions.mobile_view_button_click) + 1;
            } else {
                interactions.mobile_view_button_click = 1;
            }
            break;
        case "desktop":
            if (interactions.desktop_view_button_click) {
                interactions.desktop_view_button_click =
                    parseInt(interactions.desktop_view_button_click) + 1;
            } else {
                interactions.desktop_view_button_click = 1;
            }
            break;
    }
}
function setCurrentMediaPlaylistID(index, node) {
    let currentSlide = node.slides[index];
    currentPlaylistId = currentSlide.getAttribute("data-playlist-id");
    currentMediaID = currentSlide.getAttribute("data-media-id");
}
function validateViews(index, node, block_id) {
    try {
        const type = document.querySelector(`#type-${block_id}`).innerText;
        let currentSlide = node.slides[index];
        let playlist_id = currentSlide.getAttribute("data-playlist-id");
        let media_id = currentSlide.getAttribute("data-media-id");
        let currentVideo = currentSlide.querySelector("video");
        let watchTime = 0;
        let views = 0;
        let device_type = deviceTypeDetect();
        let data_capture_id = `media_views_${media_id}_${playlist_id}_${type}`;
        let total_watch_time = 0;
        currentVideo.addEventListener("timeupdate", function () {
            const watchTime = currentVideo.currentTime;
            total_watch_time = watchTime;
            let objectToPush = {
                event_name: "media_views",
                media_id: media_id,
                screen: "media_modal",
                page: page,
                playlist_id: playlist_id,
                count: 1,
                data_capture_id: data_capture_id,
                section: type,
                device: deviceTypeDetect(),
                screen: "media_modal",
                watchtime: watchTime,
            };
            let watchtime = isObjectInArrayExcludingCount(
                objectToPush,
                user_interactions
            );
            if (!watchtime) {
                user_interactions.push(objectToPush);
            }
        });
        currentIntervalId = intervalID;
    } catch (error) { }
}
async function sendMediaDurationToBackend(
    event_name,
    session_obj,
    media_id,
    screen,
    page,
    playListId,
    duration,
    views,
    device_type
) {
    if (plan_data?.capture_views) {
        let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
        };
        let bodyContent = JSON.stringify({
            anonymous_id: anonymous_id,
            event_name: event_name,
            session_obj: session_obj,
            media_id: media_id,
            playlist_id: playListId,
            duration: duration,
            screen: screen,
            page: page,
            shop: shop,
            views: views,
            device_type: device_type,
        });
        let response = await fetch(`${origin}/client/capture-media-views`, {
            method: "POST",
            body: bodyContent,
            headers: headersList,
        });
        let data = await response.json();
        if (data.status) {
        }
    } else {
    }
}
function recordCardModalClick() {
    let device_type = deviceTypeDetect();
    switch (device_type) {
        case "mobile":
            if (interactions.mobile_card_video_click) {
                interactions.mobile_card_video_click =
                    parseInt(interactions.mobile_card_video_click) + 1;
            } else {
                interactions.mobile_card_video_click = 1;
            }
            break;
        case "desktop":
            if (interactions.desktop_card_video_click) {
                interactions.desktop_card_video_click =
                    parseInt(interactions.desktop_card_video_click) + 1;
            } else {
                interactions.desktop_card_video_click = 1;
            }
            break;
    }
}
function recordMediaChange() {
    let device_type = deviceTypeDetect();
    switch (device_type) {
        case "mobile":
            if (interactions.mobile_slide_change) {
                interactions.mobile_slide_change =
                    parseInt(interactions.mobile_slide_change) + 1;
            } else {
                interactions.mobile_slide_change = 1;
            }
            break;
        case "desktop":
            if (interactions.desktop_slide_change) {
                interactions.desktop_slide_change =
                    parseInt(interactions.desktop_slide_change) + 1;
            } else {
                interactions.desktop_slide_change = 1;
            }
            break;
    }
}
async function getAnalytics() {
    try {
        const data = await fetch(`${origin}/client/get-analytics`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ shop: window.Shopify.shop }),
        });
        if (data) {
            const status = await data.json();
            let allMedia = status.data;
            allMedia.forEach((media) => {
                mediaViews[media.media_id] = media.views;
                totalVideoViews += parseInt(media.views);
            });
        }
    } catch (error) { }
}
getAnalytics();
function deviceTypeDetect() {
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    const isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent);
    const isDesktop = !isMobile;
    if (isMobile) {
        return "mobile";
    } else {
        return "desktop";
    }
}
function deviceCheck() {
    var userAgent = navigator.userAgent;
    var brandRegexes = {
        Apple: /iPhone|iPad|iPod/,
        Samsung: /Samsung/,
        Google: /Pixel/,
        Huawei: /Huawei/,
        Xiaomi: /Xiaomi/,
        OnePlus: /OnePlus/,
        LG: /LG/,
        Sony: /Sony/,
    };
    var deviceBrand = "Unknown";
    Object.keys(brandRegexes).forEach(function (brand) {
        if (brandRegexes[brand].test(userAgent)) {
            deviceBrand = brand;
        }
    });
}
function getBroswerType() {
    if (navigator.userAgentData) {
        const brands = navigator.userAgentData.brands;
        let browserName = "Unknown";
        if (brands.some((brand) => brand.brand.toLowerCase() === "google chrome")) {
            browserName = "Chrome";
        } else if (
            brands.some((brand) => brand.brand.toLowerCase() === "firefox")
        ) {
            browserName = "Firefox";
        } else if (brands.some((brand) => brand.brand.toLowerCase() === "safari")) {
            browserName = "Safari";
        } else if (
            brands.some((brand) => brand.brand.toLowerCase() === "microsoft edge")
        ) {
            browserName = "Microsoft Edge";
        } else if (brands.some((brand) => brand.brand.toLowerCase() === "opera")) {
            browserName = "Opera";
        }
        return browserName;
    } else {
        return browserName;
    }
}
function setItemWithExpiry(key, value, expirySeconds) {
    const now = new Date();
    const expiryTime = now.getTime() + expirySeconds * 1000;
    const item = { value: value, expiry: expiryTime };
    localStorage.setItem(key, JSON.stringify(item));
}
function getItemWithExpiry(key) {
    const item = localStorage.getItem(key);
    if (!item) {
        return null;
    }
    const parsedItem = JSON.parse(item);
    const now = new Date().getTime();
    if (parsedItem.expiry < now) {
        localStorage.removeItem(key);
        return null;
    }
    return parsedItem.value;
}
var windowSize = window.innerWidth;
function closeModalTW(block_id) {
    try {
        let Parent = document.querySelector(
            `#shopify-block-${block_id}`
        ).parentElement;
        let modalID;
        if (windowSize < 650) {
            modalID = document
                .querySelector(`#shopify-block-${block_id}`)
                .querySelector("#card-modal-mobile");
        } else {
            modalID = document
                .querySelector(`#shopify-block-${block_id}`)
                .querySelector("#card-modal-desktop");
            const parentSelector = ".shopify-section";
            let sticky_wrapperv = document.querySelector(
                ".shoppable-in-product-sticky-wrapper"
            );
            if (sticky_wrapperv) sticky_wrapperv.style.display = "block";
        }
        let eles = document.querySelectorAll(
            `#shopify-block-${block_id} .product-details-modal-mobile`
        );
        for (let i = 0; i < eles.length; i++) {
            eles[i].style.display = "none";
            eles[i].style.visibility = "hidden";
            eles[i].style.bottom = "-100%";
        }
        modalID.style.transform = "scale(0)";
        modalID.style.height = "0";
        unstickFromTop(Parent);
        document.querySelector(`#shopify-block-${block_id}`).scrollIntoView();
        closeAllProductDetailsModal();
        storeAllAnalytics();
    } catch (e) { }
    document.querySelectorAll(".swiper-slide video").forEach((node) => {
        node.pause();
    });
    document.body.style.overflow = "auto";
    playCardVideos();
}
var twParentElement = "";
function stickToTop(pElement) {
    try {
        document.querySelectorAll(".sj-scroll-bar").forEach((element) => {
            element.style.display = "none";
        });
        if (pElement) {
            twParentElement = pElement;
            pElement.classList.add("tw-section-position");
            document.querySelector("html").classList.add("tw-position");
            return !0;
        } else {
            return !1;
        }
    } catch (e) { }
}
function unstickFromTop() {
    try {
        document.querySelectorAll(".sj-scroll-bar").forEach((element) => {
            element.style.display = "block";
        });
        if (twParentElement) {
            twParentElement.classList.remove("tw-section-position");
            document.querySelector("html").classList.remove("tw-position");
            return !0;
        } else {
            return !1;
        }
    } catch (e) { }
}
let pausedVideoIndexesTW = [];
function pauseAllCardVideos() {
    let elements = document.querySelectorAll(".inner-video-wrapper video");
    let j = 0;
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i].paused) {
            elements[i].pause();
            pausedVideoIndexesTW[j] = i;
            j++;
        }
    }
}
function playCardVideos() {
    let elements = document.querySelectorAll(".inner-video-wrapper video");
    pausedVideoIndexesTW.forEach((videoIndex) => {
        elements[videoIndex].play();
    });
    pausedVideoIndexesTW = [];
}
async function openModalTW(loop, media_id, type, block_id) {
    
    let all_medias = retriveValuesDesktopModal()[0]
    let playlist = retriveValuesDesktopModal()[1]
    // let block_id = retriveValuesDesktopModal()[]
    console.log("necessary datas ...... ", retriveValuesDesktopModal());
    await loadJSFile("https://jana43.github.io/script/glow_inject_desktop_modal.js")
    injectDesktopModal(all_medias, playlist, block_id);
    let swiperDesktop = [];
    let swiperMobile = [];
    const swiperDesktopSliders = document.querySelectorAll(".swiper-slider");
    swiperDesktopSliders.forEach((swiper) => {
        let blockId = swiper.getAttribute("data-block-id");
        swiperDesktop["" + blockId + ""] = new Swiper(
            ".modal-desktop-block-" + blockId,
            {
                centeredSlides: !0,
                slidesPerView: 2,
                grabCursor: !0,
                freeMode: !1,
                loop: !1,
                mousewheel: !1,
                keyboard: { enabled: !0 },
                pagination: {
                    el: ".swiper-pagination",
                    dynamicBullets: !1,
                    clickable: !0,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                breakpoints: {
                    0: { slidesPerView: 1, spaceBetween: 20 },
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    640: { slidesPerView: 1, spaceBetween: 5 },
                    1024: { slidesPerView: 1, spaceBetween: 10 },
                    1280: { slidesPerView: 2, spaceBetween: 10 },
                },
                on: {
                    slideChange: function () {
                        const index_currentSlide = this.realIndex;
                        handleVideoPlayback(index_currentSlide, this);
                        slideChangeCapture(index_currentSlide, this, blockId);
                        validateViews(index_currentSlide, this, blockId);
                        setCurrentMediaPlaylistID(index_currentSlide, this);
                        closeAllProductDetailsModal();
                        showCartCount();
                    },
                },
            }
        );
    });
    let pElement = document.querySelector(
        `#shopify-block-${block_id}`
    ).parentElement;
    stickToTop(pElement);
    if (windowSize < 650) {
        let h = window.innerHeight;
        let modalIDmobile = document
            .querySelector("#shopify-block-" + block_id)
            .querySelector("#card-modal-mobile");
        modalIDmobile.style.transform = "scale(1)";
        modalIDmobile.style.height = `${h}px`;
        modalIDmobile.classList.add("mobile-modal-opened");
        swiperMobile[block_id].slideTo(loop);
        let currentIndex = swiperMobile[block_id].realIndex;
        const swiper_nodez = swiperMobile[block_id];
        handleVideoPlayback(currentIndex, swiper_nodez);
        validateViews(currentIndex, swiper_nodez, block_id);
        setCurrentMediaPlaylistID(currentIndex, swiper_nodez);
        
    } else {
        let modalID = document
            .querySelector(`#shopify-block-${block_id}`)
            .querySelector("#card-modal-desktop");
        modalID.style.transform = "scale(1)";
        modalID.style.height = "100%";
        modalID.classList.add("desktop-modal-opened");
        swiperDesktop[block_id].slideTo(loop);
        let currentIndex = swiperDesktop[block_id].realIndex;
        const swiper_nodez = swiperDesktop[block_id];
        handleVideoPlayback(currentIndex, swiper_nodez);
        fixHeightOnIosOnResize();
        fetchProductDetailsGlow(swiper_nodez.slides[currentIndex], block_id, media_id);
        console.log("all set ....")
        validateViews(currentIndex, swiper_nodez, block_id);
        setCurrentMediaPlaylistID(currentIndex, swiper_nodez);
       
    }
    pauseAllCardVideos();
    videoCardClickCapture(media_id, block_id, type);
    document.body.style.overflow = "hidden";
}

function loadJSFile(src) {
    return new Promise((resolve, reject) => {
        if (!document.getElementById("glow_desktop_modal_inject_js")) {
            const script = document.createElement('script');
            script.id = "glow_desktop_modal_inject_js"
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        } else {
            resolve()
        }

    });
}


function isIOS() {
    return (
        [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
        ].includes(navigator.platform) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
}
function handleVideoPlayback(currentIndex, swiper_nodez) {
    let currentSlide;
    let nextSlide;
    let previousSlide;
    if (currentIndex == swiper_nodez.slides.length - 1) {
        currentSlide = swiper_nodez.slides[currentIndex];
        nextSlide = swiper_nodez.slides[currentIndex - 1];
        previousSlide = swiper_nodez.slides[currentIndex - 2];
    } else if (currentIndex == 0) {
        currentSlide = swiper_nodez.slides[currentIndex];
        nextSlide = swiper_nodez.slides[currentIndex + 1];
        previousSlide = swiper_nodez.slides[currentIndex + 2];
    } else {
        currentSlide = swiper_nodez.slides[currentIndex];
        nextSlide = swiper_nodez.slides[currentIndex + 1];
        previousSlide = swiper_nodez.slides[currentIndex - 1];
    }
    updateVideoSource(currentSlide?.querySelector("video"));
    updateVideoSource(nextSlide?.querySelector("video"));
    updateVideoSource(previousSlide?.querySelector("video"));
    let videoTime = currentSlide?.querySelector("video");
    videoTime.currentTime = 0;
    currentSlide?.querySelector("video").addEventListener("waiting", (event) => {
        let loader_vis = currentSlide?.querySelector(".sj-vid-loader");
    });
    let visibility = currentSlide?.querySelector("video").style.display;
    visibility = "none";
    var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    if (isMac) {
        let loader_vis = currentSlide?.querySelector(".sj-vid-loader");
        loader_vis.style.display = "none";
        currentSlide?.querySelector("video").play();
    } else if (!isIOS()) {
        currentSlide
            ?.querySelector("video")
            .addEventListener("canplay", (event) => {
                visibility = "block";
                let loader_vis = currentSlide?.querySelector(".sj-vid-loader");
                loader_vis.style.display = "none";
                currentSlide?.querySelector("video").play();
            });
    } else {
        let loader_vis = currentSlide?.querySelector(".sj-vid-loader");
        loader_vis.style.display = "none";
        currentSlide?.querySelector("video").play();
    }
    nextSlide?.querySelector("video").pause();
    previousSlide?.querySelector("video").pause();
}
function closeInnerModal(eleID) {
    let elements = document.querySelectorAll(`#${eleID}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}
function closeAllProductDetailsModal() {
    document.querySelectorAll(".d-inner-product-wrapper").forEach((node) => {
        node.style.display = "none";
    });
}
function openInnerModal(blockID, eleID, media_id, productID) {
    if (windowSize > 650) {
        let elements = document.querySelectorAll(
            `#shopify-block-${blockID} #${eleID}`
        );
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].style.display == "block") {
                elements[i].style.display = "none";
            } else {
                elements[i].style.display = "block";
            }
        }
    } else {
        let mElement = document.querySelector(
            `#shopify-block-${blockID} .product-details-modal-mobile`
        );
        mElement.style.bottom = "0";
        mElement.style.display = "block";
        mElement.style.visibility = "visible";
        let allClass = document.querySelectorAll(
            `#shopify-block-${blockID} .inner-product-details-wrapper`
        );
        for (let i = 0; i < allClass.length; i++) {
            allClass[i].style.display = "none";
        }
        let mInnerEle = document.querySelectorAll(
            `#shopify-block-${blockID} #${eleID}`
        );
        for (let i = 0; i < mInnerEle.length; i++) {
            mInnerEle[i].style.display = "block";
        }
    }
    viewDetailsClickCapture(media_id, productID, blockID);
}
function openOfferModal() {
    let offerElement = document.getElementsByClassName("offer-modal-wrapper");
    for (let i = 0; i < offerElement.length; i++) {
        offerElement[i].style.display = "block";
    }
}
function closeOfferModal() {
    let offerElement = document.getElementsByClassName("offer-modal-wrapper");
    for (let i = 0; i < offerElement.length; i++) {
        offerElement[i].style.display = "none";
    }
}
function hasChildWithDataBlockHandle(parentSelector) {
    let position = document.querySelector("#sticky-position-sj-shoppable");
    if (position) {
        position = position.innerText;
        const parentElements = document.querySelectorAll(parentSelector);
        const isMobile = window.innerWidth <= 768;
        for (const parentElement of parentElements) {
            const childElement = parentElement.querySelector(
                '[data-block-handle="in-product-sticky"]'
            );
            if (childElement) {
                if (position.includes("bottom_right")) {
                    parentElement.style.position = "fixed";
                    if (isMobile) {
                        parentElement.style.bottom = "4%";
                        parentElement.style.right = "2%";
                    } else {
                        parentElement.style.bottom = "10%";
                        parentElement.style.right = "10%";
                    }
                } else if (position.includes("bottom_left")) {
                    parentElement.style.position = "fixed";
                    if (isMobile) {
                        parentElement.style.bottom = "4%";
                        parentElement.style.left = "0";
                    } else {
                        parentElement.style.bottom = "10%";
                        parentElement.style.right = "80%";
                    }
                } else if (position.includes("top_left")) {
                    parentElement.style.position = "fixed";
                    if (isMobile) {
                        parentElement.style.top = "4%";
                        parentElement.style.left = "2%";
                    } else {
                        parentElement.style.top = "40%";
                        parentElement.style.right = "80%";
                    }
                } else if (position.includes("top_right")) {
                    parentElement.style.position = "fixed";
                    parentElement.style.top = isMobile ? "4%" : "40%";
                    parentElement.style.right = isMobile ? "2%" : "10%";
                }
                parentElement.style.zIndex = "99999";
                parentElement.style.zIndex = "fit-content";
            }
        }
    }
    return !1;
}
function getTheChildOutFromParent(block_id) {
    let ele = document.querySelector(`#${block_id} .shoppable-sticky-video-sj`);
    ele.remove();
    document.body.appendChild(ele);
}
try {
    function closeSticky() {
        var elements = document.querySelectorAll(`.shoppable-sticky-video-sj`);
        elements.forEach((ele) => {
            ele.style.opacity = 0;
        });
    }
    function IPSModalOpen(block_id) {
        const parentElements = document.querySelectorAll(parentSelector);
        const isMobile = window.innerWidth <= 768;
        for (const parentElement of parentElements) {
            const childElement = parentElement.querySelector(
                '[data-block-handle="in-product-sticky"]'
            );
            if (childElement) {
                parentElement.style.position = "unset";
            }
        }
        let sticky_wrapperv = document.querySelector(
            ".shoppable-in-product-sticky-wrapper"
        );
        if (sticky_wrapperv) sticky_wrapperv.style.display = "none";
        openModalTW("0", "{{ firstMediaKey }}", "sticky-in-product", block_id);
    }
} catch (error) { }
async function productAddToCart(
    event,
    productHandle,
    productID,
    mediaID,
    block_id
) {
    const section = document.querySelector(`#type-${block_id}`).innerText;
    atcClickCapture(mediaID, productID, block_id);
    let prevHTML = event.innerHTML;
    const selectedInput = document.querySelector(
        `input[data-product-handle="${productHandle}"]`
    );
    const productVarID = selectedInput.getAttribute("id");
    var notify = document.querySelectorAll(".product-add-notify");
    var cls = event.classList.value;
    if (cls.includes("iconBtn")) {
        event.style.transition = "all 1s ease-in-out";
        event.style.transform = "scale(1.5)";
    } else {
        event.innerHTML = "ADDING...";
    }
    let data = {
        quantity: 1,
        id: productVarID,
        properties: {
            _added_from: "TW Shoppable Video",
            _tw_media_id: mediaID,
            _tw_playlist_id: global_playListId,
            _shop: Shopify.shop,
            _anonymous_id: anonymous_id,
            _page: page,
            _section: section,
        },
    };
    let result = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    let jsonData = await result.json();
    if (jsonData) {
        setTimeout(function () {
            event.innerHTML = prevHTML;
        }, 1000);
        setTimeout(function () {
            showCartCount();
            productPoupClose();
        }, 1500);
        setTimeout(() => {
            showCartAnimation();
        }, 2000);
    }
}
function showCartAnimation() {
    document.querySelectorAll(".sj-cart-widget-wrapper").forEach((node) => {
        node.classList.add("cart-icon-animation");
    });
    document.querySelectorAll(".cart-count").forEach((node) => {
        node.classList.add("cart-count-animation");
    });
    setTimeout(() => {
        document.querySelectorAll(".sj-cart-widget-wrapper").forEach((node) => {
            node.classList.remove("cart-icon-animation");
        });
        document.querySelectorAll(".cart-count").forEach((node) => {
            node.classList.remove("cart-count-animation");
        });
    }, 1000);
}
async function showCartCount() {
    let cart_result = await fetch("/cart.js", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    cart_result = await cart_result.json();
    let item_count = cart_result.item_count;
    let cartCountElements = document.querySelectorAll(".cart-count");
    for (let i = 0; i < cartCountElements.length; i++) {
        cartCountElements[i].innerHTML = item_count;
    }
}
async function showCartCount() {
    let cart_result = await fetch("/cart.js", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    cart_result = await cart_result.json();
    let item_count = cart_result.item_count;
    let cartCountElements = document.querySelectorAll(".cart-count");
    for (let i = 0; i < cartCountElements.length; i++) {
        cartCountElements[i].innerHTML = item_count;
    }
}
async function productBuyNow(productHandle, productID, MediaID, block_id) {
    const selectedInput = document.querySelector(
        `input[data-product-handle="${productHandle}"]`
    );
    const productVarID = selectedInput.getAttribute("id");
    const section = document.querySelector(`#type-${block_id}`).innerText;
    buyNowClickCapture(MediaID, productID, block_id);
    let result = await fetch("/cart/clear.js", { method: "GET" });
    let clearData = await result.json();
    if (clearData) {
        let data = {
            quantity: 1,
            id: productVarID,
            properties: {
                _added_from: "TW Shoppable Video",
                _tw_media_id: MediaID,
                _tw_playlist_id: global_playListId,
                _shop: Shopify.shop,
                _anonymous_id: anonymous_id,
                _page: page,
                _section: section,
            },
        };
        let addresult = await fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        let addProductData = addresult.json();
        let addedCoupon = localStorage.getItem("coupon");
        if (addProductData) {
            if (addedCoupon) {
                window.location.href = `/checkout?discount=${addedCoupon}`;
            } else {
                window.location.href = "/checkout";
            }
        }
    }
}
function changeSelectedVariant(event, productHandle) {
    const selectedInput = document.querySelector(
        `input[data-product="${productHandle}"]`
    );
    let value = event.target.value;
    selectedInput.setAttribute("id", value);
}
function variantAdder(node) {
    let value = node.getAttribute("data-value");
    let option = node.getAttribute("data-option");
    let optionIndex = node.getAttribute("data-option-index");
    let productID = node.getAttribute("data-product");
    let media_id = node.getAttribute("data-media-id");
    console.log(
        "grouping all button ",
        document.querySelectorAll(
            `button[data-product='${productID}'][data-option='${optionIndex}']`
        )
    );
    let optionIndex1Val = document.querySelector(
        `button[data-product='${productID}'][data-option-index='option1'][data-media-id='${media_id}'].selected`
    );
    let value1 = optionIndex1Val?.getAttribute("data-value");
    let optionIndex2Val = document.querySelector(
        `button[data-product='${productID}'][data-option-index='option2'][data-media-id='${media_id}'].selected`
    );
    let value2 = optionIndex2Val?.getAttribute("data-value");
    let optionIndex3Val = document.querySelector(
        `button[data-product='${productID}'][data-option-index='option3'][data-media-id='${media_id}'].selected`
    );
    let value3 = optionIndex3Val?.getAttribute("data-value");
    selectedObj = { option1: value1, option2: value2, option3: value3 };
    selectedObj[optionIndex] = value;
    let adtcBtnElement = document.querySelectorAll(
        `button[data-adtc-product='${productID}']`
    );
    let buyBtnElement = document.querySelectorAll(
        `button[data-buybtn-product='${productID}']`
    );
    const tmpOption = document.querySelectorAll(
        `button[data-product='${productID}'][data-option-index='${optionIndex}'][data-media-id='${media_id}'].selected`
    );
    console.log("tmpOption ", tmpOption);
    for (let i = 0; i < tmpOption.length; i++) {
        tmpOption[i].classList.remove("selected");
    }
    node.classList.add("selected");
    console.log("OPTION Index :::---> ", optionIndex);
    let varDetails = allProducts.products.filter(
        (item) => item.productID == productID
    );
    varDetails = varDetails[0];
    console.log("varDetails:", varDetails);
    console.log("selectedObj::", selectedObj);
    let varObj = varDetails.variants.filter((item) => {
        return (
            item.option1 == selectedObj.option1 &&
            item.option2 == selectedObj.option2 &&
            item.option3 == selectedObj.option3
        );
    });
    varObj = varObj[0];
    if (varObj) {
        let priceHTML = document.querySelectorAll(`#inner-price--${productID}`);
        let priceHTMLMobile = document.querySelectorAll(
            `.inner-product-price.mobile#inner-price--${productID}`
        );
        let tmp = parseInt(varObj.price / 100);
        for (let i = 0; i < priceHTML.length; i++) {
            if (store_currency == "INR") {
                priceHTML[i].innerHTML = `&#8377; ${tmp}`;
            } else {
                priceHTML[i].innerHTML = `${store_currency} ${tmp}`;
            }
        }
        for (let i = 0; i < priceHTMLMobile.length; i++) {
            if (store_currency == "INR") {
                priceHTMLMobile[i].innerHTML = `&#8377; ${tmp}`;
            } else {
                priceHTMLMobile[i].innerHTML = `${store_currency} ${tmp}`;
            }
        }
        let cmpPriceHTML = document.querySelectorAll(
            `#inner-cmp-price--${productID}`
        );
        let tmp2 = parseInt(varObj.compare_at_price / 100);
        for (let i = 0; i < cmpPriceHTML.length; i++) {
            if (store_currency == "INR") {
                cmpPriceHTML[i].innerHTML = `&#8377; ${tmp2}`;
            } else {
                cmpPriceHTML[i].innerHTML = `${store_currency} ${tmp2}`;
            }
        }
        let saleAmountHTML = document.querySelectorAll(
            `#inner-sale-amount--${productID}`
        );
        let tmp3 = parseInt(((tmp2 - tmp) * 100) / tmp2);
        for (let i = 0; i < saleAmountHTML.length; i++) {
            saleAmountHTML[i].innerHTML = `${tmp3}% off`;
        }
        const selectedInput = document.querySelectorAll(
            `input[data-product="${productID}"]`
        );
        for (let i = 0; i < selectedInput.length; i++) {
            selectedInput[i].setAttribute("id", varObj.id);
        }
        if (varObj.available == !1) {
            for (let i = 0; i < adtcBtnElement.length; i++) {
                adtcBtnElement[i].innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>
						SOLD OUT`;
                adtcBtnElement[i].classList.add("disabled");
            }
            for (let i = 0; i < buyBtnElement.length; i++) {
                buyBtnElement[i].style.display = "none";
                buyBtnElement[i].classList.add("disabled");
            }
        } else {
            for (let i = 0; i < adtcBtnElement.length; i++) {
                adtcBtnElement[i].innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>
						ADD TO CART`;
                adtcBtnElement[i].classList.remove("disabled");
            }
            for (let i = 0; i < buyBtnElement.length; i++) {
                buyBtnElement[i].style.display = "flex";
                buyBtnElement[i].classList.remove("disabled");
            }
        }
    } else {
        for (let i = 0; i < adtcBtnElement.length; i++) {
            adtcBtnElement[i].innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="#ffffff" stroke-width="1.5"></path></svg>
					SOLD OUT`;
            adtcBtnElement[i].classList.add("disabled");
        }
        for (let i = 0; i < buyBtnElement.length; i++) {
            buyBtnElement[i].style.display = "none";
            buyBtnElement[i].classList.add("disabled");
        }
    }
}
try {
    const shoppableProducts = document.querySelector(`#shoppableProducts`);
    var allProducts = JSON.parse(shoppableProducts.textContent);
    const variantBtns = document.getElementsByClassName("inner-variant-button");
    var selectedObj = { option1: null, option2: null, option3: null };
    for (let i = 0; i < variantBtns.length; i++) {
        variantBtns[i].addEventListener("click", function (event) {
            variantAdder(this);
        });
    }
} catch (error) {
    console.error(error);
}
try {
    var acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            var childElement = this.querySelector("span.acc-plus-icon");
            let allClass = document.querySelectorAll(
                `.inner-product-details-wrapper`
            );
            if (panel.style.maxHeight) {
                for (let i = 0; i < allClass.length; i++) {
                    allClass[i].style.height = "max-content";
                }
                panel.style.maxHeight = null;
                childElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.5V9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"></path></svg>`;
            } else {
                for (let i = 0; i < allClass.length; i++) {
                    allClass[i].style.height = "610px";
                }
                panel.style.maxHeight = "120px";
                panel.style.overflow = "scroll";
                childElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"/></svg>`;
            }
        });
    }
} catch (error) { }
function getRandomNumber(min, max) {
    const range = max - min + 1;
    const random = Math.floor(Math.random() * range);
    const randomNumber = min + random;
    return randomNumber;
}
function setRandomViews(block_id) {
    try {
        const view_nodes = document.querySelectorAll(
            `#${block_id} .random_view_inject`
        );
        const random_view_values_temp = document.querySelector(
            `#${block_id} #nltk-ds`
        );
        var random_view_values;
        if (random_view_values_temp) {
            random_view_values = JSON.parse(random_view_values_temp.innerText);
        }
        view_nodes.forEach((node) => {
            if (random_view_values && random_view_values != undefined) {
                const random_number = getRandomNumber(
                    parseInt(random_view_values.min),
                    parseInt(random_view_values.max)
                );
                node.innerText = `${random_number}K`;
            }
        });
    } catch (error) { }
}
function setRandomViewsStories() {
    try {
        if (app_block_id_sj_stories && app_block_id_sj_stories != undefined) {
            const view_nodes = document.querySelectorAll(
                `[data-block-handle="shoppable-video-stories"] .random_view_inject`
            );
            const random_view_values = JSON.parse(
                document.querySelector(`#${app_block_id_sj_stories} #nltk-ds`).innerText
            );
            view_nodes.forEach((node) => {
                const random_number = getRandomNumber(
                    parseInt(random_view_values.min),
                    parseInt(random_view_values.max)
                );
                node.innerText = `${random_number}K`;
            });
        }
    } catch (error) { }
}
function mediaUnMute(pElement, mediaID, btnElement) {
    let muteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path d="M7 9v6h4l5 5V4l-5 5H7zm-2 1H2v4h3v-4zm18.39 3.61L21 12l-1.39-1.61L18 12l1.61 1.61L21 15l1.39-1.39-1.61-1.61zM17 9v6h4l5 5V4l-5 5h-4zm-2 1H9v4h6v-4z"/>
	<path fill="none" d="M0 0h24v24H0z"/>
  </svg>`;
    let unmuteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  	<path d="M7 9v6h4l5 5V4l-5 5H7zm-2 1H2v4h3v-4zm18.39 3.61L21 12l-1.39-1.61L18 12l1.61 1.61L21 15l1.39-1.39-1.61-1.61zM17 9v6h4l5 5V4l-5 5h-4zm-2 1H9v4h6v-4z"/>
  	<path fill="none" d="M0 0h24v24H0z"/></svg>`;
    const medias = document.querySelectorAll(
        `.${pElement} video[data-media-id="${mediaID}"]`
    );
    for (const videoElement of medias) {
        videoElement.muted = !videoElement.muted;
    }
}
function mediaMuteUnmute(vidElement, btnElement) {
    const video = document.getElementById(vidElement);
    const btn = document.getElementById(btnElement);
    let muteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M15.0791 2.32591C14.9529 2.26445 14.8121 2.2396 14.6726 2.25419C14.533 2.26877 14.4004 2.3222 14.2897 2.40841L7.74219 7.49997H3.5C3.10218 7.49997 2.72064 7.65801 2.43934 7.93931C2.15804 8.22061 2 8.60215 2 8.99997V15C2 15.3978 2.15804 15.7793 2.43934 16.0606C2.72064 16.3419 3.10218 16.5 3.5 16.5H7.74219L14.2897 21.5915C14.4005 21.6777 14.5332 21.731 14.6728 21.7454C14.8124 21.7599 14.9533 21.7349 15.0793 21.6732C15.2054 21.6116 15.3117 21.5158 15.3861 21.3968C15.4604 21.2778 15.4999 21.1403 15.5 21V2.99997C15.5 2.85947 15.4606 2.72178 15.3861 2.6026C15.3117 2.48343 15.2053 2.38755 15.0791 2.32591ZM3.5 8.99997H7.25V15H3.5V8.99997ZM14 19.4662L8.75 15.3834V8.61653L14 4.53372V19.4662ZM23.5306 13.7193C23.6714 13.8601 23.7504 14.0509 23.7504 14.25C23.7504 14.449 23.6714 14.6399 23.5306 14.7806C23.3899 14.9213 23.199 15.0004 23 15.0004C22.801 15.0004 22.6101 14.9213 22.4694 14.7806L20.75 13.0603L19.0306 14.7806C18.8899 14.9213 18.699 15.0004 18.5 15.0004C18.301 15.0004 18.1101 14.9213 17.9694 14.7806C17.8286 14.6399 17.7496 14.449 17.7496 14.25C17.7496 14.0509 17.8286 13.8601 17.9694 13.7193L19.6897 12L17.9694 10.2806C17.8286 10.1399 17.7496 9.94899 17.7496 9.74997C17.7496 9.55095 17.8286 9.36008 17.9694 9.21935C18.1101 9.07861 18.301 8.99955 18.5 8.99955C18.699 8.99955 18.8899 9.07861 19.0306 9.21935L20.75 10.9397L22.4694 9.21935C22.6101 9.07861 22.801 8.99955 23 8.99955C23.199 8.99955 23.3899 9.07862 23.5306 9.21935C23.6714 9.36008 23.7504 9.55095 23.7504 9.74997C23.7504 9.94899 23.6714 10.1399 23.5306 10.2806L21.8103 12L23.5306 13.7193Z" fill="#222222"></path></svg>`;
    let unmuteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M15.0791 2.32591C14.9529 2.26445 14.8121 2.2396 14.6726 2.25419C14.533 2.26877 14.4004 2.3222 14.2897 2.40841L7.74219 7.49997H3.5C3.10218 7.49997 2.72064 7.65801 2.43934 7.93931C2.15804 8.22061 2 8.60215 2 8.99997V15C2 15.3978 2.15804 15.7793 2.43934 16.0606C2.72064 16.3419 3.10218 16.5 3.5 16.5H7.74219L14.2897 21.5915C14.4005 21.6777 14.5332 21.731 14.6728 21.7454C14.8124 21.7599 14.9533 21.7349 15.0793 21.6732C15.2054 21.6116 15.3117 21.5158 15.3861 21.3968C15.4604 21.2778 15.4999 21.1403 15.5 21V2.99997C15.5 2.85947 15.4606 2.72178 15.3861 2.6026C15.3117 2.48343 15.2053 2.38755 15.0791 2.32591ZM3.5 8.99997H7.25V15H3.5V8.99997ZM14 19.4662L8.75 15.3834V8.61653L14 4.53372V19.4662ZM19.0625 9.52122C19.6657 10.206 19.9986 11.0873 19.9986 12C19.9986 12.9126 19.6657 13.7939 19.0625 14.4787C18.93 14.6243 18.7456 14.712 18.549 14.7228C18.3524 14.7336 18.1595 14.6667 18.0118 14.5365C17.8642 14.4063 17.7736 14.2233 17.7597 14.0269C17.7458 13.8305 17.8097 13.6365 17.9375 13.4868C18.2992 13.076 18.4988 12.5474 18.4988 12C18.4988 11.4526 18.2992 10.9239 17.9375 10.5131C17.8097 10.3634 17.7458 10.1694 17.7597 9.97305C17.7736 9.77668 17.8642 9.59365 18.0118 9.46346C18.1595 9.33326 18.3524 9.26635 18.549 9.27716C18.7456 9.28796 18.93 9.37562 19.0625 9.52122ZM23.75 12C23.7511 13.8452 23.0711 15.6258 21.8403 17.0006C21.7067 17.1452 21.5216 17.2314 21.325 17.2407C21.1284 17.25 20.936 17.1817 20.7893 17.0504C20.6426 16.9191 20.5535 16.7354 20.541 16.5389C20.5286 16.3425 20.5939 16.149 20.7228 16.0003C21.7066 14.9003 22.2505 13.4762 22.2505 12.0004C22.2505 10.5246 21.7066 9.10062 20.7228 8.0006C20.6553 7.92753 20.603 7.84175 20.5689 7.74827C20.5349 7.65478 20.5197 7.55546 20.5245 7.45607C20.5292 7.35669 20.5536 7.25923 20.5963 7.16939C20.6391 7.07954 20.6993 6.99909 20.7734 6.93273C20.8475 6.86638 20.9341 6.81543 21.0281 6.78287C21.1222 6.7503 21.2217 6.73677 21.321 6.74305C21.4203 6.74934 21.5173 6.77532 21.6065 6.81948C21.6957 6.86364 21.7751 6.9251 21.8403 7.00028C23.0714 8.37449 23.7515 10.155 23.75 12Z" fill="#222222"></path></svg>`;
    if (video.muted) {
        video.muted = !1;
        btn.innerHTML = unmuteIcon;
    } else {
        video.muted = !0;
        btn.innerHTML = muteIcon;
    }
}
function copyCode(code, copyMsg, event, media_id, product_id, block_id) {
    offerCopiedCapture(product_id, media_id, code, block_id);
    var copyText = document.getElementById(`${code}`);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    localStorage.setItem("coupon", copyText.value);
    document.getElementById(`${copyMsg}`).innerHTML = "CODE COPIED!";
    event.innerHTML = "CODE COPIED!";
    setTimeout(() => {
        event.innerHTML = "COPY";
    }, 2000);
    let coupon = localStorage.getItem("coupon");
}
function textExpand(textID, event) {
    if (event.innerHTML == "Read More") {
        const innerDescription = document.querySelector(`#${textID}`);
        innerDescription.classList.remove("ellipse");
        event.innerHTML = "Read Less";
    } else {
        const innerDescription = document.querySelector(`#${textID}`);
        innerDescription.classList.add("ellipse");
        event.innerHTML = "Read More";
    }
}
history.pushState(null, null, document.URL);
history.replaceState(null, null, document.URL);
window.onpopstate = function (event) {
    history.pushState(null, null, document.URL);
    preventBackButton();
};
function preventBackButton() {
    if (windowSize < 650) {
        let isMobileOpen = document.getElementById("card-modal-mobile");
        let clM = isMobileOpen.classList;
        if (clM.value.includes("mobile-modal-opened")) {
            const mobileModalClose = document.getElementById(
                "modal-close-btn-mobile"
            );
            mobileModalClose.click();
        } else {
            window.history.back();
        }
    } else {
        let isDesktopOpen = document.getElementById("card-modal-desktop");
        let clD = isDesktopOpen.classList;
        if (clD.value.includes("desktop-modal-opened")) {
            const modalCloseBtn = document.getElementById("modal-close-btn");
            modalCloseBtn.click();
        } else {
            window.history.back();
        }
    }
}
function pauseAllVideos() {
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach((video) => {
        video.pause();
    });
}
function playVisibleVideos() {
    const allVideos = document.querySelectorAll("video");
    const viewportHeight = window.innerHeight / 2;
    const viewportWidth = window.innerWidth / 2;
    const viewportRect = {
        top: 0,
        bottom: viewportHeight,
        left: 0,
        right: viewportWidth,
    };
    allVideos.forEach((video) => {
        const videoRect = video.getBoundingClientRect();
        if (
            videoRect.top >= viewportRect.top &&
            videoRect.bottom <= viewportRect.bottom &&
            videoRect.left >= viewportRect.left &&
            videoRect.right <= viewportRect.right
        ) {
            video.play();
        } else {
            video.pause();
        }
    });
}
function getAllDisplayNoneVid() {
    const allElements = document.querySelectorAll("*");
    const videosInHiddenElements = [];
    function isElementHidden(element) {
        const computedStyle = getComputedStyle(element);
        return computedStyle.height === "0px";
    }
    function isVideoElement(element) {
        return element.tagName === "VIDEO";
    }
    allElements.forEach((element) => {
        if (isElementHidden(element)) {
        }
    });
}
function productPoupClose() {
    selectedObj = { option1: null, option2: null, option3: null };
    document.querySelectorAll(".product-details-modal-mobile").forEach((node) => {
        node.style.bottom = "-100%";
        node.style.visibility = "hidden";
    });
}
function changeVideoSrc(video) {
    try {
        if (video.getAttribute("src") === "") {
            let videoURL = video.getAttribute("data-src");
            video.src = videoURL;
        } else {
        }
    } catch (error) { }
}
function loadVideoBlobThanPlay(videoPlayer) {
    let url = videoPlayer.getAttribute("data-src");
    videoPlayer.style.display = "none";
    if (videoPlayer.getAttribute("src") != "") {
        videoPlayer.style.display = "block";
        videoPlayer.play();
    } else {
        fetch(url)
            .then((response) => response.blob())
            .then((videoBlob) => {
                const videoObjectURL = URL.createObjectURL(videoBlob);
                videoPlayer.src = videoObjectURL;
                videoPlayer.style.display = "block";
                videoPlayer.play();
            })
            .catch((error) => {
                console.error("Error fetching the video:", error);
            });
    }
}
function loadVideoBlobSrc(videoPlayer) {
    if (videoPlayer.getAttribute("src") != "") {
        let url = videoPlayer.getAttribute("data-src");
        fetch(url)
            .then((response) => response.blob())
            .then((videoBlob) => {
                const videoObjectURL = URL.createObjectURL(videoBlob);
                videoPlayer.src = videoObjectURL;
                videoPlayer.style.display = "block";
                videoPlayer.pause();
            })
            .catch((error) => {
                console.error("Error fetching the video:", error);
            });
    }
}
openModalOnVisiting();
function encodeAmpersands(inputString) {
    var encodedString = inputString.replace(/&/g, "%26");
    return encodedString;
}
function openIOSShareWidget(link, msg, title) {
    let new_link = encodeURIComponent(`${msg} ${link}`);
    let copy_link = link;
    link = encodeURIComponent(`${link}`);
    msg = encodeURIComponent(msg);
    title = encodeURIComponent(title);
    let shareWigetHTML = `
	<div id="sj-share-container" >
		<div class="sj-share-wrapper">
			<div class="sj-share-wrapper-close"><span>Share with</span><span style="cursor:pointer" onclick="closeIOSShareWidget()">✖</span></div>
	        <div id="sj-share-buttons">
	           <a class="facebook" target="blank" href="https://www.facebook.com/share.php?u=${link}" >
			   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">
			   <g fill="none" fill-rule="evenodd">
				 <path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#3B5998" fill-rule="nonzero"></path>
				 <path d="M25.7305108 45h5.4583577V30.0073333h4.0947673l.8098295-4.6846666h-4.9045968V21.928c0-1.0943333.7076019-2.2433333 1.7188899-2.2433333h2.7874519V15h-3.4161354v.021c-5.3451414.194-6.4433395 3.2896667-6.5385744 6.5413333h-.0099897v3.7603334H23v4.6846666h2.7305108V45z" fill="#FFF"></path>
			   </g>
			 </svg>
			 </a>
	           <a class="twitter" target="blank" href="https://twitter.com/intent/tweet?url=${link}&text=${msg}" ><svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">
			   <g fill="none" fill-rule="evenodd">
				 <path d="M28.486325 59.969298c-6.636404-.569063-11.56302-2.326956-16.321973-5.823932C4.443764 48.472116 0 39.646792 0 29.986934 0 15.11156 10.506778 2.798388 25.274412.36718c6.028107-.992411 12.703853.049265 18.28794 2.85363 13.576275 6.818095 19.7813 22.541053 14.64267 37.103159-3.527955 9.997705-12.789708 17.617785-23.391072 19.244938-2.085625.320112-5.065149.508645-6.327625.400391z" fill="#1DA1F2" fill-rule="nonzero"></path>
				 <path d="M45.089067 17.577067c-.929778.595555-3.064534 1.460977-4.117334 1.460977v.001778C39.7696 17.784 38.077156 17 36.200178 17c-3.645511 0-6.6016 2.956089-6.6016 6.600178 0 .50631.058666 1.000178.16711 1.473778h-.001066c-4.945066-.129778-10.353422-2.608356-13.609244-6.85049-2.001778 3.46489-.269511 7.3184 2.002133 8.72249-.7776.058666-2.209067-.0896-2.882844-.747023-.045156 2.299734 1.060622 5.346845 5.092622 6.452267-.776533.417778-2.151111.297956-2.7488.209067.209778 1.941333 2.928355 4.479289 5.901155 4.479289C22.46009 38.565156 18.4736 40.788089 14 40.080889 17.038222 41.929422 20.5792 43 24.327111 43c10.650667 0 18.921956-8.631822 18.4768-19.280356-.001778-.011733-.001778-.023466-.002844-.036266.001066-.027378.002844-.054756.002844-.0832 0-.033067-.002844-.064356-.003911-.096356.9696-.66311 2.270578-1.836089 3.2-3.37991-.539022.296888-2.156089.891377-3.6608 1.038932.965689-.521244 2.396444-2.228266 2.749867-3.585777" fill="#FFF"></path>
			   </g>
			 </svg></a>
	           <a class="linkedin" target="blank" href="https://www.linkedin.com/sharing/share-offsite/?url=${link}" >
			   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">
			   <g fill="none" fill-rule="evenodd">
				 <path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#0077B5" fill-rule="nonzero"></path>
				 <g fill="#FFF">
				   <path d="M17.88024691 22.0816337c2.14182716 0 3.87817284-1.58346229 3.87817284-3.53891365C21.75841975 16.58553851 20.02207407 15 17.88024691 15 15.73634568 15 14 16.58553851 14 18.54272005c0 1.95545136 1.73634568 3.53891365 3.88024691 3.53891365M14.88888889 44.8468474h6.95851852V24.77777778h-6.95851852zM31.6137778 33.6848316c0-2.3014877 1.0888889-4.552108 3.6925432-4.552108 2.6036543 0 3.2438518 2.2506203 3.2438518 4.4970883v10.960701h6.9274074V33.1816948c0-7.9263084-4.6853333-9.29280591-7.5676049-9.29280591-2.8798518 0-4.4682469.9740923-6.2961975 3.33440621v-2.70185178h-6.9471111V44.5905129h6.9471111V33.6848316z"></path>
				 </g>
			   </g>
			 </svg>  
			   </a>
	         <!--  <a class="reddit" target="blank" href="http://www.reddit.com/submit?url=${link}&title=${title}" ><i class="fab fa-reddit"></i> Reddit</a> -->
	           <a class="whatsapp" target="blank" href="https://api.whatsapp.com/send?text=${new_link}" >
			   <svg viewBox="0 0 60 60" focusable="false" style="pointer-events: none; display: block; width: 60px; height: 60px;">
			   <g fill="none" fill-rule="evenodd">
				 <circle cx="30" cy="30" r="30" fill="#25D366"></circle>
				 <path d="M39.7746 19.3513C37.0512 16.5467 33.42 15 29.5578 15C21.6022 15 15.1155 21.6629 15.1155 29.8725C15.1155 32.4901 15.7758 35.0567 17.0467 37.3003L15 45L22.6585 42.9263C24.7712 44.1161 27.148 44.728 29.5578 44.728C37.5134 44.728 44 38.0652 44 29.8555C44 25.8952 42.498 22.1558 39.7746 19.3513ZM29.5578 42.2295C27.3956 42.2295 25.2829 41.6346 23.4508 40.5127L23.0051 40.2408L18.4661 41.4646L19.671 36.9093L19.3904 36.4334C18.1855 34.4618 17.5583 32.1841 17.5583 29.8555C17.5583 23.0397 22.9556 17.4986 29.5743 17.4986C32.7763 17.4986 35.7968 18.7904 38.0581 21.119C40.3193 23.4476 41.5737 26.5581 41.5737 29.8555C41.5572 36.6884 36.1764 42.2295 29.5578 42.2295ZM36.1434 32.966C35.7803 32.779 34.0142 31.8782 33.6841 31.7592C33.354 31.6402 33.1064 31.5722 32.8754 31.9462C32.6278 32.3201 31.9511 33.153 31.7365 33.4079C31.5219 33.6629 31.3238 33.6799 30.9607 33.4929C30.5976 33.306 29.4422 32.915 28.0558 31.6572C26.9829 30.6714 26.2567 29.4476 26.0421 29.0907C25.8275 28.7167 26.0256 28.5127 26.2072 28.3258C26.3722 28.1558 26.5703 27.8839 26.7518 27.6799C26.9334 27.4589 26.9994 27.3059 27.115 27.068C27.2305 26.813 27.181 26.6091 27.082 26.4221C26.9994 26.2351 26.2732 24.3994 25.9761 23.6686C25.679 22.9377 25.3819 23.0397 25.1673 23.0227C24.9528 23.0057 24.7217 23.0057 24.4741 23.0057C24.2265 23.0057 23.8469 23.0907 23.5168 23.4646C23.1867 23.8385 22.2459 24.7394 22.2459 26.5581C22.2459 28.3938 23.5333 30.1445 23.7149 30.3994C23.8964 30.6544 26.2567 34.3938 29.8714 36.0085C30.7297 36.3994 31.4064 36.6204 31.9345 36.7904C32.7928 37.0793 33.5851 37.0283 34.2123 36.9433C34.9055 36.8414 36.3415 36.0425 36.6551 35.1756C36.9522 34.3088 36.9522 33.5609 36.8697 33.4079C36.7541 33.255 36.5065 33.153 36.1434 32.966Z" fill="white"></path>
			   </g>
			 </svg>
			   </a>
	         <!--  <a class="telegram" target="blank" href="https://telegram.me/share/url?url=${link}&text=${msg}" ><i class="fab fa-telegram"></i> Telegram</a> -->
            </div>

			<div id="sj-copy-url"> 
			   <input value="${copy_link}"/>
			   <button onclick="copyToClipboard('${copy_link}')">Copy</button>
			</div>

		 </div>
    </div>`;
    document.body.insertAdjacentHTML("afterbegin", shareWigetHTML);
    document.querySelector("#sj-share-container").style.display = "flex";
}
function closeIOSShareWidget() {
    document.querySelector("#sj-share-container").style.display = "none";
    document.querySelector("#sj-share-container").remove();
}
function fixingHeightIos() {
    if (isIOS()) {
        let heightInterval = setTimeout(function () {
            let viewportHeight = window.innerHeight;
            document.querySelectorAll(".swiper-slide").forEach((node) => {
                node.style.height = `${viewportHeight}px`;
            });
            document.querySelectorAll("#swiper-container-mobile").forEach((node) => {
                node.style.height = `${window.innerHeight}px`;
            });
            document
                .querySelectorAll(".tws-playlist-wrapper-mobile")
                .forEach((node) => {
                    node.style.height = `${window.innerHeight}px`;
                });
            document.querySelectorAll(".video-wrapper-mobile").forEach((node) => {
                node.dispatchEvent(new Event("change"));
                node.style.height = `${window.innerHeight}px`;
            });
            document
                .querySelectorAll(".tws-product-vertical-swipe")
                .forEach((node) => {
                    node.scrollLeft += 1;
                });
        }, 1500);
        return heightInterval;
    }
}
function fixHeightOnIosOnResize() {
    if (isIOS()) {
        document.querySelectorAll(".swiper-slide").forEach((node) => {
            node.style.height = `${window.innerHeight}px`;
        });
        document.querySelectorAll("#swiper-container-mobile").forEach((node) => {
            node.style.height = `${window.innerHeight}px`;
        });
        document
            .querySelectorAll(".tws-playlist-wrapper-mobile")
            .forEach((node) => {
                node.style.height = `${window.innerHeight}px`;
            });
        document.querySelectorAll(".video-wrapper-mobile").forEach((node) => {
            node.style.height = `${window.innerHeight}px`;
        });
    }
}
let isResizeStopped;
function executeAfterResizeStop() {
    let intvl = fixingHeightIos();
}
function injectGa4Str() {
    let ga4 = document.querySelector(".ga4str").innerText;
    const scriptEl = document.createRange().createContextualFragment(ga4);
    document.body.appendChild(scriptEl);
}
injectGa4Str();
injectCustomer();
function isObjectInArrayExcludingCount(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
        let loopObject = arr[i];
        if (obj.data_capture_id === loopObject.data_capture_id) {
            if (loopObject.event_name === "media_views") {
                loopObject.watchtime = obj.watchtime;
                return !0;
            } else {
                loopObject.count = loopObject.count + 1;
                return loopObject.count;
            }
        }
    }
    return !1;
}

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
function productSwipeCapture() { }
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


