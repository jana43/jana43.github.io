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