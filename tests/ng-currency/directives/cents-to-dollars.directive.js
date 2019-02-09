export default function() {
  return {
    require: 'ngModel',
    scope: {},
    link: (scope, elem, attrs, ngModel) => {
      ngModel.$parsers.push((viewValue) => {
        return Math.round(parseFloat(viewValue || 0) * 100);
      });

      ngModel.$formatters.push((modelValue) => {
        return (parseFloat(modelValue || 0) / 100).toFixed(2);
      });
    }
  };
};
