function tryImages(img, name) {
    img.src = "img/" + name + ".jpg";
    img.onerror = function() {
        img.src = "img/" + name + ".png";
        img.onerror = function() {
            img.src = "img/" + name + ".gif";
            img.onerror = function(){
                var index = document.getElementById("index");
                if(parseInt(index.innerHTML) - 1 >= 0){
                    document.getElementById("index").innerHTML = parseInt(index.innerHTML) - 1;
                    tryImages(document.getElementById("mainImage"),document.getElementById("index").innerHTML);
                }

            };
        };
    };
}
tryImages(document.querySelector("img"), "image1");
function goForward(){
    var index = document.getElementById("index");
        document.getElementById("index").innerHTML = parseInt(index.innerHTML) + 1;
        if(tryImages(document.getElementById("mainImage"),document.getElementById("index").innerHTML) == true){
            document.getElementById("index").innerHTML = parseInt(index.innerHTML) - 1;
            tryImages(document.getElementById("mainImage"),document.getElementById("index").innerHTML);
        }
}
function goBack(){
    var index = document.getElementById("index");
    if(parseInt(index.innerHTML) - 1 >= 0){
        document.getElementById("index").innerHTML = parseInt(index.innerHTML) - 1;
        tryImages(document.getElementById("mainImage"),document.getElementById("index").innerHTML);
    }
}
function toggleSize(){
    var image = document.getElementById("mainImage");
    if(image.getAttribute("data-fullSize") == "false"){
        image.setAttribute("class", "centerImgFull bordered");
        image.setAttribute("data-fullSize", "true");
    }
    else if(image.getAttribute("data-fullSize") == "true"){
        image.setAttribute("class", "centerImg bordered");
        image.setAttribute("data-fullSize", "false");
    }
}
