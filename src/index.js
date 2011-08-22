/**
 * @namespace
 * Top-level namespace to stop namespace clutter.
 */
if(!window["com"]) {
  window["com"] = {};
}

// create pusher ns
if(!com.pusher) {
  com.pusher = {};
}

/**
 * Ensures that a namespace exists.
 * @param {String} namespace The namespace to check for and create if required.
 *
 * @return {Object} The existing or new namespace.
 */
com.pusher.namespace = function(namespace) {
  var parts = namespace.split(".");
  var context = window;
  var nsPath = "";
  for(var i = 0, l = parts.length; i < l; ++i) {
    var name = parts[i];
    if(!context[name]) {
      context[name] = {};
      context[name].__namespace = name;      
    }
    nsPath += name + ".";
    context = context[name];
    if(!context.__namespace) {
      context.__namespace = nsPath.substring(0, nsPath.length-1); // trim off '.'
    }
  }
  return context;
};

/**
 * Extend the subsclass with the superclass
 *
 * @param {Object} subclass The subclass to be extended.
 * @param {Object} supercalss The object to extend the subclass with.
 */
com.pusher.extend = function(subclass, superclass){
    var firstInheritance = true;

    // see if the base classes prototype is currently empty
    for (var x in subclass.prototype) {
        firstInheritance = false;
        break;
    }

    if (firstInheritance) {
        // single inheritance
        var intermediateClass = new Function();

        // instead of inheriting directly from the super class and causing the constructor to be fired with zero
        // arguments, we use an intermediate class with the same prototype as the super class so that the object
        // constructor is avoided altogether
        intermediateClass.prototype = superclass.prototype;
        subclass["prototype"] = new intermediateClass(); // don't use fSubClass.prototype to keep jsdoc happy
    }
    else {
        // multiple inheritance
        for (x in superclass.prototype) {
            subclass.prototype[x] = superclass.prototype[x];
        }
    }
};

// TODO: consider moving this to a utility method
if (typeof Function.prototype.scopedTo === 'undefined') {
  Function.prototype.scopedTo = function(context, args) {
    var f = this;
    return function() {
      return f.apply(context, Array.prototype.slice.call(args || [])
        .concat(Array.prototype.slice.call(arguments)));
    };
  };
}