import angular from 'angular';
import ngCurrency from './ng-currency.directive.js';
import ngCurrencySettings from './ng-currency-settings.provider.js';

const module = angular.module('ng-currency', []);

module.directive('ngCurrency', ngCurrency);
module.provider('ngCurrencySettings', ngCurrencySettings);

export default module.name;
