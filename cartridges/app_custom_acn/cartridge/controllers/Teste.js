'use strict';

var server = require('server');

server.get('MinhaRota', function(req,res,next) {
res.render('meudecorator',{color:'blue'});
next();
});


module.exports = server.exports();
