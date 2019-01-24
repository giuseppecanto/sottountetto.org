exports.angularApp = function(req, res) {

    /**
     * The controller checks whether the lastVisit property 
     * was set in the session object, and if so,
     * outputs the last visit date to the console. It then 
     * sets the lastVisit property to the current time
    */ 
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    
    /** 
     * Renders a view and sends the rendered HTML string to the client.
     * Documentation: http://expressjs.com/en/4x/api.html#res.render
    */
    res.render('index', { 
        title: 'Hello World',
        user: JSON.stringify(req.user) 
    });

};