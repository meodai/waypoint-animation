# waypoint-animation
know if a element on the page is in the visible scrollrange or not. Only works vertically for now.

### Installation

```
  bower install waypoint-animation
```

### Usage
By creating a new instance of WaypointAnimation, it will automatically add a class to elements that in the visible scroll range.

```javascript
  // create a new instance of WaypointAnimation
  wpa = new WaypointAnimation({removeClasses: true});
```

Callbacks can be registred, that are called every time an element becoms visible or invisible.

```javascript
  wpa.on(function(o){
    console.log(this,o);
  });
```
`this` will be concerned DOM element and the only argument passed is an `object` that contaibs informations about the positioning and the visbility of the lement.

### Options
```javascript
  options = {
    triggerSelector: '.js-animation-trigger',
    animationClass: 'is-shown',
    removeClasses: false
  };
```

#### triggerSelector
defines the class of the elements that should be mesured. Every time an element with this class will scroll in to visible range, the magic will hapen.

#### activeClass
defines the class that will be given to the visible elements

#### removeClasses
optionally the `activeClass` can be removed of the elements that are not visible anymore.


