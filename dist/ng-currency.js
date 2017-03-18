!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("angular")):"function"==typeof define&&define.amd?define("ng-currency",["angular"],n):"object"==typeof exports?exports["ng-currency"]=n(require("angular")):e["ng-currency"]=n(e.angular)}(this,function(e){return function(e){function n(o){if(r[o])return r[o].exports;var t=r[o]={exports:{},id:o,loaded:!1};return e[o].call(t.exports,t,t.exports,n),t.loaded=!0,t.exports}var r={};return n.m=e,n.c=r,n.p="",n(0)}([function(e,n,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var t=r(2),i=o(t),u=r(1),a=o(u),l=i["default"].module("ng-currency",[]);l.directive("ngCurrency",a["default"]),n["default"]=l.name},function(e,n){"use strict";function r(e,n){return{require:"ngModel",link:function(r,o,t,i){function u(){if(M){var e=void 0,n=void 0,r=void 0;if(i.$options&&(i.$options.getOption?(n=i.$options.getOption("updateOn"),r=i.$options.getOption("debounce")):(n=i.$options.updateOn,r=i.$options.debounce)),"blur"===n||r){e=i.$viewValue;for(var o=i.$parsers.length-1;o>=0;o--)e=i.$parsers[o](e)}else e=i.$$rawModelValue;for(var t=i.$formatters.length-1;t>=0;t--)e=i.$formatters[t](e);i.$viewValue=e,i.$render()}}function a(){if(i.$validate(),M){var e=l(i.$$rawModelValue);e!==i.$$rawModelValue&&(i.$setViewValue(e.toFixed(O)),i.$commitViewValue(),u())}}function l(e){return $&&(void 0!==p&&e>p?e=p:void 0!==v&&e<v&&(e=v)),e}function d(e){return RegExp("\\d|\\-|\\"+e,"g")}function c(e){return RegExp("\\-{0,1}((\\"+e+")|([0-9]{1,}\\"+e+"?))&?[0-9]{0,"+O+"}","g")}function f(r){r=String(r);var o=n.NUMBER_FORMATS.DECIMAL_SEP,t=null;r.indexOf(n.NUMBER_FORMATS.DECIMAL_SEP)===-1&&r.indexOf(".")!==-1&&O>0&&(o=".");var i=e("currency")("-1",s(),O),u=RegExp("[0-9."+n.NUMBER_FORMATS.DECIMAL_SEP+n.NUMBER_FORMATS.GROUP_SEP+"]+"),a=i.replace(u.exec(i),""),l=r.replace(u.exec(r),"");return a===l&&(r="-"+u.exec(r)),RegExp("^-[\\s]*$","g").test(r)&&(r="-0"),d(o).test(r)&&(t=r.match(d(o)).join("").match(c(o)),t=t?t[0].replace(o,"."):null),t}function s(){return void 0===x?n.NUMBER_FORMATS.CURRENCY_SYM:x}var $=void 0,v=void 0,p=void 0,x=void 0,g=["","true"].indexOf(t.ngRequired)!==-1,M=!0,O=2;t.$observe("ngCurrency",function(e){M="false"!==e,M?u():(i.$viewValue=i.$$rawModelValue,i.$render())}),t.$observe("hardCap",function(e){$="true"===e,a()}),t.$observe("min",function(e){v=e?Number(e):void 0,a()}),t.$observe("max",function(e){p=e?Number(e):void 0,a()}),t.$observe("currencySymbol",function(e){x=e,u()}),r.$watch(t.ngRequired,function(e){g=e,a()}),t.$observe("fraction",function(e){O=e||2,u(),a()}),i.$parsers.push(function(e){return M&&[void 0,null,""].indexOf(e)===-1?(e=f(e),e=l(Number(e))):e}),i.$formatters.push(function(n){return M&&[void 0,null,""].indexOf(n)===-1?e("currency")(n,s(),O):n}),i.$validators.min=function(e){return!(g||[void 0,null,""].indexOf(e)===-1&&!isNaN(e))||(!M||[void 0,null].indexOf(v)!==-1||isNaN(v)||e>=v)},i.$validators.max=function(e){return!(g||[void 0,null,""].indexOf(e)===-1&&!isNaN(e))||(!M||[void 0,null].indexOf(p)!==-1||isNaN(p)||e<=p)},i.$validators.fraction=function(e){return!M||!e||!isNaN(e)},r.$on("currencyRedraw",function(){a(),u()}),o.bind("focus",function(){if(M){var r=new RegExp("\\"+n.NUMBER_FORMATS.GROUP_SEP,"g"),t=[void 0,null,""].indexOf(i.$$rawModelValue)===-1?e("number")(i.$$rawModelValue,O).replace(r,""):i.$$rawModelValue;i.$viewValue!==t&&(i.$viewValue=t,i.$render(),o.triggerHandler("focus"))}}),o.bind("blur",u)}}}r.$inject=["$filter","$locale"],Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=r},function(n,r){n.exports=e}])});
//# sourceMappingURL=ng-currency.js.map