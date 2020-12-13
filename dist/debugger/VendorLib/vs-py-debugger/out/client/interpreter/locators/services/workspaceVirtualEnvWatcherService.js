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

const path = require("path");

const vscode_1 = require("vscode");

const types_1 = require("../../../common/application/types");

require("../../../common/extensions");

const logger_1 = require("../../../common/logger");

const types_2 = require("../../../common/platform/types");

const types_3 = require("../../../common/process/types");

const types_4 = require("../../../common/types");

const maxTimeToWaitForEnvCreation = 60000;
const timeToPollForEnvCreation = 2000;
let WorkspaceVirtualEnvWatcherService = class WorkspaceVirtualEnvWatcherService {
  constructor(disposableRegistry, workspaceService, platformService, pythonExecFactory) {
    this.disposableRegistry = disposableRegistry;
    this.workspaceService = workspaceService;
    this.platformService = platformService;
    this.pythonExecFactory = pythonExecFactory;
    this.timers = new Map();
    this.fsWatchers = [];
    this.didCreate = new vscode_1.EventEmitter();
    disposableRegistry.push(this);
  }

  get onDidCreate() {
    return this.didCreate.event;
  }

  dispose() {
    this.clearTimers();
  }

  register(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.fsWatchers.length > 0) {
        return;
      }

      const workspaceFolder = resource ? this.workspaceService.getWorkspaceFolder(resource) : undefined;
      const executable = this.platformService.isWindows ? 'python.exe' : 'python';
      const patterns = [path.join('*', executable), path.join('*', '*', executable)];

      for (const pattern of patterns) {
        const globPatern = workspaceFolder ? new vscode_1.RelativePattern(workspaceFolder.uri.fsPath, pattern) : pattern;
        logger_1.Logger.verbose(`Create file systemwatcher with pattern ${pattern}`);
        const fsWatcher = this.workspaceService.createFileSystemWatcher(globPatern);
        fsWatcher.onDidCreate(e => this.createHandler(e), this, this.disposableRegistry);
        this.disposableRegistry.push(fsWatcher);
        this.fsWatchers.push(fsWatcher);
      }
    });
  }

  createHandler(e) {
    return __awaiter(this, void 0, void 0, function* () {
      this.didCreate.fire(); // On Windows, creation of environments are very slow, hence lets notify again after
      // the python executable is accessible (i.e. when we can launch the process).

      this.notifyCreationWhenReady(e.fsPath).ignoreErrors();
    });
  }

  notifyCreationWhenReady(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const counter = this.timers.has(pythonPath) ? this.timers.get(pythonPath).counter + 1 : 0;
      const isValid = yield this.isValidExecutable(pythonPath);

      if (isValid) {
        if (counter > 0) {
          this.didCreate.fire();
        }

        return this.timers.delete(pythonPath);
      }

      if (counter > maxTimeToWaitForEnvCreation / timeToPollForEnvCreation) {
        // Send notification before we give up trying.
        this.didCreate.fire();
        this.timers.delete(pythonPath);
        return;
      }

      const timer = setTimeout(() => this.notifyCreationWhenReady(pythonPath).ignoreErrors(), timeToPollForEnvCreation);
      this.timers.set(pythonPath, {
        timer,
        counter
      });
    });
  }

  clearTimers() {
    this.timers.forEach(item => clearTimeout(item.timer));
    this.timers.clear();
  }

  isValidExecutable(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const execService = yield this.pythonExecFactory.create({
        pythonPath
      });
      const info = yield execService.getInterpreterInformation().catch(() => undefined);
      return info !== undefined;
    });
  }

};

__decorate([logger_1.traceVerbose('Register Intepreter Watcher')], WorkspaceVirtualEnvWatcherService.prototype, "register", null);

__decorate([logger_1.traceVerbose('Intepreter Watcher change handler')], WorkspaceVirtualEnvWatcherService.prototype, "createHandler", null);

