(function(){

    angular
        .module('sutApp')
        .controller('askRoofCtrl', askRoofCtrl);

    askRoofCtrl.$inject = ['$location', 'userService', '$window', 'NgMap', '$routeParams'];
    function askRoofCtrl($location, userService, $window, NgMap, $routeParams) {
        var vm = this;

        vm.userId = $routeParams.userId;

        vm.currentUser = userService.currentUser();
        vm.isLoggedIn = userService.isLoggedIn();

        vm.checkValidity = function() {
            if (!(vm.isLoggedIn)){
                return false;
            }

            if (vm.userId == vm.currentUser.id){
                return true;
            } else {
                return false;
            }
        }

         // Retrieving user informations 
        userService.userById(vm.userId)
            .success(function(data){
                vm.data = { user: data }

                //checking
                if (vm.data.user.home.purpose == 'proposte')
                    vm.data = { user: { home: {} } };

            }).error(function(err){ 
                console.log(err); 
            });

        vm.formData = {
            purpose: "richieste",
            address : "",
            numBed : "",
        }

        //Setting the map
        vm.types = "['address']";
        vm.placeChanged = function() {
            vm.place = this.getPlace();
            
            //Copying data
            vm.home = {
                location: vm.place.geometry.location,
                address: vm.place.formatted_address
            }

            vm.map.setCenter(vm.place.geometry.location);
        }

            //Getting the map instance
        NgMap
            .getMap()
            .then(function(map) {
                vm.map = map;
            });


        vm.onSubmit = function() {
            vm.formData.address = vm.data.user.home.address;
            vm.formData.numBed = vm.data.user.home.numBed; 

            vm.doModification();        
        };

        vm.doModification = function() {
            vm.formError = "";

            userService
                .update(vm.userId, vm.formData)
                .error(function(err){
                    vm.formError = err.message;
                }).then(function(){
                    $location.path('/');
                });
        };

    }
})();