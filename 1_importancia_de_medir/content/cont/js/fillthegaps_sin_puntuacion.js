var usados = new Array();
var primera_vez = true;
var correcto = false;
var bot_aceptar = $("#botonAceptar");
bot_aceptar.attr("disabled", true);
bot_aceptar.css("opacity", 0.3);
var feedbackfallo = $("#capafallo").text();
var feedbackacierto = $("#capaacierto").text();
feedbacksiguiente =
   'Has identificado correctamente las ventajas, pulsa "SIGUIENTE" para continuar';
var aciertos = 0;
var soluciones = $("div[data-value='1']").length;






$(document).ready(function () {
   /*$('select').each(function(){
    $(this).css('width', function() {
      var a = $(this).css('width');
      return "calc("+a+" + 2.5rem)"
    });
  });*/
   
   $("select[id^='opciones_']").each(function (idx, el) {
      usados[idx] = 0;
   });

   //comprobamos que se ha seleccionado alguna opción
   $("select[id^='opciones_']").change(function () {
      var puls = $(this).attr("id");
      var puls = parseInt(puls.substring(puls.indexOf("_") + 1, puls.length));
      this.checked = true;
      //metemos un 1 en cada combobox que se ha resuelto
      usados[puls - 1] = 1;
      checkRespuestas();
   });

   function checkRespuestas() {
      var todospulsados = true;

      for (var i = 0; i < usados.length; i++) {
         if (usados[i] == 0) {
            todospulsados = false;
         }
      }

      if (todospulsados && primera_vez) {
         primera_vez = false;
         bot_aceptar.attr("disabled", false);
         TweenLite.to(bot_aceptar, 0.9, {
            opacity: bot_aceptar.css("opacity"),
            opacity: 1,
         });
         $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      }
   }
   bot_aceptar.click(function () {
      clickAceptar();
      var windowWidth = $(window).width();
      if (correcto) {
         //si la resolucion es menor de 961, utilizamos 100% de pantalla para el POP UP
         if (windowWidth >= 768) {
            $.colorbox({
               inline: true,
               href: "#contenidoCorrecto",
               closeButton: false,
               width: "50%",
               maxHeight: "90%",
               maxWidth: "100%",
               overlayClose: false,
               escKey: false,
               className: "fill_the_gaps",
            });
         } else {
            $.colorbox({
               inline: true,
               href: "#contenidoCorrecto",
               closeButton: false,
               width: "100%",
               maxHeight: "90%",
               maxWidth: "100%",
               overlayClose: false,
               escKey: false,
               className: "fill_the_gaps",
            });
         }
      } else {
         //si la resolucion es menor de 961, utilizamos 100% de pantalla para el POP UP
         if (windowWidth >= 768) {
            $.colorbox({
               inline: true,
               href: "#contenidoIncorrecto",
               closeButton: false,
               width: "50%",
               maxHeight: "90%",
               className: "fill_the_gaps",
            });
         } else {
            $.colorbox({
               inline: true,
               href: "#contenidoIncorrecto",
               closeButton: false,
               width: "100%",
               maxHeight: "90%",
               className: "fill_the_gaps",
            });
         }
      }
   });

   function clickAceptar() {
      var aux_correcto = true;
      $("select[id^='opciones_']").each(function (idx, el) {
         var puls = $("option[name=question_" + (idx + 1) + "]:selected").val();
         console.log($(".oculto_check.opciones_" + (idx + 1) + ""));
         if (puls != "1") {
            aux_correcto = false;
            //ocultamos la respuesta correcta
            //$("select[id = opciones_" + (idx+1) +"]").next().css("display","none");

            $(".oculto_check.opciones_" + (idx + 1) + "").attr(
               "aria-hidden",
               "true"
            );
         } else {
            //marcamos la respuesta correcta
            //console.log($("select[id = opciones_" + (idx+1) +"]").parent().prev().children().first());
            $(".oculto_check.opciones_" + (idx + 1) + "").css(
               "visibility",
               "visible"
            );
            $(".oculto_check.opciones_" + (idx + 1) + "").css("opacity", "1");
            $(".oculto_check.opciones_" + (idx + 1) + "").attr(
               "aria-hidden",
               "false"
            );
         }
      });

      //si todos correctos
      if (aux_correcto) {
         correcto = true;
      } else {
         correcto = false;
      }
   }

   $("#botonAceptar_popup").on("click", function () {
      //si estamos en local xml hasscorm=0
      var isOnline = curso.getScorm();

      if (isOnline == 1) {
         var apicor = getAPI();
         var connection = "false";

         if (apicor != null) {
            $.ajax({
               url: "cont/check_connection.html",
               timeout: 40000,
               async: false,
               cache: false,
               error: function (jqXHR) {
                  if (jqXHR.status == 0) {
                     connection = "false";
                  }
               },
               success: function () {
                  connection = "true";
               },
            });
         }
         //si no hay conexion con el API SCORM o no hay conexion a internet
         if (apicor == null || connection == "false") {
            $.colorbox.close();
            $(document).bind("cbox_closed", function () {
               setTimeout(nextPage, 1000);
            });
         } else {
            $.colorbox.close();
            nextPage();
         }
      } else {
         $.colorbox.close();
         nextPage();
      }
   });

   $("#botonNI_popup").on("click", function () {
      $.colorbox.close();
   });
});
