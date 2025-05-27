$(document).ready(function(){

    $("[id^=boton]").css("cursor", "pointer");
    $(".aparecer_flecha").css("visibility", "hidden");
    $('[id^=boton_]').click(function(){
        
        $('[id^=boton_]').keypress();
        var puls = $(this).attr("id");
        var puls = parseInt(puls.substring(puls.indexOf("_")+1,puls.length));
        if ($("#texto_"+puls).hasClass("aparecer")){
            $("#texto_"+puls).css("visibility","visible");
        }
        $("#"+$(this).attr('data-rel')).css('visibility','visible');
        if(puls == 0) {
            updateNav(curso.unidades[curso.currIndex], false);
        }
        
        if ( this.which == 13 ) {
            this.preventDefault();
        }
    });

    $("div[id=boton]").click(function () {
        $("div[id=texto]").css("visibility", "visible");
        updateNav(curso.unidades[curso.currIndex], false);
    });

    $("div[id=boton]").keypress(function () {
        $("div[id=texto]").css("visibility", "visible");
        updateNav(curso.unidades[curso.currIndex], false);
    });
});

