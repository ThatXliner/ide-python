// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const types_1 = require("../../../common/application/types");

const base_1 = require("./base");

class ExecuteVSCCommand extends base_1.BaseDiagnosticCommand {
  constructor(diagnostic, serviceContainer, commandName) {
    super(diagnostic);
    this.serviceContainer = serviceContainer;
    this.commandName = commandName;
  }

  invoke() {
    return __awaiter(this, void 0, void 0, function* () {
      const cmdManager = this.serviceContainer.get(types_1.ICommandManager);
      return cmdManager.executeCommand(this.commandName).then(() => undefined);
    });
  }

}

exports.ExecuteVSCCommand = ExecuteVSCCommand;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4ZWNWU0NDb21tYW5kLmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ0eXBlc18xIiwicmVxdWlyZSIsImJhc2VfMSIsIkV4ZWN1dGVWU0NDb21tYW5kIiwiQmFzZURpYWdub3N0aWNDb21tYW5kIiwiY29uc3RydWN0b3IiLCJkaWFnbm9zdGljIiwic2VydmljZUNvbnRhaW5lciIsImNvbW1hbmROYW1lIiwiaW52b2tlIiwiY21kTWFuYWdlciIsImdldCIsIklDb21tYW5kTWFuYWdlciIsImV4ZWN1dGVDb21tYW5kIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzlGLGFBQVNGLElBQVQsQ0FBY0ksTUFBZCxFQUFzQjtBQUFFQSxNQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY1QsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBckIsR0FBc0MsSUFBSU4sQ0FBSixDQUFNLFVBQVVHLE9BQVYsRUFBbUI7QUFBRUEsUUFBQUEsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBUDtBQUF3QixPQUFuRCxFQUFxRE8sSUFBckQsQ0FBMERSLFNBQTFELEVBQXFFSyxRQUFyRSxDQUF0QztBQUF1SDs7QUFDL0lILElBQUFBLElBQUksQ0FBQyxDQUFDTixTQUFTLEdBQUdBLFNBQVMsQ0FBQ2EsS0FBVixDQUFnQmhCLE9BQWhCLEVBQXlCQyxVQUFVLElBQUksRUFBdkMsQ0FBYixFQUF5RFMsSUFBekQsRUFBRCxDQUFKO0FBQ0gsR0FMTSxDQUFQO0FBTUgsQ0FQRDs7QUFRQU8sTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFWCxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNWSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxtQ0FBRCxDQUF2Qjs7QUFDQSxNQUFNQyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLE1BQU1FLGlCQUFOLFNBQWdDRCxNQUFNLENBQUNFLHFCQUF2QyxDQUE2RDtBQUN6REMsRUFBQUEsV0FBVyxDQUFDQyxVQUFELEVBQWFDLGdCQUFiLEVBQStCQyxXQUEvQixFQUE0QztBQUNuRCxVQUFNRixVQUFOO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JBLGdCQUF4QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0g7O0FBQ0RDLEVBQUFBLE1BQU0sR0FBRztBQUNMLFdBQU85QixTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxZQUFNK0IsVUFBVSxHQUFHLEtBQUtILGdCQUFMLENBQXNCSSxHQUF0QixDQUEwQlgsT0FBTyxDQUFDWSxlQUFsQyxDQUFuQjtBQUNBLGFBQU9GLFVBQVUsQ0FBQ0csY0FBWCxDQUEwQixLQUFLTCxXQUEvQixFQUE0Q2IsSUFBNUMsQ0FBaUQsTUFBTW1CLFNBQXZELENBQVA7QUFDSCxLQUhlLENBQWhCO0FBSUg7O0FBWHdEOztBQWE3RGYsT0FBTyxDQUFDSSxpQkFBUixHQUE0QkEsaUJBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xyXG5jb25zdCBiYXNlXzEgPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG5jbGFzcyBFeGVjdXRlVlNDQ29tbWFuZCBleHRlbmRzIGJhc2VfMS5CYXNlRGlhZ25vc3RpY0NvbW1hbmQge1xyXG4gICAgY29uc3RydWN0b3IoZGlhZ25vc3RpYywgc2VydmljZUNvbnRhaW5lciwgY29tbWFuZE5hbWUpIHtcclxuICAgICAgICBzdXBlcihkaWFnbm9zdGljKTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VDb250YWluZXIgPSBzZXJ2aWNlQ29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZE5hbWUgPSBjb21tYW5kTmFtZTtcclxuICAgIH1cclxuICAgIGludm9rZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbWRNYW5hZ2VyID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklDb21tYW5kTWFuYWdlcik7XHJcbiAgICAgICAgICAgIHJldHVybiBjbWRNYW5hZ2VyLmV4ZWN1dGVDb21tYW5kKHRoaXMuY29tbWFuZE5hbWUpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkV4ZWN1dGVWU0NDb21tYW5kID0gRXhlY3V0ZVZTQ0NvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4ZWNWU0NDb21tYW5kLmpzLm1hcCJdfQ==