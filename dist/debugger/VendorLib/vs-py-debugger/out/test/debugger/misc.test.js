"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
}); // tslint:disable:no-suspicious-comment max-func-body-length no-invalid-this no-var-requires no-require-imports no-any

const path = require("path");

const vscode_debugadapter_testsupport_1 = require("vscode-debugadapter-testsupport");

const constants_1 = require("../../client/common/constants");

const constants_2 = require("../../client/common/platform/constants");

const misc_1 = require("../../client/common/utils/misc");

const constants_3 = require("../../client/debugger/constants");

const types_1 = require("../../client/debugger/types");

const common_1 = require("../common");

const initialize_1 = require("../initialize");

const constants_4 = require("./common/constants");

const debugClient_1 = require("./debugClient");

const debugFilesPath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'pythonFiles', 'debugging');
const EXPERIMENTAL_DEBUG_ADAPTER = path.join(__dirname, '..', '..', 'client', 'debugger', 'debugAdapter', 'main.js');
let testCounter = 0;
const testAdapterFilePath = EXPERIMENTAL_DEBUG_ADAPTER;
const debuggerType = constants_3.DebuggerTypeName;
suite(`Standard Debugging - Misc tests: ${debuggerType}`, () => {
  let debugClient;
  setup(function () {
    return __awaiter(this, void 0, void 0, function* () {
      if (!initialize_1.IS_MULTI_ROOT_TEST || !initialize_1.TEST_DEBUGGER) {
        this.skip();
      }

      yield new Promise(resolve => setTimeout(resolve, 1000));
      debugClient = createDebugAdapter();
      debugClient.defaultTimeout = constants_4.DEBUGGER_TIMEOUT;
      yield debugClient.start();
    });
  });
  teardown(() => __awaiter(void 0, void 0, void 0, function* () {
    // Wait for a second before starting another test (sometimes, sockets take a while to get closed).
    yield common_1.sleep(1000);

    try {
      yield debugClient.stop().catch(misc_1.noop); // tslint:disable-next-line:no-empty
    } catch (ex) {}

    yield common_1.sleep(1000);
  }));
  /**
   * Creates the debug adapter.
   * We do not need to support code coverage on AppVeyor, lets use the standard test adapter.
   * @returns {DebugClient}
   */

  function createDebugAdapter() {
    if (constants_2.IS_WINDOWS) {
      return new vscode_debugadapter_testsupport_1.DebugClient('node', testAdapterFilePath, debuggerType);
    } else {
      const coverageDirectory = path.join(constants_1.EXTENSION_ROOT_DIR, `debug_coverage${testCounter += 1}`);
      return new debugClient_1.DebugClientEx(testAdapterFilePath, debuggerType, coverageDirectory, {
        cwd: constants_1.EXTENSION_ROOT_DIR
      });
    }
  }

  function buildLaunchArgs(pythonFile, stopOnEntry = false, showReturnValue = false) {
    const env = {
      PYTHONPATH: constants_3.PTVSD_PATH
    }; // tslint:disable-next-line:no-unnecessary-local-variable

    const options = {
      program: path.join(debugFilesPath, pythonFile),
      cwd: debugFilesPath,
      stopOnEntry,
      showReturnValue,
      debugOptions: [types_1.DebugOptions.RedirectOutput],
      pythonPath: common_1.PYTHON_PATH,
      args: [],
      env,
      envFile: '',
      logToFile: false,
      type: debuggerType
    };
    return options;
  }

  test('Should run program to the end', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([debugClient.configurationSequence(), debugClient.launch(buildLaunchArgs('simplePrint.py', false)), debugClient.waitForEvent('initialized'), debugClient.waitForEvent('terminated')]);
  }));
  test('test stderr output for Python', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([debugClient.configurationSequence(), debugClient.launch(buildLaunchArgs('stdErrOutput.py', false)), debugClient.waitForEvent('initialized'), //TODO: ptvsd does not differentiate.
    debugClient.assertOutput('stderr', 'error output'), debugClient.waitForEvent('terminated')]);
  }));
  test('Test stdout output', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([debugClient.configurationSequence(), debugClient.launch(buildLaunchArgs('stdOutOutput.py', false)), debugClient.waitForEvent('initialized'), debugClient.assertOutput('stdout', 'normal output'), debugClient.waitForEvent('terminated')]);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pc2MudGVzdC5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwicGF0aCIsInJlcXVpcmUiLCJ2c2NvZGVfZGVidWdhZGFwdGVyX3Rlc3RzdXBwb3J0XzEiLCJjb25zdGFudHNfMSIsImNvbnN0YW50c18yIiwibWlzY18xIiwiY29uc3RhbnRzXzMiLCJ0eXBlc18xIiwiY29tbW9uXzEiLCJpbml0aWFsaXplXzEiLCJjb25zdGFudHNfNCIsImRlYnVnQ2xpZW50XzEiLCJkZWJ1Z0ZpbGVzUGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJFWFBFUklNRU5UQUxfREVCVUdfQURBUFRFUiIsInRlc3RDb3VudGVyIiwidGVzdEFkYXB0ZXJGaWxlUGF0aCIsImRlYnVnZ2VyVHlwZSIsIkRlYnVnZ2VyVHlwZU5hbWUiLCJzdWl0ZSIsImRlYnVnQ2xpZW50Iiwic2V0dXAiLCJJU19NVUxUSV9ST09UX1RFU1QiLCJURVNUX0RFQlVHR0VSIiwic2tpcCIsInNldFRpbWVvdXQiLCJjcmVhdGVEZWJ1Z0FkYXB0ZXIiLCJkZWZhdWx0VGltZW91dCIsIkRFQlVHR0VSX1RJTUVPVVQiLCJzdGFydCIsInRlYXJkb3duIiwic2xlZXAiLCJzdG9wIiwiY2F0Y2giLCJub29wIiwiZXgiLCJJU19XSU5ET1dTIiwiRGVidWdDbGllbnQiLCJjb3ZlcmFnZURpcmVjdG9yeSIsIkVYVEVOU0lPTl9ST09UX0RJUiIsIkRlYnVnQ2xpZW50RXgiLCJjd2QiLCJidWlsZExhdW5jaEFyZ3MiLCJweXRob25GaWxlIiwic3RvcE9uRW50cnkiLCJzaG93UmV0dXJuVmFsdWUiLCJlbnYiLCJQWVRIT05QQVRIIiwiUFRWU0RfUEFUSCIsIm9wdGlvbnMiLCJwcm9ncmFtIiwiZGVidWdPcHRpb25zIiwiRGVidWdPcHRpb25zIiwiUmVkaXJlY3RPdXRwdXQiLCJweXRob25QYXRoIiwiUFlUSE9OX1BBVEgiLCJhcmdzIiwiZW52RmlsZSIsImxvZ1RvRmlsZSIsInR5cGUiLCJ0ZXN0IiwiYWxsIiwiY29uZmlndXJhdGlvblNlcXVlbmNlIiwibGF1bmNoIiwid2FpdEZvckV2ZW50IiwiYXNzZXJ0T3V0cHV0Il0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFsQixFQUF5QjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CSyxLQUFuQixDQUFELENBQUo7QUFBa0MsT0FBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDOUYsYUFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFyQixHQUFzQyxJQUFJTixDQUFKLENBQU0sVUFBVUcsT0FBVixFQUFtQjtBQUFFQSxRQUFBQSxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFQO0FBQXdCLE9BQW5ELEVBQXFETyxJQUFyRCxDQUEwRFIsU0FBMUQsRUFBcUVLLFFBQXJFLENBQXRDO0FBQXVIOztBQUMvSUgsSUFBQUEsSUFBSSxDQUFDLENBQUNOLFNBQVMsR0FBR0EsU0FBUyxDQUFDYSxLQUFWLENBQWdCaEIsT0FBaEIsRUFBeUJDLFVBQVUsSUFBSSxFQUF2QyxDQUFiLEVBQXlEUyxJQUF6RCxFQUFELENBQUo7QUFDSCxHQUxNLENBQVA7QUFNSCxDQVBEOztBQVFBTyxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVYLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDLEUsQ0FDQTs7QUFDQSxNQUFNWSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLE1BQU1DLGlDQUFpQyxHQUFHRCxPQUFPLENBQUMsaUNBQUQsQ0FBakQ7O0FBQ0EsTUFBTUUsV0FBVyxHQUFHRixPQUFPLENBQUMsK0JBQUQsQ0FBM0I7O0FBQ0EsTUFBTUcsV0FBVyxHQUFHSCxPQUFPLENBQUMsd0NBQUQsQ0FBM0I7O0FBQ0EsTUFBTUksTUFBTSxHQUFHSixPQUFPLENBQUMsZ0NBQUQsQ0FBdEI7O0FBQ0EsTUFBTUssV0FBVyxHQUFHTCxPQUFPLENBQUMsaUNBQUQsQ0FBM0I7O0FBQ0EsTUFBTU0sT0FBTyxHQUFHTixPQUFPLENBQUMsNkJBQUQsQ0FBdkI7O0FBQ0EsTUFBTU8sUUFBUSxHQUFHUCxPQUFPLENBQUMsV0FBRCxDQUF4Qjs7QUFDQSxNQUFNUSxZQUFZLEdBQUdSLE9BQU8sQ0FBQyxlQUFELENBQTVCOztBQUNBLE1BQU1TLFdBQVcsR0FBR1QsT0FBTyxDQUFDLG9CQUFELENBQTNCOztBQUNBLE1BQU1VLGFBQWEsR0FBR1YsT0FBTyxDQUFDLGVBQUQsQ0FBN0I7O0FBQ0EsTUFBTVcsY0FBYyxHQUFHWixJQUFJLENBQUNhLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUE4QyxNQUE5QyxFQUFzRCxhQUF0RCxFQUFxRSxXQUFyRSxDQUF2QjtBQUNBLE1BQU1DLDBCQUEwQixHQUFHZixJQUFJLENBQUNhLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxRQUFqQyxFQUEyQyxVQUEzQyxFQUF1RCxjQUF2RCxFQUF1RSxTQUF2RSxDQUFuQztBQUNBLElBQUlFLFdBQVcsR0FBRyxDQUFsQjtBQUNBLE1BQU1DLG1CQUFtQixHQUFHRiwwQkFBNUI7QUFDQSxNQUFNRyxZQUFZLEdBQUdaLFdBQVcsQ0FBQ2EsZ0JBQWpDO0FBQ0FDLEtBQUssQ0FBRSxvQ0FBbUNGLFlBQWEsRUFBbEQsRUFBcUQsTUFBTTtBQUM1RCxNQUFJRyxXQUFKO0FBQ0FDLEVBQUFBLEtBQUssQ0FBQyxZQUFZO0FBQ2QsV0FBTzNDLFNBQVMsQ0FBQyxJQUFELEVBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ2hELFVBQUksQ0FBQzhCLFlBQVksQ0FBQ2Msa0JBQWQsSUFBb0MsQ0FBQ2QsWUFBWSxDQUFDZSxhQUF0RCxFQUFxRTtBQUNqRSxhQUFLQyxJQUFMO0FBQ0g7O0FBQ0QsWUFBTSxJQUFJekMsT0FBSixDQUFZQyxPQUFPLElBQUl5QyxVQUFVLENBQUN6QyxPQUFELEVBQVUsSUFBVixDQUFqQyxDQUFOO0FBQ0FvQyxNQUFBQSxXQUFXLEdBQUdNLGtCQUFrQixFQUFoQztBQUNBTixNQUFBQSxXQUFXLENBQUNPLGNBQVosR0FBNkJsQixXQUFXLENBQUNtQixnQkFBekM7QUFDQSxZQUFNUixXQUFXLENBQUNTLEtBQVosRUFBTjtBQUNILEtBUmUsQ0FBaEI7QUFTSCxHQVZJLENBQUw7QUFXQUMsRUFBQUEsUUFBUSxDQUFDLE1BQU1wRCxTQUFTLFNBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ3hEO0FBQ0EsVUFBTTZCLFFBQVEsQ0FBQ3dCLEtBQVQsQ0FBZSxJQUFmLENBQU47O0FBQ0EsUUFBSTtBQUNBLFlBQU1YLFdBQVcsQ0FBQ1ksSUFBWixHQUFtQkMsS0FBbkIsQ0FBeUI3QixNQUFNLENBQUM4QixJQUFoQyxDQUFOLENBREEsQ0FFQTtBQUNILEtBSEQsQ0FJQSxPQUFPQyxFQUFQLEVBQVcsQ0FBRzs7QUFDZCxVQUFNNUIsUUFBUSxDQUFDd0IsS0FBVCxDQUFlLElBQWYsQ0FBTjtBQUNILEdBVHVCLENBQWhCLENBQVI7QUFVQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQVNMLGtCQUFULEdBQThCO0FBQzFCLFFBQUl2QixXQUFXLENBQUNpQyxVQUFoQixFQUE0QjtBQUN4QixhQUFPLElBQUluQyxpQ0FBaUMsQ0FBQ29DLFdBQXRDLENBQWtELE1BQWxELEVBQTBEckIsbUJBQTFELEVBQStFQyxZQUEvRSxDQUFQO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsWUFBTXFCLGlCQUFpQixHQUFHdkMsSUFBSSxDQUFDYSxJQUFMLENBQVVWLFdBQVcsQ0FBQ3FDLGtCQUF0QixFQUEyQyxpQkFBZ0J4QixXQUFXLElBQUksQ0FBRSxFQUE1RSxDQUExQjtBQUNBLGFBQU8sSUFBSUwsYUFBYSxDQUFDOEIsYUFBbEIsQ0FBZ0N4QixtQkFBaEMsRUFBcURDLFlBQXJELEVBQW1FcUIsaUJBQW5FLEVBQXNGO0FBQUVHLFFBQUFBLEdBQUcsRUFBRXZDLFdBQVcsQ0FBQ3FDO0FBQW5CLE9BQXRGLENBQVA7QUFDSDtBQUNKOztBQUNELFdBQVNHLGVBQVQsQ0FBeUJDLFVBQXpCLEVBQXFDQyxXQUFXLEdBQUcsS0FBbkQsRUFBMERDLGVBQWUsR0FBRyxLQUE1RSxFQUFtRjtBQUMvRSxVQUFNQyxHQUFHLEdBQUc7QUFBRUMsTUFBQUEsVUFBVSxFQUFFMUMsV0FBVyxDQUFDMkM7QUFBMUIsS0FBWixDQUQrRSxDQUUvRTs7QUFDQSxVQUFNQyxPQUFPLEdBQUc7QUFDWkMsTUFBQUEsT0FBTyxFQUFFbkQsSUFBSSxDQUFDYSxJQUFMLENBQVVELGNBQVYsRUFBMEJnQyxVQUExQixDQURHO0FBRVpGLE1BQUFBLEdBQUcsRUFBRTlCLGNBRk87QUFHWmlDLE1BQUFBLFdBSFk7QUFJWkMsTUFBQUEsZUFKWTtBQUtaTSxNQUFBQSxZQUFZLEVBQUUsQ0FBQzdDLE9BQU8sQ0FBQzhDLFlBQVIsQ0FBcUJDLGNBQXRCLENBTEY7QUFNWkMsTUFBQUEsVUFBVSxFQUFFL0MsUUFBUSxDQUFDZ0QsV0FOVDtBQU9aQyxNQUFBQSxJQUFJLEVBQUUsRUFQTTtBQVFaVixNQUFBQSxHQVJZO0FBU1pXLE1BQUFBLE9BQU8sRUFBRSxFQVRHO0FBVVpDLE1BQUFBLFNBQVMsRUFBRSxLQVZDO0FBV1pDLE1BQUFBLElBQUksRUFBRTFDO0FBWE0sS0FBaEI7QUFhQSxXQUFPZ0MsT0FBUDtBQUNIOztBQUNEVyxFQUFBQSxJQUFJLENBQUMsK0JBQUQsRUFBa0MsTUFBTWxGLFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDckYsVUFBTUssT0FBTyxDQUFDOEUsR0FBUixDQUFZLENBQ2R6QyxXQUFXLENBQUMwQyxxQkFBWixFQURjLEVBRWQxQyxXQUFXLENBQUMyQyxNQUFaLENBQW1CckIsZUFBZSxDQUFDLGdCQUFELEVBQW1CLEtBQW5CLENBQWxDLENBRmMsRUFHZHRCLFdBQVcsQ0FBQzRDLFlBQVosQ0FBeUIsYUFBekIsQ0FIYyxFQUlkNUMsV0FBVyxDQUFDNEMsWUFBWixDQUF5QixZQUF6QixDQUpjLENBQVosQ0FBTjtBQU1ILEdBUG9ELENBQWpELENBQUo7QUFRQUosRUFBQUEsSUFBSSxDQUFDLCtCQUFELEVBQWtDLE1BQU1sRixTQUFTLFNBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ3JGLFVBQU1LLE9BQU8sQ0FBQzhFLEdBQVIsQ0FBWSxDQUNkekMsV0FBVyxDQUFDMEMscUJBQVosRUFEYyxFQUVkMUMsV0FBVyxDQUFDMkMsTUFBWixDQUFtQnJCLGVBQWUsQ0FBQyxpQkFBRCxFQUFvQixLQUFwQixDQUFsQyxDQUZjLEVBR2R0QixXQUFXLENBQUM0QyxZQUFaLENBQXlCLGFBQXpCLENBSGMsRUFJZDtBQUNBNUMsSUFBQUEsV0FBVyxDQUFDNkMsWUFBWixDQUF5QixRQUF6QixFQUFtQyxjQUFuQyxDQUxjLEVBTWQ3QyxXQUFXLENBQUM0QyxZQUFaLENBQXlCLFlBQXpCLENBTmMsQ0FBWixDQUFOO0FBUUgsR0FUb0QsQ0FBakQsQ0FBSjtBQVVBSixFQUFBQSxJQUFJLENBQUMsb0JBQUQsRUFBdUIsTUFBTWxGLFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDMUUsVUFBTUssT0FBTyxDQUFDOEUsR0FBUixDQUFZLENBQ2R6QyxXQUFXLENBQUMwQyxxQkFBWixFQURjLEVBRWQxQyxXQUFXLENBQUMyQyxNQUFaLENBQW1CckIsZUFBZSxDQUFDLGlCQUFELEVBQW9CLEtBQXBCLENBQWxDLENBRmMsRUFHZHRCLFdBQVcsQ0FBQzRDLFlBQVosQ0FBeUIsYUFBekIsQ0FIYyxFQUlkNUMsV0FBVyxDQUFDNkMsWUFBWixDQUF5QixRQUF6QixFQUFtQyxlQUFuQyxDQUpjLEVBS2Q3QyxXQUFXLENBQUM0QyxZQUFaLENBQXlCLFlBQXpCLENBTGMsQ0FBWixDQUFOO0FBT0gsR0FSeUMsQ0FBdEMsQ0FBSjtBQVNILENBbEZJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1zdXNwaWNpb3VzLWNvbW1lbnQgbWF4LWZ1bmMtYm9keS1sZW5ndGggbm8taW52YWxpZC10aGlzIG5vLXZhci1yZXF1aXJlcyBuby1yZXF1aXJlLWltcG9ydHMgbm8tYW55XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3QgdnNjb2RlX2RlYnVnYWRhcHRlcl90ZXN0c3VwcG9ydF8xID0gcmVxdWlyZShcInZzY29kZS1kZWJ1Z2FkYXB0ZXItdGVzdHN1cHBvcnRcIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vY29uc3RhbnRzXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3BsYXRmb3JtL2NvbnN0YW50c1wiKTtcclxuY29uc3QgbWlzY18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vdXRpbHMvbWlzY1wiKTtcclxuY29uc3QgY29uc3RhbnRzXzMgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2RlYnVnZ2VyL2NvbnN0YW50c1wiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvZGVidWdnZXIvdHlwZXNcIik7XHJcbmNvbnN0IGNvbW1vbl8xID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKTtcclxuY29uc3QgaW5pdGlhbGl6ZV8xID0gcmVxdWlyZShcIi4uL2luaXRpYWxpemVcIik7XHJcbmNvbnN0IGNvbnN0YW50c180ID0gcmVxdWlyZShcIi4vY29tbW9uL2NvbnN0YW50c1wiKTtcclxuY29uc3QgZGVidWdDbGllbnRfMSA9IHJlcXVpcmUoXCIuL2RlYnVnQ2xpZW50XCIpO1xyXG5jb25zdCBkZWJ1Z0ZpbGVzUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdzcmMnLCAndGVzdCcsICdweXRob25GaWxlcycsICdkZWJ1Z2dpbmcnKTtcclxuY29uc3QgRVhQRVJJTUVOVEFMX0RFQlVHX0FEQVBURVIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnY2xpZW50JywgJ2RlYnVnZ2VyJywgJ2RlYnVnQWRhcHRlcicsICdtYWluLmpzJyk7XHJcbmxldCB0ZXN0Q291bnRlciA9IDA7XHJcbmNvbnN0IHRlc3RBZGFwdGVyRmlsZVBhdGggPSBFWFBFUklNRU5UQUxfREVCVUdfQURBUFRFUjtcclxuY29uc3QgZGVidWdnZXJUeXBlID0gY29uc3RhbnRzXzMuRGVidWdnZXJUeXBlTmFtZTtcclxuc3VpdGUoYFN0YW5kYXJkIERlYnVnZ2luZyAtIE1pc2MgdGVzdHM6ICR7ZGVidWdnZXJUeXBlfWAsICgpID0+IHtcclxuICAgIGxldCBkZWJ1Z0NsaWVudDtcclxuICAgIHNldHVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoIWluaXRpYWxpemVfMS5JU19NVUxUSV9ST09UX1RFU1QgfHwgIWluaXRpYWxpemVfMS5URVNUX0RFQlVHR0VSKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpO1xyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudCA9IGNyZWF0ZURlYnVnQWRhcHRlcigpO1xyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudC5kZWZhdWx0VGltZW91dCA9IGNvbnN0YW50c180LkRFQlVHR0VSX1RJTUVPVVQ7XHJcbiAgICAgICAgICAgIHlpZWxkIGRlYnVnQ2xpZW50LnN0YXJ0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHRlYXJkb3duKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAvLyBXYWl0IGZvciBhIHNlY29uZCBiZWZvcmUgc3RhcnRpbmcgYW5vdGhlciB0ZXN0IChzb21ldGltZXMsIHNvY2tldHMgdGFrZSBhIHdoaWxlIHRvIGdldCBjbG9zZWQpLlxyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnNsZWVwKDEwMDApO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGRlYnVnQ2xpZW50LnN0b3AoKS5jYXRjaChtaXNjXzEubm9vcCk7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHsgfVxyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnNsZWVwKDEwMDApO1xyXG4gICAgfSkpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBkZWJ1ZyBhZGFwdGVyLlxyXG4gICAgICogV2UgZG8gbm90IG5lZWQgdG8gc3VwcG9ydCBjb2RlIGNvdmVyYWdlIG9uIEFwcFZleW9yLCBsZXRzIHVzZSB0aGUgc3RhbmRhcmQgdGVzdCBhZGFwdGVyLlxyXG4gICAgICogQHJldHVybnMge0RlYnVnQ2xpZW50fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVEZWJ1Z0FkYXB0ZXIoKSB7XHJcbiAgICAgICAgaWYgKGNvbnN0YW50c18yLklTX1dJTkRPV1MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyB2c2NvZGVfZGVidWdhZGFwdGVyX3Rlc3RzdXBwb3J0XzEuRGVidWdDbGllbnQoJ25vZGUnLCB0ZXN0QWRhcHRlckZpbGVQYXRoLCBkZWJ1Z2dlclR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY292ZXJhZ2VEaXJlY3RvcnkgPSBwYXRoLmpvaW4oY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCBgZGVidWdfY292ZXJhZ2Uke3Rlc3RDb3VudGVyICs9IDF9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgZGVidWdDbGllbnRfMS5EZWJ1Z0NsaWVudEV4KHRlc3RBZGFwdGVyRmlsZVBhdGgsIGRlYnVnZ2VyVHlwZSwgY292ZXJhZ2VEaXJlY3RvcnksIHsgY3dkOiBjb25zdGFudHNfMS5FWFRFTlNJT05fUk9PVF9ESVIgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYnVpbGRMYXVuY2hBcmdzKHB5dGhvbkZpbGUsIHN0b3BPbkVudHJ5ID0gZmFsc2UsIHNob3dSZXR1cm5WYWx1ZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgZW52ID0geyBQWVRIT05QQVRIOiBjb25zdGFudHNfMy5QVFZTRF9QQVRIIH07XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVubmVjZXNzYXJ5LWxvY2FsLXZhcmlhYmxlXHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcHJvZ3JhbTogcGF0aC5qb2luKGRlYnVnRmlsZXNQYXRoLCBweXRob25GaWxlKSxcclxuICAgICAgICAgICAgY3dkOiBkZWJ1Z0ZpbGVzUGF0aCxcclxuICAgICAgICAgICAgc3RvcE9uRW50cnksXHJcbiAgICAgICAgICAgIHNob3dSZXR1cm5WYWx1ZSxcclxuICAgICAgICAgICAgZGVidWdPcHRpb25zOiBbdHlwZXNfMS5EZWJ1Z09wdGlvbnMuUmVkaXJlY3RPdXRwdXRdLFxyXG4gICAgICAgICAgICBweXRob25QYXRoOiBjb21tb25fMS5QWVRIT05fUEFUSCxcclxuICAgICAgICAgICAgYXJnczogW10sXHJcbiAgICAgICAgICAgIGVudixcclxuICAgICAgICAgICAgZW52RmlsZTogJycsXHJcbiAgICAgICAgICAgIGxvZ1RvRmlsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHR5cGU6IGRlYnVnZ2VyVHlwZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcbiAgICB0ZXN0KCdTaG91bGQgcnVuIHByb2dyYW0gdG8gdGhlIGVuZCcsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LmNvbmZpZ3VyYXRpb25TZXF1ZW5jZSgpLFxyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudC5sYXVuY2goYnVpbGRMYXVuY2hBcmdzKCdzaW1wbGVQcmludC5weScsIGZhbHNlKSksXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LndhaXRGb3JFdmVudCgnaW5pdGlhbGl6ZWQnKSxcclxuICAgICAgICAgICAgZGVidWdDbGllbnQud2FpdEZvckV2ZW50KCd0ZXJtaW5hdGVkJylcclxuICAgICAgICBdKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ3Rlc3Qgc3RkZXJyIG91dHB1dCBmb3IgUHl0aG9uJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgZGVidWdDbGllbnQuY29uZmlndXJhdGlvblNlcXVlbmNlKCksXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LmxhdW5jaChidWlsZExhdW5jaEFyZ3MoJ3N0ZEVyck91dHB1dC5weScsIGZhbHNlKSksXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LndhaXRGb3JFdmVudCgnaW5pdGlhbGl6ZWQnKSxcclxuICAgICAgICAgICAgLy9UT0RPOiBwdHZzZCBkb2VzIG5vdCBkaWZmZXJlbnRpYXRlLlxyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudC5hc3NlcnRPdXRwdXQoJ3N0ZGVycicsICdlcnJvciBvdXRwdXQnKSxcclxuICAgICAgICAgICAgZGVidWdDbGllbnQud2FpdEZvckV2ZW50KCd0ZXJtaW5hdGVkJylcclxuICAgICAgICBdKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ1Rlc3Qgc3Rkb3V0IG91dHB1dCcsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LmNvbmZpZ3VyYXRpb25TZXF1ZW5jZSgpLFxyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudC5sYXVuY2goYnVpbGRMYXVuY2hBcmdzKCdzdGRPdXRPdXRwdXQucHknLCBmYWxzZSkpLFxyXG4gICAgICAgICAgICBkZWJ1Z0NsaWVudC53YWl0Rm9yRXZlbnQoJ2luaXRpYWxpemVkJyksXHJcbiAgICAgICAgICAgIGRlYnVnQ2xpZW50LmFzc2VydE91dHB1dCgnc3Rkb3V0JywgJ25vcm1hbCBvdXRwdXQnKSxcclxuICAgICAgICAgICAgZGVidWdDbGllbnQud2FpdEZvckV2ZW50KCd0ZXJtaW5hdGVkJylcclxuICAgICAgICBdKTtcclxuICAgIH0pKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pc2MudGVzdC5qcy5tYXAiXX0=