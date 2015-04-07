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




        data = data.split(':').join('');

        console.log(data + ' = true');
        return data;
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
            if (data[j].match(/[0-9]/)){
              res = res + '' + data[j];
            }else{
              return '';
            }
          }else if(mask[i] === 'a'){
            if (data[j].match(/[a-z]/i)){
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

