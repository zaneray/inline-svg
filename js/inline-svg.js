(function ($) {
  $.fn.inlineSVG = function (args) {
    var options = {

    };

    var selector = this.selector,
        ajaxRequests = [];

    $.extend( options, args );

    //function to inline SVGs as part of the jquery plugin or part of the MutationObserver event.
    var makeSVGInline = function($el){
      if($el[0].nodeName === 'IMG' && !$el.hasClass('loaded')) {
        var svgUrl      = $el.attr('src');

        //if an ajax request has not already been sent for this url
        if(ajaxRequests.indexOf(svgUrl) == -1) {
          //If there are multiple instances of the same image, load them all with a single ajax call
          var $imgInstances = $(selector).filter('[src="' + svgUrl + '"]');

          //this works better than $.ajax();
          var ajax = new XMLHttpRequest();
          ajax.open("GET", svgUrl, true);
          ajax.send();
          ajaxRequests.push(svgUrl);

          ajax.onload = function(e) {
             //if the status is not 404 do the replacement otherwise do nothing.
             if(ajax.status !== 404) {

              $imgInstances.each(function() {
                var $this = $(this),
                    classNames = $this.attr('class'),
                    $svg = $(ajax.responseText);

                if (!$this.hasClass('loaded')){
                  $svg.attr('class', classNames + ' loaded');
                  $this.replaceWith($svg);
                }

                $this.css('background-color', 'red'); 
              });  
              
            } 
            else {
              $imgInstances.addClass('not-loaded');
            }
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
    ajaxRequests = [];

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
          ajaxRequests = [];
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

