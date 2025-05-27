var Traductor = (function () {

    function Traductor() {
    	this.lang = {};
    	this.translateClass ="translate";
    }

    Traductor.prototype.init = function (lenguage, func) {
        var traductor = this;


        $.getJSON("lang/lang.json")
        .done(function(json) {
            var obj = traductor;
            //Cogemos el lenguaje correspondiente
            $.each(json.languages, function(i,data){
                if(data.lang == lenguage){
                    traductor.lang = data.tags;
                }
            })
            //console.log("lenguage cargado");
            if (func!= undefined && typeof func === "function"){
                func.call();
            }
         })
         .fail(function(jqxhr, textStatus, error){
            //console.log( "Request Failed: " + error );
            //init("es");
         })        
    };

    Traductor.prototype.translate = function (area){
    	var traductor = this;

    	if(area != undefined){
            $(area).find("." + traductor.translateClass).each(function(idx, elem){
                traductor.doTranslate(elem);    			
    		})
    	}else{
    		$("." + traductor.translateClass).each(function(idx,elem){
                traductor.doTranslate(elem);   			
    		})
    	}
    }

    Traductor.prototype.doTranslate = function (elem){
        var translation = traductor.lang[elem.id];                
        if(translation == undefined){
           translation = "NO TRASLATION AVAILABLE for " + elem.id;
        }
        elem.innerHTML = translation;
    }

    Traductor.prototype.getLabel = function(label){
    	var traductor = this;
    	var resp = traductor.lang[label];
    	if(resp != undefined){
    		return resp;
    	}else{
    		return "NO_LABEL_AVAILABLE"
    	}
    }
    return Traductor;
})();
