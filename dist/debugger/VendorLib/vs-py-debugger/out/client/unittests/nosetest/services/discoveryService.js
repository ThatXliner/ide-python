"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

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

const inversify_1 = require("inversify");

const vscode_1 = require("vscode");

const types_1 = require("../../../ioc/types");

const constants_1 = require("../../common/constants");

const types_2 = require("../../common/types");

const types_3 = require("../../types");

let TestDiscoveryService = class TestDiscoveryService {
  constructor(serviceContainer, testParser) {
    this.serviceContainer = serviceContainer;
    this.testParser = testParser;
    this.argsService = this.serviceContainer.get(types_3.IArgumentsService, constants_1.NOSETEST_PROVIDER);
    this.runner = this.serviceContainer.get(types_2.ITestRunner);
  }

  discoverTests(options) {
    return __awaiter(this, void 0, void 0, function* () {
      // Remove unwanted arguments.
      const args = this.argsService.filterArguments(options.args, types_3.TestFilter.discovery);
      const token = options.token ? options.token : new vscode_1.CancellationTokenSource().token;
      const runOptions = {
        args: ['--collect-only', '-vvv'].concat(args),
        cwd: options.cwd,
        workspaceFolder: options.workspaceFolder,
        token,
        outChannel: options.outChannel
      };
      const data = yield this.runner.run(constants_1.NOSETEST_PROVIDER, runOptions);

      if (options.token && options.token.isCancellationRequested) {
        return Promise.reject('cancelled');
      }

      return this.testParser.parse(data, options);
    });
  }

};
TestDiscoveryService = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer)), __param(1, inversify_1.inject(types_2.ITestsParser)), __param(1, inversify_1.named(constants_1.NOSETEST_PROVIDER))], TestDiscoveryService);
exports.TestDiscoveryService = TestDiscoveryService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc2NvdmVyeVNlcnZpY2UuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInZzY29kZV8xIiwidHlwZXNfMSIsImNvbnN0YW50c18xIiwidHlwZXNfMiIsInR5cGVzXzMiLCJUZXN0RGlzY292ZXJ5U2VydmljZSIsImNvbnN0cnVjdG9yIiwic2VydmljZUNvbnRhaW5lciIsInRlc3RQYXJzZXIiLCJhcmdzU2VydmljZSIsImdldCIsIklBcmd1bWVudHNTZXJ2aWNlIiwiTk9TRVRFU1RfUFJPVklERVIiLCJydW5uZXIiLCJJVGVzdFJ1bm5lciIsImRpc2NvdmVyVGVzdHMiLCJvcHRpb25zIiwiYXJncyIsImZpbHRlckFyZ3VtZW50cyIsIlRlc3RGaWx0ZXIiLCJkaXNjb3ZlcnkiLCJ0b2tlbiIsIkNhbmNlbGxhdGlvblRva2VuU291cmNlIiwicnVuT3B0aW9ucyIsImNvbmNhdCIsImN3ZCIsIndvcmtzcGFjZUZvbGRlciIsIm91dENoYW5uZWwiLCJkYXRhIiwicnVuIiwiaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQiLCJwYXJzZSIsImluamVjdGFibGUiLCJpbmplY3QiLCJJU2VydmljZUNvbnRhaW5lciIsIklUZXN0c1BhcnNlciIsIm5hbWVkIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJDLENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQUosR0FBUUgsTUFBUixHQUFpQkUsSUFBSSxLQUFLLElBQVQsR0FBZ0JBLElBQUksR0FBR0ssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUFySDtBQUFBLE1BQTJITyxDQUEzSDtBQUNBLE1BQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxPQUFPLENBQUNDLFFBQWYsS0FBNEIsVUFBL0QsRUFBMkVMLENBQUMsR0FBR0ksT0FBTyxDQUFDQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQ0ssS0FBSyxJQUFJVSxDQUFDLEdBQUdiLFVBQVUsQ0FBQ00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sQ0FBQyxJQUFJLENBQXpDLEVBQTRDQSxDQUFDLEVBQTdDLEVBQWlELElBQUlILENBQUMsR0FBR1YsVUFBVSxDQUFDYSxDQUFELENBQWxCLEVBQXVCTixDQUFDLEdBQUcsQ0FBQ0gsQ0FBQyxHQUFHLENBQUosR0FBUU0sQ0FBQyxDQUFDSCxDQUFELENBQVQsR0FBZUgsQ0FBQyxHQUFHLENBQUosR0FBUU0sQ0FBQyxDQUFDVCxNQUFELEVBQVNDLEdBQVQsRUFBY0ssQ0FBZCxDQUFULEdBQTRCRyxDQUFDLENBQUNULE1BQUQsRUFBU0MsR0FBVCxDQUE3QyxLQUErREssQ0FBbkU7QUFDN0UsU0FBT0gsQ0FBQyxHQUFHLENBQUosSUFBU0csQ0FBVCxJQUFjQyxNQUFNLENBQUNNLGNBQVAsQ0FBc0JiLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0ssQ0FBbkMsQ0FBZCxFQUFxREEsQ0FBNUQ7QUFDSCxDQUxEOztBQU1BLElBQUlRLE9BQU8sR0FBSSxVQUFRLFNBQUtBLE9BQWQsSUFBMEIsVUFBVUMsVUFBVixFQUFzQkMsU0FBdEIsRUFBaUM7QUFDckUsU0FBTyxVQUFVaEIsTUFBVixFQUFrQkMsR0FBbEIsRUFBdUI7QUFBRWUsSUFBQUEsU0FBUyxDQUFDaEIsTUFBRCxFQUFTQyxHQUFULEVBQWNjLFVBQWQsQ0FBVDtBQUFxQyxHQUFyRTtBQUNILENBRkQ7O0FBR0EsSUFBSUUsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzlGLGFBQVNGLElBQVQsQ0FBY0ksTUFBZCxFQUFzQjtBQUFFQSxNQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY1QsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBckIsR0FBc0MsSUFBSU4sQ0FBSixDQUFNLFVBQVVHLE9BQVYsRUFBbUI7QUFBRUEsUUFBQUEsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBUDtBQUF3QixPQUFuRCxFQUFxRE8sSUFBckQsQ0FBMERSLFNBQTFELEVBQXFFSyxRQUFyRSxDQUF0QztBQUF1SDs7QUFDL0lILElBQUFBLElBQUksQ0FBQyxDQUFDTixTQUFTLEdBQUdBLFNBQVMsQ0FBQ2EsS0FBVixDQUFnQmhCLE9BQWhCLEVBQXlCQyxVQUFVLElBQUksRUFBdkMsQ0FBYixFQUF5RFMsSUFBekQsRUFBRCxDQUFKO0FBQ0gsR0FMTSxDQUFQO0FBTUgsQ0FQRDs7QUFRQXJCLE1BQU0sQ0FBQ00sY0FBUCxDQUFzQnNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVULEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLE1BQU1VLFdBQVcsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBM0I7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsUUFBRCxDQUF4Qjs7QUFDQSxNQUFNRSxPQUFPLEdBQUdGLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxNQUFNRyxXQUFXLEdBQUdILE9BQU8sQ0FBQyx3QkFBRCxDQUEzQjs7QUFDQSxNQUFNSSxPQUFPLEdBQUdKLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxNQUFNSyxPQUFPLEdBQUdMLE9BQU8sQ0FBQyxhQUFELENBQXZCOztBQUNBLElBQUlNLG9CQUFvQixHQUFHLE1BQU1BLG9CQUFOLENBQTJCO0FBQ2xEQyxFQUFBQSxXQUFXLENBQUNDLGdCQUFELEVBQW1CQyxVQUFuQixFQUErQjtBQUN0QyxTQUFLRCxnQkFBTCxHQUF3QkEsZ0JBQXhCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQUtGLGdCQUFMLENBQXNCRyxHQUF0QixDQUEwQk4sT0FBTyxDQUFDTyxpQkFBbEMsRUFBcURULFdBQVcsQ0FBQ1UsaUJBQWpFLENBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEtBQUtOLGdCQUFMLENBQXNCRyxHQUF0QixDQUEwQlAsT0FBTyxDQUFDVyxXQUFsQyxDQUFkO0FBQ0g7O0FBQ0RDLEVBQUFBLGFBQWEsQ0FBQ0MsT0FBRCxFQUFVO0FBQ25CLFdBQU9yQyxTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRDtBQUNBLFlBQU1zQyxJQUFJLEdBQUcsS0FBS1IsV0FBTCxDQUFpQlMsZUFBakIsQ0FBaUNGLE9BQU8sQ0FBQ0MsSUFBekMsRUFBK0NiLE9BQU8sQ0FBQ2UsVUFBUixDQUFtQkMsU0FBbEUsQ0FBYjtBQUNBLFlBQU1DLEtBQUssR0FBR0wsT0FBTyxDQUFDSyxLQUFSLEdBQWdCTCxPQUFPLENBQUNLLEtBQXhCLEdBQWdDLElBQUlyQixRQUFRLENBQUNzQix1QkFBYixHQUF1Q0QsS0FBckY7QUFDQSxZQUFNRSxVQUFVLEdBQUc7QUFDZk4sUUFBQUEsSUFBSSxFQUFFLENBQUMsZ0JBQUQsRUFBbUIsTUFBbkIsRUFBMkJPLE1BQTNCLENBQWtDUCxJQUFsQyxDQURTO0FBRWZRLFFBQUFBLEdBQUcsRUFBRVQsT0FBTyxDQUFDUyxHQUZFO0FBR2ZDLFFBQUFBLGVBQWUsRUFBRVYsT0FBTyxDQUFDVSxlQUhWO0FBSWZMLFFBQUFBLEtBSmU7QUFLZk0sUUFBQUEsVUFBVSxFQUFFWCxPQUFPLENBQUNXO0FBTEwsT0FBbkI7QUFPQSxZQUFNQyxJQUFJLEdBQUcsTUFBTSxLQUFLZixNQUFMLENBQVlnQixHQUFaLENBQWdCM0IsV0FBVyxDQUFDVSxpQkFBNUIsRUFBK0NXLFVBQS9DLENBQW5COztBQUNBLFVBQUlQLE9BQU8sQ0FBQ0ssS0FBUixJQUFpQkwsT0FBTyxDQUFDSyxLQUFSLENBQWNTLHVCQUFuQyxFQUE0RDtBQUN4RCxlQUFPOUMsT0FBTyxDQUFDRSxNQUFSLENBQWUsV0FBZixDQUFQO0FBQ0g7O0FBQ0QsYUFBTyxLQUFLc0IsVUFBTCxDQUFnQnVCLEtBQWhCLENBQXNCSCxJQUF0QixFQUE0QlosT0FBNUIsQ0FBUDtBQUNILEtBaEJlLENBQWhCO0FBaUJIOztBQXpCaUQsQ0FBdEQ7QUEyQkFYLG9CQUFvQixHQUFHN0MsVUFBVSxDQUFDLENBQzlCc0MsV0FBVyxDQUFDa0MsVUFBWixFQUQ4QixFQUU5QnhELE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUNtQyxNQUFaLENBQW1CaEMsT0FBTyxDQUFDaUMsaUJBQTNCLENBQUosQ0FGdUIsRUFHOUIxRCxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDbUMsTUFBWixDQUFtQjlCLE9BQU8sQ0FBQ2dDLFlBQTNCLENBQUosQ0FIdUIsRUFHd0IzRCxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDc0MsS0FBWixDQUFrQmxDLFdBQVcsQ0FBQ1UsaUJBQTlCLENBQUosQ0FIL0IsQ0FBRCxFQUk5QlAsb0JBSjhCLENBQWpDO0FBS0FSLE9BQU8sQ0FBQ1Esb0JBQVIsR0FBK0JBLG9CQUEvQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW9jL3R5cGVzXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vY29uc3RhbnRzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi8uLi90eXBlc1wiKTtcclxubGV0IFRlc3REaXNjb3ZlcnlTZXJ2aWNlID0gY2xhc3MgVGVzdERpc2NvdmVyeVNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lciwgdGVzdFBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuc2VydmljZUNvbnRhaW5lciA9IHNlcnZpY2VDb250YWluZXI7XHJcbiAgICAgICAgdGhpcy50ZXN0UGFyc2VyID0gdGVzdFBhcnNlcjtcclxuICAgICAgICB0aGlzLmFyZ3NTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18zLklBcmd1bWVudHNTZXJ2aWNlLCBjb25zdGFudHNfMS5OT1NFVEVTVF9QUk9WSURFUik7XHJcbiAgICAgICAgdGhpcy5ydW5uZXIgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVRlc3RSdW5uZXIpO1xyXG4gICAgfVxyXG4gICAgZGlzY292ZXJUZXN0cyhvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHVud2FudGVkIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuYXJnc1NlcnZpY2UuZmlsdGVyQXJndW1lbnRzKG9wdGlvbnMuYXJncywgdHlwZXNfMy5UZXN0RmlsdGVyLmRpc2NvdmVyeSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gb3B0aW9ucy50b2tlbiA/IG9wdGlvbnMudG9rZW4gOiBuZXcgdnNjb2RlXzEuQ2FuY2VsbGF0aW9uVG9rZW5Tb3VyY2UoKS50b2tlbjtcclxuICAgICAgICAgICAgY29uc3QgcnVuT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnLS1jb2xsZWN0LW9ubHknLCAnLXZ2diddLmNvbmNhdChhcmdzKSxcclxuICAgICAgICAgICAgICAgIGN3ZDogb3B0aW9ucy5jd2QsXHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VGb2xkZXI6IG9wdGlvbnMud29ya3NwYWNlRm9sZGVyLFxyXG4gICAgICAgICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBvdXRDaGFubmVsOiBvcHRpb25zLm91dENoYW5uZWxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMucnVubmVyLnJ1bihjb25zdGFudHNfMS5OT1NFVEVTVF9QUk9WSURFUiwgcnVuT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRva2VuICYmIG9wdGlvbnMudG9rZW4uaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVzdFBhcnNlci5wYXJzZShkYXRhLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuVGVzdERpc2NvdmVyeVNlcnZpY2UgPSBfX2RlY29yYXRlKFtcclxuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcclxuICAgIF9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzEuSVNlcnZpY2VDb250YWluZXIpKSxcclxuICAgIF9fcGFyYW0oMSwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzIuSVRlc3RzUGFyc2VyKSksIF9fcGFyYW0oMSwgaW52ZXJzaWZ5XzEubmFtZWQoY29uc3RhbnRzXzEuTk9TRVRFU1RfUFJPVklERVIpKVxyXG5dLCBUZXN0RGlzY292ZXJ5U2VydmljZSk7XHJcbmV4cG9ydHMuVGVzdERpc2NvdmVyeVNlcnZpY2UgPSBUZXN0RGlzY292ZXJ5U2VydmljZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzY292ZXJ5U2VydmljZS5qcy5tYXAiXX0=