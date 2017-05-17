(function ($) {
  $.fn.inlineSVG = function (args) {
    var options = {

    };

    var selector = this.selector;

    $.extend( options, args );

    //function to inline SVGs as part of the jquery plugin or part of the MutationObserver event.
    var makeSVGInline = function($el){
      if($el[0].nodeName === 'IMG') {
        var svgUrl      = $el.attr('src');

        //If there are multiple instances of the same image, load them all with a single ajax call
        var $imgInstances = $(selector).filter('[src="' + svgUrl + '"]');

        //this works better than $.ajax();
        var ajax = new XMLHttpRequest();
        ajax.open("GET", svgUrl, true);
        ajax.send();

        ajax.onload = function(e) {
             //if the status is not 404 do the replacement otherwise do nothing.
             if(ajax.status !== 404) {

              var $svg = $(ajax.responseText);

              $imgInstances.each(function() {
                var $this = $(this),
                    classNames = $(this).attr('class');

                $svg.attr('class', classNames + ' loaded');

                $this.replaceWith($svg);
              });  
              
            } 
            else {
              $imgInstances.addClass('not-loaded');
            }
          }
        }
      };

    //loop on inline SVGs loaded with the plugin
    this.each(function(){
      //if($this) {
        makeSVGInline($(this));
      //}
    });

    $(window).load(function(){

      var nodesAdded = false;
      //observe the DOM for mutations, if anything changes on the page scan it for new img selector
      var observer = new MutationObserver(function(mutations) {


        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            nodesAdded = true;
          } else {
            nodesAdded = false;
          }
        }); 
        if(nodesAdded) {
          var $newInlineSVGs = $(selector).not('.loaded');

          $newInlineSVGs.each(function(){
            makeSVGInline($(this)); 
          });
        }
      });

      observer.observe(document.body, {
        attributes: true, 
        childList: true,
        subtree: true
      });
    });
  };
}( jQuery ));

