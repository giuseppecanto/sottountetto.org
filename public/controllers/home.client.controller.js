(function(){

     angular
        .module('sutApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$location'];
    function homeCtrl($location) {
        var vm = this;

    }
})();