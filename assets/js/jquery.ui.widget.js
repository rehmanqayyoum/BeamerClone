(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):"object"===typeof exports?b(require("jquery")):b(jQuery)})(function(b){var r=0,q=Array.prototype.slice;b.cleanData=function(a){return function(c){var e,d,f;for(f=0;null!=(d=c[f]);f++)try{(e=b._data(d,"events"))&&e.remove&&b(d).triggerHandler("remove")}catch(g){}a(c)}}(b.cleanData);b.widget=function(a,c,e){var d={},f=a.split(".")[0];a=a.split(".")[1];var g=f+"-"+a;e||(e=c,c=b.Widget);b.expr[":"][g.toLowerCase()]=function(m){return!!b.data(m,g)};b[f]=b[f]||{};var k=b[f][a];var h=b[f][a]=function(m,n){if(!this._createWidget)return new h(m,n);arguments.length&&this._createWidget(m,n)};b.extend(h,k,{version:e.version,_proto:b.extend({},e),_childConstructors:[]});var l=new c;l.options=b.widget.extend({},l.options);b.each(e,function(m,n){b.isFunction(n)?d[m]=function(){var t=function(){return c.prototype[m].apply(this,arguments)},u=function(p){return c.prototype[m].apply(this,p)};return function(){var p=this._super,v=this._superApply;this._super=t;this._superApply=u;var w=n.apply(this,arguments);this._super=p;this._superApply=v;return w}}():d[m]=n});h.prototype=b.widget.extend(l,{widgetEventPrefix:k?l.widgetEventPrefix||a:a},d,{constructor:h,namespace:f,widgetName:a,widgetFullName:g});k?(b.each(k._childConstructors,function(m,n){m=n.prototype;b.widget(m.namespace+"."+m.widgetName,h,n._proto)}),delete k._childConstructors):c._childConstructors.push(h);b.widget.bridge(a,h);return h};b.widget.extend=function(a){for(var c=q.call(arguments,1),e=0,d=c.length,f,g;e<d;e++)for(f in c[e])g=c[e][f],c[e].hasOwnProperty(f)&&void 0!==g&&(b.isPlainObject(g)?a[f]=b.isPlainObject(a[f])?b.widget.extend({},a[f],g):b.widget.extend({},g):a[f]=g);return a};b.widget.bridge=function(a,c){var e=c.prototype.widgetFullName||a;b.fn[a]=function(d){var f="string"===typeof d,g=q.call(arguments,1),k=this;f?this.each(function(){var h=b.data(this,e);if("instance"===d)return k=h,!1;if(!h)return b.error("cannot call methods on "+a+" prior to initialization; attempted to call method '"+
d+"'");if(!b.isFunction(h[d])||"_"===d.charAt(0))return b.error("no such method '"+d+"' for "+a+" widget instance");var l=h[d].apply(h,g);if(l!==h&&void 0!==l)return k=l&&l.jquery?k.pushStack(l.get()):l,!1}):(g.length&&(d=b.widget.extend.apply(null,[d].concat(g))),this.each(function(){var h=b.data(this,e);h?(h.option(d||{}),h._init&&h._init()):b.data(this,e,new c(d,this))}));return k}};b.Widget=function(){};b.Widget._childConstructors=[];b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(a,c){c=b(c||this.defaultElement||this)[0];this.element=b(c);this.uuid=r++;this.eventNamespace="."+this.widgetName+this.uuid;this.bindings=b();this.hoverable=b();this.focusable=b();c!==this&&(b.data(c,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===c&&this.destroy()}}),this.document=b(c.style?c.ownerDocument:c.document||c),this.window=b(this.document[0].defaultView||this.document[0].parentWindow));this.options=b.widget.extend({},this.options,this._getCreateOptions(),a);this._create();this._trigger("create",null,this._getCreateEventData());this._init()},_getCreateOptions:b.noop,_getCreateEventData:b.noop,_create:b.noop,_init:b.noop,destroy:function(){this._destroy();this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(b.camelCase(this.widgetFullName));this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled");this.bindings.unbind(this.eventNamespace);this.hoverable.removeClass("ui-state-hover");this.focusable.removeClass("ui-state-focus")},_destroy:b.noop,widget:function(){return this.element},option:function(a,c){var e=a,d;if(0===arguments.length)return b.widget.extend({},this.options);if("string"===typeof a){e={};var f=a.split(".");a=f.shift();if(f.length){var g=e[a]=b.widget.extend({},this.options[a]);for(d=0;d<f.length-1;d++)g[f[d]]=g[f[d]]||{},g=g[f[d]];a=f.pop();if(1===arguments.length)return void 0===g[a]?null:g[a];g[a]=c}else{if(1===arguments.length)return void 0===this.options[a]?null:this.options[a];e[a]=c}}this._setOptions(e);return this},_setOptions:function(a){for(var c in a)this._setOption(c,a[c]);return this},_setOption:function(a,c){this.options[a]=c;"disabled"===a&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!c),c&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")));return this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(a,c,e){var d,f=this;"boolean"!==typeof a&&(e=c,c=a,a=!1);e?(c=d=b(c),this.bindings=this.bindings.add(c)):(e=c,c=this.element,d=this.widget());b.each(e,function(g,k){function h(){if(a||!0!==f.options.disabled&&!b(this).hasClass("ui-state-disabled"))return("string"===typeof k?f[k]:k).apply(f,arguments)}"string"!==typeof k&&(h.guid=k.guid=k.guid||h.guid||b.guid++);var l=g.match(/^([\w:-]*)\s*(.*)$/);g=l[1]+f.eventNamespace;(l=l[2])?d.delegate(l,g,h):c.bind(g,h)})},_off:function(a,c){c=(c||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace;a.unbind(c).undelegate(c);this.bindings=b(this.bindings.not(a).get());this.focusable=b(this.focusable.not(a).get());this.hoverable=b(this.hoverable.not(a).get())},_delay:function(a,c){var e=this;return setTimeout(function(){return("string"===typeof a?e[a]:a).apply(e,arguments)},c||0)},_hoverable:function(a){this.hoverable=this.hoverable.add(a);this._on(a,{mouseenter:function(c){b(c.currentTarget).addClass("ui-state-hover")},mouseleave:function(c){b(c.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(a){this.focusable=this.focusable.add(a);this._on(a,{focusin:function(c){b(c.currentTarget).addClass("ui-state-focus")},focusout:function(c){b(c.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(a,c,e){var d,f=this.options[a];e=e||{};c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();c.target=this.element[0];if(a=c.originalEvent)for(d in a)d in c||(c[d]=a[d]);this.element.trigger(c,e);return!(b.isFunction(f)&&!1===f.apply(this.element[0],[c].concat(e))||c.isDefaultPrevented())}};b.each({show:"fadeIn",hide:"fadeOut"},function(a,c){b.Widget.prototype["_"+a]=function(e,d,f){"string"===typeof d&&(d={effect:d});var g=d?!0===d||"number"===typeof d?c:d.effect||c:a;d=d||{};"number"===typeof d&&(d={duration:d});var k=!b.isEmptyObject(d);d.complete=f;d.delay&&e.delay(d.delay);if(k&&b.effects&&b.effects.effect[g])e[a](d);else if(g!==a&&e[g])e[g](d.duration,d.easing,f);else e.queue(function(h){b(this)[a]();f&&f.call(e[0]);h()})}})});