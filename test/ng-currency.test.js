'use strict';

describe('ngCurrency directive tests', function() {
    var elem, scope;
  
    beforeEach(module('ng-currency'));
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
	elem = angular.element("<input ng-model='testModel' type='text' ng-currency>");
    }));
  
    
  it('should format Model float 123.45 to "$123.45" view as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 123.45;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.45");
     })
  );
  
  it('should format Model "123.451" to "$123.45" view as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 123.451;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.45");
     })
  );
  
  it('should format Model "123.457" to "$123.46" (round) view as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 123.457;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.46");
     })
  );
  
  it('should set ngModel to 123.45 from string $11.11 as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.45");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(123.45);
     })
  );
  it('should set ngModel to 123123.45 from string $123,123.45 as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123,123.45");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(123123.45);
     })
  );
  it('should set input value to $123,123.45 and Model to float 123123.45 from string 123123.45 as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("123123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(elem.val()).toEqual("$123,123.45");
      expect(scope.testModel).toEqual(123123.45);
     })
  );
});