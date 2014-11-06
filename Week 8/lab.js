//Task 1
$('a').css("font-style", "italic");

//Task 2
$('#newStuff').load('newSection.txt');

//Task 3
$('section').each(function(){
    var name = $(this).find("h1").eq(0).html();
    var buttonText = "Close " + name;
    var button = $('<button>'+buttonText+'</button><br>');
    var sect = $(this);
    button.click(function(){
        if(sect.is(":visible"))
        {
            sect.hide();
            $(this).text("Open " + name);
        }
        else
        {
            sect.show();
             $(this).text("Close " + name);
        }
    });

    $(this).before(button);
});
