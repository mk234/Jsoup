/*
 * Internet explorer generates pointer events by default for all input types like mouse, pen or touch (finger).
 * Touchr is generating touch events only for touch type by default but it can be overwritten by
 * window.Touchr_ALLOWED_POINTER_TYPE bitmask property. It can have values:
 * 1 for touch
 * 2 for mouse
 * 4 for pen
 * and their combinations.
 */

(function (window) {
    var IE_10 = !!window.navigator.msPointerEnabled,
        // Check below can mark as IE11+ also other browsers which implements pointer events in future
        // that is not issue, because touch capability is tested in IF statement bellow.
        IE_11_PLUS = !!window.navigator.pointerEnabled || !!window.PointerEvent;

    // Only pointer enabled browsers without touch capability.
    if (IE_10 || (IE_11_PLUS && !('ontouchstart' in window))) {
        var document = window.document,
            POINTER_DOWN = IE_11_PLUS ? "pointerdown" : "MSPointerDown",
            POINTER_UP = IE_11_PLUS ? "pointerup" : "MSPointerUp",
            POINTER_MOVE = IE_11_PLUS ? "pointermove" : "MSPointerMove",
            POINTER_TYPE_TOUCH = IE_11_PLUS ? "touch" : MSPointerEvent.MSPOINTER_TYPE_TOUCH,
            POINTER_TYPE_MOUSE = IE_11_PLUS ? "mouse" : MSPointerEvent.MSPOINTER_TYPE_MOUSE,
            POINTER_TYPE_PEN = IE_11_PLUS ? "pen" : MSPointerEvent.MSPOINTER_TYPE_PEN, //IE11+ has also unknown type which Touchr doesn't support
            GESTURE_START = "MSGestureStart",
            GESTURE_CHANGE = "MSGestureChange",
            GESTURE_END = "MSGestureEnd",
            TOUCH_ACTION = IE_11_PLUS ? "touchAction" : "msTouchAction",
            _180_OVER_PI = 180 / Math.PI,
            // Which pointer types will be used for generating touch events: 1 - touch, 2 - mouse, 4 - pen or their combination
            ALLOWED_POINTER_TYPE = window.Touchr_ALLOWED_POINTER_TYPE || 1,
            createEvent = function (eventName, target, params) {
                var k,
                    event = document.createEvent("Event");

                event.initEvent(eventName, true, true);
                for (k in params) {
                    event[k] = params[k];
                }
                target.dispatchEvent(event);
            },
            /**
             * ECMAScript 5 accessors to the rescue
             * @see http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
             */
            makeSubArray = (function () {
                var MAX_SIGNED_INT_VALUE = Math.pow(2, 32) - 1,
                    hasOwnProperty = Object.prototype.hasOwnProperty;

                function ToUint32(value) {
                    return value >>> 0;
                }

                function getMaxIndexProperty(object) {
                    var maxIndex = -1,
                        isValidProperty,
                        prop;

                    for (prop in object) {

                        isValidProperty = (
                            String(ToUint32(prop)) === prop &&
                            ToUint32(prop) !== MAX_SIGNED_INT_VALUE &&
                            hasOwnProperty.call(object, prop));

                        if (isValidProperty && prop > maxIndex) {
                            maxIndex = prop;
                        }
                    }
                    return maxIndex;
                }

                return function (methods) {
                    var length = 0;
                    methods = methods || {};

                    methods.length = {
                        get: function () {
                            var maxIndexProperty = +getMaxIndexProperty(this);
                            return Math.max(length, maxIndexProperty + 1);
                        },
                        set: function (value) {
                            var constrainedValue = ToUint32(value);
                            if (constrainedValue !== +value) {
                                throw new RangeError();
                            }
                            for (var i = constrainedValue, len = this.length; i < len; i++) {
                                delete this[i];
                            }
                            length = constrainedValue;
                        }
                    };
                    methods.toString = {
                        value: Array.prototype.join
                    };
                    return Object.create(Array.prototype, methods);
                };
            })(),
            // methods passed to TouchList closure method to extend Array
            touchListMethods = {
                /**
                 * Returns touch by id. This method fulfill the TouchList interface.
                 * @param {Number} id
                 * @returns {Touch}
                 */
                identifiedTouch: {
                    value: function (id) {
                        var length = this.length;
                        while (length--) {
                            if (this[length].identifier === id) return this[length];
                        }
                        return undefined;
                    }
                },
                /**
                 * Returns touch by index. This method fulfill the TouchList interface.
                 * @param {Number} index
                 * @returns {Touch}
                 */
                item: {
                    value: function (index) {
                        return this[index];
                    }
                },
                /**
                 * Returns touch index
                 * @param {Touch} touch
                 * @returns {Number}
                 */
                _touchIndex: {
                    value: function (touch) {
                        var length = this.length;
                        while (length--) {
                            if (this[length].pointerId == touch.pointerId) return length;
                        }
                        return -1;
                    }
                },

                /**
                 * Add all events and convert them to touches
                 * @param {Event[]} events
                 */
                _addAll: {
                    value: function (events) {
                        var i = 0,
                            length = events.length;

                        for (; i < length; i++) {
                            this._add(events[i]);
                        }
                    }
                },

                /**
                 * Add and MSPointer event and convert it to Touch like object
                 * @param {Event} event
                 */
                _add: {
                    value: function (event) {
                        var index = this._touchIndex(event);

                        index = index < 0 ? this.length : index;

                        //normalizing Pointer to Touch
                        event.type = POINTER_MOVE;
                        event.identifier = event.pointerId;
                        //in DOC is mentioned that it is 0..255 but actually it returns 0..1 value
                        //returns 0.5 for mouse down buttons in IE11, should it be issue?
                        event.force = event.pressure;
                        //default values for Touch which we cannot obtain from Pointer
                        event.radiusX = event.radiusY = 1;
                        event.rotationAngle = 0;

                        this[index] = event;
                    }
                },

                /**
                 * Removes an event from this touch list.
                 * @param {Event} event
                 */
                _remove: {
                    value: function (event) {
                        var index = this._touchIndex(event);

                        if (index >= 0) {
                            this.splice(index, 1);
                        }
                    }
                }
            },

            /**
             * This class store touches in an list which can be also accessible as array which is
             * little bit bad because TouchList have to extend Array. Because we are aiming on
             * IE10+ we can use ECMAScript5 solution.
             * @extends Array
             * @see http://www.w3.org/TR/2011/WD-touch-events-20110913/#touchlist-interface
             * @see https://developer.mozilla.org/en-US/docs/DOM/TouchList
             */
            TouchList = (function (methods) {
                return function () {
                    var arr = makeSubArray(methods);
                    if (arguments.length === 1) {
                        arr.length = arguments[0];
                    }
                    else {
                        arr.push.apply(arr, arguments);
                    }
                    return arr;
                };
            })(touchListMethods),

            /**
             * list of all touches running during life cycle
             * @type TouchList
             */
            generalTouchesHolder,

            /**
             * Storage of link between pointer {id} and original target
             * @type Object
             */
            pointerToTarget = {},

            /**
             * General gesture object which fires MSGesture events whenever any associated MSPointer event changed.
             */
            gesture = window.MSGesture ? new MSGesture() : null,

            gestureScale = 1,
            gestureRotation = 0,

            /**
             * Storage of targets and anonymous MSPointerStart handlers for later
             * unregistering
             * @type Array
             */
            attachedPointerStartMethods = [],

            /**
             * Checks if node is some of parent children or sub-children
             * @param {HTMLElement|Document} parent
             * @param {HTMLElement} node
             * @returns {Boolean}
             */
            checkSameTarget = function (parent, node) {
                if (node) {
                    if (parent === node) {
                        return true;
                    } else {
                        return checkSameTarget(parent, node.parentNode);
                    }
                } else {
                    return false;
                }
            },

            /**
             * Returns bitmask type of pointer to compare with allowed pointer types
             * @param {Number|String} pointerType
             * @returns {Number}
             */
            pointerTypeToBitmask = function (pointerType) {
                if (pointerType == POINTER_TYPE_TOUCH) {
                    return 1;
                } else if (pointerType == POINTER_TYPE_MOUSE) {
                    return 2;
                } else {
                    return 4;
                }
            },

            /**
             * Main function which is rewriting the MSPointer event to touch event
             * and preparing all the necessary lists of touches.
             * @param {Event} evt
             */
            pointerListener = function (evt) {
                var type,
                    i,
                    target = evt.target,
                    originalTarget,
                    changedTouches,
                    targetTouches;

                // Skip pointers which are not allowed by users:
                if (!(pointerTypeToBitmask(evt.pointerType) & ALLOWED_POINTER_TYPE)) {
                    return;
                }

                if (evt.type === POINTER_DOWN) {
                    generalTouchesHolder._add(evt);
                    pointerToTarget[evt.pointerId] = evt.target;

                    type = "touchstart";

                    // Fires MSGesture event when we have at least two pointers in our holder
                    // (adding pointers to gesture object immediately fires Gesture event)
                    if (generalTouchesHolder.length > 1) {
                        gesture.target = evt.target;
                        for (i = 0; i < generalTouchesHolder.length; i++) {
                            // Adds to gesture only touches
                            // It is not necessary to create separate gesture for mouse or pen pointers
                            // because they cannot be present more than by 1 pointer.
                            if (generalTouchesHolder[i].pointerType === POINTER_TYPE_TOUCH) {
                                gesture.addPointer(generalTouchesHolder[i].pointerId);
                            }
                        }
                    }
                }

                if (evt.type === POINTER_MOVE && generalTouchesHolder.identifiedTouch(evt.pointerId)) {
                    generalTouchesHolder._add(evt);

                    type = "touchmove";
                }

                //Preparation of touch lists have to be done before pointerup/MSPointerUp where we delete some information

                //Which touch fired this event, because we know that MSPointer event is fired for every
                //changed pointer than we create a list only with actual pointer
                changedTouches = document.createTouchList(evt);
                //Target touches is list of touches which started on (touchstart) on target element, they
                //are in this array even if these touches have coordinates outside target elements
                targetTouches = document.createTouchList();
                for (i = 0; i < generalTouchesHolder.length; i++) {
                    //targetTouches._add(generalTouchesHolder[i]);
                    //check if the pointerTarget is in the target
                    if (checkSameTarget(target, pointerToTarget[generalTouchesHolder[i].identifier])) {
                        targetTouches._add(generalTouchesHolder[i]);
                    }
                }
                originalTarget = pointerToTarget[evt.pointerId];

                if (evt.type === POINTER_UP) {
                    generalTouchesHolder._remove(evt);
                    pointerToTarget[evt.pointerId] = null;

                    delete pointerToTarget[evt.pointerId];
                    type = "touchend";

                    // Fires MSGestureEnd event when there is only one ore zero touches:
                    if (generalTouchesHolder.length <= 1) {
                        gesture.stop();
                    }
                }

                //console.log("+", evt.type, evt.pointerType, generalTouchesHolder.length, evt.target.nodeName+"#"+evt.target.id);
                if (type && originalTarget) {
                    createEvent(type, originalTarget, {
                        touches: generalTouchesHolder,
                        changedTouches: changedTouches,
                        targetTouches: targetTouches
                    });
                }
            },

            /**
             * Main function which is rewriting the MSGesture event to gesture event.
             * @param {Event} evt
             */
            gestureListener = function (evt) {
                //TODO: check first, other than IE (FF?), browser which implements pointer events how to make gestures from pointers. Maybe it would be mix of pointer/gesture events.
                var type, scale, rotation;
                if (evt.type === GESTURE_START) {
                    type = "gesturestart"
                }
                else if (evt.type === GESTURE_CHANGE) {
                    type = "gesturechange"
                }
                else if (evt.type === GESTURE_END) {
                    type = "gestureend"
                }

                // -------- SCALE ---------
                //MSGesture:
                //Scale values represent the difference in scale from the last MSGestureEvent that was fired.
                //Apple:
                //The distance between two fingers since the start of an event, as a multiplier of the initial distance. The initial value is 1.0.

                // ------- ROTATION -------
                //MSGesture:
                //Clockwise rotation of the cursor around its own major axis expressed as a value in radians from the last MSGestureEvent of the interaction.
                //Apple:
                //The delta rotation since the start of an event, in degrees, where clockwise is positive and counter-clockwise is negative. The initial value is 0.0
                if (evt.type === GESTURE_START) {
                    scale = gestureScale = 1;
                    rotation = gestureRotation = 0;
                } else {
                    scale = gestureScale = gestureScale + (evt.scale - 1); //* evt.scale;
                    rotation = gestureRotation = gestureRotation + evt.rotation * _180_OVER_PI;
                }

                createEvent(type, evt.target, {
                    scale: scale,
                    rotation: rotation,
                    screenX: evt.screenX,
                    screenY: evt.screenY
                });
            },

            /**
             * This method augments event listener methods on given class to call
             * our own method which attach/detach the MSPointer events handlers
             * when user tries to attach touch events.
             * @param {Function} elementClass Element class like HTMLElement or Document
             */
            augmentEventListener = function (elementClass) {
                var customAddEventListener = attachTouchEvents,
                    customRemoveEventListener = removeTouchEvents,
                    oldAddEventListener = elementClass.prototype.addEventListener,
                    oldRemoveEventListener = elementClass.prototype.removeEventListener;

                elementClass.prototype.addEventListener = function (type, listener, useCapture) {
                    //"this" is HTML element
                    if ((type.indexOf("gesture") === 0 || type.indexOf("touch") === 0)) {
                        customAddEventListener.call(this, type, listener, useCapture);
                    }
                    oldAddEventListener.call(this, type, listener, useCapture);
                };

                elementClass.prototype.removeEventListener = function (type, listener, useCapture) {
                    if ((type.indexOf("gesture") === 0 || type.indexOf("touch") === 0)) {
                        customRemoveEventListener.call(this, type, listener, useCapture);
                    }
                    oldRemoveEventListener.call(this, type, listener, useCapture);
                };
            },
            /**
             * This method attach event handler for MSPointer / MSGesture events when user
             * tries to attach touch / gesture events.
             * @param {String} type
             * @param {Function} listener
             * @param {Boolean} useCapture
             */
            attachTouchEvents = function (type, listener, useCapture) {
                //element owner document or document itself
                var doc = this.nodeType == 9 ? this : this.ownerDocument;

                // Because we are listening only on document, it is not necessary to
                // attach events on one document more times
                if (attachedPointerStartMethods.indexOf(doc) < 0) {
                    //TODO: reference on node, listen on DOM removal to clean the ref?
                    attachedPointerStartMethods.push(doc);
                    doc.addEventListener(POINTER_DOWN, pointerListener, useCapture);
                    doc.addEventListener(POINTER_MOVE, pointerListener, useCapture);
                    doc.addEventListener(POINTER_UP, pointerListener, useCapture);
                    doc.addEventListener(GESTURE_START, gestureListener, useCapture);
                    doc.addEventListener(GESTURE_CHANGE, gestureListener, useCapture);
                    doc.addEventListener(GESTURE_END, gestureListener, useCapture);
                }

                // e.g. Document has no style
                if (this.style && (typeof this.style[TOUCH_ACTION] == "undefined" || !this.style[TOUCH_ACTION])) {
                    this.style[TOUCH_ACTION] = "none";
                }
            },
            /**
             * This method detach event handler for MSPointer / MSGesture events when user
             * tries to detach touch / gesture events.
             * @param {String} type
             * @param {Function} listener
             * @param {Boolean} useCapture
             */
            removeTouchEvents = function (type, listener, useCapture) {
                //todo: are we able to understand when all listeners are unregistered and shall be removed?
            };


        /*
		 * Adding DocumentTouch interface
		 * @see http://www.w3.org/TR/2011/WD-touch-events-20110505/#idl-def-DocumentTouch
		 */

        /**
         * Create touches list from array or touches or given touch
         * @param {Touch[]|Touch} touches
         * @returns {TouchList}
         */
        document.createTouchList = function (touches) {
            var touchList = new TouchList();
            if (touches) {
                if (touches.length) {
                    touchList._addAll(touches);
                } else {
                    touchList._add(touches);
                }
            }
            return touchList;
        };

        /*******  Fakes which persuade other code to use touch events ********/

        /**
         * AbstractView is class for document.defaultView === window
         * @param {AbstractView} view
         * @param {EventTarget} target
         * @param {Number} identifier
         * @param {Number} pageX
         * @param {Number} pageY
         * @param {Number} screenX
         * @param {Number} screenY
         * @return {Touch}
         */
        document.createTouch = function (view, target, identifier, pageX, pageY, screenX, screenY) {
            return {
                identifier: identifier,
                screenX: screenX,
                screenY: screenY,
                //clientX: clientX,
                //clientY: clientY,
                pageX: pageX,
                pageY: pageY,
                target: target
            };
        };
        //Fake Modernizer touch test
        //http://modernizr.github.com/Modernizr/touch.html
        if (!window.ontouchstart) window.ontouchstart = 1;

        /*******  End of fakes ***********************************/

        generalTouchesHolder = document.createTouchList();

        // Overriding HTMLElement and HTMLDocument to hand over touch handler to MSPointer event handler
        augmentEventListener(HTMLElement);
        augmentEventListener(Document);
    }
}(window));
var JAK = {
    NAME: "JAK", _idCnt: 0, idGenerator: function () {
        this._idCnt = 1E7 > this._idCnt ? this._idCnt : 0;
        var a = "m" + (new Date).getTime().toString(16) + "m" + this._idCnt.toString(16);
        this._idCnt++;
        return a
    }
};
String.prototype.lpad = function (a, b) {
    for (var c = a || "0", d = b || 2, e = ""; e.length < d - this.length;) e += c;
    e = e.substring(0, d - this.length);
    return e + this.toString()
};
String.prototype.rpad = function (a, b) {
    for (var c = a || "0", d = b || 2, e = ""; e.length < d - this.length;) e += c;
    e = e.substring(0, d - this.length);
    return this.toString() + e
};
String.prototype.CS_ALPHABET = "0123456789A\u00c1BC\u010cD\u010eE\u011a\u00c9FGHCHI\u00cdJKLMN\u0147O\u00d3PQR\u0158S\u0160T\u0164U\u00da\u016eVWXY\u00ddZ\u017da\u00e1bc\u010dd\u010fe\u011b\u00e9fghchi\u00edjklmn\u0148o\u00f3pqr\u0159s\u0161t\u0165u\u00fa\u016fvwxy\u00fdz\u017e";
String.prototype.localeCSCompare = function (a) {
    a += "";
    if (this + "" === a) return 0;
    if (this.length < a.length) return -a.localeCSCompare(this);
    for (var b = 0, c = 0, d = a.length, e = "", f = "", g = 0, h = 0; b < d;) {
        e = a.charAt(b);
        f = this.charAt(c);
        "c" == f.toLowerCase() && (g = this.substring(c, c + 2), "ch" == g || "CH" == g) && (c++, f = g);
        "c" == e.toLowerCase() && (g = a.substring(b, b + 2), "ch" == g || "CH" == g) && (b++, e = g);
        g = this.CS_ALPHABET.indexOf(e);
        h = this.CS_ALPHABET.indexOf(f);
        if (e != f) break;
        b++;
        c++
    }
    return b == d ? 1 : g == h ? f.localeCompare(e) : -1 == h ? -1 : -1 == g ? 1 : h - g
};
Date.prototype.toISOString || function () {
    function a(a) {
        a = String(a);
        1 === a.length && (a = "0" + a);
        return a
    }

    Date.prototype.toISOString = function () {
        return this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "." + String((this.getUTCMilliseconds() / 1E3).toFixed(3)).slice(2, 5) + "Z"
    }
}();
Date.prototype._dayNames = "Pond\u011bl\u00ed \u00dater\u00fd St\u0159eda \u010ctvrtek P\u00e1tek Sobota Ned\u011ble".split(" ");
Date.prototype._dayNamesShort = "Po \u00dat St \u010ct P\u00e1 So Ne".split(" ");
Date.prototype._monthNames = "Leden \u00danor B\u0159ezen Duben Kv\u011bten \u010cerven \u010cervenec Srpen Z\u00e1\u0159\u00ed \u0158\u00edjen Listopad Prosinec".split(" ");
Date.prototype._monthNamesShort = "Led \u00dano B\u0159e Dub Kv\u011b \u010cer \u010crc Srp Z\u00e1\u0159 \u0158\u00edj Lis Pro".split(" ");
Date.prototype.format = function (a) {
    for (var b = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    }, c = "", d = !1, e = 0; e < a.length; e++) {
        var f = a.charAt(e);
        if (d) d = !1, c += f; else switch (f) {
            case "\\":
                d ? (d = !1, c += f) : d = !0;
                break;
            case "d":
                c += this.getDate().toString().lpad();
                break;
            case "j":
                c += this.getDate();
                break;
            case "w":
                c += this.getDay();
                break;
            case "N":
                c += this.getDay() || 7;
                break;
            case "S":
                f = this.getDate();
                c += b[f] || "th";
                break;
            case "D":
                c += this._dayNamesShort[(this.getDay() || 7) - 1];
                break;
            case "l":
                c += this._dayNames[(this.getDay() ||
                    7) - 1];
                break;
            case "z":
                var g = this.getTime(), f = new Date(g);
                f.setDate(1);
                f.setMonth(0);
                f = g - f.getTime();
                c += f / 864E5;
                break;
            case "W":
                var f = new Date(this.getFullYear(), this.getMonth(), this.getDate()), h = f.getDay() || 7;
                f.setDate(f.getDate() + (4 - h));
                g = f.getFullYear();
                h = Math.floor((f.getTime() - (new Date(g, 0, 1, -6)).getTime()) / 864E5);
                c += (1 + Math.floor(h / 7)).toString().lpad();
                break;
            case "m":
                c += (this.getMonth() + 1).toString().lpad();
                break;
            case "n":
                c += this.getMonth() + 1;
                break;
            case "M":
                c += this._monthNamesShort[this.getMonth()];
                break;
            case "F":
                c += this._monthNames[this.getMonth()];
                break;
            case "t":
                var g = this.getTime(), k = this.getMonth(), f = new Date(g);
                do h = f.getDate(), g += 864E5, f = new Date(g); while (k == f.getMonth());
                c += h;
                break;
            case "L":
                f = new Date(this.getTime());
                f.setDate(1);
                f.setMonth(1);
                f.setDate(29);
                c += 1 == f.getMonth() ? "1" : "0";
                break;
            case "Y":
                c += this.getFullYear().toString().lpad();
                break;
            case "y":
                c += this.getFullYear().toString().lpad().substring(2);
                break;
            case "a":
                c += 12 > this.getHours() ? "am" : "pm";
                break;
            case "A":
                c += 12 > this.getHours() ?
                    "AM" : "PM";
                break;
            case "G":
                c += this.getHours();
                break;
            case "H":
                c += this.getHours().toString().lpad();
                break;
            case "g":
                c += this.getHours() % 12;
                break;
            case "h":
                c += (this.getHours() % 12).toString().lpad();
                break;
            case "i":
                c += this.getMinutes().toString().lpad();
                break;
            case "s":
                c += this.getSeconds().toString().lpad();
                break;
            case "Z":
                c += -60 * this.getTimezoneOffset();
                break;
            case "O":
            case "P":
                g = this.getTimezoneOffset() / -60;
                h = Math.abs(g).toString().lpad();
                "P" == f && (h += ":");
                h += "00";
                c += (0 <= g ? "+" : "-") + h;
                break;
            case "U":
                c += this.getTime() /
                    1E3;
                break;
            case "u":
                c += "0";
                break;
            case "c":
                c += arguments.callee.call(this, "Y-m-d") + "T" + arguments.callee.call(this, "H:i:sP");
                break;
            case "r":
                c += arguments.callee.call(this, "D, j M Y H:i:s O");
                break;
            default:
                c += f
        }
    }
    return c
};
Function.prototype.bind || (Function.prototype.bind = function (a) {
    var b = this, c = Array.prototype.slice.call(arguments, 1);
    return function () {
        return b.apply(a, c.concat(Array.prototype.slice.call(arguments)))
    }
});
Date.now || (Date.now = function () {
    return +new Date
});
String.prototype.trim = function () {
    return this.match(/^\s*([\s\S]*?)\s*$/)[1]
};
String.trim || (String.trim = function (a) {
    return String.prototype.trim.call(a)
});
Object.create || (Object.create = function () {
    function a() {
    }

    var b = Object.prototype.hasOwnProperty;
    return function (c) {
        if ("object" != typeof c) throw TypeError("Object prototype may only be an Object or null");
        a.prototype = c;
        var d = new a;
        a.prototype = null;
        if (1 < arguments.length) {
            var e = Object(arguments[1]), f;
            for (f in e) b.call(e, f) && (d[f] = e[f])
        }
        return d
    }
}());
Object.keys || (Object.keys = function () {
    var a = Object.prototype.hasOwnProperty, b = !{toString: null}.propertyIsEnumerable("toString"),
        c = "toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "),
        d = c.length;
    return function (e) {
        if ("object" !== typeof e && ("function" !== typeof e || null === e)) throw new TypeError("Object.keys called on non-object");
        var f = [], g;
        for (g in e) a.call(e, g) && f.push(g);
        if (b) for (g = 0; g < d; g++) a.call(e, c[g]) && f.push(c[g]);
        return f
    }
}());
Array.isArray || (Array.isArray = function (a) {
    return "[object Array]" === Object.prototype.toString.call(a)
});
"function" !== typeof Array.prototype.reduce && (Array.prototype.reduce = function (a, b) {
    if (null === this || "undefined" === typeof this) throw new TypeError("Array.prototype.reduce called on null or undefined");
    if ("function" !== typeof a) throw new TypeError(a + " is not a function");
    var c, d, e = this.length >>> 0, f = !1;
    1 < arguments.length && (d = b, f = !0);
    for (c = 0; e > c; ++c) this.hasOwnProperty(c) && (f ? d = a(d, this[c], c, this) : (d = this[c], f = !0));
    if (!f) throw new TypeError("Reduce of empty array with no initial value");
    return d
});
"function" !== typeof Array.prototype.reduceRight && (Array.prototype.reduceRight = function (a, b) {
    if (null === this || "undefined" === typeof this) throw new TypeError("Array.prototype.reduceRight called on null or undefined");
    if ("function" !== typeof a) throw new TypeError(a + " is not a function");
    var c, d;
    c = this.length >>> 0;
    var e = !1;
    1 < arguments.length && (d = b, e = !0);
    for (c -= 1; -1 < c; --c) this.hasOwnProperty(c) || (e ? d = a(d, this[c], c, this) : (d = this[c], e = !0));
    if (!e) throw new TypeError("Reduce of empty array with no initial value");
    return d
});
Array.prototype.indexOf || (Array.prototype.indexOf = function (a, b) {
    var c = this.length, d = b || 0;
    for (0 > d && (d += c); d < c; d++) if (d in this && this[d] === a) return d;
    return -1
});
Array.indexOf || (Array.indexOf = function (a, b, c) {
    return Array.prototype.indexOf.call(a, b, c)
});
Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (a, b) {
    var c = this.length, d = void 0 === b ? c - 1 : b;
    for (0 > d && (d += c); -1 < d; d--) if (d in this && this[d] === a) return d;
    return -1
});
Array.lastIndexOf || (Array.lastIndexOf = function (a, b, c) {
    return 2 < arguments.length ? Array.prototype.lastIndexOf.call(a, b, c) : Array.prototype.lastIndexOf.call(a, b)
});
Array.prototype.forEach || (Array.prototype.forEach = function (a, b) {
    for (var c = this.length, d = 0; d < c; d++) d in this && a.call(b, this[d], d, this)
});
Array.forEach || (Array.forEach = function (a, b, c) {
    Array.prototype.forEach.call(a, b, c)
});
Array.prototype.every || (Array.prototype.every = function (a, b) {
    for (var c = this.length, d = 0; d < c; d++) if (d in this && !a.call(b, this[d], d, this)) return !1;
    return !0
});
Array.every || (Array.every = function (a, b, c) {
    return Array.prototype.every.call(a, b, c)
});
Array.prototype.some || (Array.prototype.some = function (a, b) {
    for (var c = this.length, d = 0; d < c; d++) if (d in this && a.call(b, this[d], d, this)) return !0;
    return !1
});
Array.some || (Array.some = function (a, b, c) {
    return Array.prototype.some.call(a, b, c)
});
Array.prototype.map || (Array.prototype.map = function (a, b) {
    for (var c = this.length, d = Array(c), e = 0; e < c; e++) e in this && (d[e] = a.call(b, this[e], e, this));
    return d
});
Array.map || (Array.map = function (a, b, c) {
    return Array.prototype.map.call(a, b, c)
});
Array.prototype.filter || (Array.prototype.filter = function (a, b) {
    for (var c = this.length, d = [], e = 0; e < c; e++) if (e in this) {
        var f = this[e];
        a.call(b, f, e, this) && d.push(f)
    }
    return d
});
Array.filter || (Array.filter = function (a, b, c) {
    return Array.prototype.filter.call(a, b, c)
});
"document" in self && ("classList" in document.createElement("_") && (!document.createElementNS || "classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")) || function (a) {
    if ("Element" in a) {
        a = a.Element.prototype;
        var b = Object, c = String.prototype.trim || function () {
            return this.replace(/^\s+|\s+$/g, "")
        }, d = Array.prototype.indexOf || function (a) {
            for (var b = 0, c = this.length; b < c; b++) if (b in this && this[b] === a) return b;
            return -1
        }, e = function (a, b) {
            this.name = a;
            this.code = DOMException[a];
            this.message = b
        }, f = function (a,
                         b) {
            if ("" === b) throw new e("SYNTAX_ERR", "An invalid or illegal string was specified");
            if (/\s/.test(b)) throw new e("INVALID_CHARACTER_ERR", "String contains an invalid character");
            return d.call(a, b)
        }, g = function (a) {
            for (var b = c.call(a.getAttribute("class") || ""), b = b ? b.split(/\s+/) : [], d = 0, e = b.length; d < e; d++) this.push(b[d]);
            this._updateClassName = function () {
                a.setAttribute("class", this.toString())
            }
        }, h = g.prototype = [], k = function () {
            return new g(this)
        };
        e.prototype = Error.prototype;
        h.item = function (a) {
            return this[a] ||
                null
        };
        h.contains = function (a) {
            return -1 !== f(this, a + "")
        };
        h.add = function () {
            var a = arguments, b = 0, c = a.length, d, e = !1;
            do d = a[b] + "", -1 === f(this, d) && (this.push(d), e = !0); while (++b < c);
            e && this._updateClassName()
        };
        h.remove = function () {
            var a = arguments, b = 0, c = a.length, d, e = !1, g;
            do for (d = a[b] + "", g = f(this, d); -1 !== g;) this.splice(g, 1), e = !0, g = f(this, d); while (++b < c);
            e && this._updateClassName()
        };
        h.toggle = function (a, b) {
            a += "";
            var c = this.contains(a), d = c ? !0 !== b && "remove" : !1 !== b && "add";
            if (d) this[d](a);
            return !0 === b || !1 === b ? b : !c
        };
        h.toString = function () {
            return this.join(" ")
        };
        if (b.defineProperty) {
            h = {get: k, enumerable: !0, configurable: !0};
            try {
                b.defineProperty(a, "classList", h)
            } catch (l) {
                if (void 0 === l.number || -2146823252 === l.number) h.enumerable = !1, b.defineProperty(a, "classList", h)
            }
        } else b.prototype.__defineGetter__ && a.__defineGetter__("classList", k)
    }
}(self), function () {
    var a = document.createElement("_");
    a.classList.add("c1", "c2");
    if (!a.classList.contains("c2")) {
        var b = function (a) {
            var b = DOMTokenList.prototype[a];
            DOMTokenList.prototype[a] =
                function (a) {
                    var c, d = arguments.length;
                    for (c = 0; c < d; c++) a = arguments[c], b.call(this, a)
                }
        };
        b("add");
        b("remove")
    }
    a.classList.toggle("c3", !1);
    if (a.classList.contains("c3")) {
        var c = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.toggle = function (a, b) {
            return 1 in arguments && !this.contains(a) === !b ? b : c.call(this, a)
        }
    }
    a = null
}());
JAK.ClassMaker = {};
JAK.ClassMaker.VERSION = "5.1";
JAK.ClassMaker.NAME = "JAK.ClassMaker";
JAK.ClassMaker.makeClass = function (a) {
    a = this._makeDefaultParams(a);
    return this._addConstructorProperties(function () {
        if (this.$constructor) return this.$constructor.apply(this, arguments)
    }, a)
};
JAK.ClassMaker.makeSingleton = function (a) {
    a = this._makeDefaultParams(a);
    var b = function () {
        throw Error("Cannot instantiate singleton class");
    };
    b._instance = null;
    b.getInstance = this._getInstance;
    return this._addConstructorProperties(b, a)
};
JAK.ClassMaker.makeInterface = function (a) {
    a = this._makeDefaultParams(a);
    return this._addConstructorProperties(function () {
        throw Error("Cannot instantiate interface");
    }, a)
};
JAK.ClassMaker.makeStatic = function (a) {
    a = this._makeDefaultParams(a);
    var b = {};
    b.VERSION = a.VERSION;
    b.NAME = a.NAME;
    return b
};
JAK.ClassMaker._makeDefaultParams = function (a) {
    if ("EXTEND" in a) {
        if (!a.EXTEND) throw Error("Cannot extend non-exist class");
        if ("function" != typeof a.EXTEND) throw Error("Cannot extend non-function");
        if (!("NAME" in a.EXTEND)) throw Error("Cannot extend non-JAK class");
    }
    a.NAME = a.NAME || !1;
    a.VERSION = a.VERSION || "1.0";
    a.EXTEND = a.EXTEND || !1;
    a.IMPLEMENT = a.IMPLEMENT || [];
    a.DEPEND = a.DEPEND || [];
    a.IMPLEMENT instanceof Array || (a.IMPLEMENT = [a.IMPLEMENT]);
    this._preMakeTests(a);
    return a
};
JAK.ClassMaker._preMakeTests = function (a) {
    if (!a.NAME) throw Error("No NAME passed to JAK.ClassMaker.makeClass()");
    var b = !1;
    if (b = this._testDepend(a.DEPEND)) throw Error("Dependency error in class " + a.NAME + " (" + b + ")");
};
JAK.ClassMaker._addConstructorProperties = function (a, b) {
    for (var c in b) a[c] = b[c];
    this._setInheritance(a);
    a.prototype.constructor = a;
    a.prototype.$super = this._$super;
    return a
};
JAK.ClassMaker._getInstance = function () {
    this._instance || (this._instance = Object.create(this.prototype), "$constructor" in this.prototype && this._instance.$constructor());
    return this._instance
};
JAK.ClassMaker._setInheritance = function (a) {
    a.EXTEND && this._makeInheritance(a, a.EXTEND);
    for (var b = 0; b < a.IMPLEMENT.length; b++) this._makeInheritance(a, a.IMPLEMENT[b], !0)
};
JAK.ClassMaker._makeInheritance = function (a, b, c) {
    for (var d in b.prototype) {
        var e = b.prototype[d];
        "function" != typeof e || e.owner || (e.owner = b)
    }
    if (c) for (d in b.prototype) a.prototype[d] = "object" == typeof b.prototype[d] ? JSON.parse(JSON.stringify(b.prototype[d])) : b.prototype[d]; else for (d in a.prototype = Object.create(b.prototype), b.prototype) "object" == typeof b.prototype[d] && (a.prototype[d] = JSON.parse(JSON.stringify(b.prototype[d])))
};
JAK.ClassMaker._testDepend = function (a) {
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if (!c.sClass) return "Unsatisfied dependency";
        if (!c.ver) return "Version not specified in dependency";
        var d = c.sClass.VERSION.split(".")[0], e = c.ver.split(".")[0];
        if (d != e) return "Version conflict in " + c.sClass.NAME
    }
    return !1
};
JAK.ClassMaker._$super = function () {
    var a = arguments.callee.caller;
    if (!a) throw Error("Function.prototype.caller not supported");
    var b = a.owner || this.constructor, c = !1, d;
    for (d in b.prototype) if (b.prototype[d] == a) {
        c = d;
        break
    }
    if (!c) throw Error("Cannot find supplied method in constructor");
    a = b.EXTEND;
    if (!a) throw Error("No super-class available");
    if (!a.prototype[c]) throw Error("Super-class doesn't have method '" + c + "'");
    return a.prototype[c].apply(this, arguments)
};
JAK.Events = JAK.ClassMaker.makeStatic({NAME: "JAK.Events", VERSION: "3.3"});
JAK.Events._events = {};
JAK.Events._domReadyCallbacks = [];
JAK.Events.onDomReady = function (a, b) {
    var c = "function" == typeof b ? b : a[b];
    a && (c = c.bind(a));
    if ("complete" == document.readyState) return setTimeout(c, 0);
    this._domReadyCallbacks.length || document.addEventListener("DOMContentLoaded", function () {
        for (; this._domReadyCallbacks.length;) this._domReadyCallbacks.shift()()
    }.bind(this), !1);
    this._domReadyCallbacks.push(c)
};
JAK.Events.addListener = function (a, b, c, d, e) {
    c = c || window;
    e = e || !1;
    var f = JAK.idGenerator(), g = c;
    if (d) if ("string" == typeof d) {
        if ("function" != typeof c[d]) throw Error("Events.addListener: arguments[3] must be method of arguments[2]");
        g = function (b) {
            c[d](b, a, f)
        }
    } else g = function (b) {
        d.call(c, b, a, f)
    }; else "function" == typeof c ? g = function (b) {
        c(b, a, f)
    } : document.addEventListener || (g = function (b) {
        b.currentTarget = a;
        c.handleEvent(b)
    });
    this._addListener(a, b, g, e);
    this._events[f] = {elm: a, type: b, action: g, capture: e};
    return f
};
JAK.Events._addListener = function (a, b, c, d) {
    b = b.split(" ");
    for (var e = 0; e < b.length; e++) {
        var f = b[e];
        a.addEventListener ? a.addEventListener(f, c, d) : a.attachEvent("on" + f, c)
    }
};
JAK.Events.removeListener = function (a) {
    if (!(a in this._events)) throw Error("Cannot remove non-existent event ID '" + a + "'");
    var b = this._events[a];
    this._removeListener(b.elm, b.type, b.action, b.capture);
    delete this._events[a]
};
JAK.Events._removeListener = function (a, b, c, d) {
    b = b.split(" ");
    for (var e = 0; e < b.length; e++) {
        var f = b[e];
        a.removeEventListener ? a.removeEventListener(f, c, d) : a.detachEvent("on" + f, c)
    }
};
JAK.Events.removeListeners = function (a) {
    for (; a.length;) this.removeListener(a.shift())
};
JAK.Events.removeAllListeners = function () {
    for (var a in this._events) this.removeListener(a)
};
JAK.Events.stopEvent = function (a) {
    a = a || window.event;
    a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
};
JAK.Events.cancelDef = function (a) {
    a = a || window.event;
    a.preventDefault ? a.preventDefault() : a.returnValue = !1
};
JAK.Events.getTarget = function (a) {
    a = a || window.event;
    return a.target || a.srcElement
};
JAK.Browser = JAK.ClassMaker.makeStatic({NAME: "JAK.Browser", VERSION: "3.0"});
JAK.Browser.platform = "";
JAK.Browser.client = "";
JAK.Browser.version = 0;
JAK.Browser.agent = "";
JAK.Browser.mouse = {};
this.ieCompatibilityView = !1;
JAK.Browser._getPlatform = function () {
    return -1 != this._agent.indexOf("Windows Phone") ? "wph" : -1 != this._agent.indexOf("iPhone") || -1 != this._agent.indexOf("iPod") || -1 != this._agent.indexOf("iPad") ? "ios" : -1 != this._agent.indexOf("Android") ? "and" : -1 != this._agent.indexOf("X11") || -1 != this._agent.indexOf("Linux") ? "nix" : -1 != this._agent.indexOf("Mac") ? "mac" : -1 != this._agent.indexOf("Win") ? "win" : "oth"
};
JAK.Browser._getClient = function () {
    return window.opera ? "opera" : -1 != this._agent.indexOf("Edge") ? "edge" : window.chrome ? "chrome" : "all" in document && "systemLanguage" in navigator ? "ie" : document.getAnonymousElementByAttribute || "mozPaintCount" in window ? "gecko" : -1 != this._agent.indexOf("KHTML") ? "KDE" == this._vendor ? "konqueror" : -1 != this._vendor.indexOf("Apple") ? "safari" : "oth" : "oth"
};
JAK.Browser._getMouse = function () {
    return "ie" == JAK.Browser.client && 9 > parseFloat(JAK.Browser.version) ? {
        left: 1,
        middle: 4,
        right: 2
    } : {left: 0, middle: 1, right: 2}
};
JAK.Browser._getVersion = function () {
    var a = "_get_" + this.client + "_ver";
    return "function" == typeof this[a] ? this[a]() : "0"
};
JAK.Browser._get_ie_ver = function () {
    return Function.prototype.call ? !window.ActiveXObject && "ActiveXObject" in window ? "11" : "draggable" in document.createElement("div") ? "10" : document.addEventListener ? "9" : "[object JSON]" === Object.prototype.toString.call(window.JSON) ? "8" : window.XMLHttpRequest ? "7" : "object" == typeof document.doctype ? "6" : "5.5" : "5.0"
};
JAK.Browser._get_opera_ver = function () {
    return window.opera.version ? window.opera.version() : document.createComment ? "7" : "6"
};
JAK.Browser._get_gecko_ver = function () {
    return "textOverflow" in document.createElement("div").style ? "7" : window.EventSource ? "6" : "onloadend" in new XMLHttpRequest ? "5" : history.pushState ? "4" : void 0 === document.getBoxObjectFor ? "3.6" : navigator.geolocation ? "3.5" : document.getElementsByClassName ? "3" : window.external ? "2" : "1.5"
};
JAK.Browser._get_konqueror_ver = function () {
    var a = this._agent.indexOf("KHTML") + 6, a = this._agent.substring(a), b = a.indexOf(" ");
    return a.substring(0, b - 2)
};
JAK.Browser._get_safari_ver = function () {
    var a = this._agent.match(/version\/([0-9]+)/i);
    return a ? a[1] : "3"
};
JAK.Browser._get_chrome_ver = function () {
    var a = this._agent.match(/Chrome\/([0-9]+)/i);
    return a ? a[1] : null
};
JAK.Browser.isOld = function () {
    if ("ie" == this.client && 7 >= parseFloat(this.version) || "opera" == this.client && 9.5 > parseFloat(this.version) || "gecko" == this.client && 2 > parseFloat(this.version) || "konqueror" == this.client && 3.5 > parseFloat(this.version) || !document.documentElement || !document.documentElement.addEventListener && !document.documentElement.attachEvent) return !0;
    var a = function () {
    };
    return a.call && a.apply ? !1 : !0
};
JAK.Browser._testIeCompatibilityView = function (a, b) {
    return "ie" == a && b.match(/Trident\/([4-9])/) ? -1 < b.indexOf("MSIE 7.0") : !1
};
JAK.Browser.getBrowser = function () {
    this._agent = this.agent = navigator.userAgent;
    this._platform = navigator.platform;
    this._vendor = navigator.vendor;
    this.platform = this._getPlatform();
    this.client = this._getClient();
    this.version = this._getVersion();
    this.mouse = this._getMouse();
    this.ieCompatibilityView = this._testIeCompatibilityView(this.client, this._agent)
};
JAK.Browser.getBrowser();
JAK.DOM = JAK.ClassMaker.makeStatic({NAME: "JAK.DOM", VERSION: "5.0"});
JAK.cel = function (a, b, c, d) {
    a = (d || document).createElement(a);
    b && (a.className = b);
    c && (a.id = c);
    return a
};
JAK.mel = function (a, b, c, d) {
    a = (d || document).createElement(a);
    if (b) for (var e in b) a[e] = b[e];
    c && JAK.DOM.setStyle(a, c);
    return a
};
JAK.ctext = function (a, b) {
    return (b || document).createTextNode(a)
};
JAK.gel = function (a, b) {
    var c = b || document;
    return "string" == typeof a ? c.getElementById(a) : a
};
JAK.query = function (a, b) {
    for (var c = (b || document).querySelectorAll(a), d = Array(c.length), e = 0; e < c.length; e++) d[e] = c[e];
    return d
};
JAK.DOM.append = function () {
    for (var a = 0; a < arguments.length; a++) for (var b = arguments[a], c = b[0], d = 1; d < b.length; d++) c.appendChild(b[d])
};
JAK.DOM.hasClass = function (a, b) {
    return a.classList.contains(b)
};
JAK.DOM.addClass = function (a, b) {
    b.split(" ").forEach(function (b) {
        a.classList.add(b)
    })
};
JAK.DOM.removeClass = function (a, b) {
    a.classList.remove(b)
};
JAK.DOM.clear = function (a) {
    for (; a.firstChild;) a.removeChild(a.firstChild)
};
JAK.DOM.getDocSize = function () {
    var a = 0, b = 0;
    if ("BackCompat" != document.compatMode) {
        if (document.documentElement.clientWidth && "opera" != JAK.Browser.client ? (a = document.documentElement.clientWidth, b = document.documentElement.clientHeight) : "opera" == JAK.Browser.client && (9.5 > parseFloat(JAK.Browser.version) ? (a = document.body.clientWidth, b = document.body.clientHeight) : (a = document.documentElement.clientWidth, b = document.documentElement.clientHeight)), "safari" == JAK.Browser.client || "konqueror" == JAK.Browser.client) b =
            window.innerHeight
    } else a = document.body.clientWidth, b = document.body.clientHeight;
    return {width: a, height: b}
};
JAK.DOM.getBoxPosition = function (a, b) {
    var c = 0, d = 0, e = b || a.ownerDocument.body;
    if (a.getBoundingClientRect && !b) return c = document.documentElement, d = a.getBoundingClientRect(), e = JAK.DOM.getBoxScroll(a), {
        left: d.left + e.x - c.clientLeft,
        top: d.top + e.y - c.clientTop
    };
    for (; a && a != e;) {
        c += a.offsetTop;
        d += a.offsetLeft;
        if (("gecko" == JAK.Browser.client && 3 > JAK.Browser.version || "safari" == JAK.Browser.client) && "fixed" == JAK.DOM.getStyle(a, "position")) {
            e = JAK.DOM.getScrollPos();
            c += e.y;
            d += e.x;
            break
        }
        a = a.offsetParent
    }
    return {top: c, left: d}
};
JAK.DOM.getPosition = function (a, b) {
    var c = b || a.ownerDocument.documentElement, d = a.getBoundingClientRect(), c = c.getBoundingClientRect();
    return {top: d.top - c.top, left: d.left - c.left}
};
JAK.DOM.getPortBoxPosition = function (a, b, c) {
    var d = JAK.DOM.getBoxPosition(a, b);
    a = JAK.DOM.getBoxScroll(a, b, c);
    d.left -= a.x;
    d.top -= a.y;
    return {left: d.left, top: d.top}
};
JAK.DOM.getPortPosition = function (a) {
    a = JAK.DOM.getPosition(a);
    var b = JAK.DOM.getScrollPos();
    return {left: a.left - b.x, top: a.top - b.y}
};
JAK.DOM.getBoxScroll = function (a, b, c) {
    var d = 0, e = 0, f = a.parentNode;
    a = b || a.ownerDocument.documentElement;
    for (b = !1; ;) if ("opera" == JAK.Browser.client && f.parentNode && "block" != JAK.DOM.getStyle(f, "display")) f = f.parentNode; else if (f == document.body && f.scrollLeft == f.parentNode.scrollLeft && f.scrollTop == f.parentNode.scrollTop) f = f.parentNode; else {
        c && "fixed" == JAK.DOM.getStyle(f, "position") && (b = !0);
        b || (d += f.scrollLeft, e += f.scrollTop);
        if (f == a) break;
        f = f.parentNode;
        if (!f) break
    }
    return {x: d, y: e}
};
JAK.DOM.getScrollPos = function () {
    if (document.documentElement.scrollTop || document.documentElement.scrollLeft) var a = document.documentElement.scrollLeft,
        b = document.documentElement.scrollTop; else document.body.scrollTop || document.body.scrollLeft ? (a = document.body.scrollLeft, b = document.body.scrollTop) : b = a = 0;
    return {x: a, y: b}
};
JAK.DOM.getStyle = function (a, b) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
        var c = a.ownerDocument.defaultView.getComputedStyle(a, "");
        return c ? c[b] : !1
    }
    return a.currentStyle[b]
};
JAK.DOM.setStyle = function (a, b) {
    for (var c in b) a.style[c] = b[c]
};
JAK.DOM.writeStyle = function (a) {
    var b = JAK.mel("style", {type: "text/css"});
    b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(JAK.ctext(a));
    a = document.getElementsByTagName("head");
    a.length ? a = a[0] : (a = JAK.cel("head"), document.documentElement.appendChild(a));
    a.appendChild(b);
    return b
};
JAK.DOM.elementsHider = function (a, b, c) {
    function d(b) {
        for (var c = !1; b.parentNode && b != document;) b == a && (c = !0), b = b.parentNode;
        return c
    }

    var e = b;
    e || (e = ["select", "object", "embed", "iframe"]);
    var f = arguments.callee.hidden;
    f && (f.forEach(function (a) {
        a.style.visibility = "visible"
    }), arguments.callee.hidden = []);
    if ("hide" == c) {
        "string" == typeof a && (a = JAK.gel(a));
        var f = [], g = this.getBoxPosition(a);
        g.width = a.offsetWidth + g.left;
        g.height = a.offsetHeight + g.top;
        for (var h = 0; h < e.length; ++h) for (var k = document.getElementsByTagName(e[h]),
                                                    l = 0; l < k.length; ++l) {
            var m = this.getBoxPosition(k[l]);
            d(k[l]) || (m.width = k[l].offsetWidth + m.left, m.height = k[l].offsetHeight + m.top, g.left > m.width || g.width < m.left || g.top > m.height || g.height < m.top || (k[l].style.visibility = "hidden", f.push(k[l])))
        }
        arguments.callee.hidden = f
    }
};
JAK.DOM.getElementsByClass = function (a, b, c) {
    return this.arrayFromCollection((b || document).querySelectorAll((c || "") + "." + a))
};
JAK.DOM.arrayFromCollection = function (a) {
    var b = [];
    try {
        b = Array.prototype.slice.call(a)
    } catch (c) {
        for (var d = 0; d < a.length; d++) b.push(a[d])
    } finally {
        return b
    }
};
JAK.DOM.separateCode = function (a) {
    var b = [];
    return [a.replace(/<script.*?>([\s\S]*?)<\/script>/g, function (a, d) {
        b.push(d);
        return ""
    }), b.join("\n")]
};
JAK.DOM.shiftBox = function (a) {
    var b = 0, c = 0, d = JAK.DOM.getBoxPosition(a), e = JAK.DOM.getScrollPos();
    d.left -= e.x;
    d.top -= e.y;
    var e = JAK.DOM.getDocSize(), f = a.offsetWidth;
    a = d.top + a.offsetHeight - e.height;
    0 < a && (d.top -= a, c -= a);
    a = d.left + f - e.width;
    0 < a && (d.left -= a, b -= a);
    a = d.top;
    0 > a && (d.top -= a, c -= a);
    a = d.left;
    0 > a && (d.left -= a, b -= a);
    return [b, c]
};
JAK.DOM.scrollbarWidth = function () {
    var a = JAK.mel("div", null, {
        width: "50px",
        height: "50px",
        overflow: "hidden",
        position: "absolute",
        left: "-200px"
    }), b = JAK.mel("div", null, {height: "100px"});
    a.appendChild(b);
    document.body.insertBefore(a, document.body.firstChild);
    b = a.clientWidth + parseInt(JAK.DOM.getStyle(a, "paddingLeft")) + parseInt(JAK.DOM.getStyle(a, "paddingRight"));
    JAK.DOM.setStyle(a, {overflowY: "scroll"});
    var c = a.clientWidth + parseInt(JAK.DOM.getStyle(a, "paddingLeft")) + parseInt(JAK.DOM.getStyle(a, "paddingRight"));
    document.body.removeChild(a);
    return b - c
};
JAK.DOM.findParent = function (a, b) {
    for (var c = (b || "").match(/[#.]?[a-z0-9_-]+/ig) || [], d = a.parentNode; d && d != document;) {
        for (var e = !0, f = 0; f < c.length; f++) {
            var g = c[f];
            switch (g.charAt(0)) {
                case "#":
                    d.id != g.substring(1) && (e = !1);
                    break;
                case ".":
                    JAK.DOM.hasClass(d, g.substring(1)) || (e = !1);
                    break;
                default:
                    d.nodeName.toLowerCase() != g.toLowerCase() && (e = !1)
            }
        }
        if (e) return d;
        d = d.parentNode
    }
    return null
};
JAK.ObjLib = JAK.ClassMaker.makeClass({NAME: "ObjLib", VERSION: "3.1"});
JAK.ObjLib.prototype.reSetOptions = function () {
};
JAK.ObjLib.prototype.pretty = function (a) {
    return a
};
JAK.ObjLib.prototype.serialize = function (a) {
    return JSON.stringify(a)
};
JAK.ObjLib.prototype.unserialize = function (a) {
    return JSON.parse(a)
};
JAK.ObjLib.prototype.match = function (a, b) {
    return JSON.stringify(a) == JSON.stringify(b)
};
JAK.ObjLib.prototype.copy = function (a) {
    return JSON.parse(JSON.stringify(a))
};
JAK.ObjLib.prototype.arrayCopy = function (a) {
    return this.copy(a)
};
JAK.Request = JAK.ClassMaker.makeClass({NAME: "JAK.Request", VERSION: "2.0"});
JAK.Request.XML = 0;
JAK.Request.TEXT = 1;
JAK.Request.JSONP = 2;
JAK.Request.BINARY = 3;
JAK.Request.supportsCrossOrigin = function () {
    return "opera" == JAK.Browser.client && 12 > parseFloat(JAK.Browser.version) || "ie" == JAK.Browser.client && 8 > JAK.Browser.version || "gecko" == JAK.Browser.client && 3.5 > parseFloat(JAK.Browser.version) ? !1 : !0
};
JAK.Request.supportsUpload = function () {
    return window.XMLHttpRequest && !!(new XMLHttpRequest).upload
};
JAK.Request.prototype.$constructor = function (a, b) {
    this._NEW = 0;
    this._SENT = 1;
    this._DONE = 2;
    this._ABORTED = 3;
    this._TIMEOUT = 4;
    this._PROGRESS = 5;
    this._xhr = null;
    this._callback = "";
    this._script = null;
    this._type = a;
    this._headers = {};
    this._callbacks = {};
    this._state = this._NEW;
    this._xdomain = !1;
    this._promise = new JAK.Promise;
    this._handleProgress = !1;
    this._options = {async: !0, timeout: 0, method: "get"};
    for (var c in b) this._options[c] = b[c];
    if (this._type == JAK.Request.JSONP) {
        if ("post" == this._options.method.toLowerCase()) throw Error("POST not supported in JSONP mode");
        if (!this._options.async) throw Error("Sync not supported in JSONP mode");
    }
};
JAK.Request.prototype.$destructor = function () {
    this._state == this._SENT && this.abort();
    this._xhr = null
};
JAK.Request.prototype.setHeaders = function (a) {
    if (this._type == JAK.Request.JSONP) throw Error("Request headers not supported in JSONP mode");
    for (var b in a) this._headers[b] = a[b]
};
JAK.Request.prototype.getHeaders = function () {
    if (this._state != this._DONE) throw Error("Response headers not available");
    if (this._type == JAK.Request.JSONP) throw Error("Response headers not supported in JSONP mode");
    var a = {}, b = this._xhr.getAllResponseHeaders();
    if (b) for (var b = b.split(/[\r\n]/), c = 0; c < b.length; c++) if (b[c]) {
        var d = b[c].match(/^([^:]+): *(.*)$/);
        a[d[1]] = d[2]
    }
    return a
};
JAK.Request.prototype.send = function (a, b) {
    if (this._state != this._NEW) throw Error("Request already sent");
    this._state = this._SENT;
    this._userCallback(this);
    switch (this._type) {
        case JAK.Request.XML:
        case JAK.Request.TEXT:
        case JAK.Request.BINARY:
            this._sendXHR(a, b);
            break;
        case JAK.Request.JSONP:
            this._sendScript(a, b);
            break;
        default:
            throw Error("Unknown request type");
    }
    return this._promise
};
JAK.Request.prototype.abort = function () {
    if (this._state != this._SENT) return !1;
    this._state = this._ABORTED;
    this._xhr && this._xhr.abort();
    this._userCallback(this);
    this._promise.reject({type: "abort", request: this});
    return !0
};
JAK.Request.prototype.setCallback = function (a, b) {
    this._setCallback(a, b, this._DONE);
    return this
};
JAK.Request.prototype.setSendCallback = function (a, b) {
    this._setCallback(a, b, this._SENT);
    return this
};
JAK.Request.prototype.setAbortCallback = function (a, b) {
    this._setCallback(a, b, this._ABORTED);
    return this
};
JAK.Request.prototype.setTimeoutCallback = function (a, b) {
    this._setCallback(a, b, this._TIMEOUT);
    return this
};
JAK.Request.prototype.setProgressCallback = function (a, b) {
    this._handleProgress = !0;
    this._setCallback(a, b, this._PROGRESS);
    return this
};
JAK.Request.prototype._setCallback = function (a, b, c) {
    this._callbacks[c] = [a, b]
};
JAK.Request.prototype._sendXHR = function (a, b) {
    if (window.XMLHttpRequest) {
        this._xhr = new XMLHttpRequest;
        var c = a.match(/^(https?\:)?\/\/(.*?)\//);
        if (c && c[2] != location.host && window.XDomainRequest && !this._xhr.upload) {
            if (this._type == JAK.Request.BINARY) throw Error("XDomainRequest does not support BINARY mode");
            if (this._type == JAK.Request.XML) throw Error("XDomainRequest does not support XML mode");
            this._xdomain = !0;
            this._xhr = new XDomainRequest
        }
    } else if (window.ActiveXObject) this._xhr = new ActiveXObject("Microsoft.XMLHTTP");
    else throw Error("No XHR available");
    this._xdomain ? (this._xhr.onload = this._onXDomainRequestLoad.bind(this), this._xhr.onerror = this._onXDomainRequestError.bind(this)) : this._xhr.onreadystatechange = this._onReadyStateChange.bind(this);
    var d;
    if ("get" == this._options.method.toLowerCase()) c = this._buildURL(a, b), d = null; else {
        c = a;
        d = this._serializeData(b);
        var e = !1, f;
        for (f in this._headers) if ("content-type" == f.toLowerCase()) {
            e = !0;
            break
        }
        e || this.setHeaders({"Content-Type": "application/x-www-form-urlencoded"})
    }
    if (this._type ==
        JAK.Request.BINARY) if (this._xhr.overrideMimeType) this._xhr.overrideMimeType("text/plain; charset=x-user-defined"); else if ("ie" == JAK.Browser.client) this._buildVBS(); else throw Error("This browser does not support binary transfer");
    this._handleProgress && this._xhr.upload && JAK.Events.addListener(this._xhr.upload, "progress", this, "_progressCallback");
    this._xhr.open(this._options.method, c, this._options.async);
    this._options.async && (this._xhr.withCredentials = this._options.withCredentials);
    for (f in this._headers) this._xhr.setRequestHeader(f,
        this._headers[f]);
    this._xhr.send(d);
    this._options.timeout && setTimeout(this._timeout.bind(this), this._options.timeout);
    this._options.async || this._onReadyStateChange()
};
JAK.Request.prototype._sendScript = function (a, b) {
    var c = b || {};
    this._callback = "callback" + JAK.idGenerator();
    c.callback = this._callback;
    a = this._buildURL(a, c);
    window[this._callback] = this._scriptCallback.bind(this);
    this._script = JAK.mel("script", {type: "text/javascript", src: a});
    document.body.insertBefore(this._script, document.body.firstChild)
};
JAK.Request.prototype._buildURL = function (a, b) {
    var c = this._serializeData(b);
    return c.length ? -1 == a.indexOf("?") ? a + "?" + c : a + "&" + c : a
};
JAK.Request.prototype._serializeData = function (a) {
    if ("string" == typeof a || window.File && a instanceof File) return a;
    if (!a) return "";
    var b = [], c;
    for (c in a) {
        var d = a[c];
        d instanceof Array || (d = [d]);
        for (var e = 0; e < d.length; e++) b.push(encodeURIComponent(c) + "=" + encodeURIComponent(d[e]))
    }
    return b.join("&")
};
JAK.Request.prototype._onReadyStateChange = function () {
    if (this._state != this._ABORTED && this._state != this._TIMEOUT && 4 == this._xhr.readyState) {
        this._xhr.onreadystatechange = null;
        var a = this._xhr.status, b;
        if (this._type == JAK.Request.BINARY) if (b = [], this._xhr.overrideMimeType) for (var c = this._xhr.responseText, d = c.length, e = 0; e < d; e++) b.push(c.charCodeAt(e) & 255); else for (d = VBS_getLength(this._xhr.responseBody), e = 0; e < d; e++) b.push(VBS_getByte(this._xhr.responseBody, e)); else b = this._type == JAK.Request.XML ? this._xhr.responseXML :
            this._xhr.responseText;
        this._done(b, a)
    }
};
JAK.Request.prototype._onXDomainRequestLoad = function () {
    if (this._state != this._ABORTED) {
        var a = this._xhr.responseText;
        if (this._type == JAK.Request.XML) {
            var b = new ActiveXObject("Microsoft.XMLDOM");
            b.async = !1;
            b.loadXML(a);
            a = b
        }
        this._done(a, 200)
    }
};
JAK.Request.prototype._onXDomainRequestError = function () {
    this._state != this._ABORTED && (this._state = this._ABORTED, this._userCallback(this), this._promise.reject({
        type: "error",
        request: this
    }))
};
JAK.Request.prototype._progressCallback = function (a) {
    a = a.loaded / a.total;
    var b = this._state;
    this._state = this._PROGRESS;
    this._userCallback(a);
    this._state = b
};
JAK.Request.prototype._scriptCallback = function (a) {
    this._script.parentNode.removeChild(this._script);
    this._script = null;
    try {
        delete window[this._callback]
    } catch (b) {
    }
    this._state != this._ABORTED && this._done(a, 200)
};
JAK.Request.prototype._done = function (a, b) {
    this._state != this._DONE && (this._state = this._DONE, this._userCallback(a, b, this), b ? this._promise.fulfill({
        data: a,
        status: b,
        request: this
    }) : this._promise.reject({type: "abort", request: this}))
};
JAK.Request.prototype._timeout = function () {
    this._state == this._SENT && (this._state = this._TIMEOUT, this._xhr && this._xhr.abort(), this._userCallback(this), this._promise.reject({
        type: "timeout",
        request: this
    }))
};
JAK.Request.prototype._userCallback = function (a) {
    var b = this._callbacks[this._state];
    if (b) {
        var c = b[0] || window, b = b[1];
        c && "string" == typeof b && (b = c[b]);
        b || (b = c, c = window);
        b.apply(c, arguments)
    }
};
JAK.Request.prototype._buildVBS = function () {
    var a = JAK.mel("script", {type: "text/vbscript"});
    a.text = "Function VBS_getByte(data, pos)\nVBS_getByte = AscB(MidB(data, pos+1,1))\nEnd Function\nFunction VBS_getLength(data)\nVBS_getLength = LenB(data)\nEnd Function";
    document.getElementsByTagName("head")[0].appendChild(a)
};
JAK.Signals = JAK.ClassMaker.makeClass({NAME: "JAK.Signals", VERSION: "2.1"});
JAK.Signals.prototype.$constructor = function () {
    this._myHandleFolder = {};
    this._myIdFolder = {}
};
JAK.Signals.prototype.addListener = function (a, b, c, d) {
    var e = JAK.idGenerator(), f = [], g = {eOwner: a, eFunction: c, eSender: d};
    b = b.split(" ");
    for (var h = 0; h < b.length; h++) {
        var k = b[h];
        k in this._myHandleFolder || (this._myHandleFolder[k] = {});
        var k = this._myHandleFolder[k], l = !0, m;
        for (m in k) {
            var p = k[m];
            p.eFunction == c && p.eOwner == a && p.eSender == d && (l = !1)
        }
        l && (k[e] = g, f.push(k))
    }
    return f.length ? (this._myIdFolder[e] = f, e) : null
};
JAK.Signals.prototype.removeListener = function (a) {
    var b = this._myIdFolder[a];
    for (b || console.error("Cannot remove non-existent signal ID '" + a + "'"); b.length;) delete b.pop()[a];
    delete this._myIdFolder[a]
};
JAK.Signals.prototype.removeListeners = function (a) {
    for (; a.length;) this.removeListener(a.shift())
};
JAK.Signals.prototype.makeEvent = function (a, b, c) {
    a = {type: a, target: b, timeStamp: (new Date).getTime(), data: c && "object" == typeof c ? c : null};
    this._myEventHandler(a)
};
JAK.Signals.prototype._myEventHandler = function (a) {
    var b = [], c;
    for (c in this._myHandleFolder) if (c == a.type || "*" == c) for (var d in this._myHandleFolder[c]) {
        var e = this._myHandleFolder[c][d];
        e.eSender && e.eSender != a.target || b.push(e)
    }
    for (c = 0; c < b.length; c++) if (e = b[c], d = e.eOwner, e = e.eFunction, "string" == typeof e) d[e](a); else "function" == typeof e && e(a)
};
JAK.signals = new JAK.Signals;
JAK.ISignals = JAK.ClassMaker.makeInterface({NAME: "JAK.ISignals", VERSION: "2.1"});
JAK.ISignals.prototype.setInterface = function (a) {
    if ("object" == typeof this[a]) return this[a];
    for (var b = this._owner; "undefined" == typeof b[a];) {
        if ("undefined" != typeof b.TOP_LEVEL) throw Error("SetInterface:Interface not found");
        b = b._owner
    }
    return b[a]
};
JAK.ISignals.prototype.addListener = function (a, b, c) {
    return this.getInterface().addListener(this, a, b, c)
};
JAK.ISignals.prototype.removeListener = function (a) {
    return this.getInterface().removeListener(a)
};
JAK.ISignals.prototype.removeListeners = function (a) {
    this.getInterface().removeListeners(a)
};
JAK.ISignals.prototype.makeEvent = function (a, b) {
    this.getInterface().makeEvent(a, this, b)
};
JAK.ISignals.prototype.getInterface = function () {
    return "object" == typeof this.signals ? this.signals : JAK.signals
};
JAK.AbstractDecorator = JAK.ClassMaker.makeSingleton({NAME: "JAK.AbstractDecorator", VERSION: "2.0"});
JAK.AbstractDecorator.prototype.decorate = function (a) {
    a.$super = this._$super;
    a.__decorators || (a.__decorators = []);
    a.__decorators.push(this);
    return a
};
JAK.AbstractDecorator.prototype._$super = function () {
    var a = arguments.callee.caller;
    if (!a) throw Error("Function.prototype.caller not supported");
    for (var b = this.__decorators || [], c = null, d = null, e = b.length; e--;) {
        var f = b[e];
        if (!c && d && d in f) {
            c = f;
            break
        }
        for (var g in f) if (!d && a == f[g]) {
            d = g;
            break
        }
    }
    if (!d) {
        c = a.owner || this.constructor;
        b = !1;
        for (d in c.prototype) c.prototype[d] == a && (b = d);
        if (!b) throw Error("Cannot find supplied method in constructor");
        a = c.EXTEND;
        if (!a) throw Error("No super-class available");
        if (!a.prototype[b]) throw Error("Super-class doesn't have method '" +
            b + "'");
        return a.prototype[b].apply(this, arguments)
    }
    if (!(c || (c = this.constructor.prototype, d in c))) throw Error("Function '" + d + "' has no undecorated parent");
    return c[d].apply(this, arguments)
};
JAK.AutoDecorator = JAK.ClassMaker.makeSingleton({
    NAME: "JAK.AutoDecorator",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
JAK.AutoDecorator.prototype.decorate = function (a) {
    this.$super(a);
    var b = ["constructor", "$super", "_$super", "decorate"], c;
    for (c in this) -1 == b.indexOf(c) && (a[c] = this[c])
};
JAK.IDecorable = JAK.ClassMaker.makeClass({NAME: "JAK.IDecorable", VERSION: "2.0", CLASS: "class"});
JAK.IDecorable.prototype.decorate = function (a) {
    for (var b = [this], c = 1; c < arguments.length; c++) b.push(arguments[c]);
    c = a.getInstance();
    return c.decorate.apply(c, b)
};
JAK.Timekeeper = JAK.ClassMaker.makeSingleton({NAME: "JAK.Timekeeper", VERSION: "1.1"});
JAK.Timekeeper.prototype.$constructor = function () {
    this._listeners = [];
    this._running = 0;
    this._tick = this._tick.bind(this);
    this._scheduler = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a, b) {
        setTimeout(a, 1E3 / 60)
    }
};
JAK.Timekeeper.prototype.addListener = function (a, b, c) {
    if (-1 != this._findListener(a)) throw Error("This listener is already attached");
    a = {what: a, method: b, count: c || 1, bucket: 0};
    a.bucket = a.count;
    this._listeners.push(a);
    2 != this._running && (0 == this._running && this._schedule(), this._running = 2);
    return this
};
JAK.Timekeeper.prototype.removeListener = function (a) {
    a = this._findListener(a);
    if (-1 == a) throw Error("Cannot find listener to be removed");
    this._listeners.splice(a, 1);
    this._listeners.length || (this._running = 1);
    return this
};
JAK.Timekeeper.prototype._findListener = function (a) {
    for (var b = 0; b < this._listeners.length; b++) if (this._listeners[b].what == a) return b;
    return -1
};
JAK.Timekeeper.prototype._tick = function () {
    1 == this._running && (this._running = 0);
    if (0 != this._running) {
        this._schedule();
        for (var a = 0; a < this._listeners.length; a++) {
            var b = this._listeners[a];
            b.bucket--;
            if (!b.bucket) {
                b.bucket = b.count;
                var c = b.what;
                ("string" == typeof b.method ? c[b.method] : b.method).call(c)
            }
        }
    }
};
JAK.Timekeeper.prototype._schedule = function () {
    var a = this._scheduler;
    a(this._tick, null)
};
JAK.C = JAK.ClassMaker.makeClass({NAME: "JAK.C", VERSION: "1.0", IMPLEMENT: JAK.ISignals});
JAK.C.prototype.$constructor = function () {
    this.LIMIT = 1E3;
    this.DEBUG = !1;
    this.REMOTE = {active: !1, limit: 10, what: ["error"]};
    this._native = window.console;
    this._data = [];
    this._lost = 0;
    this._defineLogMethod("log");
    this._defineLogMethod("info");
    this._defineLogMethod("warn");
    this._defineLogMethod("debug");
    this._defineLogMethod("error");
    this._defineLogMethod("dir")
};
JAK.C.prototype.clear = function () {
    this._lost = 0;
    this._data = [];
    this.makeEvent("change")
};
JAK.C.prototype.getLost = function () {
    return this._lost
};
JAK.C.prototype.getData = function () {
    return this._data
};
JAK.C.prototype._defineLogMethod = function (a) {
    var b = this;
    this[a] = function () {
        return b._log(a, arguments)
    }
};
JAK.C.prototype._log = function (a, b) {
    for (this._data.push({
        type: a,
        args: b,
        ts: (new Date).getTime()
    }); this._data.length > this.LIMIT;) this._data.shift(), this._lost++;
    this.REMOTE.active && window.DOT && -1 < this.REMOTE.what.indexOf(a) && this.REMOTE.limit && (this.REMOTE.limit--, DOT.hit("error", {
        d: {
            type: a,
            args: b
        }
    }));
    if (this.DEBUG && this._native) {
        var c = this._native[a];
        return c || (c = this._native.log, c) ? Function.prototype.apply.call(c, this._native, b) : void 0
    }
    this.makeEvent("change")
};
!window.console && (window.console = new JAK.C);
JAK.Promise = JAK.ClassMaker.makeClass({NAME: "JAK.Promise", VERSION: "1.0"});
JAK.Promise.prototype.$constructor = function (a) {
    this._state = 0;
    this._value = null;
    this._cb = {fulfilled: [], rejected: []};
    this._thenPromises = [];
    a && this._invokeResolver(a)
};
JAK.Promise.all = JAK.Promise.when = function (a) {
    for (var b = new this, c = 0, d = [], e = 0; e < a.length; e++) c++, a[e].then(function (a, e) {
        d[a] = e;
        c--;
        c || b.fulfill(d)
    }.bind(null, e), function (a) {
        c = 1 / 0;
        b.reject(a)
    });
    return b
};
JAK.Promise.prototype.then = function (a, b) {
    this._cb.fulfilled.push(a);
    this._cb.rejected.push(b);
    var c = new JAK.Promise;
    this._thenPromises.push(c);
    0 < this._state && setTimeout(this._processQueue.bind(this), 0);
    return c
};
JAK.Promise.prototype["catch"] = function (a) {
    return this.then(null, a)
};
JAK.Promise.prototype.fulfill = function (a) {
    if (0 != this._state) return this;
    this._state = 1;
    this._value = a;
    this._processQueue();
    return this
};
JAK.Promise.prototype.reject = function (a) {
    if (0 != this._state) return this;
    this._state = 2;
    this._value = a;
    this._processQueue();
    return this
};
JAK.Promise.prototype.chain = function (a) {
    return this.then(a.fulfill.bind(a), a.reject.bind(a))
};
JAK.Promise.prototype._processQueue = function () {
    for (; this._thenPromises.length;) {
        var a = this._cb.fulfilled.shift(), b = this._cb.rejected.shift();
        this._executeCallback(1 == this._state ? a : b)
    }
};
JAK.Promise.prototype._executeCallback = function (a) {
    var b = this._thenPromises.shift();
    if ("function" != typeof a) 1 == this._state ? b.fulfill(this._value) : b.reject(this._value); else try {
        var c = a(this._value);
        c && "function" == typeof c.then ? c.then(function (a) {
            b.fulfill(a)
        }, function (a) {
            b.reject(a)
        }) : b.fulfill(c)
    } catch (d) {
        window.console && window.console.error && console.error(d), b.reject(d)
    }
};
JAK.Promise.prototype._invokeResolver = function (a) {
    try {
        a(this.fulfill.bind(this), this.reject.bind(this))
    } catch (b) {
        this.reject(b)
    }
};
(function () {
    var a = function () {
        for (var a = Array.prototype.slice.call(arguments), b = document.createDocumentFragment(), c, g; g = a.shift();) if ("string" == typeof g) for (c = document.createElement("div"), c.innerHTML = g; c.firstChild;) b.appendChild(c.firstChild); else b.appendChild(g);
        return b
    }, b = {
        before: function () {
            var b = a.apply(this, arguments);
            this.parentNode.insertBefore(b, this)
        }, after: function () {
            var b = a.apply(this, arguments);
            this.parentNode.insertBefore(b, this.nextSibling)
        }, replaceWith: function () {
            if (this.parentNode) {
                var b =
                    a.apply(this, arguments);
                this.parentNode.replaceChild(b, this)
            }
        }, remove: function () {
            this.parentNode && this.parentNode.removeChild(this)
        }
    }, c = ["before", "after", "replaceWith", "remove"];
    ["Element", "DocumentType", "CharacterData"].forEach(function (a) {
        c.forEach(function (c) {
            window[a] && !window[a].prototype[c] && (window[a].prototype[c] = b[c])
        })
    })
})();
(function () {
    if (!document.addEventListener && window.Element && window.Event) {
        Event.prototype.NONE = Event.NONE = 0;
        Event.prototype.CAPTURING_PHASE = Event.CAPTURING_PHASE = 1;
        Event.prototype.AT_TARGET = Event.AT_TARGET = 2;
        Event.prototype.BUBBLING_PHASE = Event.BUBBLING_PHASE = 3;
        Event.prototype.preventDefault = function () {
            !1 !== this.cancelable && (this.returnValue = !1)
        };
        Event.prototype.stopPropagation = function () {
            this.cancelBubble = !0
        };
        Event.prototype.stopImmediatePropagation = function () {
            this.__immediateStopped = this.cancelBubble =
                !0
        };
        var a = function (a, b, c) {
            for (var d = 0; d < a.length; d++) {
                var e = a[d];
                if (e.useCapture == c && e.listener == b) return d
            }
            return -1
        }, b = function (a, b, c) {
            a.currentTarget = c;
            "function" == typeof b ? b.call(c, a) : b.handleEvent(a)
        }, c = function (a, c, d) {
            a.eventPhase = d;
            for (var e = 0; e < c.length; e++) {
                for (var f = c[e], g = [], h = (f.__events || {})[a.type] || [], n = 0; n < h.length; n++) {
                    var q = h[n];
                    q.useCapture && d == Event.BUBBLING_PHASE || (q.useCapture || d != Event.CAPTURING_PHASE) && g.push(q.listener)
                }
                for (n = 0; n < g.length;) try {
                    for (; n < g.length;) {
                        var r = g[n++];
                        b(a, r, f);
                        if (a.__immediateStopped) return !0
                    }
                } catch (s) {
                    setTimeout(function () {
                        throw s;
                    }, 0)
                }
                if (a.cancelBubble) return !0
            }
            return !1
        }, d = function (a) {
            a.timeStamp = +new Date;
            a.target || (a.target = a.srcElement || this);
            a.pageX = a.clientX + document.documentElement.scrollLeft;
            a.pageY = a.clientY + document.documentElement.scrollTop;
            a.relatedTarget = "mouseover" == a.type ? a.fromElement : "mouseout" == a.type ? a.toElement : null;
            for (var b = a.target, d = []; b.parentNode;) d.unshift(b.parentNode), b = b.parentNode;
            if (d.length && c(a, d, Event.CAPTURING_PHASE) ||
                c(a, [a.target], Event.AT_TARGET) || d.length && !1 !== a.bubbles && (d.reverse(), c(a, d, Event.BUBBLING_PHASE))) return a.returnValue;
            a.stopPropagation();
            return a.returnValue
        }, e = {
            addEventListener: function (b, c, e) {
                var f = (this.__events || {})[b] || [], g = f.length;
                -1 < a(f, c, e) || ("__events" in this ? f = this.__events : this.__events = f = {_handler: d.bind(this)}, b in f || (f[b] = []), f[b].push({
                    listener: c,
                    useCapture: e
                }), g || this.attachEvent("on" + b, f._handler))
            }, removeEventListener: function (b, c, d) {
                var e = (this.__events || {})[b] || [];
                c = a(e,
                    c, d);
                -1 != c && (e.splice(c, 1), e.length || this.detachEvent("on" + b, this.__events._handler))
            }, dispatchEvent: function (a) {
                a.returnValue = !0;
                return d.call(this, a)
            }
        }, f = [Element, window.constructor, document.constructor];
        for (; f.length;) {
            var g = f.pop(), h;
            for (h in e) g.prototype[h] = e[h]
        }
    }
})();
(function () {
    if (window.MouseEvent) try {
        new MouseEvent("click")
    } catch (a) {
        var b = function (a, b) {
            if (!arguments.length) throw Error("Not enough arguments");
            var e = {
                type: a,
                bubbles: !1,
                cancelable: !1,
                view: window,
                detail: 1,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                ctrlKey: !1,
                altLey: !1,
                shiftKey: !1,
                metaKey: !1,
                button: 0,
                relatedTarget: null
            }, f;
            for (f in b) e[f] = b[f];
            f = document.createEvent("MouseEvent");
            f.initMouseEvent(e.type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
                e.shiftKey, e.metaKey, e.button, e.relatedTarget);
            return f
        };
        b.prototype = window.MouseEvent.prototype;
        window.MouseEvent = b
    } else window.MouseEvent = function (a, b) {
        if (!arguments.length) throw Error("Not enough arguments");
        var e = {type: a, cancelable: !1, bubbles: !1}, f = document.createEventObject(), g;
        for (g in e) f[g] = e[g];
        for (g in b) f[g] = b[g];
        return f
    }
})();
(function () {
    if (!window.CustomEvent && document.createEventObject) window.CustomEvent = function (a, b) {
        if (!arguments.length) throw Error("Not enough arguments");
        var e = {type: a, bubbles: !1, cancelable: !1, detail: null}, f = document.createEventObject(), g;
        for (g in e) f[g] = e[g];
        for (g in b) f[g] = b[g];
        return f
    }; else try {
        new CustomEvent("test")
    } catch (a) {
        var b = function (a, b) {
            if (!arguments.length) throw Error("Not enough arguments");
            var e = {bubbles: !1, cancelable: !1, detail: null}, f;
            for (f in b) e[f] = b[f];
            f = document.createEvent("CustomEvent");
            f.initCustomEvent(a, e.bubbles, e.cancelable, e.detail);
            return f
        };
        b.prototype = (window.CustomEvent || window.Event).prototype;
        window.CustomEvent = b
    }
})();
(function () {
    window.getSelection || document.addEventListener("readystatechange", function (a) {
        "complete" == document.readyState && (a = new CustomEvent("DOMContentLoaded"), document.dispatchEvent(a))
    })
})();
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
    return setTimeout(a, 1E3 / 60)
};
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (a) {
    return clearTimeout(a)
};
(function () {
    if (!("ongesturechange" in window || !1 in window)) {
        var a = 0, b = 0, c = !1, d = function (a, b) {
            setTimeout(function () {
                b.dispatchEvent(a)
            }, 0)
        };
        document.addEventListener("touchstart", function (e) {
            if (2 == e.touches.length) {
                var f = e.touches[0], g = e.touches[1], h = f.clientX - g.clientX, f = f.clientY - g.clientY;
                a = Math.sqrt(h * h + f * f);
                b = Math.atan2(f, h);
                c = !0;
                h = new CustomEvent("gesturestart", {bubbles: !0});
                d(h, e.target)
            }
        }, !1);
        document.addEventListener("touchmove", function (c) {
            if (2 == c.touches.length) {
                var f = c.touches[0], g = c.touches[1],
                    h = f.clientX - g.clientX, g = f.clientY - g.clientY, f = Math.sqrt(h * h + g * g),
                    h = Math.atan2(g, h), g = new CustomEvent("gesturechange", {bubbles: !0});
                g.altKey = c.altKey;
                g.ctrlKey = c.ctrlKey;
                g.metaKey = c.metaKey;
                g.shiftKey = c.shiftKey;
                g.rotation = 180 / Math.PI * (h - b) % 360;
                g.altKey = c.altKey;
                g.scale = f / a;
                d(g, c.target)
            }
        }, !1);
        document.addEventListener("touchend", function (a) {
            if (c) {
                c = !1;
                var b = new CustomEvent("gestureend", {bubbles: !0});
                d(b, a.target)
            }
        }, !1)
    }
})();
(function () {
    "function" !== typeof Element.prototype.matches && (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function (a) {
        a = (this.document || this.ownerDocument).querySelectorAll(a);
        for (var b = 0; a[b] && a[b] !== this;) ++b;
        return Boolean(a[b])
    });
    "function" !== typeof Element.prototype.closest && (Element.prototype.closest = function (a) {
        for (var b = this; b && 1 === b.nodeType;) {
            if (b.matches(a)) return b;
            b = b.parentNode
        }
        return null
    });
    var a = {};
    if (!Object.setPrototypeOf && !a.__proto__) {
        var b = Object.getPrototypeOf;
        Object.getPrototypeOf = function (a) {
            return a.__proto__ ? a.__proto__ : b.call(Object, a)
        }
    }
    if (!Object.assign) {
        a = function (a) {
            if (void 0 === a || null === a) throw new TypeError("Cannot convert first argument to object");
            for (var b = Object(a), c = 1; c < arguments.length; c++) {
                var g = arguments[c];
                if (void 0 !== g && null !== g) for (var g = Object(g), h = Object.keys(Object(g)), k = 0, l = h.length; k < l; k++) {
                    var m = h[k], n = Object.getOwnPropertyDescriptor(g, m);
                    void 0 !== n &&
                    n.enumerable && (b[m] = g[m])
                }
            }
            return b
        };
        try {
            Object.defineProperty(Object, "assign", {enumerable: !1, configurable: !0, writable: !0, value: a})
        } catch (c) {
            Object.assign = a
        }
    }
    Math.sign || (Math.sign = function (a) {
        return (0 < a) - (0 > a) || +a
    })
})();
JAK.VecNd = JAK.ClassMaker.makeClass({NAME: "JAK.VecNd", VERSION: "2.0"});
JAK.VecNd.prototype.$constructor = function (a) {
    this.n = a;
    this.data = [];
    for (var b = 0; b < a; b++) this.data.push(arguments.length > b + 1 ? arguments[b + 1] : 0)
};
JAK.VecNd.prototype.setN = function (a, b) {
    this.data[a] = b
};
JAK.VecNd.prototype.getN = function (a) {
    return this.data[a]
};
JAK.VecNd.prototype.norm = function (a) {
    a = a || 2;
    for (var b = 0, c = 0; c < this.n; c++) b += Math.pow(this.getN(c), a);
    return Math.pow(b, 1 / a)
};
JAK.VecNd.prototype._plus = function (a) {
    for (var b = 0; b < this.n; b++) this.setN(b, this.getN(b) + a.getN(b));
    return this
};
JAK.VecNd.prototype.plus = function (a) {
    return this.clone()._plus(a)
};
JAK.VecNd.prototype._minus = function (a) {
    for (var b = 0; b < this.n; b++) this.setN(b, this.getN(b) - a.getN(b));
    return this
};
JAK.VecNd.prototype.minus = function (a) {
    return this.clone()._minus(a)
};
JAK.VecNd.prototype._multiply = function (a) {
    for (var b = 0; b < this.n; b++) this.setN(b, this.getN(b) * a);
    return this
};
JAK.VecNd.prototype.multiply = function (a) {
    return this.clone()._multiply(a)
};
JAK.VecNd.prototype.dot = function (a) {
    for (var b = 0, c = 0; c < this.n; c++) b += this.getN(c) * a.getN(c);
    return b
};
JAK.VecNd.prototype._unit = function (a) {
    a = this.norm(a);
    for (var b = 0; b < this.n; b++) this.setN(b, this.getN(b) / a);
    return this
};
JAK.VecNd.prototype.unit = function (a) {
    return this.clone()._unit(a)
};
JAK.VecNd.prototype.clone = function () {
    for (var a = new this.constructor(this.n), b = 0; b < this.n; b++) a.setN(b, this.getN(b));
    return a
};
JAK.VecNd.prototype.join = function (a, b) {
    for (var c = a || ",", d = [], e = 0; e < this.n; e++) {
        var f = this.getN(e);
        b && (f = Math.round(f));
        d.push(f)
    }
    return d.join(c)
};
JAK.VecNd.prototype.toString = function () {
    return "[" + this.join(", ") + "]"
};
JAK.Vec2d = JAK.ClassMaker.makeClass({NAME: "Vec2d", VERSION: "2.0", EXTEND: JAK.VecNd});
JAK.Vec2d.prototype.$constructor = function (a, b) {
    JAK.VecNd.prototype.$constructor.call(this, 2, a, b)
};
JAK.Vec2d.prototype.setX = function (a) {
    this.data[0] = a
};
JAK.Vec2d.prototype.setY = function (a) {
    this.data[1] = a
};
JAK.Vec2d.prototype.getX = function () {
    return this.data[0]
};
JAK.Vec2d.prototype.getY = function () {
    return this.data[1]
};
JAK.Vec2d.prototype.normal = function () {
    return new this.constructor(this.getY(), -this.getX())
};
JAK.Vec2d.prototype._symmetry = function (a) {
    a = a.normal()._unit();
    var b = this.dot(a);
    return this._minus(a._multiply(2 * b))
};
JAK.Vec2d.prototype.symmetry = function (a) {
    return this.clone()._symmetry(a)
};
JAK.Vec2d.prototype.distance = function (a, b) {
    var c = b.minus(a), d = c.normal().unit(), e = a.getX(), f = a.getY(), g = this.getX(), h = this.getY(),
        k = c.getX(), c = c.getY(), l = d.getX(), d = d.getY();
    return -((k * h - c * g + e * c - f * k) / (l * c - k * d))
};
JAK.Vector = JAK.ClassMaker.makeStatic({NAME: "JAK.Vector", VERSION: "2.0", DEPEND: [{sClass: JAK.Vec2d, ver: "2.0"}]});
JAK.Vector.STYLE_SOLID = 0;
JAK.Vector.STYLE_DASH = 1;
JAK.Vector.STYLE_DOT = 2;
JAK.Vector.STYLE_DASHDOT = 3;
JAK.Vector.END_STYLE_ROUND = 0;
JAK.Vector.END_STYLE_SQUARE = 1;
JAK.Vector.getCanvas = function (a, b) {
    return JAK.SVG.isSupported() ? new JAK.SVG(a, b) : JAK.VML.isSupported(a, b) ? new JAK.VML(a, b) : new JAK.Vector.Canvas(a, b)
};
JAK.Vector.Canvas = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Canvas", VERSION: "1.0"});
JAK.Vector.Canvas.prototype.$constructor = function (a, b) {
    this._container = JAK.mel("div")
};
JAK.Vector.Canvas.prototype.clear = function () {
};
JAK.Vector.Canvas.prototype.resize = function (a, b) {
};
JAK.Vector.Canvas.prototype.setScale = function (a) {
};
JAK.Vector.Canvas.prototype.getContainer = function () {
    return this._container
};
JAK.Vector.Canvas.prototype.getContent = function () {
    return this._container
};
JAK.Vector.Canvas.prototype.setContent = function (a) {
};
JAK.Vector.Canvas.prototype.circle = function () {
};
JAK.Vector.Canvas.prototype.ellipse = function () {
};
JAK.Vector.Canvas.prototype.polyline = function () {
};
JAK.Vector.Canvas.prototype.polygon = function () {
};
JAK.Vector.Canvas.prototype.path = function () {
};
JAK.Vector.Canvas.prototype.group = function () {
    return JAK.mel("div")
};
JAK.Vector.Canvas.prototype.setStroke = function (a, b) {
};
JAK.Vector.Canvas.prototype.setFill = function (a, b) {
};
JAK.Vector.Canvas.prototype.setCenterRadius = function (a, b, c) {
};
JAK.Vector.Canvas.prototype.setPoints = function (a, b, c) {
};
JAK.Vector.Canvas.prototype.setFormat = function (a, b) {
};
JAK.Vector.Canvas.prototype.setTitle = function (a, b) {
    a.setAttribute("title", b)
};
JAK.Vector.Canvas.prototype.computeControlPointsSymmetric = function (a, b) {
    var c = {flat: !0, curvature: 20, join: !1}, d;
    for (d in b) c[d] = b[d];
    if (2 > a.length || 2 == a.length && !c.join) return !1;
    d = [];
    for (var e = !1, f = !1, g = c.join ? a.length : a.length - 1, h = 0; h < g; h++) {
        var k = a[h];
        if (c.join) var l = h + 1 == a.length ? a[0] : a[h + 1],
            f = h + 2 >= a.length ? a[h + 2 - a.length] : a[h + 2]; else l = a[h + 1], f = h + 2 == a.length ? !1 : a[h + 2];
        if (f) {
            var m = f.minus(k), n = m.norm();
            (n /= c.curvature) || (n = Infinity);
            m = m.multiply(1 / n);
            f = l.minus(m)
        } else if (n = l.minus(k), c.flat) f = k.plus(n.multiply(0.5));
        else var q = e.minus(k), m = q.symmetry(n), f = l.minus(m);
        e || (n = l.minus(k), c.join ? (e = a[a.length - 1].minus(l), n = e.norm(), (n /= c.curvature) || (n = Infinity), e = e.multiply(1 / n), e = k.minus(e)) : c.flat ? e = k.plus(n.multiply(0.5)) : (q = m.symmetry(n), e = k.plus(q)));
        d.push([e, f]);
        e = l.plus(m)
    }
    return d
};
JAK.Vector.Canvas.prototype.computeControlPoints = function (a, b) {
    var c = {flat: !0, curvature: 20, join: !1}, d;
    for (d in b) c[d] = b[d];
    c.curvature /= 100;
    if (2 > a.length || 2 == a.length && !c.join) return !1;
    d = [];
    for (var e = !1, f = !1, g = c.join ? a.length : a.length - 1, h = 0; h < g; h++) {
        var k = a[h];
        if (c.join) var l = h + 1 == a.length ? a[0] : a[h + 1], f = h + 2 >= a.length ? a[h + 2 - a.length] : a[h + 2],
            m = h ? a[h - 1] : a[a.length - 1]; else l = a[h + 1], f = h + 2 == a.length ? !1 : a[h + 2], m = h ? a[h - 1] : !1;
        var n = l.minus(k);
        if (f) var q = f.minus(k), e = n.norm() * c.curvature, r = q.norm(), q = q.multiply(e /
            r || 0),
            f = l.minus(q); else c.flat ? f = k.plus(n.multiply(0.5)) : (e = e.minus(k), q = e.symmetry(n), f = l.minus(q));
        m ? (m = m.minus(l), e = l.minus(k).norm() * c.curvature, r = m.norm(), l = m.multiply(e / r || 0), e = k.minus(l)) : c.flat ? e = k.plus(n.multiply(0.5)) : (e = q.symmetry(n), e = k.plus(e));
        d.push([e, f])
    }
    return d
};
JAK.Vector.Primitive = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Primitive", VERSION: "1.0"});
JAK.Vector.Primitive.prototype.$constructor = function (a) {
    this.canvas = a;
    this.elm2 = this.elm = null
};
JAK.Vector.Primitive.prototype.getNodes = function () {
    var a = [this.elm];
    this.elm2 && a.push(this.elm2);
    return a
};
JAK.Vector.Primitive.prototype.$destructor = function () {
    this.elm && this.elm.parentNode && 1 == this.elm.parentNode.nodeType && this.elm.parentNode.removeChild(this.elm);
    this.elm2 && this.elm2.parentNode && 1 == this.elm2.parentNode.nodeType && this.elm2.parentNode.removeChild(this.elm2)
};
JAK.Vector.Line = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Line", VERSION: "1.0", EXTEND: JAK.Vector.Primitive});
JAK.Vector.Line.prototype.$constructor = function (a, b, c) {
    this.canvas = a;
    this.elm2 = null;
    this.options = {
        color: "#000",
        width: 1,
        curvature: 0,
        opacity: 1,
        style: JAK.Vector.STYLE_SOLID,
        outlineColor: "#fff",
        outlineOpacity: 1,
        outlineWidth: 0,
        outlineStyle: JAK.Vector.STYLE_SOLID,
        title: "",
        symmetricCP: !0
    };
    for (var d in c) this.options[d] = c[d];
    this._build(b)
};
JAK.Vector.Line.prototype._build = function (a) {
    this.elm && this.elm.parentNode.removeChild(this.elm);
    this.elm2 && this.elm2.parentNode.removeChild(this.elm2);
    this.options.curvature ? (this.elm = this.canvas.path(), this.options.outlineWidth && (this.elm2 = this.canvas.path())) : (this.elm = this.canvas.polyline(), this.options.outlineWidth && (this.elm2 = this.canvas.polyline()));
    this.canvas.setTitle(this.elm, this.options.title);
    this.options.outlineWidth && (this.canvas.setTitle(this.elm2, this.options.title), this.canvas.getContent().appendChild(this.elm2));
    this.canvas.getContent().appendChild(this.elm);
    this.setPoints(a);
    this.setOptions(this.options)
};
JAK.Vector.Line.prototype.setCurvature = function (a) {
    !!this.options.curvature != !!a ? (this.options.curvature = a, this._build(this.points)) : (this.options.curvature = a, this.setPoints(this.points))
};
JAK.Vector.Line.prototype.$destructor = function () {
    this.elm.parentNode && 1 == this.elm.parentNode.nodeType && this.elm.parentNode.removeChild(this.elm);
    this.elm2 && this.elm2.parentNode && 1 == this.elm2.parentNode.nodeType && this.elm2.parentNode.removeChild(this.elm2)
};
JAK.Vector.Line.prototype.setPoints = function (a) {
    this.points = a;
    if (this.options.curvature) {
        a = "M " + this.points[0].join(" ");
        var b = this.points.length;
        if (2 < b) for (var c = this.options.symmetricCP ? this.canvas.computeControlPointsSymmetric(this.points, {
            join: !1,
            curvature: this.options.curvature
        }) : this.canvas.computeControlPoints(this.points, {
            join: !1,
            curvature: this.options.curvature
        }), d = 1; d < b; d++) {
            var e = c[d - 1], f = e[1], g = this.points[d];
            a += "C " + e[0].join(" ") + ", " + f.join(" ") + ", " + g.join(" ") + " "
        } else for (d = 1; d <
        b; d++) g = this.points[d], a += "L  " + g.join(" ") + " ";
        this.canvas.setFormat(this.elm, a);
        this.elm2 && this.canvas.setFormat(this.elm2, a)
    } else this.canvas.setPoints(this.elm, a), this.elm2 && this.canvas.setPoints(this.elm2, a)
};
JAK.Vector.Line.prototype.setOptions = function (a) {
    var b = {};
    "width" in a && (b.width = a.width, this.options.width = a.width);
    "opacity" in a && (b.opacity = a.opacity);
    "color" in a && (b.color = a.color);
    "style" in a && (b.style = a.style);
    "endCap" in a && (b.endCap = a.endCap);
    "exactStyle" in a && (b.exactStyle = a.exactStyle);
    this.canvas.setStroke(this.elm, b);
    this.elm2 && (b = {}, "outlineWidth" in a && (b.width = 2 * a.outlineWidth + this.options.width), "outlineOpacity" in a && (b.opacity = a.outlineOpacity), "outlineColor" in a && (b.color = a.outlineColor),
    "outlineStyle" in a && (b.style = a.outlineStyle), "outlineEndCap" in a && (b.endCap = a.outlineEndCap), "outlineExactStyle" in a && (b.exactStyle = a.outlineExactStyle), this.canvas.setStroke(this.elm2, b))
};
JAK.Vector.Polygon = JAK.ClassMaker.makeClass({
    NAME: "JAK.Vector.Polygon",
    VERSION: "1.0",
    EXTEND: JAK.Vector.Primitive
});
JAK.Vector.Polygon.prototype.$constructor = function (a, b, c) {
    this.canvas = a;
    this.options = {
        color: "#000",
        curvature: 0,
        opacity: 1,
        outlineColor: "#fff",
        outlineOpacity: 1,
        outlineWidth: 0,
        outlineStyle: JAK.Vector.STYLE_SOLID,
        title: "",
        symmetricCP: !0
    };
    for (var d in c) this.options[d] = c[d];
    this._build(b)
};
JAK.Vector.Polygon.prototype._build = function (a) {
    this.elm && this.elm.parentNode.removeChild(this.elm);
    this.elm = this.options.curvature ? this.canvas.path() : this.canvas.polygon();
    this.canvas.setTitle(this.elm, this.options.title);
    this.canvas.getContent().appendChild(this.elm);
    this.setPoints(a);
    this.setOptions(this.options)
};
JAK.Vector.Polygon.prototype.setPoints = function (a) {
    this.points = a;
    if (this.options.curvature) {
        a = this.options.symmetricCP ? this.canvas.computeControlPointsSymmetric(this.points, {
            join: !0,
            curvature: this.options.curvature
        }) : this.canvas.computeControlPoints(this.points, {join: !0, curvature: this.options.curvature});
        for (var b = "M " + this.points[0].join(" "), c = this.points.length, d = 1; d < c + 1; d++) var e = a[d - 1], f = e[1], g = d >= c ? this.points[0] : this.points[d], b = b + ("C " + e[0].join(" ") + ", " + f.join(" ") + ", " + g.join(" ") + " ");
        this.canvas.setFormat(this.elm, b + "Z")
    } else this.canvas.setPoints(this.elm, a, !0)
};
JAK.Vector.Polygon.prototype.setOptions = function (a) {
    var b = {};
    "outlineColor" in a && (b.color = a.outlineColor);
    "outlineWidth" in a && (b.width = a.outlineWidth);
    "outlineOpacity" in a && (b.opacity = a.outlineOpacity);
    "outlineStyle" in a && (b.style = a.outlineStyle);
    "outlineEndCap" in a && (b.endCap = a.outlineEndCap);
    "outlineExactStyle" in a && (b.exactStyle = a.outlineExactStyle);
    var c = {};
    "color" in a && (c.color = a.color);
    "opacity" in a && (c.opacity = a.opacity);
    "fillRule" in a && (c.fillRule = a.fillRule);
    this.canvas.setStroke(this.elm,
        b);
    this.canvas.setFill(this.elm, c)
};
JAK.Vector.Polygon.prototype.setCurvature = function (a) {
    !!this.options.curvature != !!a ? (this.options.curvature = a, this._build(this.points)) : (this.options.curvature = a, this.setPoints(this.points))
};
JAK.Vector.Circle = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Circle", VERSION: "1.0", EXTEND: JAK.Vector.Primitive});
JAK.Vector.Circle.prototype._method = "circle";
JAK.Vector.Circle.prototype.$constructor = function (a, b, c, d) {
    this.canvas = a;
    this.center = new JAK.Vec2d(0, 0);
    this.radius = 0;
    this.options = {
        color: "",
        opacity: 1,
        outlineColor: "#000",
        outlineOpacity: 1,
        outlineWidth: 1,
        outlineStyle: JAK.Vector.STYLE_SOLID,
        title: ""
    };
    for (var e in d) this.options[e] = d[e];
    this.elm = this.canvas[this._method]();
    this.setCenter(b);
    this.setRadius(c);
    this.canvas.setTitle(this.elm, this.options.title);
    this.canvas.getContent().appendChild(this.elm);
    this.setOptions(this.options)
};
JAK.Vector.Circle.prototype.setCenter = function (a) {
    this.center = a;
    this.canvas.setCenterRadius(this.elm, this.center, this.radius)
};
JAK.Vector.Circle.prototype.setOptions = function (a) {
    var b = {};
    "outlineColor" in a && (b.color = a.outlineColor);
    "outlineWidth" in a && (b.width = a.outlineWidth);
    "outlineOpacity" in a && (b.opacity = a.outlineOpacity);
    "outlineStyle" in a && (b.style = a.outlineStyle);
    "outlineEndCap" in a && (b.endCap = a.outlineEndCap);
    "outlineExactStyle" in a && (b.exactStyle = a.outlineExactStyle);
    var c = {};
    "color" in a && (c.color = a.color);
    "opacity" in a && (c.opacity = a.opacity);
    this.canvas.setStroke(this.elm, b);
    this.canvas.setFill(this.elm, c)
};
JAK.Vector.Circle.prototype.setRadius = function (a) {
    this.radius = a;
    this.canvas.setCenterRadius(this.elm, this.center, this.radius)
};
JAK.Vector.Ellipse = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Ellipse", VERSION: "1.0", EXTEND: JAK.Vector.Circle});
JAK.Vector.Ellipse.prototype._method = "ellipse";
JAK.Vector.Path = JAK.ClassMaker.makeClass({NAME: "JAK.Vector.Path", VERSION: "1.0", EXTEND: JAK.Vector.Primitive});
JAK.Vector.Path.prototype.$constructor = function (a, b, c) {
    this.canvas = a;
    this.elm2 = null;
    this.options = {
        color: "none",
        opacity: 1,
        width: 0,
        style: JAK.Vector.STYLE_SOLID,
        outlineColor: "#fff",
        outlineOpacity: 1,
        outlineWidth: 1,
        outlineStyle: JAK.Vector.STYLE_SOLID,
        title: ""
    };
    for (var d in c) this.options[d] = c[d];
    a = this.options.width && !b.match(/z/i);
    this.elm = this.canvas.path();
    this.setFormat(b);
    a && (this.elm2 = this.canvas.path(), this.setFormat(b), this.canvas.setTitle(this.elm2, this.options.title));
    this.canvas.setTitle(this.elm,
        this.options.title);
    this.elm2 && this.canvas.getContent().appendChild(this.elm2);
    this.canvas.getContent().appendChild(this.elm);
    this.setOptions(this.options)
};
JAK.Vector.Path.prototype.$destructor = function () {
    this.elm.parentNode && 1 == this.elm.parentNode.nodeType && this.elm.parentNode.removeChild(this.elm);
    this.elm2 && this.elm2.parentNode && 1 == this.elm2.parentNode.nodeType && this.elm2.parentNode.removeChild(this.elm2)
};
JAK.Vector.Path.prototype.setFormat = function (a) {
    this.canvas.setFormat(this.elm, a);
    this.elm2 && this.canvas.setFormat(this.elm2, a)
};
JAK.Vector.Path.prototype.setOptions = function (a) {
    var b = {};
    "outlineColor" in a && (b.color = a.outlineColor);
    "outlineWidth" in a && (b.width = a.outlineWidth);
    "outlineOpacity" in a && (b.opacity = a.outlineOpacity);
    "outlineStyle" in a && (b.style = a.outlineStyle);
    "outlineEndCap" in a && (b.endCap = a.outlineEndCap);
    "outlineExactStyle" in a && (b.exactStyle = a.outlineExactStyle);
    var c = {};
    "color" in a && (c.color = a.color);
    "opacity" in a && (c.opacity = a.opacity);
    "width" in a && (c.width = a.width);
    "style" in a && (c.style = a.style);
    "endCap" in
    a && (c.endCap = a.endCap);
    "exactStyle" in a && (c.exactStyle = a.exactStyle);
    "fillRule" in a && (c.fillRule = a.fillRule);
    this.elm2 ? (b.width && (b.width = c.width + 2 * b.width), this.canvas.setStroke(this.elm, c), this.canvas.setStroke(this.elm2, b)) : (this.canvas.setStroke(this.elm, b), this.canvas.setFill(this.elm, c))
};
JAK.SVG = JAK.ClassMaker.makeClass({NAME: "SVG", VERSION: "3.0", EXTEND: JAK.Vector.Canvas});
JAK.SVG.isSupported = function () {
    return document.createElementNS && document.createElementNS(this.prototype.ns, "svg").style ? !0 : !1
};
JAK.SVG.prototype.ns = "http://www.w3.org/2000/svg";
JAK.SVG.prototype.xlinkns = "http://www.w3.org/1999/xlink";
JAK.SVG.prototype._styles = [[], [4, 3], [1, 2], [4, 2, 1, 2]];
JAK.SVG.prototype._lineEnds = ["round", "square"];
JAK.SVG.prototype.$constructor = function (a, b) {
    var c = document.createElementNS(this.ns, "svg");
    c.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", this.xlinkns);
    var d = document.createElementNS(this.ns, "g");
    c.appendChild(d);
    this.ec = [];
    this.ec.push(JAK.Events.addListener(c, "mousemove", JAK.Events.cancelDef));
    this.ec.push(JAK.Events.addListener(c, "mousedown", JAK.Events.cancelDef));
    this.ec.push(JAK.Events.addListener(c, "mouseup", JAK.Events.cancelDef));
    this.canvas = c;
    this.g = d;
    this.resize(a, b)
};
JAK.SVG.prototype.$destructor = function () {
    for (var a = 0; a < this.ec.length; a++) JAK.Events.removeListener(this.ec[a]);
    this.ec = [];
    this.canvas.parentNode && 1 == this.canvas.parentNode.nodeType && this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null
};
JAK.SVG.prototype.getContainer = function () {
    return this.canvas
};
JAK.SVG.prototype.getContent = function () {
    return this.g
};
JAK.SVG.prototype.setContent = function (a) {
    this.g = a
};
JAK.SVG.prototype.clear = function () {
    JAK.DOM.clear(this.g)
};
JAK.SVG.prototype.resize = function (a, b) {
    this.canvas.setAttribute("width", a);
    this.canvas.setAttribute("height", b)
};
JAK.SVG.prototype.setScale = function (a) {
    this.g.setAttribute("transform", "scale(" + a + ")")
};
JAK.SVG.prototype.polyline = function () {
    var a = document.createElementNS(this.ns, "polyline");
    a.setAttribute("fill", "none");
    a.setAttribute("stroke", "none");
    a.setAttribute("stroke-linejoin", "round");
    a.setAttribute("stroke-linecap", "round");
    return a
};
JAK.SVG.prototype.circle = function () {
    var a = document.createElementNS(this.ns, "circle");
    a.setAttribute("fill", "none");
    a.setAttribute("stroke", "none");
    return a
};
JAK.SVG.prototype.ellipse = function () {
    var a = document.createElementNS(this.ns, "ellipse");
    a.setAttribute("fill", "none");
    a.setAttribute("stroke", "none");
    return a
};
JAK.SVG.prototype.polygon = function () {
    var a = document.createElementNS(this.ns, "polygon");
    a.setAttribute("fill", "none");
    a.setAttribute("stroke", "none");
    a.setAttribute("stroke-linejoin", "round");
    a.setAttribute("stroke-linecap", "round");
    return a
};
JAK.SVG.prototype.path = function () {
    var a = document.createElementNS(this.ns, "path");
    a.setAttribute("fill", "none");
    a.setAttribute("stroke", "none");
    a.setAttribute("stroke-linejoin", "round");
    a.setAttribute("stroke-linecap", "round");
    return a
};
JAK.SVG.prototype.group = function () {
    return document.createElementNS(this.ns, "g")
};
JAK.SVG.prototype.setStroke = function (a, b) {
    "color" in b && a.setAttribute("stroke", b.color);
    "opacity" in b && a.setAttribute("stroke-opacity", b.opacity);
    "width" in b && a.setAttribute("stroke-width", b.width);
    if ("style" in b) {
        for (var c = parseFloat(a.getAttribute("stroke-width")), d = this._styles[b.style], e = d.length, f = []; e--;) f[e] = Math.max(1, d[e] * c + (e % 2 ? 1 : -1) * c);
        a.setAttribute("stroke-dasharray", f.join(" "))
    }
    "endCap" in b && a.setAttribute("stroke-linecap", this._lineEnds[b.endCap]);
    "exactStyle" in b && a.setAttribute("stroke-dasharray",
        b.exactStyle)
};
JAK.SVG.prototype.setFill = function (a, b) {
    "color" in b && a.setAttribute("fill", b.color);
    "opacity" in b && a.setAttribute("fill-opacity", b.opacity);
    "fillRule" in b && a.setAttribute("fill-rule", b.fillRule)
};
JAK.SVG.prototype.setCenterRadius = function (a, b, c) {
    a.setAttribute("cx", b.getX());
    a.setAttribute("cy", b.getY());
    c instanceof Array ? (a.setAttribute("rx", c[0]), a.setAttribute("ry", c[1])) : a.setAttribute("r", c)
};
JAK.SVG.prototype.setPoints = function (a, b, c) {
    b = b.map(function (a) {
        return a.join(" ")
    });
    a.setAttribute("points", b.join(", "))
};
JAK.SVG.prototype.setFormat = function (a, b) {
    a.setAttribute("d", b)
};
JAK.SVG.prototype.setTitle = function (a, b) {
    var c = a.getElementsByTagName("title");
    c.length ? c = c[0] : (c = document.createElementNS(this.ns, "title"), a.appendChild(c));
    JAK.DOM.clear(c);
    c.appendChild(document.createTextNode(b))
};
JAK.VML = JAK.ClassMaker.makeClass({NAME: "VML", VERSION: "4.0", EXTEND: JAK.Vector.Canvas});
JAK.VML.isSupported = function () {
    return "ie" == JAK.Browser.client
};
JAK.VML.prototype._styles = ["", "dash", "dot", "dashdot"];
JAK.VML.prototype._lineEnds = ["round", "square"];
JAK.VML.prototype.$constructor = function (a, b) {
    "ie" != JAK.Browser.client || document.namespaces.vml || (document.documentMode && 8 <= document.documentMode ? document.namespaces.add("vml", "urn:schemas-microsoft-com:vml", "#default#VML") : document.namespaces.add("vml", "urn:schemas-microsoft-com:vml"), document.createStyleSheet().cssText = "vml\\:*{behavior:url(#default#VML);");
    var c = JAK.mel("div", null, {display: "none"}), d = JAK.mel("div", null, {display: "none"});
    document.body.insertBefore(c, document.body.firstChild);
    document.body.insertBefore(d,
        document.body.firstChild);
    this.constructor.storage = c;
    this.constructor.tmp = d;
    this.canvas = JAK.mel("div", null, {position: "absolute", overflow: "hidden"});
    this.resize(a, b);
    this.clear()
};
JAK.VML.prototype.$destructor = function () {
    this.canvas.parentNode && 1 == this.canvas.parentNode.nodeType && this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null
};
JAK.VML.prototype.setScale = function (a) {
    this.canvas.style.zoom = a
};
JAK.VML.prototype.clear = function () {
    JAK.DOM.clear(this.canvas);
    var a = this._build("<vml:shape />");
    this.canvas.appendChild(a)
};
JAK.VML.prototype.resize = function (a, b) {
    this.canvas.style.width = a + "px";
    this.canvas.style.height = b + "px"
};
JAK.VML.prototype.getContainer = function () {
    return this.canvas
};
JAK.VML.prototype.getContent = function () {
    return this.canvas
};
JAK.VML.prototype.setContent = function (a) {
    this.canvas = a
};
JAK.VML.prototype.path = function () {
    var a = this._build("<vml:shape><vml:fill></vml:fill><vml:stroke endcap='round' joinstyle='round'></vml:stroke></vml:shape>");
    a.filled = !1;
    a.stroked = !1;
    a.style.position = "absolute";
    a.style.width = "1px";
    a.style.height = "1px";
    a.coordsize = "1,1";
    return a
};
JAK.VML.prototype.polyline = function () {
    var a = this._build("<vml:polyline><vml:fill></vml:fill><vml:stroke endcap='round' joinstyle='round'></vml:stroke></vml:polyline>");
    a.filled = !1;
    a.stroked = !1;
    return a
};
JAK.VML.prototype.polygon = function () {
    return this.polyline()
};
JAK.VML.prototype.circle = function () {
    var a = this._build("<vml:oval><vml:fill></vml:fill><vml:stroke></vml:stroke></vml:oval>");
    a.style.position = "absolute";
    a.filled = !1;
    a.stroked = !1;
    return a
};
JAK.VML.prototype.ellipse = JAK.VML.prototype.circle;
JAK.VML.prototype.group = function () {
    return JAK.mel("div")
};
JAK.VML.prototype.setStroke = function (a, b) {
    "color" in b && (a.strokecolor = b.color);
    "width" in b && b.width && (a.stroked = !0, a.strokeweight = b.width + "px");
    "opacity" in b && (a.getElementsByTagName("stroke")[0].opacity = b.opacity);
    "style" in b && (a.getElementsByTagName("stroke")[0].dashstyle = this._styles[b.style]);
    "endCap" in b && (a.getElementsByTagName("stroke")[0].endcap = this._lineEnds[b.endCap])
};
JAK.VML.prototype.setFill = function (a, b) {
    "color" in b && (a.filled = !0, a.fillcolor = b.color);
    "opacity" in b && (a.getElementsByTagName("fill")[0].opacity = b.opacity);
    "endCap" in b && (a.getElementsByTagName("fill")[0].endcap = this._lineEnds[b.endCap])
};
JAK.VML.prototype.setCenterRadius = function (a, b, c) {
    c instanceof Array ? (a.style.left = b.getX() - c[0] + "px", a.style.top = b.getY() - c[1] + "px", a.style.width = 2 * c[0] + "px", a.style.height = 2 * c[1] + "px") : (a.style.left = b.getX() - c + "px", a.style.top = b.getY() - c + "px", a.style.width = 2 * c + "px", a.style.height = 2 * c + "px")
};
JAK.VML.prototype.setPoints = function (a, b, c) {
    for (var d = [], e = 0; e < b.length; e++) d.push(b[e].join(" "));
    c && b.length && d.push(b[0].join(" "));
    a.points ? a.points.value = d.join(" ") : a.points = d.join(" ")
};
JAK.VML.prototype._analyzeFormat = function (a) {
    for (var b = [], c = 0, d = "", e = !1; c < a.length;) {
        var f = a.charAt(c);
        f.match(/[a-z]/i) ? (d && e.parameters.push(parseFloat(d)), e && b.push(e), e = {
            command: f,
            parameters: []
        }, d = "") : f.match(/[ ,]/) ? (d && e.parameters.push(parseFloat(d)), d = "") : d += f;
        c++
    }
    d && e.parameters.push(parseFloat(d));
    e && b.push(e);
    return b
};
JAK.VML.prototype._serializeFormat = function (a) {
    for (var b = "", c = 0; c < a.length; c++) var d = a[c], e = d.parameters.map(function (a) {
        return Math.round(a)
    }), b = b + (d.command + " " + e.join(" ") + " ");
    return b
};
JAK.VML.prototype._generateArc = function (a, b) {
    function c(a, b, c, d) {
        a = Math.atan2(b, a);
        c = Math.atan2(d, c);
        return c >= a ? c - a : 2 * Math.PI - (a - c)
    }

    function d(a) {
        a = 360 * a / (2 * Math.PI);
        return 65536 * a
    }

    var e = a[0], f = a[1], g = a[5], h = a[6], k = b.getX(), l = b.getY(), m = a[3], n = a[4], q, r, p, s = a[2],
        s = s * Math.PI / 180;
    q = Math.cos(s) * (k - g) / 2 + Math.sin(s) * (l - h) / 2;
    r = -Math.sin(s) * (k - g) / 2 + Math.cos(s) * (l - h) / 2;
    p = 0;
    p = e * e * f * f - e * e * r * r - f * f * q * q;
    0 > p ? (m = Math.sqrt(1 - p / (e * e * f * f)), e *= m, f *= m, p = 0) : (p = Math.sqrt(p / (e * e * r * r + f * f * q * q)), m == n && (p = -p));
    m = p * e * r / f;
    p =
        -p * f * q / e;
    k = Math.cos(s) * m - Math.sin(s) * p + (k + g) / 2;
    l = Math.sin(s) * m + Math.cos(s) * p + (l + h) / 2;
    s = c(1, 0, (q - m) / e, (r - p) / f);
    q = c((q - m) / e, (r - p) / f, (-q - m) / e, (-r - p) / f);
    !n && 0 < q ? q -= 2 * Math.PI : n && 0 > q && (q += 2 * Math.PI);
    b.setX(g);
    b.setY(h);
    return [k, l, e, f, -d(s), -d(q)]
};
JAK.VML.prototype._fixFormat = function (a) {
    var b = new JAK.Vec2d(0, 0);
    a = this._analyzeFormat(a);
    for (var c = 0; c < a.length; c++) {
        var d = a[c];
        switch (d.command) {
            case "M":
            case "L":
                b.setX(d.parameters[0]);
                b.setY(d.parameters[1]);
                break;
            case "C":
                b.setX(d.parameters[4]);
                b.setY(d.parameters[5]);
                break;
            case "z":
            case "Z":
                d.command = "X";
                break;
            case "A":
                d.command = "AE", d.parameters = this._generateArc(d.parameters, b)
        }
    }
    a.push({command: "E", parameters: []});
    return this._serializeFormat(a)
};
JAK.VML.prototype._build = function (a) {
    this.constructor.tmp.innerHTML = a;
    a = this.constructor.tmp.firstChild;
    this.constructor.storage.appendChild(a);
    return a
};
JAK.VML.prototype.setFormat = function (a, b) {
    var c = this._fixFormat(b);
    a.path = c
};
JAK.XML = JAK.ClassMaker.makeStatic({NAME: "JAK.XML", VERSION: "2.2"});
JAK.XML.textContent = function (a) {
    return a.textContent || a.text || ""
};
JAK.XML.childElements = function (a, b) {
    for (var c = [], d = a.childNodes, e = 0; e < d.length; e++) {
        var f = d[e];
        1 == f.nodeType && (b && b.toLowerCase() != f.nodeName.toLowerCase() || c.push(f))
    }
    return c
};
JAK.XML.createDocument = function (a) {
    if (!arguments.length) {
        if (document.implementation && document.implementation.createDocument) return document.implementation.createDocument("", "", null);
        if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLDOM");
        throw Error("Can't create XML Document");
    }
    if (window.DOMParser) return (new DOMParser).parseFromString(a, "text/xml");
    if (window.ActiveXObject) {
        var b = new ActiveXObject("Microsoft.XMLDOM");
        b.loadXML(a);
        return b
    }
    throw Error("No XML parser available");
};
JAK.XML.serializeDocument = function (a) {
    if (window.XMLSerializer) return (new XMLSerializer).serializeToString(a);
    if (a.xml) return a.xml;
    throw Error("XML document serialization available");
};
JAK.XML.RPC = JAK.ClassMaker.makeStatic({NAME: "JAK.XML.RPC", VERSION: "1.0"});
JAK.XML.RPC.parse = function (a) {
    return JAK.XMLRPC.parse(a)
};
JAK.Interpolator = JAK.ClassMaker.makeClass({
    NAME: "JAK.Interpolator",
    VERSION: "2.1",
    DEPEND: [{sClass: JAK.Timekeeper, ver: "1.0"}]
});
JAK.Interpolator.LINEAR = 1;
JAK.Interpolator.QUADRATIC = 2;
JAK.Interpolator.SQRT = 3;
JAK.Interpolator.SIN = 4;
JAK.Interpolator.ASIN = 5;
JAK.Interpolator.prototype.$constructor = function (a, b, c, d, e) {
    this.startVal = a;
    this.endVal = b;
    this.interval = c;
    this.callback = d;
    this.options = {interpolation: JAK.Interpolator.LINEAR, count: 1, endCallback: !1};
    this.running = !1;
    for (var f in e) this.options[f] = e[f]
};
JAK.Interpolator.prototype._call = function (a) {
    a = this._interpolate(a);
    this.callback(this.startVal + (this.endVal - this.startVal) * a)
};
JAK.Interpolator.prototype._interpolate = function (a) {
    if ("function" == typeof this.options.interpolation) return this.options.interpolation(a);
    switch (this.options.interpolation) {
        case JAK.Interpolator.QUADRATIC:
            return a * a;
        case JAK.Interpolator.SQRT:
            return Math.sqrt(a);
        case JAK.Interpolator.SIN:
            return (Math.sin(Math.PI * (a - 0.5)) + 1) / 2;
        case JAK.Interpolator.ASIN:
            return (Math.asin(2 * (a - 0.5)) + Math.PI / 2) / Math.PI;
        default:
            return a
    }
};
JAK.Interpolator.prototype.start = function () {
    this.running || (this.running = !0, this.startTime = (new Date).getTime(), this._call(0), JAK.Timekeeper.getInstance().addListener(this, "_tick", this.options.count))
};
JAK.Interpolator.prototype.stop = function () {
    this.running && (this.running = !1, JAK.Timekeeper.getInstance().removeListener(this))
};
JAK.Interpolator.prototype._tick = function () {
    var a = (new Date).getTime() - this.startTime;
    a >= this.interval ? (this.stop(), this._call(1), this.options.endCallback && this.options.endCallback()) : this._call(a / this.interval)
};
JAK.CSSInterpolator = JAK.ClassMaker.makeClass({NAME: "CSSInterpolator", VERSION: "2.0"});
JAK.CSSInterpolator.prototype.$constructor = function (a, b, c) {
    this.elm = a;
    this.properties = [];
    this.colors = [];
    this._tick = this._tick.bind(this);
    this.interpolator = new JAK.Interpolator(0, 1, b, this._tick, c)
};
JAK.CSSInterpolator.prototype.addProperty = function (a, b, c, d) {
    this.properties.push({property: a, startVal: b, endVal: c, suffix: d || ""})
};
JAK.CSSInterpolator.prototype.addColorProperty = function (a, b, c) {
    a = {startVal: JAK.Parser.color(b), endVal: JAK.Parser.color(c), property: a};
    this.colors.push(a)
};
JAK.CSSInterpolator.prototype.start = function () {
    this.interpolator.start()
};
JAK.CSSInterpolator.prototype.stop = function () {
    this.interpolator.stop()
};
JAK.CSSInterpolator.prototype._setOpacity = function (a, b, c) {
    var d = "";
    b = b.startVal + c * (b.endVal - b.startVal);
    "ie" == JAK.Browser.client && 9 > JAK.Browser.version ? (d = "filter", b = Math.round(100 * b), b = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + b + ");") : d = "opacity";
    a[d] = b
};
JAK.CSSInterpolator.prototype._tick = function (a) {
    for (var b = 0; b < this.properties.length; b++) {
        var c = this.properties[b];
        switch (c.property) {
            case "opacity":
                this._setOpacity(this.elm.style, c, a);
                break;
            default:
                var d = c.startVal + a * (c.endVal - c.startVal), d = d + c.suffix;
                this.elm.style[c.property] = d
        }
    }
    c = ["r", "g", "b"];
    for (b = 0; b < this.colors.length; b++) {
        for (var d = this.colors[b], e = [0, 0, 0], f = 0; f < c.length; f++) {
            var g = c[f];
            e[f] = d.startVal[g] + Math.round(a * (d.endVal[g] - d.startVal[g]))
        }
        e = "rgb(" + e.join(",") + ")";
        this.elm.style[d.property] =
            e
    }
};
JAK.RPC = JAK.ClassMaker.makeClass({NAME: "JAK.RPC", VERSION: "1.0", EXTEND: JAK.Request});
JAK.RPC.AUTO = 0;
JAK.RPC.JSON = 1;
JAK.RPC.XMLRPC = 2;
JAK.RPC.FRPC = 3;
JAK.RPC.FRPC_B64 = 4;
JAK.RPC.ACCEPT = {};
JAK.RPC.ACCEPT[JAK.RPC.JSON] = "application/json";
JAK.RPC.ACCEPT[JAK.RPC.XMLRPC] = "text/xml";
JAK.RPC.ACCEPT[JAK.RPC.FRPC] = "application/x-frpc";
JAK.RPC.ACCEPT[JAK.RPC.FRPC_B64] = "application/x-base64-frpc";
JAK.RPC.prototype.$constructor = function (a, b) {
    this._ERROR = 5;
    this._rpcType = a;
    this._rpcType == JAK.RPC.AUTO && (this._rpcType = JAK.RPC.FRPC_B64);
    var c = null;
    switch (this._rpcType) {
        case JAK.RPC.JSON:
        case JAK.RPC.FRPC_B64:
            c = JAK.Request.TEXT;
            break;
        case JAK.RPC.FRPC:
            c = JAK.Request.BINARY;
            break;
        case JAK.RPC.XMLRPC:
            c = JAK.Request.XML;
            break;
        default:
            throw Error("Unsupported RPC type " + this._rpcType);
    }
    this._rpcOptions = {timeout: 0, async: !0, endpoint: "/"};
    for (var d in b) this._rpcOptions[d] = b[d];
    this.$super(c, {
        timeout: this._rpcOptions.timeout,
        async: this._rpcOptions.async, method: "post"
    })
};
JAK.RPC.prototype.send = function (a, b, c) {
    if (!(b instanceof Array)) throw Error("RPC needs an array of data to be sent");
    if (this._rpcType == JAK.RPC.XMLRPC) return this.setHeaders({
        Accept: JAK.RPC.ACCEPT[this._rpcType],
        "Content-Type": "text/xml"
    }), a = JAK.XMLRPC.serializeCall(a, b, c), this.$super(this._rpcOptions.endpoint, a);
    this.setHeaders({Accept: JAK.RPC.ACCEPT[this._rpcType], "Content-Type": "application/x-base64-frpc"});
    a = JAK.FRPC.serializeCall(a, b, c);
    return this.$super(this._rpcOptions.endpoint, JAK.Base64.btoa(a))
};
JAK.RPC.prototype.setErrorCallback = function (a, b) {
    this._setCallback(a, b, this._ERROR);
    return this
};
JAK.RPC.prototype._done = function (a, b) {
    try {
        var c = this._rpcParse(a, b)
    } catch (d) {
        this._state = this._ERROR;
        this._userCallback(d, b, this);
        this._promise.reject({type: "frpc", request: this});
        return
    }
    this.$super(c, b)
};
JAK.RPC.prototype._rpcEscape = function (a) {
    return a.split(/\\/g).join("\\\\").split(/"/g).join('\\"')
};
JAK.RPC.prototype._rpcSerialize = function (a, b, c) {
    if (!a) return "";
    b = [];
    for (var d in a) {
        c = d;
        var e = a[d];
        if (e instanceof Array) if (c += "[]", e.length) for (var f = 0; f < e.length; f++) {
            var g = e[f], g = this._rpcSerializeValue(g, !1);
            b.push(encodeURIComponent(c) + "=" + encodeURIComponent(g))
        } else b.push(encodeURIComponent(c) + "="); else e = this._rpcSerializeValue(e, !1), b.push(encodeURIComponent(c) + "=" + encodeURIComponent(e))
    }
    return b.join("&")
};
JAK.RPC.prototype._rpcSerializeValue = function (a, b) {
    if (null === a) return "null";
    switch (typeof a) {
        case "boolean":
            return a;
        case "string":
            return '"' + this._rpcEscape(a) + '"';
        case "number":
            if (!b) return 0 < a ? Math.floor(a) : Math.ceil(a);
            var c = a.toString();
            -1 == c.indexOf(".") && (c += ".0");
            return c;
        case "object":
            if (!(a instanceof Date)) throw Error("Unserializable object " + a);
            return a.format("Y-m-d\\TH:i:sO");
        default:
            throw Error("Unserializable value " + a);
    }
};
JAK.RPC.prototype._rpcParse = function (a) {
    switch (this._rpcType) {
        case JAK.RPC.JSON:
            a = JSON.parse(a);
            if (!a.status && a.failure) throw Error("JSON/" + a.failure + ": " + a.failureMessage);
            return a;
        case JAK.RPC.FRPC:
            return JAK.FRPC.parse(a);
        case JAK.RPC.FRPC_B64:
            return a = JAK.Base64.atob(a), JAK.FRPC.parse(a);
        case JAK.RPC.XMLRPC:
            return this._rpcParseXML(a);
        default:
            throw Error("Unimplemented RPC type " + this._rpcType);
    }
};
JAK.RPC.prototype._rpcParseXML = function (a) {
    if (!a) return null;
    a = a.documentElement;
    if ("methodResponse" != a.nodeName) throw Error("Only XMLRPC method responses supported");
    a = JAK.XML.childElements(a)[0];
    var b = null;
    if ("fault" == a.nodeName) throw b = JAK.XML.childElements(a, "value")[0], Error(JSON.stringify(JAK.XML.RPC.parse(b)));
    b = JAK.XML.childElements(a, "param")[0];
    b = JAK.XML.childElements(b, "value")[0];
    return JAK.XML.RPC.parse(b)
};
JAK.FRPC = JAK.ClassMaker.makeStatic({NAME: "JAK.FRPC", VERSION: "1.2"});
JAK.FRPC.TYPE_MAGIC = 25;
JAK.FRPC.TYPE_CALL = 13;
JAK.FRPC.TYPE_RESPONSE = 14;
JAK.FRPC.TYPE_FAULT = 15;
JAK.FRPC.TYPE_INT = 1;
JAK.FRPC.TYPE_BOOL = 2;
JAK.FRPC.TYPE_DOUBLE = 3;
JAK.FRPC.TYPE_STRING = 4;
JAK.FRPC.TYPE_DATETIME = 5;
JAK.FRPC.TYPE_BINARY = 6;
JAK.FRPC.TYPE_INT8P = 7;
JAK.FRPC.TYPE_INT8N = 8;
JAK.FRPC.TYPE_STRUCT = 10;
JAK.FRPC.TYPE_ARRAY = 11;
JAK.FRPC.TYPE_NULL = 12;
JAK.FRPC._hints = null;
JAK.FRPC._path = [];
JAK.FRPC._data = [];
JAK.FRPC._pointer = 0;
JAK.FRPC.parse = function (a) {
    this._pointer = 0;
    this._data = a;
    a = this._getByte();
    var b = this._getByte();
    if (202 != a || 17 != b) throw this._data = [], Error("Missing FRPC magic");
    this._getByte();
    this._getByte();
    a = this._getInt(1) >> 3;
    if (a == JAK.FRPC.TYPE_FAULT) throw a = this._parseValue(), b = this._parseValue(), this._data = [], Error("FRPC/" + a + ": " + b);
    b = null;
    switch (a) {
        case JAK.FRPC.TYPE_RESPONSE:
            b = this._parseValue();
            if (this._pointer < this._data.length) throw this._data = [], Error("Garbage after FRPC data");
            break;
        case JAK.FRPC.TYPE_CALL:
            a =
                this._getInt(1);
            a = this._decodeUTF8(a);
            for (b = []; this._pointer < this._data.length;) b.push(this._parseValue());
            this._data = [];
            return {method: a, params: b};
        default:
            throw this._data = [], Error("Unsupported FRPC type " + a);
    }
    this._data = [];
    return b
};
JAK.FRPC.serializeCall = function (a, b, c) {
    b = this.serialize(b, c);
    b.shift();
    b.shift();
    a = this._encodeUTF8(a);
    b.unshift.apply(b, a);
    b.unshift(a.length);
    b.unshift(JAK.FRPC.TYPE_CALL << 3);
    b.unshift(202, 17, 2, 1);
    return b
};
JAK.FRPC.serialize = function (a, b) {
    var c = [];
    this._path = [];
    this._hints = b;
    this._serializeValue(c, a);
    this._hints = null;
    return c
};
JAK.FRPC._parseValue = function () {
    var a = this._getInt(1), b = a >> 3;
    switch (b) {
        case this.TYPE_STRING:
            return a = this._getInt((a & 7) + 1), this._decodeUTF8(a);
        case this.TYPE_STRUCT:
            b = {};
            for (a = this._getInt((a & 7) + 1); a--;) this._parseMember(b);
            return b;
        case this.TYPE_ARRAY:
            b = [];
            for (a = this._getInt((a & 7) + 1); a--;) b.push(this._parseValue());
            return b;
        case this.TYPE_BOOL:
            return a & 1 ? !0 : !1;
        case this.TYPE_INT:
            var a = a & 7, c = Math.pow(2, 8 * a), b = this._getInt(a);
            b >= c / 2 && (b -= c);
            return b;
        case this.TYPE_DATETIME:
            this._getByte();
            b = this._getInt(4);
            for (a = 0; 5 > a; a++) this._getByte();
            return new Date(1E3 * b);
        case this.TYPE_DOUBLE:
            return this._getDouble();
        case this.TYPE_BINARY:
            a = this._getInt((a & 7) + 1);
            for (b = []; a--;) b.push(this._getByte());
            return b;
        case this.TYPE_INT8P:
            return this._getInt((a & 7) + 1);
        case this.TYPE_INT8N:
            return -this._getInt((a & 7) + 1);
        case this.TYPE_NULL:
            return null;
        default:
            throw Error("Unkown FRPC type " + b);
    }
};
JAK.FRPC._append = function (a, b) {
    for (var c = b.length, d = 0; d < c; d++) a.push(b[d])
};
JAK.FRPC._parseMember = function (a) {
    var b = this._getInt(1), b = this._decodeUTF8(b);
    a[b] = this._parseValue()
};
JAK.FRPC._getInt = function (a) {
    for (var b = 0, c = 1, d = 0; d < a; d++) b += c * this._getByte(), c *= 256;
    return b
};
JAK.FRPC._getByte = function () {
    if (this._pointer + 1 > this._data.length) throw Error("Cannot read byte from buffer");
    return this._data[this._pointer++]
};
JAK.FRPC._decodeUTF8 = function (a) {
    var b = a, c = "";
    if (!a) return c;
    for (var d = a = 0, e = 0, f = String.fromCharCode, g = this._data, h = this._pointer; !(b--, a = g[h], h += 1, 128 > a ? c += f(a) : 191 < a && 224 > a ? (d = g[h], h += 1, c += f((a & 31) << 6 | d & 63), b -= 1) : 240 > a ? (d = g[h++], e = g[h++], c += f((a & 15) << 12 | (d & 63) << 6 | e & 63), b -= 2) : 248 > a ? (h += 3, b -= 3) : 252 > a ? (h += 4, b -= 4) : (h += 5, b -= 5), 0 >= b);) ;
    this._pointer = h + b;
    return c
};
JAK.FRPC._encodeUTF8 = function (a) {
    for (var b = [], c = 0; c < a.length; c++) {
        var d = a.charCodeAt(c);
        128 > d ? b.push(d) : (127 < d && 2048 > d ? b.push(d >> 6 | 192) : (b.push(d >> 12 | 224), b.push(d >> 6 & 63 | 128)), b.push(d & 63 | 128))
    }
    return b
};
JAK.FRPC._getDouble = function () {
    for (var a = [], b = 8; b--;) a[b] = this._getByte();
    var c = a[0] & 128 ? 1 : 0, d = (a[0] & 127) << 4, d = d + (a[1] >> 4);
    if (0 == d) return 0 * Math.pow(-1, c);
    var e = 0, f = 1, g = 3, b = 1;
    do e += (a[f] & 1 << g ? 1 : 0) * Math.pow(2, -b), b++, g--, 0 > g && (g = 7, f++); while (f < a.length);
    if (2047 == d) return e ? NaN : Infinity * Math.pow(-1, c);
    d -= 1023;
    return Math.pow(-1, c) * Math.pow(2, d) * (1 + e)
};
JAK.FRPC._serializeValue = function (a, b) {
    if (null === b) a.push(JAK.FRPC.TYPE_NULL << 3); else switch (typeof b) {
        case "string":
            var c = this._encodeUTF8(b), d = this._encodeInt(c.length), e = JAK.FRPC.TYPE_STRING << 3,
                e = e + (d.length - 1);
            a.push(e);
            this._append(a, d);
            this._append(a, c);
            break;
        case "number":
            "float" == this._getHint() ? (e = JAK.FRPC.TYPE_DOUBLE << 3, c = this._encodeDouble(b)) : (e = 0 < b ? JAK.FRPC.TYPE_INT8P : JAK.FRPC.TYPE_INT8N, e <<= 3, c = this._encodeInt(Math.abs(b)), e += c.length - 1);
            a.push(e);
            this._append(a, c);
            break;
        case "boolean":
            c =
                JAK.FRPC.TYPE_BOOL << 3;
            b && (c += 1);
            a.push(c);
            break;
        case "object":
            b instanceof Date ? this._serializeDate(a, b) : b instanceof Array ? this._serializeArray(a, b) : this._serializeStruct(a, b);
            break;
        default:
            throw Error("FRPC does not allow value " + b);
    }
};
JAK.FRPC._serializeArray = function (a, b) {
    if ("binary" == this._getHint()) {
        var c = JAK.FRPC.TYPE_BINARY << 3, d = this._encodeInt(b.length), c = c + (d.length - 1);
        a.push(c);
        this._append(a, d);
        this._append(a, b)
    } else for (c = JAK.FRPC.TYPE_ARRAY << 3, d = this._encodeInt(b.length), c += d.length - 1, a.push(c), this._append(a, d), c = 0; c < b.length; c++) this._path.push(c), this._serializeValue(a, b[c]), this._path.pop()
};
JAK.FRPC._serializeStruct = function (a, b) {
    var c = 0, d;
    for (d in b) c++;
    var e = JAK.FRPC.TYPE_STRUCT << 3, c = this._encodeInt(c), e = e + (c.length - 1);
    a.push(e);
    this._append(a, c);
    for (d in b) e = this._encodeUTF8(d), a.push(e.length), this._append(a, e), this._path.push(d), this._serializeValue(a, b[d]), this._path.pop()
};
JAK.FRPC._serializeDate = function (a, b) {
    a.push(JAK.FRPC.TYPE_DATETIME << 3);
    var c = b.getTimezoneOffset() / 15;
    0 > c && (c += 256);
    a.push(c);
    c = Math.round(b.getTime() / 1E3);
    if (0 > c || c >= Math.pow(2, 31)) c = -1;
    0 > c && (c += Math.pow(2, 32));
    for (c = this._encodeInt(c); 4 > c.length;) c.push(0);
    this._append(a, c);
    var c = b.getFullYear() - 1600, c = Math.max(c, 0), c = Math.min(c, 2047), d = b.getMonth() + 1, e = b.getDate(),
        f = b.getDay(), g = b.getHours(), h = b.getMinutes(), k = b.getSeconds();
    a.push((k & 31) << 3 | f & 7);
    a.push((h & 63) << 1 | (k & 32) >> 5 | (g & 1) << 7);
    a.push((g &
        30) >> 1 | (e & 15) << 4);
    a.push((e & 31) >> 4 | (d & 15) << 1 | (c & 7) << 5);
    a.push((c & 2040) >> 3)
};
JAK.FRPC._encodeInt = function (a) {
    if (!a) return [0];
    for (var b = []; a;) {
        var c = a % 256;
        a = (a - c) / 256;
        b.push(c)
    }
    return b
};
JAK.FRPC._encodeDouble = function (a) {
    var b = [], c, d, e;
    if (isNaN(a)) d = 2047, e = 1, c = 0; else if (Infinity === a || -Infinity === a) d = 2047, e = 0, c = 0 > a ? 1 : 0; else if (0 === a) e = d = 0, c = -Infinity === 1 / a ? 1 : 0; else {
        c = 0 > a;
        var f = Math.abs(a);
        f >= Math.pow(2, -1022) ? (a = Math.min(Math.floor(Math.log(f) / Math.LN2), 1023), d = a + 1023, e = f * Math.pow(2, 52 - a) - Math.pow(2, 52)) : (d = 0, e = f / Math.pow(2, -1074))
    }
    f = [];
    for (a = 52; 0 < a; a--) f.push(e % 2 ? 1 : 0), e = Math.floor(e / 2);
    for (a = 11; 0 < a; a--) f.push(d % 2 ? 1 : 0), d = Math.floor(d / 2);
    f.push(c ? 1 : 0);
    for (c = a = 0; f.length;) a += (1 << c) *
        f.shift(), c++, 8 == c && (b.push(a), c = a = 0);
    return b
};
JAK.FRPC._getHint = function () {
    return this._hints ? "object" != typeof this._hints ? this._hints : this._hints[this._path.join(".")] || null : null
};
JAK.Base64 = JAK.ClassMaker.makeStatic({NAME: "JAK.Base64", VERSION: "1.0"});
JAK.Base64.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
JAK.Base64.INDEXED_ALPHABET = JAK.Base64.ALPHABET.split("");
JAK.Base64.ASSOCIATED_ALPHABET = {};
for (var i = 0; i < JAK.Base64.ALPHABET.length; i++) JAK.Base64.ASSOCIATED_ALPHABET[JAK.Base64.ALPHABET.charAt(i)] = i;
JAK.Base64.atob = function (a) {
    for (var b = [], c, d, e, f, g = a.replace(/\s/g, "").split(""), h = 0, k = g.length; h < k; h += 4) c = JAK.Base64.ASSOCIATED_ALPHABET[g[h]], d = JAK.Base64.ASSOCIATED_ALPHABET[g[h + 1]], a = JAK.Base64.ASSOCIATED_ALPHABET[g[h + 2]], f = JAK.Base64.ASSOCIATED_ALPHABET[g[h + 3]], c = c << 2 | d >> 4, d = (d & 15) << 4 | a >> 2, e = (a & 3) << 6 | f, b.push(c), 64 != a && b.push(d), 64 != f && b.push(e);
    return b
};
JAK.Base64.btoa = function (a) {
    var b = [], c, d, e, f, g, h, k = 0, l = a.length;
    do c = k < a.length ? a[k++] : NaN, d = k < a.length ? a[k++] : NaN, e = k < a.length ? a[k++] : NaN, f = c >> 2, c = (c & 3) << 4 | d >> 4, g = (d & 15) << 2 | e >> 6, h = e & 63, isNaN(d) ? g = h = 64 : isNaN(e) && (h = 64), b.push(JAK.Base64.INDEXED_ALPHABET[f]), b.push(JAK.Base64.INDEXED_ALPHABET[c]), b.push(JAK.Base64.INDEXED_ALPHABET[g]), b.push(JAK.Base64.INDEXED_ALPHABET[h]); while (k < l);
    return b.join("")
};
JAK.CSS3 = JAK.ClassMaker.makeStatic({NAME: "JAK.CSS3", VERSION: "1.0"});
JAK.CSS3._node = JAK.mel("div");
JAK.CSS3.PREFIXES = ["", "ms", "Webkit", "O", "Moz"];
JAK.CSS3.getProperty = function (a) {
    var b = this.getPrefix(this._normalize(a));
    return null === b ? null : (b ? "-" + b.toLowerCase() + "-" : "") + a
};
JAK.CSS3.set = function (a, b, c) {
    b = this._normalize(b);
    var d = this.getPrefix(b);
    if (null === d) return !1;
    b = d ? d + b.charAt(0).toUpperCase() + b.substring(1) : b;
    a.style[b] = c;
    return !0
};
JAK.CSS3.getPrefix = function (a) {
    for (var b = 0; b < this.PREFIXES.length; b++) {
        var c = this.PREFIXES[b];
        if ((c ? c + a.charAt(0).toUpperCase() + a.substring(1) : a) in this._node.style) return c
    }
    return null
};
JAK.CSS3._normalize = function (a) {
    return a.replace(/-([a-z])/g, function (a, c) {
        return c.toUpperCase()
    })
};
JAK.XMLRPC = JAK.ClassMaker.makeStatic({NAME: "JAK.XMLRPC", VERSION: "1.0"});
JAK.XMLRPC.serializeCall = function (a, b, c) {
    this._method = a;
    this._data = b;
    this._path = [];
    this._doc = JAK.XML.createDocument();
    a = this._doc.createElement("methodCall");
    var d = this._doc.createElement("methodName");
    d.appendChild(this._doc.createTextNode(this._method));
    a.appendChild(d);
    this._doc.appendChild(a);
    this._params = this._doc.createElement("params");
    a.appendChild(this._params);
    this._serialize(b, c);
    return JAK.XML.serializeDocument(this._doc)
};
JAK.XMLRPC.parse = function (a) {
    return this._valueToObject(a)
};
JAK.XMLRPC._serialize = function (a, b) {
    this._path = [];
    this._hints = b;
    for (var c = 0; c < a.length; c++) {
        this._path.push(c);
        var d = this._doc.createElement("param");
        this._serializeValue(d, a[c]);
        this._path.pop();
        this._params.appendChild(d)
    }
    this._hints = null
};
JAK.XMLRPC._serializeValue = function (a, b) {
    var c = this._doc.createElement("value");
    if (null === b) c.appendChild(this._doc.createElement("nil")), a.appendChild(param); else {
        var d, e;
        switch (typeof b) {
            case "string":
                e = this._doc.createTextNode(b);
                d = this._doc.createElement("string");
                d.appendChild(e);
                break;
            case "number":
                e = this._doc.createTextNode(b);
                d = "float" == this._getHint() ? this._doc.createElement("double") : this._doc.createElement("int");
                d.appendChild(e);
                break;
            case "boolean":
                e = this._doc.createTextNode(b ? 1 : 0);
                d =
                    this._doc.createElement("boolean");
                d.appendChild(e);
                break;
            case "object":
                b instanceof Date ? (b = b.toISOString(), e = this._doc.createTextNode(b), d = this._doc.createElement("dateTime.iso8601"), d.appendChild(e)) : b instanceof Array ? d = this._serializeArray(e, b) : (d = this._doc.createElement("struct"), this._serializeObject(d, b));
                break;
            default:
                throw Error("XMLRPC does not allow value " + b);
        }
        c.appendChild(d);
        a.appendChild(c)
    }
};
JAK.XMLRPC._serializeArray = function (a, b) {
    if ("binary" == this._getHint()) {
        var c = this._doc.createElement("base64");
        b = this._doc.createElement("value");
        var d = this._doc.createTextNode(JAK.Base64.btoa(b));
        b.appendChild(d);
        c.appendChild(b)
    } else {
        c = this._doc.createElement("array");
        d = this._doc.createElement("data");
        c.appendChild(d);
        for (var e = 0; e < b.length; e++) this._path.push(e), this._serializeValue(d, b[e]), this._path.pop()
    }
    return c
};
JAK.XMLRPC._serializeObject = function (a, b) {
    for (var c in b) {
        var d = this._doc.createElement("member"), e = this._doc.createElement("name"), f = this._doc.createTextNode(c);
        e.appendChild(f);
        d.appendChild(e);
        this._path.push(c);
        this._serializeValue(d, b[c]);
        this._path.pop();
        a.appendChild(d)
    }
};
JAK.XMLRPC._valueToObject = function (a) {
    a = JAK.XML.childElements(a)[0];
    switch (a.nodeName) {
        case "string":
            return JAK.XML.textContent(a);
        case "base64":
            return JAK.Base64.atob(JAK.XML.textContent(a).trim());
        case "i4":
        case "i8":
        case "int":
            return parseInt(a.firstChild.nodeValue);
        case "double":
            return parseFloat(a.firstChild.nodeValue);
        case "boolean":
            return "1" == a.firstChild.nodeValue;
        case "array":
            return this._arrayToObject(a);
        case "struct":
            return this._structToObject(a);
        case "nil":
            return null;
        case "dateTime.iso8601":
            a =
                JAK.XML.textContent(a).trim().match(/(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})(.)(\d{2})(\d{2})/);
            a[7] = "+" == a[7] ? "1" : "-1";
            for (var b = 1; b < a.length; b++) a[b] = parseInt(a[b], 10);
            b = new Date(a[1], a[2] - 1, a[3], a[4], a[5], a[6], 0);
            a = a[7] * (60 * a[8] + a[9]);
            a += b.getTimezoneOffset();
            b = b.getTime();
            return new Date(b - 6E4 * a);
        default:
            throw Error("Unknown XMLRPC node " + a.nodeName);
    }
};
JAK.XMLRPC._arrayToObject = function (a) {
    var b = [];
    a = JAK.XML.childElements(a)[0];
    a = JAK.XML.childElements(a);
    for (var c = 0; c < a.length; c++) b.push(this._valueToObject(a[c]));
    return b
};
JAK.XMLRPC._structToObject = function (a) {
    var b = {};
    a = JAK.XML.childElements(a);
    for (var c = 0; c < a.length; c++) {
        var d = a[c], e = JAK.XML.childElements(d, "name")[0], e = JAK.XML.textContent(e),
            d = JAK.XML.childElements(d, "value")[0];
        b[e] = this._valueToObject(d)
    }
    return b
};
JAK.XMLRPC._getHint = function () {
    return this._hints ? "object" != typeof this._hints ? this._hints : this._hints[this._path.join(".")] || null : null
};
var SMap = JAK.ClassMaker.makeClass({NAME: "SMap", VERSION: "1.0"});
SMap.MOUSE_PAN = 1;
SMap.MOUSE_WHEEL = 2;
SMap.MOUSE_ZOOM_IN = 4;
SMap.MOUSE_ZOOM_OUT = 8;
SMap.MOUSE_ZOOM = SMap.MOUSE_ZOOM_IN + SMap.MOUSE_ZOOM_OUT;
SMap.KB_PAN = 1;
SMap.KB_ZOOM = 2;
SMap.LAYER_TILE = 0;
SMap.LAYER_SHADOW = 1;
SMap.LAYER_GEOMETRY = 2;
SMap.LAYER_MARKER = 3;
SMap.LAYER_ACTIVE = 4;
SMap.LAYER_HUD = 5;
SMap.NORTH = 0;
SMap.WEST = 1;
SMap.SOUTH = 2;
SMap.EAST = 3;
SMap.DEF_BASE = 1;
SMap.DEF_TURIST = 2;
SMap.DEF_OPHOTO = 3;
SMap.DEF_HYBRID = 4;
SMap.DEF_HISTORIC = 5;
SMap.DEF_BIKE = 6;
SMap.DEF_TRAIL = 7;
SMap.DEF_OPHOTO0203 = 8;
SMap.DEF_OPHOTO0406 = 9;
SMap.DEF_OBLIQUE = 12;
SMap.DEF_SMART_BASE = 14;
SMap.DEF_SMART_OPHOTO = 15;
SMap.DEF_SMART_TURIST = 16;
SMap.DEF_RELIEF = 17;
SMap.DEF_PANO = 18;
SMap.DEF_TURIST_WINTER = 19;
SMap.DEF_SMART_WINTER = 20;
SMap.DEF_SUMMER = 21;
SMap.DEF_SMART_SUMMER = 22;
SMap.DEF_GEOGRAPHY = 23;
SMap.DEF_OPHOTO1012 = 24;
SMap.DEF_HYBRID_SPARSE = 25;
SMap.DEF_OPHOTO1415 = 26;
SMap.DEF_BASE_NEW = 27;
SMap.DEF_TURIST_NEW = 28;
SMap.GEOMETRY_POLYLINE = 0;
SMap.GEOMETRY_POLYGON = 1;
SMap.GEOMETRY_CIRCLE = 2;
SMap.GEOMETRY_ELLIPSE = 3;
SMap.GEOMETRY_PATH = 4;
SMap.MAPSET_BASE = 1;
SMap.MAPSET_TURIST = 3;
SMap.TRANSFORM = "";
SMap.prototype.$constructor = function (a, b, c, d) {
    if (JAK.Browser.isOld()) a.style.textAlign = "center", a.innerHTML = "Bohu\u017eel pou\u017e\u00edv\u00e1te star\u00fd webov\u00fd prohl\u00ed\u017ee\u010d, kter\u00fd nepodporuje mapov\u00e9 API Mapy.cz. Zkuste pou\u017e\u00edt jeden z <a href='//napoveda.seznam.cz/cz/podporovane-internetove-prohlizece.html'>podporovan\u00fdch prohl\u00ed\u017ee\u010d\u016f</a>."; else {
        this._ec = [];
        this._options = {
            minZoom: 2, maxZoom: 18, animTime: 500, zoomTime: 300, rotationTime: 300,
            orientation: SMap.NORTH, projection: new SMap.Projection.Mercator, ophotoDate: !0
        };
        for (var e in d) this._options[e] = d[e];
        this._dom = {container: a};
        this._layers = [];
        this._cursor = [];
        this.controlLayer = !1;
        this.controls = [];
        this._card = null;
        this._lock = 0;
        this._eventCoords = null;
        this._projection = this._options.projection;
        this._availability = {oblique: {}, ophoto: {}};
        this._zoomAnimation = {
            sourceZoom: null,
            targetZoom: null,
            fixedPoint: null,
            ts: null,
            disabledLayers: [],
            enabledLayers: []
        };
        this._rotationAnimation = {
            sourceAngle: null, targetAngle: null,
            targetOrientation: null, ts: null, disabledLayers: [], enabledLayers: []
        };
        this._panAnimation = {ts: null, sourceCoords: null, targetCoords: null};
        this._rafCallbacks = [];
        this._rafTick = this._rafTick.bind(this);
        this._padding = {left: 0, right: 0, top: 0, bottom: 0};
        this._signals = new JAK.Signals;
        this._size = null;
        this._offset = new SMap.Pixel(0, 0);
        this._zoom = 2 < arguments.length ? Number(c) : 8;
        this._center = b || SMap.Coords.fromPP(135118848, 134987776);
        this._orientation = this._options.orientation;
        this._build();
        this._projection.setOwner(this);
        this.syncPort();
        this.addControl(new SMap.Control.MapyLogo, {right: "0px", bottom: "0px"});
        e = ["msTransform", "transform", "WebkitTransform", "MozTransform", "OTransform"];
        for (var f = 0; f < e.length; f++) e[f] in document.body.style && (this.constructor.TRANSFORM = e[f]);
        this._options.ophotoDate && new SMap.OphotoDate(this)
    }
};
SMap.prototype.$destructor = function () {
    for (; this.controls.length;) {
        var a = this.controls[0];
        this.removeControl(a);
        a.$destructor()
    }
    this.controlLayer.$destructor();
    this.controlLayer = null;
    this._card && (this._card.$destructor(), this._card = null);
    JAK.Events.removeListeners(this._ec);
    JAK.DOM.clear(this._dom.container);
    this._dom = {};
    this._layers = []
};
SMap.prototype.createDefaultDataProvider = function () {
    var a = new SMap.DataProvider;
    a.setOwner(this);
    var b = (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest ? SMap.CONFIG.base : "") + "/";
    ["poiagg"].forEach(function (c) {
        c = new SMap.POIServer.FRPC(b + c, {zoomCorrection: 0});
        c.setOwner(this);
        c.getPOIParams();
        a.addPOIServer(c)
    }, this);
    return a
};
SMap.prototype.lock = function () {
    this._lock || this._signals.makeEvent("map-lock", this);
    this._lock++
};
SMap.prototype.unlock = function () {
    if (!this._lock) throw Error("Cannot unlock unlocked map");
    this._lock--;
    this._lock || (this._signals.makeEvent("map-unlock", this), this._redraw(!1))
};
SMap.prototype.getSignals = function () {
    return this._signals
};
SMap.prototype.getZoomRange = function () {
    return [this._options.minZoom, this._options.maxZoom]
};
SMap.prototype.setZoomRange = function (a, b) {
    this._options.minZoom = a;
    this._options.maxZoom = b;
    var c = Math.max(a, this._zoom), c = Math.min(b, c);
    c != this._zoom && this.setZoom(c);
    this._signals.makeEvent("zoom-range-change", this)
};
SMap.prototype.redraw = function () {
    this._redraw(!1)
};
SMap.prototype.getOrientation = function () {
    return this._orientation
};
SMap.prototype.setOrientation = function (a, b) {
    if (!this._zoomAnimation.ts && (this._rotationAnimation.ts || a != this._orientation)) return this._options.rotationTime && !1 !== b && SMap.TRANSFORM ? this._rotationAnimation.ts ? this._rotationAnimationTarget(a) : this._rotationAnimationStart(a) : (this._orientation = a, this._redraw(!0)), this
};
SMap.prototype.setProjection = function (a) {
    this._projection && this._projection.setOwner(null);
    this._projection = a;
    this._projection.setOwner(this);
    this._redraw(!0);
    return this
};
SMap.prototype.getContainer = function () {
    return this._dom.container
};
SMap.prototype.getContent = function () {
    return this._dom.content
};
SMap.prototype.getSize = function () {
    return this._size
};
SMap.prototype.getProjection = function () {
    return this._projection
};
SMap.prototype.getOffset = function () {
    return this._offset
};
SMap.prototype.getGeometryCanvas = function () {
    return this._geometryCanvas
};
SMap.prototype.setCursor = function (a, b, c) {
    a ? ("chrome" == JAK.Browser.client && 2 < arguments.length && (a = a.replace(/,/, " " + b + " " + c + ",")), this._cursor.push(a)) : this._cursor.length && this._cursor.pop();
    this._dom.content.style.cursor = this._cursor.length ? this._cursor[this._cursor.length - 1] : ""
};
SMap.prototype.setCenter = function (a, b) {
    this._panAnimation.ts || b && this._options.animTime ? (a instanceof SMap.Pixel && (a = a.clone().scale(-1).toCoords(this)), this._panAnimation.ts || (this._signals.makeEvent("center-start", this), this.lock(), this._rafAdd("_panAnimationStep")), this._panAnimation.ts = (new Date).getTime(), this._panAnimation.sourceCoords = this._center, this._panAnimation.targetCoords = a, this._signals.makeEvent("map-pan", this)) : (this._signals.makeEvent("center-start", this), this.setCenterZoom(a, this._zoom,
        !1), this._signals.makeEvent("map-pan", this), this._signals.makeEvent("center-stop", this));
    return this
};
SMap.prototype.zoomChange = function (a) {
    return this._newZoom(this._zoom, a) != this._zoom
};
SMap.prototype.setZoom = function (a, b, c) {
    if (this._rotationAnimation.ts) return this;
    this._card && this._card.isVisible() ? b = this._card.getAnchor() : b || (b = new SMap.Pixel(0, 0));
    b instanceof SMap.Coords && (b = b.toPixel(this));
    if (this._zoomAnimation.ts || c && this._options.zoomTime) return this._zoomAnimation.ts ? a = this._newZoom(this._zoomAnimation.targetZoom, a) : (a = this._newZoom(this._zoom, a), this.zoomAnimationStart(b)), this.zoomAnimationTarget(a), this;
    a = this._newZoom(this._zoom, a);
    if (a == this._zoom) return this;
    b = this._newCenter(a,
        b);
    return this.setCenterZoom(b, a, !1)
};
SMap.prototype.setCenterZoom = function (a, b, c) {
    b = this._newZoom(this._zoom, b);
    if (c) {
        if (b == this._zoom) return this.setCenter(a, !0);
        a = this._fixedPoint(a, b);
        return this.setZoom(b, a, !0)
    }
    a instanceof SMap.Pixel && (a = a.clone().scale(-1).toCoords(this));
    a = this._adjustCenter(a, b);
    b == this._zoom ? (b = a.toPixel(this).scale(-1), this._center = a, a = this._offset.plus(b), this._setOffset(a) || this._lock || this._redraw(!1)) : (c = this._zoom, this._zoom = b, this._center = a, 21 == c ? (this._orientation != SMap.NORTH && this.setOrientation(SMap.NORTH),
        this.setProjection(new SMap.Projection.Mercator)) : this._redraw(!0));
    return this
};
SMap.prototype.getCenter = function () {
    return this._center
};
SMap.prototype.getZoom = function () {
    return this._zoom
};
SMap.prototype.computeCenterZoom = function (a, b) {
    for (var c = Infinity, d = Infinity, e = -Infinity, f = -Infinity, g = 0; g < a.length; g++) var h = a[g].toWGS84(), c = Math.min(c, h[0]), d = Math.min(d, h[1]), e = Math.max(e, h[0]), f = Math.max(f, h[1]);
    g = (c + e) / 2;
    h = (d + f) / 2;
    c = e - c;
    d = f - d;
    f = this._size.x;
    e = this._size.y;
    b && (f -= this._padding.left, f -= this._padding.right, e -= this._padding.top, e -= this._padding.bottom);
    var k = this._projection.getWorldSize(0), d = Math.min(360 * f / (k.x * c), 180 * e / (k.y * d)),
        d = Math.floor(Math.log(d) / Math.LN2), d = Math.min(d,
        this._options.maxZoom), f = SMap.Coords.fromWGS84(g, h);
    b && d < 1 / 0 && (g = -(this._padding.left - this._padding.right) / 2, h = -(this._padding.top - this._padding.bottom) / 2, f = f.toPixel(this, d), f.plus(new SMap.Pixel(g, h)), f = f.toCoords(this, d));
    return [f, d]
};
SMap.prototype.addLayer = function (a, b) {
    if (-1 != this._layers.indexOf(a)) throw Error("Layer " + a + " is already added");
    this._layers.push(a);
    var c = a.getContainer(), d;
    for (d in c) {
        if (!(d in this._dom.layers)) throw Error("Cannot append layer component to map");
        var e = d == SMap.LAYER_GEOMETRY ? this._geometryCanvas.getContent() : this._dom.layers[d], f = [].concat(c[d]);
        b && f.reverse();
        for (var g = 0; g < f.length; g++) {
            var h = f[g];
            b ? e.insertBefore(h, e.firstChild) : e.appendChild(h)
        }
    }
    a.setOwner(this);
    return a
};
SMap.prototype.removeLayer = function (a) {
    var b = this._layers.indexOf(a);
    if (-1 == b) throw Error("Cannot find layer to be removed");
    a.setOwner(null);
    this._layers.splice(b, 1);
    var b = a.getContainer(), c;
    for (c in b) for (var d = [].concat(b[c]), e = 0; e < d.length; e++) d[e].parentNode.removeChild(d[e]);
    return a
};
SMap.prototype.getLayer = function (a) {
    for (var b = 0; b < this._layers.length; b++) {
        var c = this._layers[b];
        if (c.getId() == a) return c
    }
    return null
};
SMap.prototype.getLayerContainer = function (a) {
    return this._dom.layers[a]
};
SMap.prototype.addControl = function (a, b) {
    this.controls.push(a);
    var c = a.getContainer();
    if (c) {
        var d = a instanceof SMap.Control.Pointer;
        b && (b.left || b.right || b.top || b.bottom) && (b.left = b.left || "auto", b.right = b.right || "auto", b.top = b.top || "auto", b.bottom = b.bottom || "auto");
        this.controlLayer.addItem(c, b, d)
    }
    a.setOwner(this)
};
SMap.prototype.getControls = function () {
    return this.controls
};
SMap.prototype.removeControl = function (a) {
    var b = this.controls.indexOf(a);
    if (-1 != b) {
        var c = a.getContainer();
        c && this.controlLayer.removeItem(c);
        a.setOwner(null);
        this.controls.splice(b, 1)
    }
};
SMap.prototype.addCard = function (a, b, c) {
    this.removeCard();
    this._card = a;
    var d = a.getContainer();
    d.style.visibility = "hidden";
    this._dom.content.appendChild(d);
    a.setOwner(this);
    a.anchorTo(b);
    d.style.visibility = "visible";
    this._signals.makeEvent("card-open", this._card);
    c || a.makeVisible()
};
SMap.prototype.removeCard = function () {
    if (this._card) {
        var a = this._card.getContainer();
        a.parentNode.removeChild(a);
        this._signals.makeEvent("card-close", this._card);
        this._card = null
    }
};
SMap.prototype.getCard = function () {
    return this._card
};
SMap.prototype.syncPort = function () {
    var a = new SMap.Pixel(this._dom.container.clientWidth, this._dom.container.clientHeight);
    this._size && this._size.x == a.x && this._size.y == a.y || (this._size = a, this._geometryCanvas.resize(this._size.x, this._size.y), this._lock ? this._setOffset(this._offset) : (this._setOffset(new SMap.Pixel(0, 0)), this._center = this._adjustCenter(this._center, this._zoom), this._redraw(!0)), this._signals.makeEvent("port-sync", this, this.getSize()))
};
SMap.prototype.setPadding = function (a, b) {
    this._padding[a] = b
};
SMap.prototype.getPadding = function (a) {
    return this._padding[a]
};
SMap.prototype.getMap = function () {
    return this
};
SMap.prototype.addDefaultLayer = function (a) {
    var b = SMap.CONFIG, c = null;
    switch (a) {
        case SMap.DEF_OBLIQUE:
            b = b[a];
            c = new SMap.Layer.Tile.Oblique(a, b.url, b.options);
            c.setCopyright(b.copyright);
            break;
        case SMap.DEF_SMART_BASE:
            c = new SMap.Layer.Smart(a, this);
            break;
        case SMap.DEF_SMART_OPHOTO:
            c = new SMap.Layer.Smart(a, this, {base: SMap.DEF_OPHOTO});
            break;
        case SMap.DEF_SMART_WINTER:
            c = new SMap.Layer.Smart(a, this, {base: SMap.DEF_TURIST_WINTER});
            break;
        case SMap.DEF_SMART_TURIST:
            c = new SMap.Layer.Smart.Turist(a, this);
            break;
        case SMap.DEF_SMART_SUMMER:
            c = new SMap.Layer.Smart(a, this, {base: SMap.DEF_SUMMER});
            break;
        default:
            if (!(a in b)) throw Error("Invalid default layer id " + a);
            b = b[a];
            c = SMap.Layer.Tile;
            a == SMap.DEF_PANO && (c = SMap.Pano.Layer);
            if (a == SMap.DEF_TURIST || a == SMap.DEF_TURIST_NEW) c = SMap.Layer.Turist;
            c = new c(a, b.url, b.options);
            c.setCopyright(b.copyright)
    }
    this.addLayer(c);
    return c
};
SMap.prototype.addDefaultContextMenu = function () {
    var a = new SMap.Control.ContextMenu;
    this.addControl(a);
    a.addItem(new SMap.Control.ContextMenu.Coords);
    a.addItem(new SMap.Control.ContextMenu.Separator);
    a.addItem(new SMap.Control.ContextMenu.Zoom("P\u0159ibl\u00ed\u017eit", 1));
    a.addItem(new SMap.Control.ContextMenu.Zoom("Odd\u00e1lit", -1));
    this._signals.addListener(null, "map-contextmenu", function (b) {
        a.open(b.data.event)
    });
    return a
};
SMap.prototype.addDefaultControls = function (a) {
    var b = {}, c;
    for (c in a) {
        var d = a[c];
        c in b || (b[c] = {});
        for (var e in d) b[c][e] = d[e]
    }
    this.addControl(new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM, b.Mouse));
    this.addControl(new SMap.Control.Keyboard(SMap.KB_PAN | SMap.KB_ZOOM, b.Keyboard));
    this.addControl(new SMap.Control.Selection(2));
    this.addControl(new SMap.Control.ZoomNotification);
    a = new SMap.Control.Compass({title: "Posun mapy"});
    this.addControl(a);
    a = new SMap.Control.Zoom({
        2: "Sv\u011bt",
        5: "St\u00e1ty", 8: "Kraje", 11: "M\u011bsta", 14: "Obce", 17: "Ulice", 20: "Domy", 21: "Pta\u010d\u00ed pohled"
    }, {titles: ["P\u0159ibl\u00ed\u017eit", "Odd\u00e1lit"]});
    this.addControl(a);
    this.setPadding("right", this.getPadding("right") + 73 + 8 + 2);
    a = new SMap.Control.Scale;
    this.addControl(a);
    this.setCursor("move");
    JAK.DOM.addClass(this._dom.container, "smap-defaults")
};
SMap.prototype.formatString = function (a, b) {
    var c = this._center.toWGS84(), d = this._size.clone().scale(0.5),
        e = (new SMap.Pixel(-d.x - 20, d.y + 20)).toCoords(this).toWGS84(),
        f = (new SMap.Pixel(-d.x - 20, -d.y - 20)).toCoords(this).toWGS84(),
        g = (new SMap.Pixel(d.x + 20, d.y + 20)).toCoords(this).toWGS84(),
        d = (new SMap.Pixel(d.x + 20, -d.y - 20)).toCoords(this).toWGS84(), h = Math.min(e[1], g[1]),
        k = Math.max(f[1], d[1]);
    this._size.x < this._projection.getWorldSize(this._zoom).x ? (f = Math.min(f[0], e[0]), g = Math.max(d[0], g[0])) : (f = -180, g = 180);
    var l = {
        cx: c[0].toFixed(6),
        cy: c[1].toFixed(6),
        lbx: e[0].toFixed(6),
        lby: e[1].toFixed(6),
        rtx: d[0].toFixed(6),
        rty: d[1].toFixed(6),
        lx: f.toFixed(6),
        rx: g.toFixed(6),
        by: h.toFixed(6),
        ty: k.toFixed(6),
        zoom: this._zoom,
        "zoom+1": this._zoom + 1,
        "zoom+2": this._zoom + 2,
        "zoom-1": this._zoom - 1,
        "zoom-2": this._zoom - 2,
        orientation: this._orientation
    };
    return a.replace(/{(.+?)}/g, function (a, c) {
        return c in l ? l[c] : b && c in b ? b[c] : a
    })
};
SMap.prototype.isObliqueAvailable = function (a) {
    a = (a || this._center).toUTM33();
    var b = a.join("-");
    if (!(b in this._availability.oblique)) {
        this._availability.oblique[b] = !1;
        for (var c = SMap.CONFIG.obliqueExtents || [], d = 0; d < c.length; d++) if (this._pointInPolygon(a, c[d])) {
            this._availability.oblique[b] = !0;
            break
        }
    }
    return this._availability.oblique[b]
};
SMap.prototype.isOphotoAvailable = function (a) {
    if (this.isObliqueAvailable(a)) return !0;
    a = (a || this._center).toUTM33();
    var b = a.join("-");
    if (!(b in this._availability.ophoto)) {
        this._availability.ophoto[b] = !1;
        for (var c = SMap.CONFIG.ophotoExtents || [], d = 0; d < c.length; d++) if (this._pointInPolygon(a, c[d])) {
            this._availability.ophoto[b] = !0;
            break
        }
    }
    return this._availability.ophoto[b]
};
SMap.prototype.adjustCoordsByPadding = function (a, b, c) {
    3 > arguments.length && (c = this._projection);
    2 > arguments.length && (b = this._zoom);
    var d = new SMap.Pixel((this._padding.right - this._padding.left) / 2, (this._padding.bottom - this._padding.top) / 2),
        d = c.project(a, b).plus(d);
    return c.unproject(d, b)
};
SMap.prototype.zoomAnimationStart = function (a, b) {
    var c = this._zoomAnimation;
    c.fixedPoint = a;
    for (var d = 0; d < this._layers.length; d++) {
        var e = this._layers[d];
        if (e.isActive() && !(e instanceof SMap.Layer.HUD)) if (e.supportsAnimation()) c.enabledLayers.push(e); else {
            c.disabledLayers.push(e);
            var e = e.getContainer(), f;
            for (f in e) [].concat(e[f]).forEach(function (a) {
                a.style.display = "none"
            })
        }
    }
    this._signals.makeEvent("zoom-start", this, {fixedPoint: a, touch: b})
};
SMap.prototype.zoomAnimationStep = function (a) {
    if (!(a < this._options.minZoom || a > this._options.maxZoom)) {
        for (var b = this._zoomAnimation, c = 0; c < b.enabledLayers.length; c++) b.enabledLayers[c].zoomTo(a, b.fixedPoint);
        this._signals.makeEvent("zoom-step", this, {currentZoom: a})
    }
};
SMap.prototype.zoomAnimationTarget = function (a, b) {
    2 > arguments.length && (b = this._zoom);
    a = this._newZoom(b, a);
    var c = this._zoomAnimation;
    c.ts ? a != c.targetZoom && (c.targetZoom = a) : (c.ts = (new Date).getTime(), c.targetZoom = a, c.sourceZoom = b, this._rafAdd("_zoomAnimationStep"))
};
SMap.prototype.zoomAnimationStop = function () {
    var a = this._zoomAnimation;
    a.ts = null;
    this._rafRemove("_zoomAnimationStep");
    for (var b = 0; b < a.enabledLayers.length; b++) a.enabledLayers[b].zoomTo(a.targetZoom, a.fixedPoint);
    b = this._newCenter(a.targetZoom, a.fixedPoint);
    this.setCenterZoom(b, a.targetZoom);
    a.disabledLayers.forEach(function (a) {
        a = a.getContainer();
        for (var b in a) [].concat(a[b]).forEach(function (a) {
            a.style.display = ""
        })
    });
    a.disabledLayers = [];
    a.enabledLayers = [];
    this._signals.makeEvent("zoom-stop", this)
};
SMap.prototype.getCopyrightControl = function () {
    for (var a = 0; a < this.controls.length; a++) if (this.controls[a] instanceof SMap.Control.Copyright) return this.controls[a];
    return null
};
SMap.prototype._zoomAnimationStep = function (a) {
    var b = this._zoomAnimation;
    a -= b.ts;
    var c = this._options.zoomTime;
    a >= c ? this.zoomAnimationStop() : this.zoomAnimationStep(b.sourceZoom + a / c * (b.targetZoom - b.sourceZoom))
};
SMap.prototype._pointInPolygon = function (a, b) {
    for (var c = 0, d = 0; d < b.length; d++) {
        var e = b[d ? d - 1 : b.length - 1], f = b[d];
        (e[1] <= a[1] && f[1] > a[1] || e[1] > a[1] && f[1] <= a[1]) && a[0] < e[0] + (a[1] - e[1]) / (f[1] - e[1]) * (f[0] - e[0]) && c++
    }
    return c & 1
};
SMap.prototype._newZoom = function (a, b) {
    var c = "number" == typeof b ? b : a + parseInt(b), c = Math.min(this._options.maxZoom, c);
    return c = Math.max(c, this._options.minZoom)
};
SMap.prototype._setOffset = function (a) {
    var b = !1;
    this._offset = a;
    a = this._projection.getWorldSize(this._zoom);
    a = this._offset.x % a.x;
    a != this._offset.x && (this._offset.x = a, b = !0);
    if (15E3 < Math.abs(this._offset.x) || 15E3 < Math.abs(this._offset.y)) this._offset = new SMap.Pixel(0, 0), b = !0;
    a = this._size.clone().scale(0.5).plus(this._offset);
    this._dom.content.style.left = a.x + "px";
    this._dom.content.style.top = a.y + "px";
    b && this._redraw(!0);
    return b
};
SMap.prototype._redraw = function (a) {
    var b = this._geometryCanvas.getContainer(), c = this._size.clone().scale(-0.5).minus(this._offset);
    b.style.left = c.x + "px";
    b.style.top = c.y + "px";
    this._layers.forEach(function (b) {
        b.redraw(a)
    });
    this._card && this._card.anchorTo(this._card.getAnchor());
    this._signals.makeEvent("map-redraw", this, {full: a})
};
SMap.prototype._buildLayers = function () {
    JAK.DOM.addClass(this._dom.container, "smap");
    this._dom.content = JAK.mel("div", {}, {position: "absolute", width: "0", height: "0", margin: "0", padding: "0"});
    JAK.DOM.append([this._dom.container, this._dom.content]);
    this._dom.layers = [];
    for (var a = SMap.LAYER_HUD, b = 0; b <= a; b++) {
        if (b == SMap.LAYER_GEOMETRY) var c = this._geometryCanvas.getContainer(); else c = JAK.mel("div"), b == SMap.LAYER_HUD && c.classList.add("hud");
        this._dom.layers[b] = c;
        (b < a ? this._dom.content : this._dom.container).appendChild(c)
    }
    this._ec.push(JAK.Events.addListener(this._dom.content,
        "mousedown", JAK.Events.cancelDef));
    "ie" == JAK.Browser.client && this._ec.push(JAK.Events.addListener(this._dom.content, "mousemove", JAK.Events.cancelDef));
    this._ec.push(JAK.Events.addListener(this._dom.content, "contextmenu", JAK.Events.cancelDef));
    this._ec.push(JAK.Events.addListener(this._dom.content, "mousedown", this, "_mousedown"));
    this._ec.push(JAK.Events.addListener(this._dom.content, "click", this, "_click"));
    this._ec.push(JAK.Events.addListener(this._dom.container, "mousedown", this, "_focus"));
    this._ec.push(JAK.Events.addListener(document,
        "mousedown", this, "_blur"))
};
SMap.prototype._buildControls = function () {
    this.controlLayer = new SMap.Layer.HUD;
    var a = this.controlLayer.getContainer();
    JAK.DOM.addClass(a[SMap.LAYER_HUD], "noprint");
    this.addLayer(this.controlLayer);
    this.controlLayer.enable();
    this.addControl(new SMap.Control.Copyright, {left: "5px", bottom: "3px"})
};
SMap.prototype._buildGeometryCanvas = function () {
    this._geometryCanvas = JAK.Vector.getCanvas(1, 1);
    this._geometryCanvas.getContainer().style.position = "absolute"
};
SMap.prototype._build = function () {
    this._buildGeometryCanvas();
    this._buildLayers();
    this._buildControls()
};
SMap.prototype._rotationAnimationStart = function (a) {
    var b = this._rotationAnimation;
    this._rotationAnimationTarget(a);
    for (var c = 0; c < this._layers.length; c++) {
        var d = this._layers[c];
        if (d.isActive() && !(d instanceof SMap.Layer.HUD)) if (d.supportsAnimation()) b.enabledLayers.push(d); else {
            b.disabledLayers.push(d);
            var d = d.getContainer(), e;
            for (e in d) [].concat(d[e]).forEach(function (a) {
                a.style.display = "none"
            })
        }
    }
    this._signals.makeEvent("rotation-start", this, {targetOrientation: a});
    b.ts = (new Date).getTime();
    this._rafAdd("_rotationAnimationStep")
};
SMap.prototype._rotationAnimationTarget = function (a) {
    var b = this._rotationAnimation;
    b.targetOrientation = a;
    b.sourceAngle = b.ts ? b.targetAngle : 0;
    a -= this._orientation;
    2 < Math.abs(a) && (a = -a / 3);
    b.targetAngle = 90 * a;
    180 <= b.targetAngle - b.sourceAngle && (b.targetAngle -= 360);
    180 <= b.sourceAngle - b.targetAngle && (b.targetAngle += 360)
};
SMap.prototype._rotationAnimationStep = function (a) {
    var b = this._rotationAnimation;
    a -= b.ts;
    var c = this._options.rotationTime;
    if (a >= c) this._rotationAnimationStop(); else {
        a = a / c * (b.targetAngle - b.sourceAngle) + b.sourceAngle;
        for (c = 0; c < b.enabledLayers.length; c++) b.enabledLayers[c].rotateTo(a);
        this._signals.makeEvent("rotation-step", this, {angle: a})
    }
};
SMap.prototype._rotationAnimationStop = function () {
    var a = this._rotationAnimation;
    a.ts = null;
    this._rafRemove("_rotationAnimationStep");
    for (var b = 0; b < a.enabledLayers.length; b++) a.enabledLayers[b].rotateTo(a.targetAngle);
    this._orientation = a.targetOrientation;
    this._redraw(!0);
    a.disabledLayers.forEach(function (a) {
        a = a.getContainer();
        for (var b in a) [].concat(a[b]).forEach(function (a) {
            a.style.display = ""
        })
    });
    a.disabledLayers = [];
    a.enabledLayers = [];
    this._signals.makeEvent("rotation-stop", this)
};
SMap.prototype._mousedown = function (a, b) {
    this._eventCoords = new SMap.Pixel(a.clientX, a.clientY)
};
SMap.prototype._click = function (a, b) {
    !this._eventCoords || 1.5 < (new SMap.Pixel(a.clientX, a.clientY)).distance(this._eventCoords) || (this._eventCoords = null, this._signals.makeEvent("map-click", this, {event: a}))
};
SMap.prototype._focus = function (a, b) {
    this._signals.makeEvent("map-focus", this);
    JAK.DOM.addClass(this._dom.container, "focus")
};
SMap.prototype._blur = function (a, b) {
    for (var c = JAK.Events.getTarget(a); c;) {
        if (c == this._dom.container) return;
        c = c.parentNode
    }
    JAK.DOM.removeClass(this._dom.container, "focus");
    this._signals.makeEvent("map-blur", this)
};
SMap.prototype._panAnimationStep = function (a) {
    var b = this._panAnimation;
    a = (a - b.ts) / this._options.animTime;
    if (1 <= a) b.ts = null, this._rafRemove("_panAnimationStep"), this.setCenter(b.targetCoords, !1), this.unlock(); else {
        var c = b.sourceCoords.toPixel(this), b = b.targetCoords.toPixel(this), b = c.plus(b.minus(c).scale(a));
        this.setCenterZoom(b.toCoords(this), this._zoom, !1)
    }
};
SMap.prototype._adjustCenter = function (a, b) {
    if (this._orientation != SMap.NORTH || !(this._projection instanceof SMap.Projection.Mercator)) return a;
    var c = a.toPixel(this, b), d = SMap.Coords.fromWGS84(0, 85), e = SMap.Coords.fromWGS84(0, -85),
        d = d.toPixel(this, b).minus(c).y, e = e.toPixel(this, b).minus(c).y, f = this._size.y / 2, g = d < -f,
        h = e > f;
    if (g ^ h) {
        if (!g) return c.plus(new SMap.Pixel(0, d + f)), c.toCoords(this, b);
        if (!h) return c.minus(new SMap.Pixel(0, f - e)), c.toCoords(this, b)
    } else return a
};
SMap.prototype._rafAdd = function (a) {
    -1 < this._rafCallbacks.indexOf(a) ? console.warn("RAF listener", a, "already added") : (this._rafCallbacks.length || requestAnimationFrame(this._rafTick), this._rafCallbacks.push(a))
};
SMap.prototype._rafRemove = function (a) {
    var b = this._rafCallbacks.indexOf(a);
    -1 == b ? console.warn("RAF listener", a, "does not exist") : this._rafCallbacks.splice(b, 1)
};
SMap.prototype._rafTick = function () {
    for (var a = Date.now(), b = this._rafCallbacks.slice(), c = 0; c < b.length; c++) this[b[c]](a);
    this._rafCallbacks.length && requestAnimationFrame(this._rafTick)
};
SMap.prototype._newCenter = function (a, b) {
    return b.toCoords(this).toPixel(this, a).minus(b).toCoords(this, a)
};
SMap.prototype._fixedPoint = function (a, b) {
    var c = Math.pow(2, b - this._zoom);
    return a.toPixel(this, b).scale(1 / (c - 1))
};
SMap.LAYER_VECTOR = SMap.LAYER_GEOMETRY;
SMap.DEF_SMART = SMap.DEF_SMART_BASE;
SMap.DEF_RELIEF_L = SMap.DEF_RELIEF;
SMap.DEF_RELIEF_H = SMap.DEF_RELIEF;
SMap.prototype.animate = function (a) {
    return this.setCenter(a, !0)
};
SMap.IOwned = JAK.ClassMaker.makeInterface({NAME: "SMap.IOwned", VERSION: "1.0"});
SMap.IOwned.prototype.getMap = function () {
    return this._owner ? this._owner.getMap() : null
};
SMap.IOwned.prototype.setOwner = function (a) {
    this._owner = a;
    return this
};
SMap.OphotoDate = JAK.ClassMaker.makeClass({NAME: "SMap.OphotoDate", VERSION: "1.0"});
SMap.OphotoDate.prototype.$constructor = function (a) {
    this._const = {OPHOTO: {}, URL: SMap.CONFIG.base + "/date", FOR_ZOOM: 9};
    this._const.OPHOTO.bing = "";
    this._const.OPHOTO[this._getLayerName(SMap.CONFIG[SMap.DEF_OPHOTO].url)] = "";
    this._const.OPHOTO[this._getLayerName(SMap.CONFIG[SMap.DEF_OPHOTO0203].url)] = "2003";
    this._const.OPHOTO[this._getLayerName(SMap.CONFIG[SMap.DEF_OPHOTO0406].url)] = "2006";
    this._const.OPHOTO[this._getLayerName(SMap.CONFIG[SMap.DEF_OPHOTO1012].url)] = "2012";
    this._const.OPHOTO[this._getLayerName(SMap.CONFIG[SMap.DEF_OPHOTO1415].url)] =
        "2015";
    this._map = a;
    this._isOphoto = !1;
    this._ophotoYear = "";
    this._getTimeout = {id: null, timeout: 500};
    this._data = {};
    this._copyrightControl = this._map.getCopyrightControl();
    this._map.getSignals().addListener(this, "layer-enable", "_layerEnable");
    this._map.getSignals().addListener(this, "layer-disable", "_layerDisable");
    this._map.getSignals().addListener(this, "map-redraw", "_mapRedraw")
};
SMap.OphotoDate.prototype._getLayerName = function (a) {
    return (a = a.match(/\/\/[^/]+\/([^/]+)\//)) && 1 <= a.length ? a[1] : ""
};
SMap.OphotoDate.prototype._layerEnable = function (a) {
    a = a.target;
    a instanceof SMap.Layer.Tile && (a = this._getLayerName(a.getURL()), a in this._const.OPHOTO && (this._isOphoto = !0, this._ophotoYear = this._const.OPHOTO[a], this._getDate()))
};
SMap.OphotoDate.prototype._layerDisable = function (a) {
    a = a.target;
    a instanceof SMap.Layer.Tile && this._getLayerName(a.getURL()) in this._const.OPHOTO && (this._isOphoto = !1, this._ophotoYear = "", this._hideDate())
};
SMap.OphotoDate.prototype._mapRedraw = function () {
    this._isOphoto && this._getDate()
};
SMap.OphotoDate.prototype._getDate = function () {
    if (this._map.getZoom() < this._const.FOR_ZOOM) this._hideDate(); else {
        var a = this._map.getCenter(), b = this._polygonTest(a.x, a.y);
        b ? this._setDate(b) : (this._getTimeout.id && (clearTimeout(this._getTimeout.id), this._getTimeout.id = null), this._getTimeout.id = setTimeout(function () {
            var b = [a.x, a.y];
            this._ophotoYear && b.push(this._ophotoYear);
            var d = new JAK.RPC(JAK.RPC.AUTO, {endpoint: this._const.URL});
            d.setCallback(function (a, b) {
                200 == b && 200 == a.status ? this._dateResponseOk(a) :
                    this._hideDate()
            }.bind(this));
            d.send("getOrtophotoDate", b, {0: "float", 1: "float"})
        }.bind(this), this._getTimeout.timeout))
    }
};
SMap.OphotoDate.prototype._dateResponseOk = function (a) {
    var b = a.date, c = [];
    (a.geom.data || []).forEach(function (a) {
        c.push(SMap.Coords.stringToCoords(a))
    });
    this._data[b] = {year: this._ophotoYear, multiPolygon: c};
    this._setDate(b)
};
SMap.OphotoDate.prototype._pointInPolygon = function (a, b, c) {
    for (var d = 0, e = 0; e < c.length; e++) {
        var f = c[e ? e - 1 : c.length - 1], g = c[e], h = Array.isArray(f), k = Array.isArray(g), l = h ? f[0] : f.x,
            f = h ? f[1] : f.y, h = k ? g[0] : g.x, g = k ? g[1] : g.y;
        (f <= b && g > b || f > b && g <= b) && a < l + (b - f) / (g - f) * (h - l) && d++
    }
    return d & 1
};
SMap.OphotoDate.prototype._pointInMultiPolygon = function (a, b, c) {
    for (var d = 0; d < c.length; d++) if (this._pointInPolygon(a, b, c[d])) return !0;
    return !1
};
SMap.OphotoDate.prototype._polygonTest = function (a, b) {
    var c = null;
    Object.keys(this._data).every(function (d) {
        var e = this._data[d];
        return e.year == this._ophotoYear && this._pointInMultiPolygon(a, b, e.multiPolygon) ? (c = d, !1) : !0
    }, this);
    return c
};
SMap.OphotoDate.prototype._setDate = function (a) {
    this._copyrightControl && this._copyrightControl.setDate(a)
};
SMap.OphotoDate.prototype._hideDate = function () {
    this._copyrightControl && this._copyrightControl.setDate("")
};
Number.prototype.mod = function (a) {
    var b = this % a;
    return 0 > b ? b + a : b
};
SMap.Util = {};
SMap.Util.stringToObject = function (a) {
    for (var b = a.split("."), c = window; b.length;) if (c = c[b.shift()], !c) throw Error("Undefined object '" + a + "'");
    return c
};
SMap.Util.mergeObject = function (a, b) {
    for (var c in a) c in b ? a[c].constructor == Object && b[c].constructor == Object ? arguments.callee(a[c], b[c]) : b[c] = a[c] : b[c] = a[c]
};
SMap.Util.linkToNewWindow = function (a) {
    if (!a) return !1;
    var b = (a.ctrlKey || a.metaKey) && (1 == a.which || 1 == a.button);
    return 2 == a.which || 4 == a.button || b ? (b && a.stopPropagation(), !0) : !1
};
SMap.Pixel = JAK.ClassMaker.makeClass({NAME: "SMap.Pixel", VERSION: "1.0"});
SMap.Pixel.prototype.$constructor = function (a, b) {
    this.x = parseFloat(a) || 0;
    this.y = parseFloat(b) || 0
};
SMap.Pixel.fromEvent = function (a, b) {
    var c = b.getContainer(), d = b.getSize().clone().scale(0.5), e = c.getBoundingClientRect(), f = e.left, e = e.top,
        f = f + (d.x + (c.clientLeft || 0)), e = e + (d.y + (c.clientTop || 0)), c = parseFloat(a.clientX - f) || 0,
        d = parseFloat(a.clientY - e) || 0;
    return new this(c, d)
};
SMap.Pixel.prototype.toCoords = function (a, b) {
    2 > arguments.length && (b = a.getZoom());
    return a.getProjection().pixelToCoords(this, a.getCenter(), b, a.getOrientation())
};
SMap.Pixel.prototype.plus = function (a) {
    this.x += parseFloat(a.x) || 0;
    this.y += parseFloat(a.y) || 0;
    return this
};
SMap.Pixel.prototype.minus = function (a) {
    this.x -= parseFloat(a.x) || 0;
    this.y -= parseFloat(a.y) || 0;
    return this
};
SMap.Pixel.prototype.clone = function () {
    return new SMap.Pixel(this.x, this.y)
};
SMap.Pixel.prototype.norm = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
};
SMap.Pixel.prototype.scale = function (a, b) {
    2 > arguments.length && (b = a);
    this.x *= parseFloat(a) || 0;
    this.y *= parseFloat(b) || 0;
    return this
};
SMap.Pixel.prototype.distance = function (a) {
    var b = this.x - a.x;
    a = this.y - a.y;
    return Math.sqrt(b * b + a * a)
};
SMap.Pixel.prototype.toString = function () {
    return "[" + this.x + "," + this.y + "]"
};
SMap.Pixel.prototype.toTile = function (a, b) {
    return a.getProjection().pixelToTile(this, a.getCenter(), a.getZoom(), a.getOrientation(), b)
};
SMap.Coords = JAK.ClassMaker.makeClass({NAME: "SMap.Coords", VERSION: "1.0"});
SMap.Coords.prototype.$constructor = function (a, b) {
    this.x = a || 0;
    this.y = b || 0
};
SMap.Coords._alphabet = "0ABCD2EFGH4IJKLMN6OPQRST8UVWXYZ-1abcd3efgh5ijklmn7opqrst9uvwxyz.";
SMap.Coords.fromEvent = function (a, b) {
    return SMap.Pixel.fromEvent(a, b).toCoords(b)
};
SMap.Coords.fromPP = function (a, b) {
    return this.fromUTM33(a / 32 + -37E5, b / 32 + 13E5)
};
SMap.Coords.fromUTM33 = function (a, b) {
    var c = Math.PI, d = 33, e = 6378137 * (1 - 1 / 298.257223563), f = (40680631590769 - e * e) / 40680631590769;
    Math.sqrt(f);
    Math.sqrt((40680631590769 - e * e) / (e * e));
    var e = (6378137 - e) / (6378137 + e),
        g = 6378137 * (1 - e) * (1 - e * e) * (1 + 2.25 * e * e + 3.984375 * Math.pow(e, 4)) * (c / 180),
        h = 1 * (a - 5E5), g = 1 * (b - 0) / 0.9996 * c / (180 * g),
        g = g + (3 * e / 2 - 27 * Math.pow(e, 3) / 32) * Math.sin(2 * g) + (21 * e * e / 16 - 55 * Math.pow(e, 4) / 32) * Math.sin(4 * g) + 151 * Math.pow(e, 3) / 96 * Math.sin(6 * g) + 1097 * Math.pow(e, 4) / 512 * Math.sin(8 * g),
        k = 6378137 * (1 - f) / Math.pow(1 -
            f * Math.sin(g) * Math.sin(g), 1.5), l = 6378137 / Math.sqrt(1 - f * Math.sin(g) * Math.sin(g)), e = l / k,
        f = Math.tan(g);
    a = h / (0.9996 * l);
    var l = f / (0.9996 * k) * (h * a / 2),
        m = f / (0.9996 * k) * (h * Math.pow(a, 3) / 24) * (-4 * e * e + 9 * e * (1 - f * f) + 12 * f * f),
        n = f / (0.9996 * k) * (h * Math.pow(a, 5) / 720) * (8 * Math.pow(e, 4) * (11 - 24 * f * f) - 12 * Math.pow(e, 3) * (21 - 71 * f * f) + 15 * e * e * (15 - 98 * f * f + 15 * Math.pow(f, 4)) + 180 * e * (5 * f * f - 3 * Math.pow(f, 4)) + 360 * Math.pow(f, 4)),
        h = f / (0.9996 * k) * (h * Math.pow(a, 7) / 40320) * (1385 + 3633 * f * f + 4095 * Math.pow(f, 4) + 1575 * Math.pow(f, 6)),
        h = 180 * (g - l + m - n + h) / c, l =
        1 / Math.cos(g), g = a * l, k = Math.pow(a, 3) / 6 * l * (e + 2 * f * f),
        e = Math.pow(a, 5) / 120 * l * (-4 * Math.pow(e, 3) * (1 - 6 * f * f) + e * e * (9 - 68 * f * f) + 72 * e * f * f + 24 * Math.pow(f, 4)),
        f = Math.pow(a, 7) / 5040 * l * (61 + 662 * f * f + 1320 * Math.pow(f, 4) + 720 * Math.pow(f, 6));
    return new this(180 * ((6 * d - 183) * c / 180 + (g - k + e - f)) / c, h)
};
SMap.Coords.fromWGS84 = function (a, b) {
    if (1 == arguments.length) {
        var c = this._splitWGS84(arguments[0]);
        a = c[0];
        b = c[1]
    }
    "string" == typeof a && (a = this._fromWGS84str(a));
    "string" == typeof b && (b = this._fromWGS84str(b));
    return new this(a, b)
};
SMap.Coords.fromJTSK = function (a, b) {
    if (!a || !b) return new this(0, 0);
    var c = 5, d = 49, e = 14, f = 0, g, h, k, l, m = function (a, b, c, d) {
        a -= c;
        b -= d;
        b = Math.sqrt(a * a + b * b) || 0;
        return 1E-4 > b ? 0 : b
    };
    do g = this.fromWGS84(e - c, d - c).toJTSK(), h = g[0] && g[1] ? m(g[0], g[1], a, b) : 1E32, g = this.fromWGS84(e + c, d - c).toJTSK(), k = g[0] && g[1] ? m(g[0], g[1], a, b) : 1E32, g = this.fromWGS84(e - c, d + c).toJTSK(), l = g[0] && g[1] ? m(g[0], g[1], a, b) : 1E32, g = this.fromWGS84(e + c, d + c).toJTSK(), g = g[0] && g[1] ? m(g[0], g[1], a, b) : 1E32, h <= k && h <= l && h <= g && (d -= c / 2, e -= c / 2), k <= h && k <= l && k <=
    g && (d -= c / 2, e += c / 2), l <= h && l <= k && l <= g && (d += c / 2, e -= c / 2), g <= h && g <= k && g <= l && (d += c / 2, e += c / 2), c *= 0.55, f += 4; while (!(1E-5 > c || 1E3 < f));
    return this.fromWGS84(e, d)
};
SMap.Coords.fromEXIF = function (a) {
    a = a.getTags();
    var b = a.GPSLongitude, c = a.GPSLatitude;
    if (!c || !b) throw Error("No GPS data in EXIF");
    for (var d = 0, e = 0, f = 1, g = 0; 3 > g; g++) d += b[g] / f, e += c[g] / f, f *= 60;
    a.GPSLongitudeRef && "W" == a.GPSLongitudeRef.toUpperCase() && (d = -d);
    a.GPSLatitudeRef && "S" == a.GPSLatitudeRef.toUpperCase() && (e = -e);
    return this.fromWGS84(d, e)
};
SMap.Coords._splitWGS84 = function (a) {
    a = a.match(/[nsew]|[^nsew]+/gi);
    if (4 != a.length) throw Error("Not a valid WGS84 string.");
    a = [a.slice(0, 2).join(""), a.slice(2).join("")];
    a[0].match(/[ns]/i) && a.reverse();
    return a
};
SMap.Coords._fromWGS84str = function (a) {
    var b = 0, c = a.match(/-?\d+([.,]\d*)?/g);
    if (!c) return b;
    for (var d = 1, e = 0; e < c.length; e++) var f = c[e].replace(/,/g, "."), b = b + parseFloat(f) / d, d = 60 * d;
    a.match(/[ws] *$/gi) && (b *= -1);
    return b
};
SMap.Coords.stringToCoords = function (a) {
    var b = [], c = [0, 0], d = 0;
    for (a = a.trim().split("").reverse(); a.length;) {
        var e = this._parseNumber(a, 1);
        48 == (e & 48) ? (e -= 48, e = ((e & 15) << 24) + this._parseNumber(a, 4), c[d] = e) : (32 == (e & 32) ? (e = ((e & 15) << 12) + this._parseNumber(a, 2), e -= 32768) : (e = ((e & 31) << 6) + this._parseNumber(a, 1), e -= 1024), c[d] += e);
        d && b.push(this.fromWGS84(360 * c[0] / 268435456 - 180, 180 * c[1] / 268435456 - 90));
        d = (d + 1) % 2
    }
    return b
};
SMap.Coords._parseNumber = function (a, b) {
    for (var c = 0, d = b; d;) {
        if (!a.length) throw Error("No data!");
        var e = a.pop(), e = this._alphabet.indexOf(e);
        -1 != e && (c <<= 6, c += e, d--)
    }
    return c
};
SMap.Coords.coordsToString = function (a) {
    for (var b = 0, c = 0, d = "", e = 0; e < a.length; e++) var f = a[e].toWGS84(), g = Math.round(268435456 * (f[0] + 180) / 360), f = Math.round(268435456 * (f[1] + 90) / 180), c = f - c, d = d + this._serializeNumber(g - b, g), d = d + this._serializeNumber(c, f), b = g, c = f;
    return d
};
SMap.Coords._serializeNumber = function (a, b) {
    var c = "";
    if (-1024 <= a && 1024 > a) c += this._alphabet.charAt(a + 1024 >> 6), c += this._alphabet.charAt(a + 1024 & 63); else {
        if (-32768 <= a && 32768 > a) var d = 131072 | a + 32768; else d = 805306368 | b & 268435455, c += this._alphabet.charAt(d >> 24 & 63), c += this._alphabet.charAt(d >> 18 & 63);
        c += this._alphabet.charAt(d >> 12 & 63);
        c += this._alphabet.charAt(d >> 6 & 63);
        c += this._alphabet.charAt(d & 63)
    }
    return c
};
SMap.Coords.stringToAltitude = function (a) {
    var b = [], c = 0;
    a = a.trim().split("").reverse();
    for (var d, e, f, g, h = function (a, b) {
        return a - b + (a >= b ? 1 : 0)
    }; a.length;) if (d = this._parseNumber(a, 1), 0 == (d & 32)) {
        e = 1 + ((d & 24) >> 3);
        d = (d & 7) - 3;
        for (f = 0; f < e; f++) b.push(c);
        4 != d && (c += d, b.push(c))
    } else 32 == (d & 48) ? (d = h(d & 15, 8), c += d) : 48 == (d & 56) ? (e = this._parseNumber(a, 1), d = h(d & 7, 4), g = h(e >> 3, 4), e = (e & 7) - (0 > g ? 4 : 3), c += d, b.push(c), c += g, b.push(c), c += e) : 56 == (d & 60) ? (e = this._parseNumber(a, 1), d = (d & 3) << 6, g = (e & 63) - 128, c += d + g) : (e = this._parseNumber(a,
        1), f = this._parseNumber(a, 1), d = (d & 3) << 12, g = (e & 63) << 6, e = (f & 63) - 8192, c += d + g + e), b.push(c);
    return b
};
SMap.Coords.prototype.toPixel = function (a, b) {
    2 > arguments.length && (b = a.getZoom());
    return a.getProjection().coordsToPixel(this, a.getCenter(), b, a.getOrientation())
};
SMap.Coords.prototype.clone = function () {
    return new SMap.Coords(this.x, this.y)
};
SMap.Coords.prototype.equals = function (a) {
    return this.x == a.x && this.y == a.y
};
SMap.Coords.prototype.azimuth = function (a) {
    var b = Math.PI / 180, c = 1 / b, d = (a.x - this.x) * b, e = this.y * b, f = Math.PI / 4;
    a = Math.log(Math.tan(a.y * b / 2 + f) / Math.tan(e / 2 + f));
    Math.abs(d) > Math.PI && (d = 0 < d ? -(2 * Math.PI - d) : 2 * Math.PI + d);
    return (Math.atan2(d, a) * c).mod(360)
};
SMap.Coords.prototype.distance = function (a, b) {
    var c = 6371009 + (b || 0), d = Math.abs(this.x - a.x), e = Math.abs(this.y - a.y), d = d * Math.PI / 180,
        e = e * Math.PI / 180, f = this.y * Math.PI / 180, g = a.y * Math.PI / 180,
        d = Math.sin(e / 2) * Math.sin(e / 2) + Math.cos(f) * Math.cos(g) * Math.sin(d / 2) * Math.sin(d / 2),
        d = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
    return c * d
};
SMap.Coords.prototype.distanceMiro = function (a, b) {
    var c = 1 / 298.257223563, d = 6378135 + (b || 0), e = Math.PI / 180, f = e * this.y, g = e * a.y, h = (f + g) / 2,
        k = (f - g) / 2, l = (-e * this.x - -e * a.x) / 2, e = Math.sin(k), g = Math.cos(l), f = Math.cos(h),
        m = Math.sin(l), h = Math.sin(h), k = Math.cos(k), l = e * e * g * g + f * f * m * m,
        g = k * k * g * g + h * h * m * m, m = Math.atan2(Math.sqrt(l), Math.sqrt(g)), n = Math.sqrt(l * g) / m;
    return 2 * m * d * (1 + (3 * n - 1) / (2 * g) * c * h * h * k * k - (3 * n + 1) / (2 * l) * c * f * f * e * e)
};
SMap.Coords.prototype.toString = function () {
    return "(" + this.x + "," + this.y + ")"
};
SMap.Coords.prototype.toWGS84 = function (a) {
    var b = [this.x, this.y];
    return "number" == typeof a ? this._formatWGS84(b, a) : b
};
SMap.Coords.prototype._formatWGS84 = function (a, b) {
    for (var c = [], d = ["\u00b0", "'", '"'], e = [["E", "W"], ["N", "S"]], f = Math.min(b, 2), g = 0; g < a.length; g++) {
        for (var h = 36E5, k = Math.round(h * Math.abs(a[g])), l = "", m = 0; m <= f; m++) {
            var n = k / h;
            m < f ? (n = Math.floor(n), k %= h) : n = n.toFixed(7 - 2 * f);
            h /= 60;
            l += n;
            l += d[m]
        }
        l += 0 < a[g] ? e[g][0] : e[g][1];
        c.push(l)
    }
    return c
};
SMap.Coords.prototype.toPP = function () {
    var a = this.toUTM33(), b = 32 * (a[1] - 13E5);
    return [Math.round(32 * (a[0] - -37E5)), Math.round(b)]
};
SMap.Coords.prototype.toUTM33 = function () {
    var a = Math.PI, b = this.y * a / 180, a = Math.PI, c = 6378137 * (1 - 1 / 298.257223563),
        d = (40680631590769 - c * c) / 40680631590769;
    Math.sqrt(d);
    Math.sqrt((40680631590769 - c * c) / (c * c));
    Math.pow((6378137 - c) / (6378137 + c), 4);
    var c = this.x - 15, c = c * a / 180, a = Math.tan(b),
        e = 6378137 * (1 - d) / Math.pow(1 - d * Math.sin(b) * Math.sin(b), 1.5),
        f = 6378137 / Math.sqrt(1 - d * Math.sin(b) * Math.sin(b)), g = f / e, e = Math.cos(b), h = Math.sin(b),
        k = 1 - d / 4 - 3 * d * d / 64 - 5 * Math.pow(d, 3) / 256,
        l = 0.375 * (d + d * d / 4 + 15 * Math.pow(d, 3) / 128), m = 0.05859375 *
        (d * d + 3 * Math.pow(d, 3) / 4), d = 35 * Math.pow(d, 3) / 3072,
        b = 6378137 * (k * b - l * Math.sin(2 * b) + m * Math.sin(4 * b) - d * Math.sin(6 * b)),
        d = c * c / 6 * e * e * (g - a * a),
        k = Math.pow(c, 4) / 120 * Math.pow(e, 4) * (4 * Math.pow(g, 3) * (1 - 6 * a * a) + g * g * (1 + 8 * a * a) - 2 * g * a * a + Math.pow(a, 4)),
        l = Math.pow(c, 6) / 5040 * Math.pow(e, 6) * (61 - 479 * a * a + 179 * Math.pow(a, 4) - Math.pow(a, 6)),
        d = 5E5 + 0.9996 * f * c * e * (1 + d + k + l) / 1, k = c * c / 2 * f * h * e,
        l = Math.pow(c, 4) / 24 * f * h * Math.pow(e, 3) * (4 * g * g + g - a * a),
        g = Math.pow(c, 6) / 720 * f * h * Math.pow(e, 5) * (8 * Math.pow(g, 4) * (11 - 24 * a * a) - 28 * Math.pow(g, 3) * (1 - 6 * a * a) + g *
            g * (1 - 32 * a * a) - 2 * g * a * a + Math.pow(a, 4)),
        c = Math.pow(c, 8) / 40320 * f * h * Math.pow(e, 7) * (1385 - 3111 * a * a + 543 * Math.pow(a, 4) - Math.pow(a, 6));
    return [d, 0.9996 * (b + k + l + g + c) / 1]
};
SMap.Coords.prototype.toJTSK = function () {
    var a = this.x, b = this.y;
    if (40 > b || 60 < b || 5 > a || 25 < a) return [0, 0];
    var c = Math.PI / 180, d = c * b, a = c * a, e = 6378137, b = 1 - Math.pow(1 - 1 / 298.257223563, 2),
        f = e / Math.sqrt(1 - b * Math.pow(Math.sin(d), 2)), e = (f + 0) * Math.cos(d) * Math.cos(a),
        g = (f + 0) * Math.cos(d) * Math.sin(a), b = ((1 - b) * f + 0) * Math.sin(d), d = 4.99821 * c / 3600,
        f = 1.58676 * c / 3600, a = 5.2611 * c / 3600, c = -570.69 + 0.999996457 * (+e + a * g - f * b),
        a = -85.69 + 0.999996457 * (-a * e + g + d * b), d = -462.84 + 0.999996457 * (+f * e - d * g + b),
        e = 6377397.15508, b = 299.152812853, f = b / (b - 1),
        g = Math.sqrt(Math.pow(c, 2) + Math.pow(a, 2)), b = 1 - Math.pow(1 - 1 / b, 2), h = Math.atan(d * f / g),
        k = Math.sin(h), h = Math.cos(h), e = (d + b * f * e * Math.pow(k, 3)) / (g - b * e * Math.pow(h, 3)),
        d = Math.atan(e);
    Math.sqrt(1 + e * e);
    Math.sqrt(1 + (1 - b) * e * e);
    a = 2 * Math.atan(a / (g + c));
    c = Math.sin(d);
    e = (1 - 0.081696831215303 * c) / (1 + 0.081696831215303 * c);
    e = Math.pow(1 + c, 2) / (1 - Math.pow(c, 2)) * Math.exp(0.081696831215303 * Math.log(e));
    e = 1.00685001861538 * Math.exp(1.000597498371542 * Math.log(e));
    b = (e - 1) / (e + 1);
    c = Math.sqrt(1 - b * b);
    a *= 1.000597498371542;
    e = Math.sin(a);
    d = Math.cos(a);
    a = 0.420215144586493 * d - 0.907424504992097 * e;
    b = 0.863499969506341 * b + 0.504348889819882 * c * (0.907424504992097 * d + 0.420215144586493 * e);
    e = Math.sqrt(1 - b * b);
    c = a * c / e;
    a = Math.sqrt(1 - c * c);
    c = 0.97992470462083 * Math.atan(c / a);
    f = 1.231023012797036E7 * Math.exp(-0.97992470462083 * Math.log((1 + b) / e));
    return [f * Math.cos(c), f * Math.sin(c)]
};
SMap.Coords.prototype.isValid = function () {
    var a = this.toWGS84();
    return 85 >= Math.abs(a[1])
};
SMap.Coords.prototype.inMap = function (a, b) {
    var c = a.getSize().clone().scale(0.5), d = c.clone().scale(-1);
    b && (d.x += a.getPadding("left"), d.y += a.getPadding("top"), c.y -= a.getPadding("bottom"), c.x -= a.getPadding("right"));
    var e = this.toPixel(a);
    return e.x >= d.x && e.x <= c.x && e.y >= d.y && e.y <= c.y
};
SMap.Coords.prototype.getAltitude = function () {
    var a = new JAK.RPC(JAK.RPC.AUTO, {endpoint: SMap.CONFIG.altitude});
    a.send("getAltitude", [[this.toWGS84()], 1, !1], {"0.0.0": "float", "0.0.1": "float"});
    return new JAK.Promise(function (b, c) {
        a.setCallback(function (a, e) {
            200 == e && 200 == a.status ? b(a.altitudeCode[0]) : c({data: a, status: e})
        });
        a.setErrorCallback(c)
    })
};
SMap.Coords.prototype.fromOLC = function (a) {
    a = OpenLocationCode.decode(a);
    return this.fromWGS84(a.longitudeCenter, a.latitudeCenter)
};
SMap.Coords.prototype.toOLC = function (a) {
    var b = this.toWGS84();
    return OpenLocationCode.encode(b[1], b[0], a)
};
SMap.Coords.fromMercator = function (a, b) {
    var c = 360 * (a / 4.007501668557849E7 + 0.5) - 180,
        d = 2 * Math.atan(Math.exp(b / 4.007501668557849E7 * Math.PI * 2)) - Math.PI / 2, d = 180 * d / Math.PI;
    return this.fromWGS84(c, d)
};
SMap.Coords.prototype.toMercator = function () {
    var a = this.toWGS84(), b = (a[0] + 180) / 360, a = a[1] * Math.PI / 180,
        a = Math.min(Math.max(Math.sin(a), -0.9999), 0.9999), a = Math.log((1 + a) / (1 - a)) / (4 * Math.PI);
    return [4.007501668557849E7 * (b - 0.5), 4.007501668557849E7 * a]
};
SMap.Tile = JAK.ClassMaker.makeClass({NAME: "SMap.Tile", VERSION: "1.0"});
SMap.Tile.prototype.$constructor = function (a, b, c, d) {
    this.tileSize = b;
    this.zoom = a;
    this.x = c;
    this.y = d
};
SMap.Tile.prototype.toString = function () {
    return this.zoom + "-" + this.x + "-" + this.y
};
SMap.Tile.prototype.clone = function () {
    return new SMap.Tile(this.zoom, this.tileSize, this.x, this.y)
};
SMap.Tile.prototype.toPixel = function (a) {
    return a.getProjection().tileToPixel(this, a.getCenter(), this.zoom, a.getOrientation())
};
SMap.Coords.prototype.fixedPoint = function (a, b) {
    return a._fixedPoint(this, b).toCoords(a)
};
SMap.Coords.prototype.newCenter = function (a, b) {
    return a._newCenter(b, this.toPixel(a))
};
SMap.Coords.prototype.wrap = function () {
    return this
};
SMap.Projection = JAK.ClassMaker.makeClass({NAME: "SMap.Projection", VERSION: "1.0", IMPLEMENT: SMap.IOwned});
SMap.Projection.prototype.$constructor = function () {
    this._owner = null;
    this._matrixSet = this._code = ""
};
SMap.Projection.prototype.getCode = function () {
    return this._code
};
SMap.Projection.prototype.getMatrixSet = function () {
    return this._matrixSet || this._code
};
SMap.Projection.prototype.getWorldSize = function (a) {
    a = Math.pow(2, a + 8);
    return new SMap.Pixel(a, a)
};
SMap.Projection.prototype.project = function (a, b) {
};
SMap.Projection.prototype.unproject = function (a, b) {
};
SMap.Projection.prototype.pixelToCoords = function (a, b, c, d) {
    a = this._pixelToAbsolutePixel(a, b, c, d);
    b = this.getWorldSize(c);
    a.x = a.x.mod(b.x);
    return this.unproject(a, c)
};
SMap.Projection.prototype.coordsToPixel = function (a, b, c, d) {
    a = this.project(a, c);
    return this._absolutePixelToPixel(a, b, c, d)
};
SMap.Projection.prototype.pixelToTile = function (a, b, c, d, e) {
    a = this._pixelToAbsolutePixel(a, b, c, d);
    b = this.getWorldSize(c);
    return 0 > a.y || a.y >= b.y ? null : new SMap.Tile(c, e, Math.floor(a.x / e), Math.floor(a.y / e))
};
SMap.Projection.prototype.tileToPixel = function (a, b, c, d) {
    var e = a.tileSize, f = a.x * a.tileSize;
    a = a.y * a.tileSize;
    var g = this._screenCoefficients;
    b = this.project(b, c);
    switch (d) {
        case SMap.NORTH:
            var h = new SMap.Pixel(f - b.x, a - b.y);
            -1 == g.x && (h.x = -h.x - e);
            -1 == g.y && (h.y = -h.y - e);
            break;
        case SMap.WEST:
            h = new SMap.Pixel(a - b.y, f - b.x);
            1 == g.y && (h.x = -h.x - e);
            -1 == g.x && (h.y = -h.y - e);
            break;
        case SMap.SOUTH:
            h = new SMap.Pixel(f - b.x, a - b.y);
            1 == g.x && (h.x = -h.x - e);
            1 == g.y && (h.y = -h.y - e);
            break;
        case SMap.EAST:
            h = new SMap.Pixel(a - b.y, f - b.x),
            -1 == g.y && (h.x = -h.x - e), 1 == g.x && (h.y = -h.y - e)
    }
    return h
};
SMap.Projection.prototype._pixelToAbsolutePixel = function (a, b, c, d) {
    b = this.project(b, c);
    c = this._screenCoefficients;
    switch (d) {
        case SMap.NORTH:
            b.x += c.x * a.x;
            b.y += c.y * a.y;
            break;
        case SMap.WEST:
            b.x += c.x * a.y;
            b.y -= c.y * a.x;
            break;
        case SMap.SOUTH:
            b.x -= c.x * a.x;
            b.y -= c.y * a.y;
            break;
        case SMap.EAST:
            b.x -= c.x * a.y, b.y += c.y * a.x
    }
    return b
};
SMap.Projection.prototype._absolutePixelToPixel = function (a, b, c, d) {
    b = this.project(b, c);
    c = this._screenCoefficients;
    switch (d) {
        case SMap.NORTH:
            return new SMap.Pixel(c.x * (a.x - b.x), c.y * (a.y - b.y));
        case SMap.WEST:
            return new SMap.Pixel(c.y * (b.y - a.y), c.x * (a.x - b.x));
        case SMap.SOUTH:
            return new SMap.Pixel(c.x * (b.x - a.x), c.y * (b.y - a.y));
        case SMap.EAST:
            return new SMap.Pixel(c.y * (a.y - b.y), c.x * (b.x - a.x))
    }
};
SMap.Projection.prototype._screenCoefficients = {x: 1, y: 1};
SMap.Projection.Mercator = JAK.ClassMaker.makeClass({
    NAME: "SMap.Projection.Mercator",
    VERSION: "1.0",
    EXTEND: SMap.Projection
});
SMap.Projection.Mercator.prototype.$constructor = function () {
    this.$super();
    this._code = "EPSG:3857";
    this._matrixSet = "wgs84:pseudomercator:epsg:3857"
};
SMap.Projection.Mercator.prototype.project = function (a, b) {
    var c = a.toWGS84(), d = this.getWorldSize(b), e = (c[0] + 180) / 360 * d.x, c = c[1] * Math.PI / 180,
        c = Math.min(Math.max(Math.sin(c), -0.9999), 0.9999),
        c = (1 - 0.5 * Math.log((1 + c) / (1 - c)) / Math.PI) / 2 * d.y;
    return new SMap.Pixel(e, c)
};
SMap.Projection.Mercator.prototype.unproject = function (a, b) {
    var c = this.getWorldSize(b), d = 360 * a.x / c.x - 180,
        c = 2 * Math.atan(Math.exp(Math.PI * (1 - 2 * a.y / c.y))) - Math.PI / 2, c = 180 * c / Math.PI;
    return SMap.Coords.fromWGS84(d, c)
};
SMap.Projection.UTM33 = JAK.ClassMaker.makeClass({
    NAME: "SMap.Projection.UTM33",
    VERSION: "1.0",
    EXTEND: SMap.Projection
});
SMap.Projection.UTM33.prototype._screenCoefficients = {x: 1, y: -1};
SMap.Projection.UTM33.prototype.$constructor = function () {
    this.$super();
    this._code = "EPSG:32633";
    this._matrixSet = "wgs84:utm33n:epsg:32633"
};
SMap.Projection.UTM33.prototype.project = function (a, b) {
    var c = a.toPP(), d = Math.pow(2, 20 - b);
    return new SMap.Pixel(c[0] / d, c[1] / d)
};
SMap.Projection.UTM33.prototype.unproject = function (a, b) {
    var c = Math.pow(2, 20 - b);
    return SMap.Coords.fromPP(a.x * c, a.y * c)
};
SMap.Projection.Krovak = JAK.ClassMaker.makeClass({
    NAME: "SMap.Projection.Krovak",
    VERSION: "1.0",
    EXTEND: SMap.Projection
});
SMap.Projection.Krovak.prototype._screenCoefficients = {x: -1, y: 1};
SMap.Projection.Krovak.prototype.$constructor = function () {
    this.$super();
    this._code = "EPSG:102067";
    this._matrixSet = "jtsk:epsg:102067"
};
SMap.Projection.Krovak.prototype.project = function (a, b) {
    var c = a.toJTSK(), d = Math.pow(2, 15 - b);
    return new SMap.Pixel(c[1] / d, c[0] / d)
};
SMap.Projection.Krovak.prototype.unproject = function (a, b) {
    var c = Math.pow(2, 15 - b);
    return SMap.Coords.fromJTSK(a.y * c, a.x * c)
};
SMap.Projection.Oblique = JAK.ClassMaker.makeClass({
    NAME: "SMap.Projection.Oblique",
    VERSION: "1.0",
    EXTEND: SMap.Projection
});
SMap.Projection.Oblique.CORS = JAK.Request.supportsCrossOrigin();
SMap.Projection.Oblique.create = function (a, b, c, d) {
    var e = new JAK.Request(JAK.Request.XML);
    e.setCallback(function (e, f) {
        var k = SMap.Projection.Oblique.fromXML(e, b, a);
        k ? c(k) : d && d()
    });
    var f = {loc: a.toWGS84().join(","), direct: b};
    e.send((SMap.Projection.Oblique.CORS ? SMap.CONFIG.base : "") + "/oblique/", f);
    return e
};
SMap.Projection.Oblique.fromXML = function (a, b, c) {
    if (!a || 200 != a.getElementsByTagName("status")[0].getAttribute("status")) return null;
    for (var d = function (a) {
        return a.split(",").map(function (a) {
            return parseFloat(a)
        })
    }, e = a.getElementsByTagName("name")[0].getAttribute("name"), f = ["a", "b", "c", "d"], g = 0; g < f.length; g++) {
        var h = a.getElementsByTagName(f[g])[0].getAttribute("point");
        f[g] = d(h)
    }
    var g = d(a.getElementsByTagName("center")[0].getAttribute("point")),
        h = d(a.getElementsByTagName("best")[0].getAttribute("point")),
        d = d(a.getElementsByTagName("angles")[0].getAttribute("angle")),
        k = parseFloat(a.getElementsByTagName("multiplier")[0].getAttribute("multiplier")), l = 0.0497696, m = 6.8E-6,
        n = new SMap.Pixel(5412, 7216), q = new SMap.Pixel(5412, 7216), r = new SMap.Pixel(0, 0),
        p = a.getElementsByTagName("image");
    p.length && (p = p[0], l = parseFloat(p.getAttribute("focalLength")), m = parseFloat(p.getAttribute("pixelSize")), n.x = parseInt(p.getAttribute("width")), n.y = parseInt(p.getAttribute("height")), q.x = parseInt(p.getAttribute("originalWidth")) ||
        n.x, q.y = parseInt(p.getAttribute("originalHeight")) || n.y, r.x = parseInt(p.getAttribute("offsetX")) || 0, r.y = parseInt(p.getAttribute("offsetY")) || 0);
    p = a.getElementsByTagName("provider")[0].getAttribute("provider");
    a = (a = a.getElementsByTagName("date")) && 0 < a.length ? a[0].getAttribute("date") : "";
    return new this(e, {
        points: f,
        center: g,
        best: h,
        angles: d,
        focalLength: l,
        pixelSize: m / k,
        imageSize: n,
        originalImageSize: q,
        imageOffset: r,
        provider: p,
        date: a
    }, b, c)
};
SMap.Projection.Oblique.prototype._screenCoefficients = {x: 1, y: 1};
SMap.Projection.Oblique.prototype.$constructor = function (a, b, c, d) {
    this.$super();
    this._code = "oblique";
    this._response = this._response.bind(this);
    this._fail = this._fail.bind(this);
    this._sc = [];
    this._nextProjection = null;
    this._rotating = !1;
    this._id = a;
    this._coords = d;
    this._a = b.points[0];
    this._b = b.points[1];
    this._c = b.points[2];
    this._d = b.points[3];
    this._best = b.best;
    this._omega = b.angles[0];
    this._phi = b.angles[1];
    this._kappa = b.angles[2];
    this._center = b.center;
    this._imageSize = b.imageSize;
    this._focalLength = b.focalLength;
    this._pixelSize = b.pixelSize;
    this._orientation = c;
    this._originalImageSize = b.originalImageSize;
    this._imageOffset = b.imageOffset;
    this._provider = b.provider;
    this._date = b.date;
    this._triangles = [new SMap.Projection.Oblique.Triangle(this._a, this._b, b.best), new SMap.Projection.Oblique.Triangle(this._b, this._c, b.best), new SMap.Projection.Oblique.Triangle(this._c, this._d, b.best), new SMap.Projection.Oblique.Triangle(this._d, this._a, b.best)];
    a = Math.cos(this._phi);
    b = Math.cos(this._kappa);
    c = Math.cos(this._omega);
    d =
        Math.sin(this._phi);
    var e = Math.sin(this._kappa), f = Math.sin(this._omega);
    this._rotMatrix = new SMap.Projection.Oblique.Matrix([[a * b, c * e + f * d * b, f * e - c * d * b], [-a * e, -f * d * e + c * b, c * d * e + f * b], [d, -f * a, c * a]]);
    this._rotMatrixTr = this._rotMatrix.transpose()
};
SMap.Projection.Oblique.prototype.setOwner = function (a) {
    this._owner && this._owner.getSignals().removeListeners(this._sc);
    this.$super(a);
    if (a) {
        if (this._date) {
            var b = a.getCopyrightControl();
            b && b.setDate(this._date)
        }
        a = a.getSignals();
        this._sc.push(a.addListener(this, "map-redraw", "_mapRedraw"));
        this._sc.push(a.addListener(this, "rotation-start", "_rotationStart"));
        this._sc.push(a.addListener(this, "rotation-stop", "_rotationStop"))
    }
};
SMap.Projection.Oblique.prototype.getId = function () {
    return this._id
};
SMap.Projection.Oblique.prototype.isValid = function () {
    if (this.getMap().getOrientation() != this._orientation) return !1;
    var a = this._owner.getCenter();
    if (10 > a.distance(this._coords)) return !0;
    var b = this.project(a);
    if (0 > b.x || 0 > b.y || b.x > this._imageSize.x || b.y > this._imageSize.y) return !1;
    var a = Math.min(b.x, this._imageSize.x - b.x), b = Math.min(b.y, this._imageSize.y - b.y),
        c = this.getMap().getSize();
    return a < c.x / 2 + 100 || b < c.y / 2 + 100 ? !1 : !0
};
SMap.Projection.Oblique.prototype._getElevation = function (a) {
    for (var b = 0, c = this._triangles.length; b < c; ++b) if (this._triangles[b].containsPoint(a)) return this._triangles[b].interpolatePoint(a);
    return null
};
SMap.Projection.Oblique.prototype.unproject = function (a) {
    var b = this._originalImageSize.x * this._pixelSize, c = this._originalImageSize.y * this._pixelSize;
    a.x = this._imageOffset.x + a.x;
    a.y = this._imageOffset.y + a.y;
    var d = [0, 0, -this._focalLength];
    d[0] = a.x * this._pixelSize - b / 2;
    d[1] = c / 2 - a.y * this._pixelSize;
    a = new SMap.Projection.Oblique.Vector(d);
    b = new SMap.Projection.Oblique.Vector(this._center);
    a = this._rotMatrixTr.mulByVector(a).plus(b).getPoint();
    b = 0;
    for (c = this._triangles.length; b < c; ++b) if (d = this._triangles[b].rayIntersection(this._center,
            a)) return SMap.Coords.fromUTM33(d[0], d[1]);
    return null
};
SMap.Projection.Oblique.prototype.project = function (a) {
    var b = this._originalImageSize.x * this._pixelSize, c = this._originalImageSize.y * this._pixelSize;
    a = a.toUTM33();
    a.push(0);
    var d = this._getElevation(a);
    if (null == d) return null;
    a[2] = d;
    a = new SMap.Projection.Oblique.Vector(this._center, a);
    a = this._rotMatrix.mulByVector(a).getPoint();
    var d = -this._focalLength / a[2], e = new SMap.Pixel(0, 0);
    e.x = Math.round((a[0] * d + b / 2) / this._pixelSize);
    e.y = Math.round((c / 2 - a[1] * d) / this._pixelSize);
    e.x -= this._imageOffset.x;
    e.y -= this._imageOffset.y;
    return e
};
SMap.Projection.Oblique.prototype.pixelToTile = function (a, b, c, d, e) {
    a = this._pixelToAbsolutePixel(a, b, c, SMap.NORTH);
    a.y = this._imageSize.y - a.y;
    return new SMap.Tile(c, e, Math.floor(a.x / e), Math.floor(a.y / e))
};
SMap.Projection.Oblique.prototype.tileToPixel = function (a, b, c, d) {
    c = a.tileSize;
    d = a.x * a.tileSize;
    a = this._imageSize.y - a.y * a.tileSize;
    b = this.project(b);
    b = new SMap.Pixel(d - b.x, a - b.y);
    b.y -= c;
    return b
};
SMap.Projection.Oblique.prototype.pixelToCoords = function (a, b, c, d) {
    a = this._pixelToAbsolutePixel(a, b, c, SMap.NORTH);
    return this.unproject(a, c)
};
SMap.Projection.Oblique.prototype.coordsToPixel = function (a, b, c, d) {
    a = this.project(a, c);
    return this._absolutePixelToPixel(a, b, c, SMap.NORTH)
};
SMap.Projection.Oblique.prototype._mapRedraw = function (a) {
    this._rotating || this.isValid() || this._rq || (a = this.getMap(), this._rq = this.constructor.create(a.getCenter(), a.getOrientation(), this._response, this._fail))
};
SMap.Projection.Oblique.prototype._fail = function () {
    this._rq = null
};
SMap.Projection.Oblique.prototype._rotationStart = function (a) {
    this._nextProjection = null;
    this._rotating = !0;
    var b = this.getMap(), c = b.getOrientation();
    this._rq = this.constructor.create(b.getCenter(), a.data.targetOrientation, function (a) {
        this._rq = null;
        var b = this.getMap();
        this._rotating ? this._nextProjection = a : b && b.setProjection(a)
    }.bind(this), function () {
        this._rq = null;
        var a = this.getMap();
        this._rotating ? this._nextProjection = c : a && a.setOrientation(c, !1)
    }.bind(this))
};
SMap.Projection.Oblique.prototype._rotationStop = function (a) {
    this._rotating = !1;
    (a = this.getMap()) && null !== this._nextProjection && (this._nextProjection instanceof SMap.Projection ? a.setProjection(this._nextProjection) : a.setOrientation(this._nextProjection, !1))
};
SMap.Projection.Oblique.prototype._response = function (a) {
    this._rq = null;
    this.getMap().setProjection(a)
};
SMap.Projection.Oblique.Vector = JAK.ClassMaker.makeClass({NAME: "SMap.Projection.Oblique.Vector", VERSION: "1.0"});
SMap.Projection.Oblique.Vector.prototype.$constructor = function (a, b) {
    1 == arguments.length ? (this._x = a[0], this._y = a[1], this._z = a[2]) : 2 == arguments.length ? (this._x = b[0] - a[0], this._y = b[1] - a[1], this._z = b[2] - a[2]) : this._z = this._y = this._x = 0
};
SMap.Projection.Oblique.Vector.prototype.getPoint = function () {
    return [this._x, this._y, this._z]
};
SMap.Projection.Oblique.Vector.prototype.norm = function () {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z)
};
SMap.Projection.Oblique.Vector.prototype.normalize = function () {
    var a = this.norm();
    this._x /= a;
    this._y /= a;
    this._z /= a
};
SMap.Projection.Oblique.Vector.prototype.dot = function (a) {
    return this._x * a._x + this._y * a._y + this._z * a._z
};
SMap.Projection.Oblique.Vector.prototype.cross = function (a) {
    return new SMap.Projection.Oblique.Vector([this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x])
};
SMap.Projection.Oblique.Vector.prototype.plus = function (a) {
    return new SMap.Projection.Oblique.Vector([this._x + a._x, this._y + a._y, this._z + a._z])
};
SMap.Projection.Oblique.Vector.prototype.mul = function (a) {
    return new SMap.Projection.Oblique.Vector([this._x * a, this._y * a, this._z * a])
};
SMap.Projection.Oblique.Vector.prototype.minus = function (a) {
    return new SMap.Projection.Oblique.Vector([this._x - a._x, this._y - a._y, this._z - a._z])
};
SMap.Projection.Oblique.Matrix = JAK.ClassMaker.makeClass({NAME: "SMap.Projection.Oblique.Matrix", VERSION: "1.0"});
SMap.Projection.Oblique.Matrix.prototype.$constructor = function (a) {
    this._data = 1 == arguments.length ? a : [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
};
SMap.Projection.Oblique.Matrix.prototype.mulByVector = function (a) {
    return new SMap.Projection.Oblique.Vector([this._data[0][0] * a._x + this._data[0][1] * a._y + this._data[0][2] * a._z, this._data[1][0] * a._x + this._data[1][1] * a._y + this._data[1][2] * a._z, this._data[2][0] * a._x + this._data[2][1] * a._y + this._data[2][2] * a._z])
};
SMap.Projection.Oblique.Matrix.prototype.transpose = function () {
    return new SMap.Projection.Oblique.Matrix([[this._data[0][0], this._data[1][0], this._data[2][0]], [this._data[0][1], this._data[1][1], this._data[2][1]], [this._data[0][2], this._data[1][2], this._data[2][2]]])
};
SMap.Projection.Oblique.Triangle = JAK.ClassMaker.makeClass({NAME: "SMap.Projection.Oblique.Triangle", VERSION: "1.0"});
SMap.Projection.Oblique.Triangle.prototype.$constructor = function (a, b, c) {
    3 == arguments.length ? (this._a = a, this._b = b, this._c = c, this._computeABC()) : (this._a = [0, 0, 0], this._b = [0, 0, 0], this._c = [0, 0, 0])
};
SMap.Projection.Oblique.Triangle.prototype._sameSide = function (a, b, c, d) {
    d = new SMap.Projection.Oblique.Vector(c, d);
    a = new SMap.Projection.Oblique.Vector(c, a);
    b = new SMap.Projection.Oblique.Vector(c, b);
    c = d.cross(a);
    d = d.cross(b);
    return 0 <= c.dot(d) ? !0 : !1
};
SMap.Projection.Oblique.Triangle.prototype.containsPoint = function (a) {
    a = [a[0], a[1], 0];
    var b = [this._a[0], this._a[1], 0], c = [this._b[0], this._b[1], 0], d = [this._c[0], this._c[1], 0];
    return this._sameSide(a, b, c, d) && this._sameSide(a, c, b, d)
};
SMap.Projection.Oblique.Triangle.prototype._computeABC = function () {
    var a = this._a[0] - this._b[0], b = this._a[1] - this._b[1], c = this._a[0] - this._c[0],
        d = this._a[1] - this._c[1], e = this._a[2] - this._b[2], f = this._a[2] - this._c[2], g = a * d - c * b;
    this._A = (e * d - f * b) / g;
    this._B = (a * f - c * e) / g;
    this._C = this._a[2] - this._A * this._a[0] - this._B * this._a[1]
};
SMap.Projection.Oblique.Triangle.prototype.rayIntersection = function (a, b) {
    var c = new SMap.Projection.Oblique.Vector(a, b), d = new SMap.Projection.Oblique.Vector([this._A, this._B, -1]),
        e = new SMap.Projection.Oblique.Vector(a), d = -(e.dot(d) + this._C) / c.dot(d),
        c = e.plus(c.mul(d)).getPoint();
    return this.containsPoint(c) ? c : null
};
SMap.Projection.Oblique.Triangle.prototype.interpolatePoint = function (a) {
    return this._A * a[0] + this._B * a[1] + this._C
};
SMap.Projection.Oblique.prototype.getProvider = function () {
    return this._provider
};
SMap.Projection.Robinson = JAK.ClassMaker.makeClass({
    NAME: "SMap.Projection.Robinson",
    VERSION: "1.0",
    EXTEND: SMap.Projection
});
SMap.Projection.Robinson.K = [[0.9986, -0.062], [1, 0], [0.9986, 0.062], [0.9954, 0.124], [0.99, 0.186], [0.9822, 0.248], [0.973, 0.31], [0.96, 0.372], [0.9427, 0.434], [0.9216, 0.4958], [0.8962, 0.5571], [0.8679, 0.6176], [0.835, 0.6769], [0.7986, 0.7346], [0.7597, 0.7903], [0.7186, 0.8435], [0.6732, 0.8936], [0.6213, 0.9394], [0.5722, 0.9761], [0.5322, 1]].map(function (a) {
    a[1] *= 1.0144;
    return a
});
SMap.Projection.Robinson.prototype.$constructor = function () {
    this.$super();
    this._code = "EPSG:54030"
};
SMap.Projection.Robinson.prototype.getWorldSize = function (a) {
    a = Math.pow(2, a);
    return new SMap.Pixel(256 * a, 256 * a)
};
SMap.Projection.Robinson.prototype.project = function (a, b) {
    var c = Math.PI / 180, d = a.toWGS84(), e = d[1] * c, c = d[0] * c, f = this.constructor.K,
        d = Math.min(18, 36 * Math.abs(e) / Math.PI), g = Math.floor(d), d = d - g, h = (n = f[g])[0], k = n[1],
        l = (n = f[++g])[0], m = n[1], f = (n = f[Math.min(19, ++g)])[0], g = n[1], n,
        c = c * (l + d * (f - h) / 2 + d * d * (f - 2 * l + h) / 2),
        e = (0 < e ? Math.PI / 2 : -Math.PI / 2) * (m + d * (g - k) / 2 + d * d * (g - 2 * m + k) / 2),
        d = this.getWorldSize(b), c = d.x * (1 + c / Math.PI) / 2, e = d.y * (1 + e / -Math.PI) / 2;
    return new SMap.Pixel(c, e)
};
SMap.Projection.Robinson.prototype.unproject = function (a, b) {
    var c = this.getWorldSize(b), d = Math.PI * (2 * a.x / c.x - 1), e = -Math.PI * (2 * a.y / c.y - 1),
        f = this.constructor.K, g = Math.PI / 2, h = 180 / Math.PI, k = e / g, c = 90 * k,
        l = Math.min(18, Math.abs(c / 5)), m = Math.max(0, Math.floor(l));
    do {
        var n = f[m][1], q = f[m + 1][1], r = f[Math.min(19, m + 2)][1], p = r - n, n = r - 2 * q + n,
            q = 2 * (Math.abs(k) - q) / p, p = n / p, p = q * (1 - p * q * (1 - 2 * p * q));
        if (0 <= p || 1 === m) {
            c = (0 <= e ? 5 : -5) * (p + l);
            k = 50;
            do l = Math.min(18, Math.abs(c) / 5), m = Math.floor(l), p = l - m, n = f[m][1], q = f[m + 1][1], r = f[Math.min(19,
                m + 2)][1], c -= (l = (0 <= e ? g : -g) * (q + p * (r - n) / 2 + p * p * (r - 2 * q + n) / 2) - e) * h; while (1E-12 < Math.abs(l) && 0 < --k);
            break
        }
    } while (0 <= --m);
    e = f[m][0];
    g = f[m + 1][0];
    f = f[Math.min(19, m + 2)][0];
    d = d / (g + p * (f - e) / 2 + p * p * (f - 2 * g + e) / 2) * h;
    return SMap.Coords.fromWGS84(d, c)
};
SMap.Layer = JAK.ClassMaker.makeClass({NAME: "SMap.Layer", VERSION: "1.0", IMPLEMENT: SMap.IOwned});
SMap.Layer.prototype.$constructor = function (a) {
    this._id = a || Math.random();
    this._owner = null;
    this._dom = {container: {}};
    this._active = !1;
    this._copyright = {};
    this._build()
};
SMap.Layer.prototype.$destructor = function () {
};
SMap.Layer.prototype.setCopyright = function (a) {
    this._copyright = a;
    return this
};
SMap.Layer.prototype.getCopyright = function (a) {
    var b = [], c;
    for (c in this._copyright) {
        var d = this._copyright[c], e = c.match(/([0-9]*)(-?)([0-9]*)/);
        if (e[2]) {
            var f = !0, g = !0;
            e[1] && a < e[1] && (f = !1);
            e[3] && a > e[3] && (g = !1);
            f && g && (b = b.concat(d))
        } else if (a == e[1]) return d
    }
    return b.length ? b : null
};
SMap.Layer.prototype.getId = function () {
    return this._id
};
SMap.Layer.prototype.enable = function () {
    if (this._active) return this;
    this._active = !0;
    this.redraw(!0);
    this.getMap().getSignals().makeEvent("layer-enable", this);
    return this
};
SMap.Layer.prototype.disable = function () {
    if (!this._active) return this;
    this._active = !1;
    this.clear();
    this.getMap().getSignals().makeEvent("layer-disable", this);
    return this
};
SMap.Layer.prototype.redraw = function (a) {
};
SMap.Layer.prototype.clear = function () {
};
SMap.Layer.prototype.getContainer = function () {
    return this._dom.container
};
SMap.Layer.prototype.isActive = function () {
    return this._active
};
SMap.Layer.prototype.removeAll = function () {
};
SMap.Layer.prototype.supportsAnimation = function () {
    return !1
};
SMap.Layer.prototype.zoomTo = function (a, b) {
};
SMap.Layer.prototype.rotateTo = function (a) {
};
SMap.Layer.prototype._build = function () {
};
SMap.Layer.HUD = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.HUD", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.HUD.prototype.clear = function () {
    this._dom.container[SMap.LAYER_HUD].style.display = "none"
};
SMap.Layer.HUD.prototype.enable = function () {
    this._dom.container[SMap.LAYER_HUD].style.display = "";
    this.$super()
};
SMap.Layer.HUD.prototype.addItem = function (a, b, c) {
    a.style.position = "absolute";
    for (var d in b) a.style[d] = b[d];
    b = this._dom.container[SMap.LAYER_HUD];
    c ? b.insertBefore(a, b.firstChild) : b.appendChild(a)
};
SMap.Layer.HUD.prototype.removeItem = function (a) {
    a.parentNode.removeChild(a)
};
SMap.Layer.HUD.prototype._build = function () {
    this._dom.container[SMap.LAYER_HUD] = JAK.mel("div")
};
SMap.Layer.Multi = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Multi", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Multi.prototype.$destructor = function () {
    this.$super();
    for (var a = 0; a < this._layers.length; a++) this._layers[a].$destructor()
};
SMap.Layer.Multi.prototype.redraw = function (a) {
    for (var b = 0; b < this._layers.length; b++) this._layers[b].redraw(a)
};
SMap.Layer.Multi.prototype.clear = function () {
    for (var a = 0; a < this._layers.length; a++) this._layers[a].clear()
};
SMap.Layer.Multi.prototype.removeAll = function () {
    for (var a = 0; a < this._layers.length; a++) this._layers[a].removeAll()
};
SMap.Layer.Multi.prototype.enable = function () {
    if (!this._active) {
        this._active = !0;
        for (var a = 0; a < this._layers.length; a++) this._layers[a].enable();
        this.getMap().getSignals().makeEvent("layer-enable", this)
    }
};
SMap.Layer.Multi.prototype.disable = function () {
    if (this._active) {
        this._active = !1;
        for (var a = 0; a < this._layers.length; a++) this._layers[a].disable();
        this.getMap().getSignals().makeEvent("layer-disable", this)
    }
};
SMap.Layer.Multi.prototype.setOwner = function (a) {
    this.$super(a);
    for (var b = 0; b < this._layers.length; b++) this._layers[b].setOwner(a)
};
SMap.Layer.Multi.prototype.getContainer = function () {
    return this._container
};
SMap.Layer.Multi.prototype.addLayer = function (a) {
    this._layers.push(a);
    var b = a.getContainer(), c;
    for (c in b) [].concat(b[c]).forEach(function (a) {
        this._container[c].appendChild(a)
    }, this);
    this.getMap() && a.setOwner(this);
    this._active && a.enable()
};
SMap.Layer.Multi.prototype.removeLayer = function (a) {
    var b = this._layers.indexOf(a);
    if (-1 != b) {
        a.$destructor();
        this._layers.splice(b, 1);
        a = a.getContainer();
        for (var c in a) [].concat(a[c]).forEach(function (a) {
            a.parentNode.removeChild(a)
        }, this)
    }
};
SMap.Layer.Multi.prototype.getLayers = function () {
    return this._layers
};
SMap.Layer.Multi.prototype._build = function () {
    this._layers = [];
    this._container = {};
    this._container[SMap.LAYER_TILE] = JAK.mel("div");
    this._container[SMap.LAYER_SHADOW] = JAK.mel("div");
    this._container[SMap.LAYER_MARKER] = JAK.mel("div");
    this._container[SMap.LAYER_ACTIVE] = JAK.mel("div");
    this._container[SMap.LAYER_HUD] = JAK.mel("div");
    var a = JAK.Vector.getCanvas(1, 1);
    this._container[SMap.LAYER_GEOMETRY] = a.group()
};
SMap.Layer.Canvas = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Canvas", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Canvas.prototype.$constructor = function (a, b) {
    this._layerId = b;
    this._context = null;
    this.$super(a)
};
SMap.Layer.Canvas.prototype.$destructor = function () {
    this.clear();
    this.$super()
};
SMap.Layer.Canvas.prototype.clear = function () {
    this._context && this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height)
};
SMap.Layer.Canvas.prototype.getContext = function () {
    return this._context
};
SMap.Layer.Canvas.prototype._build = function () {
    var a = JAK.mel("canvas", {}, {position: "absolute"});
    this._dom.container[this._layerId] = a;
    a.getContext && (this._context = a.getContext("2d"))
};
SMap.Layer.Canvas.prototype.redraw = function (a) {
    if (this._active) {
        a = this._dom.container[this._layerId];
        var b = this.getMap().getSize();
        a.width = b.x;
        a.height = b.y;
        var c = this.getMap().getOffset(), b = b.clone().scale(-0.5).minus(c);
        a.style.left = b.x + "px";
        a.style.top = b.y + "px"
    }
};
SMap.TileSet = JAK.ClassMaker.makeClass({NAME: "SMap.TileSet", VERSION: "1.0"});
SMap.TileSet.img = JAK.mel("img", {}, {position: "absolute"});
SMap.TileSet.prototype.$constructor = function (a, b) {
    this._map = a;
    this._options = b;
    this.onload = null;
    this._zoom = a.getZoom();
    this._container = document.createElement("div");
    this._container.style.webkitTransform = "translateZ(0px)";
    this._container.style.transform = "translateZ(0px)";
    this._tiles = {};
    this._stats = {total: 0, loaded: 0}
};
SMap.TileSet.prototype.$destructor = function () {
    for (var a in this._tiles) this._tiles[a].node.onload = null, this._tiles[a].node.onerror = null
};
SMap.TileSet.prototype.getContainer = function () {
    return this._container
};
SMap.TileSet.prototype.addTiles = function (a) {
    var b = this._map, c = b.getOrientation(), d = [], e;
    for (e in a) e in this._tiles || d.push(a[e]);
    this._stats.total += d.length;
    var f = b.getOffset();
    d.forEach(function (a) {
        var b = this._createTileNode(a.url, c), d = a.tile.toPixel(this._map).minus(f);
        b.style.left = d.x + "px";
        b.style.top = d.y + "px";
        b.style.width = b.style.height = a.tile.tileSize + "px";
        a.node = b;
        this._tiles[a.tile] = a;
        this._container.appendChild(b)
    }, this)
};
SMap.TileSet.prototype.zoomTo = function (a, b) {
    var c = this._map, d = Math.pow(2, a - this._zoom), e = Math.pow(2, a - c.getZoom()), f = c.getOffset(),
        e = b.clone().scale(1 - e).minus(f), f = Math.ceil(this._options.tileSize * d), g;
    for (g in this._tiles) {
        var h = this._tiles[g], k = h.node;
        k.style.width = f + "px";
        k.style.height = f + "px";
        h = h.tile.toPixel(c).scale(d).plus(e);
        k.style.left = Math.round(h.x) + "px";
        k.style.top = Math.round(h.y) + "px"
    }
};
SMap.TileSet.prototype.rotateTo = function (a) {
    if (SMap.TRANSFORM) {
        var b = this._map.getOffset();
        this._container.style[SMap.TRANSFORM] = a ? "translate(" + -b.x + "px, " + -b.y + "px) rotate(" + a + "deg) translate(" + b.x + "px," + b.y + "px)" : ""
    }
};
SMap.TileSet.prototype._createTileNode = function (a, b) {
    var c = SMap.TileSet.img.cloneNode(!1);
    c.style.opacity = 0;
    c.src = a;
    if (SMap.TRANSFORM && b != SMap.NORTH) {
        var d = "";
        switch (this._map.getOrientation()) {
            case SMap.SOUTH:
                d = "rotate(180deg)";
                break;
            case SMap.EAST:
                d = "rotate(270deg)";
                break;
            case SMap.WEST:
                d = "rotate(90deg)"
        }
        c.style[SMap.TRANSFORM] = d
    }
    this._options.fadeTime && (c.style.transition = "opacity " + this._options.fadeTime + "ms");
    c.onload = function (a) {
        c.style.opacity = 1;
        this._stats.loaded++;
        this.onload && 0.6 < this._stats.loaded /
        this._stats.total && (setTimeout(this.onload, this._options.fadeTime), this.onload = null)
    }.bind(this);
    c.onerror = function (a) {
        c.onload(a)
    };
    return c
};
SMap.Layer.Tile = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Tile", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Tile.DEFAULT_OPTIONS = {tileSize: 256, alpha: !1, fadeTime: 600, query: "{zoom}-{x}-{y}"};
SMap.Layer.Tile.prototype.$constructor = function (a, b, c) {
    this.$super(a);
    this._options = {};
    a = SMap.Layer.Tile.DEFAULT_OPTIONS;
    for (var d in a) this._options[d] = a[d];
    for (d in c) this._options[d] = c[d];
    this._url = b;
    this._tileSetCtor = SMap.TileSet;
    this._tileSets = []
};
SMap.Layer.Tile.prototype.setOptions = function (a) {
    for (var b in a) this._options[b] = a[b];
    this.redraw(!0)
};
SMap.Layer.Tile.prototype.supportsAnimation = function () {
    return !this._options.alpha
};
SMap.Layer.Tile.prototype.redraw = function (a) {
    if (this._active) {
        var b = null;
        a ? ((1 < this._tileSets.length || !this.supportsAnimation() && 0 < this._tileSets.length) && this._destroyTileSet(0), b = this._createTileSet()) : b = this._tileSets[0];
        a = this._createTiles();
        b.addTiles(a)
    }
};
SMap.Layer.Tile.prototype.setURL = function (a) {
    a != this._url && (this._url = a, this.redraw(!0))
};
SMap.Layer.Tile.prototype.clear = function () {
    for (; this._tileSets.length;) this._destroyTileSet(0)
};
SMap.Layer.Tile.prototype.zoomTo = function (a, b) {
    this._active && this._tileSets.length && this._tileSets[this._tileSets.length - 1].zoomTo(a, b)
};
SMap.Layer.Tile.prototype.rotateTo = function (a) {
    this._tileSets.length && this._tileSets[this._tileSets.length - 1].rotateTo(a)
};
SMap.Layer.Tile.prototype._createTiles = function () {
    for (var a = this.getMap(), b = this._options.tileSize, c = a.getSize().clone().scale(0.5), d = c.x, e = c.y, c = {}, f = -d; f < d + b; f += b) for (var g = -e; g < e + b; g += b) {
        var h = (new SMap.Pixel(f, g)).toTile(a, b);
        if (h) {
            var k = {node: null, url: this._buildURL(h), tile: h};
            c[h] = k
        }
    }
    var a = [], l;
    for (l in c) a.push(c[l]);
    this._render(a);
    return c
};
SMap.Layer.Tile.prototype._render = function (a) {
};
SMap.Layer.Tile.prototype._createTileSet = function () {
    var a = {tileSize: this._options.tileSize, fadeTime: this._options.fadeTime},
        a = new this._tileSetCtor(this.getMap(), a);
    a.onload = this._tileSetLoaded.bind(this);
    this._tileSets.unshift(a);
    this._dom.container[SMap.LAYER_TILE].appendChild(a.getContainer());
    return a
};
SMap.Layer.Tile.prototype._destroyTileSet = function (a) {
    a = this._tileSets.splice(a, 1)[0];
    a.onload = null;
    a.$destructor();
    a = a.getContainer();
    a.parentNode.removeChild(a)
};
SMap.Layer.Tile.prototype._tileSetLoaded = function () {
    var a = this.getMap();
    a && a.getSignals().makeEvent("tileset-load", this);
    2 > this._tileSets.length || this._destroyTileSet(1)
};
SMap.Layer.Tile.prototype._build = function () {
    var a = this._id + "-" + SMap.LAYER_TILE + "-" + Math.random();
    this._dom.container[SMap.LAYER_TILE] = JAK.mel("div", {id: a})
};
SMap.Layer.Tile.prototype._buildURL = function (a) {
    return (this._url + this._buildQuery(a)).replace(/#/, 1 + (a.x + a.y & 3))
};
SMap.Layer.Tile.prototype._buildQuery = function (a) {
    var b = (a.x << 28 - a.zoom).toString(16), c = (a.y << 28 - a.zoom).toString(16),
        d = this._owner.getProjection().getWorldSize(a.zoom).x / a.tileSize;
    return this.getMap().formatString(this._options.query, {ppx: b, ppy: c, x: a.x.mod(d), y: a.y})
};
SMap.Layer.Tile.prototype.getURL = function () {
    return this._url || ""
};
SMap.TileSetOblique = JAK.ClassMaker.makeClass({NAME: "SMap.TileSetOblique", VERSION: "1.0", EXTEND: SMap.TileSet});
SMap.TileSetOblique.prototype._createTileNode = function (a, b) {
    return this.$super(a, SMap.NORTH)
};
SMap.Layer.Tile.Oblique = JAK.ClassMaker.makeClass({
    NAME: "SMap.Layer.Tile.Oblique",
    VERSION: "1.0",
    EXTEND: SMap.Layer.Tile
});
SMap.Layer.Tile.Oblique.prototype.$constructor = function (a, b, c) {
    this.$super(a, b, c);
    this._tileSetCtor = SMap.TileSetOblique
};
SMap.Layer.Tile.Oblique.prototype.redraw = function (a) {
    if (this._active) {
        var b = this.getMap().getProjection();
        b instanceof SMap.Projection.Oblique && b.isValid() && this.$super(a)
    }
};
SMap.Layer.Tile.Oblique.prototype._buildURL = function (a) {
    var b = this.getMap().getProjection(), b = this._url + b.getId(), b = b.replace(/#/, 1 + (a.x + a.y & 3)),
        c = a.x.toString(16).lpad("0", 2);
    a = a.y.toString(16).lpad("0", 2);
    return this.getMap().formatString(b, {x: c, y: a})
};
SMap.Layer.Tile.Oblique.prototype.getCopyright = function () {
    var a = this.getMap().getProjection();
    return a instanceof SMap.Projection.Oblique ? this._copyright[a.getProvider()] : null
};
SMap.Layer.Image = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Image", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Image.prototype.$constructor = function (a) {
    this.$super(a);
    this.clear();
    this._images = {}
};
SMap.Layer.Image.prototype.supportsAnimation = function () {
    return !0
};
SMap.Layer.Image.prototype.addImage = function (a, b, c, d) {
    var e = JAK.idGenerator();
    a = JAK.mel("img", {src: a}, {position: "absolute", opacity: d || 1});
    this._images[e] = {img: a, leftTop: b, rightBottom: c, loaded: !1, size: [0, 0]};
    a.onload = this._load.bind(this);
    return e
};
SMap.Layer.Image.prototype.removeImage = function (a) {
    var b = this._images[a];
    if (!b) return this;
    b.loaded && b.img.parentNode.removeChild(b.img);
    delete this._images[a];
    return this
};
SMap.Layer.Image.prototype.removeAll = function () {
    this._images = {};
    this._dom.container[SMap.LAYER_TILE].innerHTML = "";
    return this
};
SMap.Layer.Image.prototype.redraw = function (a) {
    if (this._active && a) for (var b in this._images) this._draw(b)
};
SMap.Layer.Image.prototype.clear = function () {
    this._dom.container[SMap.LAYER_TILE].style.display = "none"
};
SMap.Layer.Image.prototype.enable = function () {
    this._dom.container[SMap.LAYER_TILE].style.display = "";
    this.$super()
};
SMap.Layer.Image.prototype.zoomTo = function (a, b) {
    if (this._active) for (var c in this._images) this._draw(c, a, b)
};
SMap.Layer.Image.prototype._build = function () {
    this._dom.container[SMap.LAYER_TILE] = JAK.mel("div", {id: this._id + "-" + SMap.LAYER_TILE + "-" + Math.random()})
};
SMap.Layer.Image.prototype._load = function (a) {
    a = a.target;
    a.onload = null;
    for (var b in this._images) {
        var c = this._images[b];
        c.img == a && (c.loaded = !0, this._draw(b), this._dom.container[SMap.LAYER_TILE].appendChild(a))
    }
};
SMap.Layer.Image.prototype._draw = function (a, b, c) {
    var d = this.getMap(), e = d.getOffset();
    c || (b = d.getZoom());
    var f = this._images[a];
    a = f.img;
    var g = f.leftTop.toPixel(d, b), f = f.rightBottom.toPixel(d, b);
    a.style.width = f.x - g.x + "px";
    a.style.height = f.y - g.y + "px";
    c && (b = Math.pow(2, b - d.getZoom()), c = c.clone().scale(1 - b), g.plus(c));
    g.minus(e);
    a.style.left = g.x + "px";
    a.style.top = g.y + "px"
};
SMap.Layer.WMS = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.WMS", EXTEND: SMap.Layer.Image});
SMap.Layer.WMS.prototype.$constructor = function (a, b, c) {
    this.$super(a);
    this._url = b;
    this._params = {format: "image/jpeg", service: "WMS", version: "1.3.0", styles: ""};
    for (var d in c) this._params[d] = c[d]
};
SMap.Layer.WMS.prototype.redraw = function (a) {
    if (this._active) {
        a && this.removeAll();
        var b = this.getMap(), c = b.getSize();
        a = c.clone().scale(-0.5).toCoords(b);
        b = c.clone().scale(0.5).toCoords(b);
        c = this._getURL(c);
        this.addImage(c, a, b)
    }
};
SMap.Layer.WMS.prototype._getURL = function (a) {
    var b = this.getMap(), c = {width: a.x, height: a.y, request: "GetMap", crs: b.getProjection().getCode()}, d;
    for (d in this._params) c[d] = this._params[d];
    a = a.clone().scale(0.5);
    var e = a.x, f = a.y;
    a = (new SMap.Pixel(-e, f)).toCoords(b);
    b = (new SMap.Pixel(e, -f)).toCoords(b);
    e = [];
    switch (c.crs) {
        case "EPSG:3857":
            e.push(a.toMercator());
            e.push(b.toMercator());
            break;
        case "EPSG:32633":
            e.push(a.toUTM33());
            e.push(b.toUTM33());
            break;
        case "EPSG:102067":
            f = function (a) {
                return -a
            };
            e.push(a.toJTSK().map(f).reverse());
            e.push(b.toJTSK().map(f).reverse());
            break;
        default:
            e.push(a.toWGS84().reverse()), e.push(b.toWGS84().reverse())
    }
    c.bbox = e[0].concat(e[1]).join(",");
    a = [];
    for (d in c) a.push(encodeURIComponent(d) + "=" + encodeURIComponent(c[d]));
    return this._url + "?" + a.join("&")
};
SMap.Layer.WMS.prototype._load = function (a) {
    var b = a.target, c;
    for (c in this._images) this._images[c].img != b && this.removeImage(c);
    this.$super(a)
};
SMap.Layer.WMTS = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.WMTS", EXTEND: SMap.Layer.Tile});
SMap.Layer.WMTS.prototype.$constructor = function (a, b, c, d) {
    this._params = {format: "image/png", service: "WMTS", version: "1.0.0"};
    for (var e in c) this._params[e] = c[e];
    this.$super(a, b, d)
};
SMap.Layer.WMTS.prototype._buildURL = function (a) {
    var b = this.getMap(), c = a.x, d = a.y;
    a = a.zoom;
    var b = {
        request: "GetTile",
        tileMatrixSet: b.getProjection().getMatrixSet(),
        tileMatrix: a,
        tileRow: d,
        tileCol: c
    }, e;
    for (e in this._params) b[e] = this._params[e];
    c = [];
    for (e in b) c.push(encodeURIComponent(e) + "=" + encodeURIComponent(b[e]));
    return this._url + "?" + c.join("&")
};
SMap.Layer.Smart = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Smart", VERSION: "1.0", EXTEND: SMap.Layer.Tile});
SMap.Layer.Smart.prototype.$constructor = function (a, b, c) {
    this.$super(a);
    this._options = {base: SMap.DEF_BASE};
    for (var d in c) this._options[d] = c[d];
    this._layers = {
        base: this._options.base == SMap.DEF_OPHOTO ? null : b.removeLayer(b.addDefaultLayer(this._options.base)),
        ophoto: b.removeLayer(b.addDefaultLayer(SMap.DEF_OPHOTO)),
        oblique: b.removeLayer(b.addDefaultLayer(SMap.DEF_OBLIQUE)),
        hybrid: b.removeLayer(b.addDefaultLayer(SMap.DEF_HYBRID))
    };
    null == this._layers.base && (this._layers.base = this._layers.ophoto);
    this._hybridMode =
        !1;
    this._currentHybrid = this._currentLayer = null
};
SMap.Layer.Smart.prototype.getLayers = function () {
    return this._layers
};
SMap.Layer.Smart.prototype.setHybrid = function (a) {
    if (a != this._hybridMode && (this._hybridMode = a, this._currentHybrid)) return a ? this._currentHybrid.enable() : this._currentHybrid.disable(), this
};
SMap.Layer.Smart.prototype.redraw = function (a) {
    if (this._active) {
        var b = this.getMap(), c = b.getZoom(), d = b.isObliqueAvailable(), e = b.isOphotoAvailable(), f = 19;
        e && (f = 20);
        d && (f = 21);
        20 > b.getZoom() && (e = !0);
        c = 21 == c ? this._tryOblique(d) : 18 < c ? this._tryOphoto(e) : this._tryBase();
        b.setZoomRange(2, f);
        c || (this._currentLayer.isActive() ? this._currentLayer.redraw(a) : this._currentLayer.enable(), this._currentHybrid && this._hybridMode && (this._currentHybrid.isActive() ? this._currentHybrid.redraw(a) : this._currentHybrid.enable()))
    }
};
SMap.Layer.Smart.prototype.getSimpleLayerId = function () {
    if (!this._currentLayer) return null;
    var a = this._currentLayer.getId();
    return a == SMap.DEF_OBLIQUE ? SMap.DEF_OPHOTO : a
};
SMap.Layer.Smart.prototype.clear = function () {
    this._currentLayer && this._currentLayer.clear();
    this._currentHybrid && this._currentHybrid.clear()
};
SMap.Layer.Smart.prototype.zoomTo = function (a, b) {
    this._active && (this._currentLayer && this._currentLayer.zoomTo(a, b), this._currentHybrid && this._currentHybrid.zoomTo(a, b))
};
SMap.Layer.Smart.prototype.rotateTo = function (a) {
    this._currentLayer && this._currentLayer.rotateTo(a);
    this._currentHybrid && this._currentHybrid.rotateTo(a)
};
SMap.Layer.Smart.prototype.supportsAnimation = function () {
    return this._currentLayer ? this._currentLayer.supportsAnimation() : !0
};
SMap.Layer.Smart.prototype.getCopyright = function (a) {
    if (!this._currentLayer) return null;
    var b = this._currentLayer.getCopyright(a);
    this._currentHybrid && this._currentHybrid.isActive() && (b instanceof Array || (b = [b]), b = b.concat(this._currentHybrid.getCopyright(a)));
    return b
};
SMap.Layer.Smart.prototype.setOwner = function (a) {
    this.$super(a);
    for (var b in this._layers) this._layers[b].setOwner(a)
};
SMap.Layer.Smart.prototype.enable = function () {
    return this.$super()
};
SMap.Layer.Smart.prototype.disable = function () {
    if (this._active) return this.$super(), this._currentLayer.disable(), this._currentHybrid && this._currentHybrid.disable(), this._currentLayer = null, this
};
SMap.Layer.Smart.prototype.getContainer = function () {
    var a = {}, b;
    for (b in this._layers) {
        var c = this._layers[b].getContainer(), d;
        for (d in c) d in a || (a[d] = []), -1 < a[d].indexOf(c[d]) || (a[d] = a[d].concat(c[d]))
    }
    return a
};
SMap.Layer.Smart.prototype._tryOblique = function (a) {
    if (a) {
        if (this._currentLayer == this._layers.oblique) return !1;
        this._currentLayer && this._currentLayer.disable();
        this._currentHybrid && this._currentHybrid.disable();
        this._currentHybrid = this._currentLayer = null;
        var b = this.getMap();
        SMap.Projection.Oblique.create(b.getCenter(), b.getOrientation(), function (a) {
            this._currentLayer = this._layers.oblique;
            this._currentHybrid = this._layers.obliqueHybrid;
            b.setProjection(a)
        }.bind(this), function () {
            b.setZoom(20)
        }.bind(this));
        return !0
    }
    return this._tryOphoto()
};
SMap.Layer.Smart.prototype._tryOphoto = function (a) {
    if (a) {
        if (this._currentLayer == this._layers.ophoto) return !1;
        this._currentLayer && this._currentLayer.disable();
        this._currentHybrid && this._currentHybrid.disable();
        a = this._currentLayer;
        this._currentLayer = this._layers.ophoto;
        this._currentHybrid = this._layers.hybrid;
        a == this._layers.oblique ? this._switchToMercator() : (this._currentLayer.enable(), this._hybridMode && this._currentHybrid.enable());
        return !0
    }
    return this._tryBase()
};
SMap.Layer.Smart.prototype._tryBase = function () {
    if (this._currentLayer == this._layers.base) return !1;
    this._currentLayer && this._currentLayer.disable();
    this._currentHybrid && this._currentHybrid.disable();
    var a = this._currentLayer;
    this._currentLayer = this._layers.base;
    this._currentHybrid = null;
    this._layers.base == this._layers.ophoto && (this._currentHybrid = this._layers.hybrid);
    a == this._layers.oblique ? this._switchToMercator() : (this._currentLayer.enable(), this._currentHybrid && this._hybridMode && this._currentHybrid.enable());
    return !0
};
SMap.Layer.Smart.prototype._switchToMercator = function () {
    var a = this.getMap();
    a.setOrientation(SMap.NORTH);
    a.setProjection(new SMap.Projection.Mercator)
};
SMap.Layer.Smart.Turist = JAK.ClassMaker.makeClass({
    NAME: "SMap.Layer.Smart.Turist",
    VERSION: "1.0",
    EXTEND: SMap.Layer.Smart
});
SMap.Layer.Smart.Turist.prototype.$constructor = function (a, b) {
    this.$super(a, b, {base: SMap.DEF_TURIST});
    this._trail = this._bike = !1
};
SMap.Layer.Smart.Turist.prototype.setTrail = function (a) {
    this._trail = a;
    return this
};
SMap.Layer.Smart.Turist.prototype.setBike = function (a) {
    this._bike = a;
    return this
};
SMap.Layer.Smart.Turist.prototype.getTrail = function () {
    return this._trail
};
SMap.Layer.Smart.Turist.prototype.getBike = function () {
    return this._bike
};
SMap.Layer.Turist = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Turist", VERSION: "1.0", EXTEND: SMap.Layer.Tile});
SMap.Layer.Turist.prototype.$constructor = function (a, b, c) {
    this.$super(a, b, c);
    this._bike = this._trail = !1
};
SMap.Layer.Turist.prototype.setTrail = function (a) {
    this._trail = a;
    return this
};
SMap.Layer.Turist.prototype.setBike = function (a) {
    this._bike = a;
    return this
};
SMap.Layer.Turist.prototype.getTrail = function () {
    return this._trail
};
SMap.Layer.Turist.prototype.getBike = function () {
    return this._bike
};
SMap.Layer.Marker = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Marker", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Marker.prototype.$constructor = function (a, b) {
    this._ec = [];
    this.$super(a);
    this._eventCoords = this._clusterer = this._repositionOptions = null;
    this._markers = {};
    this._options = {prefetch: 100, supportsAnimation: !1};
    for (var c in b) this._options[c] = b[c]
};
SMap.Layer.Marker.prototype.$destructor = function () {
    for (var a in this._dom.container) JAK.DOM.clear(this._dom.container[a]);
    this._dom = {};
    for (var b in this._markers) this._markers[b].marker.setOwner(null), this._markers[b].marker.$destructor();
    this._markers = {};
    JAK.Events.removeListeners(this._ec);
    this.$super()
};
SMap.Layer.Marker.prototype.setClusterer = function (a) {
    var b = this._clusterer;
    this._clusterer = a;
    !a && b && (this.clear(), this._markers = {}, this._addMarker(b.getAllMarkers()));
    if (a) for (var c in this._markers) this._clusterer.addMarker(this._markers[c].marker);
    this.redraw(!0)
};
SMap.Layer.Marker.prototype.addMarker = function (a, b) {
    var c = !1;
    this._clusterer ? (this._clusterer.addMarker(a), c = !0) : this._addMarker(a);
    b || this.redraw(c)
};
SMap.Layer.Marker.prototype.removeMarker = function (a, b) {
    var c = !1;
    this._clusterer ? (this._clusterer.removeMarker(a), c = !0) : this._removeMarker(a);
    b || this.redraw(c)
};
SMap.Layer.Marker.prototype.removeAll = function () {
    if (this._clusterer) this._clusterer.clear(), this.clear(), this._markers = {}; else {
        var a = [], b;
        for (b in this._markers) a.push(this._markers[b].marker);
        for (; a.length;) this._removeMarker(a.shift())
    }
};
SMap.Layer.Marker.prototype.getMarkers = function () {
    if (this._clusterer) return this._clusterer.getAllMarkers();
    var a = [], b;
    for (b in this._markers) a.push(this._markers[b].marker);
    return a
};
SMap.Layer.Marker.prototype.supportsAnimation = function () {
    return SMap.TRANSFORM && this._options.supportsAnimation
};
SMap.Layer.Marker.prototype.zoomTo = function (a, b) {
    if (this._active) {
        var c = this.getMap(), d = a - this.getMap().getZoom(), d = Math.pow(2, d), c = c.getOffset(),
            c = b.clone().minus(c).scale(1 - d);
        this._dom.container[SMap.LAYER_MARKER].style[SMap.TRANSFORM] = "translate(" + c.x + "px, " + c.y + "px) scale(" + d + "," + d + ")"
    }
};
SMap.Layer.Marker.prototype.fillFromData = function (a) {
    var b = [], c = {};
    a instanceof Array || (a = [a]);
    for (var d = 0; d < a.length; d++) {
        var e = a[d];
        e.nodeType ? this._fillFromXML(e, b, c) : this._fillFromData(e, b, c)
    }
    a = [];
    if (this._clusterer) {
        for (var f = this._clusterer.getAllMarkers(), d = 0; d < f.length; d++) e = f[d], e.getId() in c || a.push(e);
        this._clusterer.removeMarker(a)
    } else {
        for (f in this._markers) f in c || a.push(this._markers[f].marker);
        this._removeMarker(a)
    }
    for (; a.length;) a.pop().$destructor();
    this.addMarker(b)
};
SMap.Layer.Marker.prototype._fillFromXML = function (a, b, c) {
    var d = {};
    if (this._clusterer) for (var e = this._clusterer.getAllMarkers(), f = 0; f < e.length; f++) {
        var g = e[f];
        d[g.getId()] = g
    } else d = this._markers;
    a = a.getElementsByTagName("poi");
    for (e = 0; e < a.length; e++) f = a[e], g = f.getAttribute("source") + f.getAttribute("id"), g in d ? c[g] = !0 : (g = SMap.LOOKUP_MARKER[f.getAttribute("source")] || SMap.Marker, b.push(g.fromXML(f)))
};
SMap.Layer.Marker.prototype._fillFromData = function (a, b, c) {
    var d = {};
    if (this._clusterer) for (var e = this._clusterer.getAllMarkers(), f = 0; f < e.length; f++) {
        var g = e[f];
        d[g.getId()] = g
    } else d = this._markers;
    a = a.poi || [];
    for (e = 0; e < a.length; e++) f = a[e], f.geom || (g = f.source + f.id, g in d ? c[g] = !0 : f.url2x ? b.push(SMap.WMMarker.fromPOI(f, null, {type: f.paid ? SMap.WMMarker.TYPES.PAID : SMap.WMMarker.TYPES.POI})) : b.push((SMap.LOOKUP_MARKER[f.source] || SMap.Marker).fromData(f)))
};
SMap.Layer.Marker.prototype.setReposition = function (a) {
    this._repositionOptions = a;
    this._reposition()
};
SMap.Layer.Marker.prototype._reposition = function () {
    var a = this._repositionOptions;
    if (a) {
        var b = {}, c;
        for (c in this._markers) this._markers[c].appended && (b[c] = this._markers[c].pos);
        SMap.Marker.Repositioner.getInstance().go(b, this._markers, a);
        for (c in b) {
            var d = this._markers[c], a = b[c];
            if (null === a.x) this._unlink(d); else {
                d.pos = a;
                var d = d.marker.getContainer(), e;
                for (e in d) d[e].style.left = a.x + "px", d[e].style.top = a.y + "px"
            }
        }
    }
};
SMap.Layer.Marker.prototype.redraw = function (a) {
    if (this._active) {
        SMap.TRANSFORM && (this._dom.container[SMap.LAYER_MARKER].style[SMap.TRANSFORM] = "none");
        a && this._clusterer && (this.clear(), this._markers = {}, this._clusterer.compute(), this._addMarker(this._clusterer.getClusters()), this._addMarker(this._clusterer.getMarkers()));
        var b = this.getMap().getSize().clone().scale(0.5);
        this.getMap().getOffset();
        var c = b.x, b = b.y, d;
        for (d in this._markers) {
            var e = this._markers[d], f = e.marker.getCoords().toPixel(this.getMap()),
                g = Math.abs(f.x), f = Math.abs(f.y),
                g = !(g > c + this._options.prefetch || f > b + this._options.prefetch);
            !g || e.appended && !a || this.positionMarker(e.marker);
            !g && e.appended ? this._unlink(e) : g && !e.appended && this._append(e)
        }
        this._reposition()
    }
};
SMap.Layer.Marker.prototype.positionMarker = function (a) {
    if (this._active) {
        var b = this.getMap();
        if (b) {
            b = a.getCoords().toPixel(b);
            b.minus(this.getMap().getOffset());
            var c = a.getAnchor();
            if ("left" in c) {
                var d = "left";
                b.x -= c.left
            } else d = "right", b.x = -b.x - c.right;
            if ("top" in c) {
                var e = "top";
                b.y -= c.top
            } else e = "bottom", b.y = -b.y - c.bottom;
            c = this._markers[a.getId()];
            c.pos = b;
            c.appended || this._append(c);
            a = a.getContainer();
            for (var f in a) a[f].style[d] = b.x + "px", a[f].style[e] = b.y + "px"
        }
    }
};
SMap.Layer.Marker.prototype.clear = function () {
    for (var a in this._dom.container) JAK.DOM.clear(this._dom.container[a]);
    for (var b in this._markers) this._markers[b].appended = !1
};
SMap.Layer.Marker.prototype._addMarker = function (a) {
    a = a instanceof Array ? a : [a];
    for (var b = 0; b < a.length; b++) {
        var c = a[b], d = {appended: !1, marker: c, pos: null};
        this._markers[c.getId()] = d;
        c.setOwner(this)
    }
};
SMap.Layer.Marker.prototype._removeMarker = function (a) {
    a = a instanceof Array ? a : [a];
    for (var b = 0; b < a.length; b++) {
        var c = a[b], d = c.getId();
        if (!(d in this._markers)) break;
        this._markers[d].appended && this._unlink(this._markers[d]);
        c.setOwner(null);
        delete this._markers[d]
    }
};
SMap.Layer.Marker.prototype._append = function (a) {
    var b = a.marker.getContainer(), c;
    for (c in b) {
        if (!(c in this._dom.container)) throw Error("Cannot append marker component to layer");
        var d = b[c];
        d.style.position = "absolute";
        this._dom.container[c].appendChild(d)
    }
    a.appended = !0
};
SMap.Layer.Marker.prototype._unlink = function (a) {
    var b = a.marker.getContainer(), c;
    for (c in b) {
        var d = b[c];
        d.parentNode.removeChild(d)
    }
    a.appended = !1
};
SMap.Layer.Marker.prototype._build = function () {
    this._dom.container[SMap.LAYER_SHADOW] = JAK.mel("div", {id: this._id + "-" + SMap.LAYER_SHADOW});
    this._dom.container[SMap.LAYER_MARKER] = JAK.mel("div", {id: this._id + "-" + SMap.LAYER_MARKER});
    this._dom.container[SMap.LAYER_ACTIVE] = JAK.mel("div", {id: this._id + "-" + SMap.LAYER_ACTIVE});
    this._ec.push(JAK.Events.addListener(this._dom.container[SMap.LAYER_ACTIVE], "click", this, "_click"));
    this._ec.push(JAK.Events.addListener(this._dom.container[SMap.LAYER_MARKER], "click", this,
        "_click"));
    this._ec.push(JAK.Events.addListener(this._dom.container[SMap.LAYER_ACTIVE], "mousedown", this, "_mouseDown"));
    this._ec.push(JAK.Events.addListener(this._dom.container[SMap.LAYER_MARKER], "mousedown", this, "_mouseDown"))
};
SMap.Layer.Marker.prototype._mouseDown = function (a, b) {
    this._eventCoords = new SMap.Pixel(a.clientX, a.clientY)
};
SMap.Layer.Marker.prototype._click = function (a, b) {
    if (this._eventCoords) if (1.5 < (new SMap.Pixel(a.clientX, a.clientY)).distance(this._eventCoords)) a.preventDefault(); else {
        var c = JAK.Events.getTarget(a), d = [], e;
        for (e in this._dom.container) d.push(this._dom.container[e]);
        for (var f in this._markers) {
            e = this._markers[f].marker;
            var g = c, h = e.getActive();
            do {
                if (g == h) {
                    e.click(a, b);
                    return
                }
                g = g.parentNode
            } while (-1 == d.indexOf(g))
        }
    }
};
SMap.Layer.Geometry = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.Geometry", VERSION: "1.0", EXTEND: SMap.Layer});
SMap.Layer.Geometry.prototype.$constructor = function (a, b) {
    this._ec = [];
    this._canvas = null;
    this.$super(a);
    this._options = {supportsAnimation: !1};
    for (var c in b) this._options[c] = b[c];
    this._eventCoords = null;
    this._geometries = {}
};
SMap.Layer.Geometry.prototype.$destructor = function () {
    this.clear();
    this._geometries = {};
    this._canvas.$destructor();
    this.$super()
};
SMap.Layer.Geometry.prototype.supportsAnimation = function () {
    return SMap.TRANSFORM && this._options.supportsAnimation
};
SMap.Layer.Geometry.prototype.zoomTo = function (a, b) {
    if (this._active) {
        var c = this.getMap(), d = a - this.getMap().getZoom(), d = Math.pow(2, d), c = c.getSize().clone().scale(0.5),
            c = b.clone().plus(c).scale(1 - d);
        this._dom.container[SMap.LAYER_GEOMETRY].style[SMap.TRANSFORM] = "translate(" + c.x + "px, " + c.y + "px) scale(" + d + "," + d + ")"
    }
};
SMap.Layer.Geometry.prototype.addGeometry = function (a) {
    this._addGeometry(a);
    if (this._active) {
        var b = this.getMap().getSize().clone().scale(0.5);
        a.draw(this._canvas, b)
    }
    return a
};
SMap.Layer.Geometry.prototype.removeGeometry = function (a) {
    if (!(a.getId() in this._geometries)) throw Error("Cannot remove geometry " + a.getId());
    a.clear();
    a.setOwner(null);
    delete this._geometries[a.getId()]
};
SMap.Layer.Geometry.prototype.getGeometries = function () {
    return this._geometries
};
SMap.Layer.Geometry.prototype.clear = function () {
    for (var a in this._geometries) this._geometries[a].clear()
};
SMap.Layer.Geometry.prototype.removeAll = function () {
    var a = [], b;
    for (b in this._geometries) a.push(this._geometries[b]);
    for (; a.length;) this.removeGeometry(a.shift())
};
SMap.Layer.Geometry.prototype.fillFromData = function (a) {
    var b = [];
    a instanceof Array || (a = [a]);
    for (var c = 0; c < a.length; c++) {
        var d = a[c];
        d.nodeType ? this._fillFromXML(d, b) : this._fillFromData(d, b)
    }
    b.sort(function (a, b) {
        var c = a.isPoint(), d = b.isPoint();
        return c == d ? 0 : c ? -1 : 1
    });
    for (this.removeAll(); b.length;) this._addGeometry(b.pop());
    this.redraw()
};
SMap.Layer.Geometry.prototype._fillFromXML = function (a, b) {
    for (var c = a.getElementsByTagName("geometry"), d = 0; d < c.length; d++) {
        var e = c[d], f = SMap.LOOKUP_GEOMETRY[e.getAttribute("source")] || SMap.Geometry.Multi;
        b.push(f.fromXML(e))
    }
};
SMap.Layer.Geometry.prototype._fillFromData = function (a, b) {
    for (var c = a.poi || [], d = 0; d < c.length; d++) {
        var e = c[d];
        e.geom && b.push((SMap.LOOKUP_GEOMETRY[e.source] || SMap.Geometry.Multi).fromData(e))
    }
};
SMap.Layer.Geometry.prototype.redraw = function (a) {
    if (this._active) {
        this.clear();
        SMap.TRANSFORM && (this._dom.container[SMap.LAYER_GEOMETRY].style[SMap.TRANSFORM] = "scale(1)");
        a = this.getMap().getSize();
        a = new SMap.Pixel(Math.round(a.x / 2), Math.round(a.y / 2));
        for (var b in this._geometries) this._geometries[b].draw(this._canvas, a)
    }
};
SMap.Layer.Geometry.prototype.redrawGeometry = function (a) {
    if (this._active) {
        var b = this.getMap().getSize(), b = new SMap.Pixel(Math.round(b.x / 2), Math.round(b.y / 2));
        a.clear();
        a.draw(this._canvas, b)
    }
};
SMap.Layer.Geometry.prototype._addGeometry = function (a) {
    var b = a.getId();
    this._geometries[b] && this.removeGeometry(this._geometries[b]);
    this._geometries[a.getId()] = a;
    a.setOwner(this)
};
SMap.Layer.Geometry.prototype._build = function () {
    this._canvas = JAK.Vector.getCanvas(1, 1);
    var a = this._canvas.group();
    a.id = this._id + "-" + SMap.LAYER_GEOMETRY;
    this._ec.push(JAK.Events.addListener(a, "click", this, "_click"));
    this._ec.push(JAK.Events.addListener(a, "mousedown", this, "_mouseDown"));
    this._dom.container[SMap.LAYER_GEOMETRY] = a;
    this._canvas.setContent(a)
};
SMap.Layer.Geometry.prototype._mouseDown = function (a, b) {
    this._eventCoords = new SMap.Pixel(a.clientX, a.clientY)
};
SMap.Layer.Geometry.prototype._click = function (a, b) {
    if (this._eventCoords && !(1.5 < (new SMap.Pixel(a.clientX, a.clientY)).distance(this._eventCoords))) {
        var c = JAK.Events.getTarget(a), d;
        for (d in this._geometries) if (-1 != this._geometries[d].getNodes().indexOf(c)) {
            this._geometries[d].click(a, b);
            break
        }
    }
};
SMap.Layer.Vector = SMap.Layer.Geometry;
SMap.Layer.Vector.prototype.addCircle = function (a, b, c) {
    return this._addItem(SMap.GEOMETRY_CIRCLE, [a, b], c)
};
SMap.Layer.Vector.prototype.addPath = function (a, b) {
    return this._addItem(SMap.GEOMETRY_PATH, a, b)
};
SMap.Layer.Vector.prototype.removePolyline = function (a) {
    this.removeGeometry(a)
};
SMap.Layer.Vector.prototype.removePolygon = function (a) {
    this.removeGeometry(a)
};
SMap.Layer.Vector.prototype.removeCircle = function (a) {
    this.removeGeometry(a)
};
SMap.Layer.Vector.prototype.removePath = function (a) {
    this.removeGeometry(a)
};
SMap.Layer.Vector.prototype.addPolyline = function (a, b) {
    return this._addItem(SMap.GEOMETRY_POLYLINE, a, b)
};
SMap.Layer.Vector.prototype.addPolygon = function (a, b) {
    return this._addItem(SMap.GEOMETRY_POLYGON, a, b)
};
SMap.Layer.Vector.prototype.addVector = function () {
    return this.addGeometry.apply(this, arguments)
};
SMap.Layer.Vector.prototype.removeVector = function () {
    return this.removeGeometry.apply(this, arguments)
};
SMap.Layer.Vector.prototype._addItem = function (a, b, c) {
    a = new SMap.Geometry(a, null, b, c);
    return this.addGeometry(a)
};
SMap.Geometry = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry",
    VERSION: "1.0",
    IMPLEMENT: [SMap.IOwned, JAK.IDecorable]
});
SMap.Geometry.prototype.DEFAULT_OPTIONS = {};
SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_POLYLINE] = {
    color: "red",
    opacity: 0.65,
    width: 5,
    outlineColor: "white",
    outlineWidth: 3,
    outlineOpacity: 0.6
};
SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_PATH] = SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_POLYLINE];
SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_POLYGON] = {
    color: "red",
    opacity: 0.2,
    outlineColor: "red",
    outlineWidth: 2,
    outlineOpacity: 0.55
};
SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_CIRCLE] = {
    color: "red",
    opacity: 0.65,
    width: 8,
    outlineColor: "white",
    outlineWidth: 2,
    outlineOpacity: 0.6
};
SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_ELLIPSE] = SMap.Geometry.prototype.DEFAULT_OPTIONS[SMap.GEOMETRY_CIRCLE];
SMap.Geometry.WKTToGeometries = function (a, b) {
    function c(a) {
        return (a = a.match(/(([\d]+[\.]*[\d]*)[\s]+([\d]+[\.]*[\d]*))/gi)) ? a.map(function (a) {
            if ((a = a.match(/(([\d]+[\.]*[\d]*)[\s]+([\d]+[\.]*[\d]*))/)) && 4 == a.length) try {
                return new SMap.Coords(parseFloat(a[2]), parseFloat(a[3]))
            } catch (b) {
                return null
            }
        }).filter(function (a) {
            return null != a
        }) : []
    }

    function d(a, d) {
        var e = a.match(/(\([^\(\)]+\))/gi);
        return e ? e.map(function (a) {
            a = c(a);
            return new SMap.Geometry(d, null, a, b)
        }) : []
    }

    var e = a.match(/^[\s]*([\w]+)[\s]*\((.+)\)[\s]*$/);
    if (!e) return [];
    switch (e[1].toLowerCase()) {
        case "point":
        case "multipoint":
            return c(e[2]).map(function (a) {
                return new SMap.Geometry(SMap.GEOMETRY_CIRCLE, null, [a, 4], b)
            });
        case "multilinestring":
        case "linestring":
            return d(a, SMap.GEOMETRY_POLYLINE);
        case "polygon":
        case "multipolygon":
            return d(a, SMap.GEOMETRY_POLYGON)
    }
    return []
};
SMap.Geometry.prototype.$constructor = function (a, b, c, d) {
    this._owner = null;
    this._type = a;
    this._id = b || Math.random();
    this._coords = c;
    this._pixels = [];
    this._bbox = {min: null, max: null};
    this._options = {minDist: 3};
    for (var e in this.DEFAULT_OPTIONS[a]) this._options[e] = this.DEFAULT_OPTIONS[a][e];
    for (e in d) this._options[e] = d[e];
    this._instance = null
};
SMap.Geometry.prototype.$destructor = function () {
    this.clear();
    this._coords = []
};
SMap.Geometry.prototype.getId = function () {
    return this._id
};
SMap.Geometry.prototype.getType = function () {
    return this._type
};
SMap.Geometry.prototype.getCoords = function () {
    return this._coords
};
SMap.Geometry.prototype.getPixels = function () {
    return this._pixels
};
SMap.Geometry.prototype.getOptions = function () {
    return this._options
};
SMap.Geometry.prototype.setOptions = function (a) {
    for (var b in a) this._options[b] = a[b];
    this._instance && this._instance.setOptions(this._options)
};
SMap.Geometry.prototype.getNodes = function () {
    return this._instance ? this._instance.getNodes() : []
};
SMap.Geometry.prototype.click = function (a, b) {
    this.getMap().getSignals().makeEvent("geometry-click", this, {event: a})
};
SMap.Geometry.prototype.clear = function () {
    this._instance && (this._instance.$destructor(), this._instance = null);
    this._bbox = {min: null, max: null}
};
SMap.Geometry.prototype.draw = function (a, b) {
    var c = this._convertCoords(this._coords, b);
    switch (this._type) {
        case SMap.GEOMETRY_POLYLINE:
        case SMap.GEOMETRY_POLYGON:
            var d = {};
            d[SMap.GEOMETRY_POLYLINE] = JAK.Vector.Line;
            d[SMap.GEOMETRY_POLYGON] = JAK.Vector.Polygon;
            for (var e = d[this._type], f = [], d = 0; d < c.length; d++) f.push(new JAK.Vec2d(c[d].x, c[d].y));
            this._instance = new e(a, f, this._options);
            break;
        case SMap.GEOMETRY_CIRCLE:
            d = new JAK.Vec2d(c[0].x, c[0].y);
            e = null;
            c[1] instanceof SMap.Pixel ? (e = c[0].clone().minus(c[1]),
                e = Math.sqrt(e.x * e.x + e.y * e.y)) : e = c[1];
            this._instance = new JAK.Vector.Circle(a, d, e, this._options);
            break;
        case SMap.GEOMETRY_ELLIPSE:
            d = new JAK.Vec2d(c[0].x, c[0].y);
            e = [];
            for (f = 1; 3 > f; f++) if (c[f] instanceof SMap.Pixel) {
                var g = c[0].clone().minus(c[f]);
                e.push(Math.sqrt(g.x * g.x + g.y * g.y))
            } else e.push(c[f]);
            this._instance = new JAK.Vector.Ellipse(a, d, e, this._options);
            break;
        case SMap.GEOMETRY_PATH:
            e = [];
            for (d = 0; d < c.length; d++) g = c[d], g instanceof SMap.Pixel ? (f = Math.round(g.x), g = Math.round(g.y), e.push(f + " " + g)) : g instanceof
            Array ? (g[0].minus(g[1]), e.push(Math.sqrt(g[0].x * g[0].x + g[0].y * g[0].y))) : e.push(g);
            c = e.join(" ");
            this._instance = new JAK.Vector.Path(a, c, this._options)
    }
};
SMap.Geometry.prototype.setCoords = function (a) {
    this._coords = a;
    this._owner && this._owner.redrawGeometry(this)
};
SMap.Geometry.prototype.computeCenterZoom = function (a, b) {
    for (var c = [], d = 0; d < this._coords.length; d++) {
        var e = this._coords[d];
        e instanceof Array || (e = [e]);
        for (var f = 0; f < e.length; f++) {
            var g = e[f];
            g instanceof SMap.Coords && c.push(g)
        }
    }
    return a.computeCenterZoom(c, b)
};
SMap.Geometry.prototype.countBBox = function () {
    for (var a = Infinity, b = Infinity, c = -Infinity, d = -Infinity, e = 0; e < this._coords.length; e++) var f = this._coords[e], a = Math.min(f.x, a), b = Math.min(f.y, b), c = Math.max(f.x, c), d = Math.max(f.y, d);
    this._bbox.min = SMap.Coords.fromWGS84(a, b);
    this._bbox.max = SMap.Coords.fromWGS84(c, d)
};
SMap.Geometry.prototype.getBBox = function () {
    var a = {x: 0, y: 0, width: 0, height: 0};
    if (this._bbox.min && this._bbox.max) {
        var b = this.getMap(), c = this._bbox.min.toPixel(b), d = this._bbox.max.toPixel(b), b = b.getSize();
        a.x = Math.round(Math.min(c.x, d.x) + b.x / 2);
        a.y = Math.round(Math.min(c.y, d.y) + b.y / 2);
        a.width = Math.round(Math.abs(d.x - c.x));
        a.height = Math.round(Math.abs(d.y - c.y))
    }
    return a
};
SMap.Geometry.prototype.isGeometryVisible = function () {
    var a = !1, b = this.getMap(), c = b.getGeometryCanvas().canvas, d = b.getSize();
    if (c && "createSVGRect" in c && "checkIntersection" in c) {
        b = c.createSVGRect();
        b.x = 0;
        b.y = 0;
        b.width = d.x;
        b.height = d.y;
        for (var d = this.getNodes(), e = 0; e < d.length; e++) if (c.checkIntersection(d[e], b)) {
            a = !0;
            break
        }
    } else c = this.getBBox(), this._isIntersection({x: 0, y: 0, width: d.x, height: d.y}, c) && (a = !0);
    return a
};
SMap.Geometry.prototype._isIntersection = function (a, b) {
    var c = Math.max(a.x, b.x), d = Math.max(a.y, b.y), e = Math.min(a.x + a.width, b.x + b.width),
        f = Math.min(a.y + a.height, b.y + b.height), g = Math.abs(e - c), h = Math.abs(f - d);
    return c <= e && d <= f && 0 < g * h ? !0 : !1
};
SMap.Geometry.prototype._convertCoords = function (a, b) {
    var c = this._options.minDist, d = this.getMap();
    this._pixels = [];
    for (var e = [], f = null, g = 0; g < a.length; g++) {
        var h = a[g];
        if (h instanceof SMap.Coords) {
            h = h.toPixel(d);
            if (f && f.distance(h) <= c && this._type != SMap.GEOMETRY_ELLIPSE && this._type != SMap.GEOMETRY_CIRCLE) {
                if (this._type == SMap.GEOMETRY_PATH) {
                    for (h = e.length - 1; h && "string" != typeof e[h];) h--;
                    e.splice(h)
                }
                continue
            }
            f = h.clone();
            this._pixels.push(f);
            h.plus(b)
        } else if (h instanceof Array) {
            for (var f = null, k = [], l = 0; l <
            h.length; l++) k.push(h[l].toPixel(d).plus(b));
            h = k
        }
        e.push(h)
    }
    return e
};
SMap.Vector = SMap.Geometry;
SMap.Geometry.Feature = JAK.ClassMaker.makeStatic({NAME: "SMap.Geometry.Feature"});
SMap.Geometry.Feature.Card = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Geometry.Feature.Card",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Geometry.Feature.Card.prototype.decorate = function (a, b) {
    this.$super(a);
    a._card = b;
    a._setCursor = this._setCursor;
    a.click = this.click;
    a.draw = this.draw;
    a._setCursor();
    return a
};
SMap.Geometry.Feature.Card.prototype.click = function (a, b) {
    this.$super(a, b);
    this.getMap().addCard(this._card, SMap.Coords.fromEvent(a, this.getMap()))
};
SMap.Geometry.Feature.Card.prototype.draw = function (a, b) {
    this.$super(a, b);
    this._setCursor()
};
SMap.Geometry.Feature.Card.prototype._setCursor = function () {
    for (var a = this.getNodes(), b = 0; b < a.length; b++) a[b].style.cursor = "pointer"
};
SMap.Geometry.Multi = JAK.ClassMaker.makeClass({NAME: "SMap.Geometry.Multi", VERSION: "1.0", EXTEND: SMap.Geometry});
SMap.Geometry.Multi.fromXML = function (a) {
    var b = this._optionsFromXML(a), c = new this(a.getAttribute("source") + a.getAttribute("id"), b);
    c.setSource(a.getAttribute("source"));
    c.setPlainId(a.getAttribute("id"));
    a = JAK.XML.childElements(a);
    for (var d = 0; d < a.length; d++) {
        var e = this._geometryFromXML(a[d], b);
        c.addGeometry(e)
    }
    return c
};
SMap.Geometry.Multi.fromData = function (a) {
    var b = this._optionsFromData(a), c = new this(a.source + a.id, b);
    c.setSource(a.source);
    c.setPlainId(a.id);
    a = this._geometryFromData(a, b);
    for (a instanceof Array || (a = [a]); a.length;) c.addGeometry(a.shift());
    return c
};
SMap.Geometry.Multi._optionsFromXML = function (a) {
    var b = {}, c = a.getAttribute("title");
    c && (b.title = c);
    if (c = a.getAttribute("color")) b.color = c;
    if (c = a.getAttribute("opacity")) b.opacity = parseFloat(c);
    if (c = a.getAttribute("width")) b.width = parseFloat(c);
    if (c = a.getAttribute("style")) b.style = parseInt(c);
    if (c = a.getAttribute("exactStyle")) b.exactStyle = c;
    if (c = a.getAttribute("outlineColor")) b.outlineColor = c;
    if (c = a.getAttribute("outlineOpacity")) b.outlineOpacity = parseFloat(c);
    if (c = a.getAttribute("outlineWidth")) b.outlineWidth =
        parseFloat(c);
    if (c = a.getAttribute("outlineStyle")) b.outlineStyle = parseInt(c);
    if (a = a.getAttribute("outlineExactStyle")) b.outlineExactStyle = a;
    return b
};
SMap.Geometry.Multi._optionsFromData = function (a) {
    var b = a.geom;
    a = {title: a.title};
    for (var c in b.style) c.match(/width|opacity/i) ? a[c] = parseFloat(b.style[c]) : a[c] = b.style[c];
    return a
};
SMap.Geometry.Multi._geometryFromXML = function (a, b) {
    switch (a.nodeName.toLowerCase()) {
        case "polygon":
            var c = this._coordsFromXML(a);
            return new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, c, b);
        case "linestring":
            return c = this._coordsFromXML(a), new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, c, b);
        case "circle":
            return c = a.getElementsByTagName("point")[0], c = SMap.Coords.fromWGS84(c.getAttribute("x"), c.getAttribute("y")), new SMap.Geometry(SMap.GEOMETRY_CIRCLE, null, [c, b.width || 5], b);
        default:
            throw Error("Unknown sub-geometry '" +
                a.nodeName + "'");
    }
};
SMap.Geometry.Multi._geometryFromData = function (a, b) {
    var c = a.geom;
    switch (c.type) {
        case "linestring":
        case "multilinestring":
            for (var d = [], e = 0; e < c.data.length; e++) {
                var f = SMap.Coords.stringToCoords(c.data[e]);
                d.push(new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, f, b))
            }
            return d;
        case "polygon":
        case "multipolygon":
            d = [];
            for (e = 0; e < c.data.length; e++) f = SMap.Coords.stringToCoords(c.data[e]), d.push(new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, f, b));
            return d;
        case "point":
            return c = SMap.Coords.stringToCoords(c.data[0])[0], new SMap.Geometry(SMap.GEOMETRY_CIRCLE,
                null, [c, b.width || 5], b);
        default:
            throw Error("Unknown geometry '" + c.type + "'");
    }
};
SMap.Geometry.Multi._coordsFromXML = function (a) {
    var b = [];
    a = a.getElementsByTagName("point");
    for (var c = 0; c < a.length; c++) {
        var d = a[c], d = SMap.Coords.fromWGS84(d.getAttribute("x"), d.getAttribute("y"));
        b.push(d)
    }
    return b
};
SMap.Geometry.Multi.prototype.$constructor = function (a, b) {
    this.$super(null, a, [], b);
    this._geometries = [];
    this._plainId = this._source = null
};
SMap.Geometry.Multi.prototype.$destructor = function () {
    for (; this._geometries.length;) this._geometries.pop().$destructor()
};
SMap.Geometry.Multi.prototype.addGeometry = function (a) {
    this._geometries.push(a)
};
SMap.Geometry.Multi.prototype.getGeometries = function () {
    return this._geometries
};
SMap.Geometry.Multi.prototype.clear = function () {
    for (var a = 0; a < this._geometries.length; a++) this._geometries[a].clear()
};
SMap.Geometry.Multi.prototype.draw = function (a, b) {
    for (var c = 0; c < this._geometries.length; c++) this._geometries[c].draw(a, b)
};
SMap.Geometry.Multi.prototype.setOwner = function (a) {
    this.$super(a);
    for (var b = 0; b < this._geometries.length; b++) this._geometries[b].setOwner(a)
};
SMap.Geometry.Multi.prototype.computeCenterZoom = function (a, b) {
    for (var c = [], d = 0; d < this._geometries.length; d++) for (var e = this._geometries[d].getCoords(), f = 0; f < e.length; f++) {
        var g = e[f];
        g instanceof Array || (g = [g]);
        for (var h = 0; h < g.length; h++) g[h] instanceof SMap.Coords && c.push(g[h])
    }
    return a.computeCenterZoom(c, b)
};
SMap.Geometry.Multi.prototype.isArea = function () {
    for (var a = 0; a < this._geometries.length; a++) if (this._geometries[a].getType() == SMap.GEOMETRY_POLYGON) return !0;
    return !1
};
SMap.Geometry.Multi.prototype.isPoint = function () {
    for (var a = 0; a < this._geometries.length; a++) if (this._geometries[a].getType() != SMap.GEOMETRY_CIRCLE) return !1;
    return !0
};
SMap.Geometry.Multi.prototype.setSource = function (a) {
    this._source = a
};
SMap.Geometry.Multi.prototype.getSource = function () {
    return this._source
};
SMap.Geometry.Multi.prototype.setPlainId = function (a) {
    this._plainId = a
};
SMap.Geometry.Multi.prototype.getPlainId = function () {
    return this._plainId
};
SMap.Geometry.Multi.prototype.getNodes = function () {
    for (var a = [], b = 0; b < this._geometries.length; b++) a = a.concat(this._geometries[b].getNodes());
    return a
};
SMap.Geometry.Multi.prototype.click = function (a, b) {
    this.getMap().getSignals().makeEvent("geometry-multi-click", this, {event: a})
};
SMap.Geometry.Multi.prototype.countBBox = function () {
    for (var a = Infinity, b = Infinity, c = -Infinity, d = -Infinity, e = 0, f = 0; f < this._geometries.length; f++) for (var g = this._geometries[f].getCoords(), e = e + g.length, h = 0; h < g.length; h++) a = Math.min(g[h].x, a), b = Math.min(g[h].y, b), c = Math.max(g[h].x, c), d = Math.max(g[h].y, d);
    e && (this._bbox.min = SMap.Coords.fromWGS84(a, b), this._bbox.max = SMap.Coords.fromWGS84(c, d))
};
SMap.Geometry.Smart = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry.Smart",
    VERSION: "1.0",
    EXTEND: SMap.Geometry.Multi
});
SMap.Geometry.Smart.prototype.$constructor = function (a, b, c, d) {
    this._owner = null;
    this._type = a;
    this._plainId = this._source = null;
    this._id = b || Math.random();
    this._coords = c;
    this._pixels = [];
    this._geometries = [];
    this._visibleInterval = [];
    this._pixelsData = {pixels: [], zoom: 0, sizeKey: "", fullPixels: []};
    this._bbox = {min: null, max: null};
    this._options = {minDist: 3};
    for (var e in this.DEFAULT_OPTIONS[a]) this._options[e] = this.DEFAULT_OPTIONS[a][e];
    for (e in d) this._options[e] = d[e]
};
SMap.Geometry.Smart.prototype.draw = function (a, b) {
    this._convertCoords();
    for (var c = 0; c < this._geometries.length; c++) this._geometries[c].draw(a, b)
};
SMap.Geometry.Smart.prototype.click = function (a, b) {
    this.getMap().getSignals().makeEvent("geometry-click", this, {event: a})
};
SMap.Geometry.Smart.prototype.getVisibleFracInterval = function () {
    return this._visibleInterval
};
SMap.Geometry.Smart.prototype._convertCoords = function (a, b) {
    var c = this.getMap();
    if (c) {
        var d = c.getSize(), e = d.x + "|" + d.y, f = c.getCenter(), g = c.getZoom(), f = f.x + "|" + f.y + "|" + g,
            h = this._options.minDist;
        b = b || d.clone().scale(0.5);
        var k = b.clone(), l = k.clone().scale(-1), m = [], n = [];
        a = [];
        var q = [], r = 0;
        this._visibleInterval = [];
        for (var p = -1; this._geometries.length;) this._geometries.pop().$destructor();
        (this._coords[0] instanceof SMap.Coords ? [this._coords] : this._coords).forEach(function (d) {
            var e = null, f = !1, g = !1, t = !1, C = !1;
            if (0 > p || 0 <= p && n[p].length) p++, n[p] = [], a[p] = [];
            for (var y = p, D = p, w = 0; w < d.length; w++) {
                var B = d[w], x = !0, g = !1, v = B;
                if (B instanceof SMap.Coords) {
                    var v = B.toPixel(c), z = w + 1 <= d.length - 1 ? d[w + 1].toPixel(c) : null,
                        E = e ? e.distance(v) : 0;
                    v.x >= l.x && v.x <= k.x && v.y >= l.y && v.y <= k.y ? f = !0 : (x = f ? !0 : !1, f = !1);
                    !x && z && z.x >= l.x && z.x <= k.x && z.y >= l.y && z.y <= k.y && (g = f = x = !0, n[p].length && (p++, n[p] = [], a[p] = []));
                    if ((!x || f) && !g && e && E <= h && this._type != SMap.GEOMETRY_ELLIPSE && this._type != SMap.GEOMETRY_CIRCLE) {
                        if (this._type == SMap.GEOMETRY_PATH) {
                            for (g =
                                     m.length - 1; g && "string" != typeof m[g];) g--;
                            m.splice(g)
                        }
                        continue
                    }
                    r += E;
                    e = v.clone();
                    x && (n[p].push(e), a[p].push(B), 0 == w ? t = !0 : w == d.length - 1 && (C = !0));
                    q.push(e);
                    v.plus(b)
                }
                x && m.push(v);
                D = p
            }
            y != D && t && C && this._type == SMap.GEOMETRY_POLYGON && (n[y] = n.pop().concat(n[y]), a[y] = a.pop().concat(a[y]), p--)
        }.bind(this));
        n[n.length - 1].length || (n.pop(), a.pop());
        for (d = 0; d < a.length; d++) 2 > n[d].length || (g = SMap.Geometry.Smart.Simplify.simplify(n[d], a[d], 0.6), g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, g.coords, this._options),
        this._owner && g.setOwner(this._owner), this._geometries.push(g));
        for (d = g = 0; d < q.length; d++) q[d + 1] && (g += q[d].distance(q[d + 1])), n[0] != q[d] && n[n.length - 1] != q[d] || this._visibleInterval.push(g / r);
        this._pixelsData.sizeKey = e;
        this._pixelsData.posKey = f;
        this._pixelsData.pixels = n;
        this._pixelsData.fullPixels = q
    }
};
SMap.Geometry.Smart.Simplify = {};
SMap.Geometry.Smart.Simplify.getSqDist = function (a, b) {
    var c = a.x - b.x, d = a.y - b.y;
    return c * c + d * d
};
SMap.Geometry.Smart.Simplify.getSqSegDist = function (a, b, c) {
    var d = b.x;
    b = b.y;
    var e = c.x - d, f = c.y - b;
    if (0 !== e || 0 !== f) {
        var g = ((a.x - d) * e + (a.y - b) * f) / (e * e + f * f);
        1 < g ? (d = c.x, b = c.y) : 0 < g && (d += e * g, b += f * g)
    }
    e = a.x - d;
    f = a.y - b;
    return e * e + f * f
};
SMap.Geometry.Smart.Simplify.simplifyRadialDist = function (a, b, c) {
    for (var d = a[0], e = [d], f = [b[0]], g, h, k = 1, l = a.length; k < l; k++) g = a[k], h = b[k], SMap.Geometry.Smart.Simplify.getSqDist(g, d) > c && (e.push(g), f.push(h), d = g);
    d !== g && (e.push(g), f.push(h));
    return {points: e, coords: f}
};
SMap.Geometry.Smart.Simplify.simplifyDPStep = function (a, b, c, d, e, f, g) {
    for (var h = e, k, l = c + 1; l < d; l++) {
        var m = SMap.Geometry.Smart.Simplify.getSqSegDist(a[l], a[c], a[d]);
        m > h && (k = l, h = m)
    }
    h > e && (1 < k - c && SMap.Geometry.Smart.Simplify.simplifyDPStep(a, b, c, k, e, f, g), f.push(a[k]), g.push(b[k]), 1 < d - k && SMap.Geometry.Smart.Simplify.simplifyDPStep(a, b, k, d, e, f, g))
};
SMap.Geometry.Smart.Simplify.simplifyDouglasPeucker = function (a, b, c) {
    var d = a.length - 1, e = [a[0]], f = [b[0]];
    SMap.Geometry.Smart.Simplify.simplifyDPStep(a, b, 0, d, c, e, f);
    e.push(a[d]);
    f.push(b[d]);
    return {points: e, coords: f}
};
SMap.Geometry.Smart.Simplify.simplify = function (a, b, c, d) {
    if (2 >= a.length) return {points: a, coords: b};
    c = void 0 !== c ? c * c : 1;
    a = d ? {points: a, coords: b} : SMap.Geometry.Smart.Simplify.simplifyRadialDist(a, b, c);
    return a = SMap.Geometry.Smart.Simplify.simplifyDouglasPeucker(a.points, a.coords, c)
};
SMap.Marker = JAK.ClassMaker.makeClass({NAME: "SMap.Marker", VERSION: "1.0", IMPLEMENT: [SMap.IOwned, JAK.IDecorable]});
SMap.Marker._image = JAK.mel("img");
SMap.Marker.fromXML = function (a) {
    var b = {title: a.getAttribute("title")}, c = a.getAttribute("url");
    c && (b.url = c);
    c = a.getElementsByTagName("anchor");
    if (c.length) {
        for (var c = c[0], d = {}, e = 0; e < c.attributes.length; e++) {
            var f = c.attributes[e];
            d[f.nodeName] = parseInt(f.nodeValue)
        }
        b.anchor = d
    }
    return new this(SMap.Coords.fromWGS84(parseFloat(a.getAttribute("x")), parseFloat(a.getAttribute("y"))), a.getAttribute("source") + a.getAttribute("id"), b)
};
SMap.Marker.fromData = function (a) {
    var b = {title: a.title};
    a.paid && (b.paid = a.paid);
    a.url && (b.url = a.url);
    a.anchor && (b.anchor = a.anchor);
    a.size && (b.size = a.size);
    return new this(SMap.Coords.fromWGS84(a.mark.lon, a.mark.lat), a.source + a.id, b)
};
SMap.Marker.prototype.$constructor = function (a, b, c) {
    this._options = {title: "", url: SMap.CONFIG.img + "/marker/drop-red.png", size: null, anchor: {left: 11, top: 30}};
    for (var d in c) this._options[d] = c[d];
    this._ec = {};
    this._id = b || Math.random();
    this._owner = !1;
    this._coords = a;
    this._dom = {container: {}, active: null};
    this._build()
};
SMap.Marker.prototype.$destructor = function () {
    for (var a in this._ec) JAK.Events.removeListener(this._ec[a]);
    this._ec = {}
};
SMap.Marker.prototype.getCoords = function () {
    return this._coords
};
SMap.Marker.prototype.getContainer = function () {
    return this._dom.container
};
SMap.Marker.prototype.getAnchor = function () {
    return this._options.anchor
};
SMap.Marker.prototype.getTitle = function () {
    return this._options.title
};
SMap.Marker.prototype.getId = function () {
    return this._id
};
SMap.Marker.prototype.getSize = function () {
    return this._options.size
};
SMap.Marker.prototype.setURL = function (a) {
    this._dom.container[SMap.LAYER_MARKER].src = a
};
SMap.Marker.prototype.setCoords = function (a) {
    this._coords = a;
    this._owner && this._owner.positionMarker(this)
};
SMap.Marker.prototype.getActive = function () {
    return this._dom.active
};
SMap.Marker.prototype.click = function (a, b) {
    var c = this._dom.active;
    c && "a" == c.nodeName.toLowerCase() && SMap.Util.linkToNewWindow(a) || this.getMap().getSignals().makeEvent("marker-click", this, {event: a})
};
SMap.Marker.prototype._build = function () {
    if ("string" == typeof this._options.url) {
        var a = SMap.Marker._image.cloneNode(!1);
        a.src = this._options.url;
        this._dom.container[SMap.LAYER_MARKER] = a
    } else this._dom.container[SMap.LAYER_MARKER] = this._options.url;
    this._options.title && (this._dom.container[SMap.LAYER_MARKER].title = this._options.title);
    this._dom.active = this._dom.container[SMap.LAYER_MARKER]
};
SMap.Marker.Feature = JAK.ClassMaker.makeStatic({NAME: "SMap.Marker.Feature"});
SMap.Marker.Feature.ImageMap = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Marker.Feature.ImageMap",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Marker.Feature.ImageMap.prototype.decorate = function (a, b) {
    this.$super(a);
    var c = {useMap: "", blank: "", width: 0, height: 0}, d;
    for (d in b) c[d] = b[d];
    a._over = this._over;
    a._out = this._out;
    a._convertAreaCoords = this._convertAreaCoords;
    this._buildMap(a, c);
    return a
};
SMap.Marker.Feature.ImageMap.prototype._convertAreaCoords = function (a) {
    a = a.split(",");
    for (var b = [Infinity, Infinity], c = [-Infinity, -Infinity], d = 0; d < a.length; d++) {
        var e = d & 1, f = a[d];
        b[e] = Math.min(b[e], f);
        c[e] = Math.max(c[e], f)
    }
    for (d = 0; d < a.length; d++) e = d & 1, f = a[d], f -= b[e], a[d] = f;
    return {parts: a, min: b, max: c}
};
SMap.Marker.Feature.ImageMap.prototype._buildMap = function (a, b) {
    var c = JAK.mel("div");
    a._dom.container[SMap.LAYER_ACTIVE] = c;
    b.width && b.height && (c.style.width = b.width + "px", c.style.height = b.height + "px");
    var d = this._convertAreaCoords(b.useMap), e = "m" + a.getId(), f = JAK.mel("map");
    "gecko" == JAK.Browser.client || "safari" == JAK.Browser.client || "chrome" == JAK.Browser.client ? f.name = e : f.id = e;
    c.appendChild(f);
    var g = JAK.mel("area", {
        href: "#",
        shape: "poly",
        coords: d.parts.join(","),
        title: a._options.title
    }, {cursor: "pointer"});
    f.appendChild(g);
    f = JAK.mel("img", {}, {position: "absolute", left: d.min[0] + "px", top: d.min[1] + "px", border: "none"});
    f.useMap = "#" + e;
    f.src = b.blank;
    f.width = d.max[0] - d.min[0] + 1;
    f.height = d.max[1] - d.min[1] + 1;
    c.appendChild(f);
    "ie" == JAK.Browser.client && (a._ec._im_ie_blur = JAK.Events.addListener(g, "click", this, "_blur"), a._ec._im_ie_over = JAK.Events.addListener(g, "mouseover", a, "_over"), a._ec._im_ie_out = JAK.Events.addListener(g, "mouseout", a, "_out"));
    a._ec._im_click = JAK.Events.addListener(g, "click", JAK.Events.cancelDef);
    a._dom.active = g
};
SMap.Marker.Feature.ImageMap.prototype._blur = function (a, b) {
    b.blur()
};
SMap.Marker.Feature.ImageMap.prototype._over = function (a, b) {
    this._dom.container[SMap.LAYER_ACTIVE].style.cursor = "pointer"
};
SMap.Marker.Feature.ImageMap.prototype._out = function (a, b) {
    this._dom.container[SMap.LAYER_ACTIVE].style.cursor = "move"
};
SMap.Marker.Feature.RelativeAnchor = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Marker.Feature.RelativeAnchor",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Marker.Feature.RelativeAnchor.prototype.decorate = function (a, b) {
    this.$super(a);
    a._computeRelativeAnchor = this._computeRelativeAnchor;
    a._loadedRelativeAnchor = this._loadedRelativeAnchor;
    var c = a._options;
    c.relativeAnchor = b.anchor;
    var d = a._dom.container, e = d[SMap.LAYER_MARKER];
    if (b.size) c.size = b.size, a._computeRelativeAnchor(); else if (e.width && e.height) c.size = new SMap.Pixel(e.width, e.height), a._computeRelativeAnchor(); else {
        for (var f in d) d[f].style.visibility = "hidden";
        a._ec._ra_load = JAK.Events.addListener(e,
            "load", a, "_loadedRelativeAnchor")
    }
    return a
};
SMap.Marker.Feature.RelativeAnchor.prototype._computeRelativeAnchor = function () {
    var a = this._options, b = a.relativeAnchor;
    "left" in b && (a.anchor.left = Math.round(a.size.x * b.left));
    "right" in b && (a.anchor.right = Math.round(a.size.x * b.right));
    "top" in b && (a.anchor.top = Math.round(a.size.y * b.top));
    "bottom" in b && (a.anchor.bottom = Math.round(a.size.y * b.bottom))
};
SMap.Marker.Feature.RelativeAnchor.prototype._loadedRelativeAnchor = function (a, b) {
    this._options.size = new SMap.Pixel(b.width, b.height);
    this._computeRelativeAnchor();
    var c = this._owner;
    c && c.positionMarker(this);
    for (var d in this._dom.container) this._dom.container[d].style.visibility = "visible"
};
SMap.Marker.Feature.Card = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Marker.Feature.Card",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Marker.Feature.Card.prototype.decorate = function (a, b) {
    this.$super(a);
    a._card = b;
    a.click = this.click;
    a.getContainer()[SMap.LAYER_MARKER].style.cursor = "pointer";
    return a
};
SMap.Marker.Feature.Card.prototype.click = function (a, b) {
    this.$super(a, b);
    this.getMap().addCard(this._card, this._coords)
};
SMap.Marker.Feature.Card.prototype.getCard = function () {
    return this._card
};
SMap.Marker.Feature.Draggable = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Marker.Feature.Draggable",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Marker.Feature.Draggable.prototype.decorate = function (a) {
    this.$super(a);
    a._ecDrag = [];
    a._dragStart = this._dragStart;
    a._dragMove = this._dragMove;
    a._dragStop = this._dragStop;
    a.setDrag = this.setDrag;
    a._mapMoveChange = this._mapMoveChange;
    a._dragCoords = [];
    a._dragState = !0;
    this._startCenter = this._scMap = null;
    var b = a.getActive();
    b.setAttribute("touch-action", "none");
    a._ec._d_down = JAK.Events.addListener(b, "mousedown touchstart", a, "_dragStart");
    return a
};
SMap.Marker.Feature.Draggable.prototype.setDrag = function (a) {
    this._dragState = a
};
SMap.Marker.Feature.Draggable.prototype._mapMoveChange = function (a) {
    a = this.getMap();
    var b = this._startCenter.toPixel(a), c = this._coords.toPixel(a);
    c.minus(b);
    this.setCoords(c.toCoords(a));
    this._startCenter = this.getMap().getCenter();
    this.getMap().getSignals().makeEvent("marker-drag-move", this)
};
SMap.Marker.Feature.Draggable.prototype._dragStart = function (a, b) {
    if (this._dragState) {
        if (a.touches) a.clientX = a.touches[0].clientX, a.clientY = a.touches[0].clientY; else if (a.button != JAK.Browser.mouse.left) return;
        JAK.Events.getTarget(a).useMap || (this._scMap = this.getMap().getSignals().addListener(this, "map-redraw", "_mapMoveChange"), this._startCenter = this.getMap().getCenter(), JAK.Events.cancelDef(a), JAK.Events.stopEvent(a), this.getMap().getSignals().makeEvent("marker-drag-start", this, {event: a}), this._ecDrag.push(JAK.Events.addListener(document,
            "mousemove touchmove", this, "_dragMove")), this._ecDrag.push(JAK.Events.addListener(document, "mouseup touchend", this, "_dragStop")), this._dragCoords = [a.clientX, a.clientY], this._wasDrag = !1)
    }
};
SMap.Marker.Feature.Draggable.prototype._dragMove = function (a, b) {
    JAK.Events.cancelDef(a);
    a.touches && (a.clientX = a.touches[0].clientX, a.clientY = a.touches[0].clientY);
    this._wasDrag = !0;
    var c = this.getMap(), d = a.clientX - this._dragCoords[0], e = a.clientY - this._dragCoords[1];
    this._dragCoords = [a.clientX, a.clientY];
    d = new SMap.Pixel(d, e);
    d = this._coords.toPixel(c).plus(d);
    this.setCoords(d.toCoords(c));
    this.getMap().getSignals().makeEvent("marker-drag-move", this, {event: a})
};
SMap.Marker.Feature.Draggable.prototype._dragStop = function (a, b) {
    this._ecDrag.forEach(JAK.Events.removeListener, JAK.Events);
    this._ecDrag = [];
    this._scMap && (this.getMap().getSignals().removeListener(this._scMap), this._scMap = null);
    this._wasDrag ? this.getMap().getSignals().makeEvent("marker-drag-stop", this, {event: a}) : this.click(a, b)
};
SMap.Marker.Feature.Shadow = JAK.ClassMaker.makeSingleton({
    NAME: "SMap.Marker.Feature.Shadow",
    VERSION: "1.0",
    EXTEND: JAK.AbstractDecorator
});
SMap.Marker.Feature.Shadow.prototype.decorate = function (a, b) {
    this.$super(a);
    a._dom.container[SMap.LAYER_SHADOW] = JAK.mel("img", {src: b || SMap.CONFIG.img + "/marker/drop-shadow.png"})
};
SMap.Marker.Repositioner = JAK.ClassMaker.makeSingleton({NAME: "SMap.Marker.Repositioner", VERSION: "1.0"});
SMap.Marker.Repositioner.prototype.$constructor = function (a) {
    this._options = {};
    this._data = {};
    this._grid = {};
    this._todo = [];
    this._sizes = {};
    this._directions = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]]
};
SMap.Marker.Repositioner.prototype.go = function (a, b, c) {
    this._options = {itemSize: [18, 18], tolerance: 0, limit: Infinity, gridStep: 6};
    for (var d in c) this._options[d] = c[d];
    this._prepareData(a, b);
    this._initialPlacement();
    this._mainLoop();
    this._finish()
};
SMap.Marker.Repositioner.prototype._prepareData = function (a, b) {
    this._todo = [];
    this._data = a;
    var c = this._options.gridStep, d;
    for (d in this._data) {
        var e = this._data[d], f = b[d].marker.getSize() || this._options.itemSize;
        this._sizes[d] = [Math.floor(f[0] / c), Math.floor(f[1] / c)];
        e.x = Math.round(e.x / c);
        e.y = Math.round(e.y / c);
        this._todo.push(d)
    }
};
SMap.Marker.Repositioner.prototype._addItem = function (a) {
    var b = 0, c = this._grid, d = this._data[a];
    a = this._sizes[a];
    for (var e = 0; e < a[0]; e++) for (var f = 0; f < a[1]; f++) {
        var g = d.x + e + "," + (d.y + f);
        g in c ? b += c[g] : c[g] = 0;
        c[g]++
    }
    return b
};
SMap.Marker.Repositioner.prototype._removeItem = function (a) {
    var b = this._grid, c = this._data[a];
    a = this._sizes[a];
    for (var d = 0; d < a[0]; d++) for (var e = 0; e < a[1]; e++) b[c.x + d + "," + (c.y + e)]--
};
SMap.Marker.Repositioner.prototype._initialPlacement = function (a) {
    var b = this._options.tolerance, c = this._grid;
    this._todo = this._todo.filter(function (a) {
        for (var e = this._data[a], f = this._sizes[a], g = 0, h = 0; h < f[0]; h++) for (var k = 0; k < f[1]; k++) if (e.x + h + "," + (e.y + k) in c && g++, g > b) return !0;
        this._addItem(a);
        return !1
    }, this)
};
SMap.Marker.Repositioner.prototype._advanceItem = function (a, b, c) {
    var d = 0, e = 0, f = 0, g = 0, h = null, k = this._data[a];
    a = this._sizes[a];
    0 == b[1] ? (h = a[1], f = d = k.x, 1 == b[0] ? f += a[0] : (d += a[0] - 1, f--)) : (h = a[0], g = e = k.y, 1 == b[1] ? g += a[1] : (e += a[1] - 1, g--));
    a = this._grid;
    for (var l = 0; l < h; l++) {
        0 == b[1] ? (e = k.y + l, g = k.y + l) : (d = k.x + l, f = k.x + l);
        var m = d + "," + e, n = f + "," + g;
        a[m]--;
        a[m] && c--;
        a[n] && c++;
        n in a || (a[n] = 0);
        a[n]++
    }
    k.x += b[0];
    k.y += b[1];
    return c
};
SMap.Marker.Repositioner.prototype._rotateItem = function (a, b) {
    var c = this._data[a];
    if (b > this._options.limit) return c.x = c.y = null, !0;
    c.y--;
    for (var d = c.x, e = c.y, f = 0, g = b, h = this._addItem(a); h > this._options.tolerance;) {
        var k = this._directions[f];
        g--;
        g || (f++, g = 2 * b);
        h = this._advanceItem(a, k, h);
        if (d == c.x && e == c.y) return this._removeItem(a), !1
    }
    return !0
};
SMap.Marker.Repositioner.prototype._mainLoop = function () {
    for (var a = 0; this._todo.length;) a++, this._todo = this._todo.filter(function (b) {
        return !this._rotateItem(b, a)
    }, this)
};
SMap.Marker.Repositioner.prototype._finish = function () {
    var a = this._options.gridStep, b;
    for (b in this._data) {
        var c = this._data[b];
        null !== c.x && (c.x *= a, c.y *= a)
    }
    this._grid = {};
    this._data = {}
};
SMap.Marker.Cluster = JAK.ClassMaker.makeClass({NAME: "SMap.Marker.Cluster", VERSION: "1.0", EXTEND: SMap.Marker});
SMap.Marker.Cluster.prototype.$constructor = function (a, b) {
    var c = {url: JAK.mel("div", {className: "cluster"}), anchor: {left: 0, top: 0}};
    this.$super(null, a, c);
    this._clusterOptions = {
        color: "#3d66cf", radius: function (a, b, c) {
            return 25 + 10 * (a - b + 1) / (c - b + 1)
        }
    };
    for (var d in b) this._clusterOptions[d] = b[d];
    this._dom.content = JAK.mel("span");
    this._dom.circle = JAK.mel("div", {}, {color: this._clusterOptions.color});
    this._dom.container[SMap.LAYER_MARKER].appendChild(this._dom.circle);
    this._dom.circle.appendChild(this._dom.content);
    this._dom.circle.appendChild(JAK.mel("img", {src: SMap.CONFIG.img + "/marker/cluster.png"}, {backgroundColor: this._clusterOptions.color}));
    this._markers = [];
    this._markerCoords = []
};
SMap.Marker.Cluster.prototype.addMarker = function (a) {
    this._markers.push(a);
    this._markerCoords.push(a.getCoords());
    this._update();
    return this
};
SMap.Marker.Cluster.prototype.getMarkers = function () {
    return this._markers
};
SMap.Marker.Cluster.prototype.click = function (a, b) {
    this.$super(a, b);
    var c = this.getMap(), d = c.computeCenterZoom(this._markerCoords);
    c.setCenterZoom(d[0], d[1])
};
SMap.Marker.Cluster.prototype.setSize = function (a, b) {
    var c = Math.round(this._clusterOptions.radius(this._markers.length, a, b));
    this._dom.circle.style.width = 2 * c + "px";
    this._dom.circle.style.height = 2 * c + "px";
    this._dom.circle.style.left = -c + "px";
    this._dom.circle.style.top = -c + "px";
    this._dom.content.style.lineHeight = 2 * c + "px";
    return this
};
SMap.Marker.Cluster.prototype._update = function () {
    var a = Infinity, b = Infinity, c = -Infinity, d = -Infinity, e = this._markers.length;
    this._dom.content.innerHTML = e;
    this._dom.circle.title = e;
    for (var f = 0; f < e; f++) var g = this._markerCoords[f], a = Math.min(a, g.x), b = Math.min(b, g.y), c = Math.max(c, g.x), d = Math.max(d, g.y);
    this.setCoords(new SMap.Coords((a + c) / 2, (b + d) / 2))
};
SMap.Marker.Clusterer = JAK.ClassMaker.makeClass({NAME: "SMap.Marker.Clusterer", VERSION: "1.0"});
SMap.Marker.Clusterer.prototype.$constructor = function (a, b, c) {
    this._maxDistance = b || 100;
    this._clusterCtor = c || SMap.Marker.Cluster;
    this._markers = [];
    this._clusters = [];
    this._positions = [];
    this._map = a
};
SMap.Marker.Clusterer.prototype.clear = function () {
    this._markers = [];
    this._clusters = [];
    this._positions = []
};
SMap.Marker.Clusterer.prototype.addMarker = function (a) {
    a instanceof Array ? this._markers = this._markers.concat(a) : this._markers.push(a)
};
SMap.Marker.Clusterer.prototype.removeMarker = function (a) {
    if (a instanceof Array) for (var b = 0; b < a.length; b++) this.removeMarker(a[b]); else a = this._markers.indexOf(a), -1 != a && this._markers.splice(a, 1)
};
SMap.Marker.Clusterer.prototype.getAllMarkers = function () {
    return this._markers
};
SMap.Marker.Clusterer.prototype.getMarkers = function () {
    for (var a = [], b = 0; b < this._clusters.length; b++) {
        var c = this._clusters[b];
        1 == c.getMarkers().length && a.push(c.getMarkers()[0])
    }
    return a
};
SMap.Marker.Clusterer.prototype.getClusters = function () {
    for (var a = [], b = 0; b < this._clusters.length; b++) {
        var c = this._clusters[b];
        1 < c.getMarkers().length && a.push(c)
    }
    return a
};
SMap.Marker.Clusterer.prototype.compute = function () {
    this._clusters = [];
    this._positions = [];
    for (var a = 0; a < this._markers.length; a++) this._process(this._markers[a]);
    for (var b = Infinity, c = -Infinity, a = 0; a < this._clusters.length; a++) var d = this._clusters[a].getMarkers().length, b = Math.min(b, d), c = Math.max(c, d);
    for (a = 0; a < this._clusters.length; a++) this._clusters[a].setSize(b, c)
};
SMap.Marker.Clusterer.prototype._process = function (a) {
    for (var b = Infinity, c = a.getCoords().toPixel(this._map), d = -1, e = 0; e < this._positions.length; e++) {
        var f = c.distance(this._positions[e]);
        f < b && (b = f, d = e)
    }
    -1 == d || b > this._maxDistance ? (d = this._clusters.length, b = new this._clusterCtor, this._clusters.push(b)) : b = this._clusters[d];
    b.addMarker(a);
    this._positions[d] = b.getCoords().toPixel(this._map)
};
SMap.Card = JAK.ClassMaker.makeClass({NAME: "SMap.Card", VERSION: "1.0", IMPLEMENT: [SMap.IOwned]});
SMap.Card.prototype.MIN_HEIGHT = 368;
SMap.Card.prototype.$constructor = function (a, b) {
    this._ec = [];
    this._sc = [];
    this._options = {close: !0, anchor: {left: 0, top: 0}};
    for (var c in b) this._options[c] = b[c];
    this._anchor = !1;
    this._owner = null;
    this._size = [null, null];
    this._minHeight = null;
    this._dom = {
        container: null,
        close: null,
        tail: null,
        header: JAK.mel("div", {className: "card-header"}),
        body: JAK.mel("div", {className: "card-body"}),
        footer: JAK.mel("div", {className: "card-footer"})
    };
    this._build();
    this._addEvents();
    this.setSize(a || 312)
};
SMap.Card.prototype.$destructor = function () {
    this._ec.forEach(JAK.Events.removeListener, JAK.Events);
    this._ec = [];
    var a = this.getMap().getSignals();
    this._sc.forEach(function (b) {
        a.removeListener(b)
    });
    this._sc = []
};
SMap.Card.prototype.setOwner = function (a) {
    this._owner = a;
    this.sync()
};
SMap.Card.prototype.getHeader = function () {
    return this._dom.header
};
SMap.Card.prototype.getBody = function () {
    return this._dom.body
};
SMap.Card.prototype.getFooter = function () {
    return this._dom.footer
};
SMap.Card.prototype.setSize = function (a, b) {
    this._size = [a || this._size[0], b || null];
    this._dom.container.style.width = this._size[0] + "px";
    this.sync()
};
SMap.Card.prototype.getContainer = function () {
    return this._dom.container
};
SMap.Card.prototype.getAnchor = function () {
    return this._anchor
};
SMap.Card.prototype.anchorTo = function (a) {
    this._anchor = a;
    a = this._computePosition(a);
    this._dom.container.style.left = Math.round(a.x) + "px";
    this._dom.container.style.bottom = Math.round(-a.y) + "px"
};
SMap.Card.prototype.isVisible = function () {
    var a = this._getOffset(), b = this.getMap().getSize(), c = this._getOuterSize(), d = Math.max(0, a.x),
        e = Math.max(0, a.y), f = Math.min(b.x, a.x + c.x), a = Math.min(b.y, a.y + c.y);
    return f > d && a > e
};
SMap.Card.prototype.makeVisible = function () {
    var a = this.getMap(), b = this._visibilityDistance();
    if (!b.x && !b.y) return !0;
    var c = Math.sqrt(b.x * b.x + b.y + b.y), d = a.getSize(), d = Math.sqrt(d.x * d.x + d.y * d.y);
    c <= 0.5 * d ? a.animate(b) : a.setCenter(b);
    return !1
};
SMap.Card.prototype._visibilityDistance = function () {
    var a = this.getMap(), b = this._getOffset(), c = a.getSize(),
        d = new SMap.Pixel(a.getPadding("left"), a.getPadding("top")),
        e = new SMap.Pixel(c.x - a.getPadding("right"), c.y - a.getPadding("bottom")), f = this._getOuterSize(),
        a = b.x - d.x, d = b.y - d.y, c = e.x - (b.x + f.x), b = e.y - (b.y + f.y), f = e = 0;
    0 > a && (e = -a);
    0 > c && (e = c);
    0 > d && (f = -d);
    0 > b && (f = b);
    return new SMap.Pixel(e, f)
};
SMap.Card.prototype.sync = function () {
    if (this._owner) {
        var a = this.getMap();
        this._dom.body.style.display = "none";
        var b = this._getOuterSize().y;
        this._dom.body.style.display = "";
        if (this._size[1]) a = this._size[1] - b, 0 > a && (a = 0), this._dom.body.style.height = a + "px"; else {
            var c = a.getSize().y, c = c - a.getPadding("top"), c = c - a.getPadding("bottom"),
                c = Math.min(c, this.MIN_HEIGHT);
            this._dom.body.style.height = "";
            a = this._dom.body.scrollHeight;
            b += a;
            b > c && (a -= b - c, 0 > a && (a = 0), this._dom.body.style.height = a + "px")
        }
    }
};
SMap.Card.prototype._getOuterSize = function () {
    var a = this._dom.tail;
    return new SMap.Pixel(this._dom.container.offsetWidth, a.offsetTop + a.offsetHeight)
};
SMap.Card.prototype._computePosition = function (a) {
    var b = this.getMap();
    a = a.toPixel(b).minus(b.getOffset());
    b = this._dom.tail;
    a.x -= b.offsetLeft + Math.floor(b.offsetWidth / 2) - this._options.anchor.left;
    a.y += this._dom.container.offsetHeight - b.offsetTop - b.offsetHeight + 1 + this._options.anchor.top;
    return a
};
SMap.Card.prototype._getOffset = function () {
    for (var a = this._dom.container, b = this.getMap().getContainer(), c = new SMap.Pixel(0, 0); a != b;) c.x += a.offsetLeft, c.y += a.offsetTop, a = a.offsetParent;
    c.x += b.clientLeft || 0;
    c.y += b.clientTop || 0;
    return c
};
SMap.Card.prototype._closeClick = function (a, b) {
    var c = this.getMap();
    c.removeCard();
    c.getSignals().makeEvent("card-close-click", this)
};
SMap.Card.prototype._addEvents = function () {
    this._ec.push(JAK.Events.addListener(this._dom.container, "DOMMouseScroll", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "mousewheel", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "mousedown", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "dblclick", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "contextmenu", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "touchstart", JAK.Events.stopEvent))
};
SMap.Card.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "card"});
    this._dom.container.appendChild(this._dom.header);
    this._dom.container.appendChild(this._dom.body);
    this._dom.container.appendChild(this._dom.footer);
    if (!this._options || this._options.close) this._dom.close = JAK.mel("div", {className: "close"}), this._ec.push(JAK.Events.addListener(this._dom.close, "click", this, "_closeClick")), this._dom.container.appendChild(this._dom.close);
    this._dom.tail = JAK.mel("div", {className: "tail"});
    this._dom.container.appendChild(this._dom.tail)
};
SMap.Control = JAK.ClassMaker.makeClass({NAME: "SMap.Control", VERSION: "1.0", IMPLEMENT: SMap.IOwned});
SMap.Control.prototype.$constructor = function () {
    this._ec = [];
    this._sc = [];
    this._owner = null
};
SMap.Control.prototype.$destructor = function () {
    JAK.Events.removeListeners(this._ec);
    var a = this.getMap();
    a && a.getSignals().removeListeners(this._sc)
};
SMap.Control.prototype.getContainer = function () {
    return !1
};
SMap.Control.prototype.setOwner = function (a) {
    this._owner && this._owner != a && (JAK.Events.removeListeners(this._ec), this.getMap().getSignals().removeListeners(this._sc));
    this._owner = a
};
SMap.Control.Sync = JAK.ClassMaker.makeClass({NAME: "SMap.Control.Sync", VERSION: "1.0", EXTEND: SMap.Control});
SMap.Control.Sync.prototype.$constructor = function (a) {
    this.$super();
    this._options = {bottomSpace: null, resizeTimeout: 100};
    for (var b in a) this._options[b] = a[b];
    this._timeoutDone = this._timeoutDone.bind(this);
    this._timeout = null
};
SMap.Control.Sync.prototype.setOwner = function (a) {
    this.$super(a);
    this._timeout && (clearTimeout(this._timeout), this._timeout = null);
    a && (this._ec.push(JAK.Events.addListener(window, "resize", this, "_resize")), this._sync())
};
SMap.Control.Sync.prototype.setBottomSpace = function (a) {
    this._options.bottomSpace = a
};
SMap.Control.Sync.prototype._sync = function () {
    var a = this.getMap(), b = a.getContainer(), c = a.getSize();
    if (null !== this._options.bottomSpace) {
        var d = JAK.DOM.getBoxPosition(b), d = JAK.DOM.getDocSize().height - d.top - this._options.bottomSpace;
        b.style.height = Math.round(d) + "px"
    }
    if (c.x != b.offsetWidth || c.y != b.offsetHeight) a.syncPort(), a.getSignals().makeEvent("map-resize", this)
};
SMap.Control.Sync.prototype._resize = function (a, b) {
    this._timeout && clearTimeout(this._timeout);
    this._timeout = setTimeout(this._timeoutDone, this._options.resizeTimeout)
};
SMap.Control.Sync.prototype._timeoutDone = function () {
    this._timeout = null;
    this._sync()
};
SMap.Control.Visible = JAK.ClassMaker.makeClass({NAME: "SMap.Control.Visible", VERSION: "1.0", EXTEND: SMap.Control});
SMap.Control.Visible.prototype.$constructor = function () {
    this.$super();
    this._dom = {}
};
SMap.Control.Visible.prototype.getContainer = function () {
    return this._dom.container
};
SMap.Control.Visible.prototype._build = function () {
    this._dom.container = JAK.mel("div")
};
SMap.Control.Image = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Image",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Image.prototype.$constructor = function (a, b) {
    this.$super();
    this._url = a;
    this._href = b;
    this._targetHref = "";
    this._dom.container = JAK.mel("img");
    b && (this._dom.container.style.cursor = "pointer", this._ec.push(JAK.Events.addListener(this._dom.container, "click", this, "_click")))
};
SMap.Control.Image.prototype.setOwner = function (a) {
    this.$super(a);
    a && (a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "map-redraw", "_redraw")), this._redraw())
};
SMap.Control.Image.prototype._redraw = function () {
    this._dom.container.src = this._buildURL()
};
SMap.Control.Image.prototype._buildURL = function () {
    this._href && (this._targetHref = this.getMap().formatString(this._href));
    return this.getMap().formatString(this._url)
};
SMap.Control.Image.prototype._click = function (a, b) {
    window.open(this._targetHref)
};
SMap.Control.MapyLogo = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.MapyLogo",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.MapyLogo.prototype.$constructor = function () {
    this.$super();
    this._linkURL = SMap.CONFIG.mapyczDomain + "/?x={cx}&y={cy}&z={zoom}";
    var a = JAK.mel("a", {className: "print", target: "_blank"}),
        b = JAK.mel("img", {src: SMap.CONFIG.img + "/logo.png"});
    a.appendChild(b);
    this._dom.container = a
};
SMap.Control.MapyLogo.prototype.setOwner = function (a) {
    this.$super(a);
    a && (a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "map-redraw", "_redraw")), this._redraw())
};
SMap.Control.MapyLogo.prototype._redraw = function () {
    this._dom.container.href = this.getMap().formatString(this._linkURL)
};
SMap.Control.Compass = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Compass",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Compass.prototype.$constructor = function (a) {
    this.$super();
    this._options = {panAmount: 1, title: "", moveThreshold: 300};
    for (var b in a) this._options[b] = a[b];
    this._classNames = {};
    this._classNames[SMap.NORTH] = "north";
    this._classNames[SMap.EAST] = "east";
    this._classNames[SMap.SOUTH] = "south";
    this._classNames[SMap.WEST] = "west";
    this._ec2 = [];
    this._moving = !1;
    this._totalMoved = null;
    this._step = this._step.bind(this);
    this._build()
};
SMap.Control.Compass.prototype.setOwner = function (a) {
    this.$super(a);
    a && (this._sc.push(this.getMap().getSignals().addListener(this, "map-redraw", "_redraw")), this._ec.push(JAK.Events.addListener(this._dom.container, "mousedown", this, "_start")), this._redraw())
};
SMap.Control.Compass.prototype._redraw = function () {
    var a = this._classNames[this.getMap().getOrientation()], a = "north";
    "north" == a && "ie" == JAK.Browser.client && 8 == JAK.Browser.version && (a += "-ie8");
    JAK.DOM.removeClass(this._dom.container, "compass-" + a);
    JAK.DOM.addClass(this._dom.container, "compass-" + a)
};
SMap.Control.Compass.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "compass"});
    this._dom.container.title = this._options.title
};
SMap.Control.Compass.prototype._start = function (a, b) {
    this._set(a, b) && (this._totalMoved = new SMap.Pixel(0, 0), this._ec2.push(JAK.Events.addListener(this._dom.container, "mousemove", this, "_set")), this._ec2.push(JAK.Events.addListener(this._dom.container, "mouseout", this, "_end")), this._ec2.push(JAK.Events.addListener(this._dom.container, "mouseup", this, "_end")), this._moving = !0, this.getMap().lock(), this._step(), JAK.Timekeeper.getInstance().addListener(this, "_step", 2))
};
SMap.Control.Compass.prototype._step = function () {
    this._totalMoved.plus(this.step);
    var a = this.getMap().getSize();
    Math.sqrt(a.x * a.x + a.y * a.y);
    this._totalMoved.norm() > this._options.moveThreshold && (this._totalMoved.x = 0, this._totalMoved.y = 0, this.getMap().redraw());
    this.getMap().setCenter(this.step)
};
SMap.Control.Compass.prototype._set = function (a, b) {
    JAK.Events.cancelDef(a);
    var c = this._dom.container, d = JAK.DOM.getBoxPosition(c), e = JAK.DOM.getScrollPos();
    d.left -= e.x;
    d.top -= e.y;
    c = c.offsetWidth / 2;
    e = c - (a.clientX - d.left);
    d = c - (a.clientY - d.top);
    if (e * e + d * d > c * c) return this._moving && this._end(), !1;
    this.step = (new SMap.Pixel(e, d)).scale(this._options.panAmount);
    return !0
};
SMap.Control.Compass.prototype._end = function () {
    JAK.Timekeeper.getInstance().removeListener(this);
    this._moving = !1;
    this._ec2.forEach(JAK.Events.removeListener, JAK.Events);
    this._ec2 = [];
    this.getMap().unlock()
};
SMap.Control.Selection = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Selection",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Selection.prototype.$constructor = function (a) {
    this.$super();
    this._ecTmp = [];
    this._thickness = a || 0;
    this._build();
    this._lock = !1;
    this._size = this._point2 = this._point1 = null
};
SMap.Control.Selection.prototype.setOwner = function (a) {
    this.$super(a);
    a && (a = a.getContainer(), this._ec.push(JAK.Events.addListener(a, "mousedown", this, "_mousedown")), this._ec.push(JAK.Events.addListener(document, "keydown", this, "_keyDown")), this._ec.push(JAK.Events.addListener(document, "keyup", this, "_keyUp")))
};
SMap.Control.Selection.prototype._keyDown = function (a, b) {
    !this._lock && 17 == a.keyCode && this._owner && (this._lock = !0, this.getMap().setCursor("pointer"))
};
SMap.Control.Selection.prototype._keyUp = function (a, b) {
    this._lock && 17 == a.keyCode && this._owner && (this._lock = !1, this.getMap().setCursor(null))
};
SMap.Control.Selection.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "selection"}, {borderWidth: this._thickness + "px"});
    this._hide()
};
SMap.Control.Selection.prototype._hide = function () {
    this._dom.container.style.visibility = "hidden"
};
SMap.Control.Selection.prototype._show = function () {
    this._dom.container.style.visibility = "visible"
};
SMap.Control.Selection.prototype._mousedown = function (a, b) {
    a.button == JAK.Browser.mouse.left && this._isModifyKeyPressed(a) && (this._size = this.getMap().getSize().clone().scale(0.5), this._point2 = this._point1 = SMap.Pixel.fromEvent(a, this.getMap()), this._redraw(), this._ecTmp.push(JAK.Events.addListener(document, "mouseup", this, "_mouseup")), this._ecTmp.push(JAK.Events.addListener(document, "mousemove", this, "_mousemove")), this._ecTmp.push(JAK.Events.addListener(document, "keydown", this, "_keydown")))
};
SMap.Control.Selection.prototype._isModifyKeyPressed = function (a) {
    return "mac" == JAK.Browser.platform ? a.metaKey : a.ctrlKey
};
SMap.Control.Selection.prototype._mouseup = function (a, b) {
    this._stop(!0)
};
SMap.Control.Selection.prototype._mousemove = function (a, b) {
    var c = SMap.Pixel.fromEvent(a, this.getMap());
    if (this._point1 == this._point2) {
        if (3 > this._point1.distance(c)) return;
        this._show()
    }
    this._point2 = c;
    this._redraw()
};
SMap.Control.Selection.prototype._keydown = function (a, b) {
    27 == a.keyCode && this._stop(!1)
};
SMap.Control.Selection.prototype._stop = function (a) {
    this._ecTmp.forEach(JAK.Events.removeListener, JAK.Events);
    this._ecTmp = [];
    this._hide();
    if (a && this._point1 != this._point2) {
        a = [this._point1.toCoords(this.getMap()), this._point2.toCoords(this.getMap())];
        var b = this.getMap().computeCenterZoom(a);
        a = b[0];
        b = b[1];
        this.getMap().setCenterZoom(a, b);
        this.getMap().getSignals().makeEvent("control-selection-centerzoom")
    }
};
SMap.Control.Selection.prototype._redraw = function () {
    var a = Math.abs(this._point1.x - this._point2.x), b = Math.abs(this._point1.y - this._point2.y);
    this._dom.container.style.width = a + "px";
    this._dom.container.style.height = b + "px";
    a = Math.min(this._point1.x, this._point2.x);
    b = Math.min(this._point1.y, this._point2.y);
    a += this._size.x;
    b += this._size.y;
    a -= this._thickness;
    b -= this._thickness;
    this._dom.container.style.left = a + "px";
    this._dom.container.style.top = b + "px"
};
SMap.Control.ZoomNotification = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.ZoomNotification",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.ZoomNotification.prototype.$constructor = function () {
    this.$super();
    this._fixedPoint = this._zoom = null;
    this._size = new SMap.Pixel(0, 0);
    this._build()
};
SMap.Control.ZoomNotification.prototype.setOwner = function (a) {
    this.$super(a);
    a && (a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "zoom-start", "_zoomStart")), this._sc.push(a.addListener(this, "zoom-step", "_zoomStep")), this._sc.push(a.addListener(this, "zoom-stop", "_zoomStop")))
};
SMap.Control.ZoomNotification.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "notification"}, {display: "none"});
    for (var a = ["top", "bottom"], b = ["left", "right"], c = 0; c < a.length; c++) for (var d = 0; d < b.length; d++) {
        var e = JAK.mel("div", {className: a[c] + "-" + b[d]}, {position: "absolute"});
        e.style[a[c]] = "0px";
        e.style[b[d]] = "0px";
        this._dom.container.appendChild(e)
    }
};
SMap.Control.ZoomNotification.prototype._zoomStart = function (a) {
    if (!a.data.touch) {
        var b = this.getMap();
        this._zoom = b.getZoom();
        b = b.getSize();
        this._fixedPoint = a.data.fixedPoint.clone();
        this._fixedPoint.plus(b.clone().scale(0.5));
        this._dom.container.style.display = "";
        this._dom.container.style.width = "";
        a = this._dom.container.offsetWidth;
        b = a * b.y / b.x;
        this._size.x = a;
        this._size.y = b;
        this._updatePositionSize(a, b)
    }
};
SMap.Control.ZoomNotification.prototype._zoomStep = function (a) {
    "" == this._dom.container.style.display && (a = Math.pow(2, a.data.currentZoom - this._zoom), this._updatePositionSize(this._size.x * a, this._size.y * a))
};
SMap.Control.ZoomNotification.prototype._zoomStop = function (a) {
    this._dom.container.style.display = "none"
};
SMap.Control.ZoomNotification.prototype._updatePositionSize = function (a, b) {
    var c = this._dom.container.style;
    c.width = Math.round(a) + "px";
    c.height = Math.round(b) + "px";
    c.left = Math.round(this._fixedPoint.x - a / 2) + "px";
    c.top = Math.round(this._fixedPoint.y - b / 2) + "px"
};
SMap.Control.Keyboard = JAK.ClassMaker.makeClass({NAME: "SMap.Control.Keyboard", VERSION: "1.0", EXTEND: SMap.Control});
SMap.Control.Keyboard.prototype.$constructor = function (a, b) {
    this.$super();
    this._options = {panAmount: 10, focusedOnly: !0};
    for (var c in b) this._options[c] = b[c];
    this._options.panAmount = parseFloat(this._options.panAmount) || 0;
    this._keyMap = {
        37: new SMap.Pixel(this._options.panAmount, 0),
        38: new SMap.Pixel(0, this._options.panAmount),
        39: new SMap.Pixel(-this._options.panAmount, 0),
        40: new SMap.Pixel(0, -this._options.panAmount)
    };
    this._usedKeys = {};
    for (var d in this._keyMap) this._usedKeys[d] = !1;
    this._mapFocused = !1;
    this._mode =
        a;
    this._moving = !1;
    this.step = new SMap.Pixel(0, 0);
    this._step = this._step.bind(this)
};
SMap.Control.Keyboard.prototype.setOwner = function (a) {
    this.$super(a);
    a && (this._ec.push(JAK.Events.addListener(document, "keydown", this, "_down")), this._ec.push(JAK.Events.addListener(document, "keyup", this, "_up")), this._ec.push(JAK.Events.addListener(document, "keypress", this, "_press")), a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "map-focus", "_mapFocus")), this._sc.push(a.addListener(this, "map-blur", "_mapBlur")))
};
SMap.Control.Keyboard.prototype.configure = function (a) {
    this._mode = a
};
SMap.Control.Keyboard.prototype.getMode = function () {
    return this._mode
};
SMap.Control.Keyboard.prototype._step = function () {
    this.getMap().setCenter(this.step)
};
SMap.Control.Keyboard.prototype._press = function (a, b) {
    (!this._options.focusedOnly || this._mapFocused) && this._moving && JAK.Events.cancelDef(a)
};
SMap.Control.Keyboard.prototype._up = function (a, b) {
    if (this._moving) {
        var c = a.keyCode;
        c in this._keyMap && (this.step.minus(this._keyMap[c]), this._usedKeys[c] = !1);
        this.step.x || this.step.y || (JAK.Timekeeper.getInstance().removeListener(this), this._moving = !1, this.getMap().unlock(), this.getMap().getSignals().makeEvent("control-keyboard-move"))
    }
};
SMap.Control.Keyboard.prototype._down = function (a, b) {
    if (!this._options.focusedOnly || this._mapFocused) {
        var c = JAK.Events.getTarget(a).tagName.toLowerCase();
        -1 == ["input", "select", "option", "textarea"].indexOf(c) && (c = a.keyCode, c in this._keyMap && !this._usedKeys[c] && this._mode & SMap.KB_PAN ? (this.step.plus(this._keyMap[c]), this._usedKeys[c] = !0) : 109 == c ? (this._mode & SMap.KB_ZOOM && this.getMap().setZoom("-1", null, !0), this.getMap().getSignals().makeEvent("control-keyboard-zoom")) : 107 == c && (this._mode & SMap.KB_ZOOM &&
        this.getMap().setZoom("+1", null, !0), this.getMap().getSignals().makeEvent("control-keyboard-zoom")), !this.step.x && !this.step.y || this._moving || (JAK.Events.cancelDef(a), this.getMap().lock(), this._moving = !0, this._step(), JAK.Timekeeper.getInstance().addListener(this, "_step")))
    }
};
SMap.Control.Keyboard.prototype._mapFocus = function (a) {
    this._mapFocused = !0
};
SMap.Control.Keyboard.prototype._mapBlur = function (a) {
    this._mapFocused = !1
};
SMap.Control.Mouse = JAK.ClassMaker.makeClass({NAME: "SMap.Control.Mouse", VERSION: "1.0", EXTEND: SMap.Control});
SMap.Control.Mouse.prototype.$constructor = function (a, b) {
    this.$super();
    this._ecMove = [];
    this._ecGesture = [];
    this.options = {
        scrollDelay: 125,
        idleDelay: 400,
        minDriftSpeed: 30,
        maxDriftSpeed: 80,
        driftSlowdown: 0.95,
        driftThreshold: 300
    };
    this._mode = a;
    this._gesture = {scale: 1, coords: null, running: !1};
    this._drift = {speed: 0, direction: 0, moved: 0};
    this._context = {timeout: null, event: null};
    this._doubleTouch = {delay: 300, threshold: 48, lastTimestamp: null, lastEvent: null};
    this._lastEvents = [];
    this._lastTimestamp = null;
    this._moved = this._idleTimeout =
        this._scrollTimeout = !1;
    this._speed = [];
    for (var c in b) this.options[c] = b[c];
    this._scrollUnlock = this._scrollUnlock.bind(this);
    this._idle = this._idle.bind(this);
    this._driftStep = this._driftStep.bind(this);
    this._contextMenu = this._contextMenu.bind(this)
};
SMap.Control.Mouse.prototype.setOwner = function (a) {
    this.$super(a);
    a && this.configure(this._mode)
};
SMap.Control.Mouse.prototype.getMode = function () {
    return this._mode
};
SMap.Control.Mouse.prototype.configure = function (a) {
    JAK.Events.removeListeners(this._ec);
    this._mode = a;
    a = this._owner.getContent();
    this._ec.push(JAK.Events.addListener(a, "touchstart", this, "_touchStart"));
    this._mode & SMap.MOUSE_PAN && this._ec.push(JAK.Events.addListener(a, "mousedown", this, "_mouseDown"));
    this._mode & SMap.MOUSE_WHEEL && this._ec.push(JAK.Events.addListener(a, "mousewheel DOMMouseScroll", this, "_scroll"));
    this._mode & SMap.MOUSE_ZOOM_IN && this._ec.push(JAK.Events.addListener(a, "dblclick", this, "_dblClick"));
    this._mode & SMap.MOUSE_ZOOM_OUT && this._ec.push(JAK.Events.addListener(a, "mouseup", this, "_rightClick"));
    this._mode & SMap.MOUSE_ZOOM && this._ec.push(JAK.Events.addListener(a, "gesturestart", this, "_gestureStart"))
};
SMap.Control.Mouse.prototype._mouseDown = function (a, b) {
    if (a.button == JAK.Browser.mouse.left) {
        var c = JAK.Events.getTarget(a);
        if (!this._isInActive(c) || c.useMap) {
            if (a.ctrlKey || a.metaKey) for (var c = this.getMap().getControls(), d = 0; d < c.length; d++) if (c[d] instanceof SMap.Control.Selection) return;
            this._ecMove.push(JAK.Events.addListener(document, "mousemove", this, "_mouseMove"));
            this._ecMove.push(JAK.Events.addListener(document, "mouseup", this, "_mouseUp"));
            this._commonStart(a.clientX, a.clientY)
        }
    }
};
SMap.Control.Mouse.prototype._touchStart = function (a, b) {
    for (var c = this.getMap(), d = [], e = 0; e < a.touches.length; e++) d.push(SMap.Coords.fromEvent(a.touches[e], c));
    this._gesture.coords = c.computeCenterZoom(d)[0];
    c = JAK.Events.getTarget(a);
    this._isInActive(c) && !c.useMap || 0 < this._ecMove.length || (c = a.touches[0], this._mode & SMap.MOUSE_ZOOM_IN && this._isDoubleTouch(c) && this._dblClick(a), this._doubleTouch.lastEvent = new SMap.Pixel(c.clientX, c.clientY), this._mode & SMap.MOUSE_PAN && (this._commonStart(c.clientX, c.clientY),
        this._ecMove.push(JAK.Events.addListener(document, "touchmove", this, "_touchMove")), this._ecMove.push(JAK.Events.addListener(document, "touchend", this, "_touchEnd"))))
};
SMap.Control.Mouse.prototype._isDoubleTouch = function (a) {
    var b = (new Date).getTime();
    if (!this._doubleTouch.lastTimestamp) return this._doubleTouch.lastTimestamp = b, !1;
    var c = b - this._doubleTouch.lastTimestamp < this._doubleTouch.delay,
        d = Math.abs(this._doubleTouch.lastEvent.x - a.clientX);
    a = Math.abs(this._doubleTouch.lastEvent.y - a.clientY);
    d = Math.sqrt(d * d + a * a) <= this._doubleTouch.threshold;
    this._doubleTouch.lastTimestamp = b;
    return c && d
};
SMap.Control.Mouse.prototype._isInActive = function (a) {
    for (var b = this.getMap().getLayerContainer(SMap.LAYER_ACTIVE); a;) {
        if (a == b) return !0;
        a = a.parentNode
    }
    return !1
};
SMap.Control.Mouse.prototype._commonStart = function (a, b) {
    this._drift.speed && this._stopDrift();
    this._lastEvents = [new SMap.Pixel(a, b)];
    this._lastTimestamp = (new Date).getTime();
    this._moved = !1;
    this._speed = []
};
SMap.Control.Mouse.prototype._mouseMove = function (a, b) {
    this._commonMove(a.clientX, a.clientY)
};
SMap.Control.Mouse.prototype._touchMove = function (a, b) {
    JAK.Events.cancelDef(a);
    var c = a.touches[0];
    this._commonMove(c.clientX, c.clientY)
};
SMap.Control.Mouse.prototype._commonMove = function (a, b) {
    var c = this._lastEvents[this._lastEvents.length - 1];
    if (c.x != a || c.y != b) {
        c = (new Date).getTime();
        this.options.idleDelay && (this._idleTimeout && clearTimeout(this._idleTimeout), this._idleTimeout = setTimeout(this._idle, this.options.idleDelay));
        this._moved || (this._moved = !0, this.getMap().lock());
        var d = this._lastEvents[this._lastEvents.length - 1], e = a - d.x, d = b - d.y;
        this.getMap().setCenter((new SMap.Pixel(e, d)).scale(1 / this._gesture.scale));
        this._lastEvents.push(new SMap.Pixel(a,
            b));
        3 < this._lastEvents.length && this._lastEvents.shift();
        e = Math.sqrt(e * e + d * d) / (c - this._lastTimestamp);
        Infinity == Math.abs(e) || isNaN(e) || this._speed.push(e);
        2 < this._speed.length && this._speed.shift();
        this._lastTimestamp = c
    }
};
SMap.Control.Mouse.prototype._touchEnd = function (a, b) {
    1 < a.touches.length || this._commonEnd()
};
SMap.Control.Mouse.prototype._mouseUp = function (a, b) {
    this._commonEnd()
};
SMap.Control.Mouse.prototype._commonEnd = function () {
    JAK.Events.removeListeners(this._ecMove);
    this._idleTimeout && (clearTimeout(this._idleTimeout), this._idleTimeout = !1);
    this._speed.length && !this._drift.speed && this._startDrift() || this._moved && this._resyncMap()
};
SMap.Control.Mouse.prototype._startDrift = function () {
    var a = 0;
    if (!(2 > this._speed.length)) {
        for (var b = 0; b < this._speed.length; b++) a += this._speed[b];
        a = 20 * a / this._speed.length;
        this._speed = [];
        if (a < this.options.minDriftSpeed) return !1;
        this._drift.speed = Math.min(a, this.options.maxDriftSpeed);
        this._drift.moved = 0;
        a = this._lastEvents.shift();
        b = this._lastEvents.pop();
        this._drift.direction = Math.atan2(b.y - a.y, b.x - a.x);
        JAK.Timekeeper.getInstance().addListener(this, "_driftStep");
        return !0
    }
};
SMap.Control.Mouse.prototype._stopDrift = function () {
    JAK.Timekeeper.getInstance().removeListener(this);
    this._drift.speed = 0;
    this._resyncMap()
};
SMap.Control.Mouse.prototype._driftStep = function () {
    this._drift.speed *= this.options.driftSlowdown;
    var a = Math.round(this._drift.speed * Math.cos(this._drift.direction)),
        b = Math.round(this._drift.speed * Math.sin(this._drift.direction));
    this._drift.moved += Math.sqrt(a * a + b * b);
    this._drift.moved > this.options.driftThreshold && (this._drift.moved -= this.options.driftThreshold, this.getMap().redraw());
    this.getMap().setCenter(new SMap.Pixel(a, b));
    0.2 >= this._drift.speed && this._stopDrift()
};
SMap.Control.Mouse.prototype._resyncMap = function () {
    this.getMap().unlock();
    this.getMap().getSignals().makeEvent("control-mouse-move", this)
};
SMap.Control.Mouse.prototype._idle = function () {
    this._moved = !1;
    this._speed = [];
    this._resyncMap()
};
SMap.Control.Mouse.prototype._dblClick = function (a, b) {
    this._zoom("1", a.clientX, a.clientY)
};
SMap.Control.Mouse.prototype._rightClick = function (a, b) {
    if (a.button == JAK.Browser.mouse.right) if (this._context.timeout) clearTimeout(this._context.timeout), this._context.timeout = null, this._context.event = null, this._mode & SMap.MOUSE_ZOOM_OUT && this._zoom("-1", a.clientX, a.clientY); else {
        for (var c = this.getMap().getLayerContainer(SMap.LAYER_ACTIVE), d = JAK.Events.getTarget(a); d;) {
            if (d == c) return;
            d = d.parentNode
        }
        this._context.event = {};
        for (var e in a) try {
            this._context.event[e] = a[e]
        } catch (f) {
        }
        this._context.timeout =
            setTimeout(this._contextMenu, 300)
    }
};
SMap.Control.Mouse.prototype._gestureStart = function (a, b) {
    if (!this._ecGesture.length) {
        var c = this._owner.getContent();
        this._ecGesture.push(JAK.Events.addListener(c, "gesturechange", this, "_gestureChange"));
        this._ecGesture.push(JAK.Events.addListener(c, "gestureend", this, "_gestureEnd"))
    }
};
SMap.Control.Mouse.prototype._gestureChange = function (a, b) {
    JAK.Events.cancelDef(a);
    if (this._gesture.coords) {
        this._gesture.scale = a.scale;
        var c = this.getMap();
        this._gesture.running || (this._gesture.running = !0, c.zoomAnimationStart(this._gesture.coords.toPixel(c), !0));
        var d = c.getZoom() + Math.log(this._gesture.scale) / Math.LN2;
        c.zoomAnimationStep(d)
    }
};
SMap.Control.Mouse.prototype._gestureEnd = function (a, b) {
    JAK.Events.removeListeners(this._ecGesture);
    var c = this.getMap();
    this._gesture.coords = null;
    this._gesture.running = !1;
    var d = Math.log(this._gesture.scale) / Math.LN2;
    0.3 > Math.abs(d) && (d = 0);
    var e = 0 < d ? Math.ceil(d) : Math.floor(d);
    c.zoomAnimationTarget(c.getZoom() + e, c.getZoom() + d);
    this._gesture.scale = 1
};
SMap.Control.Mouse.prototype._scroll = function (a, b) {
    if (!a.wheelDeltaX || 0 !== a.wheelDeltaY) {
        JAK.Events.cancelDef(a);
        var c = a.wheelDelta || -a.detail;
        c && this._checkScrollFrequency() && this._zoom(0 < c ? "1" : "-1", a.clientX, a.clientY)
    }
};
SMap.Control.Mouse.prototype._checkScrollFrequency = function () {
    if (this.options.scrollDelay) {
        if (this._scrollTimeout) return !1;
        this._scrollTimeout = setTimeout(this._scrollUnlock, this.options.scrollDelay)
    }
    return !0
};
SMap.Control.Mouse.prototype._zoom = function (a, b, c) {
    var d = null;
    null !== b && null != c && (d = SMap.Pixel.fromEvent({clientX: b, clientY: c}, this.getMap()));
    this.getMap().setZoom(a, d, !0);
    this.getMap().getSignals().makeEvent("control-mouse-zoom")
};
SMap.Control.Mouse.prototype._scrollUnlock = function () {
    this._scrollTimeout = !1
};
SMap.Control.Mouse.prototype._contextMenu = function () {
    this._context.timeout = null;
    this.getMap().getSignals().makeEvent("map-contextmenu", this, {event: this._context.event});
    this._context.event = null
};
SMap.Control.Orientation = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Orientation",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Orientation.prototype.$constructor = function (a) {
    this.$super();
    this._options = {title: "Oto\u010dit", mode: "cw"};
    for (var b in a) this._options[b] = a[b];
    this._build()
};
SMap.Control.Orientation.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: this._options.mode, title: this._options.title});
    this._ec.push(JAK.Events.addListener(this._dom.container, "click", this, "_click"))
};
SMap.Control.Orientation.prototype._click = function (a, b) {
    var c = this.getMap().getOrientation(), c = (c + ("cw" == this._options.mode ? 1 : -1)).mod(4);
    this.getMap().setOrientation(c)
};
SMap.Control.Overview = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Overview",
    VERSION: "1.0",
    EXTEND: SMap.Control.Image
});
SMap.Control.Overview.prototype.$constructor = function () {
    this.$super(SMap.CONFIG.protocol + "//mapserver.mapy.cz/nahled2/0_{x}_{y}");
    JAK.DOM.addClass(this._dom.container, "overview-map");
    this._projection = new SMap.Projection.UTM33;
    this._pixel = new SMap.Pixel(0, 0)
};
SMap.Control.Overview.prototype._buildURL = function () {
    var a = this._projection.pixelToCoords(this._pixel, this.getMap().getCenter(), 1, SMap.NORTH).toPP();
    a[0] &= 268173312;
    a[1] &= 268173312;
    return this.getMap().formatString(this._url, {x: a[0].toString(16), y: a[1].toString(16)})
};
SMap.Control.Layer = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Layer",
    VERSION: "2.1",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Layer.prototype.$constructor = function (a) {
    this.$super();
    this._options = {width: 65, items: 3, page: 3};
    for (var b in a) this._options[b] = a[b];
    this._page = 0;
    this._layers = {};
    this._opened = !1;
    this._menuClose = this._menuClose.bind(this);
    this._timer = null;
    this._build()
};
SMap.Control.Layer.prototype.$destructor = function () {
    this._layers = {};
    this.$super()
};
SMap.Control.Layer.prototype.setOwner = function (a) {
    this.$super(a);
    if (a) {
        this._sc.push(this.getMap().getSignals().addListener(this, "layer-enable", "_layerChange"));
        this._sc.push(this.getMap().getSignals().addListener(this, "layer-disable", "_layerChange"));
        for (var b in this._layers) this._checkLayer(b)
    }
};
SMap.Control.Layer.prototype.addLayer = function (a, b, c, d) {
    this._layers[a] = this._buildItem(b, c, d);
    this._checkLayer(a);
    this._setPage(0)
};
SMap.Control.Layer.prototype.addDefaultLayer = function (a) {
    if (a in SMap.CONFIG) {
        var b = SMap.CONFIG[a];
        this.addLayer(a, b.label, SMap.CONFIG.img + "/" + b.preview, b.title)
    } else throw Error("Invalid default layer id " + a);
};
SMap.Control.Layer.prototype.getContent = function () {
    return this._dom.window
};
SMap.Control.Layer.prototype.getActiveId = function () {
    for (var a in this._layers) {
        var b = this.getMap().getLayer(a);
        if (b && b.isActive()) return b.getId()
    }
    return null
};
SMap.Control.Layer.prototype._maxPage = function () {
    var a = 0, b;
    for (b in this._layers) a++;
    return Math.ceil((a - this._options.items) / this._options.page)
};
SMap.Control.Layer.prototype._pageToPixel = function (a) {
    return -a * this._options.page * this._options.width
};
SMap.Control.Layer.prototype._setPage = function (a) {
    var b = new JAK.CSSInterpolator(this._dom.content, 200);
    b.addProperty("left", this._pageToPixel(this._page), this._pageToPixel(a), "px");
    this._page = a;
    b.start();
    this._dom.prev.style.display = this._page ? "" : "none";
    this._dom.next.style.display = this._page != this._maxPage() ? "" : "none"
};
SMap.Control.Layer.prototype._checkLayer = function (a) {
    this._owner && a in this._layers && this.getMap().getLayer(a) && this._syncLayer(a)
};
SMap.Control.Layer.prototype._syncLayer = function (a) {
    var b = this.getMap().getLayer(a), c = this._layers[a];
    b.isActive() ? (JAK.DOM.addClass(c, "active"), SMap.CONFIG[a] && SMap.CONFIG[a].zoom && (a = SMap.CONFIG[a].zoom, this.getMap().setZoomRange(a[0], a[1]))) : JAK.DOM.removeClass(c, "active")
};
SMap.Control.Layer.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "layer-switch"});
    this._ec.push(JAK.Events.addListener(this._dom.container, "mouseover", this, "_mouseOver"));
    var a = JAK.mel("button");
    a.setAttribute("type", "button");
    var b = JAK.mel("span", {innerHTML: "Zm\u011bnit mapu"});
    a.appendChild(b);
    this._dom.container.appendChild(a);
    this._buildWindow()
};
SMap.Control.Layer.prototype._buildWindow = function () {
    this._dom.window = JAK.mel("div", {className: "window"}, {display: "none"});
    this._dom.container.appendChild(this._dom.window);
    var a = JAK.mel("div", {className: "port"}, {
        position: "relative",
        overflow: "hidden",
        width: this._options.width * this._options.items + "px"
    });
    this._dom.window.appendChild(a);
    var b = JAK.mel("div", {}, {position: "relative"});
    a.appendChild(b);
    this._dom.content = b;
    a = JAK.mel("div", {className: "left"});
    this._dom.prev = JAK.mel("div", {className: "arrow"});
    a.appendChild(this._dom.prev);
    this._dom.window.appendChild(a);
    this._ec.push(JAK.Events.addListener(a, "click", this, "_prev"));
    a = JAK.mel("div", {className: "right"});
    this._dom.next = JAK.mel("div", {className: "arrow"});
    a.appendChild(this._dom.next);
    this._dom.window.appendChild(a);
    this._ec.push(JAK.Events.addListener(a, "click", this, "_next"));
    this._ec.push(JAK.Events.addListener(this._dom.window, "mouseout", this, "_mouseOut"));
    this._ec.push(JAK.Events.addListener(this._dom.window, "mouseover", this, "_closeCancel"))
};
SMap.Control.Layer.prototype._buildItem = function (a, b, c) {
    var d = 1, e;
    for (e in this._layers) d++;
    this._dom.content.style.width = d * this._options.width + "px";
    d = JAK.mel("div", {className: "item"}, {width: this._options.width + "px", overflow: "hidden"});
    d.innerHTML = "<div><img src='" + b + "' alt='" + a + "' title='" + (c || a) + "' /><div class='border'></div></div><p>" + a + "</p>";
    this._dom.content.appendChild(d);
    this._ec.push(JAK.Events.addListener(d, "click", this, "_itemClick"));
    return d
};
SMap.Control.Layer.prototype._open = function () {
    if (!this._opened) {
        this._opened = !0;
        this._switchActivePage();
        if ("ie" != JAK.Browser.client) {
            var a = new JAK.CSSInterpolator(this._dom.window, 150, {
                endCallback: function () {
                    this._dom.window.style.filter = ""
                }.bind(this)
            });
            a.addProperty("opacity", 0, 1);
            a.start()
        }
        this._dom.window.style.display = ""
    }
};
SMap.Control.Layer.prototype._switchActivePage = function () {
    for (var a = [], b = this.getMap(), c = this._dom.content.childNodes, d = 0; d < c.length; d++) a.push(c[d]);
    var c = -1, e;
    for (e in this._layers) if (b.getLayer(e).isActive()) {
        c = a.indexOf(this._layers[e]);
        break
    }
    -1 != c && (a = this._page * this._options.page, c >= a && c < a + this._options.items || (a = Math.ceil((c - this._options.items + 1) / this._options.page), a = Math.max(0, a), this._setPage(a)))
};
SMap.Control.Layer.prototype._menuClose = function () {
    if (this._opened) {
        var a = function () {
            this._dom.window.style.display = "none";
            this._opened = !1
        };
        "ie" != JAK.Browser.client ? (a = new JAK.CSSInterpolator(this._dom.window, 150, {endCallback: a.bind(this)}), a.addProperty("opacity", 1, 0), a.start()) : a.call(this)
    }
};
SMap.Control.Layer.prototype._closeCancel = function () {
    this._timer && (window.clearTimeout(this._timer), this._timer = null)
};
SMap.Control.Layer.prototype._layerChange = function (a) {
    a = a.target.getId();
    this._checkLayer(a)
};
SMap.Control.Layer.prototype._itemClick = function (a, b) {
    for (var c in this._layers) {
        var d = this._layers[c], e = this.getMap().getLayer(c);
        e && d != b && this._disable(c)
    }
    for (c in this._layers) d = this._layers[c], (e = this.getMap().getLayer(c)) && d == b && this._enable(c);
    this.getMap().getSignals().makeEvent("control-layer-click", this)
};
SMap.Control.Layer.prototype._mouseOver = function (a, b) {
    this._open()
};
SMap.Control.Layer.prototype._mouseOut = function (a, b) {
    for (var c = a.relatedTarget || a.toElement; c && c != document.documentElement;) {
        if (c == this._dom.container) return;
        c = c.parentNode
    }
    this._timer && window.clearTimeout(this._timer);
    this._timer = window.setTimeout(this._menuClose, 200)
};
SMap.Control.Layer.prototype._enable = function (a) {
    (a = this.getMap().getLayer(a)) && a.enable()
};
SMap.Control.Layer.prototype._disable = function (a) {
    (a = this.getMap().getLayer(a)) && a.disable()
};
SMap.Control.Layer.prototype._prev = function (a, b) {
    this._page && this._setPage(this._page - 1)
};
SMap.Control.Layer.prototype._next = function (a, b) {
    this._page != this._maxPage() && this._setPage(this._page + 1)
};
SMap.Control.Zoom = JAK.ClassMaker.makeClass({NAME: "SMap.Control.Zoom", VERSION: "1.0", EXTEND: SMap.Control.Visible});
SMap.Control.Zoom.prototype.$constructor = function (a, b) {
    this.$super();
    this._zm_ec = [];
    this._zm_sc = [];
    this._labels = a;
    this._zoom = [0, 0];
    this._lastRedrawZoom = 0;
    this._options = {step: 9, titles: [], sliderHeight: 16, showZoomMenu: !0};
    this._drag = {};
    this._ec2 = [];
    this._opened = !1;
    this._menuClose = this._menuClose.bind(this);
    this._timer = null;
    for (var c in b) this._options[c] = b[c];
    this._build()
};
SMap.Control.Zoom.prototype.$destructor = function () {
    this._unbindZoomMenu();
    this.$super()
};
SMap.Control.Zoom.prototype.setZoom = function (a, b) {
    this._zoom = [a, b];
    this._adjustLine()
};
SMap.Control.Zoom.prototype.setOwner = function (a) {
    this._owner && !a && this.removeZoomMenu();
    this.$super(a);
    if (a) {
        a = this.getMap();
        this._sc.push(a.getSignals().addListener(this, "zoom-range-change", "_zoomRangeChange"));
        a = ["plus", "minus"];
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            this._ec.push(JAK.Events.addListener(this._dom[c], "click", this, "_" + c))
        }
        this._options.showZoomMenu && this.addZoomMenu();
        this._zoomRangeChange()
    }
};
SMap.Control.Zoom.prototype.addZoomMenu = function () {
    this.removeZoomMenu();
    this._buildZoomMenu();
    this._bindZoomMenu();
    this._redraw(this._lastRedrawZoom)
};
SMap.Control.Zoom.prototype.removeZoomMenu = function () {
    this._dom.large && (this._dom.large.parentNode.removeChild(this._dom.large), this._dom.large = null);
    this._unbindZoomMenu();
    this._zm_ec = [];
    this._zm_sc = []
};
SMap.Control.Zoom.prototype._bindZoomMenu = function () {
    var a = this.getMap();
    this._zm_sc.push(a.getSignals().addListener(this, "map-redraw", "_mapRedraw"));
    this._zm_sc.push(a.getSignals().addListener(this, "zoom-step", "_zoomStep"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.large, "mouseover", this, "_mouseOver"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.large, "mouseover", this, "_closeCancel"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.large, "mouseout", this, "_mouseOut"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.large,
        "click", this, "_largeClick"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.slider, "mousedown", this, "_sliderDown"));
    this._zm_ec.push(JAK.Events.addListener(this._dom.slider, "click", JAK.Events.stopEvent));
    for (var a = [this._dom.plus, this._dom.minus], b = 0; b < a.length; b++) {
        var c = a[b];
        this._zm_ec.push(JAK.Events.addListener(c, "mouseover", this, "_mouseOver"));
        this._zm_ec.push(JAK.Events.addListener(c, "mouseover", this, "_closeCancel"));
        this._zm_ec.push(JAK.Events.addListener(c, "mouseout", this, "_mouseOut"))
    }
};
SMap.Control.Zoom.prototype._unbindZoomMenu = function () {
    JAK.Events.removeListeners(this._zm_ec);
    var a = this.getMap();
    a && a.getSignals().removeListeners(this._zm_sc)
};
SMap.Control.Zoom.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "zoom"});
    this._buildButtons()
};
SMap.Control.Zoom.prototype._buildZoomMenu = function () {
    this._dom.large = JAK.mel("div", {className: "zoom-menu"}, {display: "none"});
    this._dom.buttonGroup.parentNode.insertBefore(this._dom.large, this._dom.buttonGroup);
    for (var a = ["top", "middle", "bottom"], b = 0; b < a.length; b++) {
        var c = a[b], d = JAK.mel("div", {className: c}, {width: "100%"});
        this._dom[c] = d;
        this._dom.large.appendChild(d)
    }
    this._buildLine();
    this._buildSlider();
    this._buildSliderBg()
};
SMap.Control.Zoom.prototype._buildButtons = function () {
    for (var a = [{name: "minus", title: this._options.titles[1], text: "-"}, {
        name: "plus",
        title: this._options.titles[0],
        text: "+"
    }], b = JAK.mel("div", {className: "button-group"}), c = 0; c < a.length; c++) {
        var d = a[c], e = d.name, f = JAK.mel("button", {className: e});
        f.setAttribute("type", "button");
        f.title = d.title;
        f.innerHTML = d.text;
        b.appendChild(f);
        this._dom[e] = f
    }
    this._dom.buttonGroup = b;
    this._dom.container.appendChild(b)
};
SMap.Control.Zoom.prototype._buildLine = function () {
    this._dom.line = JAK.mel("div", {className: "line"}, {position: "absolute", cursor: "pointer"});
    this._dom.large.appendChild(this._dom.line);
    this._dom.labels = JAK.mel("div");
    this._dom.line.appendChild(this._dom.labels);
    this._adjustLine()
};
SMap.Control.Zoom.prototype._buildSlider = function () {
    var a = Math.floor(0.75 * this._options.sliderHeight), b = Math.floor(a / 2),
        a = {position: "absolute", cursor: "pointer", "border-width": [b, a, b, 0].join("px ")};
    this._dom.slider = JAK.mel("div", {className: "slider"}, a);
    this._dom.line.appendChild(this._dom.slider)
};
SMap.Control.Zoom.prototype._buildSliderBg = function () {
    this._dom.sliderBg = JAK.mel("div", {className: "slider-bg"});
    this._dom.line.appendChild(this._dom.sliderBg)
};
SMap.Control.Zoom.prototype._adjustLine = function () {
    if (this._dom.large) {
        var a = this._zoom, b = a[1] - a[0];
        21 == a[1] && (b += 2);
        var c = this._options.step * b;
        this._dom.middle.style.height = c + "px";
        c = this._options.step * (b + 1);
        this._dom.line.style.height = c + "px";
        b = this._options.step;
        JAK.DOM.clear(this._dom.labels);
        for (var d in this._labels) d = parseInt(d), d >= a[0] && d <= a[1] && (c = JAK.mel("div", {className: "label"}, {
            position: "absolute",
            cursor: "pointer"
        }), c.innerHTML = this._labels[d], 21 == d && (d += 1.5), c.style.top = Math.round((d -
            a[0]) * b - 3) + "px", this._dom.labels.appendChild(c))
    }
};
SMap.Control.Zoom.prototype._plus = function () {
    this._owner && (this.getMap().setZoom("+1", null, !0), this.getMap().getSignals().makeEvent("control-zoom-zoom"))
};
SMap.Control.Zoom.prototype._minus = function () {
    this._owner && (this.getMap().setZoom("-1", null, !0), this.getMap().getSignals().makeEvent("control-zoom-zoom"))
};
SMap.Control.Zoom.prototype._mouseOver = function (a, b) {
    this._open()
};
SMap.Control.Zoom.prototype._open = function () {
    if (!this._opened) {
        this._opened = !0;
        if ("ie" != JAK.Browser.client) {
            var a = new JAK.CSSInterpolator(this._dom.large, 150, {
                endCallback: function () {
                    this._dom.large.style.filter = ""
                }.bind(this)
            });
            a.addProperty("opacity", 0, 1);
            a.start()
        }
        this._dom.large.style.display = ""
    }
};
SMap.Control.Zoom.prototype._mouseOut = function (a, b) {
    if (this._opened) {
        for (var c = a.relatedTarget || a.toElement; c && c != document.documentElement;) {
            if (c == this._dom.container) return;
            c = c.parentNode
        }
        this._timer && clearTimeout(this._timer);
        this._timer = setTimeout(this._menuClose, 200)
    }
};
SMap.Control.Zoom.prototype._menuClose = function () {
    this._timer = null;
    var a = function () {
        this._dom.large.style.display = "none";
        this._opened = !1
    };
    "ie" != JAK.Browser.client ? (a = new JAK.CSSInterpolator(this._dom.large, 150, {endCallback: a.bind(this)}), a.addProperty("opacity", 1, 0), a.start()) : a.call(this)
};
SMap.Control.Zoom.prototype._closeCancel = function () {
    this._timer && (clearTimeout(this._timer), this._timer = null)
};
SMap.Control.Zoom.prototype._sliderDown = function (a, b) {
    JAK.Events.cancelDef(a);
    this._drag.mouseY = a.clientY;
    this._drag.y = this._dom.slider.offsetTop;
    this._drag.min = this._zoomToY(this._zoom[0]);
    this._drag.max = this._zoomToY(this._zoom[1]);
    this._ec2.push(JAK.Events.addListener(document, "mousemove", this, "_sliderMove"));
    this._ec2.push(JAK.Events.addListener(document, "mouseup", this, "_sliderUp"))
};
SMap.Control.Zoom.prototype._sliderMove = function (a, b) {
    var c = a.clientY - this._drag.mouseY;
    this._drag.mouseY = a.clientY;
    this._drag.y += c;
    c = Math.max(this._drag.y, this._drag.min);
    c = Math.min(c, this._drag.max);
    this._dom.slider.style.top = c + "px"
};
SMap.Control.Zoom.prototype._sliderUp = function (a, b) {
    this._ec2.forEach(JAK.Events.removeListener, JAK.Events);
    this._ec2 = [];
    var c = this._yToZoom(this._dom.slider.offsetTop + this._options.sliderHeight / 2);
    this.getMap().setZoom(c);
    this.getMap().getSignals().makeEvent("control-zoom-zoom");
    this._redraw(c)
};
SMap.Control.Zoom.prototype._redraw = function (a) {
    this._lastRedrawZoom = a;
    this._dom.slider && (this._dom.slider.style.top = this._zoomToY(a) + "px", this._dom.slider.title = a)
};
SMap.Control.Zoom.prototype._mapRedraw = function (a) {
    this._redraw(this.getMap().getZoom())
};
SMap.Control.Zoom.prototype._zoomStep = function (a) {
    this._redraw(a.data.currentZoom)
};
SMap.Control.Zoom.prototype._zoomRangeChange = function (a) {
    a = this.getMap().getZoomRange();
    this.setZoom(a[0], a[1]);
    this._redraw(this.getMap().getZoom())
};
SMap.Control.Zoom.prototype._zoomToY = function (a) {
    var b = this._options.step, c = a - this._zoom[0];
    21 == a && (c += 2);
    return Math.round((c + 0.5) * b - this._options.sliderHeight / 2)
};
SMap.Control.Zoom.prototype._yToZoom = function (a) {
    return Math.min(this._zoom[0] + Math.floor(a / this._options.step), this._zoom[1])
};
SMap.Control.Zoom.prototype._largeClick = function (a, b) {
    var c = this._dom.line.offsetTop, d = c + this._dom.line.offsetHeight, e = JAK.DOM.getBoxPosition(b),
        f = JAK.DOM.getScrollPos(), e = a.clientY - e.top + f.y,
        e = e < c ? 0 : e > d ? this._dom.line.offsetHeight : e - c, c = this._yToZoom(e);
    this.getMap().setZoom(c);
    this.getMap().getSignals().makeEvent("control-zoom-zoom")
};
SMap.Control.Zoom.prototype._switchToOblique = function (a, b) {
    4 >= 21 - this.getMap().getZoom() ? this.getMap().setZoom(21, null, !0) : this.getMap().setZoom(21);
    this.getMap().getSignals().makeEvent("control-zoom-zoom")
};
SMap.Control.Copyright = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Copyright",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Copyright.prototype.$constructor = function () {
    this.$super();
    this._date = "";
    this._dpm = 0;
    this._dom.container = JAK.mel("div", {className: "copyright print"});
    this._parts = [];
    this._static = []
};
SMap.Control.Copyright.prototype.setOwner = function (a) {
    this.$super(a);
    a && (this._sc.push(this.getMap().getSignals().addListener(this, "layer-enable", "_enable")), this._sc.push(this.getMap().getSignals().addListener(this, "layer-disable", "_disable")), this._sc.push(this.getMap().getSignals().addListener(this, "map-redraw", "_redraw")), a = JAK.mel("div", {}, {
        position: "absolute",
        width: "100cm"
    }), document.body.appendChild(a), this._dpm = a.offsetWidth, a.parentNode.removeChild(a))
};
SMap.Control.Copyright.prototype.addCopyright = function (a) {
    this._static.push("&copy; " + a);
    this._redraw()
};
SMap.Control.Copyright.prototype.setDate = function (a) {
    this._date = a || "";
    this._redraw()
};
SMap.Control.Copyright.prototype._enable = function (a) {
    this._parts.push(a.target);
    this._redraw()
};
SMap.Control.Copyright.prototype._disable = function (a) {
    a = this._parts.indexOf(a.target);
    -1 != a && (this._parts.splice(a, 1), this._redraw())
};
SMap.Control.Copyright.prototype._redraw = function () {
    var a = this.getMap().getZoom();
    this._computeScale();
    var b = [];
    this._date && b.push(this._date);
    for (var c = 0; c < this._static.length; c++) b.push(this._static[c]);
    for (c = 0; c < this._parts.length; c++) {
        var d = this._parts[c].getCopyright(a);
        if (d) {
            d instanceof Array || (d = [d]);
            for (var e = 0; e < d.length; e++) {
                var f = "&copy; " + d[e];
                -1 == b.indexOf(f) && b.push(f)
            }
        }
    }
    a = b.join(", ");
    this._dom.container.innerHTML = a
};
SMap.Control.Copyright.prototype._computeScale = function () {
    var a = "";
    switch (this.getMap().getZoom()) {
        case 9:
            a = "380 000";
            break;
        case 10:
            a = "190 000";
            break;
        case 11:
            a = "95 000";
            break;
        case 12:
            a = "47 000";
            break;
        case 13:
            a = "24 000";
            break;
        case 14:
            a = "12 000";
            break;
        case 15:
            a = "6 000";
            break;
        case 16:
            a = "3 000"
    }
    a && (a = "1 : " + a);
    var b;
    b = 4.0075016686E7 * Math.cos(this.getMap().getCenter().toWGS84()[1] * Math.PI / 180);
    var c = 256 << this.getMap().getZoom();
    b = "1 : " + (Math.round(b / c * this._dpm) + "").replace(/(\d{1,3}(?=(\d{3})+(?!\d)))/g,
        "$1&nbsp;");
    return a + " / " + b
};
SMap.Control.Minimap = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Minimap",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Minimap.prototype.$constructor = function (a, b, c) {
    this.$super();
    this._options = {diff: -4, opacity: 0.5, layer: SMap.DEF_BASE, color: "gray"};
    a = a || 150;
    b = b || 150;
    this._map = null;
    this._layer = new SMap.Layer.Geometry;
    this._dom.container = JAK.mel("div", {className: "minimap"}, {width: a + "px", height: b + "px"});
    this.setOptions(c)
};
SMap.Control.Minimap.prototype.setOwner = function (a) {
    this.$super(a);
    if (a) {
        a = this.getMap();
        var b = a.getSignals();
        this._sc.push(b.addListener(this, "map-redraw", "_mapRedraw"));
        for (this._map = new SMap(this._dom.container, a.getCenter(), 14); ;) {
            a = this._map.getControls();
            if (!a.length) break;
            this._map.removeControl(a[0])
        }
        this._map.addDefaultLayer(this._options.layer).enable();
        this._map.addLayer(this._layer).enable();
        this._mapRedraw()
    }
};
SMap.Control.Minimap.prototype.setOptions = function (a) {
    if (this._map) {
        var b = this._map.getLayer(this._options.layer);
        b.disable();
        this._map.removeLayer(b);
        b.$destructor()
    }
    for (var c in a) this._options[c] = a[c];
    this._dom.container.borderColor = this._options.color;
    this._map && (this._map.addDefaultLayer(this._options.layer).enable(), this._mapRedraw())
};
SMap.Control.Minimap.prototype._mapRedraw = function () {
    var a = this.getMap(), b = a.getZoom();
    19 == b && (b = 18);
    b += this._options.diff;
    this._map.setCenterZoom(a.getCenter(), b);
    this._layer.removeAll();
    var c = a.getSize(), d = Math.round(c.x / 2), c = Math.round(c.y / 2), b = (new SMap.Pixel(-d, -c)).toCoords(a),
        e = (new SMap.Pixel(d, -c)).toCoords(a), f = (new SMap.Pixel(-d, c)).toCoords(a),
        a = (new SMap.Pixel(d, c)).toCoords(a), c = this._map.getSize(), d = Math.round(c.x / 2),
        c = Math.round(c.y / 2), g = (new SMap.Pixel(-d, -c)).toCoords(this._map),
        h = (new SMap.Pixel(d, -c)).toCoords(this._map), k = (new SMap.Pixel(-d, c)).toCoords(this._map),
        d = (new SMap.Pixel(d, c)).toCoords(this._map),
        d = new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, [b, e, a, f, b, g, k, d, h, g], {
            outlineOpacity: 0,
            color: this._options.color,
            opacity: this._options.opacity
        });
    this._layer.addGeometry(d);
    d = new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, [b, e, a, f], {
        outlineColor: this._options.color,
        outlineOpacity: 0.8,
        color: "transparent"
    });
    this._layer.addGeometry(d)
};
SMap.Control.Rosette = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Rosette",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Rosette.prototype.STATIC_SRC = "//mapserver.mapy.cz/rosette/0_0000000_{s}";
SMap.Control.Rosette.prototype.$constructor = function (a) {
    this.$super();
    this._options = {title: "", mode: "cw"};
    for (var b in a) this._options[b] = a[b];
    this._build()
};
SMap.Control.Rosette.prototype.$destructor = function () {
    this.getMap().getSignals().removeListeners(this._sc);
    this.$super()
};
SMap.Control.Rosette.prototype.setOwner = function (a) {
    this.$super(a);
    a && (a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "map-redraw", "_redraw")), this._sc.push(a.addListener(this, "rotation-step", "_tempRotate")), this._redraw())
};
SMap.Control.Rosette.prototype._build = function () {
    this._dom.container = JAK.mel("div", {className: "control-rosette"});
    this._dom.rosette = JAK.mel("img", {src: SMap.CONFIG.img + "/rosette.png"});
    this._dom.north = JAK.mel("div", {innerHTML: "s"});
    JAK.DOM.append([this._dom.container, this._dom.rosette, this._dom.north])
};
SMap.Control.Rosette.prototype._redraw = function () {
    var a = this.getMap(), b = a.getCenter(), c = a.getSize().x / 2, a = (new SMap.Pixel(c, 0)).toCoords(a),
        b = b.azimuth(a);
    this._rotate(b, !0)
};
SMap.Control.Rosette.prototype._rotate = function (a, b) {
    SMap.TRANSFORM ? (b && (this._angle = a = 90 - a), this._dom.rosette.style[SMap.TRANSFORM] = "rotate(" + a + "deg)") : b && this._changeSrc(90 - a)
};
SMap.Control.Rosette.prototype._tempRotate = function (a) {
    this._rotate(this._angle + a.data.angle)
};
SMap.Control.Rosette.prototype._changeSrc = function (a) {
    0 > a && (a = 360 + a);
    a = Math.round(a).toString(16).lpad("0", 7);
    a = this.STATIC_SRC.replace("{s}", a);
    this._dom.rosette.src = SMap.CONFIG.protocol + a
};
SMap.Control.Scale = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Scale",
    VERSION: "1.0",
    EXTEND: SMap.Control.Visible
});
SMap.Control.Scale.prototype.$constructor = function (a) {
    this.$super();
    this._conf = {min: 1, max: 3, padding: {left: 0, right: "75%"}};
    this._numOfParts = 1;
    this._scaleable = !0;
    this._partsList = [];
    this._numbersList = [];
    if ("number" === typeof a) this._conf.min = a, this._conf.max = a; else if ("object" === typeof a) for (var b in a) this._conf[b] = a[b];
    this._conf.min = Math.max(Math.min(this._conf.min, this._conf.max), 1);
    this._conf.max = Math.max(Math.max(this._conf.min, this._conf.max), 1);
    this._conf.min == this._conf.max && (this._scaleable =
        !1, this._numOfParts = this._conf.min);
    this._limits = {partMin: 50, partMax: 110, totalMax: 200};
    this._units = {1: "m", 1E3: "km"};
    this._steps = [[1.5, 1], [3, 1], [6, 1], [12, 1], [25, 1], [50, 1], [100, 1], [200, 1], [400, 1], [800, 1], [1500, 1E3], [3E3, 1E3], [6E3, 1E3], [12E3, 1E3], [25E3, 1E3], [5E4, 1E3], [1E5, 1E3], [2E5, 1E3], [4E5, 1E3], [8E5, 1E3], [15E5, 1E3], [3E6, 1E3], [6E6, 1E3], [1E7, 1E3]];
    this._dom.container = JAK.mel("div", {className: "scale print"});
    this._dom.unit = null
};
SMap.Control.Scale.prototype.setOwner = function (a) {
    this.$super(a);
    a && (this._sc.push(this.getMap().getSignals().addListener(this, "map-redraw", "_redraw")), this._scaleable && this._sc.push(this.getMap().getSignals().addListener(this, "port-sync", "_portSync")), this._setCount(), this._build(), this._redraw())
};
SMap.Control.Scale.prototype._build = function () {
    for (var a = JAK.mel("span", {className: "unit"}), b = [], c = [], d = 0; d < this._numOfParts + 2; d++) c.push(JAK.mel("span")), d && b.push(JAK.mel("span", {className: d % 2 ? "odd" : "even"}));
    d = JAK.mel("div", {className: "numbers"});
    c.forEach(d.appendChild, d);
    var e = JAK.mel("div", {className: "parts"});
    b.forEach(e.appendChild, e);
    var f = document.createDocumentFragment();
    f.appendChild(d);
    f.appendChild(e);
    f.appendChild(a);
    JAK.DOM.clear(this._dom.container);
    this._dom.container.appendChild(f);
    this._partsList = b;
    this._numbersList = c;
    this._dom.unit = a
};
SMap.Control.Scale.prototype._redraw = function () {
    var a = this._getScaleInfo();
    if (a) {
        this._dom.unit.innerHTML = this._units[a.unit];
        for (var b = 0, c = 0, d = 0; d <= this._numOfParts; d++) {
            var e = this._numbersList[d];
            e.style.display = "";
            e.style.left = Math.round(1 + b) + "px";
            e.innerHTML = c / a.unit;
            d < this._numOfParts ? (e = this._partsList[d], e.style.display = "", e.style.width = Math.round(a.width) + "px") : this._dom.unit.style.left = Math.round(b) + "px";
            b += a.width;
            c += a.step
        }
        for (d = this._numOfParts + 1; d < this._numbersList.length; d++) this._numbersList[d].style.display =
            "none", this._partsList[d - 1].style.display = "none";
        this._dom.container.style.display = ""
    } else this._dom.container.style.display = "none"
};
SMap.Control.Scale.prototype._getScaleInfo = function () {
    var a = this.getMap(), b = a.getZoom(), a = a.getCenter().toWGS84()[1],
        b = 156543.034 / Math.pow(2, b) * Math.cos(a * Math.PI / 180), a = this._limits, c = null;
    unit = null;
    for (var d = stepId = 0; d < this._steps.length; d++) {
        var e = this._steps[d], c = e[0] / b;
        if (c > a.partMin && c < a.partMax) return {width: c, step: e[0], unit: e[1]}
    }
    return null
};
SMap.Control.Scale.prototype._portSync = function (a) {
    this._setCount(a.data.x)
};
SMap.Control.Scale.prototype._setCount = function (a) {
    if (this._scaleable) {
        var b = this._getScaleInfo();
        if (b) {
            a = a || this.getMap().getSize().x;
            var c = this._getPadding(a);
            a = a - c.left - c.right;
            c = Math.ceil(b.width);
            for (b = this._conf.max; b >= this._conf.min; b--) if (b * c <= a) {
                a = b != this._numOfParts;
                this._numOfParts = b;
                a && (this._build(), this._redraw());
                break
            }
        }
    }
};
SMap.Control.Scale.prototype._getPadding = function (a) {
    var b = {left: 0, right: 0}, c = this._conf.padding;
    "number" === typeof c.left ? b.left = c.left : "string" === typeof c.left && -1 != c.left.indexOf("%") && (b.left = Math.round(a * parseFloat(c.left.replace("%", "")) / 100));
    "number" === typeof c.right ? b.right = c.right : "string" === typeof c.right && -1 != c.right.indexOf("%") && (b.right = Math.round(a * parseFloat(c.right.replace("%", "")) / 100));
    return b
};
SMap.Control.Pointer = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.Pointer",
    VERSION: "1.0",
    IMPLEMENT: [JAK.ISignals],
    EXTEND: SMap.Control.Visible
});
SMap.Control.Pointer.TYPES = {
    BLUE: {
        dimensions: {width: 88, height: 88, padding: 5, backWidth: 27, backHeight: 44},
        backUrl: "/pointer/blue-back.svg"
    },
    RED: {
        dimensions: {width: 88, height: 88, padding: 5, backWidth: 27, backHeight: 44},
        backUrl: "/pointer/red-back.svg"
    }
};
SMap.Control.Pointer.prototype.$constructor = function (a) {
    this.$super();
    this._options = {
        type: SMap.Control.Pointer.TYPES.BLUE,
        testAreaInc: 7,
        angleCorrection: 90,
        snapHUDtoScreen: 0,
        showDistance: !1
    };
    for (var b in a) this._options[b] = a[b];
    this._alwaysShow = this._oldBrowser = !1;
    "createElementNS" in document || (this._oldBrowser = !0);
    this._dom = this._create();
    this._dom.container = this._dom.container;
    this._center = null;
    this._hide()
};
SMap.Control.Pointer.prototype._onClick = function () {
    this.makeEvent("pointer-click", this)
};
SMap.Control.Pointer.prototype._show = function () {
    this._dom.container.classList.add("show")
};
SMap.Control.Pointer.prototype._hide = function () {
    this._dom.container.classList.remove("show")
};
SMap.Control.Pointer.prototype._create = function () {
    if (this._oldBrowser) return {
        container: document.createElement("div"),
        cover: document.createElement("div"),
        caption: null
    };
    var a = this._options.type.dimensions, b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    b.setAttributeNS("http://www.w3.org/2000/svg", "xlink", "http://www.w3.org/1999/xlink");
    b.setAttributeNS(null, "width", a.width);
    b.setAttributeNS(null, "height", a.height);
    b.setAttribute("class", "pointer-svg");
    var c = document.createElementNS("http://www.w3.org/2000/svg",
        "g");
    c.addEventListener("click", this._onClick.bind(this));
    b.appendChild(c);
    var d = this._options.type.backUrl;
    if ("string" === typeof d) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", "image");
        e.setAttributeNS("http://www.w3.org/1999/xlink", "href", SMap.CONFIG.img + d);
        e.setAttributeNS(null, "width", a.backWidth);
        e.setAttributeNS(null, "height", a.backHeight);
        e.setAttributeNS(null, "x", "0");
        e.setAttributeNS(null, "y", "0");
        e.setAttribute("class", "pointer-back");
        c.appendChild(e)
    }
    a = document.createElement("div");
    a.classList.add("pointer-cover");
    d = null;
    this._options.showDistance && (d = document.createElement("p"), d.innerHTML = "", d.classList.add("caption"), a.appendChild(d));
    a.appendChild(b);
    return {container: a, cover: b, back: c, caption: d}
};
SMap.Control.Pointer.prototype.setCoords = function (a, b) {
    this._oldBrowser || (this._hide(), this._center = a, this._alwaysShow = b, a && this.redraw())
};
SMap.Control.Pointer.prototype.redraw = function () {
    var a = this.getMap();
    if (a && this._center) {
        var b = a.getSize(), c = this._center.toPixel(a), d = {x: Math.round(b.x / 2), y: Math.round(b.y / 2)},
            e = {x: d.x + c.x, y: d.y + c.y},
            c = Math.round(Math.atan2(c.y, c.x) / Math.PI * 180) + this._options.angleCorrection,
            f = this._options.showDistance, g;
        e.x >= -this._options.testAreaInc && e.x <= b.x + this._options.testAreaInc && e.y >= -this._options.testAreaInc && e.y <= b.y + this._options.testAreaInc || (g = this._countPosition(b, d, e, c));
        !g && this._alwaysShow &&
        (g = e, f = !1);
        g ? (this._setPosition(g, c), f && (a = (new SMap.Pixel(g.x - d.x, g.y - d.y)).toCoords(a), a = Math.round(a.distanceMiro(this._center)), this._setCaption(g, c, a)), this._show()) : this._hide()
    }
};
SMap.Control.Pointer.prototype._countPosition = function (a, b, c) {
    var d = !1, e, f, g = {x1: b.x, y1: b.y, x2: c.x, y2: c.y};
    a = this._getLines(a, b);
    var h = Infinity;
    a.forEach(function (a) {
        if (a = this._lineIntersection(g, a)) {
            var c = Math.round(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)));
            c < h && (e = a.x, f = a.y, d = !0, h = c)
        }
    }, this);
    return d ? {x: e, y: f} : null
};
SMap.Control.Pointer.prototype._setPosition = function (a, b) {
    var c = this._options.type.dimensions, d = Math.floor(c.width / 2), e = Math.floor(c.height / 2),
        f = {x: a.x - d, y: a.y - e};
    this._setPadding(f, b);
    this._dom.cover.style.left = Math.round(f.x) + "px";
    this._dom.cover.style.top = Math.round(f.y) + "px";
    c = c.backWidth / 2;
    d = ("translate({0}, {1}) rotate(" + b + " {2} 0)").replace("{0}", d - c).replace("{1}", e).replace("{2}", c);
    this._dom.back.setAttribute("transform", d)
};
SMap.Control.Pointer.prototype._setCaption = function (a, b, c) {
    var d = this._options.type.dimensions, e = "", e = 1E3 < c ? (c / 1E3).toFixed(1) + " km" : c + " m";
    c = Math.round(d.backHeight - d.backWidth / 2) + d.padding;
    c = this._movePointByAngle(0, c, b);
    this._dom.caption.style.left = Math.round(a.x + c.x) + "px";
    this._dom.caption.style.top = Math.round(a.y + c.y) + "px";
    this._dom.caption.innerHTML = e.replace(".", ",");
    this._dom.caption.classList.remove("left");
    this._dom.caption.classList.remove("right");
    0 <= b && 180 >= b ? this._dom.caption.classList.add("left") :
        this._dom.caption.classList.add("right")
};
SMap.Control.Pointer.prototype._movePointByAngle = function (a, b, c) {
    c = c / 180 * Math.PI;
    return {x: a * Math.cos(c) - b * Math.sin(c), y: a * Math.sin(c) + b * Math.cos(c)}
};
SMap.Control.Pointer.prototype._setPadding = function (a, b) {
    var c = this._movePointByAngle(0, this._options.type.dimensions.padding || 0, b);
    a.x += c.x;
    a.y += c.y;
    return c
};
SMap.Control.Pointer.prototype._getLines = function (a, b) {
    var c = this.getMap(), d = c.getContainer().offsetLeft, e = c.getContainer().offsetTop, f = a.x - d, g = a.y - e,
        h = [{x1: 0, y1: 0, x2: f, y2: 0}, {x1: f, y1: 0, x2: f, y2: g}, {x1: f, y1: g, x2: 0, y2: g}, {
            x1: 0,
            y1: g,
            x2: 0,
            y2: 0
        }];
    c.getControls().forEach(function (a) {
        if (a = a.getContainer()) {
            var c;
            c = "getComputedStyle" in window ? getComputedStyle(a) : a.style;
            display = c.display;
            visibility = c.visibility;
            if ("none" != display && "hidden" != visibility && "svg" != a.tagName.toLowerCase()) {
                c = a.offsetHeight;
                if (a.offsetWidth &&
                    !c) for (var d = a.children.length, e = 0; e < d; e++) c = Math.max(c, a.children[e].offsetHeight);
                d = [0, 0, 0, 0];
                a.offsetLeft < b.x ? (d[0] = a.offsetLeft, d[2] = d[0] + a.offsetWidth) : a.offsetLeft >= b.x && (d[0] = f - (f - a.offsetLeft - a.offsetWidth) - a.offsetWidth, d[2] = d[0] + a.offsetWidth);
                a.offsetTop < b.y ? (d[1] = a.offsetTop, d[3] = d[1] + c) : a.offsetTop >= b.y && (d[1] = g - (g - a.offsetTop - a.offsetHeight) - c, d[3] = d[1] + c);
                if (a = this._options.snapHUDtoScreen) d[0] <= a && (d[0] = 0), f - d[2] <= a && (d[2] = f), d[1] <= a && (d[1] = 0), g - d[3] <= a && (d[3] = g);
                h.push({
                    x1: d[0], y1: d[1],
                    x2: d[2], y2: d[1]
                });
                h.push({x1: d[2], y1: d[1], x2: d[2], y2: d[3]});
                h.push({x1: d[2], y1: d[3], x2: d[0], y2: d[3]});
                h.push({x1: d[0], y1: d[3], x2: d[0], y2: d[1]})
            }
        }
    }, this);
    return h
};
SMap.Control.Pointer.prototype._lineIntersection = function (a, b) {
    var c = this._det2(a.x1 - a.x2, a.y1 - a.y2, b.x1 - b.x2, b.y1 - b.y2);
    if (1E-6 > Math.abs(c)) return null;
    var d = this._det2(a.x1, a.y1, a.x2, a.y2), e = this._det2(b.x1, b.y1, b.x2, b.y2),
        f = this._det2(d, a.x1 - a.x2, e, b.x1 - b.x2) / c, c = this._det2(d, a.y1 - a.y2, e, b.y1 - b.y2) / c;
    return f < Math.min(a.x1, a.x2) - 1E-6 || f > Math.max(a.x1, a.x2) + 1E-6 || c < Math.min(a.y1, a.y2) - 1E-6 || c > Math.max(a.y1, a.y2) + 1E-6 || f < Math.min(b.x1, b.x2) - 1E-6 || f > Math.max(b.x1, b.x2) + 1E-6 || c < Math.min(b.y1, b.y2) -
    1E-6 || c > Math.max(b.y1, b.y2) + 1E-6 ? null : {x: Math.round(f), y: Math.round(c)}
};
SMap.Control.Pointer.prototype._det2 = function (a, b, c, d) {
    return a * d - c * b
};
SMap.Control.Pointer.prototype.setOwner = function (a) {
    this.$super(a);
    a && (this._center && this.redraw(), a = this.getMap().getSignals(), this._sc.push(a.addListener(this, "map-pan", "redraw")), this._sc.push(a.addListener(this, "port-sync", "redraw")), this._sc.push(a.addListener(this, "zoom-step", "redraw")), this._sc.push(a.addListener(this, "zoom-stop", "redraw")))
};
SMap.Control.ContextMenu = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.ContextMenu",
    VERSION: "1.0",
    EXTEND: SMap.Control
});
SMap.Control.ContextMenu.prototype.$constructor = function () {
    this.$super();
    this._isOpen = !1;
    this._items = [];
    this._signals = {};
    this._dom = {};
    this._build()
};
SMap.Control.ContextMenu.prototype.$destructor = function () {
    this._isOpen && this.close();
    this.$super()
};
SMap.Control.ContextMenu.prototype.setOwner = function (a) {
    this.$super(a);
    this._ec.push(JAK.Events.addListener(document, "mousedown", this, "_mousedown"));
    this._ec.push(JAK.Events.addListener(this._dom.container, "mousedown", JAK.Events.stopEvent));
    this._ec.push(JAK.Events.addListener(this._dom.container, "contextmenu", JAK.Events.cancelDef));
    this._ec.push(JAK.Events.addListener(window, "resize", this, "_syncBlank"));
    this._ec.push(JAK.Events.addListener(window, "scroll", this, "_syncBlank"))
};
SMap.Control.ContextMenu.prototype.open = function (a, b) {
    var c = this.getMap(), c = b || SMap.Coords.fromEvent(a, c), d = new SMap.Pixel(a.clientX, a.clientY);
    this._positionMenu(d);
    for (d = 0; d < this._items.length; d++) this._items[d].setCoords(c, this);
    this._isOpen || (this._closeSignal = this.getMap().getSignals().addListener(this, "map-redraw", "close"), this._isOpen = !0, this._syncBlank())
};
SMap.Control.ContextMenu.prototype.close = function () {
    this._isOpen && (this._dom.blank.parentNode.removeChild(this._dom.blank), this._dom.container.parentNode.removeChild(this._dom.container), this.getMap().getSignals().removeListener(this._closeSignal), this._closeSignal = null, this._isOpen = !1)
};
SMap.Control.ContextMenu.prototype.addItem = function (a, b) {
    var c = this._items.indexOf(a);
    if (0 <= c) throw Error("Can't add existing item");
    var c = 1 < arguments.length ? b : this._items.length, d = a.getContainer(),
        e = c >= this._items.length ? null : this._items[c].getContainer();
    this._dom.container.insertBefore(d, e);
    this._items.splice(c, 0, a)
};
SMap.Control.ContextMenu.prototype.removeItem = function (a) {
    var b = this._items.indexOf(a);
    if (-1 == b) throw Error("Can't remove non-existent item");
    this._items.splice(b, 1);
    a = a.getContainer();
    a.parentNode.removeChild(a)
};
SMap.Control.ContextMenu.prototype.getItems = function () {
    return this._items
};
SMap.Control.ContextMenu.prototype.clearItems = function () {
    JAK.DOM.clear(this._dom.container);
    this._items = []
};
SMap.Control.ContextMenu.prototype.addSignal = function (a, b) {
    if (a in this._signals) throw Error("Signal '" + a + "' already handled");
    this._signals[a] = b;
    var c = this.getMap().getSignals();
    this._sc.push(c.addListener(this, a, "_signal"))
};
SMap.Control.ContextMenu.prototype._positionMenu = function (a) {
    document.body.appendChild(this._dom.blank);
    var b = "Top", c = "Left";
    this._dom.container.style.visibility = "hidden";
    document.body.appendChild(this._dom.container);
    var d = JAK.DOM.getScrollPos();
    a.x += d.x;
    a.y += d.y;
    d = JAK.DOM.getDocSize();
    a.x > d.width / 2 && (a.x -= this._dom.container.offsetWidth, c = "Right");
    a.y > d.height / 2 && (a.y -= this._dom.container.offsetHeight, b = "Bottom");
    this._dom.container.style.left = a.x + "px";
    this._dom.container.style.top = a.y + "px";
    d = JAK.DOM.shiftBox(this._dom.container);
    a.x += d[0];
    a.y += d[1];
    this._dom.container.style.left = a.x + "px";
    this._dom.container.style.top = a.y + "px";
    var e = ["Top", "Bottom"];
    ["Left", "Right"].forEach(function (a) {
        e.forEach(function (d) {
            this._dom.container.style["border" + d + a + "Radius"] = a == c && d == b ? "0" : ""
        }, this)
    }, this);
    this._dom.container.style.visibility = ""
};
SMap.Control.ContextMenu.prototype._mousedown = function (a, b) {
    this._isOpen && this.close()
};
SMap.Control.ContextMenu.prototype._mapContextMenu = function (a) {
    this.open(a.data.event)
};
SMap.Control.ContextMenu.prototype._build = function () {
    this._dom.blank = JAK.mel("div", {}, {position: "absolute"});
    this._dom.container = JAK.mel("div", {className: "context-menu"});
    this._ec.push(JAK.Events.addListener(this._dom.container, "click", this, "_click"))
};
SMap.Control.ContextMenu.prototype._click = function (a, b) {
    JAK.Events.cancelDef(a);
    for (var c = [], d = 0; d < this._items.length; d++) c.push(this._items[d].getContainer());
    for (d = JAK.Events.getTarget(a); d != this._dom.container;) {
        var e = c.indexOf(d);
        if (-1 != e) {
            this._items[e].click(a, this);
            break
        }
        d = d.parentNode
    }
};
SMap.Control.ContextMenu.prototype._signal = function (a) {
    if (a.type in this._signals) this._signals[a.type](this, a)
};
SMap.Control.ContextMenu.prototype._syncBlank = function () {
    if (this._isOpen) {
        var a = JAK.DOM.getScrollPos();
        this._dom.blank.style.left = a.x + "px";
        this._dom.blank.style.top = a.y + "px";
        a = JAK.DOM.getDocSize();
        this._dom.blank.style.width = a.width + "px";
        this._dom.blank.style.height = a.height + "px"
    }
};
SMap.Control.ContextMenu.Item = JAK.ClassMaker.makeClass({NAME: "SMap.Control.ContextMenu.Item", VERSION: "1.0"});
SMap.Control.ContextMenu.Item.prototype.$constructor = function (a) {
    this._label = a;
    this._disabled = !1;
    this._coords = null;
    this._ec = [];
    this._dom = {};
    this._build()
};
SMap.Control.ContextMenu.Item.prototype.$destructor = function () {
    for (; this._ec.length;) JAK.Events.removeListener(this._ec.shift())
};
SMap.Control.ContextMenu.Item.prototype.click = function (a, b) {
};
SMap.Control.ContextMenu.Item.prototype.enable = function () {
    JAK.DOM.removeClass(this._dom.container, "disabled");
    this._disabled = !1
};
SMap.Control.ContextMenu.Item.prototype.disable = function () {
    JAK.DOM.addClass(this._dom.container, "disabled");
    this._disabled = !0
};
SMap.Control.ContextMenu.Item.prototype.setCoords = function (a) {
    this._coords = a
};
SMap.Control.ContextMenu.Item.prototype.getContainer = function () {
    return this._dom.container
};
SMap.Control.ContextMenu.Item.prototype._build = function () {
    var a = JAK.mel("a", {href: "#", className: "item"});
    a.innerHTML = this._label;
    this._dom.container = a
};
SMap.Control.ContextMenu.Zoom = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.ContextMenu.Zoom",
    VERSION: "1.0",
    EXTEND: SMap.Control.ContextMenu.Item
});
SMap.Control.ContextMenu.Zoom.prototype.$constructor = function (a, b) {
    this.$super(a);
    this._zoomDiff = b
};
SMap.Control.ContextMenu.Zoom.prototype.setCoords = function (a, b) {
    this.$super(a);
    var c = b.getMap().getZoom(), d = b.getMap().getZoomRange(), c = c + this._zoomDiff;
    c >= d[0] && c <= d[1] ? this.enable() : this.disable()
};
SMap.Control.ContextMenu.Zoom.prototype.click = function (a, b) {
    this._disabled || (b.getMap().setZoom(1 == this._zoomDiff ? "+1" : "-1", this._coords, !0), b.close())
};
SMap.Control.ContextMenu.Coords = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.ContextMenu.Coords",
    VERSION: "1.0",
    EXTEND: SMap.Control.ContextMenu.Item
});
SMap.Control.ContextMenu.Coords.prototype.$constructor = function () {
    this.$super("")
};
SMap.Control.ContextMenu.Coords.prototype._build = function () {
    var a = JAK.mel("span", {className: "item"});
    this._dom.container = a
};
SMap.Control.ContextMenu.Coords.prototype.setCoords = function (a, b) {
    this.$super(a);
    this._dom.container.innerHTML = a.toWGS84(2).reverse().join(", ")
};
SMap.Control.ContextMenu.Separator = JAK.ClassMaker.makeClass({
    NAME: "SMap.Control.ContextMenu.Separator",
    VERSION: "1.0",
    EXTEND: SMap.Control.ContextMenu.Item
});
SMap.Control.ContextMenu.Separator.prototype.$constructor = function () {
    this.$super("")
};
SMap.Control.ContextMenu.Separator.prototype._build = function () {
    var a = JAK.mel("span", {className: "item separator"});
    this._dom.container = a
};
(function () {
    var a = {
        UNIVERSALBIG: {name: "universalbig", size: [48, 66], anchor: {left: 24, top: 66}, icon: !1, img: !1},
        BIG: {name: "big", size: [48, 66], anchor: {left: 24, top: 66}, icon: !0, img: !0},
        MIDDLE: {name: "middle", size: [40, 55], anchor: {left: 20, top: 55}, icon: !0, img: !0},
        UNIVERSAL: {name: "universal", size: [32, 44], anchor: {left: 16, top: 44}, icon: !1, img: !1},
        SMALL: {name: "small", size: [32, 44], anchor: {left: 16, top: 44}, icon: !0, img: !1},
        LITTLE: {name: "little", size: [14, 19], anchor: {left: 7, top: 19}, icon: !1, img: !1},
        POI: {
            name: "poi", size: [20,
                20], anchor: {left: 10, top: 10}, icon: !0, img: !1
        },
        PAID: {name: "paid", size: [42, 50], anchor: {left: 21, top: 50}, icon: !0, img: !1}
    }, b = function (b, d, e) {
        this._conf = {type: a.UNIVERSAL, icon: "", img: "", elm: null, size: null, anchor: null};
        Object.assign(this._conf, e);
        this._poi = null;
        this._active = !0;
        this._isMouseEnter = !1;
        this._lastSignal = "";
        this._sc = [];
        this._userId = d;
        this._cardOpts = {
            cb: null,
            showTimeout: 500,
            hideTimeout: 250,
            rqTimeout: 0,
            anchor: {left: 0, top: 0},
            hidden: !1
        };
        this._card = {
            obj: null, hideID: null, showID: null, reqID: null, promiseStart: 0,
            fill: !1
        };
        this.$constructor(b, d)
    };
    b.prototype = Object.create(SMap.Marker.prototype);
    b.prototype.$destructor = function () {
        this._clearTO("show");
        this._clearTO("hide");
        this._clearTO("req");
        SMap.Marker.prototype.$destructor.call(this)
    };
    b.prototype.setPOI = function (a) {
        this._poi = a
    };
    b.prototype.getPOI = function () {
        return this._poi
    };
    b.prototype.getSource = function () {
        return this._poi.source
    };
    b.prototype.getPlainId = function () {
        return this._poi.id
    };
    b.prototype.getType = function () {
        return this._conf.type
    };
    b.prototype.getConf =
        function () {
            return this._conf
        };
    b.prototype.setActive = function (a) {
        this._active = !!a;
        this._dom.active.classList[this._active ? "remove" : "add"]("non-active")
    };
    b.prototype.getActiveFlag = function () {
        return this._active
    };
    b.prototype.setPopupCallback = function (a) {
        this._cardOpts.cb = a
    };
    b.prototype.setCardOptions = function (a) {
        for (var b in a) this._cardOpts[b] = a[b]
    };
    b.prototype.moveCard = function () {
        this._dom.active.classList.contains("active") && this._card && this._card.obj && this.getMap().addCard(this._card.obj, this._getCardCoords(),
            !0)
    };
    b.prototype.click = function (a) {
        a.target && a.target.closest("a") && SMap.Util.linkToNewWindow(a) || (a.preventDefault(), this._makeSignal("marker-click"))
    };
    b.prototype.handleEvent = function (a) {
        switch (a.type) {
            case "mouseenter":
                if (this._dom.active.contains(a.target)) {
                    this._isMouseEnter = !0;
                    if (!this._cardOpts.cb && !this._card.obj || this._card.obj && this._cardOpts.hidden) {
                        this._makeSignal("marker-enter");
                        this._poi && this._makeSignal("marker-poi-enter");
                        break
                    }
                    this._card.obj || this._createCard();
                    this._updateCard();
                    this._clearTO("hide");
                    this._card.promiseStart || this.showCard()
                } else this._dom.card.contains(a.target) && this._clearTO("hide");
                break;
            case "mouseleave":
                if (this._dom.active.contains(a.target)) if (this._clearTO("req"), this._card.obj) {
                    if ((a = a.relatedTarget || a.toElement) && this._dom.card.contains(a)) break;
                    this._popupLeave()
                } else this._makeSignal("marker-leave"), this._poi && this._makeSignal("marker-poi-leave"); else this._dom.card.contains(a.target) && this._popupLeave()
        }
    };
    b.prototype.setPopupCb = function (a) {
        this._cardOpts.cb =
            a
    };
    b.prototype.getCard = function () {
        return this._dom.card
    };
    b.prototype.showCard = function (a) {
        var b = this;
        a = "number" === typeof a ? a : this._cardOpts.showTimeout;
        this._card.obj || (this._createCard(), this._updateCard());
        this._makeSignal("marker-enter");
        this._poi && this._makeSignal("marker-poi-enter");
        this._clearTO("show");
        this._card.showID = setTimeout(function () {
            b._owner && (b._dom.active.classList.add("active"), b.getMap().addCard(b._card.obj, b._getCardCoords(), !0))
        }, a)
    };
    b.prototype.removeCard = function () {
        this._owner &&
        (this._clearTO("show"), this._clearTO("hide"), this._clearTO("req"), this._dom.active.classList.remove("active"), this._card.obj && this.getMap() && this.getMap().getCard() == this._card.obj && this.getMap().removeCard())
    };
    b.prototype._createCard = function () {
        this._card.obj = new SMap.Card(null, {close: !1, anchor: this._cardOpts.anchor});
        var a = this._card.obj.getContainer();
        a.classList.add("marker-popup");
        a.addEventListener("mouseenter", this, !1);
        a.addEventListener("mouseleave", this, !1);
        this._sc.push(this.getMap().getSignals().addListener(this,
            "zoom-start", "_zoomStart"));
        this._dom.card = a
    };
    b.prototype._updateCard = function () {
        var a = this;
        this._cardOpts.cb && !this._card.fill && (this._clearTO("req"), this._card.reqID = setTimeout(function () {
            var b = a._cardOpts.cb.apply(a, [a._card.obj]);
            b instanceof Promise ? (a._card.promiseStart = Date.now(), b.then(function () {
                if (a._isMouseEnter) {
                    var b = Date.now() - a._card.promiseStart;
                    a.showCard(b < a._cardOpts.showTimeout ? a._cardOpts.showTimeout - b : 0)
                }
                a._card.fill = !0;
                a._card.promiseStart = 0
            })) : a._card.fill = !0;
            a._card.reqID =
                null
        }, this._cardOpts.rqTimeout))
    };
    b.prototype._build = function () {
        var b = this, d = this._conf.type;
        this._options.size = this._conf.size || this._conf.type.size;
        this._options.anchor = this._conf.anchor || this._conf.type.anchor;
        var e = document.createElement("a");
        e.className = "marker type-" + d.name;
        this._userId && (e.id = this._userId);
        if ("poi" == d.name) e.style.width = this._options.size[0] + "px", e.style.height = this._options.size[1] + "px"; else {
            var f = document.createElement("span");
            f.className = "marker-bg-wrapper";
            if (d == a.PAID) f.innerHTML =
                '<img src="' + SMap.CONFIG.img + "/marker/" + d.name + '.png" alt="" />'; else {
                var g = SMap.CONFIG.img + "/wmmarker/" + d.name;
                f.innerHTML = '<img src="' + g + '.png" srcset="' + g + ".png 1x, " + g + "@2x.png 2x, " + g + '@3x.png 3x" />';
                var h = document.createElement("span");
                h.className = "before";
                h.innerHTML = '<img src="' + g + '.png" srcset="' + g + ".png 1x, " + g + "@2x.png 2x, " + g + '@3x.png 3x" />';
                e.appendChild(h)
            }
            e.appendChild(f)
        }
        if (this._conf.elm) e.appendChild(this._conf.elm); else {
            var k = d.img && this._conf.img, l = d.icon && this._conf.icon;
            (k ||
                l) && function () {
                var d = document.createElement("img");
                d.className = "img-cont " + (k ? "image" : "icon") + (b._conf.favicon ? " favicon" : "");
                d.onload = function () {
                    d.classList.add("loaded")
                };
                d.src = k || l;
                d.alt = "";
                b._conf.srcset && (d.srcset = b._conf.srcset, d.style.width = (b._conf.size || a.POI.size)[0] + "px", d.style.height = (b._conf.size || a.POI.size)[1] + "px");
                d.complete && d.classList.add("loaded");
                e.appendChild(d)
            }()
        }
        this._dom.container[SMap.LAYER_MARKER] = e;
        this._dom.active = e;
        e.addEventListener("mouseenter", this, !1);
        e.addEventListener("mouseleave",
            this, !1)
    };
    b.prototype._clearTO = function (a) {
        a += "ID";
        this._card[a] && (clearTimeout(this._card[a]), this._card[a] = null)
    };
    b.prototype._popupLeave = function () {
        var a = this;
        this._isMouseEnter = !1;
        this._makeSignal("marker-leave");
        this._poi && this._makeSignal("marker-poi-leave");
        this._clearTO("show");
        this._clearTO("hide");
        this._card.hideID = setTimeout(function () {
            a.getMap() && (a.getMap().getSignals().removeListeners(a._sc), a._sc = []);
            a.removeCard()
        }, this._cardOpts.hideTimeout)
    };
    b.prototype._makeSignal = function () {
        var a =
            0 >= arguments.length || void 0 === arguments[0] ? "" : arguments[0];
        if (this._owner && this._lastSignal != a) {
            var b = this.getMap();
            b && b.getSignals().makeEvent(a, this);
            this._lastSignal = a
        }
    };
    b.prototype._zoomStart = function () {
        this._card.obj && this.removeCard()
    };
    b.prototype._getCardCoords = function () {
        var b = this.getMap(), d = this.getCoords().toPixel(b), e = this.getMap().getOffset(), f = 0;
        switch (this._conf.type) {
            case a.UNIVERSALBIG:
            case a.BIG:
                f = -43;
                break;
            case a.MIDDLE:
                f = -36;
                break;
            case a.UNIVERSAL:
            case a.SMALL:
                f = -28;
                break;
            case a.LITTLE:
                f =
                    -13;
                break;
            case a.POI:
                f = 10 - this._options.size[1] / 2;
                break;
            case a.PAID:
                f = -26
        }
        var g = parseFloat((this._dom.active.style.left || "0").replace("px", "")) + this._options.anchor.left,
            h = parseFloat((this._dom.active.style.top || "0").replace("px", "")) + this._options.anchor.top;
        return d.plus(new SMap.Pixel(g - (d.x + -1 * e.x), h - (d.y + -1 * e.y) + f)).toCoords(b)
    };
    SMap.WMMarker = b;
    SMap.WMMarker.TYPES = a;
    SMap.WMMarker.getFilterMultimarker = function () {
        var b = {};
        Object.keys(a).forEach(function (d) {
            d = a[d];
            -1 == ["poi", "paid", "universal",
                "universalbig"].indexOf(d.name) && (b[d.name] = {width: d.size[0], height: d.size[1]})
        });
        return b
    };
    SMap.WMMarker.fromPOI = function (c, d, e) {
        var f = SMap.Coords.fromWGS84(c.mark.lon, c.mark.lat), g = "universal";
        c.markerId && (g = c.markerId);
        g = {type: a[g.toUpperCase()]};
        c.url && (g.icon = c.url, c.url2x && c.size && (g.srcset = c.url + " 1x, " + c.url2x + " 2x"));
        d = new b(f, d, Object.assign(g, e));
        d.setPOI(c);
        return d
    }
})();
SMap.Layer.GPX = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.GPX", VERSION: "1.0", EXTEND: SMap.Layer.Multi});
SMap.Layer.GPX.parseCoords = function (a) {
    var b = a.getAttribute("lat");
    a = a.getAttribute("lon");
    "0" === b && "0" === a ? b = null : (b = parseFloat(b), a = parseFloat(a), b = SMap.Coords.fromWGS84(a, b));
    return b
};
SMap.Layer.GPX.prototype.$constructor = function (a, b, c) {
    this.$super(b);
    this._options = {
        maxPoints: 100,
        colors: "#004c8c #ff4911 #ffd625 #5ea221 #840026 #89cdff #374705 #b3d200 #522476 #ff9b11 #c9000e #008ad4".split(" ")
    };
    for (var d in c) this._options[d] = c[d];
    this._routes = [];
    this._tracks = [];
    this._waypoints = [];
    this._bounds = null;
    this._largestCount = 0;
    this._parse(a)
};
SMap.Layer.GPX.prototype.fit = function () {
    var a = [];
    if (this._bounds) a = this._bounds; else {
        for (var b = 0; b < this._waypoints.length; b++) a.push(this._waypoints[b].getCoords());
        for (b = 0; b < this._routes.length; b++) a = a.concat(this._routes[b].getCoords());
        for (b = 0; b < this._tracks.length; b++) a = a.concat(this._tracks[b].getCoords())
    }
    a = this.getMap().computeCenterZoom(a);
    this.getMap().setCenterZoom(a[0], a[1])
};
SMap.Layer.GPX.prototype.filter = function (a, b) {
    var c = this._options.maxPoints;
    b.adaptive && (c = Math.round(c * a.length / this._largestCount));
    if (0 == c || c >= a.length) return a;
    for (var d = [], e = (a.length - 1) / (c - 1), f = 0, g = 0; g < c; g++) d.push(a[Math.round(f)]), f += e;
    return d
};
SMap.Layer.GPX.prototype.createMarker = function (a) {
    return new SMap.Marker.GPX(a, this._options.url)
};
SMap.Layer.GPX.prototype._parse = function (a) {
    this._computeLargestCount(a);
    for (var b = a.getElementsByTagName("wpt"), b = this.filter(b, {adaptive: !1}), c = 0; c < b.length; c++) {
        var d = this.createMarker(b[c]);
        null != d.getCoords() && this._waypoints.push(d)
    }
    for (var b = 0, d = this._options.colors, e = a.getElementsByTagName("rte"), c = 0; c < e.length; c++) {
        var f = new SMap.Geometry.GPXRoute(this, e[c], d[b % d.length]);
        this._routes.push(f);
        b++
    }
    e = a.getElementsByTagName("trk");
    for (c = 0; c < e.length; c++) f = new SMap.Geometry.GPXTrack(this, e[c],
        d[b % d.length]), this._tracks.push(f), b++;
    this._buildLayers();
    d = a.getElementsByTagName("bounds");
    d.length && (d = d[0], c = parseFloat(d.getAttribute("minlat")), b = parseFloat(d.getAttribute("minlon")), a = parseFloat(d.getAttribute("maxlat")), d = parseFloat(d.getAttribute("maxlon")), c = SMap.Coords.fromWGS84(b, c), a = SMap.Coords.fromWGS84(d, a), this._bounds = [c, a])
};
SMap.Layer.GPX.prototype._computeLargestCount = function (a) {
    var b = 0, c = a.getElementsByTagName("rte");
    a = a.getElementsByTagName("trkseg");
    for (var d = 0; d < c.length; d++) b = Math.max(b, c[d].getElementsByTagName("rtept").length);
    for (d = 0; d < a.length; d++) b = Math.max(b, a[d].getElementsByTagName("trkpt").length);
    this._largestCount = b
};
SMap.Layer.GPX.prototype._buildLayers = function () {
    if (this._waypoints.length) {
        var a = new SMap.Layer.Marker;
        this.addLayer(a);
        for (var b = 0; b < this._waypoints.length; b++) a.addMarker(this._waypoints[b])
    }
    if (this._routes.length + this._tracks.length) {
        a = new SMap.Layer.Geometry;
        this.addLayer(a);
        for (b = 0; b < this._routes.length; b++) a.addGeometry(this._routes[b]);
        for (b = 0; b < this._tracks.length; b++) a.addGeometry(this._tracks[b])
    }
};
SMap.Marker.GPX = JAK.ClassMaker.makeClass({NAME: "SMap.Marker.GPX", EXTEND: SMap.Marker, VERSION: "2.0"});
SMap.Marker.GPX.prototype.$constructor = function (a, b) {
    var c = a.getElementsByTagName("name"), c = c.length ? JAK.XML.textContent(c[0]) : "",
        d = a.getElementsByTagName("desc"), d = d.length ? JAK.XML.textContent(d[0]) : "", e = {};
    c && (e.title = c);
    b && (e.url = b);
    var f = SMap.Layer.GPX.parseCoords(a);
    this.$super(f, null, e);
    if (c || d) e = new SMap.Card, e.getHeader().innerHTML = c, e.getBody().innerHTML = d, this.decorate(SMap.Marker.Feature.Card, e)
};
SMap.Geometry.GPXRoute = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry.GPXRoute",
    EXTEND: SMap.Geometry,
    VERSION: "2.0"
});
SMap.Geometry.GPXRoute.prototype.$constructor = function (a, b, c) {
    c = {width: 4, color: c, opacity: 0.7};
    var d = [], e = b.getElementsByTagName("rtept"), e = a.filter(e, {adaptive: !0});
    for (a = 0; a < e.length; a++) {
        var f = SMap.Layer.GPX.parseCoords(e[a]);
        null != f && d.push(f)
    }
    b = b.getElementsByTagName("name");
    b.length && (c.title = JAK.XML.textContent(b[0]));
    this.$super(SMap.GEOMETRY_POLYLINE, null, d, c)
};
SMap.Geometry.GPXTrack = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry.GPXTrack",
    EXTEND: SMap.Geometry,
    VERSION: "2.0"
});
SMap.Geometry.GPXTrack.prototype.$constructor = function (a, b, c) {
    c = {width: 4, color: c, opacity: 0.7};
    for (var d = [], e = b.getElementsByTagName("trkseg"), f = 0; f < e.length; f++) {
        for (var g = [], h = e[f].getElementsByTagName("trkpt"), h = a.filter(h, {adaptive: !0}), k = 0; k < h.length; k++) {
            var l = SMap.Layer.GPX.parseCoords(h[k]);
            null != l && g.push(l)
        }
        d = d.concat(g)
    }
    a = b.getElementsByTagName("name");
    a.length && (c.title = JAK.XML.textContent(a[0]));
    this.$super(SMap.GEOMETRY_POLYLINE, null, d, c)
};
SMap.Layer.KML = JAK.ClassMaker.makeClass({NAME: "SMap.Layer.KML", VERSION: "1.0", EXTEND: SMap.Layer.Multi});
SMap.Layer.KML.prototype.$constructor = function (a, b, c) {
    this.$super(b);
    this._xmlDoc = a;
    this._ids = {};
    this._options = {maxPoints: 100, url: ""};
    for (var d in c) this._options[d] = c[d];
    a = a.getElementsByTagName("*");
    for (c = 0; c < a.length; c++) d = a[c], (b = d.getAttribute("id")) && (this._ids[b] = d);
    this._markers = [];
    this._geometries = [];
    this._parse()
};
SMap.Layer.KML.prototype._parse = function () {
    for (var a = this._xmlDoc.getElementsByTagName("Placemark"), b = 0; b < a.length; b++) {
        for (var c = a[b], d = c.getElementsByTagName("Point"), e = 0; e < d.length; e++) {
            var f = new SMap.Marker.KML(this, d[e], c);
            this._markers.push(f)
        }
        f = c.getElementsByTagName("LineString");
        for (e = 0; e < f.length; e++) d = new SMap.Geometry.KMLLine(this, f[e], c), this._geometries.push(d);
        d = c.getElementsByTagName("Polygon");
        for (e = 0; e < d.length; e++) f = new SMap.Geometry.KMLPolygon(this, d[e], c), this._geometries.push(f);
        f = c.getElementsByTagName("LinearRing");
        for (e = 0; e < f.length; e++) d = f[e], "placemark" == d.parentNode.nodeName.toLowerCase() && (d = new SMap.Geometry.KMLLine(this, d, c), this._geometries.push(d))
    }
    this._buildLayers()
};
SMap.Layer.KML.prototype._buildLayers = function () {
    if (this._markers.length) {
        var a = new SMap.Layer.Marker;
        this.addLayer(a);
        for (var b = 0; b < this._markers.length; b++) a.addMarker(this._markers[b])
    }
    if (this._geometries.length) for (a = new SMap.Layer.Geometry, this.addLayer(a), b = 0; b < this._geometries.length; b++) a.addGeometry(this._geometries[b])
};
SMap.Layer.KML.prototype.filter = function (a) {
    if (0 == this._options.maxPoints || this._options.maxPoints >= a.length) return a;
    for (var b = [], c = (a.length - 1) / (this._options.maxPoints - 1), d = 0, e = 0; e < this._options.maxPoints; e++) b.push(a[Math.round(d)]), d += c;
    return b
};
SMap.Layer.KML.prototype.fit = function () {
    for (var a = [], b = 0; b < this._markers.length; b++) a.push(this._markers[b].getCoords());
    for (b = 0; b < this._geometries.length; b++) a = a.concat(this._geometries[b].getCoords());
    a = this.getMap().computeCenterZoom(a);
    this.getMap().setCenterZoom(a[0], a[1])
};
SMap.Layer.KML.prototype.getStyle = function (a, b) {
    var c = a, d = a.getElementsByTagName("styleUrl");
    d.length && (d = JAK.XML.textContent(d[0]).match(/[^#]+/)[0], (d = this._ids[d]) && (c = d));
    c = c.getElementsByTagName(b);
    return c.length ? c[0] : null
};
SMap.Layer.KML.prototype.getColor = function (a) {
    a = a.match(/..(..)(..)(..)/);
    return "#" + a[3] + a[2] + a[1]
};
SMap.Layer.KML.prototype.getOpacity = function (a) {
    return parseInt(a.substring(0, 2), 16) / 255
};
SMap.Layer.KML.prototype.getURL = function () {
    return this._options.url
};
SMap.Marker.KML = JAK.ClassMaker.makeClass({NAME: "SMap.Marker.KML", EXTEND: SMap.Marker, VERSION: "2.0"});
SMap.Marker.KML.prototype.$constructor = function (a, b, c) {
    var d = b.getElementsByTagName("coordinates")[0], e = JAK.XML.textContent(d).split(",");
    b = parseFloat(e[0]);
    e = parseFloat(e[1]);
    d = SMap.Coords.fromWGS84(b, e);
    b = c.getElementsByTagName("name");
    b = b.length ? JAK.XML.textContent(b[0]) : "";
    var e = c.getElementsByTagName("description"), e = e.length ? JAK.XML.textContent(e[0]) : "", f = {}, g = {};
    if (c = a.getStyle(c, "IconStyle")) {
        var h = c.getElementsByTagName("href");
        if (h.length) {
            f.url = this._buildImageUrl(JAK.XML.textContent(h[0]),
                a);
            var k = c.getElementsByTagName("hotSpot");
            if (k.length) {
                a = {};
                k = k[0];
                c = parseFloat(k.getAttribute("x"));
                var h = parseFloat(k.getAttribute("y")), l = k.getAttribute("xunits"), k = k.getAttribute("yunits");
                "fraction" == l ? g.left = c : a.left = c;
                "fraction" == k ? g.top = h : a.top = h;
                if ("left" in a || "top" in a) f.anchor = a
            } else g.left = 0.5, g.bottom = 0
        }
    }
    b && (f.title = b);
    this.$super(d, null, f);
    ("left" in g || "top" in g) && this.decorate(SMap.Marker.Feature.RelativeAnchor, {anchor: g});
    if (b || e) d = new SMap.Card, d.getHeader().innerHTML = "<strong>" +
        b + "</strong>", d.getBody().innerHTML = e, this.decorate(SMap.Marker.Feature.Card, d)
};
SMap.Marker.KML.prototype._buildImageUrl = function (a, b) {
    if (a.match(/^http/i)) return a;
    var c = b.getURL(), d = c.lastIndexOf("/");
    -1 != d && (c = c.substring(0, d));
    return c + "/" + a
};
SMap.Geometry.KMLLine = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry.KMLLine",
    EXTEND: SMap.Geometry,
    VERSION: "2.0"
});
SMap.Geometry.KMLLine.prototype.$constructor = function (a, b, c) {
    var d = [], e = {};
    b = b.getElementsByTagName("coordinates")[0];
    b = JAK.XML.textContent(b);
    for (var f = b.split(/\s+/), f = a.filter(f), g = 0; g < f.length; g++) if (b = f[g]) {
        b = b.split(",");
        var h = parseFloat(b[0]);
        b = parseFloat(b[1]);
        b = SMap.Coords.fromWGS84(h, b);
        d.push(b)
    }
    if (f = a.getStyle(c, "LineStyle")) b = f.getElementsByTagName("color"), b.length && (b = JAK.XML.textContent(b[0]), e.color = a.getColor(b), e.opacity = a.getOpacity(b)), a = f.getElementsByTagName("width"), a.length &&
    (e.width = parseFloat(JAK.XML.textContent(a[0])));
    a = c.getElementsByTagName("name");
    if (a = a.length ? JAK.XML.textContent(a[0]) : "") e.title = a;
    this.$super(SMap.GEOMETRY_POLYLINE, null, d, e);
    c = c.getElementsByTagName("description");
    c = c.length ? JAK.XML.textContent(c[0]) : "";
    if (a || c) b = new SMap.Card, b.getHeader().innerHTML = "<strong>" + a + "</strong>", b.getBody().innerHTML = c, this.decorate(SMap.Geometry.Feature.Card, b)
};
SMap.Geometry.KMLPolygon = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geometry.KMLPolygon",
    EXTEND: SMap.Geometry,
    VERSION: "2.0"
});
SMap.Geometry.KMLPolygon.prototype.$constructor = function (a, b, c) {
    var d = [], e = {};
    b = b.getElementsByTagName("outerBoundaryIs")[0].getElementsByTagName("coordinates")[0];
    b = JAK.XML.textContent(b);
    for (var f = b.split(/\s+/), f = a.filter(f), g = 0; g < f.length; g++) if (b = f[g]) {
        b = b.split(",");
        var h = parseFloat(b[0]);
        b = parseFloat(b[1]);
        b = SMap.Coords.fromWGS84(h, b);
        d.push(b)
    }
    if (f = a.getStyle(c, "PolyStyle")) b = f.getElementsByTagName("color"), b.length && (b = JAK.XML.textContent(b[0]), e.color = a.getColor(b), e.opacity = a.getOpacity(b)),
        b = f.getElementsByTagName("fill"), b.length && "0" == JAK.XML.textContent(b[0]) && (e.color = "none"), b = f.getElementsByTagName("outline"), b.length && "0" == JAK.XML.textContent(b[0]) && (e.outlineColor = "none"), b = f.getElementsByTagName("width"), b.length && (e.width = parseFloat(JAK.XML.textContent(b)));
    if (f = a.getStyle(c, "LineStyle")) b = f.getElementsByTagName("color"), b.length && (b = JAK.XML.textContent(b[0]), e.outlineColor = a.getColor(b), e.outlineOpacity = a.getOpacity(b)), b = f.getElementsByTagName("width"), b.length && (e.outlineWidth =
        parseFloat(JAK.XML.textContent(b[0])));
    a = c.getElementsByTagName("name");
    if (a = a.length ? JAK.XML.textContent(a[0]) : "") e.title = a;
    this.$super(SMap.GEOMETRY_POLYGON, null, d, e);
    c = c.getElementsByTagName("description");
    c = c.length ? JAK.XML.textContent(c[0]) : "";
    if (a || c) b = new SMap.Card, b.getHeader().innerHTML = "<strong>" + a + "</strong>", b.getBody().innerHTML = c, this.decorate(SMap.Geometry.Feature.Card, b)
};
SMap.Geocoder = JAK.ClassMaker.makeClass({NAME: "SMap.Geocoder", VERSION: "2.0", IMPLEMENT: JAK.ISignals});
SMap.Geocoder.METHOD = "geocode";
SMap.Geocoder.prototype.$constructor = function (a, b, c, d) {
    this._request = null;
    this._query = a;
    this._callback = b;
    this._errorCallback = d;
    this._results = [];
    this._options = {url: "/geocode", count: null};
    for (var e in c) this._options[e] = c[e];
    this._sendRequest()
};
SMap.Geocoder.prototype.$destructor = function () {
    this.abort()
};
SMap.Geocoder.prototype.abort = function () {
    this._request && (this._request.abort(), this.makeEvent("geocode-response"))
};
SMap.Geocoder.prototype.getResults = function () {
    return this._results
};
SMap.Geocoder.prototype._sendRequest = function () {
    this.makeEvent("geocode-request");
    this._request = new JAK.Request(JAK.Request.XML);
    this._request.setCallback(this, "_response");
    var a = this._buildData(), b = SMap.CONFIG[this.constructor.METHOD];
    -1 == b.indexOf("//") || JAK.Request.supportsCrossOrigin() || (b = this._options.url);
    this._request.send(b, a)
};
SMap.Geocoder.prototype._response = function (a) {
    this.makeEvent("geocode-response");
    this._request = null;
    a ? (this._parseResponse(a), this._callback(this)) : this._errorCallback && this._errorCallback(this)
};
SMap.Geocoder.prototype._buildData = function () {
    var a = {query: this._query instanceof Array ? this._query : [this._query]};
    this._options.count && (a.count = this._options.count);
    return a
};
SMap.Geocoder.prototype._parseResponse = function (a) {
    this._results = [];
    a = a.getElementsByTagName("point");
    for (var b = 0; b < a.length; b++) {
        var c = a[b], d = {};
        this._results.push(d);
        d.query = c.getAttribute("query");
        d.results = [];
        for (var c = c.getElementsByTagName("item"), e = 0; e < c.length; e++) {
            var f = c[e], g = SMap.Coords.fromWGS84(f.getAttribute("x"), f.getAttribute("y"));
            d.results.push({
                coords: g,
                label: f.getAttribute("title"),
                source: f.getAttribute("source"),
                id: f.getAttribute("id")
            })
        }
    }
};
SMap.Geocoder.Reverse = JAK.ClassMaker.makeClass({
    NAME: "SMap.Geocoder.Reverse",
    VERSION: "2.0",
    EXTEND: SMap.Geocoder
});
SMap.Geocoder.Reverse.METHOD = "rgeocode";
SMap.Geocoder.Reverse.prototype.$constructor = function (a, b, c) {
    var d = {url: "/rgeocode"}, e;
    for (e in c) d[e] = c[e];
    this.$super(a, b, d);
    this._results = {items: []}
};
SMap.Geocoder.Reverse.prototype._buildData = function () {
    var a = this._query.toWGS84(), a = {lon: a[0].toFixed(6), lat: a[1].toFixed(6)};
    "number" === typeof this._options.dist && (a.dist = this._options.dist);
    "number" === typeof this._options.count && (a.count = this._options.count);
    this._options.type && Array.isArray(this._options.type) && (a.type = this._options.type);
    return a
};
SMap.Geocoder.Reverse.prototype._parseResponse = function (a) {
    this._results = {items: [], label: a.documentElement.getAttribute("label"), coords: this._query};
    a = a.getElementsByTagName("item");
    for (var b = 0; b < a.length; b++) {
        var c = a[b], d = {};
        d.coords = SMap.Coords.fromWGS84(c.getAttribute("x"), c.getAttribute("y"));
        d.name = c.getAttribute("name");
        d.type = c.getAttribute("type");
        d.id = c.getAttribute("id");
        this._results.items.push(d)
    }
};
SMap.Route = JAK.ClassMaker.makeClass({NAME: "SMap.Route", VERSION: "1.0", IMPLEMENT: JAK.ISignals});
SMap.Route.ROUTE_TURIST_TYPES = "CE MO ZE ZL BK FI HN OR CE-M MO-M ZE-M ZL-M NAU OTH".split(" ");
SMap.Route.formatRouteDistance = function (a) {
    var b = "";
    if (!a) return "";
    if (1E3 > a) return Math.round(a) + "&nbsp;m";
    b = 999 < a && 5E4 > a ? (a / 1E3).toFixed(1).toString() : Math.round(a / 1E3).toString();
    a = b.split(".");
    0 == parseFloat(a[1]) && (b = a[0]);
    return b = b.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + "&nbsp;km"
};
SMap.Route.prototype.$constructor = function (a, b, c) {
    this._coords = a;
    this._callback = b;
    this._request = null;
    this._results = {};
    if (2 > a.length) throw Error("At least two coordinates required");
    this._params = {criterion: "fast", autoSend: !0, altitude: !0};
    for (var d in c) this._params[d] = c[d];
    this._request = new JAK.RPC(JAK.RPC.AUTO, {endpoint: SMap.CONFIG.route});
    this._params.autoSend && this.send()
};
SMap.Route.prototype.$destructor = function () {
    this.abort()
};
SMap.Route.prototype.send = function () {
    this.makeEvent("route-request");
    var a = {altitude: this._params.altitude, itinerary: !0};
    this._params.criterion && "bus" == this._params.criterion && 2 == this._coords.length ? (a.api = !0, this._request.setCallback(this, "_responseBus"), this._request.setErrorCallback(this, "_responseBus")) : (this._request.setCallback(this, "_response"), this._request.setErrorCallback(this, "_response"));
    this._request.send("route", [this._buildItemsData(), a])
};
SMap.Route.prototype.abort = function () {
    this._request && (this._request.abort(), this.makeEvent("route-response"))
};
SMap.Route.prototype.getCoords = function () {
    return this._coords
};
SMap.Route.prototype.getCriterion = function () {
    return this._params.criterion
};
SMap.Route.prototype.getResults = function () {
    return this._results
};
SMap.Route.prototype._buildItemsData = function () {
    for (var a = [], b = 0; b < this._coords.length; b++) {
        var c = {
            geometry: SMap.Coords.coordsToString([this._coords[b]]),
            source: "coor",
            id: null,
            tripindex: 0,
            type: 0
        };
        b < this._coords.length - 1 && (c.routeParams = this._buildParams());
        a.push(c)
    }
    return a
};
SMap.Route.prototype._buildParams = function () {
    var a = {};
    a.criterion = this._convertTextParamsToId(this._params.criterion);
    return a
};
SMap.Route.prototype._convertTextParamsToId = function (a) {
    var b = 0;
    switch (a) {
        case "fast":
            b = "free" == this._params.toll ? 112 : 111;
            break;
        case "short":
            b = "free" == this._params.toll ? 113 : 114;
            break;
        case "bike1":
            b = 121;
            break;
        case "bike2":
            b = 122;
            break;
        case "bike3":
            b = 122;
            break;
        case "turist1":
            b = 131;
            break;
        case "turist2":
            b = 132;
            break;
        case "bus":
            b = 191;
            break;
        default:
            b = 111
    }
    return b
};
SMap.Route.prototype._convertIdToTextType = function (a) {
    var b = "";
    -1 < [111, 112, 113, 114].indexOf(a) ? b = "car" : -1 < [121, 122].indexOf(a) ? b = "bike" : -1 < [131, 132].indexOf(a) ? b = "foot" : 200 == a && (b = "bus");
    return b
};
SMap.Route.prototype._response = function (a, b) {
    this.makeEvent("route-response");
    this._request = null;
    this._resultState(a, b);
    a && (this._results = this._parseResponse(a));
    this._callback(this)
};
SMap.Route.prototype._responseBus = function (a, b) {
    this.makeEvent("route-response");
    this._request = null;
    this._resultState(a, b);
    a && (this._results = this._parseResponseBus(a));
    this._callback(this)
};
SMap.Route.prototype._resultState = function (a, b) {
    200 == b && a && "status" in a || (this._results = {error: "HTTP Error", status: 0})
};
SMap.Route.prototype._coordsToString = function (a) {
    return a.toWGS84().join(",")
};
SMap.Route.prototype._parseResponse = function (a) {
    if ("status" in a && "2" != a.status.toString().charAt(0)) return a = {error: !0, status: parseInt(a.status)};
    var b = {
        id: JAK.idGenerator(),
        url: this._buildUrl(a),
        geometry: [],
        altitude: [],
        ascent: 0,
        descent: 0,
        inEurope: !1,
        length: a.totalLength,
        time: a.totalTime,
        points: [],
        routeType: ""
    };
    "altitude" in a && a.altitude && ("altitude" in a.altitude && (b.altitude = a.altitude.altitude), "elevationGain" in a.altitude && (b.ascent = a.altitude.elevationGain), "elevationLoss" in a.altitude && (b.descent =
        a.altitude.elevationLoss));
    if ((a = a.routes) && a.length) {
        for (var c = [], d = [], e = [], f = [0], g = 0; g < a.length; g++) {
            var h = a[g].routes.length ? a[g].routes[0] : null;
            h && "data" in h && (h = h.data, 1 == parseFloat(h.inEurope) && (b.inEurope = !0), b.routeType = this._convertIdToTextType(a[0].routeParams.criterion), "routePoint" in h && h.routePoint.length && (d = d.concat(h.routePoint)), "geometry" in h && (c = c.concat(SMap.Coords.stringToCoords(h.geometry))), "indexWP" in h && 1 < h.indexWP.length && (iwp = f[f.length - 1] + parseFloat(h.indexWP[h.indexWP.length -
            1]), f.push(iwp)), "altitude" in h && (e = e.concat(h.altitude)))
        }
        b.geometry = c;
        e.length && (b.altitude = e);
        b.points = d;
        b.indexWP = 1 < f.length ? f : []
    }
    return b
};
SMap.Route.prototype._parseResponseBus = function (a) {
    return "status" in a && "2" != a.status.toString().charAt(0) ? a = {
        error: !0,
        status: parseInt(a.status)
    } : {
        id: JAK.idGenerator(),
        url: "",
        geometry: a.geometry ? SMap.Coords.stringToCoords(a.geometry) : [],
        altitude: [],
        ascent: 0,
        descent: 0,
        inEurope: null,
        length: a.length || 0,
        time: 0,
        points: [],
        routeType: ""
    }
};
SMap.Route.prototype._buildUrl = function (a) {
    for (var b = new SMap.URL.Route, c = 0; c < a.routes.length; c++) {
        var d = a.routes[c], e = d.routeParams, f = SMap.Coords.stringToCoords(d.geometry)[0], g = {};
        "coor" != d.source && (g.poi = [d.source, d.id]);
        e && (d = e.criterion, "free" == e.toll && (g.carTypeNoToll = !0), "avoidtraffic" in e && (g.bikeAvoidTraffic = e.avoidtraffic ? !0 : !1), 111 == d ? g.type = "car" : 112 == d ? (g.type = "car", g.carTypeShort = !0) : 121 == d ? g.type = "bike" : 122 == d ? (g.type = "bike", g.bikeRoad = !0, g.bikeTrials = !0) : 131 == d ? g.type = "trial" : 132 ==
        d ? (g.type = "trial", g.trialTurist = !0) : 143 == d && (g.type = "water"));
        0 == c ? b.addStart(f, g) : c == a.routes.length - 1 ? b.addDestination(f, g) : b.addWaypoint(f, g)
    }
    return b.toString()
};
SMap.URL = {};
SMap.URL.Route = JAK.ClassMaker.makeClass({NAME: "SMap.URL.Route", VERSION: "1.0"});
SMap.URL.Route.prototype.$constructor = function () {
    this._conf = {points: [[], []], params: [null, null], coords: [null, null]};
    this._url = SMap.CONFIG.mapyUrl.route;
    return this
};
SMap.URL.Route.prototype.$destructor = function () {
    this._conf = {points: [], params: [], coords: []};
    this._url = ""
};
SMap.URL.Route.prototype.addStart = function (a, b) {
    this._conf.points.splice(0, 1);
    this._conf.params.splice(0, 1);
    this._conf.coords.splice(0, 1);
    this._addPoint(a, b, 0);
    return this
};
SMap.URL.Route.prototype.addDestination = function (a, b) {
    this._conf.points.splice(this._conf.points.length - 1, 1);
    this._conf.params.splice(this._conf.params.length - 1, 1);
    this._conf.coords.splice(this._conf.coords.length - 1, 1);
    this._addPoint(a, b, this._conf.points.length);
    return this
};
SMap.URL.Route.prototype.addWaypoint = function (a, b) {
    this._addPoint(a, b, this._conf.points.length - 1);
    return this
};
SMap.URL.Route.prototype.toString = function () {
    var a = this._url;
    this._conf.points.length && (a += this._buildUrlParams());
    return a
};
SMap.URL.Route.prototype._addPoint = function (a, b, c) {
    b && b.poi && 2 == b.poi.length ? this._conf.points.splice(c, 0, {
        source: b.poi[0],
        id: b.poi[1]
    }) : this._conf.points.splice(c, 0, {source: "coor", id: null});
    this._conf.coords.splice(c, 0, a);
    this._conf.params.splice(c, 0, this._getParams(b))
};
SMap.URL.Route.prototype._getParams = function (a) {
    var b = {c: 111};
    if (a && a.type) switch (a.type) {
        case "car":
            a.carTypeShort && (b.c = 114, a.carTypeNoToll && (b.c = 113));
            a.carTypeNoToll && (b.c = 112);
            break;
        case "bike":
            b.c = 121;
            a.bikeRoad && !a.bikeTrials && (b.c = 122);
            break;
        case "trial":
            b.c = 131;
            a.trialTurist && (b.c = 132);
            break;
        case "water":
            b.c = 143;
            break;
        case "ski":
            b.c = 141
    }
    return b
};
SMap.URL.Route.prototype._buildUrlParams = function () {
    for (var a = "&", b = [], c = [], d = [], e = [], f = 0; f < this._conf.points.length; f++) this._conf.coords[f] && b.push(this._conf.coords[f]), c.push(this._conf.points[f].source ? this._conf.points[f].source : ""), d.push(this._conf.points[f].id ? this._conf.points[f].id : ""), e.push(this._conf.params[f] ? JSON.stringify(this._conf.params[f]) : "");
    a += "rc=" + SMap.Coords.coordsToString(b);
    for (f = 0; f < c.length; f++) a += "&rs=" + c[f];
    for (f = 0; f < d.length; f++) a += "&ri=" + d[f];
    for (f = 0; f < e.length; f++) a +=
        "&mrp=" + e[f];
    return a
};
(function (a, b) {
    "function" === typeof define && define.amd ? define(["b"], function (c) {
        return a.returnExportsGlobal = b(c)
    }) : "object" === typeof module && module.exports ? module.exports = b(require("b")) : a.OpenLocationCode = b()
})(this, function () {
    var a = {}, b = [20, 1, 0.05, 0.0025, 1.25E-4];
    a.getAlphabet = function () {
        return "23456789CFGHJMPQRVWX"
    };
    var c = a.isValid = function (a) {
        if (!a || -1 == a.indexOf("+") || a.indexOf("+") != a.lastIndexOf("+") || 1 == a.length || 8 < a.indexOf("+") || 1 == a.indexOf("+") % 2) return !1;
        if (-1 < a.indexOf("0")) {
            if (0 == a.indexOf("0")) return !1;
            var b = a.match(/(0+)/g);
            if (1 < b.length || 1 == b[0].length % 2 || 6 < b[0].length || "+" != a.charAt(a.length - 1)) return !1
        }
        if (1 == a.length - a.indexOf("+") - 1) return !1;
        a = a.replace(/\++/, "").replace(/0+/, "");
        for (var b = 0, c = a.length; b < c; b++) {
            var d = a.charAt(b).toUpperCase();
            if ("+" != d && -1 == "23456789CFGHJMPQRVWX".indexOf(d)) return !1
        }
        return !0
    }, d = a.isShort = function (a) {
        return c(a) ? 0 <= a.indexOf("+") && 8 > a.indexOf("+") ? !0 : !1 : !1
    }, e = a.isFull = function (a) {
        return !c(a) || d(a) || 180 <= 20 * "23456789CFGHJMPQRVWX".indexOf(a.charAt(0).toUpperCase()) ||
        1 < a.length && 360 <= 20 * "23456789CFGHJMPQRVWX".indexOf(a.charAt(1).toUpperCase()) ? !1 : !0
    }, f = a.encode = function (a, c, d) {
        "undefined" == typeof d && (d = 10);
        if (2 > d || 8 > d && 1 == d % 2) throw"IllegalArgumentException: Invalid Open Location Code length";
        a = Math.min(90, Math.max(-90, a));
        c = h(c);
        if (90 == a) {
            var e;
            e = d;
            e = 10 >= e ? Math.pow(20, Math.floor(e / -2 + 2)) : Math.pow(20, -3) / Math.pow(5, e - 10);
            a -= e
        }
        e = Math.min(d, 10);
        for (var f = "", g = a + 90, k = c + 180, l = 0; l < e;) {
            var u = b[Math.floor(l / 2)], t = Math.floor(g / u), g = g - t * u,
                f = f + "23456789CFGHJMPQRVWX".charAt(t),
                l = l + 1, t = Math.floor(k / u), k = k - t * u, f = f + "23456789CFGHJMPQRVWX".charAt(t), l = l + 1;
            8 == l && l < e && (f += "+")
        }
        8 > f.length && (f += Array(8 - f.length + 1).join("0"));
        8 == f.length && (f += "+");
        e = f;
        if (10 < d) {
            d -= 10;
            f = "";
            k = g = 1.25E-4;
            a = (a + 90) % g;
            c = (c + 180) % k;
            for (l = 0; l < d; l++) u = Math.floor(a / (g / 5)), t = Math.floor(c / (k / 4)), g /= 5, k /= 4, a -= u * g, c -= t * k, f += "23456789CFGHJMPQRVWX".charAt(4 * u + t);
            e += f
        }
        return e
    }, g = a.decode = function (a) {
        if (!e(a)) throw"IllegalArgumentException: Passed Open Location Code is not a valid full code: " + a;
        a = a.replace("+", "");
        a = a.replace(/0+/, "");
        a = a.toUpperCase();
        var b;
        b = a.substring(0, 10);
        var c = k(b, 0), d = k(b, 1);
        b = new l(c[0] - 90, d[0] - 180, c[1] - 90, d[1] - 180, b.length);
        if (10 >= a.length) return b;
        a = a.substring(10);
        for (var d = c = 0, f = 1.25E-4, g = 1.25E-4, h = 0; h < a.length;) var A = "23456789CFGHJMPQRVWX".indexOf(a.charAt(h)), u = Math.floor(A / 4), A = A % 4, f = f / 5, g = g / 4, c = c + u * f, d = d + A * g, h = h + 1;
        a = l(c, d, c + f, d + g, a.length);
        return l(b.latitudeLo + a.latitudeLo, b.longitudeLo + a.longitudeLo, b.latitudeLo + a.latitudeHi, b.longitudeLo + a.longitudeHi, b.codeLength + a.codeLength)
    };
    a.recoverNearest = function (a, b, c) {
        if (!d(a)) {
            if (e(a)) return a;
            throw"ValueError: Passed short code is not valid: " + a;
        }
        b = Math.min(90, Math.max(-90, b));
        c = h(c);
        a = a.toUpperCase();
        var k = 8 - a.indexOf("+"), l = Math.pow(20, 2 - k / 2), s = l / 2;
        a = g(f(Math.floor(b / l) * l, Math.floor(c / l) * l).substr(0, k) + a);
        b = a.latitudeCenter - b;
        b > s ? a.latitudeCenter -= l : b < -s && (a.latitudeCenter += l);
        b = a.longitudeCenter - c;
        b > s ? a.longitudeCenter -= l : b < -s && (a.longitudeCenter += l);
        return f(a.latitudeCenter, a.longitudeCenter, a.codeLength)
    };
    a.shorten = function (a,
                          c, d) {
        if (!e(a)) throw"ValueError: Passed code is not valid and full: " + a;
        if (-1 != a.indexOf("0")) throw"ValueError: Cannot shorten padded codes: " + a;
        a = a.toUpperCase();
        var f = g(a);
        if (6 > f.codeLength) throw"ValueError: Code length must be at least 6";
        c = Math.min(90, Math.max(-90, c));
        d = h(d);
        c = Math.max(Math.abs(f.latitudeCenter - c), Math.abs(f.longitudeCenter - d));
        for (d = b.length - 2; 1 <= d; d--) if (c < 0.3 * b[d]) return a.substring(2 * (d + 1));
        return a
    };
    var h = function (a) {
        for (; -180 > a;) a += 360;
        for (; 180 <= a;) a -= 360;
        return a
    }, k = function (a,
                     c) {
        for (var d = 0, e = 0; 2 * d + c < a.length;) e += "23456789CFGHJMPQRVWX".indexOf(a.charAt(2 * d + c)) * b[d], d += 1;
        return [e, e + b[d - 1]]
    }, l = a.CodeArea = function (b, c, d, e, f) {
        return new a.CodeArea.fn.init(b, c, d, e, f)
    };
    l.fn = l.prototype = {
        init: function (a, b, c, d, e) {
            this.latitudeLo = a;
            this.longitudeLo = b;
            this.latitudeHi = c;
            this.longitudeHi = d;
            this.codeLength = e;
            this.latitudeCenter = Math.min(a + (c - a) / 2, 90);
            this.longitudeCenter = Math.min(b + (d - b) / 2, 180)
        }
    };
    l.fn.init.prototype = l.fn;
    return a
});
(function () {
    var a = {
        _queue: [], _map: {}, _origPress: null, init: function () {
            this._map["38,38,40,40,37,39,37,39,66,65"] = a.whereami;
            this._map["73,68,75,70,65"] = a.crosshair;
            this._map["73,68,68,81,68"] = a.plane;
            this._origDown = SMap.Control.Keyboard.prototype._down;
            SMap.Control.Keyboard.prototype._down = this._down
        }, _down: function (b, c) {
            a._queue.push(b.keyCode);
            var d = a._queue.join(","), e = 0, f;
            for (f in a._map) e = Math.max(e, f.length), -1 < d.indexOf(f) && (a._queue = [], a._map[f].call(this));
            d.length > e && a._queue.shift();
            return a._origDown.apply(this,
                arguments)
        }, _crosshairLayers: null, _crosshairEvents: [], crosshair: function () {
            if (a._crosshairLayers) {
                for (; a._crosshairLayers.length;) {
                    var b = a._crosshairLayers.shift();
                    this.getMap().removeLayer(b);
                    b.$destructor()
                }
                a._crosshairLayers = null;
                JAK.Events.removeListeners(a._crosshairEvents)
            } else {
                b = new SMap.Layer.HUD;
                this.getMap().addLayer(b).enable();
                b.enable();
                var c = JAK.mel("div"), d = JAK.mel("img", null, {left: "-16px", top: "-16px", position: "absolute"});
                d.src = SMap.CONFIG.img + "/crosshair.gif";
                c.appendChild(d);
                b.addItem(c,
                    {left: "50%", top: "50%"});
                var e = new SMap.Layer.Marker;
                this.getMap().addLayer(e).enable();
                a._crosshairLayers = [b, e];
                var f = {url: SMap.CONFIG.img + "/hole.gif", anchor: {left: 17, top: 17}},
                    b = JAK.Events.addListener(document, "keydown", this, function (a, b) {
                        if (17 == a.keyCode) {
                            var c = this.getMap(), d = new SMap.Pixel(0, 0);
                            d.x += Math.round(6 * Math.random() - 3);
                            d.y += Math.round(6 * Math.random() - 3);
                            c = d.toCoords(c);
                            c = new SMap.Marker(c, null, f);
                            e.addMarker(c)
                        }
                    });
                a._crosshairEvents.push(b)
            }
        }, _planeLayer: null, _planeEvents: [], _planeMode: 0,
        _planeTimeout: null, plane: function () {
            if (a._planeLayer) clearTimeout(a._planeTimeout), this.getMap().unlock(), this.getMap().removeLayer(a._planeLayer), a._planeLayer.$destructor(), a._planeLayer = null, JAK.Events.removeListeners(a._planeEvents), this.configure(a._planeMode); else {
                a._planeMode = this.getMode();
                this.configure(0);
                var b = 0, c = new SMap.Pixel(0, 0), d = 0, e = 5, f = function () {
                    var a = b * Math.PI / 180;
                    c.x = -Math.round(e * Math.cos(a));
                    c.y = -Math.round(e * Math.sin(a));
                    for (var a = ["transform", "MozTransform", "WebkitTransform",
                        "OTransform", "msTransform"], d = "translate(-50%, -50%) rotate(" + b + "deg)", f = 0; f < a.length; f++) g.style[a[f]] = d
                };
                a._planeLayer = new SMap.Layer.HUD;
                this.getMap().addLayer(a._planeLayer).enable();
                var g = JAK.mel("img", null, {left: "-16px", top: "-16px", position: "absolute"});
                g.src = SMap.CONFIG.img + "/plane.png";
                a._planeLayer.addItem(g, {left: "50%", top: "50%"});
                f();
                var h = JAK.Events.addListener(document, "keydown", this, function (a, c) {
                    switch (a.keyCode) {
                        case 37:
                            b -= 10;
                            break;
                        case 39:
                            b += 10;
                            break;
                        case 107:
                            e++;
                            break;
                        case 109:
                            e =
                                Math.max(1, e - 1)
                    }
                    b = b.mod(360);
                    f()
                });
                a._planeEvents.push(h);
                var k = this.getMap();
                k.lock();
                a._planeTimeout = setInterval(function () {
                    k.setCenter(c);
                    d += e;
                    300 < d && (d = 0, k.unlock(), k.lock())
                }, 25)
            }
        }, _whereamiLayers: {}, whereami: function () {
            if (navigator.geolocation) if (a._whereamiLayers.marker) {
                for (var b in a._whereamiLayers) this.getMap().removeLayer(a._whereamiLayers[b].disable());
                a._whereamiLayers = {}
            } else navigator.geolocation.getCurrentPosition(function (b) {
                var d = b.coords;
                b = SMap.Coords.fromWGS84(d.longitude, d.latitude);
                var e = 15, f = new SMap.Layer.Marker, g = new SMap.Marker(b);
                this.getMap().addLayer(f).enable();
                f.addMarker(g);
                a._whereamiLayers.marker = f;
                d.accuracy && (e = 12742018 * Math.PI * Math.cos(d.latitude * Math.PI / 180), d = SMap.Coords.fromWGS84(d.longitude + d.accuracy / e * 360, d.latitude), e = new SMap.Layer.Geometry, this.getMap().addLayer(e).enable(), f = new SMap.Geometry(SMap.GEOMETRY_CIRCLE, null, [b, d], {
                    opacity: 0.2,
                    color: "red",
                    outlineColor: "red",
                    outlineWidth: 2
                }), e.addGeometry(f), a._whereamiLayers.geometry = e, e = this.getMap().computeCenterZoom([b,
                    d])[1] - 2);
                this.getMap().setCenterZoom(b, e)
            }.bind(this))
        }
    };
    a.init()
})();
