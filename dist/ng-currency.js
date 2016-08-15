!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("angular")):"function"==typeof define&&define.amd?define("ng-currency",["angular"],n):"object"==typeof exports?exports["ng-currency"]=n(require("angular")):e["ng-currency"]=n(e.angular)}(this,function(e){return function(e){function n(t){if(r[t])return r[t].exports;var u=r[t]={exports:{},id:t,loaded:!1};return e[t].call(u.exports,u,u.exports,n),u.loaded=!0,u.exports}var r={};return n.m=e,n.c=r,n.p="",n(0)}([function(e,n,r){"use strict";function t(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var u=r(2),o=t(u),i=r(1),c=t(i),a=o["default"].module("ng-currency",[]);a.directive("ngCurrency",c["default"]),n["default"]=a.name},function(e,n){"use strict";function r(e,n){return{require:"ngModel",link:function(r,t,u,o){function i(){if(g){for(var e=o.$modelValue,n=o.$formatters.length-1;n>=0;n--)e=o.$formatters[n](e);o.$viewValue=e,o.$render()}}function c(){if(o.$validate(),g){var e=a(o.$$rawModelValue);e!==o.$$rawModelValue&&(o.$setViewValue(e.toFixed(b)),o.$commitViewValue(),i())}}function a(e){return v&&(void 0!==p&&e>p?e=p:void 0!==$&&e<$&&(e=$)),e}function f(e){return RegExp("\\d|\\-|\\"+e,"g")}function l(e){return RegExp("\\-{0,1}((\\"+e+")|([0-9]{1,}\\"+e+"?))&?[0-9]{0,"+b+"}","g")}function d(r){r=String(r);var t=n.NUMBER_FORMATS.DECIMAL_SEP,u=null;r.indexOf(n.NUMBER_FORMATS.DECIMAL_SEP)===-1&&r.indexOf(".")!==-1&&b>0&&(t=".");var o=e("currency")("-1",s(),b),i=RegExp("[0-9."+n.NUMBER_FORMATS.DECIMAL_SEP+n.NUMBER_FORMATS.GROUP_SEP+"]+"),c=o.replace(i.exec(o),""),a=r.replace(i.exec(r),"");return c===a&&(r="-"+i.exec(r)),RegExp("^-[\\s]*$","g").test(r)&&(r="-0"),f(t).test(r)&&(u=r.match(f(t)).join("").match(l(t)),u=u?u[0].replace(t,"."):null),u}function s(){return void 0===x?n.NUMBER_FORMATS.CURRENCY_SYM:x}var v=void 0,$=void 0,p=void 0,x=void 0,m=void 0,g=!0,b=2;u.$observe("ngCurrency",function(e){g="false"!==e,g?i():(o.$viewValue=o.$modelValue,o.$render())}),u.$observe("hardCap",function(e){v="true"===e,c()}),u.$observe("min",function(e){$=e?Number(e):void 0,c()}),u.$observe("max",function(e){p=e?Number(e):void 0,c()}),u.$observe("currencySymbol",function(e){x=e,i()}),u.$observe("ngRequired",function(e){m=e,c()}),u.$observe("fraction",function(e){b=e||2,i(),c()}),o.$parsers.push(function(e){return g?(e=d(e),e=a(Number(e))):e}),o.$formatters.push(function(n){return g&&""!==n?e("currency")(n,s(),b):n}),o.$validators.min=function(e){return!(m||[void 0,null,""].indexOf(e)===-1&&!isNaN(e))||(!g||[void 0,null].indexOf($)!==-1||isNaN($)||e>=$)},o.$validators.max=function(e){return!(m||[void 0,null,""].indexOf(e)===-1&&!isNaN(e))||(!g||[void 0,null].indexOf(p)!==-1||isNaN(p)||e<=p)},o.$validators.fraction=function(e){return!g||!e||!isNaN(e)},r.$on("currencyRedraw",function(){c(),i()}),t.bind("focus",function(){if(g){var e=Number(o.$modelValue).toFixed(b);o.$viewValue!==e&&(o.$viewValue=e,o.$render(),t.triggerHandler("focus"))}}),t.bind("blur",i)}}}r.$inject=["$filter","$locale"],Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=r},function(n,r){n.exports=e}])});
//# sourceMappingURL=ng-currency.js.map