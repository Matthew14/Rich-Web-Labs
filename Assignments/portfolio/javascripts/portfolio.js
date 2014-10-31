function onLoadHandler(){
    setAge();
}

var setAge = function(){
    var ageSpan = document.getElementById("age");
    var birthday = new Date(1991,11,14);
    var timeDifference = (new Date().getTime() - birthday.getTime());
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(timeDifference/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);
    ageSpan.innerHTML = years;
}
