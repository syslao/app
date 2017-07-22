/*jshint expr: true*/
/**
 * @preserve HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 */

;(function(window, document) {
    /*jshint evil:true */
    /** version */
    var version = '3.6.2';

    /** Preset options */
    var options = window.html5 || {};

    /** Used to skip problem elements */
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

    /** Not all elements can be cloned in IE **/
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

    /** Detect whether the browser supports default html5 styles */
    var supportsHtml5Styles;

    /** Name of the expando, to work with multiple documents or to re-shiv one document */
    var expando = '_html5shiv';

    /** The id for the the documents expando */
    var expanID = 0;

    /** Cached data for each document */
    var expandoData = {};

    /** Detect whether the browser supports unknown elements */
    var supportsUnknownElements;

    (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                // assign a false positive if unable to shiv
                (document.createElement)('a');
                var frag = document.createDocumentFragment();
                return (
                    typeof frag.cloneNode == 'undefined' ||
                        typeof frag.createDocumentFragment == 'undefined' ||
                        typeof frag.createElement == 'undefined'
                    );
            }());
        } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
        }

    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a style sheet with the given CSS text and adds it to the document.
     * @private
     * @param {Document} ownerDocument The document.
     * @param {String} cssText The CSS text.
     * @returns {StyleSheet} The style element.
     */
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    /**
     * Returns the value of `html5.elements` as an array.
     * @private
     * @returns {Array} An array of shived element node names.
     */
    function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
    }

    /**
     * Returns the data associated to the given document
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Object} An object of data.
     */
    function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
    }

    /**
     * returns a shived element for the given nodeName and document
     * @memberOf html5
     * @param {String} nodeName name of the element
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived element.
     */
    function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

        // Avoid adding some elements to fragments in IE < 9 because
        // * Attributes like `name` or `type` cannot be set/changed once an element
        //   is inserted into a document/fragment
        // * Link elements with `src` attributes that are inaccessible, as with
        //   a 403 response, will cause the tab/window to crash
        // * Script elements appended to fragments will execute when their `src`
        //   or `text` property is set
        return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
    }

    /**
     * returns a shived DocumentFragment for the given document
     * @memberOf html5
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived DocumentFragment.
     */
    function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
    }

    /**
     * Shivs the `createElement` and `createDocumentFragment` methods of the document.
     * @private
     * @param {Document|DocumentFragment} ownerDocument The document.
     * @param {Object} data of the document.
     */
    function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
                return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
            'var n=f.cloneNode(),c=n.createElement;' +
            'h.shivMethods&&(' +
            // unroll the `createElement` calls
            getElements().join().replace(/\w+/g, function(nodeName) {
                data.createElem(nodeName);
                data.frag.createElement(nodeName);
                return 'c("' + nodeName + '")';
            }) +
            ');return n}'
        )(html5, data.frag);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Shivs the given document.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                // corrects block display not defined in IE6/7/8/9
                'article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                    // adds styling not present in IE6/7/8/9
                    'mark{background:#FF0;color:#000}' +
                    // hides non-rendered elements
                    'template{display:none}'
            );
        }
        if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
        }
        return ownerDocument;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * The `html5` object is exposed so that more elements can be shived and
     * existing shiving can be detected on iframes.
     * @type Object
     * @example
     *
     * // options can be changed before the script is included
     * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
     */
    var html5 = {

        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

        /**
         * current version of html5shiv
         */
        'version': version,

        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': (options.shivCSS !== false),

        /**
         * Is equal to true if a browser supports creating unknown/HTML5 elements
         * @memberOf html5
         * @type boolean
         */
        'supportsUnknownElements': supportsUnknownElements,

        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': (options.shivMethods !== false),

        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',

        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument,

        //creates a shived element
        createElement: createElement,

        //creates a shived documentFragment
        createDocumentFragment: createDocumentFragment
    };

    /*--------------------------------------------------------------------------*/

    // expose html5
    window.html5 = html5;

    // shiv the document
    shivDocument(document);

    /*------------------------------- Print Shiv -------------------------------*/

    /** Used to filter media types */
    var reMedia = /^$|\b(?:all|print)\b/;

    /** Used to namespace printable elements */
    var shivNamespace = 'html5shiv';

    /** Detect whether the browser supports shivable style sheets */
    var supportsShivableSheets = !supportsUnknownElements && (function() {
        // assign a false negative if unable to shiv
        var docEl = document.documentElement;
        return !(
            typeof document.namespaces == 'undefined' ||
                typeof document.parentWindow == 'undefined' ||
                typeof docEl.applyElement == 'undefined' ||
                typeof docEl.removeNode == 'undefined' ||
                typeof window.attachEvent == 'undefined'
            );
    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Wraps all HTML5 elements in the given document with printable elements.
     * (eg. the "header" element is wrapped with the "html5shiv:header" element)
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Array} An array wrappers added.
     */
    function addWrappers(ownerDocument) {
        var node,
            nodes = ownerDocument.getElementsByTagName('*'),
            index = nodes.length,
            reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i'),
            result = [];

        while (index--) {
            node = nodes[index];
            if (reElements.test(node.nodeName)) {
                result.push(node.applyElement(createWrapper(node)));
            }
        }
        return result;
    }

    /**
     * Creates a printable wrapper for the given element.
     * @private
     * @param {Element} element The element.
     * @returns {Element} The wrapper.
     */
    function createWrapper(element) {
        var node,
            nodes = element.attributes,
            index = nodes.length,
            wrapper = element.ownerDocument.createElement(shivNamespace + ':' + element.nodeName);

        // copy element attributes to the wrapper
        while (index--) {
            node = nodes[index];
            node.specified && wrapper.setAttribute(node.nodeName, node.nodeValue);
        }
        // copy element styles to the wrapper
        wrapper.style.cssText = element.style.cssText;
        return wrapper;
    }

    /**
     * Shivs the given CSS text.
     * (eg. header{} becomes html5shiv\:header{})
     * @private
     * @param {String} cssText The CSS text to shiv.
     * @returns {String} The shived CSS text.
     */
    function shivCssText(cssText) {
        var pair,
            parts = cssText.split('{'),
            index = parts.length,
            reElements = RegExp('(^|[\\s,>+~])(' + getElements().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
            replacement = '$1' + shivNamespace + '\\:$2';

        while (index--) {
            pair = parts[index] = parts[index].split('}');
            pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
            parts[index] = pair.join('}');
        }
        return parts.join('{');
    }

    /**
     * Removes the given wrappers, leaving the original elements.
     * @private
     * @params {Array} wrappers An array of printable wrappers.
     */
    function removeWrappers(wrappers) {
        var index = wrappers.length;
        while (index--) {
            wrappers[index].removeNode();
        }
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Shivs the given document for print.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivPrint(ownerDocument) {
        var shivedSheet,
            wrappers,
            data = getExpandoData(ownerDocument),
            namespaces = ownerDocument.namespaces,
            ownerWindow = ownerDocument.parentWindow;

        if (!supportsShivableSheets || ownerDocument.printShived) {
            return ownerDocument;
        }
        if (typeof namespaces[shivNamespace] == 'undefined') {
            namespaces.add(shivNamespace);
        }

        function removeSheet() {
            clearTimeout(data._removeSheetTimer);
            if (shivedSheet) {
                shivedSheet.removeNode(true);
            }
            shivedSheet= null;
        }

        ownerWindow.attachEvent('onbeforeprint', function() {

            removeSheet();

            var imports,
                length,
                sheet,
                collection = ownerDocument.styleSheets,
                cssText = [],
                index = collection.length,
                sheets = Array(index);

            // convert styleSheets collection to an array
            while (index--) {
                sheets[index] = collection[index];
            }
            // concat all style sheet CSS text
            while ((sheet = sheets.pop())) {
                // IE does not enforce a same origin policy for external style sheets...
                // but has trouble with some dynamically created stylesheets
                if (!sheet.disabled && reMedia.test(sheet.media)) {

                    try {
                        imports = sheet.imports;
                        length = imports.length;
                    } catch(er){
                        length = 0;
                    }

                    for (index = 0; index < length; index++) {
                        sheets.push(imports[index]);
                    }

                    try {
                        cssText.push(sheet.cssText);
                    } catch(er){}
                }
            }

            // wrap all HTML5 elements with printable elements and add the shived style sheet
            cssText = shivCssText(cssText.reverse().join(''));
            wrappers = addWrappers(ownerDocument);
            shivedSheet = addStyleSheet(ownerDocument, cssText);

        });

        ownerWindow.attachEvent('onafterprint', function() {
            // remove wrappers, leaving the original elements, and remove the shived style sheet
            removeWrappers(wrappers);
            clearTimeout(data._removeSheetTimer);
            data._removeSheetTimer = setTimeout(removeSheet, 500);
        });

        ownerDocument.printShived = true;
        return ownerDocument;
    }

    /*--------------------------------------------------------------------------*/

    // expose API
    html5.type += ' print';
    html5.shivPrint = shivPrint;

    // shiv for print
    shivPrint(document);

}(this, document));
/*
 * backgroundSize: A jQuery cssHook adding support for "cover" and "contain" to IE6,7,8
 *
 * Requirements:
 * - jQuery 1.7.0+
 *
 * Limitations:
 * - doesn't work with multiple backgrounds (use the :after trick)
 * - doesn't work with the "4 values syntax" of background-position
 * - doesn't work with lengths in background-position (only percentages and keywords)
 * - doesn't work with "background-repeat: repeat;"
 * - doesn't work with non-default values of background-clip/origin/attachment/scroll
 * - you should still test your website in IE!
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.backgroundSize.js
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */

(function($,window,document,Math,undefined) {

var div = $( "<div>" )[0],
	rsrc = /url\(["']?(.*?)["']?\)/,
	watched = [],
	positions = {
		top: 0,
		left: 0,
		bottom: 1,
		right: 1,
		center: .5
	};

// feature detection
if ( "backgroundSize" in div.style && !$.debugBGS ) { return; }

$.cssHooks.backgroundSize = {
	set: function( elem, value ) {
		var firstTime = !$.data( elem, "bgsImg" ),
			pos,
			$wrapper, $img;

		$.data( elem, "bgsValue", value );

		if ( firstTime ) {
			// add this element to the 'watched' list so that it's updated on resize
			watched.push( elem );

			$.refreshBackgroundDimensions( elem, true );

			// create wrapper and img
			$wrapper = $( "<div>" ).css({
				position: "absolute",
				zIndex: -1,
				top: 0,
				right: 0,
				left: 0,
				bottom: 0,
				overflow: "hidden"
			});

			$img = $( "<img>" ).css({
				position: "absolute"
			}).appendTo( $wrapper ),

			$wrapper.prependTo( elem );

			$.data( elem, "bgsImg", $img[0] );

			pos = ( 
				// Firefox, Chrome (for debug)
				$.css( elem, "backgroundPosition" ) ||
				// IE8
				$.css( elem, "backgroundPositionX" ) + " " + $.css( elem, "backgroundPositionY" )
			).split(" ");

			// Only compatible with 1 or 2 percentage or keyword values,
			// Not yet compatible with length values and 4 values.
			$.data( elem, "bgsPos", [ 
				positions[ pos[0] ] || parseFloat( pos[0] ) / 100, 
				positions[ pos[1] ] || parseFloat( pos[1] ) / 100
			]);

			// This is the part where we mess with the existing DOM
			// to make sure that the background image is correctly zIndexed
			$.css( elem, "zIndex" ) == "auto" && ( elem.style.zIndex = 0 );
			$.css( elem, "position" ) == "static" && ( elem.style.position = "relative" );

			$.refreshBackgroundImage( elem );

		} else {
			$.refreshBackground( elem );
		}
	},

	get: function( elem ) {
		return $.data( elem, "bgsValue" ) || "";
	}
};

// The background should refresh automatically when changing the background-image
$.cssHooks.backgroundImage = {
	set: function( elem, value ) {
		// if the element has a backgroundSize, refresh its background
		return $.data( elem, "bgsImg") ?
			$.refreshBackgroundImage( elem, value ) :
			// otherwise set the background-image normally
			value;
	}
};

$.refreshBackgroundDimensions = function( elem, noBgRefresh ) {
	var $elem = $(elem),
		currDim = {
			width: $elem.innerWidth(),
			height: $elem.innerHeight()
		},
		prevDim = $.data( elem, "bgsDim" ),
		changed = !prevDim ||
			currDim.width != prevDim.width ||
			currDim.height != prevDim.height;

	$.data( elem, "bgsDim", currDim );

	if ( changed && !noBgRefresh ) {
		$.refreshBackground( elem );
	}
};

$.refreshBackgroundImage = function( elem, value ) {
	var img = $.data( elem, "bgsImg" ),
		currSrc = (value || ($.css(elem, "backgroundImage") || '').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')),
		prevSrc = img && img.src,
		changed = currSrc != prevSrc,
		imgWidth, imgHeight;

	if ( changed ) {
		img.style.height = img.style.width = "auto";

		img.onload = function() {
			var dim = {
				width: img.width,
				height: img.height
			};

			// ignore onload on the proxy image
			if ( dim.width == 1 && dim.height == 1 ) { return; }

			$.data( elem, "bgsImgDim", dim );
			$.data( elem, "bgsConstrain", false );

			$.refreshBackground( elem );

			img.style.visibility = "visible";

			img.onload = null;
		};

		img.style.visibility = "hidden";
		img.src = currSrc;

		if ( img.readyState || img.complete ) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = currSrc;
		}

		elem.style.backgroundImage = "none";
	}
};

$.refreshBackground = function( elem ) {
	var value = $.data( elem, "bgsValue" ),
		elemDim = $.data( elem, "bgsDim" ),
		imgDim = $.data( elem, "bgsImgDim" ),
		$img = $( $.data( elem, "bgsImg" ) ),
		pos = $.data( elem, "bgsPos" ),
		prevConstrain = $.data( elem, "bgsConstrain" ),
		currConstrain,
		elemRatio = (elemDim && elemDim.height) ? elemDim.width / elemDim.height : 1,
		imgRatio = (imgDim && imgDim.height) ? imgDim.width / imgDim.height : 1,
		delta;

	if ( value == "contain" ) {
		if ( imgRatio > elemRatio ) {
			$.data( elem, "bgsConstrain", ( currConstrain = "width" ) );

			delta = Math.floor( ( elemDim.height - elemDim.width / imgRatio ) * pos[1] );

			$img.css({
				top: delta
			});

			// when switchin from height to with constraint,
			// make sure to release contraint on height and reset left
			if ( currConstrain != prevConstrain ) {
				$img.css({
					width: "100%",
					height: "auto",
					left: 0
				});
			}

		} else {
			$.data( elem, "bgsConstrain", ( currConstrain = "height" ) );

			delta = Math.floor( ( elemDim.width - elemDim.height * imgRatio ) * pos[0] );

			$img.css({
				left: delta
			});

			if ( currConstrain != prevConstrain ) {
				$img.css({
					height: "100%",
					width: "auto",
					top: 0
				});
			}
		}

	} else if ( value == "cover" ) {
		if ( imgRatio > elemRatio ) {
			$.data( elem, "bgsConstrain", ( currConstrain = "height" ) );

			delta = Math.floor( ( elemDim.height * imgRatio - elemDim.width ) * pos[0] );

			$img.css({
				left: -delta
			});

			if ( currConstrain != prevConstrain ) {
				$img.css({
					height:"100%",
					width: "auto",
					top: 0
				});
			}

		} else {
			$.data( elem, "bgsConstrain", ( currConstrain = "width" ) );

			delta = Math.floor( ( elemDim.width / imgRatio - elemDim.height ) * pos[1] );

			$img.css({
				top: -delta
			});

			if ( currConstrain != prevConstrain ) {
				$img.css({
					width: "100%",
					height: "auto",
					left: 0
				});
			}
		}
	}
}

// Built-in throttledresize
var $event = $.event,
	$special,
	dummy = {_:0},
	frame = 0,
	wasResized, animRunning;

$special = $event.special.throttledresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments;

		wasResized = true;

        if ( !animRunning ) {
        	$(dummy).animate(dummy, { duration: Infinity, step: function() {
	        	frame++;

	        	if ( frame > $special.threshold && wasResized || execAsap ) {
	        		// set correct event type
        			event.type = "throttledresize";
	        		$event.dispatch.apply( context, args );
	        		wasResized = false;
	        		frame = 0;
	        	}
	        	if ( frame > 9 ) {
	        		$(dummy).stop();
	        		animRunning = false;
	        		frame = 0;
	        	}
	        }});
	        animRunning = true;
        }
	},
	threshold: 1
};

// All backgrounds should refresh automatically when the window is resized
$(window).on("throttledresize", function() {
	$(watched).each(function() {
		$.refreshBackgroundDimensions( this );
	});
});

})(jQuery,window,document,Math);
if (!window.getComputedStyle) {
  window.getComputedStyle = function(el, pseudo) {
    this.el = el;
    this.getPropertyValue = function(prop) {
      var re = /(\-([a-z]){1})/g;
      if (prop == 'float') prop = 'styleFloat';
      if (re.test(prop)) {
        prop = prop.replace(re, function () {
          return arguments[2].toUpperCase();
        });
      }
      return el.currentStyle[prop] ? el.currentStyle[prop] : null;
    }
    return this;
  }
}
;




jQuery(function($) {
  function centerPosters() {
    $('.vjs-poster img').each(function() {
      var img = $(this),
          imgWidth = img.width(),
          imgHeight = img.height(),
          bodyWidth = $('body').width(),
          bodyHeight = $('body').height(),
          imgRatio = imgHeight > 0 ? imgWidth / imgHeight : 1,
          bodyRatio = bodyHeight > 0 ? bodyWidth / bodyHeight : 1,
          scale;

      if (imgRatio > bodyRatio) {
        scale = bodyWidth / imgWidth;
        img.css({
          position: 'absolute',
          left: 0,
          top: (bodyHeight - imgHeight * scale) / 2 + 'px',
          height: 'auto',
          width: '100%'
        });
      }
      else {
        scale = bodyHeight / imgHeight;
        img.css({
          position: 'relative',
          margin: 'auto',
          left: 0,
          top: 0,
          height: '100%',
          width: 'auto'
        });
      }
    });
  }

  $('.page .background_image').css('background-size', 'cover');

  $('body').on('pageactivate', function(event) {
    $('.background_image', event.target).each(function() {
      this.style.backgroundImage = '';
      $.refreshBackground(this);
    });

    centerPosters();
  });

  $(window).on('resize', function() {
    centerPosters();
  });

  $('.ie8_hint .close').click(function() {
    $('.ie8_hint').remove();
    return false;
  });
});
