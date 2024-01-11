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



async function fetchProductDetailsGlow(active_slide,block_id, media_id) {
    let product_handles_txt = active_slide.querySelector(`#glow_product_handle`).innerText;
    let product_handles = product_handles_txt.split(",");
    let promise_list = [];
    
    product_handles.forEach((product_handle) => {
        console.log(product_handle);
        product_handle = product_handle.replace(/ /g, '');
        console.log("............ ", product_handle);
        if (product_handle !== "") {
            promise_list.push(fetch(`/products/${product_handle}.js`)
                .then(resp => resp.json())
                .catch(error => ({ error })));
        }
    });

    console.log("Promise list ", promise_list)
    
    const products = await Promise.all(promise_list);
    console.log("All the products >>>>>>>> ", products);
    // return products;
    let html = ``
    for (let i =0; i < products.length; i++){
        html += returnProductWrapperHTML(products[i],block_id, media_id)
    }
}

function modifyImageUrlGlow(originalUrl) {
    // Find the position of the last dot (.) in the URL
    const dotIndex = originalUrl.lastIndexOf('.');
  
    // If a dot is found, insert "_200x" before the file extension
    if (dotIndex !== -1) {
      const modifiedUrl = originalUrl.slice(0, dotIndex) + '_200x' + originalUrl.slice(dotIndex);
      return modifiedUrl;
    } else {
      // If no dot is found, return the original URL
      return originalUrl;
    }
  }


