var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var WebSocket = void 0;
{
  WebSocket = require('ws');
}

var wait = function wait(ws, cb) {
  setTimeout(function () {
    if (ws.readyState === 1) {
      if (cb !== null) cb();
    } else {
      wait(ws, cb);
    }
  }, 5);
};

var Client = function () {
  function Client(address) {
    var _this = this;

    classCallCheck(this, Client);

    if (typeof address !== 'string') throw new TypeError('Invalid argument: address has to be a string.');

    this.address = address;
    this.open = false;
    this.queue = {};
    this.id = 0;
    this.notifications = function () {};

    this.ws = new WebSocket(address);

    this.ws.addEventListener('message', function (data) {
      var message = JSON.parse(data.data);
      if (_this.queue[message.id]) {
        _this.queue[message.id](null, message.result);
      } else {
        _this.notifications(null, message);
      }
    });

    this.ws.addEventListener('open', function () {
      _this.open = true;
    });

    this.ws.addEventListener('close', function () {
      _this.open = false;
    });
  }

  createClass(Client, [{
    key: 'subscribe',
    value: function subscribe(cb) {
      this.notifications = cb;
    }
  }, {
    key: 'send',
    value: function send(message) {
      var _this2 = this;

      wait(this.ws, function () {
        _this2.ws.send(JSON.stringify(message));
      });
    }
  }, {
    key: 'call',
    value: function call(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var cb = arguments[2];

      this.queue[this.id] = cb;
      this.send({
        id: this.id,
        jsonrpc: '2.0',
        method: method,
        params: params
      });
      this.id += 1;
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.ws.readyState === 1) this.ws.close();
    }
  }]);
  return Client;
}();

export { Client };
