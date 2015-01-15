# waypoint-animation
know if a element on the page is in the visible scroll-range or not. Only works vertically for now.

### Installation

```
  bower install waypoint-animation
```

### Usage
By creating a new instance of WaypointAnimation, it will automatically add a 'active' class to elements that in the visible scroll range.

```javascript
  // create a new instance of WaypointAnimation
  wpa = new WaypointAnimation({
    triggerSelector: '.js-trigger',
    animationClass: 'is-shown',
    removeClasses: true
  });
```

Callbacks can be registered, that are called every time an element becomes visible or invisible.

```javascript
  wpa.on(function(o){
    console.log(this,o);
  });
```
`this` will be the DOM element that changed its state. The only argument passed is an `object` that contains informations about the positioning and the viability of the element.

### Options
```javascript
  options = {
    triggerSelector: '.js-animation-trigger',
    animationClass: 'is-shown',
    removeClasses: false
  };
```

#### triggerSelector
*default* '.js-animation-trigger'
defines the class of the elements that should be measured. Every time an element with this class will scroll in to visible range, the magic will happen.

#### activeClass
*default* 'is-shown'
defines the class that will be given to the visible elements that match the triggerSelector

#### removeClasses
*default* false
optionally the `activeClass` can be removed of the elements that are not visible anymore.


