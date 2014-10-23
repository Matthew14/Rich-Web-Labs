var hideSections = function(){

    var hideShowButton = document.getElementById("hideSections");
    var elements = document.getElementsByTagName("section");

    for (var i = elements.length - 1; i >= 0; i--) {
        elements[i].style.display = hideShowButton.innerHTML == "HIDE" ? "none" : "block";
    };

    hideShowButton.innerHTML = hideShowButton.innerHTML == "HIDE" ? "SHOW" : "HIDE";

}


function emphasise(){


    var r = new RegExp('defeasible', 'ig');

    document.getElementById('body').innerHTML = document.getElementById('body').innerHTML.replace(r, "<b style='color: yellow'>Defeasible</b>");

}

function removeLinks(){
    var anchors = document.getElementsByTagName("a");
    for (var i = anchors.length - 1; i >= 0; i--) {
        anchors[i].parentNode.removeChild(anchors[i]);
    };
}
