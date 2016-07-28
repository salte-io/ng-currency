import angular from 'angular';
import ngCurrency from './ng-currency.directive.js';

const module = angular.module('ng-currency', []);

module.directive('ngCurrency', ngCurrency);

export default module.name;
