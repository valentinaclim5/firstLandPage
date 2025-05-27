//BARRA DE PROGRESO

(function( $ ){
  // Simple wrapper around jQuery animate to simplify animating progress from your app
  // Inputs: El porcentaje de progreso, Callback
  $.fn.animateProgress = function(progress, callback) {    
    return this.each(function() {
      $(this).animate({
        width: progress+'%'
      }, {
        duration: 2000, 
        
        // swing or linear
        easing: 'swing',
        // this gets called every step of the animation, and updates the label
        step: function( progress ){
           //var labelEl = $(this),
              var valueEl = $('.text_value');
              //mostramos la etiqueta de %
		          //labelEl.fadeIn();
              //rellenamos el valor
              valueEl.text(Math.ceil(progress) + '%');
        },
        complete: function(scope, i, elem) {
          if (callback) {
            callback.call(this, i, elem );
          };
        }
      });
    });
  };
})( jQuery );