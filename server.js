var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function serviceCharge(query)
{
    var charge = 0;
    var output;
    if(isNaN(query['savingsBal']) || query['savingsBal'] < 0)
        return {'error' : 'Invalid value for savingsBal'};    
    if (isNaN(query['checkBal']) || query['checkBal'] < 0)
        return {'error' : 'Invalid value for checkBal'};
    if(isNaN(query['checks']) || query['checks'] < 0)
        return {'error' : 'Invalid value for checks'};
    if (query['checkBal'] < 1000 && query['savingsBal'] < 1500)
        charge = query['checks'] * .15;
    return {'charge' : charge};
}

function requestHandler(req, res)
{
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == 'CalcChange')
        res.write(JSON.stringify(serviceCharge(query)));
    res.end('');
}