WorkspaceVirtualEnvWatcherService = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_4.IDisposableRegistry)), __param(1, inversify_1.inject(types_1.IWorkspaceService)), __param(2, inversify_1.inject(types_2.IPlatformService)), __param(3, inversify_1.inject(types_3.IPythonExecutionFactory))], WorkspaceVirtualEnvWatcherService);
exports.WorkspaceVirtualEnvWatcherService = WorkspaceVirtualEnvWatcherService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX3BhcmFtIiwicGFyYW1JbmRleCIsImRlY29yYXRvciIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJleHBvcnRzIiwiaW52ZXJzaWZ5XzEiLCJyZXF1aXJlIiwicGF0aCIsInZzY29kZV8xIiwidHlwZXNfMSIsImxvZ2dlcl8xIiwidHlwZXNfMiIsInR5cGVzXzMiLCJ0eXBlc180IiwibWF4VGltZVRvV2FpdEZvckVudkNyZWF0aW9uIiwidGltZVRvUG9sbEZvckVudkNyZWF0aW9uIiwiV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJkaXNwb3NhYmxlUmVnaXN0cnkiLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwicGxhdGZvcm1TZXJ2aWNlIiwicHl0aG9uRXhlY0ZhY3RvcnkiLCJ0aW1lcnMiLCJNYXAiLCJmc1dhdGNoZXJzIiwiZGlkQ3JlYXRlIiwiRXZlbnRFbWl0dGVyIiwicHVzaCIsIm9uRGlkQ3JlYXRlIiwiZXZlbnQiLCJkaXNwb3NlIiwiY2xlYXJUaW1lcnMiLCJyZWdpc3RlciIsInJlc291cmNlIiwid29ya3NwYWNlRm9sZGVyIiwiZ2V0V29ya3NwYWNlRm9sZGVyIiwidW5kZWZpbmVkIiwiZXhlY3V0YWJsZSIsImlzV2luZG93cyIsInBhdHRlcm5zIiwiam9pbiIsInBhdHRlcm4iLCJnbG9iUGF0ZXJuIiwiUmVsYXRpdmVQYXR0ZXJuIiwidXJpIiwiZnNQYXRoIiwiTG9nZ2VyIiwidmVyYm9zZSIsImZzV2F0Y2hlciIsImNyZWF0ZUZpbGVTeXN0ZW1XYXRjaGVyIiwiY3JlYXRlSGFuZGxlciIsImZpcmUiLCJub3RpZnlDcmVhdGlvbldoZW5SZWFkeSIsImlnbm9yZUVycm9ycyIsInB5dGhvblBhdGgiLCJjb3VudGVyIiwiaGFzIiwiZ2V0IiwiaXNWYWxpZCIsImlzVmFsaWRFeGVjdXRhYmxlIiwiZGVsZXRlIiwidGltZXIiLCJzZXRUaW1lb3V0Iiwic2V0IiwiZm9yRWFjaCIsIml0ZW0iLCJjbGVhclRpbWVvdXQiLCJjbGVhciIsImV4ZWNTZXJ2aWNlIiwiY3JlYXRlIiwiaW5mbyIsImdldEludGVycHJldGVySW5mb3JtYXRpb24iLCJjYXRjaCIsInRyYWNlVmVyYm9zZSIsInByb3RvdHlwZSIsImluamVjdGFibGUiLCJpbmplY3QiLCJJRGlzcG9zYWJsZVJlZ2lzdHJ5IiwiSVdvcmtzcGFjZVNlcnZpY2UiLCJJUGxhdGZvcm1TZXJ2aWNlIiwiSVB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJDLENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQUosR0FBUUgsTUFBUixHQUFpQkUsSUFBSSxLQUFLLElBQVQsR0FBZ0JBLElBQUksR0FBR0ssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUFySDtBQUFBLE1BQTJITyxDQUEzSDtBQUNB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Q0FBQzBELFNBRjNCLEVBRXNDLFVBRnRDLEVBRWtELElBRmxELENBQVY7O0FBR0EzRyxVQUFVLENBQUMsQ0FDUDJDLFFBQVEsQ0FBQytELFlBQVQsQ0FBc0IsbUNBQXRCLENBRE8sQ0FBRCxFQUVQekQsaUNBQWlDLENBQUMwRCxTQUYzQixFQUVzQyxlQUZ0QyxFQUV1RCxJQUZ2RCxDQUFWOztBQUdBMUQsaUNBQWlDLEdBQUdqRCxVQUFVLENBQUMsQ0FDM0NzQyxXQUFXLENBQUNzRSxVQUFaLEVBRDJDLEVBRTNDNUYsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQ3VFLE1BQVosQ0FBbUIvRCxPQUFPLENBQUNnRSxtQkFBM0IsQ0FBSixDQUZvQyxFQUczQzlGLE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUN1RSxNQUFaLENBQW1CbkUsT0FBTyxDQUFDcUUsaUJBQTNCLENBQUosQ0FIb0MsRUFJM0MvRixPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDdUUsTUFBWixDQUFtQmpFLE9BQU8sQ0FBQ29FLGdCQUEzQixDQUFKLENBSm9DLEVBSzNDaEcsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQ3VFLE1BQVosQ0FBbUJoRSxPQUFPLENBQUNvRSx1QkFBM0IsQ0FBSixDQUxvQyxDQUFELEVBTTNDaEUsaUNBTjJDLENBQTlDO0FBT0FaLE9BQU8sQ0FBQ1ksaUNBQVIsR0FBNENBLGlDQUE1QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuJ3VzZSBzdHJpY3QnO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmNvbnN0IHZzY29kZV8xID0gcmVxdWlyZShcInZzY29kZVwiKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xucmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9leHRlbnNpb25zXCIpO1xuY29uc3QgbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2xvZ2dlclwiKTtcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BsYXRmb3JtL3R5cGVzXCIpO1xuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcHJvY2Vzcy90eXBlc1wiKTtcbmNvbnN0IHR5cGVzXzQgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3R5cGVzXCIpO1xuY29uc3QgbWF4VGltZVRvV2FpdEZvckVudkNyZWF0aW9uID0gNjAwMDA7XG5jb25zdCB0aW1lVG9Qb2xsRm9yRW52Q3JlYXRpb24gPSAyMDAwO1xubGV0IFdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSA9IGNsYXNzIFdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoZGlzcG9zYWJsZVJlZ2lzdHJ5LCB3b3Jrc3BhY2VTZXJ2aWNlLCBwbGF0Zm9ybVNlcnZpY2UsIHB5dGhvbkV4ZWNGYWN0b3J5KSB7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZVJlZ2lzdHJ5ID0gZGlzcG9zYWJsZVJlZ2lzdHJ5O1xuICAgICAgICB0aGlzLndvcmtzcGFjZVNlcnZpY2UgPSB3b3Jrc3BhY2VTZXJ2aWNlO1xuICAgICAgICB0aGlzLnBsYXRmb3JtU2VydmljZSA9IHBsYXRmb3JtU2VydmljZTtcbiAgICAgICAgdGhpcy5weXRob25FeGVjRmFjdG9yeSA9IHB5dGhvbkV4ZWNGYWN0b3J5O1xuICAgICAgICB0aGlzLnRpbWVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5mc1dhdGNoZXJzID0gW107XG4gICAgICAgIHRoaXMuZGlkQ3JlYXRlID0gbmV3IHZzY29kZV8xLkV2ZW50RW1pdHRlcigpO1xuICAgICAgICBkaXNwb3NhYmxlUmVnaXN0cnkucHVzaCh0aGlzKTtcbiAgICB9XG4gICAgZ2V0IG9uRGlkQ3JlYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWRDcmVhdGUuZXZlbnQ7XG4gICAgfVxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcbiAgICB9XG4gICAgcmVnaXN0ZXIocmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZzV2F0Y2hlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHdvcmtzcGFjZUZvbGRlciA9IHJlc291cmNlID8gdGhpcy53b3Jrc3BhY2VTZXJ2aWNlLmdldFdvcmtzcGFjZUZvbGRlcihyZXNvdXJjZSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBleGVjdXRhYmxlID0gdGhpcy5wbGF0Zm9ybVNlcnZpY2UuaXNXaW5kb3dzID8gJ3B5dGhvbi5leGUnIDogJ3B5dGhvbic7XG4gICAgICAgICAgICBjb25zdCBwYXR0ZXJucyA9IFtwYXRoLmpvaW4oJyonLCBleGVjdXRhYmxlKSwgcGF0aC5qb2luKCcqJywgJyonLCBleGVjdXRhYmxlKV07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgcGF0dGVybnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbG9iUGF0ZXJuID0gd29ya3NwYWNlRm9sZGVyID8gbmV3IHZzY29kZV8xLlJlbGF0aXZlUGF0dGVybih3b3Jrc3BhY2VGb2xkZXIudXJpLmZzUGF0aCwgcGF0dGVybikgOiBwYXR0ZXJuO1xuICAgICAgICAgICAgICAgIGxvZ2dlcl8xLkxvZ2dlci52ZXJib3NlKGBDcmVhdGUgZmlsZSBzeXN0ZW13YXRjaGVyIHdpdGggcGF0dGVybiAke3BhdHRlcm59YCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZnNXYXRjaGVyID0gdGhpcy53b3Jrc3BhY2VTZXJ2aWNlLmNyZWF0ZUZpbGVTeXN0ZW1XYXRjaGVyKGdsb2JQYXRlcm4pO1xuICAgICAgICAgICAgICAgIGZzV2F0Y2hlci5vbkRpZENyZWF0ZShlID0+IHRoaXMuY3JlYXRlSGFuZGxlcihlKSwgdGhpcywgdGhpcy5kaXNwb3NhYmxlUmVnaXN0cnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcG9zYWJsZVJlZ2lzdHJ5LnB1c2goZnNXYXRjaGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZzV2F0Y2hlcnMucHVzaChmc1dhdGNoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlSGFuZGxlcihlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRpZENyZWF0ZS5maXJlKCk7XG4gICAgICAgICAgICAvLyBPbiBXaW5kb3dzLCBjcmVhdGlvbiBvZiBlbnZpcm9ubWVudHMgYXJlIHZlcnkgc2xvdywgaGVuY2UgbGV0cyBub3RpZnkgYWdhaW4gYWZ0ZXJcbiAgICAgICAgICAgIC8vIHRoZSBweXRob24gZXhlY3V0YWJsZSBpcyBhY2Nlc3NpYmxlIChpLmUuIHdoZW4gd2UgY2FuIGxhdW5jaCB0aGUgcHJvY2VzcykuXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNyZWF0aW9uV2hlblJlYWR5KGUuZnNQYXRoKS5pZ25vcmVFcnJvcnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vdGlmeUNyZWF0aW9uV2hlblJlYWR5KHB5dGhvblBhdGgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLnRpbWVycy5oYXMocHl0aG9uUGF0aCkgPyB0aGlzLnRpbWVycy5nZXQocHl0aG9uUGF0aCkuY291bnRlciArIDEgOiAwO1xuICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHlpZWxkIHRoaXMuaXNWYWxpZEV4ZWN1dGFibGUocHl0aG9uUGF0aCk7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpZENyZWF0ZS5maXJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRpbWVycy5kZWxldGUocHl0aG9uUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRlciA+IChtYXhUaW1lVG9XYWl0Rm9yRW52Q3JlYXRpb24gLyB0aW1lVG9Qb2xsRm9yRW52Q3JlYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gYmVmb3JlIHdlIGdpdmUgdXAgdHJ5aW5nLlxuICAgICAgICAgICAgICAgIHRoaXMuZGlkQ3JlYXRlLmZpcmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVycy5kZWxldGUocHl0aG9uUGF0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMubm90aWZ5Q3JlYXRpb25XaGVuUmVhZHkocHl0aG9uUGF0aCkuaWdub3JlRXJyb3JzKCksIHRpbWVUb1BvbGxGb3JFbnZDcmVhdGlvbik7XG4gICAgICAgICAgICB0aGlzLnRpbWVycy5zZXQocHl0aG9uUGF0aCwgeyB0aW1lciwgY291bnRlciB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyVGltZXJzKCkge1xuICAgICAgICB0aGlzLnRpbWVycy5mb3JFYWNoKGl0ZW0gPT4gY2xlYXJUaW1lb3V0KGl0ZW0udGltZXIpKTtcbiAgICAgICAgdGhpcy50aW1lcnMuY2xlYXIoKTtcbiAgICB9XG4gICAgaXNWYWxpZEV4ZWN1dGFibGUocHl0aG9uUGF0aCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZXhlY1NlcnZpY2UgPSB5aWVsZCB0aGlzLnB5dGhvbkV4ZWNGYWN0b3J5LmNyZWF0ZSh7IHB5dGhvblBhdGggfSk7XG4gICAgICAgICAgICBjb25zdCBpbmZvID0geWllbGQgZXhlY1NlcnZpY2UuZ2V0SW50ZXJwcmV0ZXJJbmZvcm1hdGlvbigpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mbyAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuX19kZWNvcmF0ZShbXG4gICAgbG9nZ2VyXzEudHJhY2VWZXJib3NlKCdSZWdpc3RlciBJbnRlcHJldGVyIFdhdGNoZXInKVxuXSwgV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZSwgXCJyZWdpc3RlclwiLCBudWxsKTtcbl9fZGVjb3JhdGUoW1xuICAgIGxvZ2dlcl8xLnRyYWNlVmVyYm9zZSgnSW50ZXByZXRlciBXYXRjaGVyIGNoYW5nZSBoYW5kbGVyJylcbl0sIFdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS5wcm90b3R5cGUsIFwiY3JlYXRlSGFuZGxlclwiLCBudWxsKTtcbldvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSA9IF9fZGVjb3JhdGUoW1xuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc180LklEaXNwb3NhYmxlUmVnaXN0cnkpKSxcbiAgICBfX3BhcmFtKDEsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklXb3Jrc3BhY2VTZXJ2aWNlKSksXG4gICAgX19wYXJhbSgyLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMi5JUGxhdGZvcm1TZXJ2aWNlKSksXG4gICAgX19wYXJhbSgzLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMy5JUHl0aG9uRXhlY3V0aW9uRmFjdG9yeSkpXG5dLCBXb3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2UpO1xuZXhwb3J0cy5Xb3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2UgPSBXb3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD13b3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2UuanMubWFwIl19