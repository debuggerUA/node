import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

from django.utils import simplejson

define("port", default=8000, help="run on the given port", type=int)

base = {'server': 'tornado',}

class ReqHandler(tornado.web.RequestHandler):
    def get(self, key):
        if key in base:
            data = {'response': base[key], 'success': True}
        else:
            data = {'success': False}
        self.write(simplejson.dumps(data))

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('<html><body><form action="/" method="post"><input type="text" name="key"><input type="text" name="value"><input type="submit" value="post"></form></body></html>')
    def post(self):
        base[self.get_argument("key")] = self.get_argument("value")
        self.redirect('/')

def main():
    tornado.options.parse_command_line()
    application = tornado.web.Application([(r"/(\w+)", ReqHandler), (r"/", MainHandler), ])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()