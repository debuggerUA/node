var http = require('http');
var url = require('url');
var multipart = require('./multipart/lib/multipart.js');
var parser = multipart.parser();
var querystring = require('querystring');
var sys = require('sys');

var base = new Array();
base['server'] = 'node.js';
http.createServer(function (req, res) {
	if (req.method == 'GET') {
  	try {
  		parsedUri = url.parse(req.url, parseQueryString = true);
  		if (parsedUri.pathname.slice(1) != '') {
				res.writeHead(200, {'Content-Type': 'application/json'});
				resp = {'key': base[parsedUri.pathname.slice(1)], 'success': true};
				res.write(JSON.stringify(resp));
  		}
  		else {
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.write('<html><body><form action="/" method="post"><input type="text" name="key"><input type="text" name="value"><input type="submit" value="post"></form></body></html>');
  		}
  		res.end();
  		console.log(req.url);
  	} 
  	catch (Exc) {
  		res.writeHead(500, {'Content-Type': 'application/json'});
			resp = {'success': false};
  		res.end(JSON.stringify(resp));
		console.log(Exc.message);
  	}
  }
	if(req.method == 'POST')
	{
		post_handler(req, function(request_data)
      {
				base[request_data.key] = request_data.value;
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write('<html><body><form action="/" method="post"><input type="text" name="key"><input type="text" name="value"><input type="submit" value="post"></form></body></html>');
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

