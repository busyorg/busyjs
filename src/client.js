let WebSocket;
if (process.env.IS_UMD) {
  WebSocket = window.WebSocket;
} else {
  WebSocket = require('ws');
}

const wait = (ws, cb) => {
  setTimeout(() => {
    if (ws.readyState === 1) {
      if (cb !== null) cb();
    } else {
      wait(ws, cb);
    }
  }, 5);
};

export default class Client {
  constructor(address) {
    if (typeof address !== 'string')
      throw new TypeError('Invalid argument: address has to be a string.');

    this.address = address;
    this.open = false;
    this.queue = {};
    this.id = 0;
    this.notifications = () => {};

    this.ws = new WebSocket(address);

    this.ws.addEventListener('message', data => {
      const message = JSON.parse(data.data);
      if (this.queue[message.id]) {
        this.queue[message.id](null, message.result);
      } else {
        this.notifications(null, message);
      }
    });

    this.ws.addEventListener('open', () => {
      this.open = true;
    });

    this.ws.addEventListener('close', () => {
      this.open = false;
    });
  }

  subscribe(cb) {
    this.notifications = cb;
  }

  send(message) {
    wait(this.ws, () => {
      this.ws.send(JSON.stringify(message));
    });
  }

  call(method, params = [], cb) {
    this.queue[this.id] = cb;
    this.send({
      id: this.id,
      jsonrpc: '2.0',
      method,
      params,
    });
    this.id += 1;
  }

  close() {
    if (this.ws.readyState === 1) this.ws.close();
  }
}
