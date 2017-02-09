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

            //if the status is not 404 do the replacement otherwise do nothing.
            if(ajax.status !== 404) {

              var $svg = $(ajax.responseText);

              $svg.attr('class', classNames + ' loaded');
              $this.replaceWith($svg);
              
            } 
            else {
              $this.addClass('not-loaded');
            }
           
          }
      }
    });
  };
}( jQuery ));
