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

const types_1 = require("../../common/application/types");

const types_2 = require("../../common/platform/types");

const types_3 = require("../../common/process/types");

const types_4 = require("../../common/terminal/types");

const types_5 = require("../../common/types");

const enum_1 = require("../../common/utils/enum");

const misc_1 = require("../../common/utils/misc");

const types_6 = require("../../ioc/types");

const contracts_1 = require("../contracts");

const PYENVFILES = ['pyvenv.cfg', path.join('..', 'pyvenv.cfg')];
let VirtualEnvironmentManager = class VirtualEnvironmentManager {
  constructor(serviceContainer) {
    this.serviceContainer = serviceContainer;
    this.processServiceFactory = serviceContainer.get(types_3.IProcessServiceFactory);
    this.fs = serviceContainer.get(types_2.IFileSystem);
    this.pipEnvService = serviceContainer.get(contracts_1.IPipEnvService);
    this.workspaceService = serviceContainer.get(types_1.IWorkspaceService);
  }

  getEnvironmentName(pythonPath, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const defaultWorkspaceUri = this.workspaceService.hasWorkspaceFolders ? this.workspaceService.workspaceFolders[0].uri : undefined;
      const workspaceFolder = resource ? this.workspaceService.getWorkspaceFolder(resource) : undefined;
      const workspaceUri = workspaceFolder ? workspaceFolder.uri : defaultWorkspaceUri;
      const grandParentDirName = path.basename(path.dirname(path.dirname(pythonPath)));

      if (workspaceUri && (yield this.pipEnvService.isRelatedPipEnvironment(workspaceUri.fsPath, pythonPath))) {
        // In pipenv, return the folder name of the workspace.
        return path.basename(workspaceUri.fsPath);
      }

      return grandParentDirName;
    });
  }

  getEnvironmentType(pythonPath, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (yield this.isVenvEnvironment(pythonPath)) {
        return contracts_1.InterpreterType.Venv;
      }

      if (yield this.isPyEnvEnvironment(pythonPath, resource)) {
        return contracts_1.InterpreterType.Pyenv;
      }

      if (yield this.isPipEnvironment(pythonPath, resource)) {
        return contracts_1.InterpreterType.PipEnv;
      }

      if (yield this.isVirtualEnvironment(pythonPath)) {
        return contracts_1.InterpreterType.VirtualEnv;
      } // Lets not try to determine whether this is a conda environment or not.


      return contracts_1.InterpreterType.Unknown;
    });
  }

  isVenvEnvironment(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const dir = path.dirname(pythonPath);
      const pyEnvCfgFiles = PYENVFILES.map(file => path.join(dir, file));

      for (const file of pyEnvCfgFiles) {
        if (yield this.fs.fileExists(file)) {
          return true;
        }
      }

      return false;
    });
  }

  isPyEnvEnvironment(pythonPath, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const pyEnvRoot = yield this.getPyEnvRoot(resource);
      return pyEnvRoot && pythonPath.startsWith(pyEnvRoot);
    });
  }

  isPipEnvironment(pythonPath, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const defaultWorkspaceUri = this.workspaceService.hasWorkspaceFolders ? this.workspaceService.workspaceFolders[0].uri : undefined;
      const workspaceFolder = resource ? this.workspaceService.getWorkspaceFolder(resource) : undefined;
      const workspaceUri = workspaceFolder ? workspaceFolder.uri : defaultWorkspaceUri;

      if (workspaceUri && (yield this.pipEnvService.isRelatedPipEnvironment(workspaceUri.fsPath, pythonPath))) {
        return true;
      }

      return false;
    });
  }

  getPyEnvRoot(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.pyEnvRoot) {
        return this.pyEnvRoot;
      }

      const currentProccess = this.serviceContainer.get(types_5.ICurrentProcess);
      const pyenvRoot = currentProccess.env.PYENV_ROOT;

      if (pyenvRoot) {
        return this.pyEnvRoot = pyenvRoot;
      }

      try {
        const processService = yield this.processServiceFactory.create(resource);
        const output = yield processService.exec('pyenv', ['root']);

        if (output.stdout.trim().length > 0) {
          return this.pyEnvRoot = output.stdout.trim();
        }
      } catch (_a) {
        misc_1.noop();
      }

      const pathUtils = this.serviceContainer.get(types_5.IPathUtils);
      return this.pyEnvRoot = path.join(pathUtils.home, '.pyenv');
    });
  }

  isVirtualEnvironment(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const provider = this.getTerminalActivationProviderForVirtualEnvs();
      const shells = enum_1.getNamesAndValues(types_4.TerminalShellType).filter(shell => provider.isShellSupported(shell.value)).map(shell => shell.value);

      for (const shell of shells) {
        const cmds = yield provider.getActivationCommandsForInterpreter(pythonPath, shell);

        if (cmds && cmds.length > 0) {
          return true;
        }
      }

      return false;
    });
  }

  getTerminalActivationProviderForVirtualEnvs() {
    const isWindows = this.serviceContainer.get(types_2.IPlatformService).isWindows;
    const serviceName = isWindows ? 'commandPromptAndPowerShell' : 'bashCShellFish';
    return this.serviceContainer.get(types_4.ITerminalActivationCommandProvider, serviceName);
  }

};
VirtualEnvironmentManager = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_6.IServiceContainer))], VirtualEnvironmentManager);
exports.VirtualEnvironmentManager = VirtualEnvironmentManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsImV4cG9ydHMiLCJpbnZlcnNpZnlfMSIsInJlcXVpcmUiLCJwYXRoIiwidHlwZXNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwidHlwZXNfNCIsInR5cGVzXzUiLCJlbnVtXzEiLCJtaXNjXzEiLCJ0eXBlc182IiwiY29udHJhY3RzXzEiLCJQWUVOVkZJTEVTIiwiam9pbiIsIlZpcnR1YWxFbnZpcm9ubWVudE1hbmFnZXIiLCJjb25zdHJ1Y3RvciIsInNlcnZpY2VDb250YWluZXIiLCJwcm9jZXNzU2VydmljZUZhY3RvcnkiLCJnZXQiLCJJUHJvY2Vzc1NlcnZpY2VGYWN0b3J5IiwiZnMiLCJJRmlsZVN5c3RlbSIsInBpcEVudlNlcnZpY2UiLCJJUGlwRW52U2VydmljZSIsIndvcmtzcGFjZVNlcnZpY2UiLCJJV29ya3NwYWNlU2VydmljZSIsImdldEVudmlyb25tZW50TmFtZSIsInB5dGhvblBhdGgiLCJyZXNvdXJjZSIsImRlZmF1bHRXb3Jrc3BhY2VVcmkiLCJoYXNXb3Jrc3BhY2VGb2xkZXJzIiwid29ya3NwYWNlRm9sZGVycyIsInVyaSIsInVuZGVmaW5lZCIsIndvcmtzcGFjZUZvbGRlciIsImdldFdvcmtzcGFjZUZvbGRlciIsIndvcmtzcGFjZVVyaSIsImdyYW5kUGFyZW50RGlyTmFtZSIsImJhc2VuYW1lIiwiZGlybmFtZSIsImlzUmVsYXRlZFBpcEVudmlyb25tZW50IiwiZnNQYXRoIiwiZ2V0RW52aXJvbm1lbnRUeXBlIiwiaXNWZW52RW52aXJvbm1lbnQiLCJJbnRlcnByZXRlclR5cGUiLCJWZW52IiwiaXNQeUVudkVudmlyb25tZW50IiwiUHllbnYiLCJpc1BpcEVudmlyb25tZW50IiwiUGlwRW52IiwiaXNWaXJ0dWFsRW52aXJvbm1lbnQiLCJWaXJ0dWFsRW52IiwiVW5rbm93biIsImRpciIsInB5RW52Q2ZnRmlsZXMiLCJtYXAiLCJmaWxlIiwiZmlsZUV4aXN0cyIsInB5RW52Um9vdCIsImdldFB5RW52Um9vdCIsInN0YXJ0c1dpdGgiLCJjdXJyZW50UHJvY2Nlc3MiLCJJQ3VycmVudFByb2Nlc3MiLCJweWVudlJvb3QiLCJlbnYiLCJQWUVOVl9ST09UIiwicHJvY2Vzc1NlcnZpY2UiLCJjcmVhdGUiLCJvdXRwdXQiLCJleGVjIiwic3Rkb3V0IiwidHJpbSIsIl9hIiwibm9vcCIsInBhdGhVdGlscyIsIklQYXRoVXRpbHMiLCJob21lIiwicHJvdmlkZXIiLCJnZXRUZXJtaW5hbEFjdGl2YXRpb25Qcm92aWRlckZvclZpcnR1YWxFbnZzIiwic2hlbGxzIiwiZ2V0TmFtZXNBbmRWYWx1ZXMiLCJUZXJtaW5hbFNoZWxsVHlwZSIsImZpbHRlciIsInNoZWxsIiwiaXNTaGVsbFN1cHBvcnRlZCIsImNtZHMiLCJnZXRBY3RpdmF0aW9uQ29tbWFuZHNGb3JJbnRlcnByZXRlciIsImlzV2luZG93cyIsIklQbGF0Zm9ybVNlcnZpY2UiLCJzZXJ2aWNlTmFtZSIsIklUZXJtaW5hbEFjdGl2YXRpb25Db21tYW5kUHJvdmlkZXIiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VDb250YWluZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUs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TyxJQUFQO0FBQ0g7QUFDSjs7QUFDRCxhQUFPLEtBQVA7QUFDSCxLQVplLENBQWhCO0FBYUg7O0FBQ0Q2RyxFQUFBQSwyQ0FBMkMsR0FBRztBQUMxQyxVQUFNUyxTQUFTLEdBQUcsS0FBS3ZFLGdCQUFMLENBQXNCRSxHQUF0QixDQUEwQmQsT0FBTyxDQUFDb0YsZ0JBQWxDLEVBQW9ERCxTQUF0RTtBQUNBLFVBQU1FLFdBQVcsR0FBR0YsU0FBUyxHQUFHLDRCQUFILEdBQWtDLGdCQUEvRDtBQUNBLFdBQU8sS0FBS3ZFLGdCQUFMLENBQXNCRSxHQUF0QixDQUEwQlosT0FBTyxDQUFDb0Ysa0NBQWxDLEVBQXNFRCxXQUF0RSxDQUFQO0FBQ0g7O0FBL0cyRCxDQUFoRTtBQWlIQTNFLHlCQUF5QixHQUFHcEQsVUFBVSxDQUFDLENBQ25Dc0MsV0FBVyxDQUFDMkYsVUFBWixFQURtQyxFQUVuQ2pILE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUM0RixNQUFaLENBQW1CbEYsT0FBTyxDQUFDbUYsaUJBQTNCLENBQUosQ0FGNEIsQ0FBRCxFQUduQy9FLHlCQUhtQyxDQUF0QztBQUlBZixPQUFPLENBQUNlLHlCQUFSLEdBQW9DQSx5QkFBcEMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9hcHBsaWNhdGlvbi90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGxhdGZvcm0vdHlwZXNcIik7XHJcbmNvbnN0IHR5cGVzXzMgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3Byb2Nlc3MvdHlwZXNcIik7XHJcbmNvbnN0IHR5cGVzXzQgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3Rlcm1pbmFsL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc181ID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgZW51bV8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi91dGlscy9lbnVtXCIpO1xyXG5jb25zdCBtaXNjXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3V0aWxzL21pc2NcIik7XHJcbmNvbnN0IHR5cGVzXzYgPSByZXF1aXJlKFwiLi4vLi4vaW9jL3R5cGVzXCIpO1xyXG5jb25zdCBjb250cmFjdHNfMSA9IHJlcXVpcmUoXCIuLi9jb250cmFjdHNcIik7XHJcbmNvbnN0IFBZRU5WRklMRVMgPSBbJ3B5dmVudi5jZmcnLCBwYXRoLmpvaW4oJy4uJywgJ3B5dmVudi5jZmcnKV07XHJcbmxldCBWaXJ0dWFsRW52aXJvbm1lbnRNYW5hZ2VyID0gY2xhc3MgVmlydHVhbEVudmlyb25tZW50TWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlQ29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyID0gc2VydmljZUNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnByb2Nlc3NTZXJ2aWNlRmFjdG9yeSA9IHNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzMuSVByb2Nlc3NTZXJ2aWNlRmFjdG9yeSk7XHJcbiAgICAgICAgdGhpcy5mcyA9IHNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUZpbGVTeXN0ZW0pO1xyXG4gICAgICAgIHRoaXMucGlwRW52U2VydmljZSA9IHNlcnZpY2VDb250YWluZXIuZ2V0KGNvbnRyYWN0c18xLklQaXBFbnZTZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZVNlcnZpY2UgPSBzZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklXb3Jrc3BhY2VTZXJ2aWNlKTtcclxuICAgIH1cclxuICAgIGdldEVudmlyb25tZW50TmFtZShweXRob25QYXRoLCByZXNvdXJjZSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXb3Jrc3BhY2VVcmkgPSB0aGlzLndvcmtzcGFjZVNlcnZpY2UuaGFzV29ya3NwYWNlRm9sZGVycyA/IHRoaXMud29ya3NwYWNlU2VydmljZS53b3Jrc3BhY2VGb2xkZXJzWzBdLnVyaSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3Qgd29ya3NwYWNlRm9sZGVyID0gcmVzb3VyY2UgPyB0aGlzLndvcmtzcGFjZVNlcnZpY2UuZ2V0V29ya3NwYWNlRm9sZGVyKHJlc291cmNlKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3Qgd29ya3NwYWNlVXJpID0gd29ya3NwYWNlRm9sZGVyID8gd29ya3NwYWNlRm9sZGVyLnVyaSA6IGRlZmF1bHRXb3Jrc3BhY2VVcmk7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyYW5kUGFyZW50RGlyTmFtZSA9IHBhdGguYmFzZW5hbWUocGF0aC5kaXJuYW1lKHBhdGguZGlybmFtZShweXRob25QYXRoKSkpO1xyXG4gICAgICAgICAgICBpZiAod29ya3NwYWNlVXJpICYmICh5aWVsZCB0aGlzLnBpcEVudlNlcnZpY2UuaXNSZWxhdGVkUGlwRW52aXJvbm1lbnQod29ya3NwYWNlVXJpLmZzUGF0aCwgcHl0aG9uUGF0aCkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJbiBwaXBlbnYsIHJldHVybiB0aGUgZm9sZGVyIG5hbWUgb2YgdGhlIHdvcmtzcGFjZS5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKHdvcmtzcGFjZVVyaS5mc1BhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBncmFuZFBhcmVudERpck5hbWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXRFbnZpcm9ubWVudFR5cGUocHl0aG9uUGF0aCwgcmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoeWllbGQgdGhpcy5pc1ZlbnZFbnZpcm9ubWVudChweXRob25QYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRyYWN0c18xLkludGVycHJldGVyVHlwZS5WZW52O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5aWVsZCB0aGlzLmlzUHlFbnZFbnZpcm9ubWVudChweXRob25QYXRoLCByZXNvdXJjZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250cmFjdHNfMS5JbnRlcnByZXRlclR5cGUuUHllbnY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHlpZWxkIHRoaXMuaXNQaXBFbnZpcm9ubWVudChweXRob25QYXRoLCByZXNvdXJjZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250cmFjdHNfMS5JbnRlcnByZXRlclR5cGUuUGlwRW52O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5aWVsZCB0aGlzLmlzVmlydHVhbEVudmlyb25tZW50KHB5dGhvblBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udHJhY3RzXzEuSW50ZXJwcmV0ZXJUeXBlLlZpcnR1YWxFbnY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gTGV0cyBub3QgdHJ5IHRvIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSBjb25kYSBlbnZpcm9ubWVudCBvciBub3QuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250cmFjdHNfMS5JbnRlcnByZXRlclR5cGUuVW5rbm93bjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlzVmVudkVudmlyb25tZW50KHB5dGhvblBhdGgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocHl0aG9uUGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHB5RW52Q2ZnRmlsZXMgPSBQWUVOVkZJTEVTLm1hcChmaWxlID0+IHBhdGguam9pbihkaXIsIGZpbGUpKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHB5RW52Q2ZnRmlsZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh5aWVsZCB0aGlzLmZzLmZpbGVFeGlzdHMoZmlsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpc1B5RW52RW52aXJvbm1lbnQocHl0aG9uUGF0aCwgcmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBweUVudlJvb3QgPSB5aWVsZCB0aGlzLmdldFB5RW52Um9vdChyZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBweUVudlJvb3QgJiYgcHl0aG9uUGF0aC5zdGFydHNXaXRoKHB5RW52Um9vdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpc1BpcEVudmlyb25tZW50KHB5dGhvblBhdGgsIHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFdvcmtzcGFjZVVyaSA9IHRoaXMud29ya3NwYWNlU2VydmljZS5oYXNXb3Jrc3BhY2VGb2xkZXJzID8gdGhpcy53b3Jrc3BhY2VTZXJ2aWNlLndvcmtzcGFjZUZvbGRlcnNbMF0udXJpIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VGb2xkZXIgPSByZXNvdXJjZSA/IHRoaXMud29ya3NwYWNlU2VydmljZS5nZXRXb3Jrc3BhY2VGb2xkZXIocmVzb3VyY2UpIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VVcmkgPSB3b3Jrc3BhY2VGb2xkZXIgPyB3b3Jrc3BhY2VGb2xkZXIudXJpIDogZGVmYXVsdFdvcmtzcGFjZVVyaTtcclxuICAgICAgICAgICAgaWYgKHdvcmtzcGFjZVVyaSAmJiAoeWllbGQgdGhpcy5waXBFbnZTZXJ2aWNlLmlzUmVsYXRlZFBpcEVudmlyb25tZW50KHdvcmtzcGFjZVVyaS5mc1BhdGgsIHB5dGhvblBhdGgpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0UHlFbnZSb290KHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHlFbnZSb290KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5weUVudlJvb3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2NjZXNzID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc181LklDdXJyZW50UHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHB5ZW52Um9vdCA9IGN1cnJlbnRQcm9jY2Vzcy5lbnYuUFlFTlZfUk9PVDtcclxuICAgICAgICAgICAgaWYgKHB5ZW52Um9vdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHlFbnZSb290ID0gcHllbnZSb290O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9jZXNzU2VydmljZSA9IHlpZWxkIHRoaXMucHJvY2Vzc1NlcnZpY2VGYWN0b3J5LmNyZWF0ZShyZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSB5aWVsZCBwcm9jZXNzU2VydmljZS5leGVjKCdweWVudicsIFsncm9vdCddKTtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXQuc3Rkb3V0LnRyaW0oKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHlFbnZSb290ID0gb3V0cHV0LnN0ZG91dC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBtaXNjXzEubm9vcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhVdGlscyA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfNS5JUGF0aFV0aWxzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHlFbnZSb290ID0gcGF0aC5qb2luKHBhdGhVdGlscy5ob21lLCAnLnB5ZW52Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpc1ZpcnR1YWxFbnZpcm9ubWVudChweXRob25QYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFRlcm1pbmFsQWN0aXZhdGlvblByb3ZpZGVyRm9yVmlydHVhbEVudnMoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2hlbGxzID0gZW51bV8xLmdldE5hbWVzQW5kVmFsdWVzKHR5cGVzXzQuVGVybWluYWxTaGVsbFR5cGUpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHNoZWxsID0+IHByb3ZpZGVyLmlzU2hlbGxTdXBwb3J0ZWQoc2hlbGwudmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgLm1hcChzaGVsbCA9PiBzaGVsbC52YWx1ZSk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2hlbGwgb2Ygc2hlbGxzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWRzID0geWllbGQgcHJvdmlkZXIuZ2V0QWN0aXZhdGlvbkNvbW1hbmRzRm9ySW50ZXJwcmV0ZXIocHl0aG9uUGF0aCwgc2hlbGwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNtZHMgJiYgY21kcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0VGVybWluYWxBY3RpdmF0aW9uUHJvdmlkZXJGb3JWaXJ0dWFsRW52cygpIHtcclxuICAgICAgICBjb25zdCBpc1dpbmRvd3MgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVBsYXRmb3JtU2VydmljZSkuaXNXaW5kb3dzO1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VOYW1lID0gaXNXaW5kb3dzID8gJ2NvbW1hbmRQcm9tcHRBbmRQb3dlclNoZWxsJyA6ICdiYXNoQ1NoZWxsRmlzaCc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfNC5JVGVybWluYWxBY3RpdmF0aW9uQ29tbWFuZFByb3ZpZGVyLCBzZXJ2aWNlTmFtZSk7XHJcbiAgICB9XHJcbn07XHJcblZpcnR1YWxFbnZpcm9ubWVudE1hbmFnZXIgPSBfX2RlY29yYXRlKFtcclxuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcclxuICAgIF9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzYuSVNlcnZpY2VDb250YWluZXIpKVxyXG5dLCBWaXJ0dWFsRW52aXJvbm1lbnRNYW5hZ2VyKTtcclxuZXhwb3J0cy5WaXJ0dWFsRW52aXJvbm1lbnRNYW5hZ2VyID0gVmlydHVhbEVudmlyb25tZW50TWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19