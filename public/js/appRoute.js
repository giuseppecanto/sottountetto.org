angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'views/home.client.template.html',
			/*controller: 'homeCtrl',
			controllerAs: 'vm'*/
		})

		.when('/home', {
			templateUrl: 'views/home.client.template.html',
			/*controller: 'homeCtrl',
			controllerAs: 'vm'*/
		})
		
		.when('/cerca', {
			templateUrl: 'views/find.client.template.html',
			controller: 'findCtrl',
			controllerAs: 'vm'
		})

		.when('/cerca/proposte', {
			templateUrl: 'views/find.client.template.html',
			controller: 'findProposalsCtrl',
			controllerAs: 'vm'
		})

		.when('/cerca/richieste', {
			templateUrl: 'views/find.client.template.html',
			controller: 'findRequestsCtrl',
			controllerAs: 'vm'
		})
		
		.when('/registrati', {
			templateUrl: 'views/signup.client.template.html',
			controller: 'signupCtrl',
			controllerAs: 'vm'
		})

		.when('/conferma-registrazione/:userId', {
			templateUrl: 'views/signupConfirmation.client.template.html',
			controller: 'signupConfirmationCtrl',
			controllerAs: 'vm'
		})

		.when('/accedi', {
			templateUrl: 'views/login.client.template.html',
			controller: 'loginCtrl',
			controllerAs: 'vm'
		})

		.when('/proposta', {
			templateUrl: 'views/proposal.client.template.html',
		})

		.when('/richiesta', {
			templateUrl: 'views/request.client.template.html',
		})

		.when('/proponi-tetto/:userId', {
			templateUrl: 'views/addRoof.client.template.html',
			controller: 'addRoofCtrl',
			controllerAs: 'vm'
		})

		.when('/richiedi-tetto/:userId', {
			templateUrl: 'views/askRoof.client.template.html',
			controller: 'askRoofCtrl',
			controllerAs: 'vm'
		})

		.when('/informativa', {
			templateUrl: 'views/informativa.client.template.html',
		})

		.when('/profilo/:userId', {
			templateUrl: 'views/profile.client.template.html',
			controller: 'profileCtrl',
			controllerAs: 'vm'
		})

		.when('/elimina/:userId', {
			templateUrl: 'views/profileDelete.client.template.html',
			controller: 'deleteProfileCtrl',
			controllerAs: 'vm'
		})
		
		.otherwise({redirectTo: '/'});

	$locationProvider
        .html5Mode(true);

}]);