"use strict";

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const events_1 = require("events");

const inversify_1 = require("inversify");

const net = require("net");

const async_1 = require("../../utils/async");

const misc_1 = require("../../utils/misc");

let SocketServer = class SocketServer extends events_1.EventEmitter {
  constructor() {
    super();
    this.clientSocket = async_1.createDeferred();
  }

  get client() {
    return this.clientSocket.promise;
  }

  dispose() {
    this.Stop();
  }

  Stop() {
    if (!this.socketServer) {
      return;
    }

    try {
      this.socketServer.close(); // tslint:disable-next-line:no-empty
    } catch (ex) {}

    this.socketServer = undefined;
  }

  Start(options = {}) {
    const def = async_1.createDeferred();
    this.socketServer = net.createServer(this.connectionListener.bind(this));
    const port = typeof options.port === 'number' ? options.port : 0;
    const host = typeof options.host === 'string' ? options.host : 'localhost';
    this.socketServer.on('error', ex => {
      console.error('Error in Socket Server', ex);
      const msg = `Failed to start the socket server. (Error: ${ex.message})`;
      def.reject(msg);
    });
    this.socketServer.listen({
      port,
      host
    }, () => {
      def.resolve(this.socketServer.address().port);
    });
    return def.promise;
  }

  connectionListener(client) {
    if (!this.clientSocket.completed) {
      this.clientSocket.resolve(client);
    }

    client.on('close', () => {
      this.emit('close', client);
    });
    client.on('data', data => {
      this.emit('data', client, data);
    });
    client.on('error', err => misc_1.noop);
    client.on('timeout', d => {// let msg = "Debugger client timedout, " + d;
    });
  }

};
SocketServer = __decorate([inversify_1.injectable()], SocketServer);
exports.SocketServer = SocketServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldFNlcnZlci5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJldmVudHNfMSIsInJlcXVpcmUiLCJpbnZlcnNpZnlfMSIsIm5ldCIsImFzeW5jXzEiLCJtaXNjXzEiLCJTb2NrZXRTZXJ2ZXIiLCJFdmVudEVtaXR0ZXIiLCJjb25zdHJ1Y3RvciIsImNsaWVudFNvY2tldCIsImNyZWF0ZURlZmVycmVkIiwiY2xpZW50IiwicHJvbWlzZSIsImRpc3Bvc2UiLCJTdG9wIiwic29ja2V0U2VydmVyIiwiY2xvc2UiLCJleCIsInVuZGVmaW5lZCIsIlN0YXJ0Iiwib3B0aW9ucyIsImRlZiIsImNyZWF0ZVNlcnZlciIsImNvbm5lY3Rpb25MaXN0ZW5lciIsImJpbmQiLCJwb3J0IiwiaG9zdCIsIm9uIiwiY29uc29sZSIsImVycm9yIiwibXNnIiwibWVzc2FnZSIsInJlamVjdCIsImxpc3RlbiIsInJlc29sdmUiLCJhZGRyZXNzIiwiY29tcGxldGVkIiwiZW1pdCIsImRhdGEiLCJlcnIiLCJub29wIiwiaW5qZWN0YWJsZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsVUFBVSxHQUFJLFVBQVEsU0FBS0EsVUFBZCxJQUE2QixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ25GLE1BQUlDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFsQjtBQUFBLE1BQTBCQyxDQUFDLEdBQUdILENBQUMsR0FBRyxDQUFKLEdBQVFILE1BQVIsR0FBaUJFLElBQUksS0FBSyxJQUFULEdBQWdCQSxJQUFJLEdBQUdLLE1B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QUFxQmxDLENBQUMsSUFBSSxDQUN0QjtBQUNILEtBRkQ7QUFHSDs7QUFuRCtELENBQXBFO0FBcURBYSxZQUFZLEdBQUd4QixVQUFVLENBQUMsQ0FDdEJvQixXQUFXLENBQUN1QyxVQUFaLEVBRHNCLENBQUQsRUFFdEJuQyxZQUZzQixDQUF6QjtBQUdBUixPQUFPLENBQUNRLFlBQVIsR0FBdUJBLFlBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IG5ldCA9IHJlcXVpcmUoXCJuZXRcIik7XHJcbmNvbnN0IGFzeW5jXzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvYXN5bmNcIik7XHJcbmNvbnN0IG1pc2NfMSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9taXNjXCIpO1xyXG5sZXQgU29ja2V0U2VydmVyID0gY2xhc3MgU29ja2V0U2VydmVyIGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jbGllbnRTb2NrZXQgPSBhc3luY18xLmNyZWF0ZURlZmVycmVkKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgY2xpZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudFNvY2tldC5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgZGlzcG9zZSgpIHtcclxuICAgICAgICB0aGlzLlN0b3AoKTtcclxuICAgIH1cclxuICAgIFN0b3AoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNvY2tldFNlcnZlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0U2VydmVyLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHsgfVxyXG4gICAgICAgIHRoaXMuc29ja2V0U2VydmVyID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgU3RhcnQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgZGVmID0gYXN5bmNfMS5jcmVhdGVEZWZlcnJlZCgpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0U2VydmVyID0gbmV0LmNyZWF0ZVNlcnZlcih0aGlzLmNvbm5lY3Rpb25MaXN0ZW5lci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBjb25zdCBwb3J0ID0gdHlwZW9mIG9wdGlvbnMucG9ydCA9PT0gJ251bWJlcicgPyBvcHRpb25zLnBvcnQgOiAwO1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSB0eXBlb2Ygb3B0aW9ucy5ob3N0ID09PSAnc3RyaW5nJyA/IG9wdGlvbnMuaG9zdCA6ICdsb2NhbGhvc3QnO1xyXG4gICAgICAgIHRoaXMuc29ja2V0U2VydmVyLm9uKCdlcnJvcicsIGV4ID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gU29ja2V0IFNlcnZlcicsIGV4KTtcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gYEZhaWxlZCB0byBzdGFydCB0aGUgc29ja2V0IHNlcnZlci4gKEVycm9yOiAke2V4Lm1lc3NhZ2V9KWA7XHJcbiAgICAgICAgICAgIGRlZi5yZWplY3QobXNnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNvY2tldFNlcnZlci5saXN0ZW4oeyBwb3J0LCBob3N0IH0sICgpID0+IHtcclxuICAgICAgICAgICAgZGVmLnJlc29sdmUodGhpcy5zb2NrZXRTZXJ2ZXIuYWRkcmVzcygpLnBvcnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICAgIH1cclxuICAgIGNvbm5lY3Rpb25MaXN0ZW5lcihjbGllbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2xpZW50U29ja2V0LmNvbXBsZXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNvY2tldC5yZXNvbHZlKGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsaWVudC5vbignY2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2xvc2UnLCBjbGllbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNsaWVudC5vbignZGF0YScsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZGF0YScsIGNsaWVudCwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2xpZW50Lm9uKCdlcnJvcicsIChlcnIpID0+IG1pc2NfMS5ub29wKTtcclxuICAgICAgICBjbGllbnQub24oJ3RpbWVvdXQnLCBkID0+IHtcclxuICAgICAgICAgICAgLy8gbGV0IG1zZyA9IFwiRGVidWdnZXIgY2xpZW50IHRpbWVkb3V0LCBcIiArIGQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblNvY2tldFNlcnZlciA9IF9fZGVjb3JhdGUoW1xyXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpXHJcbl0sIFNvY2tldFNlcnZlcik7XHJcbmV4cG9ydHMuU29ja2V0U2VydmVyID0gU29ja2V0U2VydmVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zb2NrZXRTZXJ2ZXIuanMubWFwIl19