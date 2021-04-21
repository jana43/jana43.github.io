function storeData() {
    let url = "https://jana43.github.io/json%20datas/indianhistory.json";
  
    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        console.log("Checkout this JSON! ", out);
        let list = []
        var theDiv = document.getElementById("content-list");
        
        for(let i =0 ; i< out.length; i++){
            console.log(i , out[i])
           
            var paragraph = document.createElement("div");
            paragraph.innerHTML = out[i].explain;
  
            var title = document.createElement("h3")
            title.innerHTML = out[i].question
         
            theDiv.appendChild(title);
            theDiv.appendChild(paragraph)
        }
      })
      .catch((err) => {
        throw err;
      });
  }
  
  window.onload = function () {
    storeData();
  };