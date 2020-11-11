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

const types_1 = require("../common/application/types");

const types_2 = require("../common/types");

const types_3 = require("../ioc/types");

const bandit_1 = require("./bandit");

const flake8_1 = require("./flake8");

const linterInfo_1 = require("./linterInfo");

const mypy_1 = require("./mypy");

const pep8_1 = require("./pep8");

const prospector_1 = require("./prospector");

const pydocstyle_1 = require("./pydocstyle");

const pylama_1 = require("./pylama");

const pylint_1 = require("./pylint");

const types_4 = require("./types");

class DisabledLinter {
  constructor(configService) {
    this.configService = configService;
  }

  get info() {
    return new linterInfo_1.LinterInfo(types_2.Product.pylint, 'pylint', this.configService);
  }

  lint(document, cancellation) {
    return __awaiter(this, void 0, void 0, function* () {
      return [];
    });
  }

}

let LinterManager = class LinterManager {
  constructor(serviceContainer, workspaceService) {
    this.serviceContainer = serviceContainer;
    this.workspaceService = workspaceService;
    this.checkedForInstalledLinters = new Set();
    this.configService = serviceContainer.get(types_2.IConfigurationService);
    this.linters = [new linterInfo_1.LinterInfo(types_2.Product.bandit, 'bandit', this.configService), new linterInfo_1.LinterInfo(types_2.Product.flake8, 'flake8', this.configService), new linterInfo_1.PylintLinterInfo(this.configService, this.workspaceService, ['.pylintrc', 'pylintrc']), new linterInfo_1.LinterInfo(types_2.Product.mypy, 'mypy', this.configService), new linterInfo_1.LinterInfo(types_2.Product.pep8, 'pep8', this.configService), new linterInfo_1.LinterInfo(types_2.Product.prospector, 'prospector', this.configService), new linterInfo_1.LinterInfo(types_2.Product.pydocstyle, 'pydocstyle', this.configService), new linterInfo_1.LinterInfo(types_2.Product.pylama, 'pylama', this.configService)];
  }

  getAllLinterInfos() {
    return this.linters;
  }

  getLinterInfo(product) {
    const x = this.linters.findIndex((value, index, obj) => value.product === product);

    if (x >= 0) {
      return this.linters[x];
    }

    throw new Error('Invalid linter');
  }

  isLintingEnabled(silent, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const settings = this.configService.getSettings(resource);
      const activeLintersPresent = yield this.getActiveLinters(silent, resource);
      return settings.linting.enabled && activeLintersPresent.length > 0;
    });
  }

  enableLintingAsync(enable, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.configService.updateSetting('linting.enabled', enable, resource);
    });
  }

  getActiveLinters(silent, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!silent) {
        yield this.enableUnconfiguredLinters(resource);
      }

      return this.linters.filter(x => x.isEnabled(resource));
    });
  }

  setActiveLintersAsync(products, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      // ensure we only allow valid linters to be set, otherwise leave things alone.
      // filter out any invalid products:
      const validProducts = products.filter(product => {
        const foundIndex = this.linters.findIndex(validLinter => validLinter.product === product);
        return foundIndex !== -1;
      }); // if we have valid linter product(s), enable only those

      if (validProducts.length > 0) {
        const active = yield this.getActiveLinters(true, resource);

        for (const x of active) {
          yield x.enableAsync(false, resource);
        }

        if (products.length > 0) {
          const toActivate = this.linters.filter(x => products.findIndex(p => x.product === p) >= 0);

          for (const x of toActivate) {
            yield x.enableAsync(true, resource);
          }

          yield this.enableLintingAsync(true, resource);
        }
      }
    });
  }

  createLinter(product, outputChannel, serviceContainer, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield this.isLintingEnabled(true, resource))) {
        return new DisabledLinter(this.configService);
      }

      const error = 'Linter manager: Unknown linter';

      switch (product) {
        case types_2.Product.bandit:
          return new bandit_1.Bandit(outputChannel, serviceContainer);

        case types_2.Product.flake8:
          return new flake8_1.Flake8(outputChannel, serviceContainer);

        case types_2.Product.pylint:
          return new pylint_1.Pylint(outputChannel, serviceContainer);

        case types_2.Product.mypy:
          return new mypy_1.MyPy(outputChannel, serviceContainer);

        case types_2.Product.prospector:
          return new prospector_1.Prospector(outputChannel, serviceContainer);

        case types_2.Product.pylama:
          return new pylama_1.PyLama(outputChannel, serviceContainer);

        case types_2.Product.pydocstyle:
          return new pydocstyle_1.PyDocStyle(outputChannel, serviceContainer);

        case types_2.Product.pep8:
          return new pep8_1.Pep8(outputChannel, serviceContainer);

        default:
          serviceContainer.get(types_2.ILogger).logError(error);
          break;
      }

      throw new Error(error);
    });
  }

  enableUnconfiguredLinters(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const settings = this.configService.getSettings(resource);

      if (!settings.linting.pylintEnabled || !settings.linting.enabled) {
        return;
      } // If we've already checked during this session for the same workspace and Python path, then don't bother again.


      const workspaceKey = `${this.workspaceService.getWorkspaceFolderIdentifier(resource)}${settings.pythonPath}`;

      if (this.checkedForInstalledLinters.has(workspaceKey)) {
        return;
      }

      this.checkedForInstalledLinters.add(workspaceKey); // only check & ask the user if they'd like to enable pylint

      const pylintInfo = this.linters.find(linter => linter.id === 'pylint');
      const activator = this.serviceContainer.get(types_4.IAvailableLinterActivator);
      yield activator.promptIfLinterAvailable(pylintInfo, resource);
    });
  }

};
LinterManager = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_3.IServiceContainer)), __param(1, inversify_1.inject(types_1.IWorkspaceService))], LinterManager);
exports.LinterManager = LinterManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnRlck1hbmFnZXIuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInR5cGVzXzEiLCJ0eXBlc18yIiwidHlwZXNfMyIsImJhbmRpdF8xIiwiZmxha2U4XzEiLCJsaW50ZXJJbmZvXzEiLCJteXB5XzEiLCJwZXA4XzEiLCJwcm9zcGVjdG9yXzEiLCJweWRvY3N0eWxlXzEiLCJweWxhbWFfMSIsInB5bGludF8xIiwidHlwZXNfNCIsIkRpc2FibGVkTGludGVyIiwiY29uc3RydWN0b3IiLCJjb25maWdTZXJ2aWNlIiwiaW5mbyIsIkxpbnRlckluZm8iLCJQcm9kdWN0IiwicHlsaW50IiwibGludCIsImRvY3VtZW50IiwiY2FuY2VsbGF0aW9uIiwiTGludGVyTWFuYWdlciIsInNlcnZpY2VDb250YWluZXIiLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwiY2hlY2tlZEZvckluc3RhbGxlZExpbnRlcnMiLCJTZXQiLCJnZXQiLCJJQ29uZmlndXJhdGlvblNlcnZpY2UiLCJsaW50ZXJzIiwiYmFuZGl0IiwiZmxha2U4IiwiUHlsaW50TGludGVySW5mbyIsIm15cHkiLCJwZXA4IiwicHJvc3BlY3RvciIsInB5ZG9jc3R5bGUiLCJweWxhbWEiLCJnZXRBbGxMaW50ZXJJbmZvcyIsImdldExpbnRlckluZm8iLCJwcm9kdWN0IiwieCIsImZpbmRJbmRleCIsImluZGV4Iiwib2JqIiwiRXJyb3IiLCJpc0xpbnRpbmdFbmFibGVkIiwic2lsZW50IiwicmVzb3VyY2UiLCJzZXR0aW5ncyIsImdldFNldHRpbmdzIiwiYWN0aXZlTGludGVyc1ByZXNlbnQiLCJnZXRBY3RpdmVMaW50ZXJzIiwibGludGluZyIsImVuYWJsZWQiLCJlbmFibGVMaW50aW5nQXN5bmMiLCJlbmFibGUiLCJ1cGRhdGVTZXR0aW5nIiwiZW5hYmxlVW5jb25maWd1cmVkTGludGVycyIsImZpbHRlciIsImlzRW5hYmxlZCIsInNldEFjdGl2ZUxpbnRlcnNBc3luYyIsInByb2R1Y3RzIiwidmFsaWRQcm9kdWN0cyIsImZvdW5kSW5kZXgiLCJ2YWxpZExpbnRlciIsImFjdGl2ZSIsImVuYWJsZUFzeW5jIiwidG9BY3RpdmF0ZSIsInAiLCJjcmVhdGVMaW50ZXIiLCJvdXRwdXRDaGFubmVsIiwiZXJyb3IiLCJCYW5kaXQiLCJGbGFrZTgiLCJQeWxpbnQiLCJNeVB5IiwiUHJvc3BlY3RvciIsIlB5TGFtYSIsIlB5RG9jU3R5bGUiLCJQZXA4IiwiSUxvZ2dlciIsImxvZ0Vycm9yIiwicHlsaW50RW5hYmxlZCIsIndvcmtzcGFjZUtleSIsImdldFdvcmtzcGFjZUZvbGRlcklkZW50aWZpZXIiLCJweXRob25QYXRoIiwiaGFzIiwiYWRkIiwicHlsaW50SW5mbyIsImZpbmQiLCJsaW50ZXIiLCJpZCIsImFjdGl2YXRvciIsIklBdmFpbGFibGVMaW50ZXJBY3RpdmF0b3IiLCJwcm9tcHRJZkxpbnRlckF2YWlsYWJsZSIsImluamVjdGFibGUiLCJpbmplY3QiLCJJU2VydmljZUNvbnRhaW5lciIsIklXb3Jrc3BhY2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsVUFBVSxHQUFJLFVBQVEsU0FBS0EsVUFBZCxJQUE2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LE9BSitDLENBS2hEOzs7QUFDQSxZQUFNOEIsWUFBWSxHQUFJLEdBQUUsS0FBSzVELGdCQUFMLENBQXNCNkQsNEJBQXRCLENBQW1EckMsUUFBbkQsQ0FBNkQsR0FBRUMsUUFBUSxDQUFDcUMsVUFBVyxFQUEzRzs7QUFDQSxVQUFJLEtBQUs3RCwwQkFBTCxDQUFnQzhELEdBQWhDLENBQW9DSCxZQUFwQyxDQUFKLEVBQXVEO0FBQ25EO0FBQ0g7O0FBQ0QsV0FBSzNELDBCQUFMLENBQWdDK0QsR0FBaEMsQ0FBb0NKLFlBQXBDLEVBVmdELENBV2hEOztBQUNBLFlBQU1LLFVBQVUsR0FBRyxLQUFLNUQsT0FBTCxDQUFhNkQsSUFBYixDQUFrQkMsTUFBTSxJQUFJQSxNQUFNLENBQUNDLEVBQVAsS0FBYyxRQUExQyxDQUFuQjtBQUNBLFlBQU1DLFNBQVMsR0FBRyxLQUFLdEUsZ0JBQUwsQ0FBc0JJLEdBQXRCLENBQTBCaEIsT0FBTyxDQUFDbUYseUJBQWxDLENBQWxCO0FBQ0EsWUFBTUQsU0FBUyxDQUFDRSx1QkFBVixDQUFrQ04sVUFBbEMsRUFBOEN6QyxRQUE5QyxDQUFOO0FBQ0gsS0FmZSxDQUFoQjtBQWdCSDs7QUF0SG1DLENBQXhDO0FBd0hBMUIsYUFBYSxHQUFHL0QsVUFBVSxDQUFDLENBQ3ZCc0MsV0FBVyxDQUFDbUcsVUFBWixFQUR1QixFQUV2QnpILE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUNvRyxNQUFaLENBQW1CaEcsT0FBTyxDQUFDaUcsaUJBQTNCLENBQUosQ0FGZ0IsRUFHdkIzSCxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDb0csTUFBWixDQUFtQmxHLE9BQU8sQ0FBQ29HLGlCQUEzQixDQUFKLENBSGdCLENBQUQsRUFJdkI3RSxhQUp1QixDQUExQjtBQUtBMUIsT0FBTyxDQUFDMEIsYUFBUixHQUF3QkEsYUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vY29tbW9uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi9pb2MvdHlwZXNcIik7XHJcbmNvbnN0IGJhbmRpdF8xID0gcmVxdWlyZShcIi4vYmFuZGl0XCIpO1xyXG5jb25zdCBmbGFrZThfMSA9IHJlcXVpcmUoXCIuL2ZsYWtlOFwiKTtcclxuY29uc3QgbGludGVySW5mb18xID0gcmVxdWlyZShcIi4vbGludGVySW5mb1wiKTtcclxuY29uc3QgbXlweV8xID0gcmVxdWlyZShcIi4vbXlweVwiKTtcclxuY29uc3QgcGVwOF8xID0gcmVxdWlyZShcIi4vcGVwOFwiKTtcclxuY29uc3QgcHJvc3BlY3Rvcl8xID0gcmVxdWlyZShcIi4vcHJvc3BlY3RvclwiKTtcclxuY29uc3QgcHlkb2NzdHlsZV8xID0gcmVxdWlyZShcIi4vcHlkb2NzdHlsZVwiKTtcclxuY29uc3QgcHlsYW1hXzEgPSByZXF1aXJlKFwiLi9weWxhbWFcIik7XHJcbmNvbnN0IHB5bGludF8xID0gcmVxdWlyZShcIi4vcHlsaW50XCIpO1xyXG5jb25zdCB0eXBlc180ID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XHJcbmNsYXNzIERpc2FibGVkTGludGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ1NlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xyXG4gICAgfVxyXG4gICAgZ2V0IGluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBsaW50ZXJJbmZvXzEuTGludGVySW5mbyh0eXBlc18yLlByb2R1Y3QucHlsaW50LCAncHlsaW50JywgdGhpcy5jb25maWdTZXJ2aWNlKTtcclxuICAgIH1cclxuICAgIGxpbnQoZG9jdW1lbnQsIGNhbmNlbGxhdGlvbikge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5sZXQgTGludGVyTWFuYWdlciA9IGNsYXNzIExpbnRlck1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lciwgd29ya3NwYWNlU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuc2VydmljZUNvbnRhaW5lciA9IHNlcnZpY2VDb250YWluZXI7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2VTZXJ2aWNlID0gd29ya3NwYWNlU2VydmljZTtcclxuICAgICAgICB0aGlzLmNoZWNrZWRGb3JJbnN0YWxsZWRMaW50ZXJzID0gbmV3IFNldCgpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnU2VydmljZSA9IHNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLmxpbnRlcnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBsaW50ZXJJbmZvXzEuTGludGVySW5mbyh0eXBlc18yLlByb2R1Y3QuYmFuZGl0LCAnYmFuZGl0JywgdGhpcy5jb25maWdTZXJ2aWNlKSxcclxuICAgICAgICAgICAgbmV3IGxpbnRlckluZm9fMS5MaW50ZXJJbmZvKHR5cGVzXzIuUHJvZHVjdC5mbGFrZTgsICdmbGFrZTgnLCB0aGlzLmNvbmZpZ1NlcnZpY2UpLFxyXG4gICAgICAgICAgICBuZXcgbGludGVySW5mb18xLlB5bGludExpbnRlckluZm8odGhpcy5jb25maWdTZXJ2aWNlLCB0aGlzLndvcmtzcGFjZVNlcnZpY2UsIFsnLnB5bGludHJjJywgJ3B5bGludHJjJ10pLFxyXG4gICAgICAgICAgICBuZXcgbGludGVySW5mb18xLkxpbnRlckluZm8odHlwZXNfMi5Qcm9kdWN0Lm15cHksICdteXB5JywgdGhpcy5jb25maWdTZXJ2aWNlKSxcclxuICAgICAgICAgICAgbmV3IGxpbnRlckluZm9fMS5MaW50ZXJJbmZvKHR5cGVzXzIuUHJvZHVjdC5wZXA4LCAncGVwOCcsIHRoaXMuY29uZmlnU2VydmljZSksXHJcbiAgICAgICAgICAgIG5ldyBsaW50ZXJJbmZvXzEuTGludGVySW5mbyh0eXBlc18yLlByb2R1Y3QucHJvc3BlY3RvciwgJ3Byb3NwZWN0b3InLCB0aGlzLmNvbmZpZ1NlcnZpY2UpLFxyXG4gICAgICAgICAgICBuZXcgbGludGVySW5mb18xLkxpbnRlckluZm8odHlwZXNfMi5Qcm9kdWN0LnB5ZG9jc3R5bGUsICdweWRvY3N0eWxlJywgdGhpcy5jb25maWdTZXJ2aWNlKSxcclxuICAgICAgICAgICAgbmV3IGxpbnRlckluZm9fMS5MaW50ZXJJbmZvKHR5cGVzXzIuUHJvZHVjdC5weWxhbWEsICdweWxhbWEnLCB0aGlzLmNvbmZpZ1NlcnZpY2UpXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIGdldEFsbExpbnRlckluZm9zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxpbnRlcnM7XHJcbiAgICB9XHJcbiAgICBnZXRMaW50ZXJJbmZvKHByb2R1Y3QpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy5saW50ZXJzLmZpbmRJbmRleCgodmFsdWUsIGluZGV4LCBvYmopID0+IHZhbHVlLnByb2R1Y3QgPT09IHByb2R1Y3QpO1xyXG4gICAgICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGludGVyc1t4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxpbnRlcicpO1xyXG4gICAgfVxyXG4gICAgaXNMaW50aW5nRW5hYmxlZChzaWxlbnQsIHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0U2V0dGluZ3MocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVMaW50ZXJzUHJlc2VudCA9IHlpZWxkIHRoaXMuZ2V0QWN0aXZlTGludGVycyhzaWxlbnQsIHJlc291cmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNldHRpbmdzLmxpbnRpbmcuZW5hYmxlZCAmJiBhY3RpdmVMaW50ZXJzUHJlc2VudC5sZW5ndGggPiAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlTGludGluZ0FzeW5jKGVuYWJsZSwgcmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLmNvbmZpZ1NlcnZpY2UudXBkYXRlU2V0dGluZygnbGludGluZy5lbmFibGVkJywgZW5hYmxlLCByZXNvdXJjZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXRBY3RpdmVMaW50ZXJzKHNpbGVudCwgcmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoIXNpbGVudCkge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5lbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzKHJlc291cmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW50ZXJzLmZpbHRlcih4ID0+IHguaXNFbmFibGVkKHJlc291cmNlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmVMaW50ZXJzQXN5bmMocHJvZHVjdHMsIHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgLy8gZW5zdXJlIHdlIG9ubHkgYWxsb3cgdmFsaWQgbGludGVycyB0byBiZSBzZXQsIG90aGVyd2lzZSBsZWF2ZSB0aGluZ3MgYWxvbmUuXHJcbiAgICAgICAgICAgIC8vIGZpbHRlciBvdXQgYW55IGludmFsaWQgcHJvZHVjdHM6XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkUHJvZHVjdHMgPSBwcm9kdWN0cy5maWx0ZXIocHJvZHVjdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEluZGV4ID0gdGhpcy5saW50ZXJzLmZpbmRJbmRleCh2YWxpZExpbnRlciA9PiB2YWxpZExpbnRlci5wcm9kdWN0ID09PSBwcm9kdWN0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZEluZGV4ICE9PSAtMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgdmFsaWQgbGludGVyIHByb2R1Y3QocyksIGVuYWJsZSBvbmx5IHRob3NlXHJcbiAgICAgICAgICAgIGlmICh2YWxpZFByb2R1Y3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHlpZWxkIHRoaXMuZ2V0QWN0aXZlTGludGVycyh0cnVlLCByZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgeC5lbmFibGVBc3luYyhmYWxzZSwgcmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b0FjdGl2YXRlID0gdGhpcy5saW50ZXJzLmZpbHRlcih4ID0+IHByb2R1Y3RzLmZpbmRJbmRleChwID0+IHgucHJvZHVjdCA9PT0gcCkgPj0gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB4IG9mIHRvQWN0aXZhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgeC5lbmFibGVBc3luYyh0cnVlLCByZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuZW5hYmxlTGludGluZ0FzeW5jKHRydWUsIHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlTGludGVyKHByb2R1Y3QsIG91dHB1dENoYW5uZWwsIHNlcnZpY2VDb250YWluZXIsIHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgaWYgKCEoeWllbGQgdGhpcy5pc0xpbnRpbmdFbmFibGVkKHRydWUsIHJlc291cmNlKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGlzYWJsZWRMaW50ZXIodGhpcy5jb25maWdTZXJ2aWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9ICdMaW50ZXIgbWFuYWdlcjogVW5rbm93biBsaW50ZXInO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHByb2R1Y3QpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LmJhbmRpdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGJhbmRpdF8xLkJhbmRpdChvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LmZsYWtlODpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGZsYWtlOF8xLkZsYWtlOChvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LnB5bGludDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHB5bGludF8xLlB5bGludChvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0Lm15cHk6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBteXB5XzEuTXlQeShvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LnByb3NwZWN0b3I6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwcm9zcGVjdG9yXzEuUHJvc3BlY3RvcihvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LnB5bGFtYTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHB5bGFtYV8xLlB5TGFtYShvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LnB5ZG9jc3R5bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBweWRvY3N0eWxlXzEuUHlEb2NTdHlsZShvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5Qcm9kdWN0LnBlcDg6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwZXA4XzEuUGVwOChvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JTG9nZ2VyKS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVuYWJsZVVuY29uZmlndXJlZExpbnRlcnMocmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuY29uZmlnU2VydmljZS5nZXRTZXR0aW5ncyhyZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIGlmICghc2V0dGluZ3MubGludGluZy5weWxpbnRFbmFibGVkIHx8ICFzZXR0aW5ncy5saW50aW5nLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGNoZWNrZWQgZHVyaW5nIHRoaXMgc2Vzc2lvbiBmb3IgdGhlIHNhbWUgd29ya3NwYWNlIGFuZCBQeXRob24gcGF0aCwgdGhlbiBkb24ndCBib3RoZXIgYWdhaW4uXHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmtzcGFjZUtleSA9IGAke3RoaXMud29ya3NwYWNlU2VydmljZS5nZXRXb3Jrc3BhY2VGb2xkZXJJZGVudGlmaWVyKHJlc291cmNlKX0ke3NldHRpbmdzLnB5dGhvblBhdGh9YDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tlZEZvckluc3RhbGxlZExpbnRlcnMuaGFzKHdvcmtzcGFjZUtleSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrZWRGb3JJbnN0YWxsZWRMaW50ZXJzLmFkZCh3b3Jrc3BhY2VLZXkpO1xyXG4gICAgICAgICAgICAvLyBvbmx5IGNoZWNrICYgYXNrIHRoZSB1c2VyIGlmIHRoZXknZCBsaWtlIHRvIGVuYWJsZSBweWxpbnRcclxuICAgICAgICAgICAgY29uc3QgcHlsaW50SW5mbyA9IHRoaXMubGludGVycy5maW5kKGxpbnRlciA9PiBsaW50ZXIuaWQgPT09ICdweWxpbnQnKTtcclxuICAgICAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc180LklBdmFpbGFibGVMaW50ZXJBY3RpdmF0b3IpO1xyXG4gICAgICAgICAgICB5aWVsZCBhY3RpdmF0b3IucHJvbXB0SWZMaW50ZXJBdmFpbGFibGUocHlsaW50SW5mbywgcmVzb3VyY2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5MaW50ZXJNYW5hZ2VyID0gX19kZWNvcmF0ZShbXHJcbiAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXHJcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18zLklTZXJ2aWNlQ29udGFpbmVyKSksXHJcbiAgICBfX3BhcmFtKDEsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklXb3Jrc3BhY2VTZXJ2aWNlKSlcclxuXSwgTGludGVyTWFuYWdlcik7XHJcbmV4cG9ydHMuTGludGVyTWFuYWdlciA9IExpbnRlck1hbmFnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnRlck1hbmFnZXIuanMubWFwIl19