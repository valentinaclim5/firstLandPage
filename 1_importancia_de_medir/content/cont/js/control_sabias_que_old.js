$(document).ready(function(){
    $("#sabias_cont").hide();
    $("#sabias_down").bind({
        click: function(e){
            $(this).css("display", "none");
            $("#sabias_cont").slideToggle();
        },
        keypress: function(e){
            if(e.which == 13) {
                $(this).css("display", "none");
                $("#sabias_cont").slideToggle();
            }
        }
    });
    $("#sabias_up").bind({
        click: function(e){
            $("#sabias_cont").slideToggle(function() {
                $("#sabias_down").css("display", "flex");
            });  
        }, 
        keypress: function(e){
            if(e.which == 13) {
                $("#sabias_cont").slideToggle(function() {
                    $("#sabias_down").css("display", "flex");
                });  
            }
        } 
    });
});