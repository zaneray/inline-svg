/*
$.inlineSVG();
Currently just using this to inject them into the style guide. Pretty experimental at this point. JJM 
*/
//temp one that inlines img srcs
(function ($) {
  $.fn.inlineSVG = function (args) {
    var options = {

    };
    
    $.extend( options, args );
    this.each(function(){
      var $this = $(this);
          
      if($this) {
        var svgUrl = $this.attr('src'),
            $parent = $this.parent(),
            classNames = $this.attr('class');
            
        var ajax = new XMLHttpRequest();
          ajax.open("GET", svgUrl, true);
          ajax.send();
          ajax.onload = function(e) {
            var div = document.createElement("div");
            $this.replaceWith(ajax.responseText);
            $parent.find('svg').attr('class', classNames);
          }
      }
    });
  };
}( jQuery ));



