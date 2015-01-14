(function (root, factory) {
  // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'requestAnimationFrame'], factory);
  } else {
    // Browser globals
    root.waypointAnimation = factory(root.$);
  }
}(this, function ($) {
  'use strict';
  //functions
  var waypointAnimation, updateWindowHeight, updateScrollPosition, measureElement, measureAllEllements, addElement, findVisibles, isVisible, updateVisibleClasses,

  //globals
  defaultOptions, windowHeight, scrollTopPosition, scrollBottomPosition, wasScrolled, elements, nameSpace, visibleElements,

  //dom elements
  $w, $d;

  nameSpace = 'waypointAnimation';

  defaultOptions = {
    triggerSelector: '.js-animation-trigger',
    animationClass: 'is-shown',
    removeClasses: false,
    offset: 0
  };

  $w = $(window);
  $d = $(document);

  windowHeight = 0;
  scrollTopPosition = 0;
  wasScrolled = false;

  elements = [];

  updateWindowHeight = function(){
    windowHeight = $w.height();
  };

  updateScrollPosition = function(){
    scrollTopPosition = $w.scrollTop();
    scrollBottomPosition = scrollTopPosition + windowHeight;
  };

  measureElement = function($el){
    var top = $el.offset().top;
    return {
      top: top,
      bottom: top + $el.height()
    }
  };

  measureAllEllements = function(triggerSelector){
    elements = $(triggerSelector).map(function(){
      var $el = $(this);
      return {
        $el: $el,
        position: measureElement($el)
      }
    });
  };

  isVisible = function(top, bottom){
    if(scrollBottomPosition > top && scrollTopPosition < top){
      return true;
    }
    if(scrollBottomPosition > bottom && scrollTopPosition < bottom){
      return true;
    }
  };

  findVisibles = function(){
    visibleElements = $.map(elements, function(data){
      if(isVisible(data.position.top,data.position.bottom)){
        return data;
      }
    });
  };

  updateVisibleClasses = function(className,removeClasses){
    $.each(visibleElements, function(){
      this.$el.addClass(className);
    });
    if(removeClasses){
      //remove classes if not visible
    }
  };

  waypointAnimation = function(options){
    options = $.extend({},defaultOptions,options);

    updateWindowHeight();
    updateScrollPosition();
    measureAllEllements(options.triggerSelector);

    findVisibles();
    updateVisibleClasses(options.animationClass,options.removeClasses);

    $w.on('resize.' + nameSpace, function(){
      requestAnimationFrame(function(){
        updateWindowHeight();
        measureAllEllements(options.triggerSelector);

        findVisibles();
        updateVisibleClasses(options.animationClass,options.removeClasses);
      });
    }).on('scroll.' + nameSpace, function(e){
      requestAnimationFrame(function(){
        updateScrollPosition();

        findVisibles();
        updateVisibleClasses(options.animationClass,options.removeClasses);
      });
    });
  };

  return waypointAnimation;
}));
