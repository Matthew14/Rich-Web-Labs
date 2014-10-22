var hideSections = function(){

    var hideShowButton = document.getElementById("hideSections");
    var elements = document.getElementsByTagName("section");

    for (var i = elements.length - 1; i >= 0; i--) {
        elements[i].style.display = hideShowButton.innerHTML == "HIDE" ? "none" : "inline";
    };

    hideShowButton.innerHTML = hideShowButton.innerHTML == "HIDE" ? "SHOW" : "HIDE";

}
