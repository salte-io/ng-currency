'use strict';

describe('ngCurrency directive tests', function() {
    var elem, scope;

    beforeEach(module('ng-currency'));
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-currency>");
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

  describe("when currency-symbol is declared", function() {
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency currency-symbol='¥'>");
    }));

    it('should format with declared symbol',
      inject(function($rootScope,$compile) {
        scope.testModel = 123.45;
        elem = $compile(elem)(scope);
        scope.$digest();
        expect(elem.val()).toEqual("¥123.45");
      })
    )

    describe("when currency-symbol declared is empty", function() {
      beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency currency-symbol=''>");
      }));

      it('should format without symbol',
        inject(function($rootScope,$compile) {
          scope.testModel = 123.45;
          elem = $compile(elem)(scope);
          scope.$digest();
          expect(elem.val()).toEqual("123.45");
        })
      )
    });
  });

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

  it('should trigger max error for 1999999 from string $1999999.0 as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$1999999.0");
      elem.triggerHandler('input');
      elem.hasClass('ng-invalid-max')
     })
  );

  it('should trigger min error for 0.01 from string $0.01 as locale currency',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$0.01");
      elem.triggerHandler('input');
      elem.hasClass('ng-invalid-min')
     })
  );

  it('should trigger ng-required error',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("");
      elem.triggerHandler('input');
      elem.hasClass('ng-invalid-required')
     })
  );
  it('should set -0 value from string - ',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("-");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(-0);
     })
  );
  it('should set -0 value from string \'- \' ',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("- ");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(-0);
     })
  );
  it('should set -1.11 value from string -1.11',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("-1.11");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(-1.11);
     })
  );
  it('should set -1.11 value from string $ -1.11',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$ -1.11");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(-1.11);
     })
  );
});
