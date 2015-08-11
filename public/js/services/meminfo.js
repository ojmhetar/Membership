angular.module('memberService', []) 

    .service('Members', function() {
          var productList = [];

          var addProduct = function(newObj) {
              productList.push(newObj);
              console.log(newObj.pid);
          };

          var getProducts = function(){
              return productList;
          };

          return {
            addProduct: addProduct,
            getProducts: getProducts
          };

});