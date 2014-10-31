function onLoadHandler(){
    setAge();
    document.getElementById("showOrHideNavButton").innerHTML = "Show Navigation";
}


//The handler for the 'show nav' button on mobile:
function showOrHideNav(){
    var nav = document.getElementById("topOfPageNav");
    var button = document.getElementById("showOrHideNavButton");
    console.log(button.innerHTML);
    nav.style.display = button.innerHTML == "Show Navigation" ? "inline-block" : "none";
    button.innerHTML = button.innerHTML == "Show Navigation" ? "Hide Navigation" : "Show Navigation";
}

// This function calculates my age based on my birthday
// Then it puts it into the 'about' section
var setAge = function(){
    var ageSpan = document.getElementById("age");
    var birthday = new Date(1991,11,14);
    var timeDifference = (new Date().getTime() - birthday.getTime());
    var day = 1000 * 60 * 60 * 24; //(time difference is given in seconds, let's convert to days)
    var days = Math.floor(timeDifference/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);
    ageSpan.innerHTML = years;
}
