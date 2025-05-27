$( "img" ).load(function() {
    
    if (isSessionLMS) {
        establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
    }
});	