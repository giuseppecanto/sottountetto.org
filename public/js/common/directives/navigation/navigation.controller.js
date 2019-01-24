(function () {
    angular
        .module('sutApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$location', 'userService'];
    function navigationCtrl($location, userService) {
        var navvm = this;

        navvm.currentPath = $location.path();

        navvm.isLoggedIn = userService.isLoggedIn();
        navvm.currentUser = userService.currentUser();

        navvm.logout = function() {
            userService.logout();
            $location.path('/');
        };
    }

})();