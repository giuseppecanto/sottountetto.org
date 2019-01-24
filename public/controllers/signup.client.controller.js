(function(){
    angular
        .module('sutApp')
        .controller('signupCtrl', signupCtrl);

    signupCtrl.$inject = ['$location', 'userService', '$window'];
    function signupCtrl($location, userService, $window) {
        var vm = this;

        vm.formData = { firstname: "", lastname: "", email: "", password: "", passwordRepeated: "" };
        vm.emailData = { name: "sottountetto.org", email: "support@sottountetto.org", to: "", subject: "sottountetto.org: ben atterrato sulla piattaforma", message: ""};

        vm.onSubmit = function() {
            vm.formError = "";
            vm.formSuccess = "";
        
            //Validating data
            if (!vm.formData.firstname || !vm.formData.lastname || !vm.formData.email || !vm.formData.password || !vm.formData.passwordRepeated) {
                vm.formError = "Tutti i campi sono obbligatori, per favore ricompilali.";
                return false;
            } else if (vm.formData.password != vm.formData.passwordRepeated) {
                vm.formError = "Le password devono coincidere.";
                return false;
            } else {

                //Setting recipient for emailData
                vm.emailData.to = vm.formData.email;

                //Calling the register method
                vm.doRegistration();
            }
        };

        vm.doRegistration = function() {
            vm.formError = "";
            vm.formSuccess = "";

            var payload = {
                lawyer: vm.formData,
                emailData: vm.emailData
            };

            userService
                .signup(payload)
                .error(function(err){
                    vm.formError = "Qualcosa è andato storto.";
                }).then(function(){           
                    vm.formSuccess = "Ti sei registrato. Adesso controlla la tua casella di posta elettronica.";
                });
        };

    }
})();