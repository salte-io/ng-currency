var app = angular.module('plunker', ['ng-currency']);
var scope;
app.controller('MainCtrl', function($scope) {
      scope=$scope;
      $scope.testModel = 123456.78;
      $scope.listModel = [
        {"Id":43,"YearId":0,"Caption":"test","Amount":0.4},
        {"Id":44,"YearId":0,"Caption":"testt","Amount":7.0}
      ];
});
