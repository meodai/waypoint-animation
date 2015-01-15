'use strict';

(function (root, factory) {
  // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'requestAnimationFrame'], factory);
  } else {
    // Browser globals
    root.WaypointAnimation = factory(root.$);
  }
}(this, function ($) {
  // functions
  var WaypointAnimation, updateWindowHeight, updateScrollPosition,
  measureElement, measureAllEllements, findVisibles, isVisible, updateVisibleClasses, triggerCallbacks,

  // constants
  DEFAULT_OPTIONS, NAME_SPACE,

  // vars
  windowHeight, scrollTopPosition, scrollBottomPosition, visibleElements, appearingElements, disappearingElements, elements, callbacks,

  // DOM elements
  $w;

  // initializing vars
  NAME_SPACE = 'WaypointAnimation';

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
  disappearingElements = [];
  appearingElements = [];
  visibleElements = [];
  callbacks = [];

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
        position: measureElement($el),
        isVisible: false
      };
    });
  };

  triggerCallbacks = function() {
    appearingElements.forEach(function(element) {
      callbacks.forEach(function(callback) {
        callback.call(element.$el[0], element);
      });
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
    appearingElements = [];
    disappearingElements = [];

    // update visibility and filter new visible elements
    visibleElements = elements.filter(function (i, data) {
      var wasVisible = data.isVisible;
      data.isVisible = isVisible(data.position.top, data.position.bottom);
      if (data.isVisible && !wasVisible) {
        appearingElements.push(data);
      } else if (!data.isVisible && wasVisible) {
        disappearingElements.push(data);
      }

      return data.isVisible;
    });

    triggerCallbacks();
  };

  updateVisibleClasses = function(className, removeClasses) {
    $.each(appearingElements, function() {
      this.$el.addClass(className);
    });
    if (removeClasses) {
      // remove classes if not visible
      $.each(disappearingElements, function() {
        this.$el.removeClass(className);
      });
    }
  };

  WaypointAnimation = function(options) {
    var self;

    self = this;
    self.options = $.extend({}, DEFAULT_OPTIONS, options);

    updateWindowHeight();
    updateScrollPosition();
    measureAllEllements(self.options.triggerSelector);

    self.updateVisibles();

    $w.on('resize.' + NAME_SPACE + ' orientationchange.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        updateWindowHeight();
        measureAllEllements(self.options.triggerSelector);

        self.updateVisibles();
      });
    }).on('scroll.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        updateScrollPosition();
        self.updateVisibles();
      });
    });
  };

  WaypointAnimation.prototype = {
    updateVisibles: function() {
      findVisibles();
      updateVisibleClasses(this.options.animationClass, this.options.removeClasses);
    },
    on: function(callback) {
      callbacks.push(callback);
    }
  };

  return WaypointAnimation;
}));
