// tslint:disable:quotemark ordered-imports no-any no-empty
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const events_1 = require("events");

const async_1 = require("../../../common/utils/async");

class BaseDebugServer extends events_1.EventEmitter {
  constructor(debugSession) {
    super();
    this.isRunning = false;
    this.debugSession = debugSession;
    this.debugClientConnected = async_1.createDeferred();
    this.clientSocket = async_1.createDeferred();
  }

  get client() {
    return this.clientSocket.promise;
  }

  get IsRunning() {
    if (this.isRunning === undefined) {
      return false;
    }

    return this.isRunning;
  }

  get DebugClientConnected() {
    return this.debugClientConnected.promise;
  }

}

exports.BaseDebugServer = BaseDebugServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VEZWJ1Z1NlcnZlci5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImV2ZW50c18xIiwicmVxdWlyZSIsImFzeW5jXzEiLCJCYXNlRGVidWdTZXJ2ZXIiLCJFdmVudEVtaXR0ZXIiLCJjb25zdHJ1Y3RvciIsImRlYnVnU2Vzc2lvbiIsImlzUnVubmluZyIsImRlYnVnQ2xpZW50Q29ubmVjdGVkIiwiY3JlYXRlRGVmZXJyZWQiLCJjbGllbnRTb2NrZXQiLCJjbGllbnQiLCJwcm9taXNlIiwiSXNSdW5uaW5nIiwidW5kZWZpbmVkIiwiRGVidWdDbGllbnRDb25uZWN0ZWQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUF4Qjs7QUFDQSxNQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyw2QkFBRCxDQUF2Qjs7QUFDQSxNQUFNRSxlQUFOLFNBQThCSCxRQUFRLENBQUNJLFlBQXZDLENBQW9EO0FBQ2hEQyxFQUFBQSxXQUFXLENBQUNDLFlBQUQsRUFBZTtBQUN0QjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxTQUFLRCxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFNBQUtFLG9CQUFMLEdBQTRCTixPQUFPLENBQUNPLGNBQVIsRUFBNUI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CUixPQUFPLENBQUNPLGNBQVIsRUFBcEI7QUFDSDs7QUFDRCxNQUFJRSxNQUFKLEdBQWE7QUFDVCxXQUFPLEtBQUtELFlBQUwsQ0FBa0JFLE9BQXpCO0FBQ0g7O0FBQ0QsTUFBSUMsU0FBSixHQUFnQjtBQUNaLFFBQUksS0FBS04sU0FBTCxLQUFtQk8sU0FBdkIsRUFBa0M7QUFDOUIsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLUCxTQUFaO0FBQ0g7O0FBQ0QsTUFBSVEsb0JBQUosR0FBMkI7QUFDdkIsV0FBTyxLQUFLUCxvQkFBTCxDQUEwQkksT0FBakM7QUFDSDs7QUFuQitDOztBQXFCcERkLE9BQU8sQ0FBQ0ssZUFBUixHQUEwQkEsZUFBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgb3JkZXJlZC1pbXBvcnRzIG5vLWFueSBuby1lbXB0eVxyXG4ndXNlIHN0cmljdCc7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xyXG5jb25zdCBhc3luY18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi91dGlscy9hc3luY1wiKTtcclxuY2xhc3MgQmFzZURlYnVnU2VydmVyIGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlYnVnU2Vzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlYnVnU2Vzc2lvbiA9IGRlYnVnU2Vzc2lvbjtcclxuICAgICAgICB0aGlzLmRlYnVnQ2xpZW50Q29ubmVjdGVkID0gYXN5bmNfMS5jcmVhdGVEZWZlcnJlZCgpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50U29ja2V0ID0gYXN5bmNfMS5jcmVhdGVEZWZlcnJlZCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNsaWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRTb2NrZXQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIGdldCBJc1J1bm5pbmcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSdW5uaW5nID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pc1J1bm5pbmc7XHJcbiAgICB9XHJcbiAgICBnZXQgRGVidWdDbGllbnRDb25uZWN0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWdDbGllbnRDb25uZWN0ZWQucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkJhc2VEZWJ1Z1NlcnZlciA9IEJhc2VEZWJ1Z1NlcnZlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFzZURlYnVnU2VydmVyLmpzLm1hcCJdfQ==