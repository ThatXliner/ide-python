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
});

const assert = require("assert");

const fs = require("fs-extra");

const os_1 = require("os");

const path = require("path");

const vscode_1 = require("vscode");

const constants_1 = require("../../../client/common/constants");

const types_1 = require("../../../client/common/process/types");

const constants_2 = require("../../../client/unittests/common/constants");

const types_2 = require("../../../client/unittests/common/types");

const common_1 = require("../../common");

const serviceRegistry_1 = require("../serviceRegistry");

const initialize_1 = require("./../../initialize");

const testFilesPath = path.join(constants_1.EXTENSION_ROOT_DIR, 'src', 'test', 'pythonFiles', 'testFiles');
const UNITTEST_TEST_FILES_PATH = path.join(testFilesPath, 'standard');
const UNITTEST_SINGLE_TEST_FILE_PATH = path.join(testFilesPath, 'single');
const unitTestTestFilesCwdPath = path.join(testFilesPath, 'cwd', 'src');
const defaultUnitTestArgs = ['-v', '-s', '.', '-p', '*test*.py']; // tslint:disable-next-line:max-func-body-length

suite('Unit Tests - unittest - discovery with mocked process output', () => {
  let ioc;
  const rootDirectory = UNITTEST_TEST_FILES_PATH;
  const configTarget = initialize_1.IS_MULTI_ROOT_TEST ? vscode_1.ConfigurationTarget.WorkspaceFolder : vscode_1.ConfigurationTarget.Workspace;
  suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initialize_1.initialize();
    yield common_1.updateSetting('unitTest.unittestArgs', defaultUnitTestArgs, common_1.rootWorkspaceUri, configTarget);
  }));
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    const cachePath = path.join(UNITTEST_TEST_FILES_PATH, '.cache');

    if (yield fs.pathExists(cachePath)) {
      yield fs.remove(cachePath);
    }

    yield initialize_1.initializeTest();
    initializeDI();
  }));
  teardown(() => __awaiter(void 0, void 0, void 0, function* () {
    ioc.dispose();
    yield common_1.updateSetting('unitTest.unittestArgs', defaultUnitTestArgs, common_1.rootWorkspaceUri, configTarget);
  }));

  function initializeDI() {
    ioc = new serviceRegistry_1.UnitTestIocContainer();
    ioc.registerCommonTypes();
    ioc.registerVariableTypes();
    ioc.registerUnitTestTypes(); // Mocks.

    ioc.registerMockProcessTypes();
  }

  function injectTestDiscoveryOutput(output) {
    return __awaiter(this, void 0, void 0, function* () {
      const procService = yield ioc.serviceContainer.get(types_1.IProcessServiceFactory).create();
      procService.onExecObservable((file, args, options, callback) => {
        if (args.length > 1 && args[0] === '-c' && args[1].includes('import unittest') && args[1].includes('loader = unittest.TestLoader()')) {
          callback({
            // Ensure any spaces added during code formatting or the like are removed.
            out: output.split(/\r?\n/g).map(item => item.trim()).join(os_1.EOL),
            source: 'stdout'
          });
        }
      });
    });
  }

  test('Discover Tests (single test file)', () => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.updateSetting('unitTest.unittestArgs', ['-s=./tests', '-p=test_*.py'], common_1.rootWorkspaceUri, configTarget); // tslint:disable-next-line:no-multiline-string

    yield injectTestDiscoveryOutput(`start
    test_one.Test_test1.test_A
    test_one.Test_test1.test_B
    test_one.Test_test1.test_c
    `);
    const factory = ioc.serviceContainer.get(types_2.ITestManagerFactory);
    const testManager = factory('unittest', common_1.rootWorkspaceUri, UNITTEST_SINGLE_TEST_FILE_PATH);
    const tests = yield testManager.discoverTests(constants_2.CommandSource.ui, true, true);
    assert.equal(tests.testFiles.length, 1, 'Incorrect number of test files');
    assert.equal(tests.testFunctions.length, 3, 'Incorrect number of test functions');
    assert.equal(tests.testSuites.length, 1, 'Incorrect number of test suites');
    assert.equal(tests.testFiles.some(t => t.name === 'test_one.py' && t.nameToRun === 'test_one.Test_test1.test_A'), true, 'Test File not found');
  }));
  test('Discover Tests', () => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.updateSetting('unitTest.unittestArgs', ['-s=./tests', '-p=test_*.py'], common_1.rootWorkspaceUri, configTarget); // tslint:disable-next-line:no-multiline-string

    yield injectTestDiscoveryOutput(`start
    test_unittest_one.Test_test1.test_A
    test_unittest_one.Test_test1.test_B
    test_unittest_one.Test_test1.test_c
    test_unittest_two.Test_test2.test_A2
    test_unittest_two.Test_test2.test_B2
    test_unittest_two.Test_test2.test_C2
    test_unittest_two.Test_test2.test_D2
    test_unittest_two.Test_test2a.test_222A2
    test_unittest_two.Test_test2a.test_222B2
    `);
    const factory = ioc.serviceContainer.get(types_2.ITestManagerFactory);
    const testManager = factory('unittest', common_1.rootWorkspaceUri, rootDirectory);
    const tests = yield testManager.discoverTests(constants_2.CommandSource.ui, true, true);
    assert.equal(tests.testFiles.length, 2, 'Incorrect number of test files');
    assert.equal(tests.testFunctions.length, 9, 'Incorrect number of test functions');
    assert.equal(tests.testSuites.length, 3, 'Incorrect number of test suites');
    assert.equal(tests.testFiles.some(t => t.name === 'test_unittest_one.py' && t.nameToRun === 'test_unittest_one.Test_test1.test_A'), true, 'Test File not found');
    assert.equal(tests.testFiles.some(t => t.name === 'test_unittest_two.py' && t.nameToRun === 'test_unittest_two.Test_test2.test_A2'), true, 'Test File not found');
  }));
  test('Discover Tests (pattern = *_test_*.py)', () => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.updateSetting('unitTest.unittestArgs', ['-s=./tests', '-p=*_test*.py'], common_1.rootWorkspaceUri, configTarget); // tslint:disable-next-line:no-multiline-string

    yield injectTestDiscoveryOutput(`start
    unittest_three_test.Test_test3.test_A
    unittest_three_test.Test_test3.test_B
    `);
    const factory = ioc.serviceContainer.get(types_2.ITestManagerFactory);
    const testManager = factory('unittest', common_1.rootWorkspaceUri, rootDirectory);
    const tests = yield testManager.discoverTests(constants_2.CommandSource.ui, true, true);
    assert.equal(tests.testFiles.length, 1, 'Incorrect number of test files');
    assert.equal(tests.testFunctions.length, 2, 'Incorrect number of test functions');
    assert.equal(tests.testSuites.length, 1, 'Incorrect number of test suites');
    assert.equal(tests.testFiles.some(t => t.name === 'unittest_three_test.py' && t.nameToRun === 'unittest_three_test.Test_test3.test_A'), true, 'Test File not found');
  }));
  test('Setting cwd should return tests', () => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.updateSetting('unitTest.unittestArgs', ['-s=./tests', '-p=test_*.py'], common_1.rootWorkspaceUri, configTarget); // tslint:disable-next-line:no-multiline-string

    yield injectTestDiscoveryOutput(`start
    test_cwd.Test_Current_Working_Directory.test_cwd
    `);
    const factory = ioc.serviceContainer.get(types_2.ITestManagerFactory);
    const testManager = factory('unittest', common_1.rootWorkspaceUri, unitTestTestFilesCwdPath);
    const tests = yield testManager.discoverTests(constants_2.CommandSource.ui, true, true);
    assert.equal(tests.testFiles.length, 1, 'Incorrect number of test files');
    assert.equal(tests.testFolders.length, 1, 'Incorrect number of test folders');
    assert.equal(tests.testFunctions.length, 1, 'Incorrect number of test functions');
    assert.equal(tests.testSuites.length, 1, 'Incorrect number of test suites');
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuaXR0ZXN0LmRpc2NvdmVyeS50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJhc3NlcnQiLCJyZXF1aXJlIiwiZnMiLCJvc18xIiwicGF0aCIsInZzY29kZV8xIiwiY29uc3RhbnRzXzEiLCJ0eXBlc18xIiwiY29uc3RhbnRzXzIiLCJ0eXBlc18yIiwiY29tbW9uXzEiLCJzZXJ2aWNlUmVnaXN0cnlfMSIsImluaXRpYWxpemVfMSIsInRlc3RGaWxlc1BhdGgiLCJqb2luIiwiRVhURU5TSU9OX1JPT1RfRElSIiwiVU5JVFRFU1RfVEVTVF9GSUxFU19QQVRIIiwiVU5JVFRFU1RfU0lOR0xFX1RFU1RfRklMRV9QQVRIIiwidW5pdFRlc3RUZXN0RmlsZXNDd2RQYXRoIiwiZGVmYXVsdFVuaXRUZXN0QXJncyIsInN1aXRlIiwiaW9jIiwicm9vdERpcmVjdG9yeSIsImNvbmZpZ1RhcmdldCIsIklTX01VTFRJX1JPT1RfVEVTVCIsIkNvbmZpZ3VyYXRpb25UYXJnZXQiLCJXb3Jrc3BhY2VGb2xkZXIiLCJXb3Jrc3BhY2UiLCJzdWl0ZVNldHVwIiwiaW5pdGlhbGl6ZSIsInVwZGF0ZVNldHRpbmciLCJyb290V29ya3NwYWNlVXJpIiwic2V0dXAiLCJjYWNoZVBhdGgiLCJwYXRoRXhpc3RzIiwicmVtb3ZlIiwiaW5pdGlhbGl6ZVRlc3QiLCJpbml0aWFsaXplREkiLCJ0ZWFyZG93biIsImRpc3Bvc2UiLCJVbml0VGVzdElvY0NvbnRhaW5lciIsInJlZ2lzdGVyQ29tbW9uVHlwZXMiLCJyZWdpc3RlclZhcmlhYmxlVHlwZXMiLCJyZWdpc3RlclVuaXRUZXN0VHlwZXMiLCJyZWdpc3Rlck1vY2tQcm9jZXNzVHlwZXMiLCJpbmplY3RUZXN0RGlzY292ZXJ5T3V0cHV0Iiwib3V0cHV0IiwicHJvY1NlcnZpY2UiLCJzZXJ2aWNlQ29udGFpbmVyIiwiZ2V0IiwiSVByb2Nlc3NTZXJ2aWNlRmFjdG9yeSIsImNyZWF0ZSIsIm9uRXhlY09ic2VydmFibGUiLCJmaWxlIiwiYXJncyIsIm9wdGlvbnMiLCJjYWxsYmFjayIsImxlbmd0aCIsImluY2x1ZGVzIiwib3V0Iiwic3BsaXQiLCJtYXAiLCJpdGVtIiwidHJpbSIsIkVPTCIsInNvdXJjZSIsInRlc3QiLCJmYWN0b3J5IiwiSVRlc3RNYW5hZ2VyRmFjdG9yeSIsInRlc3RNYW5hZ2VyIiwidGVzdHMiLCJkaXNjb3ZlclRlc3RzIiwiQ29tbWFuZFNvdXJjZSIsInVpIiwiZXF1YWwiLCJ0ZXN0RmlsZXMiLCJ0ZXN0RnVuY3Rpb25zIiwidGVzdFN1aXRlcyIsInNvbWUiLCJ0IiwibmFtZSIsIm5hbWVUb1J1biIsInRlc3RGb2xkZXJzIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFs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QzJELG1CQUFqQyxDQUFoQjtBQUNBLFVBQU1DLFdBQVcsR0FBR0YsT0FBTyxDQUFDLFVBQUQsRUFBYXpELFFBQVEsQ0FBQ3FCLGdCQUF0QixFQUF3Q2Isd0JBQXhDLENBQTNCO0FBQ0EsVUFBTW9ELEtBQUssR0FBRyxNQUFNRCxXQUFXLENBQUNFLGFBQVosQ0FBMEIvRCxXQUFXLENBQUNnRSxhQUFaLENBQTBCQyxFQUFwRCxFQUF3RCxJQUF4RCxFQUE4RCxJQUE5RCxDQUFwQjtBQUNBekUsSUFBQUEsTUFBTSxDQUFDMEUsS0FBUCxDQUFhSixLQUFLLENBQUNLLFNBQU4sQ0FBZ0JsQixNQUE3QixFQUFxQyxDQUFyQyxFQUF3QyxnQ0FBeEM7QUFDQXpELElBQUFBLE1BQU0sQ0FBQzBFLEtBQVAsQ0FBYUosS0FBSyxDQUFDWSxXQUFOLENBQWtCekIsTUFBL0IsRUFBdUMsQ0FBdkMsRUFBMEMsa0NBQTFDO0FBQ0F6RCxJQUFBQSxNQUFNLENBQUMwRSxLQUFQLENBQWFKLEtBQUssQ0FBQ00sYUFBTixDQUFvQm5CLE1BQWpDLEVBQXlDLENBQXpDLEVBQTRDLG9DQUE1QztBQUNBekQsSUFBQUEsTUFBTSxDQUFDMEUsS0FBUCxDQUFhSixLQUFLLENBQUNPLFVBQU4sQ0FBaUJwQixNQUE5QixFQUFzQyxDQUF0QyxFQUF5QyxpQ0FBekM7QUFDSCxHQWJzRCxDQUFuRCxDQUFKO0FBY0gsQ0E5R0ksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIik7XHJcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzLWV4dHJhXCIpO1xyXG5jb25zdCBvc18xID0gcmVxdWlyZShcIm9zXCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IHZzY29kZV8xID0gcmVxdWlyZShcInZzY29kZVwiKTtcclxuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L2NvbW1vbi9jb25zdGFudHNcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L2NvbW1vbi9wcm9jZXNzL3R5cGVzXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvdW5pdHRlc3RzL2NvbW1vbi9jb25zdGFudHNcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L3VuaXR0ZXN0cy9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IGNvbW1vbl8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vblwiKTtcclxuY29uc3Qgc2VydmljZVJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi4vc2VydmljZVJlZ2lzdHJ5XCIpO1xyXG5jb25zdCBpbml0aWFsaXplXzEgPSByZXF1aXJlKFwiLi8uLi8uLi9pbml0aWFsaXplXCIpO1xyXG5jb25zdCB0ZXN0RmlsZXNQYXRoID0gcGF0aC5qb2luKGNvbnN0YW50c18xLkVYVEVOU0lPTl9ST09UX0RJUiwgJ3NyYycsICd0ZXN0JywgJ3B5dGhvbkZpbGVzJywgJ3Rlc3RGaWxlcycpO1xyXG5jb25zdCBVTklUVEVTVF9URVNUX0ZJTEVTX1BBVEggPSBwYXRoLmpvaW4odGVzdEZpbGVzUGF0aCwgJ3N0YW5kYXJkJyk7XHJcbmNvbnN0IFVOSVRURVNUX1NJTkdMRV9URVNUX0ZJTEVfUEFUSCA9IHBhdGguam9pbih0ZXN0RmlsZXNQYXRoLCAnc2luZ2xlJyk7XHJcbmNvbnN0IHVuaXRUZXN0VGVzdEZpbGVzQ3dkUGF0aCA9IHBhdGguam9pbih0ZXN0RmlsZXNQYXRoLCAnY3dkJywgJ3NyYycpO1xyXG5jb25zdCBkZWZhdWx0VW5pdFRlc3RBcmdzID0gW1xyXG4gICAgJy12JyxcclxuICAgICctcycsXHJcbiAgICAnLicsXHJcbiAgICAnLXAnLFxyXG4gICAgJyp0ZXN0Ki5weSdcclxuXTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbnN1aXRlKCdVbml0IFRlc3RzIC0gdW5pdHRlc3QgLSBkaXNjb3Zlcnkgd2l0aCBtb2NrZWQgcHJvY2VzcyBvdXRwdXQnLCAoKSA9PiB7XHJcbiAgICBsZXQgaW9jO1xyXG4gICAgY29uc3Qgcm9vdERpcmVjdG9yeSA9IFVOSVRURVNUX1RFU1RfRklMRVNfUEFUSDtcclxuICAgIGNvbnN0IGNvbmZpZ1RhcmdldCA9IGluaXRpYWxpemVfMS5JU19NVUxUSV9ST09UX1RFU1QgPyB2c2NvZGVfMS5Db25maWd1cmF0aW9uVGFyZ2V0LldvcmtzcGFjZUZvbGRlciA6IHZzY29kZV8xLkNvbmZpZ3VyYXRpb25UYXJnZXQuV29ya3NwYWNlO1xyXG4gICAgc3VpdGVTZXR1cCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgeWllbGQgaW5pdGlhbGl6ZV8xLmluaXRpYWxpemUoKTtcclxuICAgICAgICB5aWVsZCBjb21tb25fMS51cGRhdGVTZXR0aW5nKCd1bml0VGVzdC51bml0dGVzdEFyZ3MnLCBkZWZhdWx0VW5pdFRlc3RBcmdzLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCBjb25maWdUYXJnZXQpO1xyXG4gICAgfSkpO1xyXG4gICAgc2V0dXAoKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IHBhdGguam9pbihVTklUVEVTVF9URVNUX0ZJTEVTX1BBVEgsICcuY2FjaGUnKTtcclxuICAgICAgICBpZiAoeWllbGQgZnMucGF0aEV4aXN0cyhjYWNoZVBhdGgpKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGZzLnJlbW92ZShjYWNoZVBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB5aWVsZCBpbml0aWFsaXplXzEuaW5pdGlhbGl6ZVRlc3QoKTtcclxuICAgICAgICBpbml0aWFsaXplREkoKTtcclxuICAgIH0pKTtcclxuICAgIHRlYXJkb3duKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpb2MuZGlzcG9zZSgpO1xyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnVwZGF0ZVNldHRpbmcoJ3VuaXRUZXN0LnVuaXR0ZXN0QXJncycsIGRlZmF1bHRVbml0VGVzdEFyZ3MsIGNvbW1vbl8xLnJvb3RXb3Jrc3BhY2VVcmksIGNvbmZpZ1RhcmdldCk7XHJcbiAgICB9KSk7XHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplREkoKSB7XHJcbiAgICAgICAgaW9jID0gbmV3IHNlcnZpY2VSZWdpc3RyeV8xLlVuaXRUZXN0SW9jQ29udGFpbmVyKCk7XHJcbiAgICAgICAgaW9jLnJlZ2lzdGVyQ29tbW9uVHlwZXMoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJWYXJpYWJsZVR5cGVzKCk7XHJcbiAgICAgICAgaW9jLnJlZ2lzdGVyVW5pdFRlc3RUeXBlcygpO1xyXG4gICAgICAgIC8vIE1vY2tzLlxyXG4gICAgICAgIGlvYy5yZWdpc3Rlck1vY2tQcm9jZXNzVHlwZXMoKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGluamVjdFRlc3REaXNjb3ZlcnlPdXRwdXQob3V0cHV0KSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvY1NlcnZpY2UgPSB5aWVsZCBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JUHJvY2Vzc1NlcnZpY2VGYWN0b3J5KS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcHJvY1NlcnZpY2Uub25FeGVjT2JzZXJ2YWJsZSgoZmlsZSwgYXJncywgb3B0aW9ucywgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDEgJiYgYXJnc1swXSA9PT0gJy1jJyAmJiBhcmdzWzFdLmluY2x1ZGVzKCdpbXBvcnQgdW5pdHRlc3QnKSAmJiBhcmdzWzFdLmluY2x1ZGVzKCdsb2FkZXIgPSB1bml0dGVzdC5UZXN0TG9hZGVyKCknKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIGFueSBzcGFjZXMgYWRkZWQgZHVyaW5nIGNvZGUgZm9ybWF0dGluZyBvciB0aGUgbGlrZSBhcmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0OiBvdXRwdXQuc3BsaXQoL1xccj9cXG4vZykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpLmpvaW4ob3NfMS5FT0wpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICdzdGRvdXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGVzdCgnRGlzY292ZXIgVGVzdHMgKHNpbmdsZSB0ZXN0IGZpbGUpJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnVwZGF0ZVNldHRpbmcoJ3VuaXRUZXN0LnVuaXR0ZXN0QXJncycsIFsnLXM9Li90ZXN0cycsICctcD10ZXN0XyoucHknXSwgY29tbW9uXzEucm9vdFdvcmtzcGFjZVVyaSwgY29uZmlnVGFyZ2V0KTtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tbXVsdGlsaW5lLXN0cmluZ1xyXG4gICAgICAgIHlpZWxkIGluamVjdFRlc3REaXNjb3ZlcnlPdXRwdXQoYHN0YXJ0XHJcbiAgICB0ZXN0X29uZS5UZXN0X3Rlc3QxLnRlc3RfQVxyXG4gICAgdGVzdF9vbmUuVGVzdF90ZXN0MS50ZXN0X0JcclxuICAgIHRlc3Rfb25lLlRlc3RfdGVzdDEudGVzdF9jXHJcbiAgICBgKTtcclxuICAgICAgICBjb25zdCBmYWN0b3J5ID0gaW9jLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVRlc3RNYW5hZ2VyRmFjdG9yeSk7XHJcbiAgICAgICAgY29uc3QgdGVzdE1hbmFnZXIgPSBmYWN0b3J5KCd1bml0dGVzdCcsIGNvbW1vbl8xLnJvb3RXb3Jrc3BhY2VVcmksIFVOSVRURVNUX1NJTkdMRV9URVNUX0ZJTEVfUEFUSCk7XHJcbiAgICAgICAgY29uc3QgdGVzdHMgPSB5aWVsZCB0ZXN0TWFuYWdlci5kaXNjb3ZlclRlc3RzKGNvbnN0YW50c18yLkNvbW1hbmRTb3VyY2UudWksIHRydWUsIHRydWUpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0RmlsZXMubGVuZ3RoLCAxLCAnSW5jb3JyZWN0IG51bWJlciBvZiB0ZXN0IGZpbGVzJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRlc3RzLnRlc3RGdW5jdGlvbnMubGVuZ3RoLCAzLCAnSW5jb3JyZWN0IG51bWJlciBvZiB0ZXN0IGZ1bmN0aW9ucycpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0U3VpdGVzLmxlbmd0aCwgMSwgJ0luY29ycmVjdCBudW1iZXIgb2YgdGVzdCBzdWl0ZXMnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGVzdHMudGVzdEZpbGVzLnNvbWUodCA9PiB0Lm5hbWUgPT09ICd0ZXN0X29uZS5weScgJiYgdC5uYW1lVG9SdW4gPT09ICd0ZXN0X29uZS5UZXN0X3Rlc3QxLnRlc3RfQScpLCB0cnVlLCAnVGVzdCBGaWxlIG5vdCBmb3VuZCcpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRGlzY292ZXIgVGVzdHMnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgeWllbGQgY29tbW9uXzEudXBkYXRlU2V0dGluZygndW5pdFRlc3QudW5pdHRlc3RBcmdzJywgWyctcz0uL3Rlc3RzJywgJy1wPXRlc3RfKi5weSddLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCBjb25maWdUYXJnZXQpO1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1tdWx0aWxpbmUtc3RyaW5nXHJcbiAgICAgICAgeWllbGQgaW5qZWN0VGVzdERpc2NvdmVyeU91dHB1dChgc3RhcnRcclxuICAgIHRlc3RfdW5pdHRlc3Rfb25lLlRlc3RfdGVzdDEudGVzdF9BXHJcbiAgICB0ZXN0X3VuaXR0ZXN0X29uZS5UZXN0X3Rlc3QxLnRlc3RfQlxyXG4gICAgdGVzdF91bml0dGVzdF9vbmUuVGVzdF90ZXN0MS50ZXN0X2NcclxuICAgIHRlc3RfdW5pdHRlc3RfdHdvLlRlc3RfdGVzdDIudGVzdF9BMlxyXG4gICAgdGVzdF91bml0dGVzdF90d28uVGVzdF90ZXN0Mi50ZXN0X0IyXHJcbiAgICB0ZXN0X3VuaXR0ZXN0X3R3by5UZXN0X3Rlc3QyLnRlc3RfQzJcclxuICAgIHRlc3RfdW5pdHRlc3RfdHdvLlRlc3RfdGVzdDIudGVzdF9EMlxyXG4gICAgdGVzdF91bml0dGVzdF90d28uVGVzdF90ZXN0MmEudGVzdF8yMjJBMlxyXG4gICAgdGVzdF91bml0dGVzdF90d28uVGVzdF90ZXN0MmEudGVzdF8yMjJCMlxyXG4gICAgYCk7XHJcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IGlvYy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklUZXN0TWFuYWdlckZhY3RvcnkpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RNYW5hZ2VyID0gZmFjdG9yeSgndW5pdHRlc3QnLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCByb290RGlyZWN0b3J5KTtcclxuICAgICAgICBjb25zdCB0ZXN0cyA9IHlpZWxkIHRlc3RNYW5hZ2VyLmRpc2NvdmVyVGVzdHMoY29uc3RhbnRzXzIuQ29tbWFuZFNvdXJjZS51aSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRlc3RzLnRlc3RGaWxlcy5sZW5ndGgsIDIsICdJbmNvcnJlY3QgbnVtYmVyIG9mIHRlc3QgZmlsZXMnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGVzdHMudGVzdEZ1bmN0aW9ucy5sZW5ndGgsIDksICdJbmNvcnJlY3QgbnVtYmVyIG9mIHRlc3QgZnVuY3Rpb25zJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRlc3RzLnRlc3RTdWl0ZXMubGVuZ3RoLCAzLCAnSW5jb3JyZWN0IG51bWJlciBvZiB0ZXN0IHN1aXRlcycpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0RmlsZXMuc29tZSh0ID0+IHQubmFtZSA9PT0gJ3Rlc3RfdW5pdHRlc3Rfb25lLnB5JyAmJiB0Lm5hbWVUb1J1biA9PT0gJ3Rlc3RfdW5pdHRlc3Rfb25lLlRlc3RfdGVzdDEudGVzdF9BJyksIHRydWUsICdUZXN0IEZpbGUgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRlc3RzLnRlc3RGaWxlcy5zb21lKHQgPT4gdC5uYW1lID09PSAndGVzdF91bml0dGVzdF90d28ucHknICYmIHQubmFtZVRvUnVuID09PSAndGVzdF91bml0dGVzdF90d28uVGVzdF90ZXN0Mi50ZXN0X0EyJyksIHRydWUsICdUZXN0IEZpbGUgbm90IGZvdW5kJyk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdEaXNjb3ZlciBUZXN0cyAocGF0dGVybiA9ICpfdGVzdF8qLnB5KScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBjb21tb25fMS51cGRhdGVTZXR0aW5nKCd1bml0VGVzdC51bml0dGVzdEFyZ3MnLCBbJy1zPS4vdGVzdHMnLCAnLXA9Kl90ZXN0Ki5weSddLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCBjb25maWdUYXJnZXQpO1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1tdWx0aWxpbmUtc3RyaW5nXHJcbiAgICAgICAgeWllbGQgaW5qZWN0VGVzdERpc2NvdmVyeU91dHB1dChgc3RhcnRcclxuICAgIHVuaXR0ZXN0X3RocmVlX3Rlc3QuVGVzdF90ZXN0My50ZXN0X0FcclxuICAgIHVuaXR0ZXN0X3RocmVlX3Rlc3QuVGVzdF90ZXN0My50ZXN0X0JcclxuICAgIGApO1xyXG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JVGVzdE1hbmFnZXJGYWN0b3J5KTtcclxuICAgICAgICBjb25zdCB0ZXN0TWFuYWdlciA9IGZhY3RvcnkoJ3VuaXR0ZXN0JywgY29tbW9uXzEucm9vdFdvcmtzcGFjZVVyaSwgcm9vdERpcmVjdG9yeSk7XHJcbiAgICAgICAgY29uc3QgdGVzdHMgPSB5aWVsZCB0ZXN0TWFuYWdlci5kaXNjb3ZlclRlc3RzKGNvbnN0YW50c18yLkNvbW1hbmRTb3VyY2UudWksIHRydWUsIHRydWUpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0RmlsZXMubGVuZ3RoLCAxLCAnSW5jb3JyZWN0IG51bWJlciBvZiB0ZXN0IGZpbGVzJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRlc3RzLnRlc3RGdW5jdGlvbnMubGVuZ3RoLCAyLCAnSW5jb3JyZWN0IG51bWJlciBvZiB0ZXN0IGZ1bmN0aW9ucycpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0U3VpdGVzLmxlbmd0aCwgMSwgJ0luY29ycmVjdCBudW1iZXIgb2YgdGVzdCBzdWl0ZXMnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGVzdHMudGVzdEZpbGVzLnNvbWUodCA9PiB0Lm5hbWUgPT09ICd1bml0dGVzdF90aHJlZV90ZXN0LnB5JyAmJiB0Lm5hbWVUb1J1biA9PT0gJ3VuaXR0ZXN0X3RocmVlX3Rlc3QuVGVzdF90ZXN0My50ZXN0X0EnKSwgdHJ1ZSwgJ1Rlc3QgRmlsZSBub3QgZm91bmQnKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ1NldHRpbmcgY3dkIHNob3VsZCByZXR1cm4gdGVzdHMnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgeWllbGQgY29tbW9uXzEudXBkYXRlU2V0dGluZygndW5pdFRlc3QudW5pdHRlc3RBcmdzJywgWyctcz0uL3Rlc3RzJywgJy1wPXRlc3RfKi5weSddLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCBjb25maWdUYXJnZXQpO1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1tdWx0aWxpbmUtc3RyaW5nXHJcbiAgICAgICAgeWllbGQgaW5qZWN0VGVzdERpc2NvdmVyeU91dHB1dChgc3RhcnRcclxuICAgIHRlc3RfY3dkLlRlc3RfQ3VycmVudF9Xb3JraW5nX0RpcmVjdG9yeS50ZXN0X2N3ZFxyXG4gICAgYCk7XHJcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IGlvYy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18yLklUZXN0TWFuYWdlckZhY3RvcnkpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RNYW5hZ2VyID0gZmFjdG9yeSgndW5pdHRlc3QnLCBjb21tb25fMS5yb290V29ya3NwYWNlVXJpLCB1bml0VGVzdFRlc3RGaWxlc0N3ZFBhdGgpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RzID0geWllbGQgdGVzdE1hbmFnZXIuZGlzY292ZXJUZXN0cyhjb25zdGFudHNfMi5Db21tYW5kU291cmNlLnVpLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGVzdHMudGVzdEZpbGVzLmxlbmd0aCwgMSwgJ0luY29ycmVjdCBudW1iZXIgb2YgdGVzdCBmaWxlcycpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0Rm9sZGVycy5sZW5ndGgsIDEsICdJbmNvcnJlY3QgbnVtYmVyIG9mIHRlc3QgZm9sZGVycycpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0ZXN0cy50ZXN0RnVuY3Rpb25zLmxlbmd0aCwgMSwgJ0luY29ycmVjdCBudW1iZXIgb2YgdGVzdCBmdW5jdGlvbnMnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGVzdHMudGVzdFN1aXRlcy5sZW5ndGgsIDEsICdJbmNvcnJlY3QgbnVtYmVyIG9mIHRlc3Qgc3VpdGVzJyk7XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11bml0dGVzdC5kaXNjb3ZlcnkudGVzdC5qcy5tYXAiXX0=