import angular from 'angular';
import ngCurrencySettings from './ng-currency-settings.provider.js';
import ngCurrency from './ng-currency.directive.js';

const module = angular.module('ng-currency', []);

module.provider('ngCurrencySettings', ngCurrencySettings);
module.directive('ngCurrency', ngCurrency);

export default module.name;
