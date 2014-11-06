var linksAreItalic = false;

$('#makeLinksItalicButton').click(function(){
    $('a').css("font-style", linksAreItalic ? "normal": "italic");
    linksAreItalic = !linksAreItalic;
    $(this).text(linksAreItalic ?  "Make Links not Italic": "Make Links Italic" );
});

$('#addExternalContent').click(function(){
    $('#newStuff').load('newSection.txt');
});
