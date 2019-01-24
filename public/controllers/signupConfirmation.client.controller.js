(function() {

    angular
        .module('sutApp')
        .controller('signupConfirmationCtrl', signupConfirmationCtrl);

     signupConfirmationCtrl.$inject = ['$location', '$window','$routeParams', 'userService'];
        function signupConfirmationCtrl($location, $window, $routeParams, userService) {
            var vm = this;

            //Getting avvocatoId information
            vm.userId = $routeParams.userId;
            
            

            //Updating the avvocato (lawyer) enabling it    
            userService
                .signupConfirmation(vm.userId)
                .error(function(err){
                    console.log(err);
                }).then(function(){
                    console.log("Il tuo profilo è stato confermato.");
                });
    
        }
})();