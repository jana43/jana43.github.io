let navIsOpen = false
function showNav(){
    if(navIsOpen){
        var navLinks = document.getElementsByClassName("nav-links")[0]
        navLinks.style["display"] = "none"
        navIsOpen = false
    }else{
        var navLinks = document.getElementsByClassName("nav-links")[0]
        navLinks.style["display"] = "flex"
        navIsOpen  = true
    }
   
}

//navigating at the top of the id
// The function actually applying the offset
function offsetAnchor() {
    if(location.hash.length !== 0) {
        window.scrollTo(window.scrollX, window.scrollY - 100);
    }
}

// This will capture hash changes while on the page
window.addEventListener("hashchange", offsetAnchor);

// This is here so that when you enter the page with a hash,
// it can provide the offset in that case too. Having a timeout
// seems necessary to allow the browser to jump to the anchor first.
window.setTimeout(offsetAnchor, 1); // The delay of 1 is arbitrary and may not always work right (although it did in my testing).

function runOnScroll() {
    
   
    if (document.documentElement.scrollTop  >= 170) {
        var nav = document.getElementById("navbar")
        nav.style["background-color"] = "rgb(66, 66, 66)"
      } else {
        var nav = document.getElementById("navbar")
        nav.style["background-color"] = "rgba(66, 66, 66,0.349)"
      }
 }; 
window.addEventListener("scroll", runOnScroll);