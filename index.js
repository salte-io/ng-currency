import angular from 'angular';
import centsToDollars from './test/ng-currency/directives/cents-to-dollars.module.js';

const module = angular.module('app', [
  'ng-currency',
  centsToDollars
]);

class AppController {
  constructor() {
    this.value = 123456.78;
  }
}

module.controller('AppController', AppController);
