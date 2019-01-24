(function(){
    angular
        .module('sutApp')
        .controller('profileCtrl', profileCtrl);

        profileCtrl.$inject = ['$routeParams', 'userService', 'NgMap', 'Upload', '$location', 'mailService'];
        function profileCtrl($routeParams, userService, NgMap, Upload, $location, mailService) {
            var vm = this;

        vm.formData = { message: "" };
        vm.emailData = { name: "sottountetto.org", email: "support@sottountetto.org", to: "", subject: "sottountetto.org: ci sono novita'", message: ""};

        vm.userId = $routeParams.userId;
        userService.userById(vm.userId)
            .success(function(data){
                vm.data = { user: data }
            })
            .error(function(err){
                console.log(err);
            });

        vm.onSubmit = function() {
            vm.formError = "";
            vm.formSuccess = "";
        
            //Validating data
            if (!vm.formData.message) {
                vm.formError = "Il campo messaggio e' obbligatorio.";
                return false;
            } else {

                //Setting recipient for emailData
                if (vm.data.user.email) {
                    vm.emailData.to = vm.data.user.email;
                    vm.emailData.message = vm.formData.message + "\n\nRicevi questa email dal servizio sottountetto.org";
                } else {
                    vm.formError = "Errore. Aggiorna la pagina e riprova.";
                }

                //Calling the register method
                vm.sendEmail();
            }
        };

        vm.sendEmail = function() {
            vm.formError = "";
            vm.formSuccess = "";

            mailService
                .send(vm.emailData)
                .error(function(err){
                    vm.formError = "Qualcosa è andato storto.";
                }).then(function(){           
                    vm.formSuccess = "Il messaggio è stato inviato.";
                });
        };

    }
})();