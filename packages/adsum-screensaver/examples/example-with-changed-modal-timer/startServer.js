const AS = require('./server/application-server.es6');
const serverOptions = require('./server/options');

let server = new AS.Server(new AS.Options(serverOptions));

server.start().then((server) => {

}, console.log);



