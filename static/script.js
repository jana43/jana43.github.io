/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */


function resize(){
    var screen =  window.outerWidth
    var i = document.getElementsByClassName("link")
    var j = i[0]
    console.log(screen)
    if (screen > 700){
        j.style.display = "flex"
    } else {
        j.style.display = "none"
    }
}

function showHide() {
    var x = document.getElementsByClassName("link");
    var y = x[0]
    
    console.log(x[0].style)
    console.log(x[0] , screen)
    
    if (y.style.display === "flex") {
      y.style.display = "none";
    } else {
      y.style.display = "flex";
    }
  }
  