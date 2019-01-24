(function(){

    angular
        .module('sutApp')
        .service('mailService', mailService);

        mailService.$inject = ['$http'];
        function mailService($http) {

            composeRegistrationEmail = function(formData, _id) {
                   formData.message = "Ciao,\n\n" + 
                   "grazie per esserti unito a noi. Per completare la registrazione fai clic sul seguente link:\n" +
                   "http://sottountetto.org/conferma-registrazione/" + _id + "\n\n" +
                   "Ti ricordiamo che le operazioni che può fare sul sito sono:\n" +
                   "- Proporre un tetto se sei di buon cuore\n" +
                   "- Richiedere un tetto se è un'emergenza\n" +
                   "- Consultare la mappa per guardare la situazione attuale\n\n" +
                   "Le tue informazioni vengono trattate secondo la Legge n. 675 del 31 dicembre 1996 - Tutela delle persone e di altri soggetti rispetto al trattamento dei dati personali.\n" +
                   "Leggi l'informativa di sottountetto.org a: " +"http://sottountetto.org/informativa/" + "\n\n" +
                   "sottountetto.org TEAM\n" +
                   "sottountetto.org - Copyright 2016 - Tutti i diritti riservati";

                   return formData;      
            }

            send = function(data) {
                return $http.post('/api/mail', data)
                    .success(function(data){
                        console.log(data);
                    });
            }

            return {
                composeRegistrationEmail: composeRegistrationEmail,
                send: send
            };

        }
        
})();