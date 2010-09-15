var http = require('http');
var url = require('url');
//var multipart = require('./multipart/lib/multipart.js');
//var parser = multipart.parser();
var querystring = require('querystring');
var sys = require('sys');
var client = require('./redis-node-client/lib/redis-client.js').createClient();

http.createServer(function (req, res) {
	if (req.method == 'GET') {
			res.writeHead(200, {'Content-Type': 'application/json'});
  			parsedUri = url.parse(req.url, parseQueryString = true);
  			if (parsedUri.pathname.slice(1) != '' && parsedUri.pathname.slice(1) != 'favicon.ico') {
					client.get(parsedUri.pathname.slice(1), function(err, response){
						res.write(JSON.stringify({'key': response.toString(), 'success': true}));
						res.end();
						});
  			}
  			else {
					resp = {'success': true};
					res.write(JSON.stringify(resp));
					res.end();
  			}
	} 
	if(req.method == 'POST')
	{
		post_handler(req, function(request_data)
      {
				res.writeHead(200, {'Content-Type': 'application/json'});
				parsedUri = url.parse(req.url, parseQueryString = true);
				client.set(parsedUri.pathname.slice(1), request_data.keyvalue);
				res.write(JSON.stringify({'success': true}));
				res.end();
      });
	}
}).listen(8000, "127.0.0.1");

function post_handler(request, callback)
{
    var _REQUEST = { };
    var _CONTENT = '';

    if (request.method == 'POST')
    {
        request.addListener('data', function(chunk)
  {
      _CONTENT+= chunk;
  });

  request.addListener('end', function()
  {
            _REQUEST = querystring.parse(_CONTENT);
      callback(_REQUEST);
  });
    };
};

console.log('Server running at http://127.0.0.1:8000/');

