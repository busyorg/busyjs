let WebSocket;
if (typeof window !== 'undefined') {
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

class Client {
  constructor(address) {
    this.address = address;
    this.open = false;
    this.queue = {};
    this.id = 0;
    this.notifications = () => {};

    this.ws = new WebSocket(address);

    this.ws.addEventListener('message', (data) => {
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
    this.id++;
    this.queue[this.id] = cb;
    this.send({
      id: this.id,
      method: 'call',
      jsonrpc: '2.0',
      params: ['database_api', method, [params]],
    });
  }
}

export { Client };
