'use strict';

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
  // functions
  var waypointAnimation, updateWindowHeight, updateScrollPosition,
  measureElement, measureAllEllements, findVisibles, isVisible, updateVisibleClasses,

  // constants
  DEFAULT_OPTIONS, NAME_SPACE,

  // vars
  windowHeight, scrollTopPosition, scrollBottomPosition, visibleElements, elements,

  // DOM elements
  $w;

  NAME_SPACE = 'waypointAnimation';

  DEFAULT_OPTIONS = {
    triggerSelector: '.js-animation-trigger',
    animationClass: 'is-shown',
    removeClasses: false,
    offset: 0
  };

  $w = $(window);

  windowHeight = 0;
  scrollTopPosition = 0;

  elements = [];

  updateWindowHeight = function() {
    windowHeight = $w.height();
  };

  updateScrollPosition = function() {
    scrollTopPosition = $w.scrollTop();
    scrollBottomPosition = scrollTopPosition + windowHeight;
  };

  measureElement = function($el) {
    var top = $el.offset().top;
    return {
      top: top,
      bottom: top + $el.height()
    };
  };

  measureAllEllements = function(triggerSelector) {
    elements = $(triggerSelector).map(function() {
      var $el = $(this);
      return {
        $el: $el,
        position: measureElement($el)
      };
    });
  };

  isVisible = function(top, bottom) {
    if (scrollBottomPosition > top && scrollTopPosition < top) {
      return true;
    }
    if (scrollBottomPosition > bottom && scrollTopPosition < bottom) {
      return true;
    }
  };

  findVisibles = function() {
    visibleElements = $.map(elements, function(data) {
      if (isVisible(data.position.top, data.position.bottom)) {
        return data;
      }
    });
  };

  updateVisibleClasses = function(className, removeClasses) {
    $.each(visibleElements, function() {
      this.$el.addClass(className);
    });
    if (removeClasses) {
      return true;
      // remove classes if not visible
    }
  };

  waypointAnimation = function(options) {
    var updateVisibles;
    options = $.extend({}, DEFAULT_OPTIONS, options);

    updateWindowHeight();
    updateScrollPosition();
    measureAllEllements(options.triggerSelector);

    updateVisibles = function() {
      findVisibles();
      updateVisibleClasses(options.animationClass, options.removeClasses);
    };

    updateVisibles();

    $w.on('resize.' + NAME_SPACE + ' orientationchange.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        updateWindowHeight();
        measureAllEllements(options.triggerSelector);

        updateVisibles();
      });
    }).on('scroll.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        updateScrollPosition();
        updateVisibles();
      });
    });
  };

  return waypointAnimation;
}));
