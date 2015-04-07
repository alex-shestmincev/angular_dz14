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
      var separator = maskAttr.indexOf(":");

      var isValid = function(data){
        console.log(data);
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

        data = data.split(':').join('');

        console.log(data + ' = true');
        return data;
      }

      $element.bind('input keyup click focus', function(event) {
        console.log('start');
        var sep = separator,
          caretPos = getCaretPosition(this),
          mask = maskAttr,
          val = $element.val();

        var charPos = caretPos-1;
        var char = val[charPos];

        if (char) {
          console.log(char);
          if (char === mask[charPos]) { console.log('step 1');

          } else if (char.match(/[0-9]/)) { console.log('step 2');
            if (mask[charPos] !== '9') {console.log('step 2.1');
              deleteChar(charPos);
            }console.log('step 2.2');
          } else if (char.match(/[a-z]/i)) { console.log('step 3');
            if (mask[charPos] !== 'a') {
              deleteChar(charPos);
            }
          } else { console.log('step 4');
            deleteChar(charPos);
          }
        }

        if (mask[caretPos] && mask[caretPos] !== '9' && mask[caretPos] !== 'a'){
            arr = val.split("");
            arr.splice(caretPos, 0, mask[caretPos]);
            $element.val(arr.join(""));

        }
      });

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

      ngModelCtrl.$parsers.push(isValid);


      var formatter = function(data) {

        if (!data){
          return '';
        }
        console.log(data);
        var mask = maskAttr;


        var res = '';
        for (var i= 0, j=0; i < mask.length; i++, j++){

          if (mask[i] === ':') {
            j--;
            res += ':';
          }else if(mask[i] === data[j]){
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
          }
        }

        return res;
      }
      ngModelCtrl.$formatters.push(formatter);




    }
  };
});

