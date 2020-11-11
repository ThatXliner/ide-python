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

const constants_1 = require("../common/constants");

const types_1 = require("../common/types");

const contracts_1 = require("../interpreter/contracts");

const types_2 = require("../ioc/types");

const jediProxyFactory_1 = require("../languageServices/jediProxyFactory");

const completionProvider_1 = require("../providers/completionProvider");

const definitionProvider_1 = require("../providers/definitionProvider");

const hoverProvider_1 = require("../providers/hoverProvider");

const objectDefinitionProvider_1 = require("../providers/objectDefinitionProvider");

const referenceProvider_1 = require("../providers/referenceProvider");

const renameProvider_1 = require("../providers/renameProvider");

const signatureProvider_1 = require("../providers/signatureProvider");

const symbolProvider_1 = require("../providers/symbolProvider");

const blockFormatProvider_1 = require("../typeFormatters/blockFormatProvider");

const dispatcher_1 = require("../typeFormatters/dispatcher");

const onEnterFormatter_1 = require("../typeFormatters/onEnterFormatter");

const types_3 = require("../unittests/types");

const main_1 = require("../workspaceSymbols/main");

let JediExtensionActivator = class JediExtensionActivator {
  constructor(serviceManager) {
    this.serviceManager = serviceManager;
    this.context = this.serviceManager.get(types_1.IExtensionContext);
    this.documentSelector = constants_1.PYTHON;
  }

  activate() {
    return __awaiter(this, void 0, void 0, function* () {
      const context = this.context;
      const jediFactory = this.jediFactory = new jediProxyFactory_1.JediFactory(context.asAbsolutePath('.'), this.serviceManager);
      context.subscriptions.push(jediFactory);
      context.subscriptions.push(...objectDefinitionProvider_1.activateGoToObjectDefinitionProvider(jediFactory));
      context.subscriptions.push(jediFactory);
      context.subscriptions.push(vscode_1.languages.registerRenameProvider(this.documentSelector, new renameProvider_1.PythonRenameProvider(this.serviceManager)));
      const definitionProvider = new definitionProvider_1.PythonDefinitionProvider(jediFactory);
      context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(this.documentSelector, definitionProvider));
      context.subscriptions.push(vscode_1.languages.registerHoverProvider(this.documentSelector, new hoverProvider_1.PythonHoverProvider(jediFactory)));
      context.subscriptions.push(vscode_1.languages.registerReferenceProvider(this.documentSelector, new referenceProvider_1.PythonReferenceProvider(jediFactory)));
      context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(this.documentSelector, new completionProvider_1.PythonCompletionItemProvider(jediFactory, this.serviceManager), '.'));
      context.subscriptions.push(vscode_1.languages.registerCodeLensProvider(this.documentSelector, this.serviceManager.get(contracts_1.IShebangCodeLensProvider)));
      const onTypeDispatcher = new dispatcher_1.OnTypeFormattingDispatcher({
        '\n': new onEnterFormatter_1.OnEnterFormatter(),
        ':': new blockFormatProvider_1.BlockFormatProviders()
      });
      const onTypeTriggers = onTypeDispatcher.getTriggerCharacters();

      if (onTypeTriggers) {
        context.subscriptions.push(vscode_1.languages.registerOnTypeFormattingEditProvider(constants_1.PYTHON, onTypeDispatcher, onTypeTriggers.first, ...onTypeTriggers.more));
      }

      const serviceContainer = this.serviceManager.get(types_2.IServiceContainer);
      context.subscriptions.push(new main_1.WorkspaceSymbols(serviceContainer));
      const symbolProvider = new symbolProvider_1.JediSymbolProvider(serviceContainer, jediFactory);
      context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(this.documentSelector, symbolProvider));
      const pythonSettings = this.serviceManager.get(types_1.IConfigurationService).getSettings();

      if (pythonSettings.devOptions.indexOf('DISABLE_SIGNATURE') === -1) {
        context.subscriptions.push(vscode_1.languages.registerSignatureHelpProvider(this.documentSelector, new signatureProvider_1.PythonSignatureProvider(jediFactory), '(', ','));
      }

      context.subscriptions.push(vscode_1.languages.registerRenameProvider(constants_1.PYTHON, new renameProvider_1.PythonRenameProvider(serviceContainer)));
      const testManagementService = this.serviceManager.get(types_3.IUnitTestManagementService);
      testManagementService.activate().then(() => testManagementService.activateCodeLenses(symbolProvider)).catch(ex => this.serviceManager.get(types_1.ILogger).logError('Failed to activate Unit Tests', ex));
      return true;
    });
  }

  deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.jediFactory) {
        this.jediFactory.dispose();
      }
    });
  }

};
JediExtensionActivator = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_2.IServiceManager))], JediExtensionActivator);
exports.JediExtensionActivator = JediExtensionActivator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplZGkuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInZzY29kZV8xIiwiY29uc3RhbnRzXzEiLCJ0eXBlc18xIiwiY29udHJhY3RzXzEiLCJ0eXBlc18yIiwiamVkaVByb3h5RmFjdG9yeV8xIiwiY29tcGxldGlvblByb3ZpZGVyXzEiLCJkZWZpbml0aW9uUHJvdmlkZXJfMSIsImhvdmVyUHJvdmlkZXJfMSIsIm9iamVjdERlZmluaXRpb25Qcm92aWRlcl8xIiwicmVmZXJlbmNlUHJvdmlkZXJfMSIsInJlbmFtZVByb3ZpZGVyXzEiLCJzaWduYXR1cmVQcm92aWRlcl8xIiwic3ltYm9sUHJvdmlkZXJfMSIsImJsb2NrRm9ybWF0UHJvdmlkZXJfMSIsImRpc3BhdGNoZXJfMSIsIm9uRW50ZXJGb3JtYXR0ZXJfMSIsInR5cGVzXzMiLCJtYWluXzEiLCJKZWRpRXh0ZW5zaW9uQWN0aXZhdG9yIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlTWFuYWdlciIsImNvbnRleHQiLCJnZXQiLCJJRXh0ZW5zaW9uQ29udGV4dCIsImRvY3VtZW50U2VsZWN0b3IiLCJQWVRIT04iLCJhY3RpdmF0ZSIsImplZGlGYWN0b3J5IiwiSmVkaUZhY3RvcnkiLCJhc0Fic29sdXRlUGF0aCIsInN1YnNjcmlwdGlvbnMiLCJwdXNoIiwiYWN0aXZhdGVHb1RvT2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyIiwibGFuZ3VhZ2VzIiwicmVnaXN0ZXJSZW5hbWVQcm92aWRlciIsIlB5dGhvblJlbmFtZVByb3ZpZGVyIiwiZGVmaW5pdGlvblByb3ZpZGVyIiwiUHl0aG9uRGVmaW5pdGlvblByb3ZpZGVyIiwicmVnaXN0ZXJEZWZpbml0aW9uUHJvdmlkZXIiLCJyZWdpc3RlckhvdmVyUHJvdmlkZXIiLCJQeXRob25Ib3ZlclByb3ZpZGVyIiwicmVnaXN0ZXJSZWZlcmVuY2VQcm92aWRlciIsIlB5dGhvblJlZmVyZW5jZVByb3ZpZGVyIiwicmVnaXN0ZXJDb21wbGV0aW9uSXRlbVByb3ZpZGVyIiwiUHl0aG9uQ29tcGxldGlvbkl0ZW1Qcm92aWRlciIsInJlZ2lzdGVyQ29kZUxlbnNQcm92aWRlciIsIklTaGViYW5nQ29kZUxlbnNQcm92aWRlciIsIm9uVHlwZURpc3BhdGNoZXIiLCJPblR5cGVGb3JtYXR0aW5nRGlzcGF0Y2hlciIsIk9uRW50ZXJGb3JtYXR0ZXIiLCJCbG9ja0Zvcm1hdFByb3ZpZGVycyIsIm9uVHlwZVRyaWdnZXJzIiwiZ2V0VHJpZ2dlckNoYXJhY3RlcnMiLCJyZWdpc3Rlck9uVHlwZUZvcm1hdHRpbmdFZGl0UHJvdmlkZXIiLCJmaXJzdCIsIm1vcmUiLCJzZXJ2aWNlQ29udGFpbmVyIiwiSVNlcnZpY2VDb250YWluZXIiLCJXb3Jrc3BhY2VTeW1ib2xzIiwic3ltYm9sUHJvdmlkZXIiLCJKZWRpU3ltYm9sUHJvdmlkZXIiLCJyZWdpc3RlckRvY3VtZW50U3ltYm9sUHJvdmlkZXIiLCJweXRob25TZXR0aW5ncyIsIklDb25maWd1cmF0aW9uU2VydmljZSIsImdldFNldHRpbmdzIiwiZGV2T3B0aW9ucyIsImluZGV4T2YiLCJyZWdpc3RlclNpZ25hdHVyZUhlbHBQcm92aWRlciIsIlB5dGhvblNpZ25hdHVyZVByb3ZpZGVyIiwidGVzdE1hbmFnZW1lbnRTZXJ2aWNlIiwiSVVuaXRUZXN0TWFuYWdlbWVudFNlcnZpY2UiLCJhY3RpdmF0ZUNvZGVMZW5zZXMiLCJjYXRjaCIsImV4IiwiSUxvZ2dlciIsImxvZ0Vycm9yIiwiZGVhY3RpdmF0ZSIsImRpc3Bvc2UiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJDLENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQUosR0FBUUgsTUFBUixHQUFpQkUsSUFBSSxLQUFLLElBQVQsR0FBZ0JBLElBQUksR0FBR0ssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUFySDtBQUFBLE1BQTJITyxDQUEzSDtBQUNBLE1BQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxPQUFPLENBQUNDLFFBQWYsS0FBNEIsVUFBL0QsRUFBMkVMLENBQUMsR0FBR0ksT0FBTyxDQUFDQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQ0ssS0FBSyxJQUFJVSxDQUFDLEdBQUdiLFVBQVUsQ0FBQ00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sQ0FBQyxJQUFJLENBQXpDLEVBQTRDQSxDQUFDLEVBQTdDLEVBQWlELElBQUlILENBQUMsR0FBR1YsVUFBVSxDQUFDYSxDQUFELENBQWxCLEVBQXVCTixDQUFDLEdBQUcsQ0FBQ0gsQ0FBQyxHQUFHLENBQUosR0FBUU0sQ0FBQyxDQUFDSCxDQUFELENBQVQsR0FBZUgs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QixDQUFDeUIsb0JBQXJCLENBQTBDcUIsZ0JBQTFDLENBQTlELENBQTNCO0FBQ0EsWUFBTWEscUJBQXFCLEdBQUcsS0FBS2pELGNBQUwsQ0FBb0JFLEdBQXBCLENBQXdCTixPQUFPLENBQUNzRCwwQkFBaEMsQ0FBOUI7QUFDQUQsTUFBQUEscUJBQXFCLENBQUMzQyxRQUF0QixHQUNLaEMsSUFETCxDQUNVLE1BQU0yRSxxQkFBcUIsQ0FBQ0Usa0JBQXRCLENBQXlDWixjQUF6QyxDQURoQixFQUVLYSxLQUZMLENBRVdDLEVBQUUsSUFBSSxLQUFLckQsY0FBTCxDQUFvQkUsR0FBcEIsQ0FBd0JyQixPQUFPLENBQUN5RSxPQUFoQyxFQUF5Q0MsUUFBekMsQ0FBa0QsK0JBQWxELEVBQW1GRixFQUFuRixDQUZqQjtBQUdBLGFBQU8sSUFBUDtBQUNILEtBbkNlLENBQWhCO0FBb0NIOztBQUNERyxFQUFBQSxVQUFVLEdBQUc7QUFDVCxXQUFPbEcsU0FBUyxDQUFDLElBQUQsRUFBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDaEQsVUFBSSxLQUFLaUQsV0FBVCxFQUFzQjtBQUNsQixhQUFLQSxXQUFMLENBQWlCa0QsT0FBakI7QUFDSDtBQUNKLEtBSmUsQ0FBaEI7QUFLSDs7QUFsRHFELENBQTFEO0FBb0RBM0Qsc0JBQXNCLEdBQUczRCxVQUFVLENBQUMsQ0FDaENzQyxXQUFXLENBQUNpRixVQUFaLEVBRGdDLEVBRWhDdkcsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQ2tGLE1BQVosQ0FBbUI1RSxPQUFPLENBQUM2RSxlQUEzQixDQUFKLENBRnlCLENBQUQsRUFHaEM5RCxzQkFIZ0MsQ0FBbkM7QUFJQXRCLE9BQU8sQ0FBQ3NCLHNCQUFSLEdBQWlDQSxzQkFBakMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcclxuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vY29uc3RhbnRzXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgY29udHJhY3RzXzEgPSByZXF1aXJlKFwiLi4vaW50ZXJwcmV0ZXIvY29udHJhY3RzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL2lvYy90eXBlc1wiKTtcclxuY29uc3QgamVkaVByb3h5RmFjdG9yeV8xID0gcmVxdWlyZShcIi4uL2xhbmd1YWdlU2VydmljZXMvamVkaVByb3h5RmFjdG9yeVwiKTtcclxuY29uc3QgY29tcGxldGlvblByb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vcHJvdmlkZXJzL2NvbXBsZXRpb25Qcm92aWRlclwiKTtcclxuY29uc3QgZGVmaW5pdGlvblByb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vcHJvdmlkZXJzL2RlZmluaXRpb25Qcm92aWRlclwiKTtcclxuY29uc3QgaG92ZXJQcm92aWRlcl8xID0gcmVxdWlyZShcIi4uL3Byb3ZpZGVycy9ob3ZlclByb3ZpZGVyXCIpO1xyXG5jb25zdCBvYmplY3REZWZpbml0aW9uUHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuLi9wcm92aWRlcnMvb2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyXCIpO1xyXG5jb25zdCByZWZlcmVuY2VQcm92aWRlcl8xID0gcmVxdWlyZShcIi4uL3Byb3ZpZGVycy9yZWZlcmVuY2VQcm92aWRlclwiKTtcclxuY29uc3QgcmVuYW1lUHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuLi9wcm92aWRlcnMvcmVuYW1lUHJvdmlkZXJcIik7XHJcbmNvbnN0IHNpZ25hdHVyZVByb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vcHJvdmlkZXJzL3NpZ25hdHVyZVByb3ZpZGVyXCIpO1xyXG5jb25zdCBzeW1ib2xQcm92aWRlcl8xID0gcmVxdWlyZShcIi4uL3Byb3ZpZGVycy9zeW1ib2xQcm92aWRlclwiKTtcclxuY29uc3QgYmxvY2tGb3JtYXRQcm92aWRlcl8xID0gcmVxdWlyZShcIi4uL3R5cGVGb3JtYXR0ZXJzL2Jsb2NrRm9ybWF0UHJvdmlkZXJcIik7XHJcbmNvbnN0IGRpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuLi90eXBlRm9ybWF0dGVycy9kaXNwYXRjaGVyXCIpO1xyXG5jb25zdCBvbkVudGVyRm9ybWF0dGVyXzEgPSByZXF1aXJlKFwiLi4vdHlwZUZvcm1hdHRlcnMvb25FbnRlckZvcm1hdHRlclwiKTtcclxuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi91bml0dGVzdHMvdHlwZXNcIik7XHJcbmNvbnN0IG1haW5fMSA9IHJlcXVpcmUoXCIuLi93b3Jrc3BhY2VTeW1ib2xzL21haW5cIik7XHJcbmxldCBKZWRpRXh0ZW5zaW9uQWN0aXZhdG9yID0gY2xhc3MgSmVkaUV4dGVuc2lvbkFjdGl2YXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMuc2VydmljZU1hbmFnZXIgPSBzZXJ2aWNlTWFuYWdlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnNlcnZpY2VNYW5hZ2VyLmdldCh0eXBlc18xLklFeHRlbnNpb25Db250ZXh0KTtcclxuICAgICAgICB0aGlzLmRvY3VtZW50U2VsZWN0b3IgPSBjb25zdGFudHNfMS5QWVRIT047XHJcbiAgICB9XHJcbiAgICBhY3RpdmF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICAgICBjb25zdCBqZWRpRmFjdG9yeSA9IHRoaXMuamVkaUZhY3RvcnkgPSBuZXcgamVkaVByb3h5RmFjdG9yeV8xLkplZGlGYWN0b3J5KGNvbnRleHQuYXNBYnNvbHV0ZVBhdGgoJy4nKSwgdGhpcy5zZXJ2aWNlTWFuYWdlcik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKGplZGlGYWN0b3J5KTtcclxuICAgICAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2goLi4ub2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyXzEuYWN0aXZhdGVHb1RvT2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyKGplZGlGYWN0b3J5KSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKGplZGlGYWN0b3J5KTtcclxuICAgICAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2godnNjb2RlXzEubGFuZ3VhZ2VzLnJlZ2lzdGVyUmVuYW1lUHJvdmlkZXIodGhpcy5kb2N1bWVudFNlbGVjdG9yLCBuZXcgcmVuYW1lUHJvdmlkZXJfMS5QeXRob25SZW5hbWVQcm92aWRlcih0aGlzLnNlcnZpY2VNYW5hZ2VyKSkpO1xyXG4gICAgICAgICAgICBjb25zdCBkZWZpbml0aW9uUHJvdmlkZXIgPSBuZXcgZGVmaW5pdGlvblByb3ZpZGVyXzEuUHl0aG9uRGVmaW5pdGlvblByb3ZpZGVyKGplZGlGYWN0b3J5KTtcclxuICAgICAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2godnNjb2RlXzEubGFuZ3VhZ2VzLnJlZ2lzdGVyRGVmaW5pdGlvblByb3ZpZGVyKHRoaXMuZG9jdW1lbnRTZWxlY3RvciwgZGVmaW5pdGlvblByb3ZpZGVyKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKHZzY29kZV8xLmxhbmd1YWdlcy5yZWdpc3RlckhvdmVyUHJvdmlkZXIodGhpcy5kb2N1bWVudFNlbGVjdG9yLCBuZXcgaG92ZXJQcm92aWRlcl8xLlB5dGhvbkhvdmVyUHJvdmlkZXIoamVkaUZhY3RvcnkpKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKHZzY29kZV8xLmxhbmd1YWdlcy5yZWdpc3RlclJlZmVyZW5jZVByb3ZpZGVyKHRoaXMuZG9jdW1lbnRTZWxlY3RvciwgbmV3IHJlZmVyZW5jZVByb3ZpZGVyXzEuUHl0aG9uUmVmZXJlbmNlUHJvdmlkZXIoamVkaUZhY3RvcnkpKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKHZzY29kZV8xLmxhbmd1YWdlcy5yZWdpc3RlckNvbXBsZXRpb25JdGVtUHJvdmlkZXIodGhpcy5kb2N1bWVudFNlbGVjdG9yLCBuZXcgY29tcGxldGlvblByb3ZpZGVyXzEuUHl0aG9uQ29tcGxldGlvbkl0ZW1Qcm92aWRlcihqZWRpRmFjdG9yeSwgdGhpcy5zZXJ2aWNlTWFuYWdlciksICcuJykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbnMucHVzaCh2c2NvZGVfMS5sYW5ndWFnZXMucmVnaXN0ZXJDb2RlTGVuc1Byb3ZpZGVyKHRoaXMuZG9jdW1lbnRTZWxlY3RvciwgdGhpcy5zZXJ2aWNlTWFuYWdlci5nZXQoY29udHJhY3RzXzEuSVNoZWJhbmdDb2RlTGVuc1Byb3ZpZGVyKSkpO1xyXG4gICAgICAgICAgICBjb25zdCBvblR5cGVEaXNwYXRjaGVyID0gbmV3IGRpc3BhdGNoZXJfMS5PblR5cGVGb3JtYXR0aW5nRGlzcGF0Y2hlcih7XHJcbiAgICAgICAgICAgICAgICAnXFxuJzogbmV3IG9uRW50ZXJGb3JtYXR0ZXJfMS5PbkVudGVyRm9ybWF0dGVyKCksXHJcbiAgICAgICAgICAgICAgICAnOic6IG5ldyBibG9ja0Zvcm1hdFByb3ZpZGVyXzEuQmxvY2tGb3JtYXRQcm92aWRlcnMoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3Qgb25UeXBlVHJpZ2dlcnMgPSBvblR5cGVEaXNwYXRjaGVyLmdldFRyaWdnZXJDaGFyYWN0ZXJzKCk7XHJcbiAgICAgICAgICAgIGlmIChvblR5cGVUcmlnZ2Vycykge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2godnNjb2RlXzEubGFuZ3VhZ2VzLnJlZ2lzdGVyT25UeXBlRm9ybWF0dGluZ0VkaXRQcm92aWRlcihjb25zdGFudHNfMS5QWVRIT04sIG9uVHlwZURpc3BhdGNoZXIsIG9uVHlwZVRyaWdnZXJzLmZpcnN0LCAuLi5vblR5cGVUcmlnZ2Vycy5tb3JlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lciA9IHRoaXMuc2VydmljZU1hbmFnZXIuZ2V0KHR5cGVzXzIuSVNlcnZpY2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbnMucHVzaChuZXcgbWFpbl8xLldvcmtzcGFjZVN5bWJvbHMoc2VydmljZUNvbnRhaW5lcikpO1xyXG4gICAgICAgICAgICBjb25zdCBzeW1ib2xQcm92aWRlciA9IG5ldyBzeW1ib2xQcm92aWRlcl8xLkplZGlTeW1ib2xQcm92aWRlcihzZXJ2aWNlQ29udGFpbmVyLCBqZWRpRmFjdG9yeSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKHZzY29kZV8xLmxhbmd1YWdlcy5yZWdpc3RlckRvY3VtZW50U3ltYm9sUHJvdmlkZXIodGhpcy5kb2N1bWVudFNlbGVjdG9yLCBzeW1ib2xQcm92aWRlcikpO1xyXG4gICAgICAgICAgICBjb25zdCBweXRob25TZXR0aW5ncyA9IHRoaXMuc2VydmljZU1hbmFnZXIuZ2V0KHR5cGVzXzEuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKS5nZXRTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICBpZiAocHl0aG9uU2V0dGluZ3MuZGV2T3B0aW9ucy5pbmRleE9mKCdESVNBQkxFX1NJR05BVFVSRScpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2godnNjb2RlXzEubGFuZ3VhZ2VzLnJlZ2lzdGVyU2lnbmF0dXJlSGVscFByb3ZpZGVyKHRoaXMuZG9jdW1lbnRTZWxlY3RvciwgbmV3IHNpZ25hdHVyZVByb3ZpZGVyXzEuUHl0aG9uU2lnbmF0dXJlUHJvdmlkZXIoamVkaUZhY3RvcnkpLCAnKCcsICcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9ucy5wdXNoKHZzY29kZV8xLmxhbmd1YWdlcy5yZWdpc3RlclJlbmFtZVByb3ZpZGVyKGNvbnN0YW50c18xLlBZVEhPTiwgbmV3IHJlbmFtZVByb3ZpZGVyXzEuUHl0aG9uUmVuYW1lUHJvdmlkZXIoc2VydmljZUNvbnRhaW5lcikpKTtcclxuICAgICAgICAgICAgY29uc3QgdGVzdE1hbmFnZW1lbnRTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlTWFuYWdlci5nZXQodHlwZXNfMy5JVW5pdFRlc3RNYW5hZ2VtZW50U2VydmljZSk7XHJcbiAgICAgICAgICAgIHRlc3RNYW5hZ2VtZW50U2VydmljZS5hY3RpdmF0ZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0ZXN0TWFuYWdlbWVudFNlcnZpY2UuYWN0aXZhdGVDb2RlTGVuc2VzKHN5bWJvbFByb3ZpZGVyKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChleCA9PiB0aGlzLnNlcnZpY2VNYW5hZ2VyLmdldCh0eXBlc18xLklMb2dnZXIpLmxvZ0Vycm9yKCdGYWlsZWQgdG8gYWN0aXZhdGUgVW5pdCBUZXN0cycsIGV4KSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZGVhY3RpdmF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5qZWRpRmFjdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qZWRpRmFjdG9yeS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuSmVkaUV4dGVuc2lvbkFjdGl2YXRvciA9IF9fZGVjb3JhdGUoW1xyXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxyXG4gICAgX19wYXJhbSgwLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMi5JU2VydmljZU1hbmFnZXIpKVxyXG5dLCBKZWRpRXh0ZW5zaW9uQWN0aXZhdG9yKTtcclxuZXhwb3J0cy5KZWRpRXh0ZW5zaW9uQWN0aXZhdG9yID0gSmVkaUV4dGVuc2lvbkFjdGl2YXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9amVkaS5qcy5tYXAiXX0=