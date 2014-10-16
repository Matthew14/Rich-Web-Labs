function validNumber(possibleNum) {
    return possibleNum != null && possibleNum !== '' && ! isNaN(possibleNum);
}

function getCelcius() {
    var fahrenheit = document.getElementById('fahrenheitField').value;

    if(validNumber(fahrenheit)){
        var celcius = (fahrenheit - 32) * 5/9;
        document.getElementById('celciusField').value = celcius;
    }
    else{
        alert("Value for Fahrenheit ('" + fahrenheit + "') is not valid", "Error");
    }
}

function getFahrenheit() {
    var celcius = document.getElementById('celciusField').value;
    if(validNumber(celcius)){
        var fahrenheit = celcius * 9/5 + 32;
        document.getElementById('fahrenheitField').value = fahrenheit;
    }
    else{
        alert("Value for Celcius ('" + celcius + "') is not valid");
    }
}
