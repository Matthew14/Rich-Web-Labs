function isValidValue(value){
    return value != null && value !== '';
}

function validateForm1 () {
    var formName = "form1";

    var error = document.getElementById('error');

    var name = document.forms[formName]["name"].value;
    var age = document.forms[formName]["age"].value;
    var gender = document.forms[formName]["gender"].value;
    var conditionsAccepted = document.getElementById('tandcCheckbox').checked;

    if(isValidValue(name) && isValidValue(age) && isValidValue(gender) && conditionsAccepted){
        error.innerHTML = '';
        alert("Woohoo!\nName: " +name + "\nAge: " + age + "\nGender: " + gender + "\nT&Cs Accepted: " + conditionsAccepted);
    }
    else{
        error.innerHTML = 'Error with your entry';

    }


}
