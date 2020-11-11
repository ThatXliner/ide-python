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

const inversify_1 = require("inversify");

const path = require("path");

const vscode_1 = require("vscode");

const service_1 = require("../../client/common/configuration/service");

require("../../client/common/extensions");

const types_1 = require("../../client/common/types");

const container_1 = require("../../client/ioc/container");

const serviceManager_1 = require("../../client/ioc/serviceManager");

const constants_1 = require("../constants");

const initialize_1 = require("../initialize");

const wksPath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'pythonFiles', 'exclusions');
const fileOne = path.join(wksPath, 'one.py'); // tslint:disable-next-line:max-func-body-length

suite('Exclude files (Language Server)', () => {
  let textDocument;
  let serviceManager;
  let serviceContainer;
  let configService;
  suiteSetup(function () {
    return __awaiter(this, void 0, void 0, function* () {
      if (!constants_1.IsLanguageServerTest()) {
        // tslint:disable-next-line:no-invalid-this
        this.skip();
      }
    });
  });
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    const cont = new inversify_1.Container();
    serviceContainer = new container_1.ServiceContainer(cont);
    serviceManager = new serviceManager_1.ServiceManager(cont);
    serviceManager.addSingleton(types_1.IConfigurationService, service_1.ConfigurationService);
    configService = serviceManager.get(types_1.IConfigurationService);
  }));
  suiteTeardown(initialize_1.closeActiveWindows);
  teardown(initialize_1.closeActiveWindows);

  function openFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
      yield initialize_1.activateExtension();
      textDocument = yield vscode_1.workspace.openTextDocument(file);
      yield vscode_1.window.showTextDocument(textDocument); // Make sure LS completes file loading and analysis.
      // In test mode it awaits for the completion before trying
      // to fetch data for completion, hover.etc.

      yield vscode_1.commands.executeCommand('vscode.executeCompletionItemProvider', textDocument.uri, new vscode_1.Position(0, 0));
    });
  }

  function setSetting(name, value) {
    return __awaiter(this, void 0, void 0, function* () {
      yield configService.updateSetting(name, value, undefined, vscode_1.ConfigurationTarget.Global);
    });
  }

  test('Default exclusions', () => __awaiter(void 0, void 0, void 0, function* () {
    yield openFile(fileOne);
    const diag = vscode_1.languages.getDiagnostics();
    const main = diag.filter(d => d[0].fsPath.indexOf('one.py') >= 0);
    assert.equal(main.length > 0, true);
    const subdir = diag.filter(d => d[0].fsPath.indexOf('three.py') >= 0);
    assert.equal(subdir.length > 0, true);
    const node_modules = diag.filter(d => d[0].fsPath.indexOf('node.py') >= 0);
    assert.equal(node_modules.length, 0);
    const lib = diag.filter(d => d[0].fsPath.indexOf('fileLib.py') >= 0);
    assert.equal(lib.length, 0);
    const sitePackages = diag.filter(d => d[0].fsPath.indexOf('sitePackages.py') >= 0);
    assert.equal(sitePackages.length, 0);
  }));
  test('Exclude subfolder', () => __awaiter(void 0, void 0, void 0, function* () {
    yield setSetting('linting.ignorePatterns', ['**/dir1/**']);
    yield openFile(fileOne);
    const diag = vscode_1.languages.getDiagnostics();
    const main = diag.filter(d => d[0].fsPath.indexOf('one.py') >= 0);
    assert.equal(main.length > 0, true);
    const subdir1 = diag.filter(d => d[0].fsPath.indexOf('dir1file.py') >= 0);
    assert.equal(subdir1.length, 0);
    const subdir2 = diag.filter(d => d[0].fsPath.indexOf('dir2file.py') >= 0);
    assert.equal(subdir2.length, 0);
    yield setSetting('linting.ignorePatterns', undefined);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2x1ZGVGaWxlcy5scy50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJhc3NlcnQiLCJyZXF1aXJlIiwiaW52ZXJzaWZ5XzEiLCJwYXRoIiwidnNjb2RlXzEiLCJzZXJ2aWNlXzEiLCJ0eXBlc18xIiwiY29udGFpbmVyXzEiLCJzZXJ2aWNlTWFuYWdlcl8xIiwiY29uc3RhbnRzXzEiLCJpbml0aWFsaXplXzEiLCJ3a3NQYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImZpbGVPbmUiLCJzdWl0ZSIsInRleHREb2N1bWVudCIsInNlcnZpY2VNYW5hZ2VyIiwic2VydmljZUNvbnRhaW5lciIsImNvbmZpZ1NlcnZpY2UiLCJzdWl0ZVNldHVwIiwiSXNMYW5ndWFnZVNlcnZlclRlc3QiLCJza2lwIiwic2V0dXAiLCJjb250IiwiQ29udGFpbmVyIiwiU2VydmljZUNvbnRhaW5lciIsIlNlcnZpY2VNYW5hZ2VyIiwiYWRkU2luZ2xldG9uIiwiSUNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwiQ29uZmlndXJhdGlvblNlcnZpY2UiLCJnZXQiLCJzdWl0ZVRlYXJkb3duIiwiY2xvc2VBY3RpdmVXaW5kb3dzIiwidGVhcmRvd24iLCJvcGVuRmlsZSIsImZpbGUiLCJhY3RpdmF0ZUV4dGVuc2lvbiIsIndvcmtzcGFjZSIsIm9wZW5UZXh0RG9jdW1lbnQiLCJ3aW5kb3ciLCJzaG93VGV4dERvY3VtZW50IiwiY29tbWFuZHMiLCJleGVjdXRlQ29tbWFuZCIsInVyaSIsIlBvc2l0aW9uIiwic2V0U2V0dGluZyIsIm5hbWUiLCJ1cGRhdGVTZXR0aW5nIiwidW5kZWZpbmVkIiwiQ29uZmlndXJhdGlvblRhcmdldCIsIkdsb2JhbCIsInRlc3QiLCJkaWFnIiwibGFuZ3VhZ2VzIiwiZ2V0RGlhZ25vc3RpY3MiLCJtYWluIiwiZmlsdGVyIiwiZCIsImZzUGF0aCIsImluZGV4T2YiLCJlcXVhbCIsImxlbmd0aCIsInN1YmRpciIsIm5vZGVfbW9kdWxlcyIsImxpYiIsInNpdGVQYWNrYWdlcyIsInN1YmRpcjEiLCJzdWJkaXIyIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFsQixFQUF5QjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CSyxLQUFuQixDQUFELENBQUo7QUFBa0MsT0FBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDOUYsYUFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFy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LENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBS0MsTUFBTCxDQUFZQyxPQUFaLENBQW9CLGFBQXBCLEtBQXNDLENBQXZELENBQWhCO0FBQ0E1RCxJQUFBQSxNQUFNLENBQUM2RCxLQUFQLENBQWFPLE9BQU8sQ0FBQ04sTUFBckIsRUFBNkIsQ0FBN0I7QUFDQSxVQUFNaEIsVUFBVSxDQUFDLHdCQUFELEVBQTJCRyxTQUEzQixDQUFoQjtBQUNILEdBWHdDLENBQXJDLENBQUo7QUFZSCxDQWhFSSxDQUFMIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IHZzY29kZV8xID0gcmVxdWlyZShcInZzY29kZVwiKTtcclxuY29uc3Qgc2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vY29uZmlndXJhdGlvbi9zZXJ2aWNlXCIpO1xyXG5yZXF1aXJlKFwiLi4vLi4vY2xpZW50L2NvbW1vbi9leHRlbnNpb25zXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IGNvbnRhaW5lcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2MvY29udGFpbmVyXCIpO1xyXG5jb25zdCBzZXJ2aWNlTWFuYWdlcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2Mvc2VydmljZU1hbmFnZXJcIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcclxuY29uc3QgaW5pdGlhbGl6ZV8xID0gcmVxdWlyZShcIi4uL2luaXRpYWxpemVcIik7XHJcbmNvbnN0IHdrc1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnc3JjJywgJ3Rlc3QnLCAncHl0aG9uRmlsZXMnLCAnZXhjbHVzaW9ucycpO1xyXG5jb25zdCBmaWxlT25lID0gcGF0aC5qb2luKHdrc1BhdGgsICdvbmUucHknKTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbnN1aXRlKCdFeGNsdWRlIGZpbGVzIChMYW5ndWFnZSBTZXJ2ZXIpJywgKCkgPT4ge1xyXG4gICAgbGV0IHRleHREb2N1bWVudDtcclxuICAgIGxldCBzZXJ2aWNlTWFuYWdlcjtcclxuICAgIGxldCBzZXJ2aWNlQ29udGFpbmVyO1xyXG4gICAgbGV0IGNvbmZpZ1NlcnZpY2U7XHJcbiAgICBzdWl0ZVNldHVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnN0YW50c18xLklzTGFuZ3VhZ2VTZXJ2ZXJUZXN0KCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHNldHVwKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBjb250ID0gbmV3IGludmVyc2lmeV8xLkNvbnRhaW5lcigpO1xyXG4gICAgICAgIHNlcnZpY2VDb250YWluZXIgPSBuZXcgY29udGFpbmVyXzEuU2VydmljZUNvbnRhaW5lcihjb250KTtcclxuICAgICAgICBzZXJ2aWNlTWFuYWdlciA9IG5ldyBzZXJ2aWNlTWFuYWdlcl8xLlNlcnZpY2VNYW5hZ2VyKGNvbnQpO1xyXG4gICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18xLklDb25maWd1cmF0aW9uU2VydmljZSwgc2VydmljZV8xLkNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgICAgICBjb25maWdTZXJ2aWNlID0gc2VydmljZU1hbmFnZXIuZ2V0KHR5cGVzXzEuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgIH0pKTtcclxuICAgIHN1aXRlVGVhcmRvd24oaW5pdGlhbGl6ZV8xLmNsb3NlQWN0aXZlV2luZG93cyk7XHJcbiAgICB0ZWFyZG93bihpbml0aWFsaXplXzEuY2xvc2VBY3RpdmVXaW5kb3dzKTtcclxuICAgIGZ1bmN0aW9uIG9wZW5GaWxlKGZpbGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCBpbml0aWFsaXplXzEuYWN0aXZhdGVFeHRlbnNpb24oKTtcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50ID0geWllbGQgdnNjb2RlXzEud29ya3NwYWNlLm9wZW5UZXh0RG9jdW1lbnQoZmlsZSk7XHJcbiAgICAgICAgICAgIHlpZWxkIHZzY29kZV8xLndpbmRvdy5zaG93VGV4dERvY3VtZW50KHRleHREb2N1bWVudCk7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBMUyBjb21wbGV0ZXMgZmlsZSBsb2FkaW5nIGFuZCBhbmFseXNpcy5cclxuICAgICAgICAgICAgLy8gSW4gdGVzdCBtb2RlIGl0IGF3YWl0cyBmb3IgdGhlIGNvbXBsZXRpb24gYmVmb3JlIHRyeWluZ1xyXG4gICAgICAgICAgICAvLyB0byBmZXRjaCBkYXRhIGZvciBjb21wbGV0aW9uLCBob3Zlci5ldGMuXHJcbiAgICAgICAgICAgIHlpZWxkIHZzY29kZV8xLmNvbW1hbmRzLmV4ZWN1dGVDb21tYW5kKCd2c2NvZGUuZXhlY3V0ZUNvbXBsZXRpb25JdGVtUHJvdmlkZXInLCB0ZXh0RG9jdW1lbnQudXJpLCBuZXcgdnNjb2RlXzEuUG9zaXRpb24oMCwgMCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2V0U2V0dGluZyhuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGNvbmZpZ1NlcnZpY2UudXBkYXRlU2V0dGluZyhuYW1lLCB2YWx1ZSwgdW5kZWZpbmVkLCB2c2NvZGVfMS5Db25maWd1cmF0aW9uVGFyZ2V0Lkdsb2JhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0ZXN0KCdEZWZhdWx0IGV4Y2x1c2lvbnMnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgeWllbGQgb3BlbkZpbGUoZmlsZU9uZSk7XHJcbiAgICAgICAgY29uc3QgZGlhZyA9IHZzY29kZV8xLmxhbmd1YWdlcy5nZXREaWFnbm9zdGljcygpO1xyXG4gICAgICAgIGNvbnN0IG1haW4gPSBkaWFnLmZpbHRlcihkID0+IGRbMF0uZnNQYXRoLmluZGV4T2YoJ29uZS5weScpID49IDApO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChtYWluLmxlbmd0aCA+IDAsIHRydWUpO1xyXG4gICAgICAgIGNvbnN0IHN1YmRpciA9IGRpYWcuZmlsdGVyKGQgPT4gZFswXS5mc1BhdGguaW5kZXhPZigndGhyZWUucHknKSA+PSAwKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoc3ViZGlyLmxlbmd0aCA+IDAsIHRydWUpO1xyXG4gICAgICAgIGNvbnN0IG5vZGVfbW9kdWxlcyA9IGRpYWcuZmlsdGVyKGQgPT4gZFswXS5mc1BhdGguaW5kZXhPZignbm9kZS5weScpID49IDApO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChub2RlX21vZHVsZXMubGVuZ3RoLCAwKTtcclxuICAgICAgICBjb25zdCBsaWIgPSBkaWFnLmZpbHRlcihkID0+IGRbMF0uZnNQYXRoLmluZGV4T2YoJ2ZpbGVMaWIucHknKSA+PSAwKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwobGliLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgY29uc3Qgc2l0ZVBhY2thZ2VzID0gZGlhZy5maWx0ZXIoZCA9PiBkWzBdLmZzUGF0aC5pbmRleE9mKCdzaXRlUGFja2FnZXMucHknKSA+PSAwKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoc2l0ZVBhY2thZ2VzLmxlbmd0aCwgMCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdFeGNsdWRlIHN1YmZvbGRlcicsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBzZXRTZXR0aW5nKCdsaW50aW5nLmlnbm9yZVBhdHRlcm5zJywgWycqKi9kaXIxLyoqJ10pO1xyXG4gICAgICAgIHlpZWxkIG9wZW5GaWxlKGZpbGVPbmUpO1xyXG4gICAgICAgIGNvbnN0IGRpYWcgPSB2c2NvZGVfMS5sYW5ndWFnZXMuZ2V0RGlhZ25vc3RpY3MoKTtcclxuICAgICAgICBjb25zdCBtYWluID0gZGlhZy5maWx0ZXIoZCA9PiBkWzBdLmZzUGF0aC5pbmRleE9mKCdvbmUucHknKSA+PSAwKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwobWFpbi5sZW5ndGggPiAwLCB0cnVlKTtcclxuICAgICAgICBjb25zdCBzdWJkaXIxID0gZGlhZy5maWx0ZXIoZCA9PiBkWzBdLmZzUGF0aC5pbmRleE9mKCdkaXIxZmlsZS5weScpID49IDApO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJkaXIxLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgY29uc3Qgc3ViZGlyMiA9IGRpYWcuZmlsdGVyKGQgPT4gZFswXS5mc1BhdGguaW5kZXhPZignZGlyMmZpbGUucHknKSA+PSAwKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoc3ViZGlyMi5sZW5ndGgsIDApO1xyXG4gICAgICAgIHlpZWxkIHNldFNldHRpbmcoJ2xpbnRpbmcuaWdub3JlUGF0dGVybnMnLCB1bmRlZmluZWQpO1xyXG4gICAgfSkpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhjbHVkZUZpbGVzLmxzLnRlc3QuanMubWFwIl19