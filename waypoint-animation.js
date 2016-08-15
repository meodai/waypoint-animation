'use strict';

(function (root, factory) {
  // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'requestAnimationFrame'], factory);
  } else {
    // Browser globals
    root.WaypointAnimation = factory(root.jQuery);
  }
}(this, function ($) {
  // functions
  var WaypointAnimation, updateWindowHeight, updateScrollPosition,
  measureElement, measureAllElements, findVisibles, isVisible, updateVisibleClasses, triggerCallbacks,

  // constants
  DEFAULT_OPTIONS, NAME_SPACE,

  // vars
  windowHeight, scrollTopPosition, scrollBottomPosition, visibleElements, appearingElements, disappearingElements, elements, callbacks,

  // DOM elements
  $w;

  // initializing vars
  NAME_SPACE = 'WaypointAnimation';

  DEFAULT_OPTIONS = {
    triggerSelector: '.js-scroll-trigger',
    activeClass: 'is-shown',
    removeClasses: false,
    offset: 0,
    offsetAttribute: 'data-scrolloffset'
  };

  $w = $(window);

  windowHeight = 0;
  scrollTopPosition = 0;

  elements = [];
  disappearingElements = [];
  appearingElements = [];
  visibleElements = [];
  callbacks = [];

  /**
   * updateWindowHeight updates the context height
   * @returns {void}
   */
  updateWindowHeight = function() {
    windowHeight = $w.height();
  };

  /**
   * updateScrollPosition : update the scroll positions typically called on scroll event
   * @param {int} [offset] scroll offset for measurement
   * @returns {void}
   */
  updateScrollPosition = function(offset) {
    offset = offset || 0;
    scrollTopPosition = $w.scrollTop() + offset;
    scrollBottomPosition = scrollTopPosition + windowHeight - (offset * 2);
  };

  /**
   * measureElement finds out the vertical position
   * @param   {object} $el    jQuery DOM reference
   * @param   {object} offset offset of an individual elements
   * @returns {object}        containing the coordinates of the element
   */
  measureElement = function($el, offset) {
    var offset, top = $el.offset().top;
    offset = offset || 0;
    if( $el.outerHeight() <= offset * 2 ) {
      console.error('offset is larger than element ', $el);
    }
    return {
      top: top - offset,
      bottom: top + $el.outerHeight() + offset
    };
  };

  /**
   * measureAllElements measures all the registered element-positions
   * @param   {string} triggerSelector the DOM selector!
   * @returns {void}
   */
  measureAllElements = function(triggerSelector, offsetAttribute) {
    elements = $(triggerSelector).map(function() {
      var offset, $el = $(this);
      offset = this.hasAttribute(offsetAttribute) ? parseInt(this.getAttribute(offsetAttribute)) : 0;
      return {
        $el: $el,
        position: measureElement($el, offset),
        isVisible: false
      };
    });
  };

  /**
   * triggerCallbacks triggers the registered callbacks
   * @returns {void}
   */
  triggerCallbacks = function() {
    appearingElements.forEach(function(element) {
      callbacks.forEach(function(callback) {
        callback.call(element.$el[0], element);
      });
    });
  };

  /**
   * isVisible determines if an DOM element is visible or not based on its position
   * @param   {int}     top    top position of the element in PX
   * @param   {int}     bottom top position of the element in PX
   * @returns {Boolean}        true if its visible
   */
  isVisible = function(top, bottom) {

    if (scrollBottomPosition >= top && scrollTopPosition <= top) {
      return true;
    }
    if (scrollBottomPosition >= bottom && scrollTopPosition <= bottom) {
      return true;
    }
    if (scrollBottomPosition <= bottom && scrollTopPosition >= top ) {
      return true;
    }
  };

  /**
   * findVisibles looks for all elements that are visible, and also keeps track of elements
   * that newly show up or disappear from the visible range
   * @returns {void}
   */
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

  /**
   * updateVisibleClasses sets and remove CSS-classes that are newly shown or hidden
   * @param   {string}        className     name of the CSS-class that should be added
   * @param   {boolean}       removeClasses determines if className should be removed, once an element leaves the visible range again
   * @param   {string}        inactiveClass cssclass set to elements that are not visible
   * @returns {void}
   */
  updateVisibleClasses = function(className, removeClasses, inactiveClass) {
    $.each(appearingElements, function() {
      this.$el.addClass(className).removeClass(inactiveClass);
    });
    if (removeClasses) {
      // remove classes if not visible
      $.each(disappearingElements, function() {
        this.$el.removeClass(className).addClass(inactiveClass);
      });
    }
  };

  /**
   * WaypointAnimation is the main Class that is exposed
   * @param   {obj} options options that will extend the DEFAULT_OPTIONS
   * @returns {void}
   */
  WaypointAnimation = function(options) {
    var self;

    self = this;
    self.options = $.extend({}, DEFAULT_OPTIONS, options);

    // sets inactiveClass to an empty string
    self.options.inactiveClass = self.options.inactiveClass || '';

    // set inactiveClass to all elements
    $( this.options.triggerSelector ).addClass( self.options.inactiveClass );

    updateWindowHeight();
    self.remeasure();
    self.updateVisibles();

    $w.on('resize.' + NAME_SPACE + ' orientationchange.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        updateWindowHeight();
        self.remeasure();
        self.updateVisibles();
      });
    }).on('scroll.' + NAME_SPACE, function() {
      requestAnimationFrame(function() {
        self.updateVisibles();
      });
    });
  };

  WaypointAnimation.prototype = {
    /**
     * calls the functions needed to update the visibility
     * @returns {void}
     */
    updateVisibles: function() {
      updateScrollPosition(this.options.offset);
      findVisibles();
      updateVisibleClasses(this.options.activeClass, this.options.removeClasses, this.options.inactiveClass);
    },
    /**
     * On registers a callback
     * @param   {Function} callback callback function that will be called when elements change state
     * @returns {void}
     */
    on: function(callback) {
      callbacks.push(callback);
    },
    /**
     * remeasure: remeasures all elements
     * @returns {void}
     */
    remeasure: function() {
      measureAllElements(this.options.triggerSelector, this.options.offsetAttribute);
    }
  };

  return WaypointAnimation;
}));
