async function injectDesktopModal(all_medias, playlist, block_id) {
    let playlist_title = playlist?.playlist_title;
    let status = playlist?.status;
    let playlist_medias = playlist?.media;
    let playlist_id = playlist?.id;


    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",playlist_medias,playlist_id)

    let html = `
    <div class="card-modal">
        <div class="tw-powered-text">
        </div>
        <div class="modal-header">
            <button id="modal-close-btn" class="modal-close-btn"
                onclick="closeModalTW('${block_id}')">
                <svg
                xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                <path d="M24.0625 24.0625L17.9375 17.9375" stroke="black" stroke-width="2.625" stroke-linecap="round"
                    stroke-linejoin="round"></path>
                <path d="M17.9375 24.0625L24.0625 17.9375" stroke="black" stroke-width="2.625" stroke-linecap="round"
                    stroke-linejoin="round"></path>
                <path d="M8.3125 21C8.3125 28.0071 13.9929 33.6875 21 33.6875C28.0071 33.6875 33.6875 28.0071 33.6875 21C33.6875 13.9929 28.0071 8.3125 21 8.3125C13.9929 8.3125 8.3125 13.9929 8.3125 21Z"
                    stroke="black" stroke-width="2.625">
                </path>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="slider-modal desktop-view">
                <div class="slider-section">
                    <div class="container slider-column">
                        <div class="swiper swiper-slider story modal-desktop-${playlist_id} modal-desktop-block-${block_id} swiper-initialized swiper-horizontal swiper-backface-hidden"
                            data-block-id="${block_id}"
                            data-playlist="${playlist_id}">
                            <div class="swiper-wrapper" id="swiper-wrapper-af476a23a3a71ea1" aria-live="polite"
                                style="cursor: grab; transition-duration: 0ms; transform: translate3d(316.25px, 0px, 0px);">`
    
    for (let i = 0; i< playlist_medias.length; i++){
        let media = all_medias[playlist_medias[i]];
        console.log("Media >>>>> ", media)
        let media_id = media?.id;
        let video_url = media?.previewVideoCDNURLs[0]?.url;
        console.log("ivdeo ur l >>>>> ", video_url);
        if(video_url.includes("m3u8")){
            video_url = media?.previewVideoCDNURLs[0]?.url;
        }
        let tag = media?.tags[0];
        let products = media?.products;
        html += ` 
                                    <div class="swiper-slide slide-count--${i} ${()=>(i==0?"sj-active-slide":null)}"
                                        data-playlist-id="${playlist_id}" data-media-id="${media_id}">
                                            <div class="modal-content-wrapper slide-count--${i} desktop-view">
                                                <div class="modal-video-wrapper desktop-view">
                                                    <div class="sj-vid-loader">
                                                        <div>
                                                            <img src="{{ 'videoloader.png' | asset_url }}" width="50" height="50"   alt="video loader"
                                                            loading="lazy" />
                                                        </div>
                                                    </div>  
                                                    <video class="v-${block_id}-desk-m-vid-${media.id}"
                                                            id="desk-m-vid-${media_id}" data-swipe-index="${i}"
                                                            data-media-id="${media.id}" width="100%" height="100%" loop preload="auto" muted
                                                            playsinline name="media" src="" data-src="${video_url}" type="video/mp4">
                                                    </video>
                                                    <div class="sj-widget-floating">
                                                        <div class="sj-vid-mute-unmute child-m"
                                                            id="v-${video_url}-desk-m-vid-${media_id}-controller" 
                                                            onclick="muteUnmuteAll()">
                                                                <img style="display:block;" src="{{ 'nospeaker.png' | asset_url }}"
                                                                    width="50" height="50" alt="video loader" loading="lazy" class="nospeaker" />
                                                                <img
                                                                style="display:none;" src="{{ 'speaker.png' | asset_url }}" width="50" height="50"
                                                                alt="video loader" loading="lazy" class="speaker" />
                                                        </div>
                                                        <div class="sj-vid-share child-m"
                                                            onclick="provideSharebleURL('${block_id}','${media_id}')">
                                                            <div>
                                                                <img src="{{ 'share.png' | asset_url }}" width="50" height="50" alt="video loader"
                                                                loading="lazy" />
                                                            </div>
                                                        </div>
                                                        <div class="sj-cart-widget child-m">
                                                            <div class="sj-cart-widget-wrapper"> 
                                                                <a href="/cart" style="height: 100%;display: block;">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"
                                                                    fill="none">
                                                                        <rect y="0.640137" width="39.3599" height="39.3599" rx="9.83996" fill="white" />
                                                                            <path
                                                                                d="M25.9936 26.7159C24.8103 26.7159 23.8616 27.6646 23.8616 28.8479C23.8616 29.4133 24.0862 29.9556 24.486 30.3554C24.8858 30.7553 25.4281 30.9799 25.9936 30.9799C26.559 30.9799 27.1013 30.7553 27.5011 30.3554C27.9009 29.9556 28.1256 29.4133 28.1256 28.8479C28.1256 28.2824 27.9009 27.7402 27.5011 27.3403C27.1013 26.9405 26.559 26.7159 25.9936 26.7159ZM8.93762 9.65994V11.7919H11.0696L14.9072 19.8828L13.4574 22.4945C13.2975 22.793 13.2016 23.1448 13.2016 23.5179C13.2016 24.0833 13.4262 24.6256 13.8261 25.0254C14.2259 25.4253 14.7682 25.6499 15.3336 25.6499H28.1256V23.5179H15.7813C15.7106 23.5179 15.6429 23.4898 15.5929 23.4398C15.5429 23.3899 15.5148 23.3221 15.5148 23.2514C15.5148 23.1981 15.5255 23.1555 15.5468 23.1235L16.5062 21.3859H24.4479C25.2474 21.3859 25.9509 20.9382 26.3134 20.2879L30.1296 13.3909C30.2043 13.2204 30.2575 13.0392 30.2575 12.8579C30.2575 12.5752 30.1452 12.3041 29.9453 12.1042C29.7454 11.9042 29.4743 11.7919 29.1916 11.7919H13.4255L12.4234 9.65994M15.3336 26.7159C14.1503 26.7159 13.2016 27.6646 13.2016 28.8479C13.2016 29.4133 13.4262 29.9556 13.8261 30.3554C14.2259 30.7553 14.7682 30.9799 15.3336 30.9799C15.899 30.9799 16.4413 30.7553 16.8411 30.3554C17.241 29.9556 17.4656 29.4133 17.4656 28.8479C17.4656 28.2824 17.241 27.7402 16.8411 27.3403C16.4413 26.9405 15.899 26.7159 15.3336 26.7159Z"
                                                                            fill="black" />
                                                                    </svg>
                                                                    <div class="cart-count" style="color:black;"> 0 </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="video-view-wrapper">
                                                        <div class="inner-view-wrap">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                                fill="none">
                                                                <path
                                                                    d="M11.6702 9.26089C10.913 9.26089 10.1868 9.56168 9.65138 10.0971C9.11596 10.6325 8.81517 11.3587 8.81517 12.1159C8.81517 12.8731 9.11596 13.5993 9.65138 14.1347C10.1868 14.6701 10.913 14.9709 11.6702 14.9709C12.4274 14.9709 13.1535 14.6701 13.689 14.1347C14.2244 13.5993 14.5252 12.8731 14.5252 12.1159C14.5252 11.3587 14.2244 10.6325 13.689 10.0971C13.1535 9.56168 12.4274 9.26089 11.6702 9.26089ZM11.6702 16.8742C10.4082 16.8742 9.19788 16.3729 8.30552 15.4805C7.41316 14.5882 6.91184 13.3779 6.91184 12.1159C6.91184 10.8539 7.41316 9.6436 8.30552 8.75124C9.19788 7.85888 10.4082 7.35756 11.6702 7.35756C12.9322 7.35756 14.1425 7.85888 15.0348 8.75124C15.9272 9.6436 16.4285 10.8539 16.4285 12.1159C16.4285 13.3779 15.9272 14.5882 15.0348 15.4805C14.1425 16.3729 12.9322 16.8742 11.6702 16.8742ZM11.6702 4.97839C6.91184 4.97839 2.84823 7.93807 1.20184 12.1159C2.84823 16.2937 6.91184 19.2534 11.6702 19.2534C16.4285 19.2534 20.4921 16.2937 22.1385 12.1159C20.4921 7.93807 16.4285 4.97839 11.6702 4.97839Z"
                                                                fill="black">
                                                                </path>
                                                            </svg>
                                                            <span class="random_view_inject">
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-product-wrapper desktop-view slide-count--${i}">
                                                    <div class="media-tag-wrapper">
                                                        <p class="inner-media-tag" style="background-color:${tag?.bgColor}; color:${tag?.fgColor};">
                                                            ${tag?.text }
                                                        </p>
                                                    </div>
                                                    <noscript id="glow_product_handle">
                                                        ${fetchProductCode(products)}
                                                    </noscript>
                                                    <div id="glow_product_detail_desk">
                                                    </div>
                                            
           
                                                    <div class="product-add-notify">
                                                        <p>Product Added To Cart</p>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
        
        
        `
    }


    html += `               </div>
                            <span
                             class="swiper-button-prev swiper-button-disabled" tabindex="-1" role="button"
                             aria-label="Previous slide" aria-controls="swiper-wrapper-af476a23a3a71ea1"
                             aria-disabled="true"></span><span class="swiper-button-next" tabindex="0" role="button"
                             aria-label="Next slide" aria-controls="swiper-wrapper-af476a23a3a71ea1"
                             aria-disabled="false"></span>
                            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                         </div>
                    </div>
            </div>
        </div>
    </div>`

    document.querySelector(`.desk-modal-${block_id}`).innerHTML = html;

}



function fetchProductCode(products){
    let html = ``;
    for(let i = 0; i < products.length; i++){
        let product = products[i];
        html += `${product.handle},`
    }
    
    return html;
}



async function fetchProductDetailsGlow(active_slide) {
    let product_handles_txt = active_slide.querySelector(`#glow_product_handle`).innerText;
    let product_handles = product_handles_txt.split(",");
    let promise_list = [];
    
    product_handles.forEach((product_handle) => {
        console.log(product_handle);
        product_handle = product_handle.replace(/ /g, '');
        console.log("............ ", product_handle);
        if (product_handle !== "") {
            promise_list.push(fetch(`/products/${product_handle}.js`).then(resp => resp.json()));
        }
    });

    console.log("Promise list ", promise_list)
    
    const products = await Promise.all(promise_list);
    console.log("All the products >>>>>>>> ", products);
    return products;
}
