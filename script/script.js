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