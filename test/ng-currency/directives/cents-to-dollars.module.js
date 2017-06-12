import angular from 'angular';
import centsToDollars from './cents-to-dollars.directive.js';

const module = angular.module('cents-to-dollars', []);

module.directive('centsToDollars', centsToDollars);

export default module.name;
