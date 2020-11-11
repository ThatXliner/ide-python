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

const path = require("path");

const vscode_1 = require("vscode");

const types_1 = require("../../../common/application/types");

const types_2 = require("../../../common/platform/types");

const types_3 = require("../../../common/process/types");

const types_4 = require("../../../common/types");

const types_5 = require("../../../ioc/types");

const contracts_1 = require("../../contracts");

const cacheableLocatorService_1 = require("./cacheableLocatorService");

const execName = 'pipenv';
const pipEnvFileNameVariable = 'PIPENV_PIPFILE';
let PipEnvService = class PipEnvService extends cacheableLocatorService_1.CacheableLocatorService {
  constructor(serviceContainer) {
    super('PipEnvService', serviceContainer);
    this.helper = this.serviceContainer.get(contracts_1.IInterpreterHelper);
    this.processServiceFactory = this.serviceContainer.get(types_3.IProcessServiceFactory);
    this.workspace = this.serviceContainer.get(types_1.IWorkspaceService);
    this.fs = this.serviceContainer.get(types_2.IFileSystem);
    this.logger = this.serviceContainer.get(types_4.ILogger);
  } // tslint:disable-next-line:no-empty


  dispose() {}

  isRelatedPipEnvironment(dir, pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      // In PipEnv, the name of the cwd is used as a prefix in the virtual env.
      if (pythonPath.indexOf(`${path.sep}${path.basename(dir)}-`) === -1) {
        return false;
      }

      const envName = yield this.getInterpreterPathFromPipenv(dir, true);
      return !!envName;
    });
  }

  getInterpretersImplementation(resource) {
    const pipenvCwd = this.getPipenvWorkingDirectory(resource);

    if (!pipenvCwd) {
      return Promise.resolve([]);
    }

    return this.getInterpreterFromPipenv(pipenvCwd).then(item => item ? [item] : []).catch(() => []);
  }

  getInterpreterFromPipenv(pipenvCwd) {
    return __awaiter(this, void 0, void 0, function* () {
      const interpreterPath = yield this.getInterpreterPathFromPipenv(pipenvCwd);

      if (!interpreterPath) {
        return;
      }

      const details = yield this.helper.getInterpreterInformation(interpreterPath);

      if (!details) {
        return;
      }

      return Object.assign({}, details, {
        path: interpreterPath,
        type: contracts_1.InterpreterType.PipEnv
      });
    });
  }

  getPipenvWorkingDirectory(resource) {
    // The file is not in a workspace. However, workspace may be opened
    // and file is just a random file opened from elsewhere. In this case
    // we still want to provide interpreter associated with the workspace.
    // Otherwise if user tries and formats the file, we may end up using
    // plain pip module installer to bring in the formatter and it is wrong.
    const wsFolder = resource ? this.workspace.getWorkspaceFolder(resource) : undefined;
    return wsFolder ? wsFolder.uri.fsPath : this.workspace.rootPath;
  }

  getInterpreterPathFromPipenv(cwd, ignoreErrors = false) {
    return __awaiter(this, void 0, void 0, function* () {
      // Quick check before actually running pipenv
      if (!(yield this.checkIfPipFileExists(cwd))) {
        return;
      }

      try {
        const pythonPath = yield this.invokePipenv('--py', cwd); // TODO: Why do we need to do this?

        return pythonPath && (yield this.fs.fileExists(pythonPath)) ? pythonPath : undefined; // tslint:disable-next-line:no-empty
      } catch (error) {
        console.error(error);

        if (ignoreErrors) {
          return;
        }

        const errorMessage = error.message || error;
        const appShell = this.serviceContainer.get(types_1.IApplicationShell);
        appShell.showWarningMessage(`Workspace contains pipfile but attempt to run 'pipenv --py' failed with ${errorMessage}. Make sure pipenv is on the PATH.`);
      }
    });
  }

  checkIfPipFileExists(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
      const currentProcess = this.serviceContainer.get(types_4.ICurrentProcess);
      const pipFileName = currentProcess.env[pipEnvFileNameVariable];

      if (typeof pipFileName === 'string' && (yield this.fs.fileExists(path.join(cwd, pipFileName)))) {
        return true;
      }

      if (yield this.fs.fileExists(path.join(cwd, 'Pipfile'))) {
        return true;
      }

      return false;
    });
  }

  invokePipenv(arg, rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const processService = yield this.processServiceFactory.create(vscode_1.Uri.file(rootPath));
        const result = yield processService.exec(execName, [arg], {
          cwd: rootPath
        });

        if (result) {
          const stdout = result.stdout ? result.stdout.trim() : '';
          const stderr = result.stderr ? result.stderr.trim() : '';

          if (stderr.length > 0 && stdout.length === 0) {
            throw new Error(stderr);
          }

          return stdout;
        } // tslint:disable-next-line:no-empty

      } catch (error) {
        const platformService = this.serviceContainer.get(types_2.IPlatformService);
        const currentProc = this.serviceContainer.get(types_4.ICurrentProcess);
        const enviromentVariableValues = {
          LC_ALL: currentProc.env.LC_ALL,
          LANG: currentProc.env.LANG
        };
        enviromentVariableValues[platformService.pathVariableName] = currentProc.env[platformService.pathVariableName];
        this.logger.logWarning('Error in invoking PipEnv', error);
        this.logger.logWarning(`Relevant Environment Variables ${JSON.stringify(enviromentVariableValues, undefined, 4)}`);
        const errorMessage = error.message || error;
        const appShell = this.serviceContainer.get(types_1.IApplicationShell);
        appShell.showWarningMessage(`Workspace contains pipfile but attempt to run 'pipenv --venv' failed with '${errorMessage}'. Make sure pipenv is on the PATH.`);
      }
    });
  }

};
PipEnvService = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_5.IServiceContainer))], PipEnvService);
exports.PipEnvService = PipEnvService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcEVudlNlcnZpY2UuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInBhdGgiLCJ2c2NvZGVfMSIsInR5cGVzXzEiLCJ0eXBlc18yIiwidHlwZXNfMyIsInR5cGVzXzQiLCJ0eXBlc181IiwiY29udHJhY3RzXzEiLCJjYWNoZWFibGVMb2NhdG9yU2VydmljZV8xIiwiZXhlY05hbWUiLCJwaXBFbnZGaWxlTmFtZVZhcmlhYmxlIiwiUGlwRW52U2VydmljZSIsIkNhY2hlYWJsZUxvY2F0b3JTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlQ29udGFpbmVyIiwiaGVscGVyIiwiZ2V0IiwiSUludGVycHJldGVySGVscGVyIiwicHJvY2Vzc1NlcnZpY2VGYWN0b3J5IiwiSVByb2Nlc3NTZXJ2aWNlRmFjdG9yeSIsIndvcmtzcGFjZSIsIklXb3Jrc3BhY2VTZXJ2aWNlIiwiZnMiLCJJRmlsZVN5c3RlbSIsImxvZ2dlciIsIklMb2dnZXIiLCJkaXNwb3NlIiwiaXNSZWxhdGVkUGlwRW52aXJvbm1lbnQiLCJkaXIiLCJweXRob25QYXRoIiwiaW5kZXhPZiIsInNlcCIsImJhc2VuYW1lIiwiZW52TmFtZSIsImdldEludGVycHJldGVyUGF0aEZyb21QaXBlbnYiLCJnZXRJbnRlcnByZXRlcnNJbXBsZW1lbnRhdGlvbiIsInJlc291cmNlIiwicGlwZW52Q3dkIiwiZ2V0UGlwZW52V29ya2luZ0RpcmVjdG9yeSIsImdldEludGVycHJldGVyRnJvbVBpcGVudiIsIml0ZW0iLCJjYXRjaCIsImludGVycHJldGVyUGF0aCIsImRldGFpbHMiLCJnZXRJbnRlcnByZXRlckluZm9ybWF0aW9uIiwiYXNzaWduIiwidHlwZSIsIkludGVycHJldGVyVHlwZSIsIlBpcEVudiIsIndzRm9sZGVyIiwiZ2V0V29ya3NwYWNlRm9sZGVyIiwidW5kZWZpbmVkIiwidXJpIiwiZnNQYXRoIiwicm9vdFBhdGgiLCJjd2QiLCJpZ25vcmVFcnJvcnMiLCJjaGVja0lmUGlwRmlsZUV4aXN0cyIsImludm9rZVBpcGVudiIsImZpbGVFeGlzdHMiLCJlcnJvciIsImNvbnNvbGUiLCJlcnJvck1lc3NhZ2UiLCJtZXNzYWdlIiwiYXBwU2hlbGwiLCJJQXBwbGljYXRpb25TaGVsbCIsInNob3dXYXJuaW5nTWVzc2FnZSIsImN1cnJlbnRQcm9jZXNzIiwiSUN1cnJlbnRQcm9jZXNzIiwicGlwRmlsZU5hbWUiLCJlbnYiLCJqb2luIiwiYXJnIiwicHJvY2Vzc1NlcnZpY2UiLCJjcmVhdGUiLCJVcmkiLCJmaWxlIiwiZXhlYyIsInN0ZG91dCIsInRyaW0iLCJzdGRlcnIiLCJFcnJvciIsInBsYXRmb3JtU2VydmljZSIsIklQbGF0Zm9ybVNlcnZpY2UiLCJjdXJyZW50UHJvYyIsImVudmlyb21lbnRWYXJpYWJsZVZhbHVlcyIsIkxDX0FMTCIsIkxBTkciLCJwYXRoVmFyaWFibGVOYW1lIiwibG9nV2FybmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VDb250YWluZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVB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QWlDQyxJQUFJLENBQUNDLFNBQUwsQ0FBZU4sd0JBQWYsRUFBeUNsQyxTQUF6QyxFQUFvRCxDQUFwRCxDQUF1RCxFQUFoSDtBQUNBLGNBQU1XLFlBQVksR0FBR0YsS0FBSyxDQUFDRyxPQUFOLElBQWlCSCxLQUF0QztBQUNBLGNBQU1JLFFBQVEsR0FBRyxLQUFLbEQsZ0JBQUwsQ0FBc0JFLEdBQXRCLENBQTBCZCxPQUFPLENBQUMrRCxpQkFBbEMsQ0FBakI7QUFDQUQsUUFBQUEsUUFBUSxDQUFDRSxrQkFBVCxDQUE2Qiw4RUFBNkVKLFlBQWEscUNBQXZIO0FBQ0g7QUFDSixLQTVCZSxDQUFoQjtBQTZCSDs7QUF0SDZGLENBQWxHO0FBd0hBbkQsYUFBYSxHQUFHbkQsVUFBVSxDQUFDLENBQ3ZCc0MsV0FBVyxDQUFDOEYsVUFBWixFQUR1QixFQUV2QnBILE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUMrRixNQUFaLENBQW1CdkYsT0FBTyxDQUFDd0YsaUJBQTNCLENBQUosQ0FGZ0IsQ0FBRCxFQUd2Qm5GLGFBSHVCLENBQTFCO0FBSUFkLE9BQU8sQ0FBQ2MsYUFBUixHQUF3QkEsYUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wbGF0Zm9ybS90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcHJvY2Vzcy90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfNCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IHR5cGVzXzUgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW9jL3R5cGVzXCIpO1xyXG5jb25zdCBjb250cmFjdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb250cmFjdHNcIik7XHJcbmNvbnN0IGNhY2hlYWJsZUxvY2F0b3JTZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9jYWNoZWFibGVMb2NhdG9yU2VydmljZVwiKTtcclxuY29uc3QgZXhlY05hbWUgPSAncGlwZW52JztcclxuY29uc3QgcGlwRW52RmlsZU5hbWVWYXJpYWJsZSA9ICdQSVBFTlZfUElQRklMRSc7XHJcbmxldCBQaXBFbnZTZXJ2aWNlID0gY2xhc3MgUGlwRW52U2VydmljZSBleHRlbmRzIGNhY2hlYWJsZUxvY2F0b3JTZXJ2aWNlXzEuQ2FjaGVhYmxlTG9jYXRvclNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lcikge1xyXG4gICAgICAgIHN1cGVyKCdQaXBFbnZTZXJ2aWNlJywgc2VydmljZUNvbnRhaW5lcik7XHJcbiAgICAgICAgdGhpcy5oZWxwZXIgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KGNvbnRyYWN0c18xLklJbnRlcnByZXRlckhlbHBlcik7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzU2VydmljZUZhY3RvcnkgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzMuSVByb2Nlc3NTZXJ2aWNlRmFjdG9yeSk7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzEuSVdvcmtzcGFjZVNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuZnMgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUZpbGVTeXN0ZW0pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc180LklMb2dnZXIpO1xyXG4gICAgfVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWVtcHR5XHJcbiAgICBkaXNwb3NlKCkgeyB9XHJcbiAgICBpc1JlbGF0ZWRQaXBFbnZpcm9ubWVudChkaXIsIHB5dGhvblBhdGgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAvLyBJbiBQaXBFbnYsIHRoZSBuYW1lIG9mIHRoZSBjd2QgaXMgdXNlZCBhcyBhIHByZWZpeCBpbiB0aGUgdmlydHVhbCBlbnYuXHJcbiAgICAgICAgICAgIGlmIChweXRob25QYXRoLmluZGV4T2YoYCR7cGF0aC5zZXB9JHtwYXRoLmJhc2VuYW1lKGRpcil9LWApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudk5hbWUgPSB5aWVsZCB0aGlzLmdldEludGVycHJldGVyUGF0aEZyb21QaXBlbnYoZGlyLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuICEhZW52TmFtZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldEludGVycHJldGVyc0ltcGxlbWVudGF0aW9uKHJlc291cmNlKSB7XHJcbiAgICAgICAgY29uc3QgcGlwZW52Q3dkID0gdGhpcy5nZXRQaXBlbnZXb3JraW5nRGlyZWN0b3J5KHJlc291cmNlKTtcclxuICAgICAgICBpZiAoIXBpcGVudkN3ZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW50ZXJwcmV0ZXJGcm9tUGlwZW52KHBpcGVudkN3ZClcclxuICAgICAgICAgICAgLnRoZW4oaXRlbSA9PiBpdGVtID8gW2l0ZW1dIDogW10pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBbXSk7XHJcbiAgICB9XHJcbiAgICBnZXRJbnRlcnByZXRlckZyb21QaXBlbnYocGlwZW52Q3dkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJwcmV0ZXJQYXRoID0geWllbGQgdGhpcy5nZXRJbnRlcnByZXRlclBhdGhGcm9tUGlwZW52KHBpcGVudkN3ZCk7XHJcbiAgICAgICAgICAgIGlmICghaW50ZXJwcmV0ZXJQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZGV0YWlscyA9IHlpZWxkIHRoaXMuaGVscGVyLmdldEludGVycHJldGVySW5mb3JtYXRpb24oaW50ZXJwcmV0ZXJQYXRoKTtcclxuICAgICAgICAgICAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRldGFpbHMsIHsgcGF0aDogaW50ZXJwcmV0ZXJQYXRoLCB0eXBlOiBjb250cmFjdHNfMS5JbnRlcnByZXRlclR5cGUuUGlwRW52IH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0UGlwZW52V29ya2luZ0RpcmVjdG9yeShyZXNvdXJjZSkge1xyXG4gICAgICAgIC8vIFRoZSBmaWxlIGlzIG5vdCBpbiBhIHdvcmtzcGFjZS4gSG93ZXZlciwgd29ya3NwYWNlIG1heSBiZSBvcGVuZWRcclxuICAgICAgICAvLyBhbmQgZmlsZSBpcyBqdXN0IGEgcmFuZG9tIGZpbGUgb3BlbmVkIGZyb20gZWxzZXdoZXJlLiBJbiB0aGlzIGNhc2VcclxuICAgICAgICAvLyB3ZSBzdGlsbCB3YW50IHRvIHByb3ZpZGUgaW50ZXJwcmV0ZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSB3b3Jrc3BhY2UuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGlmIHVzZXIgdHJpZXMgYW5kIGZvcm1hdHMgdGhlIGZpbGUsIHdlIG1heSBlbmQgdXAgdXNpbmdcclxuICAgICAgICAvLyBwbGFpbiBwaXAgbW9kdWxlIGluc3RhbGxlciB0byBicmluZyBpbiB0aGUgZm9ybWF0dGVyIGFuZCBpdCBpcyB3cm9uZy5cclxuICAgICAgICBjb25zdCB3c0ZvbGRlciA9IHJlc291cmNlID8gdGhpcy53b3Jrc3BhY2UuZ2V0V29ya3NwYWNlRm9sZGVyKHJlc291cmNlKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gd3NGb2xkZXIgPyB3c0ZvbGRlci51cmkuZnNQYXRoIDogdGhpcy53b3Jrc3BhY2Uucm9vdFBhdGg7XHJcbiAgICB9XHJcbiAgICBnZXRJbnRlcnByZXRlclBhdGhGcm9tUGlwZW52KGN3ZCwgaWdub3JlRXJyb3JzID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAvLyBRdWljayBjaGVjayBiZWZvcmUgYWN0dWFsbHkgcnVubmluZyBwaXBlbnZcclxuICAgICAgICAgICAgaWYgKCEoeWllbGQgdGhpcy5jaGVja0lmUGlwRmlsZUV4aXN0cyhjd2QpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBweXRob25QYXRoID0geWllbGQgdGhpcy5pbnZva2VQaXBlbnYoJy0tcHknLCBjd2QpO1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogV2h5IGRvIHdlIG5lZWQgdG8gZG8gdGhpcz9cclxuICAgICAgICAgICAgICAgIHJldHVybiBweXRob25QYXRoICYmICh5aWVsZCB0aGlzLmZzLmZpbGVFeGlzdHMocHl0aG9uUGF0aCkpID8gcHl0aG9uUGF0aCA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWdub3JlRXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBlcnJvcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcFNoZWxsID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklBcHBsaWNhdGlvblNoZWxsKTtcclxuICAgICAgICAgICAgICAgIGFwcFNoZWxsLnNob3dXYXJuaW5nTWVzc2FnZShgV29ya3NwYWNlIGNvbnRhaW5zIHBpcGZpbGUgYnV0IGF0dGVtcHQgdG8gcnVuICdwaXBlbnYgLS1weScgZmFpbGVkIHdpdGggJHtlcnJvck1lc3NhZ2V9LiBNYWtlIHN1cmUgcGlwZW52IGlzIG9uIHRoZSBQQVRILmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjaGVja0lmUGlwRmlsZUV4aXN0cyhjd2QpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvY2VzcyA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfNC5JQ3VycmVudFByb2Nlc3MpO1xyXG4gICAgICAgICAgICBjb25zdCBwaXBGaWxlTmFtZSA9IGN1cnJlbnRQcm9jZXNzLmVudltwaXBFbnZGaWxlTmFtZVZhcmlhYmxlXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwaXBGaWxlTmFtZSA9PT0gJ3N0cmluZycgJiYgKHlpZWxkIHRoaXMuZnMuZmlsZUV4aXN0cyhwYXRoLmpvaW4oY3dkLCBwaXBGaWxlTmFtZSkpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHlpZWxkIHRoaXMuZnMuZmlsZUV4aXN0cyhwYXRoLmpvaW4oY3dkLCAnUGlwZmlsZScpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaW52b2tlUGlwZW52KGFyZywgcm9vdFBhdGgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvY2Vzc1NlcnZpY2UgPSB5aWVsZCB0aGlzLnByb2Nlc3NTZXJ2aWNlRmFjdG9yeS5jcmVhdGUodnNjb2RlXzEuVXJpLmZpbGUocm9vdFBhdGgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHlpZWxkIHByb2Nlc3NTZXJ2aWNlLmV4ZWMoZXhlY05hbWUsIFthcmddLCB7IGN3ZDogcm9vdFBhdGggfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3Rkb3V0ID0gcmVzdWx0LnN0ZG91dCA/IHJlc3VsdC5zdGRvdXQudHJpbSgpIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RkZXJyID0gcmVzdWx0LnN0ZGVyciA/IHJlc3VsdC5zdGRlcnIudHJpbSgpIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZGVyci5sZW5ndGggPiAwICYmIHN0ZG91dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0ZGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtU2VydmljZSA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JUGxhdGZvcm1TZXJ2aWNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9jID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc180LklDdXJyZW50UHJvY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnZpcm9tZW50VmFyaWFibGVWYWx1ZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTENfQUxMOiBjdXJyZW50UHJvYy5lbnYuTENfQUxMLFxyXG4gICAgICAgICAgICAgICAgICAgIExBTkc6IGN1cnJlbnRQcm9jLmVudi5MQU5HXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZW52aXJvbWVudFZhcmlhYmxlVmFsdWVzW3BsYXRmb3JtU2VydmljZS5wYXRoVmFyaWFibGVOYW1lXSA9IGN1cnJlbnRQcm9jLmVudltwbGF0Zm9ybVNlcnZpY2UucGF0aFZhcmlhYmxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2dXYXJuaW5nKCdFcnJvciBpbiBpbnZva2luZyBQaXBFbnYnLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2dXYXJuaW5nKGBSZWxldmFudCBFbnZpcm9ubWVudCBWYXJpYWJsZXMgJHtKU09OLnN0cmluZ2lmeShlbnZpcm9tZW50VmFyaWFibGVWYWx1ZXMsIHVuZGVmaW5lZCwgNCl9YCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IGVycm9yO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXBwU2hlbGwgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzEuSUFwcGxpY2F0aW9uU2hlbGwpO1xyXG4gICAgICAgICAgICAgICAgYXBwU2hlbGwuc2hvd1dhcm5pbmdNZXNzYWdlKGBXb3Jrc3BhY2UgY29udGFpbnMgcGlwZmlsZSBidXQgYXR0ZW1wdCB0byBydW4gJ3BpcGVudiAtLXZlbnYnIGZhaWxlZCB3aXRoICcke2Vycm9yTWVzc2FnZX0nLiBNYWtlIHN1cmUgcGlwZW52IGlzIG9uIHRoZSBQQVRILmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblBpcEVudlNlcnZpY2UgPSBfX2RlY29yYXRlKFtcclxuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcclxuICAgIF9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzUuSVNlcnZpY2VDb250YWluZXIpKVxyXG5dLCBQaXBFbnZTZXJ2aWNlKTtcclxuZXhwb3J0cy5QaXBFbnZTZXJ2aWNlID0gUGlwRW52U2VydmljZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwRW52U2VydmljZS5qcy5tYXAiXX0=