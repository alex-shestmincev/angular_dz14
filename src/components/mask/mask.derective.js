angular.module('myProject').directive('jbMask',function($compile){
  return {
    priority: 11,
    restrict: 'A',
    require: 'ngModel',

    controller: function ($scope) {

    },
    scope: {
      //mask: "&jbMask"
    },
    link: function($scope, $element, $attr, ngModelCtrl){

      var maskAttr = $attr.jbMask;

      var isValid = function(data){
        var mask = maskAttr;

        if (data.length !== mask.length){
          return false;
        }

        for (var i=0; i<data.length; i++){
          if (data[i] === mask[i]){
            continue;
          }else if(data[i].match(/[0-9]/)){
            if (mask[i] !== '9'){
              return false;
            }
          }else if(data[i].match(/[a-z]/i)){
            if (mask[i] !== 'a'){
              return false;
            }
          }else{
            return false;
          }
        }

        return data;
      }
      ngModelCtrl.$parsers.push(isValid);

      // Следим за операциями над input и удаляем лишнее или дописываем константы из маски
      $element.bind('input keyup click focus', function(event) {
        var caretPos = getCaretPosition(this),
          mask = maskAttr,
          val = $element.val();

        var charPos = caretPos-1;
        var char = val[charPos];

        if (char) {
          if (char === mask[charPos]) {
            //it's ok
          } else if (char.match(/[0-9]/)) {
            if (mask[charPos] !== '9') {
              deleteChar(charPos);
            }
          } else if (char.match(/[a-z]/i)) {
            if (mask[charPos] !== 'a') {
              deleteChar(charPos);
            }
          } else {
            deleteChar(charPos);
          }
        }

        // Вставка статического символа из маски
        if (mask[caretPos] && mask[caretPos] !== '9' && mask[caretPos] !== 'a'){
          arr = val.split("");
          if (arr[caretPos] !== mask[caretPos]) {
            arr.splice(caretPos, 0, mask[caretPos]);
            $element.val(arr.join(""));
          }
        }
      });

      // Удаление символа, не соответствующего маске
      function deleteChar(position){
        var val = $element.val();
        arr = val.split("");
        delete arr[position];
        val = arr.join("");
        $element.val(val);
        $scope.$apply(function () {
          ngModelCtrl.$setViewValue(val);
        });

      }

      // функция, вычисляющая позицию каретки (содрана из ui-mask)
      function getCaretPosition(input){
        if (!input) return 0;
        if (input.selectionStart !== undefined) {
          return input.selectionStart;
        } else if (document.selection) {
          // Curse you IE
          input.focus();
          var selection = document.selection.createRange();
          selection.moveStart('character', input.value ? -input.value.length : 0);
          return selection.text.length;
        }
        return 0;
      }

      var formatter = function(data) {

        if (!data){
          return '';
        }
        var mask = maskAttr;

        if(data.length !== mask.length){
          return '';
        }

        var res = '';
        for (var i= 0, j=0; i < mask.length; i++, j++){
          if(mask[i] === data[j]){
            res += data[j];
          }else if(mask[i] === '9'){
            if (data[j] && data[j].match(/[0-9]/)){
              res = res + '' + data[j];
            }else{
              return '';
            }
          }else if(mask[i] === 'a'){
            if (data[j] && data[j].match(/[a-z]/i)){
              res += data[j];
            }else{
              return '';
            }
          }else{
            return '';
          }
        }

        return res;
      }
      ngModelCtrl.$formatters.push(formatter);
    }
  };
});

