(function(){
    angular
        .module('sutApp')
        .controller('deleteProfileCtrl', deleteProfileCtrl);

        deleteProfileCtrl.$inject = ['$location', '$window', '$routeParams', 'userService'];
        function deleteProfileCtrl($location, $window, $routeParams, userService) {
            var vm = this;

            vm.userId = $routeParams.userId;

            vm.onSubmit = function() {
                vm.doElimination();        
            };

            vm.doElimination = function() {
                vm.formError = "";

                userService
                    .remove(vm.userId)
                    .error(function(err){
                        vm.formError = err;
                    }).then(function(){
                        $location.path("/");
                        $window.scrollTo(0,0);
                    });
            };
        }

})();