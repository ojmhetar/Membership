angular.module('eclubController', [])


.controller('mainController', function($scope, $http, memberService) {
        
    $scope.checkStatus = function() {
        var pidVal = document.getElementById("pid").value;
        
        var pid = {"pid" : pidVal }; 

        $http.post('/api/checkMember', pid) 
            .success(function(data) { 
        
                if(data.memberExists === false) {
                
                    window.open("newmember.html?" + pidVal, "_self"); 
                }
                else {
                    memberService.addProduct(pid); 
                    window.open("existingmember.html?" + pidVal, "_self"); 
                }
            })
            .error(function(error) {
                alert("Dang. There's been a problem. Ask Ojas."); 
            }); 
    
    }
    
    $scope.addMember = function() {
        var first = document.getElementById("firstName").value; 
        var last = document.getElementById("lastName").value; 
        
        var pidUrl = (self.location.search).replace("?", "");
        var info = {"pid": pidUrl, "first" : first, "last" : last}; 
        $http.post('/api/newMember', info) 
            .success(function(data) {
                
            })
            .error(function(error) {
                alert("Error!");     
            }); 
        
        
    }
    
    
});