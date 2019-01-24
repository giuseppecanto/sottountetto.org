(function(){

    angular
        .module('sutApp')
        .controller('findCtrl', findCtrl);

        findCtrl.$inject = ['$routeParams', 'NgMap', 'userService', '$location'];
        function findCtrl($routeParams, NgMap, userService, $location){
            var vm = this;

            //Getting the map instance
            vm.dynMarkers = [];
            NgMap
                .getMap()
                .then(function(map) {
                    vm.map = map;
            });

            //Setting the lawyer when onClick of the marker is fired so it is accessible from InfoWindow 
             vm.showDetail = function(e, user) {
                vm.user = user;
                vm.map.showInfoWindow('foo-iw', user._id);
            };

            //Redirecting to profile page when onClick of the InfoWindow button is fired
            vm.getProfile = function(user) {
                $location.path('/profilo/' + user._id);
            }

            //Getting the markers for the proposals
             userService.usersProposals()
                .success(function(data){
                    vm.data = { users: data }
                    
                    vm.positions = [];
                    for (l in vm.data.users) {
                        vm.positions.push(vm.data.users[l].home.address);
                    }

                    vm.user = vm.data.users[0];
                    
                })
                .error(function(err){
                    console.log(err);
                });

             //Getting the markers for the requests
             userService.usersRequests()
                .success(function(data2){
                    vm.data2 = { users2: data2 }
                    
                    vm.positions2 = [];
                    for (l in vm.data2.users2) {
                        vm.positions2.push(vm.data2.users2[l].home.address);
                    }

                    vm.user2 = vm.data2.users2[0];
                    
                })
                .error(function(err){
                    console.log(err);
                });
          
        vm.onSubmit = function() {
            if (vm.type == 'Tipologia') {
                $location.path('/cerca')
            } else if (vm.type == 'Proposte') {
                $location.path('/cerca/proposte')
            } else if (vm.type == 'Richieste') {
                $location.path('/cerca/richieste')
            };            
        } 

    }
})();