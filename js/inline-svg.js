(function ($) {
  $.fn.inlineSVG = function (args) {
    var options = {

    };

    var selector = this.selector;

    $.extend( options, args );

    //function to inline SVGs as part of the jquery plugin or part of the MutationObserver event.
    var makeSVGInline = function($el){
      var svgUrl      = $el.attr('src'),
          $parent     = $el.parent(),
          classNames  = $el.attr('class');

      //this works better than $.ajax();
      var ajax = new XMLHttpRequest();
          ajax.open("GET", svgUrl, true);
          ajax.send();

          ajax.onload = function(e) {
             //if the status is not 404 do the replacement otherwise do nothing.
            if(ajax.status !== 404) {

              var $svg = $(ajax.responseText);

              $svg.attr('class', classNames + ' loaded');
              $el.replaceWith($svg);
              
            } 
            else {
              $el.addClass('not-loaded');
            }
          }
    };

    //loop on inline SVGs loaded with the plugin
    this.each(function(){
      //if($this) {
        makeSVGInline($(this));
      //}
    });

    //observe the DOM for mutations, if anything changes on the page scan it for new img selector
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {

        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          var $inlineSVGs = $("img" + selector).not('.loaded');

          $inlineSVGs.each(function(){
            makeSVGInline($(this));
          });
        }
      });    
    });

    observer.observe(document.body, {
      attributes: true, 
      childList: true,
      subtree: true
    });
  };
}( jQuery ));

