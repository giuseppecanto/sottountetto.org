(function(){

    angular
        .module('sutApp')
        .service('userService', userService);

    userService.$inject = ['$http', '$window', 'mailService'];
    function userService($http, $window, mailService) {
        
        var saveToken = function(token ){
            $window.localStorage['sut-token'] = token;
        };

        var getToken = function()  {
            return $window.localStorage['sut-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();

            if (!token || token == 'undefined'){
                return false;
            } else {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            }

        };

        var currentUser = function() {
            if (isLoggedIn()){
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
            
                return {
                    id : payload._id,
                    email : payload.email,
                    firstname : payload.firstname,
                };
            }
        };

        var userById = function(userId) {
            return $http.get('/api/user/' + userId);
        }

        signup = function(payload) {
            return $http.post('/api/signup', payload.lawyer)
                .success(function(_idObject) {
                    var email = mailService.composeRegistrationEmail(payload.emailData, _idObject._id);
                    mailService.send(email);
                });
        };

        signupConfirmation = function(userId) {
            var req = { "userId": userId };

            return $http.put('/api/signup-confirmation', req)
                .success(function(data){
                    console.log(data);
                })
        }

        login = function(lawyer) {
            return $http.post('/api/login', lawyer).success(function(data){
                saveToken(data.token);
            });
        };

       usersAll = function() {
            return $http.get('api/users');
        }

        usersProposals = function() {
            return $http.get('api/users/proposals');
        }

        usersRequests = function() {
            return $http.get('api/users/requests');
        }

        avvocatoFilterBy = function(filter) {
            return $http.get('api/avvocati/' + filter);
        }

        studiolegaleAll = function() {
            return $http.get('api/studilegali');
        }

        studiolegaleFilterBy = function(filter) {
            return $http.get('api/studilegali/' + filter);
        }

        update = function(userId, formData) {
            var req = { "userId": userId, "formData": formData };
            
            return $http.put('api/addRoof', req)
                .success(function(data){
                    saveToken(data.token);
                });
        };

        remove = function(userId) {
            return $http.delete('/api/delete/' + userId)
                        .success(function(){
                            logout();
                        }
            );
        }

        logout = function() {
             $window.localStorage.removeItem('sut-token');
        }

        return{
            currentUser : currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn : isLoggedIn,
            signup: signup,
            signupConfirmation: signupConfirmation,
            login: login,
            logout: logout,
            userById: userById,
            usersAll: usersAll,
            usersProposals: usersProposals,
            usersRequests: usersRequests,
            avvocatoFilterBy: avvocatoFilterBy,
            studiolegaleAll: studiolegaleAll,
            studiolegaleFilterBy: studiolegaleFilterBy,
            update: update,
            remove: remove
        };
    }
})();