import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import redis

from tornado.options import define, options

from django.utils import simplejson

define("port", default=8000, help="run on the given port", type=int)

r = redis.Redis(host='localhost', port=6379, db=0)

class ReqHandler(tornado.web.RequestHandler):
    def get(self, key):
        try:
            data = {key: r.get(key), 'success': True}
        except:
            data = {'success': False}
        self.write(simplejson.dumps(data))
    def post(self, key):
        try:
            r.set('key', self.get_argument('keyvalue'))
            data = {'success': True}
        except:
            data = {'success': False}
        self.write(simplejson.dumps(data))

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        data = {'success': True}
        self.write(simplejson.dumps(data))
    


def main():
    r.set('server', 'tornado')
    tornado.options.parse_command_line()
    application = tornado.web.Application([(r"/(\w+)", ReqHandler), (r"/", MainHandler), ])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
    


if __name__ == "__main__":
    main()