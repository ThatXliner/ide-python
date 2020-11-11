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
}); // tslint:disable:no-any max-classes-per-file max-func-body-length no-invalid-this

const chai_1 = require("chai");

const path = require("path");

const ts_mockito_1 = require("ts-mockito");

const vscode_1 = require("vscode");

const workspace_1 = require("../../../client/common/application/workspace");

const constants_1 = require("../../../client/common/constants");

const platformService_1 = require("../../../client/common/platform/platformService");

const pythonExecutionFactory_1 = require("../../../client/common/process/pythonExecutionFactory");

const async_1 = require("../../../client/common/utils/async");

const misc_1 = require("../../../client/common/utils/misc");

const platform_1 = require("../../../client/common/utils/platform");

const workspaceVirtualEnvWatcherService_1 = require("../../../client/interpreter/locators/services/workspaceVirtualEnvWatcherService");

suite('Interpreters - Workspace VirtualEnv Watcher Service', () => {
  let disposables = [];
  setup(function () {
    if (!constants_1.isUnitTestExecution()) {
      return this.skip();
    }
  });
  teardown(() => {
    disposables.forEach(d => {
      try {
        d.dispose();
      } catch (_a) {
        misc_1.noop();
      }
    });
    disposables = [];
  });

  function checkForFileChanges(os, resource, hasWorkspaceFolder) {
    return __awaiter(this, void 0, void 0, function* () {
      const workspaceService = ts_mockito_1.mock(workspace_1.WorkspaceService);
      const platformService = ts_mockito_1.mock(platformService_1.PlatformService);
      const execFactory = ts_mockito_1.mock(pythonExecutionFactory_1.PythonExecutionFactory);
      const watcher = new workspaceVirtualEnvWatcherService_1.WorkspaceVirtualEnvWatcherService([], ts_mockito_1.instance(workspaceService), ts_mockito_1.instance(platformService), ts_mockito_1.instance(execFactory));
      ts_mockito_1.when(platformService.isWindows).thenReturn(os === platform_1.OSType.Windows);
      ts_mockito_1.when(platformService.isLinux).thenReturn(os === platform_1.OSType.Linux);
      ts_mockito_1.when(platformService.isMac).thenReturn(os === platform_1.OSType.OSX);

      class FSWatcher {
        onDidCreate(_listener, _thisArgs, _disposables) {
          return {
            dispose: misc_1.noop
          };
        }

      }

      const workspaceFolder = {
        name: 'one',
        index: 1,
        uri: vscode_1.Uri.file(path.join('root', 'dev'))
      };

      if (!hasWorkspaceFolder || !resource) {
        ts_mockito_1.when(workspaceService.getWorkspaceFolder(ts_mockito_1.anything())).thenReturn(undefined);
      } else {
        ts_mockito_1.when(workspaceService.getWorkspaceFolder(resource)).thenReturn(workspaceFolder);
      }

      const fsWatcher = ts_mockito_1.mock(FSWatcher);
      ts_mockito_1.when(workspaceService.createFileSystemWatcher(ts_mockito_1.anything())).thenReturn(ts_mockito_1.instance(fsWatcher));
      yield watcher.register(resource);
      ts_mockito_1.verify(workspaceService.createFileSystemWatcher(ts_mockito_1.anything())).twice();
      ts_mockito_1.verify(fsWatcher.onDidCreate(ts_mockito_1.anything(), ts_mockito_1.anything(), ts_mockito_1.anything())).twice();
    });
  }

  for (const uri of [undefined, vscode_1.Uri.file('abc')]) {
    for (const hasWorkspaceFolder of [true, false]) {
      const uriSuffix = uri ? ` (with resource & ${hasWorkspaceFolder ? 'with' : 'without'} workspace folder)` : '';
      test(`Register for file changes on windows ${uriSuffix}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkForFileChanges(platform_1.OSType.Windows, uri, hasWorkspaceFolder);
      }));
      test(`Register for file changes on Mac ${uriSuffix}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkForFileChanges(platform_1.OSType.OSX, uri, hasWorkspaceFolder);
      }));
      test(`Register for file changes on Linux ${uriSuffix}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkForFileChanges(platform_1.OSType.Linux, uri, hasWorkspaceFolder);
      }));
    }
  }

  function ensureFileChanesAreHandled(os) {
    return __awaiter(this, void 0, void 0, function* () {
      const workspaceService = ts_mockito_1.mock(workspace_1.WorkspaceService);
      const platformService = ts_mockito_1.mock(platformService_1.PlatformService);
      const execFactory = ts_mockito_1.mock(pythonExecutionFactory_1.PythonExecutionFactory);
      const watcher = new workspaceVirtualEnvWatcherService_1.WorkspaceVirtualEnvWatcherService(disposables, ts_mockito_1.instance(workspaceService), ts_mockito_1.instance(platformService), ts_mockito_1.instance(execFactory));
      ts_mockito_1.when(platformService.isWindows).thenReturn(os === platform_1.OSType.Windows);
      ts_mockito_1.when(platformService.isLinux).thenReturn(os === platform_1.OSType.Linux);
      ts_mockito_1.when(platformService.isMac).thenReturn(os === platform_1.OSType.OSX);

      class FSWatcher {
        onDidCreate(listener, _thisArgs, _disposables) {
          this.listener = listener;
          return {
            dispose: misc_1.noop
          };
        }

        invokeListener(e) {
          this.listener(e);
        }

      }

      const fsWatcher = new FSWatcher();
      ts_mockito_1.when(workspaceService.getWorkspaceFolder(ts_mockito_1.anything())).thenReturn(undefined);
      ts_mockito_1.when(workspaceService.createFileSystemWatcher(ts_mockito_1.anything())).thenReturn(fsWatcher);
      yield watcher.register(undefined);
      let invoked = false;
      watcher.onDidCreate(() => invoked = true, watcher);
      fsWatcher.invokeListener(vscode_1.Uri.file('')); // We need this sleep, as we have a debounce (so lets wait).

      yield async_1.sleep(10);
      chai_1.expect(invoked).to.be.equal(true, 'invalid');
    });
  }

  test('Check file change handler on Windows', () => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureFileChanesAreHandled(platform_1.OSType.Windows);
  }));
  test('Check file change handler on Mac', () => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureFileChanesAreHandled(platform_1.OSType.OSX);
  }));
  test('Check file change handler on Linux', () => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureFileChanesAreHandled(platform_1.OSType.Linux);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImNoYWlfMSIsInJlcXVpcmUiLCJwYXRoIiwidHNfbW9ja2l0b18xIiwidnNjb2RlXzEiLCJ3b3Jrc3BhY2VfMSIsImNvbnN0YW50c18xIiwicGxhdGZvcm1TZXJ2aWNlXzEiLCJweXRob25FeGVjdXRpb25GYWN0b3J5XzEiLCJhc3luY18xIiwibWlzY18xIiwicGxhdGZvcm1fMSIsIndvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZV8xIiwic3VpdGUiLCJkaXNwb3NhYmxlcyIsInNldHVwIiwiaXNVbml0VGVzdEV4ZWN1dGlvbiIsInNraXAiLCJ0ZWFyZG93biIsImZvckVhY2giLCJkIiwiZGlzcG9zZSIsIl9hIiwibm9vcCIsImNoZWNrRm9yRmlsZUNoYW5nZXMiLCJvcyIsInJlc291cmNlIiwiaGFzV29ya3NwYWNlRm9sZGVyIiwid29ya3NwYWNlU2VydmljZSIsIm1vY2siLCJXb3Jrc3BhY2VTZXJ2aWNlIiwicGxhdGZvcm1TZXJ2aWNlIiwiUGxhdGZvcm1TZXJ2aWNlIiwiZXhlY0ZhY3RvcnkiLCJQeXRob25FeGVjdXRpb25GYWN0b3J5Iiwid2F0Y2hlciIsIldvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSIsImluc3RhbmNlIiwid2hlbiIsImlzV2luZG93cyIsInRoZW5SZXR1cm4iLCJPU1R5cGUiLCJXaW5kb3dzIiwiaXNMaW51eCIsIkxpbnV4IiwiaXNNYWMiLCJPU1giLCJGU1dhdGNoZXIiLCJvbkRpZENyZWF0ZSIsIl9saXN0ZW5lciIsIl90aGlzQXJncyIsIl9kaXNwb3NhYmxlcyIsIndvcmtzcGFjZUZvbGRlciIsIm5hbWUiLCJpbmRleCIsInVyaSIsIlVyaSIsImZpbGUiLCJqb2luIiwiZ2V0V29ya3NwYWNlRm9sZGVyIiwiYW55dGhpbmciLCJ1bmRlZmluZWQiLCJmc1dhdGNoZXIiLCJjcmVhdGVGaWxlU3lzdGVtV2F0Y2hlciIsInJlZ2lzdGVyIiwidmVyaWZ5IiwidHdpY2UiLCJ1cmlTdWZmaXgiLCJ0ZXN0IiwiZW5zdXJlRmlsZUNoYW5lc0FyZUhhbmRsZWQiLCJsaXN0ZW5lciIsImludm9rZUxpc3RlbmVyIiwiaW52b2tlZCIsInNsZWVwIiwiZXhwZWN0IiwidG8iLCJiZSIsImVxdWFsIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtB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QUF6QztBQUNILEtBM0JlLENBQWhCO0FBNEJIOztBQUNEVCxFQUFBQSxJQUFJLENBQUMsc0NBQUQsRUFBeUMsTUFBTXpGLFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDNUYsVUFBTTBGLDBCQUEwQixDQUFDMUQsVUFBVSxDQUFDOEIsTUFBWCxDQUFrQkMsT0FBbkIsQ0FBaEM7QUFDSCxHQUYyRCxDQUF4RCxDQUFKO0FBR0EwQixFQUFBQSxJQUFJLENBQUMsa0NBQUQsRUFBcUMsTUFBTXpGLFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDeEYsVUFBTTBGLDBCQUEwQixDQUFDMUQsVUFBVSxDQUFDOEIsTUFBWCxDQUFrQkssR0FBbkIsQ0FBaEM7QUFDSCxHQUZ1RCxDQUFwRCxDQUFKO0FBR0FzQixFQUFBQSxJQUFJLENBQUMsb0NBQUQsRUFBdUMsTUFBTXpGLFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDMUYsVUFBTTBGLDBCQUEwQixDQUFDMUQsVUFBVSxDQUFDOEIsTUFBWCxDQUFrQkcsS0FBbkIsQ0FBaEM7QUFDSCxHQUZ5RCxDQUF0RCxDQUFKO0FBR0gsQ0FuR0ksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbWF4LWNsYXNzZXMtcGVyLWZpbGUgbWF4LWZ1bmMtYm9keS1sZW5ndGggbm8taW52YWxpZC10aGlzXHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IHRzX21vY2tpdG9fMSA9IHJlcXVpcmUoXCJ0cy1tb2NraXRvXCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IHdvcmtzcGFjZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vYXBwbGljYXRpb24vd29ya3NwYWNlXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL2NvbnN0YW50c1wiKTtcclxuY29uc3QgcGxhdGZvcm1TZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L2NvbW1vbi9wbGF0Zm9ybS9wbGF0Zm9ybVNlcnZpY2VcIik7XHJcbmNvbnN0IHB5dGhvbkV4ZWN1dGlvbkZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL3Byb2Nlc3MvcHl0aG9uRXhlY3V0aW9uRmFjdG9yeVwiKTtcclxuY29uc3QgYXN5bmNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL3V0aWxzL2FzeW5jXCIpO1xyXG5jb25zdCBtaXNjXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L2NvbW1vbi91dGlscy9taXNjXCIpO1xyXG5jb25zdCBwbGF0Zm9ybV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vdXRpbHMvcGxhdGZvcm1cIik7XHJcbmNvbnN0IHdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9pbnRlcnByZXRlci9sb2NhdG9ycy9zZXJ2aWNlcy93b3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2VcIik7XHJcbnN1aXRlKCdJbnRlcnByZXRlcnMgLSBXb3Jrc3BhY2UgVmlydHVhbEVudiBXYXRjaGVyIFNlcnZpY2UnLCAoKSA9PiB7XHJcbiAgICBsZXQgZGlzcG9zYWJsZXMgPSBbXTtcclxuICAgIHNldHVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIWNvbnN0YW50c18xLmlzVW5pdFRlc3RFeGVjdXRpb24oKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5za2lwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0ZWFyZG93bigoKSA9PiB7XHJcbiAgICAgICAgZGlzcG9zYWJsZXMuZm9yRWFjaChkID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGQuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgbWlzY18xLm5vb3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRpc3Bvc2FibGVzID0gW107XHJcbiAgICB9KTtcclxuICAgIGZ1bmN0aW9uIGNoZWNrRm9yRmlsZUNoYW5nZXMob3MsIHJlc291cmNlLCBoYXNXb3Jrc3BhY2VGb2xkZXIpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VTZXJ2aWNlID0gdHNfbW9ja2l0b18xLm1vY2sod29ya3NwYWNlXzEuV29ya3NwYWNlU2VydmljZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtU2VydmljZSA9IHRzX21vY2tpdG9fMS5tb2NrKHBsYXRmb3JtU2VydmljZV8xLlBsYXRmb3JtU2VydmljZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNGYWN0b3J5ID0gdHNfbW9ja2l0b18xLm1vY2socHl0aG9uRXhlY3V0aW9uRmFjdG9yeV8xLlB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkpO1xyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyID0gbmV3IHdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZV8xLldvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZShbXSwgdHNfbW9ja2l0b18xLmluc3RhbmNlKHdvcmtzcGFjZVNlcnZpY2UpLCB0c19tb2NraXRvXzEuaW5zdGFuY2UocGxhdGZvcm1TZXJ2aWNlKSwgdHNfbW9ja2l0b18xLmluc3RhbmNlKGV4ZWNGYWN0b3J5KSk7XHJcbiAgICAgICAgICAgIHRzX21vY2tpdG9fMS53aGVuKHBsYXRmb3JtU2VydmljZS5pc1dpbmRvd3MpLnRoZW5SZXR1cm4ob3MgPT09IHBsYXRmb3JtXzEuT1NUeXBlLldpbmRvd3MpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbihwbGF0Zm9ybVNlcnZpY2UuaXNMaW51eCkudGhlblJldHVybihvcyA9PT0gcGxhdGZvcm1fMS5PU1R5cGUuTGludXgpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbihwbGF0Zm9ybVNlcnZpY2UuaXNNYWMpLnRoZW5SZXR1cm4ob3MgPT09IHBsYXRmb3JtXzEuT1NUeXBlLk9TWCk7XHJcbiAgICAgICAgICAgIGNsYXNzIEZTV2F0Y2hlciB7XHJcbiAgICAgICAgICAgICAgICBvbkRpZENyZWF0ZShfbGlzdGVuZXIsIF90aGlzQXJncywgX2Rpc3Bvc2FibGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGlzcG9zZTogbWlzY18xLm5vb3AgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VGb2xkZXIgPSB7IG5hbWU6ICdvbmUnLCBpbmRleDogMSwgdXJpOiB2c2NvZGVfMS5VcmkuZmlsZShwYXRoLmpvaW4oJ3Jvb3QnLCAnZGV2JykpIH07XHJcbiAgICAgICAgICAgIGlmICghaGFzV29ya3NwYWNlRm9sZGVyIHx8ICFyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgdHNfbW9ja2l0b18xLndoZW4od29ya3NwYWNlU2VydmljZS5nZXRXb3Jrc3BhY2VGb2xkZXIodHNfbW9ja2l0b18xLmFueXRoaW5nKCkpKS50aGVuUmV0dXJuKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbih3b3Jrc3BhY2VTZXJ2aWNlLmdldFdvcmtzcGFjZUZvbGRlcihyZXNvdXJjZSkpLnRoZW5SZXR1cm4od29ya3NwYWNlRm9sZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBmc1dhdGNoZXIgPSB0c19tb2NraXRvXzEubW9jayhGU1dhdGNoZXIpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbih3b3Jrc3BhY2VTZXJ2aWNlLmNyZWF0ZUZpbGVTeXN0ZW1XYXRjaGVyKHRzX21vY2tpdG9fMS5hbnl0aGluZygpKSkudGhlblJldHVybih0c19tb2NraXRvXzEuaW5zdGFuY2UoZnNXYXRjaGVyKSk7XHJcbiAgICAgICAgICAgIHlpZWxkIHdhdGNoZXIucmVnaXN0ZXIocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEudmVyaWZ5KHdvcmtzcGFjZVNlcnZpY2UuY3JlYXRlRmlsZVN5c3RlbVdhdGNoZXIodHNfbW9ja2l0b18xLmFueXRoaW5nKCkpKS50d2ljZSgpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEudmVyaWZ5KGZzV2F0Y2hlci5vbkRpZENyZWF0ZSh0c19tb2NraXRvXzEuYW55dGhpbmcoKSwgdHNfbW9ja2l0b18xLmFueXRoaW5nKCksIHRzX21vY2tpdG9fMS5hbnl0aGluZygpKSkudHdpY2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgdXJpIG9mIFt1bmRlZmluZWQsIHZzY29kZV8xLlVyaS5maWxlKCdhYmMnKV0pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGhhc1dvcmtzcGFjZUZvbGRlciBvZiBbdHJ1ZSwgZmFsc2VdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVyaVN1ZmZpeCA9IHVyaSA/IGAgKHdpdGggcmVzb3VyY2UgJiAke2hhc1dvcmtzcGFjZUZvbGRlciA/ICd3aXRoJyA6ICd3aXRob3V0J30gd29ya3NwYWNlIGZvbGRlcilgIDogJyc7XHJcbiAgICAgICAgICAgIHRlc3QoYFJlZ2lzdGVyIGZvciBmaWxlIGNoYW5nZXMgb24gd2luZG93cyAke3VyaVN1ZmZpeH1gLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGVja0ZvckZpbGVDaGFuZ2VzKHBsYXRmb3JtXzEuT1NUeXBlLldpbmRvd3MsIHVyaSwgaGFzV29ya3NwYWNlRm9sZGVyKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB0ZXN0KGBSZWdpc3RlciBmb3IgZmlsZSBjaGFuZ2VzIG9uIE1hYyAke3VyaVN1ZmZpeH1gLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGVja0ZvckZpbGVDaGFuZ2VzKHBsYXRmb3JtXzEuT1NUeXBlLk9TWCwgdXJpLCBoYXNXb3Jrc3BhY2VGb2xkZXIpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIHRlc3QoYFJlZ2lzdGVyIGZvciBmaWxlIGNoYW5nZXMgb24gTGludXggJHt1cmlTdWZmaXh9YCwgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgY2hlY2tGb3JGaWxlQ2hhbmdlcyhwbGF0Zm9ybV8xLk9TVHlwZS5MaW51eCwgdXJpLCBoYXNXb3Jrc3BhY2VGb2xkZXIpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZW5zdXJlRmlsZUNoYW5lc0FyZUhhbmRsZWQob3MpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VTZXJ2aWNlID0gdHNfbW9ja2l0b18xLm1vY2sod29ya3NwYWNlXzEuV29ya3NwYWNlU2VydmljZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtU2VydmljZSA9IHRzX21vY2tpdG9fMS5tb2NrKHBsYXRmb3JtU2VydmljZV8xLlBsYXRmb3JtU2VydmljZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNGYWN0b3J5ID0gdHNfbW9ja2l0b18xLm1vY2socHl0aG9uRXhlY3V0aW9uRmFjdG9yeV8xLlB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkpO1xyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyID0gbmV3IHdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZV8xLldvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZShkaXNwb3NhYmxlcywgdHNfbW9ja2l0b18xLmluc3RhbmNlKHdvcmtzcGFjZVNlcnZpY2UpLCB0c19tb2NraXRvXzEuaW5zdGFuY2UocGxhdGZvcm1TZXJ2aWNlKSwgdHNfbW9ja2l0b18xLmluc3RhbmNlKGV4ZWNGYWN0b3J5KSk7XHJcbiAgICAgICAgICAgIHRzX21vY2tpdG9fMS53aGVuKHBsYXRmb3JtU2VydmljZS5pc1dpbmRvd3MpLnRoZW5SZXR1cm4ob3MgPT09IHBsYXRmb3JtXzEuT1NUeXBlLldpbmRvd3MpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbihwbGF0Zm9ybVNlcnZpY2UuaXNMaW51eCkudGhlblJldHVybihvcyA9PT0gcGxhdGZvcm1fMS5PU1R5cGUuTGludXgpO1xyXG4gICAgICAgICAgICB0c19tb2NraXRvXzEud2hlbihwbGF0Zm9ybVNlcnZpY2UuaXNNYWMpLnRoZW5SZXR1cm4ob3MgPT09IHBsYXRmb3JtXzEuT1NUeXBlLk9TWCk7XHJcbiAgICAgICAgICAgIGNsYXNzIEZTV2F0Y2hlciB7XHJcbiAgICAgICAgICAgICAgICBvbkRpZENyZWF0ZShsaXN0ZW5lciwgX3RoaXNBcmdzLCBfZGlzcG9zYWJsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGlzcG9zZTogbWlzY18xLm5vb3AgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGludm9rZUxpc3RlbmVyKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZzV2F0Y2hlciA9IG5ldyBGU1dhdGNoZXIoKTtcclxuICAgICAgICAgICAgdHNfbW9ja2l0b18xLndoZW4od29ya3NwYWNlU2VydmljZS5nZXRXb3Jrc3BhY2VGb2xkZXIodHNfbW9ja2l0b18xLmFueXRoaW5nKCkpKS50aGVuUmV0dXJuKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIHRzX21vY2tpdG9fMS53aGVuKHdvcmtzcGFjZVNlcnZpY2UuY3JlYXRlRmlsZVN5c3RlbVdhdGNoZXIodHNfbW9ja2l0b18xLmFueXRoaW5nKCkpKS50aGVuUmV0dXJuKGZzV2F0Y2hlcik7XHJcbiAgICAgICAgICAgIHlpZWxkIHdhdGNoZXIucmVnaXN0ZXIodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgbGV0IGludm9rZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgd2F0Y2hlci5vbkRpZENyZWF0ZSgoKSA9PiBpbnZva2VkID0gdHJ1ZSwgd2F0Y2hlcik7XHJcbiAgICAgICAgICAgIGZzV2F0Y2hlci5pbnZva2VMaXN0ZW5lcih2c2NvZGVfMS5VcmkuZmlsZSgnJykpO1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRoaXMgc2xlZXAsIGFzIHdlIGhhdmUgYSBkZWJvdW5jZSAoc28gbGV0cyB3YWl0KS5cclxuICAgICAgICAgICAgeWllbGQgYXN5bmNfMS5zbGVlcCgxMCk7XHJcbiAgICAgICAgICAgIGNoYWlfMS5leHBlY3QoaW52b2tlZCkudG8uYmUuZXF1YWwodHJ1ZSwgJ2ludmFsaWQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHRlc3QoJ0NoZWNrIGZpbGUgY2hhbmdlIGhhbmRsZXIgb24gV2luZG93cycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBlbnN1cmVGaWxlQ2hhbmVzQXJlSGFuZGxlZChwbGF0Zm9ybV8xLk9TVHlwZS5XaW5kb3dzKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0NoZWNrIGZpbGUgY2hhbmdlIGhhbmRsZXIgb24gTWFjJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIGVuc3VyZUZpbGVDaGFuZXNBcmVIYW5kbGVkKHBsYXRmb3JtXzEuT1NUeXBlLk9TWCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdDaGVjayBmaWxlIGNoYW5nZSBoYW5kbGVyIG9uIExpbnV4JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIGVuc3VyZUZpbGVDaGFuZXNBcmVIYW5kbGVkKHBsYXRmb3JtXzEuT1NUeXBlLkxpbnV4KTtcclxuICAgIH0pKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS51bml0LnRlc3QuanMubWFwIl19