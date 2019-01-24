(function(){
    angular
        .module('sutApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location', 'userService'];
    function loginCtrl($location, userService) {
        var vm = this;

        vm.credentials = { email: "", password: "" };

        vm.onSubmit = function() {
            vm.formError = "";
        
            if (!vm.credentials.email || !vm.credentials.password) {
                vm.formError = "Tutti i campi sono obbligatori, per favore ricompilali.";
                return false;
            } else {
                vm.doLogin();
            }
        };

        vm.doLogin = function() {
            vm.formError = "";

            userService
                .login(vm.credentials)
                .error(function(err){
                    vm.formError = err.message;
                }).then(function(){
                    $location.path('/');
                });
        };
    }
})();