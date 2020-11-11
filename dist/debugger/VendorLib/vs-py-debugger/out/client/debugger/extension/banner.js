// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

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

const types_1 = require("../../common/application/types");

require("../../common/extensions");

const types_2 = require("../../common/types");

const types_3 = require("../../ioc/types");

const constants_1 = require("../constants");

const SAMPLE_SIZE_PER_HUNDRED = 10;
var PersistentStateKeys;

(function (PersistentStateKeys) {
  PersistentStateKeys["ShowBanner"] = "ShowBanner";
  PersistentStateKeys["DebuggerLaunchCounter"] = "DebuggerLaunchCounter";
  PersistentStateKeys["DebuggerLaunchThresholdCounter"] = "DebuggerLaunchThresholdCounter";
  PersistentStateKeys["UserSelected"] = "DebuggerUserSelected";
})(PersistentStateKeys = exports.PersistentStateKeys || (exports.PersistentStateKeys = {}));

let DebuggerBanner = class DebuggerBanner {
  constructor(serviceContainer) {
    this.serviceContainer = serviceContainer;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true; // Don't even bother adding handlers if banner has been turned off.

    if (!this.isEnabled()) {
      return;
    }

    this.addCallback();
  } // "enabled" state


  isEnabled() {
    const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
    const key = PersistentStateKeys.ShowBanner;
    const state = factory.createGlobalPersistentState(key, true);
    return state.value;
  }

  disable() {
    return __awaiter(this, void 0, void 0, function* () {
      const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
      const key = PersistentStateKeys.ShowBanner;
      const state = factory.createGlobalPersistentState(key, false);
      yield state.updateValue(false);
    });
  } // showing banner


  shouldShow() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.isEnabled() || this.disabledInCurrentSession) {
        return false;
      }

      if (!(yield this.passedThreshold())) {
        return false;
      }

      return this.isUserSelected();
    });
  }

  show() {
    return __awaiter(this, void 0, void 0, function* () {
      const appShell = this.serviceContainer.get(types_1.IApplicationShell);
      const msg = 'Can you please take 2 minutes to tell us how the debugger is working for you?';
      const yes = 'Yes, take survey now';
      const no = 'No thanks';
      const later = 'Remind me later';
      const response = yield appShell.showInformationMessage(msg, yes, no, later);

      switch (response) {
        case yes:
          {
            yield this.action();
            yield this.disable();
            break;
          }

        case no:
          {
            yield this.disable();
            break;
          }

        default:
          {
            // Disable for the current session.
            this.disabledInCurrentSession = true;
          }
      }
    });
  }

  action() {
    return __awaiter(this, void 0, void 0, function* () {
      const debuggerLaunchCounter = yield this.getGetDebuggerLaunchCounter();
      const browser = this.serviceContainer.get(types_2.IBrowserService);
      browser.launch(`https://www.research.net/r/N7B25RV?n=${debuggerLaunchCounter}`);
    });
  } // user selection


  isUserSelected() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.userSelected !== undefined) {
        return this.userSelected;
      }

      const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
      const key = PersistentStateKeys.UserSelected;
      const state = factory.createGlobalPersistentState(key, undefined);
      let selected = state.value;

      if (selected === undefined) {
        const runtime = this.serviceContainer.get(types_2.IRandom);
        const randomSample = runtime.getRandomInt(0, 100);
        selected = randomSample < SAMPLE_SIZE_PER_HUNDRED;
        state.updateValue(selected).ignoreErrors();
      }

      this.userSelected = selected;
      return selected;
    });
  } // persistent counter


  passedThreshold() {
    return __awaiter(this, void 0, void 0, function* () {
      const [threshold, debuggerCounter] = yield Promise.all([this.getDebuggerLaunchThresholdCounter(), this.getGetDebuggerLaunchCounter()]);
      return debuggerCounter >= threshold;
    });
  }

  incrementDebuggerLaunchCounter() {
    return __awaiter(this, void 0, void 0, function* () {
      const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
      const key = PersistentStateKeys.DebuggerLaunchCounter;
      const state = factory.createGlobalPersistentState(key, 0);
      yield state.updateValue(state.value + 1);
    });
  }

  getGetDebuggerLaunchCounter() {
    return __awaiter(this, void 0, void 0, function* () {
      const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
      const key = PersistentStateKeys.DebuggerLaunchCounter;
      const state = factory.createGlobalPersistentState(key, 0);
      return state.value;
    });
  }

  getDebuggerLaunchThresholdCounter() {
    return __awaiter(this, void 0, void 0, function* () {
      const factory = this.serviceContainer.get(types_2.IPersistentStateFactory);
      const key = PersistentStateKeys.DebuggerLaunchThresholdCounter;
      const state = factory.createGlobalPersistentState(key, undefined);

      if (state.value === undefined) {
        const runtime = this.serviceContainer.get(types_2.IRandom);
        const randomNumber = runtime.getRandomInt(1, 11);
        yield state.updateValue(randomNumber);
      }

      return state.value;
    });
  } // debugger-specific functionality


  addCallback() {
    const debuggerService = this.serviceContainer.get(types_1.IDebugService);
    const disposable = debuggerService.onDidTerminateDebugSession(e => __awaiter(this, void 0, void 0, function* () {
      if (e.type === constants_1.DebuggerTypeName) {
        const logger = this.serviceContainer.get(types_2.ILogger);
        yield this.onDidTerminateDebugSession().catch(ex => logger.logError('Error in debugger Banner', ex));
      }
    }));
    this.serviceContainer.get(types_2.IDisposableRegistry).push(disposable);
  }

  onDidTerminateDebugSession() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.isEnabled()) {
        return;
      }

      yield this.incrementDebuggerLaunchCounter();
      const show = yield this.shouldShow();

      if (!show) {
        return;
      }

      yield this.show();
    });
  }

};
DebuggerBanner = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_3.IServiceContainer))], DebuggerBanner);
exports.DebuggerBanner = DebuggerBanner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhbm5lci5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX3BhcmFtIiwicGFyYW1JbmRleCIsImRlY29yYXRvciIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJleHBvcnRzIiwiaW52ZXJzaWZ5XzEiLCJyZXF1aXJlIiwidHlwZXNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwiY29uc3RhbnRzXzEiLCJTQU1QTEVfU0laRV9QRVJfSFVORFJFRCIsIlBlcnNpc3RlbnRTdGF0ZUtleXMiLCJEZWJ1Z2dlckJhbm5lciIsImNvbnN0cnVjdG9yIiwic2VydmljZUNvbnRhaW5lciIsImluaXRpYWxpemUiLCJpbml0aWFsaXplZCIsImlzRW5hYmxlZCIsImFkZENhbGxiYWNrIiwiZmFjdG9yeSIsImdldCIsIklQZXJzaXN0ZW50U3RhdGVGYWN0b3J5IiwiU2hvd0Jhbm5lciIsInN0YXRlIiwiY3JlYXRlR2xvYmFsUGVyc2lzdGVudFN0YXRlIiwiZGlzYWJsZSIsInVwZGF0ZVZhbHVlIiwic2hvdWxkU2hvdyIsImRpc2FibGVkSW5DdXJyZW50U2Vzc2lvbiIsInBhc3NlZFRocmVzaG9sZCIsImlzVXNlclNlbGVjdGVkIiwic2hvdyIsImFwcFNoZWxsIiwiSUFwcGxpY2F0aW9uU2hlbGwiLCJtc2ciLCJ5ZXMiLCJubyIsImxhdGVyIiwicmVzcG9uc2UiLCJzaG93SW5mb3JtYXRpb25NZXNzYWdlIiwiYWN0aW9uIiwiZGVidWdnZXJMYXVuY2hDb3VudGVyIiwiZ2V0R2V0RGVidWdnZXJMYXVuY2hDb3VudGVyIiwiYnJvd3NlciIsIklCcm93c2VyU2VydmljZSIsImxhdW5jaCIsInVzZXJTZWxlY3RlZCIsInVuZGVmaW5lZCIsIlVzZXJTZWxlY3RlZCIsInNlbGVjdGVkIiwicnVudGltZSIsIklSYW5kb20iLCJyYW5kb21TYW1wbGUiLCJnZXRSYW5kb21JbnQiLCJpZ25vcmVFcnJvcnMiLCJ0aHJlc2hvbGQiLCJkZWJ1Z2dlckNvdW50ZXIiLCJhbGwiLCJnZXREZWJ1Z2dlckxhdW5jaFRocmVzaG9sZENvdW50ZXIiLCJpbmNyZW1lbnREZWJ1Z2dlckxhdW5jaENvdW50ZXIiLCJEZWJ1Z2dlckxhdW5jaENvdW50ZXIiLCJEZWJ1Z2dlckxhdW5jaFRocmVzaG9sZENvdW50ZXIiLCJyYW5kb21OdW1iZXIiLCJkZWJ1Z2dlclNlcnZpY2UiLCJJRGVidWdTZXJ2aWNlIiwiZGlzcG9zYWJsZSIsIm9uRGlkVGVybWluYXRlRGVidWdTZXNzaW9uIiwidHlwZSIsIkRlYnVnZ2VyVHlwZU5hbWUiLCJsb2dnZXIiLCJJTG9nZ2VyIiwiY2F0Y2giLCJleCIsImxvZ0Vycm9yIiwiSURpc3Bvc2FibGVSZWdpc3RyeSIsInB1c2giLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VDb250YWluZXIiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJDLENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQUosR0FBUUgsTUFBUixHQUFpQkUsSUFBSSxLQUFLLElBQVQsR0FBZ0JBLElBQUksR0FBR0ssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUFySDtBQUFBLE1BQTJITyxDQUEzSDtBQUNBLE1BQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxPQUFPLENBQUNDLFFBQWYsS0FBNEIsVUFBL0QsRUFBMkVMLENBQUMsR0FBR0ksT0FBTyxDQUFDQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQ0ssS0FBSyxJQUFJVSxDQUFDLEdBQUdiLFVBQVUsQ0FBQ00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sQ0FBQyxJQUFJLENBQXpDLEVBQTRDQSxDQUFDLEVBQTdDLEVBQWlELElBQUlILENBQUMsR0FBR1YsVUFBVSxDQUFDYSxDQUFELENBQWxCLEVBQXVCTixDQUFDLEdBQUcsQ0FBQ0gsQ0FBQyxHQUFHLENBQUosR0FBUU0sQ0FBQyxDQUFDSCxDQUFELENBQVQsR0FBZUgsQ0FBQyxHQUFHLENBQUosR0FBUU0sQ0FBQyxDQUFDVCxNQUFELEVBQVNDLEdBQVQsRUFBY0ssQ0FBZCxDQUFULEdBQTRCRyxDQUFDLENBQUNULE1BQUQsRUFBU0MsR0FBVCxDQUE3QyxLQUErREssQ0FBbkU7QUFDN0UsU0FBT0gsQ0FBQyxHQUFHLENBQUosSUFBU0csQ0FBVCxJQUFjQyxNQUFNLENBQUNNLGNBQVAsQ0FBc0JiLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0ssQ0FBbkMsQ0FBZCxFQUFxREEsQ0FBNUQ7QUFDSCxDQUxEOztBQU1BLElBQUlRLE9BQU8sR0FBSSxVQUFRLFNBQUtBLE9BQWQsSUFBMEIsVUFBVUMsVUFBVixFQUFzQkMsU0FBdEIsRUFBaUM7QUFDckUsU0FBTyxVQUFVaEIsTUFBVixFQUFrQkMsR0FBbEIsRUFBdUI7QUFBRWUsSUFBQUEsU0FBUyxDQUFDaEIsTUFBRCxFQUFTQyxHQUFULEVBQWNjLFVBQWQsQ0FBVDtBQUFxQyxHQUFyRTtBQUNILENBRkQ7O0FBR0EsSUFBSUUsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzlGLGFBQVNGLElBQVQsQ0FBY0ksTUFBZCxFQUFzQjtBQUFFQSxNQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY1QsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBckIsR0FBc0MsSUFBSU4sQ0FBSixDQUFNLFVBQVVHLE9BQVYsRUFBbUI7QUFBRUEsUUFBQUEsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBUDtBQUF3QixPQUFuRCxFQUFxRE8sSUFBckQsQ0FBMERSLFNBQTFELEVBQXFFSyxRQUFyRSxDQUF0QztBQUF1SDs7QUFDL0lILElBQUFBLElBQUksQ0FBQyxDQUFDTixTQUFTLEdBQUdBLFNBQVMsQ0FBQ2EsS0FBVixDQUFnQmhCLE9BQWhCLEVBQXlCQyxVQUFVLElBQUksRUFBdkMsQ0FBYixFQUF5RFMsSUFBekQsRUFBRCxDQUFKO0FBQ0gsR0FMTSxDQUFQO0FBTUgsQ0FQRDs7QUFRQXJCLE1BQU0sQ0FBQ00sY0FBUCxDQUFzQnNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVULEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLE1BQU1VLFdBQVcsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBM0I7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsZ0NBQUQsQ0FBdkI7O0FBQ0FBLE9BQU8sQ0FBQyx5QkFBRCxDQUFQOztBQUNBLE1BQU1FLE9BQU8sR0FBR0YsT0FBTyxDQUFDLG9CQUFELENBQXZCOztBQUNBLE1BQU1HLE9BQU8sR0FBR0gsT0FBTyxDQUFDLGlCQUFELENBQXZCOztBQUNBLE1BQU1JLFdBQVcsR0FBR0osT0FBTyxDQUFDLGNBQUQsQ0FBM0I7O0FBQ0EsTUFBTUssdUJBQXVCLEdBQUcsRUFBaEM7QUFDQSxJQUFJQyxtQkFBSjs7QUFDQSxDQUFDLFVBQVVBLG1CQUFWLEVBQStCO0FBQzVCQSxFQUFBQSxtQkFBbUIsQ0FBQyxZQUFELENBQW5CLEdBQW9DLFlBQXBDO0FBQ0FBLEVBQUFBLG1CQUFtQixDQUFDLHVCQUFELENBQW5CLEdBQStDLHVCQUEvQztBQUNBQSxFQUFBQSxtQkFBbUIsQ0FBQyxnQ0FBRCxDQUFuQixHQUF3RCxnQ0FBeEQ7QUFDQUEsRUFBQUEsbUJBQW1CLENBQUMsY0FBRCxDQUFuQixHQUFzQyxzQkFBdEM7QUFDSCxDQUxELEVBS0dBLG1CQUFtQixHQUFHUixPQUFPLENBQUNRLG1CQUFSLEtBQWdDUixPQUFPLENBQUNRLG1CQUFSLEdBQThCLEVBQTlELENBTHpCOztBQU1BLElBQUlDLGNBQWMsR0FBRyxNQUFNQSxjQUFOLENBQXFCO0FBQ3RDQyxFQUFBQSxXQUFXLENBQUNDLGdCQUFELEVBQW1CO0FBQzFCLFNBQUtBLGdCQUFMLEdBQXdCQSxnQkFBeEI7QUFDSDs7QUFDREMsRUFBQUEsVUFBVSxHQUFHO0FBQ1QsUUFBSSxLQUFLQyxXQUFULEVBQXNCO0FBQ2xCO0FBQ0g7O0FBQ0QsU0FBS0EsV0FBTCxHQUFtQixJQUFuQixDQUpTLENBS1Q7O0FBQ0EsUUFBSSxDQUFDLEtBQUtDLFNBQUwsRUFBTCxFQUF1QjtBQUNuQjtBQUNIOztBQUNELFNBQUtDLFdBQUw7QUFDSCxHQWRxQyxDQWV0Qzs7O0FBQ0FELEVBQUFBLFNBQVMsR0FBRztBQUNSLFVBQU1FLE9BQU8sR0FBRyxLQUFLTCxnQkFBTCxDQUFzQk0sR0FBdEIsQ0FBMEJiLE9BQU8sQ0FBQ2MsdUJBQWxDLENBQWhCO0FBQ0EsVUFBTXBELEdBQUcsR0FBRzBDLG1CQUFtQixDQUFDVyxVQUFoQztBQUNBLFVBQU1DLEtBQUssR0FBR0osT0FBTyxDQUFDSywyQkFBUixDQUFvQ3ZELEdBQXBDLEVBQXlDLElBQXpDLENBQWQ7QUFDQSxXQUFPc0QsS0FBSyxDQUFDN0IsS0FBYjtBQUNIOztBQUNEK0IsRUFBQUEsT0FBTyxHQUFHO0FBQ04sV0FBT3hDLFNBQVMsQ0FBQyxJQUFELEVBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ2hELFlBQU1rQyxPQUFPLEdBQUcsS0FBS0wsZ0JBQUwsQ0FBc0JNLEdBQXRCLENBQTBCYixPQUFPLENBQUNjLHVCQUFsQyxDQUFoQjtBQUNBLFlBQU1wRCxHQUFHLEdBQUcwQyxtQkFBbUIsQ0FBQ1csVUFBaEM7QUFDQSxZQUFNQyxLQUFLLEdBQUdKLE9BQU8sQ0FBQ0ssMkJBQVIsQ0FBb0N2RCxHQUFwQyxFQUF5QyxLQUF6QyxDQUFkO0FBQ0EsWUFBTXNELEtBQUssQ0FBQ0csV0FBTixDQUFrQixLQUFsQixDQUFOO0FBQ0gsS0FMZSxDQUFoQjtBQU1ILEdBN0JxQyxDQThCdEM7OztBQUNBQyxFQUFBQSxVQUFVLEdBQUc7QUFDVCxXQUFPMUMsU0FBUyxDQUFDLElBQUQsRUFBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDaEQsVUFBSSxDQUFDLEtBQUtnQyxTQUFMLEVBQUQsSUFBcUIsS0FBS1csd0JBQTlCLEVBQXdEO0FBQ3BELGVBQU8sS0FBUDtBQUNIOztBQUNELFVBQUksRUFBRSxNQUFNLEtBQUtDLGVBQUwsRUFBUixDQUFKLEVBQXFDO0FBQ2pDLGVBQU8sS0FBUDtBQUNIOztBQUNELGFBQU8sS0FBS0MsY0FBTCxFQUFQO0FBQ0gsS0FSZSxDQUFoQjtBQVNIOztBQUNEQyxFQUFBQSxJQUFJLEdBQUc7QUFDSCxXQUFPOUMsU0FBUyxDQUFDLElBQUQsRUFBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDaEQsWUFBTStDLFFBQVEsR0FBRyxLQUFLbEIsZ0JBQUwsQ0FBc0JNLEdBQXRCLENBQTBCZCxPQUFPLENBQUMyQixpQkFBbEMsQ0FBakI7QUFDQSxZQUFNQyxHQUFHLEdBQUcsK0VBQVo7QUFDQSxZQUFNQyxHQUFHLEdBQUcsc0JBQVo7QUFDQSxZQUFNQyxFQUFFLEdBQUcsV0FBWDtBQUNBLFlBQU1DLEtBQUssR0FBRyxpQkFBZDtBQUNBLFlBQU1DLFFBQVEsR0FBRyxNQUFNTixRQUFRLENBQUNPLHNCQUFULENBQWdDTCxHQUFoQyxFQUFxQ0MsR0FBckMsRUFBMENDLEVBQTFDLEVBQThDQyxLQUE5QyxDQUF2Qjs7QUFDQSxjQUFRQyxRQUFSO0FBQ0ksYUFBS0gsR0FBTDtBQUNJO0FBQ0ksa0JBQU0sS0FBS0ssTUFBTCxFQUFOO0FBQ0Esa0JBQU0sS0FBS2YsT0FBTCxFQUFOO0FBQ0E7QUFDSDs7QUFDTCxhQUFLVyxFQUFMO0FBQVM7QUFDTCxrQkFBTSxLQUFLWCxPQUFMLEVBQU47QUFDQTtBQUNIOztBQUNEO0FBQVM7QUFDTDtBQUNBLGlCQUFLRyx3QkFBTCxHQUFnQyxJQUFoQztBQUNIO0FBZEw7QUFnQkgsS0F2QmUsQ0FBaEI7QUF3Qkg7O0FBQ0RZLEVBQUFBLE1BQU0sR0FBRztBQUNMLFdBQU92RCxTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxZQUFNd0QscUJBQXFCLEdBQUcsTUFBTSxLQUFLQywyQkFBTCxFQUFwQztBQUNBLFlBQU1DLE9BQU8sR0FBRyxLQUFLN0IsZ0JBQUwsQ0FBc0JNLEdBQXRCLENBQTBCYixPQUFPLENBQUNxQyxlQUFsQyxDQUFoQjtBQUNBRCxNQUFBQSxPQUFPLENBQUNFLE1BQVIsQ0FBZ0Isd0NBQXVDSixxQkFBc0IsRUFBN0U7QUFDSCxLQUplLENBQWhCO0FBS0gsR0ExRXFDLENBMkV0Qzs7O0FBQ0FYLEVBQUFBLGNBQWMsR0FBRztBQUNiLFdBQU83QyxTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxVQUFJLEtBQUs2RCxZQUFMLEtBQXNCQyxTQUExQixFQUFxQztBQUNqQyxlQUFPLEtBQUtELFlBQVo7QUFDSDs7QUFDRCxZQUFNM0IsT0FBTyxHQUFHLEtBQUtMLGdCQUFMLENBQXNCTSxHQUF0QixDQUEwQmIsT0FBTyxDQUFDYyx1QkFBbEMsQ0FBaEI7QUFDQSxZQUFNcEQsR0FBRyxHQUFHMEMsbUJBQW1CLENBQUNxQyxZQUFoQztBQUNBLFlBQU16QixLQUFLLEdBQUdKLE9BQU8sQ0FBQ0ssMkJBQVIsQ0FBb0N2RCxHQUFwQyxFQUF5QzhFLFNBQXpDLENBQWQ7QUFDQSxVQUFJRSxRQUFRLEdBQUcxQixLQUFLLENBQUM3QixLQUFyQjs7QUFDQSxVQUFJdUQsUUFBUSxLQUFLRixTQUFqQixFQUE0QjtBQUN4QixjQUFNRyxPQUFPLEdBQUcsS0FBS3BDLGdCQUFMLENBQXNCTSxHQUF0QixDQUEwQmIsT0FBTyxDQUFDNEMsT0FBbEMsQ0FBaEI7QUFDQSxjQUFNQyxZQUFZLEdBQUdGLE9BQU8sQ0FBQ0csWUFBUixDQUFxQixDQUFyQixFQUF3QixHQUF4QixDQUFyQjtBQUNBSixRQUFBQSxRQUFRLEdBQUdHLFlBQVksR0FBRzFDLHVCQUExQjtBQUNBYSxRQUFBQSxLQUFLLENBQUNHLFdBQU4sQ0FBa0J1QixRQUFsQixFQUE0QkssWUFBNUI7QUFDSDs7QUFDRCxXQUFLUixZQUFMLEdBQW9CRyxRQUFwQjtBQUNBLGFBQU9BLFFBQVA7QUFDSCxLQWhCZSxDQUFoQjtBQWlCSCxHQTlGcUMsQ0ErRnRDOzs7QUFDQXBCLEVBQUFBLGVBQWUsR0FBRztBQUNkLFdBQU81QyxTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxZQUFNLENBQUNzRSxTQUFELEVBQVlDLGVBQVosSUFBK0IsTUFBTWxFLE9BQU8sQ0FBQ21FLEdBQVIsQ0FBWSxDQUNuRCxLQUFLQyxpQ0FBTCxFQURtRCxFQUVuRCxLQUFLaEIsMkJBQUwsRUFGbUQsQ0FBWixDQUEzQztBQUlBLGFBQU9jLGVBQWUsSUFBSUQsU0FBMUI7QUFDSCxLQU5lLENBQWhCO0FBT0g7O0FBQ0RJLEVBQUFBLDhCQUE4QixHQUFHO0FBQzdCLFdBQU8xRSxTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxZQUFNa0MsT0FBTyxHQUFHLEtBQUtMLGdCQUFMLENBQXNCTSxHQUF0QixDQUEwQmIsT0FBTyxDQUFDYyx1QkFBbEMsQ0FBaEI7QUFDQSxZQUFNcEQsR0FBRyxHQUFHMEMsbUJBQW1CLENBQUNpRCxxQkFBaEM7QUFDQSxZQUFNckMsS0FBSyxHQUFHSixPQUFPLENBQUNLLDJCQUFSLENBQW9DdkQsR0FBcEMsRUFBeUMsQ0FBekMsQ0FBZDtBQUNBLFlBQU1zRCxLQUFLLENBQUNHLFdBQU4sQ0FBa0JILEtBQUssQ0FBQzdCLEtBQU4sR0FBYyxDQUFoQyxDQUFOO0FBQ0gsS0FMZSxDQUFoQjtBQU1IOztBQUNEZ0QsRUFBQUEsMkJBQTJCLEdBQUc7QUFDMUIsV0FBT3pELFNBQVMsQ0FBQyxJQUFELEVBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ2hELFlBQU1rQyxPQUFPLEdBQUcsS0FBS0wsZ0JBQUwsQ0FBc0JNLEdBQXRCLENBQTBCYixPQUFPLENBQUNjLHVCQUFsQyxDQUFoQjtBQUNBLFlBQU1wRCxHQUFHLEdBQUcwQyxtQkFBbUIsQ0FBQ2lELHFCQUFoQztBQUNBLFlBQU1yQyxLQUFLLEdBQUdKLE9BQU8sQ0FBQ0ssMkJBQVIsQ0FBb0N2RCxHQUFwQyxFQUF5QyxDQUF6QyxDQUFkO0FBQ0EsYUFBT3NELEtBQUssQ0FBQzdCLEtBQWI7QUFDSCxLQUxlLENBQWhCO0FBTUg7O0FBQ0RnRSxFQUFBQSxpQ0FBaUMsR0FBRztBQUNoQyxXQUFPekUsU0FBUyxDQUFDLElBQUQsRUFBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDaEQsWUFBTWtDLE9BQU8sR0FBRyxLQUFLTCxnQkFBTCxDQUFzQk0sR0FBdEIsQ0FBMEJiLE9BQU8sQ0FBQ2MsdUJBQWxDLENBQWhCO0FBQ0EsWUFBTXBELEdBQUcsR0FBRzBDLG1CQUFtQixDQUFDa0QsOEJBQWhDO0FBQ0EsWUFBTXRDLEtBQUssR0FBR0osT0FBTyxDQUFDSywyQkFBUixDQUFvQ3ZELEdBQXBDLEVBQXlDOEUsU0FBekMsQ0FBZDs7QUFDQSxVQUFJeEIsS0FBSyxDQUFDN0IsS0FBTixLQUFnQnFELFNBQXBCLEVBQStCO0FBQzNCLGNBQU1HLE9BQU8sR0FBRyxLQUFLcEMsZ0JBQUwsQ0FBc0JNLEdBQXRCLENBQTBCYixPQUFPLENBQUM0QyxPQUFsQyxDQUFoQjtBQUNBLGNBQU1XLFlBQVksR0FBR1osT0FBTyxDQUFDRyxZQUFSLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQXJCO0FBQ0EsY0FBTTlCLEtBQUssQ0FBQ0csV0FBTixDQUFrQm9DLFlBQWxCLENBQU47QUFDSDs7QUFDRCxhQUFPdkMsS0FBSyxDQUFDN0IsS0FBYjtBQUNILEtBVmUsQ0FBaEI7QUFXSCxHQXJJcUMsQ0FzSXRDOzs7QUFDQXdCLEVBQUFBLFdBQVcsR0FBRztBQUNWLFVBQU02QyxlQUFlLEdBQUcsS0FBS2pELGdCQUFMLENBQXNCTSxHQUF0QixDQUEwQmQsT0FBTyxDQUFDMEQsYUFBbEMsQ0FBeEI7QUFDQSxVQUFNQyxVQUFVLEdBQUdGLGVBQWUsQ0FBQ0csMEJBQWhCLENBQTRDckUsQ0FBRCxJQUFPWixTQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUM5RyxVQUFJWSxDQUFDLENBQUNzRSxJQUFGLEtBQVcxRCxXQUFXLENBQUMyRCxnQkFBM0IsRUFBNkM7QUFDekMsY0FBTUMsTUFBTSxHQUFHLEtBQUt2RCxnQkFBTCxDQUFzQk0sR0FBdEIsQ0FBMEJiLE9BQU8sQ0FBQytELE9BQWxDLENBQWY7QUFDQSxjQUFNLEtBQUtKLDBCQUFMLEdBQ0RLLEtBREMsQ0FDS0MsRUFBRSxJQUFJSCxNQUFNLENBQUNJLFFBQVAsQ0FBZ0IsMEJBQWhCLEVBQTRDRCxFQUE1QyxDQURYLENBQU47QUFFSDtBQUNKLEtBTjZFLENBQTNELENBQW5CO0FBT0EsU0FBSzFELGdCQUFMLENBQXNCTSxHQUF0QixDQUEwQmIsT0FBTyxDQUFDbUUsbUJBQWxDLEVBQXVEQyxJQUF2RCxDQUE0RFYsVUFBNUQ7QUFDSDs7QUFDREMsRUFBQUEsMEJBQTBCLEdBQUc7QUFDekIsV0FBT2pGLFNBQVMsQ0FBQyxJQUFELEVBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ2hELFVBQUksQ0FBQyxLQUFLZ0MsU0FBTCxFQUFMLEVBQXVCO0FBQ25CO0FBQ0g7O0FBQ0QsWUFBTSxLQUFLMEMsOEJBQUwsRUFBTjtBQUNBLFlBQU01QixJQUFJLEdBQUcsTUFBTSxLQUFLSixVQUFMLEVBQW5COztBQUNBLFVBQUksQ0FBQ0ksSUFBTCxFQUFXO0FBQ1A7QUFDSDs7QUFDRCxZQUFNLEtBQUtBLElBQUwsRUFBTjtBQUNILEtBVmUsQ0FBaEI7QUFXSDs7QUE5SnFDLENBQTFDO0FBZ0tBbkIsY0FBYyxHQUFHOUMsVUFBVSxDQUFDLENBQ3hCc0MsV0FBVyxDQUFDd0UsVUFBWixFQUR3QixFQUV4QjlGLE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUN5RSxNQUFaLENBQW1CckUsT0FBTyxDQUFDc0UsaUJBQTNCLENBQUosQ0FGaUIsQ0FBRCxFQUd4QmxFLGNBSHdCLENBQTNCO0FBSUFULE9BQU8sQ0FBQ1MsY0FBUixHQUF5QkEsY0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xyXG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL2V4dGVuc2lvbnNcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uLy4uL2lvYy90eXBlc1wiKTtcclxuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xyXG5jb25zdCBTQU1QTEVfU0laRV9QRVJfSFVORFJFRCA9IDEwO1xyXG52YXIgUGVyc2lzdGVudFN0YXRlS2V5cztcclxuKGZ1bmN0aW9uIChQZXJzaXN0ZW50U3RhdGVLZXlzKSB7XHJcbiAgICBQZXJzaXN0ZW50U3RhdGVLZXlzW1wiU2hvd0Jhbm5lclwiXSA9IFwiU2hvd0Jhbm5lclwiO1xyXG4gICAgUGVyc2lzdGVudFN0YXRlS2V5c1tcIkRlYnVnZ2VyTGF1bmNoQ291bnRlclwiXSA9IFwiRGVidWdnZXJMYXVuY2hDb3VudGVyXCI7XHJcbiAgICBQZXJzaXN0ZW50U3RhdGVLZXlzW1wiRGVidWdnZXJMYXVuY2hUaHJlc2hvbGRDb3VudGVyXCJdID0gXCJEZWJ1Z2dlckxhdW5jaFRocmVzaG9sZENvdW50ZXJcIjtcclxuICAgIFBlcnNpc3RlbnRTdGF0ZUtleXNbXCJVc2VyU2VsZWN0ZWRcIl0gPSBcIkRlYnVnZ2VyVXNlclNlbGVjdGVkXCI7XHJcbn0pKFBlcnNpc3RlbnRTdGF0ZUtleXMgPSBleHBvcnRzLlBlcnNpc3RlbnRTdGF0ZUtleXMgfHwgKGV4cG9ydHMuUGVyc2lzdGVudFN0YXRlS2V5cyA9IHt9KSk7XHJcbmxldCBEZWJ1Z2dlckJhbm5lciA9IGNsYXNzIERlYnVnZ2VyQmFubmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2VDb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2VDb250YWluZXIgPSBzZXJ2aWNlQ29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vIERvbid0IGV2ZW4gYm90aGVyIGFkZGluZyBoYW5kbGVycyBpZiBiYW5uZXIgaGFzIGJlZW4gdHVybmVkIG9mZi5cclxuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICAvLyBcImVuYWJsZWRcIiBzdGF0ZVxyXG4gICAgaXNFbmFibGVkKCkge1xyXG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVBlcnNpc3RlbnRTdGF0ZUZhY3RvcnkpO1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFBlcnNpc3RlbnRTdGF0ZUtleXMuU2hvd0Jhbm5lcjtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IGZhY3RvcnkuY3JlYXRlR2xvYmFsUGVyc2lzdGVudFN0YXRlKGtleSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklQZXJzaXN0ZW50U3RhdGVGYWN0b3J5KTtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gUGVyc2lzdGVudFN0YXRlS2V5cy5TaG93QmFubmVyO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGZhY3RvcnkuY3JlYXRlR2xvYmFsUGVyc2lzdGVudFN0YXRlKGtleSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB5aWVsZCBzdGF0ZS51cGRhdGVWYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBzaG93aW5nIGJhbm5lclxyXG4gICAgc2hvdWxkU2hvdygpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKCkgfHwgdGhpcy5kaXNhYmxlZEluQ3VycmVudFNlc3Npb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoISh5aWVsZCB0aGlzLnBhc3NlZFRocmVzaG9sZCgpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVXNlclNlbGVjdGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwcFNoZWxsID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklBcHBsaWNhdGlvblNoZWxsKTtcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gJ0NhbiB5b3UgcGxlYXNlIHRha2UgMiBtaW51dGVzIHRvIHRlbGwgdXMgaG93IHRoZSBkZWJ1Z2dlciBpcyB3b3JraW5nIGZvciB5b3U/JztcclxuICAgICAgICAgICAgY29uc3QgeWVzID0gJ1llcywgdGFrZSBzdXJ2ZXkgbm93JztcclxuICAgICAgICAgICAgY29uc3Qgbm8gPSAnTm8gdGhhbmtzJztcclxuICAgICAgICAgICAgY29uc3QgbGF0ZXIgPSAnUmVtaW5kIG1lIGxhdGVyJztcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCBhcHBTaGVsbC5zaG93SW5mb3JtYXRpb25NZXNzYWdlKG1zZywgeWVzLCBubywgbGF0ZXIpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIHllczpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuYWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIG5vOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbi5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVkSW5DdXJyZW50U2Vzc2lvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWJ1Z2dlckxhdW5jaENvdW50ZXIgPSB5aWVsZCB0aGlzLmdldEdldERlYnVnZ2VyTGF1bmNoQ291bnRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBicm93c2VyID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklCcm93c2VyU2VydmljZSk7XHJcbiAgICAgICAgICAgIGJyb3dzZXIubGF1bmNoKGBodHRwczovL3d3dy5yZXNlYXJjaC5uZXQvci9ON0IyNVJWP249JHtkZWJ1Z2dlckxhdW5jaENvdW50ZXJ9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyB1c2VyIHNlbGVjdGlvblxyXG4gICAgaXNVc2VyU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlclNlbGVjdGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJTZWxlY3RlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklQZXJzaXN0ZW50U3RhdGVGYWN0b3J5KTtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gUGVyc2lzdGVudFN0YXRlS2V5cy5Vc2VyU2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gZmFjdG9yeS5jcmVhdGVHbG9iYWxQZXJzaXN0ZW50U3RhdGUoa2V5LCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBzdGF0ZS52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWUgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21TYW1wbGUgPSBydW50aW1lLmdldFJhbmRvbUludCgwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSByYW5kb21TYW1wbGUgPCBTQU1QTEVfU0laRV9QRVJfSFVORFJFRDtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnVwZGF0ZVZhbHVlKHNlbGVjdGVkKS5pZ25vcmVFcnJvcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVzZXJTZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBwZXJzaXN0ZW50IGNvdW50ZXJcclxuICAgIHBhc3NlZFRocmVzaG9sZCgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBbdGhyZXNob2xkLCBkZWJ1Z2dlckNvdW50ZXJdID0geWllbGQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXREZWJ1Z2dlckxhdW5jaFRocmVzaG9sZENvdW50ZXIoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R2V0RGVidWdnZXJMYXVuY2hDb3VudGVyKClcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWJ1Z2dlckNvdW50ZXIgPj0gdGhyZXNob2xkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaW5jcmVtZW50RGVidWdnZXJMYXVuY2hDb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVBlcnNpc3RlbnRTdGF0ZUZhY3RvcnkpO1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBQZXJzaXN0ZW50U3RhdGVLZXlzLkRlYnVnZ2VyTGF1bmNoQ291bnRlcjtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBmYWN0b3J5LmNyZWF0ZUdsb2JhbFBlcnNpc3RlbnRTdGF0ZShrZXksIDApO1xyXG4gICAgICAgICAgICB5aWVsZCBzdGF0ZS51cGRhdGVWYWx1ZShzdGF0ZS52YWx1ZSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0R2V0RGVidWdnZXJMYXVuY2hDb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVBlcnNpc3RlbnRTdGF0ZUZhY3RvcnkpO1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBQZXJzaXN0ZW50U3RhdGVLZXlzLkRlYnVnZ2VyTGF1bmNoQ291bnRlcjtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBmYWN0b3J5LmNyZWF0ZUdsb2JhbFBlcnNpc3RlbnRTdGF0ZShrZXksIDApO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXREZWJ1Z2dlckxhdW5jaFRocmVzaG9sZENvdW50ZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JUGVyc2lzdGVudFN0YXRlRmFjdG9yeSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFBlcnNpc3RlbnRTdGF0ZUtleXMuRGVidWdnZXJMYXVuY2hUaHJlc2hvbGRDb3VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGZhY3RvcnkuY3JlYXRlR2xvYmFsUGVyc2lzdGVudFN0YXRlKGtleSwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgaWYgKHN0YXRlLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWUgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21OdW1iZXIgPSBydW50aW1lLmdldFJhbmRvbUludCgxLCAxMSk7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBzdGF0ZS51cGRhdGVWYWx1ZShyYW5kb21OdW1iZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS52YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGRlYnVnZ2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcclxuICAgIGFkZENhbGxiYWNrKCkge1xyXG4gICAgICAgIGNvbnN0IGRlYnVnZ2VyU2VydmljZSA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JRGVidWdTZXJ2aWNlKTtcclxuICAgICAgICBjb25zdCBkaXNwb3NhYmxlID0gZGVidWdnZXJTZXJ2aWNlLm9uRGlkVGVybWluYXRlRGVidWdTZXNzaW9uKChlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IGNvbnN0YW50c18xLkRlYnVnZ2VyVHlwZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvZ2dlciA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JTG9nZ2VyKTtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMub25EaWRUZXJtaW5hdGVEZWJ1Z1Nlc3Npb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChleCA9PiBsb2dnZXIubG9nRXJyb3IoJ0Vycm9yIGluIGRlYnVnZ2VyIEJhbm5lcicsIGV4KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklEaXNwb3NhYmxlUmVnaXN0cnkpLnB1c2goZGlzcG9zYWJsZSk7XHJcbiAgICB9XHJcbiAgICBvbkRpZFRlcm1pbmF0ZURlYnVnU2Vzc2lvbigpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLmluY3JlbWVudERlYnVnZ2VyTGF1bmNoQ291bnRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBzaG93ID0geWllbGQgdGhpcy5zaG91bGRTaG93KCk7XHJcbiAgICAgICAgICAgIGlmICghc2hvdykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5EZWJ1Z2dlckJhbm5lciA9IF9fZGVjb3JhdGUoW1xyXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxyXG4gICAgX19wYXJhbSgwLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMy5JU2VydmljZUNvbnRhaW5lcikpXHJcbl0sIERlYnVnZ2VyQmFubmVyKTtcclxuZXhwb3J0cy5EZWJ1Z2dlckJhbm5lciA9IERlYnVnZ2VyQmFubmVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1iYW5uZXIuanMubWFwIl19