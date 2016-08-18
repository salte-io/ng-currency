## 1.1.0

* Displaying the real value on focus now displays the value with the locale decimal separator
* Fixed tests not getting kicked off with travis ci

## 1.0.0

* Fixed an issue which caused $pristine to get set to false on focus and blur (#105)

## 0.11.3

* Fixed a bug which fields becomes dirty instead of pristine

## 0.11.2

* Fixed an issue which made it impossible to select content of the input field on focus

## 0.11.1

* Fixed a bug that caused empty ngModel values to get marked as invalid when the min was set to anything above zero or the max was set to anything below zero

## 0.11.0

* Added support for forcing the ngModel value to stay within the min/max range (hard-cap)
* Removed isolated scope
* Created a build process for Travis CI to catch linting and unit test errors
* Refactored the unit tests to reduce duplication

## 0.10.x

* Migrated scope bindings to use `attrs.$observe`

**Migration from 0.9.x!**
Bindings should be updated to use the curly brace syntax

## 0.9.x

* Focusing on an input will show the model value rather then the formatted value

## 0.8.x

* Updated to Angular 1.3.x

## 0.7.x

* Supports Angular 1.2.x
