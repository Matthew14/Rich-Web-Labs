//Task 1
$('a').css("font-style", "italic");

//Task 2
var newSection = $('<section id="newSection"></section">');
newSection.load('newSection.txt');
newSection.insertAfter('#external_links_section');

//Task 3 & 4
$('document').ready(function(){
    $('section').each(function(){
        var name = $(this).find("h1").eq(0).html();
        var buttonText = "Close " + name;
        var button = $('<button>'+buttonText+'</button><br>');
        var sect = $(this);

        button.click(function(){
            if(sect.is(":visible"))
            {
                sect.hide();
                $(this).text("Open " + name); //Task 4
            }
            else
            {
                sect.show();
                 $(this).text("Close " + name); //Task 4
            }
        });

        $(this).before(button);
    });
});
