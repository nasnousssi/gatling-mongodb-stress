var http = require('http');
var port = 5050;
const {MongoClient} = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
	await client.connect();
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

main()
if (process.argv.length <= 2) {
    console.log("Requires port number");
    process.exit();
}

var host = "0.0.0.0";
var port = process.argv[2];

var server =   http.createServer(function (request, response) {
    var body = [];
    var request_log = {
        type: "request",
        method: request.method,
        headers: request.headers,
        host: request.headers.host
    };
    request.on('data',async function (chunk) {
    console.log("sisisis")
        body.push(chunk);
        databasesList = await client.db().admin().listDatabases();
            console.log("Databases:");
            databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    }).on('end', function () {
        body = Buffer.concat(body).toString();

        var message = {"ok": "true", body: body};
        request_log.body = body;
        console.log(JSON.stringify(request_log));
        response.end(JSON.stringify(message))
    });
    response.setHeader('X-Source', 'http-server.js');

});

server.listen(port, function () {
    console.log("HTTP server listening on http://%s:%d", host, port);
});