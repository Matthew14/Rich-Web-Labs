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

    var et = "";
    var haserror = false;

    if (!isValidValue(name))
    {
        haserror = true;
        et+="Name not valid<br>";
    }
    if(!isValidValue(age))
    {
        haserror = true;
        et+= "Age not valid<br>";
    }
    if(!isValidValue(gender))
    {
        haserror = true;
        et += "No gender selected<br>";
    }
    if(! conditionsAccepted)
    {
        haserror = true;
        et+="You must accept the terms and conditions";
    }

    if(!haserror){
        error.innerHTML = '';
        alert("Woohoo!\nName: " +name + "\nAge: " + age + "\nGender: " + gender + "\nT&Cs Accepted: " + conditionsAccepted);
        return true;
    }
    else{
        error.innerHTML =et;
        return false;


    }


}
