(function(){
    angular
        .module('avvocatoDirettoApp')
        .controller('uploadCtrl', uploadCtrl);

        uploadCtrl.$inject = ['$routeParams', 'authentication', '$scope','Upload', '$timeout'];
        function uploadCtrl($routeParams, authentication, $scope, Upload, $timeout) {
            var vm = this;

            vm.avvocatoId = $routeParams.avvocatoId;
            authentication.avvocatoById(vm.avvocatoId)
                .success(function(data){
                    vm.data = { lawyer: data }
                })
                .error(function(err){
                    console.log(err);
                });

                $scope.upload = function (dataUrl, name) {
                    Upload.upload({
                        url: '/api/upload/' + vm.avvocatoId,
                        data: {
                            file: Upload.dataUrltoBlob(dataUrl, name)
                        },
                    }).then(function (response) {
                        $timeout(function () {
                            $scope.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0) $scope.errorMsg = response.status 
                            + ': ' + response.data;
                    }, function (evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                    });
                }


        }

})();