function returnProductWrapperHTML(product, block_id, media_id){
    let prouct_img = modifyImageUrlGlow(product?.featured_image)
    let html = `
    <div class="d-single-product-wrapper"> 
        <div class="product-details-header" onclick="openInnerModal('${block_id}','product-details-${product?.id}','${media_id}','${product?.id}')">
            <div class="product-img-wrapper">
                <img data-src="${prouct_img}" alt="image" loading="eager" width="70" height="auto" class="innr-desktop-modal-img sj-im-lazy-load"/>
            </div> 
            <div class="product-title-wrapper">
                <div class="inner-title-rvw-wrap"> 
                    <p class="product-title-inner">${ product.title }</p>
                        <div class="price-review-wrap">
                            {% if block.settings.review_app == 'judgeme' %}
                                {% if product.metafields.reviews.rating %} 
                                    <p class="product-review-box">
                                        <span class="review-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 23 22" fill="none"><path d="M21.7453 7.60734L15.2337 6.66099L12.3228 0.759739C12.2433 0.598166 12.1125 0.467369 11.951 0.387865C11.5458 0.187823 11.0533 0.354525 10.8507 0.759739L7.93987 6.66099L1.42823 7.60734C1.24871 7.63299 1.08457 7.71762 0.958904 7.84585C0.806979 8.00201 0.723261 8.21209 0.726146 8.42993C0.729032 8.64778 0.818284 8.85556 0.974292 9.00764L5.68554 13.6009L4.57249 20.0869C4.54639 20.2378 4.56308 20.393 4.62068 20.5348C4.67828 20.6767 4.77448 20.7996 4.89837 20.8896C5.02226 20.9796 5.16889 21.033 5.32162 21.0439C5.47435 21.0548 5.62708 21.0227 5.76248 20.9512L11.5868 17.889L17.4111 20.9512C17.5701 21.0358 17.7548 21.064 17.9317 21.0333C18.378 20.9563 18.678 20.5332 18.6011 20.0869L17.488 13.6009L22.1993 9.00764C22.3275 8.88197 22.4122 8.71783 22.4378 8.53831C22.507 8.08949 22.1942 7.67402 21.7453 7.60734Z" fill="#FFB800"/></svg>
                                        </span>
                                        <span> {{ product.metafields.reviews.rating.value }} / 5 </span>
                                    </p>
                                {% endif %}
                            {% endif %} 
                            {% if block.settings.review_app == 'shopify_review' %} 
                                {% if product.metafields.spr.reviews %} 
                                    {{ product.metafields.spr.reviews }} 
                                {% endif %} 
                            {% endif %} 
                            {% if block.settings.review_app == 'loox' %} 
                                {% if product.metafields.loox.avg_rating %} 
                                    <p class="product-review-box">
                                        <span class="review-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 23 22" fill="none"><path d="M21.7453 7.60734L15.2337 6.66099L12.3228 0.759739C12.2433 0.598166 12.1125 0.467369 11.951 0.387865C11.5458 0.187823 11.0533 0.354525 10.8507 0.759739L7.93987 6.66099L1.42823 7.60734C1.24871 7.63299 1.08457 7.71762 0.958904 7.84585C0.806979 8.00201 0.723261 8.21209 0.726146 8.42993C0.729032 8.64778 0.818284 8.85556 0.974292 9.00764L5.68554 13.6009L4.57249 20.0869C4.54639 20.2378 4.56308 20.393 4.62068 20.5348C4.67828 20.6767 4.77448 20.7996 4.89837 20.8896C5.02226 20.9796 5.16889 21.033 5.32162 21.0439C5.47435 21.0548 5.62708 21.0227 5.76248 20.9512L11.5868 17.889L17.4111 20.9512C17.5701 21.0358 17.7548 21.064 17.9317 21.0333C18.378 20.9563 18.678 20.5332 18.6011 20.0869L17.488 13.6009L22.1993 9.00764C22.3275 8.88197 22.4122 8.71783 22.4378 8.53831C22.507 8.08949 22.1942 7.67402 21.7453 7.60734Z" fill="#FFB800"/></svg>
                                        </span>
                                        <span> {{ product.metafields.loox.avg_rating }} / 5 </span>
                                    </p>
                                {% endif %} 
                            {% endif %}
                        </div> 
                    </div>
                    <div class="product-price-wrapper"> 
                        <span class="product-price">
                            {% assign splited_price = product.price | money_with_currency | split: "." %} {% if splited_price[0] == "Rs" %} {{ splited_price[0] }}. {{ splited_price[1] }} {% else %} {{ product.price | money_with_currency }}{% endif %}
                        </span>
                        {% if product.compare_at_price > product.price %} 
                            {% assign splited_price_com = product.compare_at_price | money_with_currency | split: "." %} 
                                <span class="product-mrp"> 
                                    {% if splited_price_com[0] == "Rs" %} 
                                        {{ splited_price_com[0] }}. {{ splited_price_com[1] }}
                                    {% else %} 
                                        {{ product.compare_at_price | money_with_currency }}
                                    {% endif %}
                                </span>
                        {% endif %}
                        {% if product.compare_at_price > product.price %}
                            {% assign diff = product.compare_at_price | minus: product.price | times: 100 %}
                            {% assign diff = diff | divided_by: product.compare_at_price %}
                            <span class="sale-price-off">{{ diff }}% off</span>
                        {% endif %}
                    </div>
                        {% if product.available %}
                            <input data-product="{{ product.handle }}" hidden name="product-selected-variant" id="{{ product.selected_or_first_available_variant.id }}" type="text">
                            <div class="product-form-wrapper product--{{ product.id }}">
                                {% if block.settings.show_view_details %}
                                    <button style="background:{{ block.settings.vw_bg_color }};color:{{ block.settings.vw_text_color }};border: 1px solid {{ block.settings.vw_brd_color }};" id="viewDetailsBtn--{{ product.id }}" type="button" data-product-variant="{{ product.selected_or_first_available_variant.id }}" onclick="openInnerModal('{{ block.id }}','product-details-{{ product.id }}','{{ mediaObject.id }}','{{ product.id }}')" class="product-view-details-btn">
                                        Shop Now
                                    </button>
                                {% endif %}
                            </div> 
                        {% else %}
                            <div class="product-form-wrapper product--{{ product.id }}">
                                {% if block.settings.show_view_details %}
                                    <button style="background:{{ block.settings.vw_bg_color }};color:{{ block.settings.vw_text_color }};border: 1px solid {{ block.settings.vw_brd_color }};" id="viewDetailsBtn--{{ product.id }}" type="button" data-product-variant="{{ product.selected_or_first_available_variant.id }}" onclick="openInnerModal('{{ block.id }}','product-details-{{ product.id }}','{{ mediaObject.id }}','{{ product.id }}')" class="product-view-details-btn">
                                        Shop Now
                                    </button>  
                                {% endif %}
                            </div> 
                        {% endif %} 
                    </div>
                </div>
                <div {% if mediaObject.products.size == 1 %}id="single-product-details-{{ product.id }}"{% else %}id="product-details-{{ product.id }}"{% endif %} class="d-inner-product-wrapper" {% if mediaObject.products.size == 1 %} style="display:block;" {% endif %}><div class="d-inner-modal-header"><div class="d-inner-media-tag-wrapper">{% for tag in mediaObject.tags limit: 1 %}<p class="d-inner-media-tag" style="background-color:{{ tag.bgColor }}; color:{{ tag.fgColor }};">{{ tag.text }}</p>{% endfor %}</div>{% if mediaObject.products.size != 1 %} <button class="d-inner-modal-close-btn" onclick="closeInnerModal('product-details-{{ product.id }}')">  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none"><path d="M24.0625 24.0625L17.9375 17.9375" stroke="black" stroke-width="2.625" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.9375 24.0625L24.0625 17.9375" stroke="black" stroke-width="2.625" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.3125 21C8.3125 28.0071 13.9929 33.6875 21 33.6875C28.0071 33.6875 33.6875 28.0071 33.6875 21C33.6875 13.9929 28.0071 8.3125 21 8.3125C13.9929 8.3125 8.3125 13.9929 8.3125 21Z" stroke="black" stroke-width="2.625"></path></svg></button>{% endif %} </div><div class="d-inner-img-wrapper"> {% for image in product.images %}<img data-src="/{{ image | img_url : 'master' }}" width="150" height="auto" alt="product-image" loading="lazy" style="border:1px solid #d3d3d3;" alt="" class="sj-im-lazy-load"> {% endfor %} </div><div class="d-inner-title-rvw-wrap"><p class="d-product-title-inner">{{ product.title }}</p><div class="price-review-wrap">{% if block.settings.review_app == 'judgeme' %}{% if product.metafields.reviews.rating %}  <p class="product-review-box"> <span class="review-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 23 22" fill="none"><path d="M21.7453 7.60734L15.2337 6.66099L12.3228 0.759739C12.2433 0.598166 12.1125 0.467369 11.951 0.387865C11.5458 0.187823 11.0533 0.354525 10.8507 0.759739L7.93987 6.66099L1.42823 7.60734C1.24871 7.63299 1.08457 7.71762 0.958904 7.84585C0.806979 8.00201 0.723261 8.21209 0.726146 8.42993C0.729032 8.64778 0.818284 8.85556 0.974292 9.00764L5.68554 13.6009L4.57249 20.0869C4.54639 20.2378 4.56308 20.393 4.62068 20.5348C4.67828 20.6767 4.77448 20.7996 4.89837 20.8896C5.02226 20.9796 5.16889 21.033 5.32162 21.0439C5.47435 21.0548 5.62708 21.0227 5.76248 20.9512L11.5868 17.889L17.4111 20.9512C17.5701 21.0358 17.7548 21.064 17.9317 21.0333C18.378 20.9563 18.678 20.5332 18.6011 20.0869L17.488 13.6009L22.1993 9.00764C22.3275 8.88197 22.4122 8.71783 22.4378 8.53831C22.507 8.08949 22.1942 7.67402 21.7453 7.60734Z" fill="#FFB800"/></svg></span> <span> {{ product.metafields.reviews.rating.value }} / 5 </span></p>{% endif %}{% endif %}{% if block.settings.review_app == 'shopify_review' %} {% if product.metafields.spr.reviews %}{{ product.metafields.spr.reviews }}{% endif %}{% endif %}{% if block.settings.review_app == 'loox' %} {% if product.metafields.loox.avg_rating %}<p class="product-review-box"> <span class="review-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 23 22" fill="none"><path d="M21.7453 7.60734L15.2337 6.66099L12.3228 0.759739C12.2433 0.598166 12.1125 0.467369 11.951 0.387865C11.5458 0.187823 11.0533 0.354525 10.8507 0.759739L7.93987 6.66099L1.42823 7.60734C1.24871 7.63299 1.08457 7.71762 0.958904 7.84585C0.806979 8.00201 0.723261 8.21209 0.726146 8.42993C0.729032 8.64778 0.818284 8.85556 0.974292 9.00764L5.68554 13.6009L4.57249 20.0869C4.54639 20.2378 4.56308 20.393 4.62068 20.5348C4.67828 20.6767 4.77448 20.7996 4.89837 20.8896C5.02226 20.9796 5.16889 21.033 5.32162 21.0439C5.47435 21.0548 5.62708 21.0227 5.76248 20.9512L11.5868 17.889L17.4111 20.9512C17.5701 21.0358 17.7548 21.064 17.9317 21.0333C18.378 20.9563 18.678 20.5332 18.6011 20.0869L17.488 13.6009L22.1993 9.00764C22.3275 8.88197 22.4122 8.71783 22.4378 8.53831C22.507 8.08949 22.1942 7.67402 21.7453 7.60734Z" fill="#FFB800"/></svg></span><span> {{ product.metafields.loox.avg_rating }} / 5 </span></p>
                                      {% endif %}
                                    {% endif %}
                                  </div>
                                </div>
                                <div class="d-inner product-price-wrapper"><span class="product-price" id="inner-price--{{ product.id }}"> {% assign splited_price = product.price | money_with_currency | split: "." %} {% if splited_price[0] == "Rs" %} {{ splited_price[0] }}. {{ splited_price[1] }} {% else %} {{ product.price | money_with_currency }}{% endif %} </span>
                                  {% if product.compare_at_price > product.price %}<span class="product-mrp" id="inner-cmp-price--{{ product.id }}">{% assign splited_price_com = product.compare_at_price | money_with_currency | split: "." %} {% if splited_price_com[0] == "Rs" %} {{ splited_price_com[0] }}. {{ splited_price_com[1] }}{% endif %}</span>{% endif %}
                                  {% if product.compare_at_price > product.price %}
                                    {% assign diff = product.compare_at_price | minus: product.price | times: 100 %}
                                    {% assign diff = diff | divided_by: product.compare_at_price %}<span class="sale-price-off" id="inner-sale-amount--{{ product.id }}">{{- diff }}% off</span>
                                  {% endif %}
                                </div>
                                <div class="product-variants-wrapper">
                                  <input data-product-handle="{{ product.handle }}" hidden name="product-selected-variant" id="{{ product.selected_or_first_available_variant.id }}" data-product="{{ product.id }}" type="text" data-option1="{{ selected_or_first_available_variant.option1 }}" data-option2="{{ selected_or_first_available_variant.option2 }}" data-option3="{{ selected_or_first_available_variant.option3 }}"/>
                                  {% if product.variants.size > 1 %}
                                  <table class="sj-prod-var-table">
                                    {% for option in product.options_with_values %}
                                      <tr class="inner-product-option-wrapper"><td><div class="ipow-name"><label for="product-variant">{{ option.name | capitalize }}</label></div></td><td><div class="ipow-value">{% for value in option.values %}<button type="button" class="inner-variant-button {{ option.name }} {% if forloop.first %}selected{% endif %}" data-value="{{ value }}" data-option="{{ option.name }}" data-option-index="option{{ forloop.parentloop.index }}" data-product="{{ product.id }}" data-media-id="{{ mediaObject.id }}">{{ value }}</button>{% endfor %}</div></td></tr>{% endfor %}</table>{% endif %}</div>
                            
                                <div class="d-inner-product-offer-wrapper">
                                  <button class="accordion" style="border-bottom: 1px solid #000000;"><span>Product Details</span><span class="acc-plus-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.5V9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"/></svg> </span>
                                  </button><div class="panel d-inner-description">
                                    {% if product.description %}
                                    <div class="inner-product-description" id="inner-description-{{ mediaObject.id }}--{{ product.id }}">{{ product.description }}</div>{% endif %}</div>
                                  {% if num_of_offers != 0 %}
                                  <button class="accordion" style="border-bottom: 1px solid #000000;" onclick="offerViewCapture('{{ product.id }}','{{ mediaObject.id }}','{{ block.id }}')">
                                    <span>Offers</span><div class="offer-count-wrapper">
                                      <span class="offer-count"><span class="tag-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M2.66659 3.99984C2.9318 3.99984 3.18616 3.89448 3.37369 3.70694C3.56123 3.51941 3.66659 3.26505 3.66659 2.99984C3.66659 2.73462 3.56123 2.48027 3.37369 2.29273C3.18616 2.10519 2.9318 1.99984 2.66659 1.99984C2.40137 1.99984 2.14701 2.10519 1.95948 2.29273C1.77194 2.48027 1.66659 2.73462 1.66659 2.99984C1.66659 3.26505 1.77194 3.51941 1.95948 3.70694C2.14701 3.89448 2.40137 3.99984 2.66659 3.99984ZM10.6066 5.71984C10.8466 5.95984 10.9999 6.29317 10.9999 6.6665C10.9999 7.03317 10.8533 7.3665 10.6066 7.6065L7.27325 10.9398C7.1496 11.0641 7.00261 11.1628 6.84072 11.2301C6.67883 11.2974 6.50524 11.332 6.32992 11.332C6.1546 11.332 5.98101 11.2974 5.81912 11.2301C5.65723 11.1628 5.51024 11.0641 5.38658 10.9398L0.726585 6.27984C0.479919 6.03317 0.333252 5.69984 0.333252 5.33317V1.99984C0.333252 1.25984 0.926585 0.666504 1.66659 0.666504H4.99992C5.36658 0.666504 5.69992 0.813171 5.93992 1.05317L10.6066 5.71984ZM8.02658 1.8065L8.69325 1.13984L13.2733 5.71984C13.5199 5.95984 13.6666 6.29984 13.6666 6.6665C13.6666 7.03317 13.5199 7.3665 13.2799 7.6065L9.69325 11.1932L9.02658 10.5265L12.8333 6.6665L8.02658 1.8065Z"fill="black" /></svg></span><span class="offer-count-text">
                                            {% if num_of_offers == 0 %}{% elsif num_of_offers == 1 %}1 offer{% else %}{{ num_of_offers }} offers{% endif %}</span></span>
                                      <span class="acc-plus-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.5V9.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="black" stroke-width="1.5"/></svg></span>
                                    </div>
                                  </button>{% endif %}<div class="panel offer-description">
                                    <div class="offers-wrapper">
                                      {% for item in shop.metafields.shoppable_offer.offerlist.value.offers %}
                                        {% assign offer = shop.metafields.shoppable_offers[item].value %}
                                        {% if offer.status == true %}
                                        <div class="offer-card count-{{ forloop.index }}">
                                          <div class="offer-head-wrap"><div class="offer-header"><h3 class="offer-code-t">{{ offer.title }}</h3><p class="offer-code">{{ offer.code }}</p></div><div class="offer-copy-text">
                                              <input hidden class="coupon_code_text" id="code-{{ forloop.index }}" value="{{ offer.code }}"/>
                                              <button onclick="copyCode('code-{{ forloop.index }}','copy-text-{{ forloop.index }}',this,'{{ mediaObject.id }}','{{ product.id }}','{{ block.id }}')"id="copy-text-{{ forloop.index }}">COPY</button>
                                        </div></div><p class="offer-text-wrap">{{ offer.description }}</p></div>{% endif %}
                                      {% endfor %}</div></div>
                                </div>
                                <div class="d-inner-btns-wrapper">
                                  {% if product.available %}
                                    <button {% if block.settings.show_buy_button %}
                                      style="background:{{ block.settings.adtc_bg_color }}; color:{{ block.settings.adtc_text_color }};border:1px solid {{ block.settings.adtc_brd_color }};" 
                                      {% else %}
                                      style="background:{{ block.settings.adtc_bg_color }}; color:{{ block.settings.adtc_text_color }};border:1px solid {{ block.settings.adtc_brd_color }};"
                                      {% endif %}
                                      type="button" class="d-inner-cta-btn adtc" data-adtc-product-handle="{{ product.handle }}" data-adtc-product="{{ product.id }}" onclick="productAddToCart(this,'{{ product.handle }}','{{ product.id }}','{{ mediaObject.id }}','{{ block.id }}')">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.5V9.5" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5"/></svg>
                                      ADD TO CART
                                    </button>
                                    {% if block.settings.show_buy_button %}
                                    <button style="background:{{ block.settings.buybtn_bg_color }}; color:{{ block.settings.buybtn_text_color }}; border: 1px solid {{ block.settings.buybtn_brd_color }};" type="button" class="d-inner-cta-btn buybtn" data-buybtn-product-handle="{{ product.handle }}" data-buybtn-product="{{ product.id }}" onclick="productBuyNow('{{ product.handle }}','{{ product.id }}','{{ mediaObject.id }}','{{ block.id }}')">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 17C9 16.4477 9.44772 16 10 16C10.5523 16 11 16.4477 11 17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17Z" fill="white"/><path d="M15 17C15 16.4477 15.4477 16 16 16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18C15.4477 18 15 17.5523 15 17Z" fill="white"/><path d="M5.24988 6.75H6.40076C6.61053 6.75 6.79799 6.88093 6.8702 7.07788L9.01901 12.9385C9.30785 13.7263 10.0577 14.25 10.8968 14.25H15.3085C16.1693 14.25 16.9336 13.6991 17.2058 12.8825L18.5306 8.90811C18.6385 8.58435 18.3976 8.25 18.0563 8.25H10.4999" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                      BUY NOW
                                    </button>
                                    {% endif %}
                                  {% else %}
                                  <button style="background:#ccc; cursor: not-allowed; color:{{ block.settings.adtc_text_color }};border:1px solid {{ block.settings.adtc_brd_color }};" type="button" class="d-inner-cta-btn adtc" data-adtc-product-handle="{{ product.handle }}" data-adtc-product="{{ product.id }}" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 12H9.5" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.5V9.5" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z" stroke="{{ block.settings.adtc_text_color }}" stroke-width="1.5"/></svg>
                                    SOLD OUT
                                  </button>
                                  {% endif %}
                                </div>
                                <!-- product adding notification --><div class="product-add-notify"><p>Product Added To Cart</p></div>
                              </div>
                              <!-- product details modal for each product -->
                            </div>
                          {% endfor %}`
}
