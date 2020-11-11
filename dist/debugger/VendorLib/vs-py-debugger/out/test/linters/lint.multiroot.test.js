"use strict";

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

const path = require("path");

const vscode_1 = require("vscode");

const configSettings_1 = require("../../client/common/configSettings");

const productPath_1 = require("../../client/common/installer/productPath");

const productService_1 = require("../../client/common/installer/productService");

const types_1 = require("../../client/common/installer/types");

const types_2 = require("../../client/common/types");

const types_3 = require("../../client/linters/types");

const constants_1 = require("../../client/unittests/common/constants");

const initialize_1 = require("../initialize");

const serviceRegistry_1 = require("../unittests/serviceRegistry"); // tslint:disable:max-func-body-length no-invalid-this


const multirootPath = path.join(__dirname, '..', '..', '..', 'src', 'testMultiRootWkspc');
suite('Multiroot Linting', () => {
  const pylintSetting = 'linting.pylintEnabled';
  const flake8Setting = 'linting.flake8Enabled';
  let ioc;
  suiteSetup(function () {
    if (!initialize_1.IS_MULTI_ROOT_TEST) {
      this.skip();
    }

    return initialize_1.initialize();
  });
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    initializeDI();
    yield initialize_1.initializeTest();
  }));
  suiteTeardown(initialize_1.closeActiveWindows);
  teardown(() => __awaiter(void 0, void 0, void 0, function* () {
    ioc.dispose();
    yield initialize_1.closeActiveWindows();
    configSettings_1.PythonSettings.dispose();
  }));

  function initializeDI() {
    ioc = new serviceRegistry_1.UnitTestIocContainer();
    ioc.registerCommonTypes(false);
    ioc.registerProcessTypes();
    ioc.registerLinterTypes();
    ioc.registerVariableTypes();
    ioc.registerPlatformTypes();
    ioc.serviceManager.addSingletonInstance(types_1.IProductService, new productService_1.ProductService());
    ioc.serviceManager.addSingleton(types_1.IProductPathService, productPath_1.CTagsProductPathService, types_2.ProductType.WorkspaceSymbols);
    ioc.serviceManager.addSingleton(types_1.IProductPathService, productPath_1.FormatterProductPathService, types_2.ProductType.Formatter);
    ioc.serviceManager.addSingleton(types_1.IProductPathService, productPath_1.LinterProductPathService, types_2.ProductType.Linter);
    ioc.serviceManager.addSingleton(types_1.IProductPathService, productPath_1.TestFrameworkProductPathService, types_2.ProductType.TestFramework);
    ioc.serviceManager.addSingleton(types_1.IProductPathService, productPath_1.RefactoringLibraryProductPathService, types_2.ProductType.RefactoringLibrary);
  }

  function createLinter(product, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const mockOutputChannel = ioc.serviceContainer.get(types_2.IOutputChannel, constants_1.TEST_OUTPUT_CHANNEL);
      const lm = ioc.serviceContainer.get(types_3.ILinterManager);
      yield lm.setActiveLintersAsync([product], resource);
      return lm.createLinter(product, mockOutputChannel, ioc.serviceContainer);
    });
  }

  function testLinterInWorkspaceFolder(product, workspaceFolderRelativePath, mustHaveErrors) {
    return __awaiter(this, void 0, void 0, function* () {
      const fileToLint = path.join(multirootPath, workspaceFolderRelativePath, 'file.py');
      const cancelToken = new vscode_1.CancellationTokenSource();
      const document = yield vscode_1.workspace.openTextDocument(fileToLint);
      const linter = yield createLinter(product);
      const messages = yield linter.lint(document, cancelToken.token);
      const errorMessage = mustHaveErrors ? 'No errors returned by linter' : 'Errors returned by linter';
      assert.equal(messages.length > 0, mustHaveErrors, errorMessage);
    });
  }

  function enableDisableSetting(workspaceFolder, configTarget, setting, value) {
    return __awaiter(this, void 0, void 0, function* () {
      const config = ioc.serviceContainer.get(types_2.IConfigurationService);
      yield config.updateSetting(setting, value, vscode_1.Uri.file(workspaceFolder), configTarget);
    });
  }

  test('Enabling Pylint in root and also in Workspace, should return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.pylint, true, true, pylintSetting);
  }));
  test('Enabling Pylint in root and disabling in Workspace, should not return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.pylint, true, false, pylintSetting);
  }));
  test('Disabling Pylint in root and enabling in Workspace, should return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.pylint, false, true, pylintSetting);
  }));
  test('Enabling Flake8 in root and also in Workspace, should return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.flake8, true, true, flake8Setting);
  }));
  test('Enabling Flake8 in root and disabling in Workspace, should not return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.flake8, true, false, flake8Setting);
  }));
  test('Disabling Flake8 in root and enabling in Workspace, should return errors', () => __awaiter(void 0, void 0, void 0, function* () {
    yield runTest(types_2.Product.flake8, false, true, flake8Setting);
  }));

  function runTest(product, global, wks, setting) {
    return __awaiter(this, void 0, void 0, function* () {
      const expected = wks ? wks : global;
      yield enableDisableSetting(multirootPath, vscode_1.ConfigurationTarget.Global, setting, global);
      yield enableDisableSetting(multirootPath, vscode_1.ConfigurationTarget.Workspace, setting, wks);
      yield testLinterInWorkspaceFolder(product, 'workspace1', expected);
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnQubXVsdGlyb290LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImFzc2VydCIsInJlcXVpcmUiLCJwYXRoIiwidnNjb2RlXzEiLCJjb25maWdTZXR0aW5nc18xIiwicHJvZHVjdFBhdGhfMSIsInByb2R1Y3RTZXJ2aWNlXzEiLCJ0eXBlc18xIiwidHlwZXNfMiIsInR5cGVzXzMiLCJjb25zdGFudHNfMSIsImluaXRpYWxpemVfMSIsInNlcnZpY2VSZWdpc3RyeV8xIiwibXVsdGlyb290UGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJzdWl0ZSIsInB5bGludFNldHRpbmciLCJmbGFrZThTZXR0aW5nIiwiaW9jIiwic3VpdGVTZXR1cCIsIklTX01VTFRJX1JPT1RfVEVTVCIsInNraXAiLCJpbml0aWFsaXplIiwic2V0dXAiLCJpbml0aWFsaXplREkiLCJpbml0aWFsaXplVGVzdCIsInN1aXRlVGVhcmRvd24iLCJjbG9zZUFjdGl2ZVdpbmRvd3MiLCJ0ZWFyZG93biIsImRpc3Bvc2UiLCJQeXRob25TZXR0aW5ncyIsIlVuaXRUZXN0SW9jQ29udGFpbmVyIiwicmVnaXN0ZXJDb21tb25UeXBlcyIsInJlZ2lzdGVyUHJvY2Vzc1R5cGVzIiwicmVnaXN0ZXJMaW50ZXJUeXBlcyIsInJlZ2lzdGVyVmFyaWFibGVUeXBlcyIsInJlZ2lzdGVyUGxhdGZvcm1UeXBlcyIsInNlcnZpY2VNYW5hZ2VyIiwiYWRkU2luZ2xldG9uSW5zdGFuY2UiLCJJUHJvZHVjdFNlcnZpY2UiLCJQcm9kdWN0U2VydmljZSIsImFkZFNpbmdsZXRvbiIsIklQcm9kdWN0UGF0aFNlcnZpY2UiLCJDVGFnc1Byb2R1Y3RQYXRoU2VydmljZSIsIlByb2R1Y3RUeXBlIiwiV29ya3NwYWNlU3ltYm9scyIsIkZvcm1hdHRlclByb2R1Y3RQYXRoU2VydmljZSIsIkZvcm1hdHRlciIsIkxpbnRlclByb2R1Y3RQYXRoU2VydmljZSIsIkxpbnRlciIsIlRlc3RGcmFtZXdvcmtQcm9kdWN0UGF0aFNlcnZpY2UiLCJUZXN0RnJhbWV3b3JrIiwiUmVmYWN0b3JpbmdMaWJyYXJ5UHJvZHVjdFBhdGhTZXJ2aWNlIiwiUmVmYWN0b3JpbmdMaWJyYXJ5IiwiY3JlYXRlTGludGVyIiwicHJvZHVjdCIsInJlc291cmNlIiwibW9ja091dHB1dENoYW5uZWwiLCJzZXJ2aWNlQ29udGFpbmVyIiwiZ2V0IiwiSU91dHB1dENoYW5uZWwiLCJURVNUX09VVFBVVF9DSEFOTkVMIiwibG0iLCJJTGludGVyTWFuYWdlciIsInNldEFjdGl2ZUxpbnRlcnNBc3luYyIsInRlc3RMaW50ZXJJbldvcmtzcGFjZUZvbGRlciIsIndvcmtzcGFjZUZvbGRlclJlbGF0aXZlUGF0aCIsIm11c3RIYXZlRXJyb3JzIiwiZmlsZVRvTGludCIsImNhbmNlbFRva2VuIiwiQ2FuY2VsbGF0aW9uVG9rZW5Tb3VyY2UiLCJkb2N1bWVudCIsIndvcmtzcGFjZSIsIm9wZW5UZXh0RG9jdW1lbnQiLCJsaW50ZXIiLCJtZXNzYWdlcyIsImxpbnQiLCJ0b2tlbiIsImVycm9yTWVzc2FnZSIsImVxdWFsIiwibGVuZ3RoIiwiZW5hYmxlRGlzYWJsZVNldHRpbmciLCJ3b3Jrc3BhY2VGb2xkZXIiLCJjb25maWdUYXJnZXQiLCJzZXR0aW5nIiwiY29uZmlnIiwiSUNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwidXBkYXRlU2V0dGluZyIsIlVyaSIsImZpbGUiLCJ0ZXN0IiwicnVuVGVzdCIsIlByb2R1Y3QiLCJweWxpbnQiLCJmbGFrZTgiLCJnbG9iYWwiLCJ3a3MiLCJleHBlY3RlZCIsIkNvbmZpZ3VyYXRpb25UYXJnZXQiLCJH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QUMsSUFBRCxFQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNoRCxZQUFNdUgsUUFBUSxHQUFHRCxHQUFHLEdBQUdBLEdBQUgsR0FBU0QsTUFBN0I7QUFDQSxZQUFNZCxvQkFBb0IsQ0FBQ3JFLGFBQUQsRUFBZ0JWLFFBQVEsQ0FBQ2dHLG1CQUFULENBQTZCQyxNQUE3QyxFQUFxRGYsT0FBckQsRUFBOERXLE1BQTlELENBQTFCO0FBQ0EsWUFBTWQsb0JBQW9CLENBQUNyRSxhQUFELEVBQWdCVixRQUFRLENBQUNnRyxtQkFBVCxDQUE2QkUsU0FBN0MsRUFBd0RoQixPQUF4RCxFQUFpRVksR0FBakUsQ0FBMUI7QUFDQSxZQUFNL0IsMkJBQTJCLENBQUNWLE9BQUQsRUFBVSxZQUFWLEVBQXdCMEMsUUFBeEIsQ0FBakM7QUFDSCxLQUxlLENBQWhCO0FBTUg7QUFDSixDQXJGSSxDQUFMIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IGNvbmZpZ1NldHRpbmdzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2NvbW1vbi9jb25maWdTZXR0aW5nc1wiKTtcclxuY29uc3QgcHJvZHVjdFBhdGhfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL2luc3RhbGxlci9wcm9kdWN0UGF0aFwiKTtcclxuY29uc3QgcHJvZHVjdFNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL2luc3RhbGxlci9wcm9kdWN0U2VydmljZVwiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL2luc3RhbGxlci90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL3R5cGVzXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvdW5pdHRlc3RzL2NvbW1vbi9jb25zdGFudHNcIik7XHJcbmNvbnN0IGluaXRpYWxpemVfMSA9IHJlcXVpcmUoXCIuLi9pbml0aWFsaXplXCIpO1xyXG5jb25zdCBzZXJ2aWNlUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuLi91bml0dGVzdHMvc2VydmljZVJlZ2lzdHJ5XCIpO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtZnVuYy1ib2R5LWxlbmd0aCBuby1pbnZhbGlkLXRoaXNcclxuY29uc3QgbXVsdGlyb290UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdzcmMnLCAndGVzdE11bHRpUm9vdFdrc3BjJyk7XHJcbnN1aXRlKCdNdWx0aXJvb3QgTGludGluZycsICgpID0+IHtcclxuICAgIGNvbnN0IHB5bGludFNldHRpbmcgPSAnbGludGluZy5weWxpbnRFbmFibGVkJztcclxuICAgIGNvbnN0IGZsYWtlOFNldHRpbmcgPSAnbGludGluZy5mbGFrZThFbmFibGVkJztcclxuICAgIGxldCBpb2M7XHJcbiAgICBzdWl0ZVNldHVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIWluaXRpYWxpemVfMS5JU19NVUxUSV9ST09UX1RFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplXzEuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBzZXR1cCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaW5pdGlhbGl6ZURJKCk7XHJcbiAgICAgICAgeWllbGQgaW5pdGlhbGl6ZV8xLmluaXRpYWxpemVUZXN0KCk7XHJcbiAgICB9KSk7XHJcbiAgICBzdWl0ZVRlYXJkb3duKGluaXRpYWxpemVfMS5jbG9zZUFjdGl2ZVdpbmRvd3MpO1xyXG4gICAgdGVhcmRvd24oKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGlvYy5kaXNwb3NlKCk7XHJcbiAgICAgICAgeWllbGQgaW5pdGlhbGl6ZV8xLmNsb3NlQWN0aXZlV2luZG93cygpO1xyXG4gICAgICAgIGNvbmZpZ1NldHRpbmdzXzEuUHl0aG9uU2V0dGluZ3MuZGlzcG9zZSgpO1xyXG4gICAgfSkpO1xyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZURJKCkge1xyXG4gICAgICAgIGlvYyA9IG5ldyBzZXJ2aWNlUmVnaXN0cnlfMS5Vbml0VGVzdElvY0NvbnRhaW5lcigpO1xyXG4gICAgICAgIGlvYy5yZWdpc3RlckNvbW1vblR5cGVzKGZhbHNlKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJQcm9jZXNzVHlwZXMoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJMaW50ZXJUeXBlcygpO1xyXG4gICAgICAgIGlvYy5yZWdpc3RlclZhcmlhYmxlVHlwZXMoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJQbGF0Zm9ybVR5cGVzKCk7XHJcbiAgICAgICAgaW9jLnNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzEuSVByb2R1Y3RTZXJ2aWNlLCBuZXcgcHJvZHVjdFNlcnZpY2VfMS5Qcm9kdWN0U2VydmljZSgpKTtcclxuICAgICAgICBpb2Muc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5DVGFnc1Byb2R1Y3RQYXRoU2VydmljZSwgdHlwZXNfMi5Qcm9kdWN0VHlwZS5Xb3Jrc3BhY2VTeW1ib2xzKTtcclxuICAgICAgICBpb2Muc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5Gb3JtYXR0ZXJQcm9kdWN0UGF0aFNlcnZpY2UsIHR5cGVzXzIuUHJvZHVjdFR5cGUuRm9ybWF0dGVyKTtcclxuICAgICAgICBpb2Muc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5MaW50ZXJQcm9kdWN0UGF0aFNlcnZpY2UsIHR5cGVzXzIuUHJvZHVjdFR5cGUuTGludGVyKTtcclxuICAgICAgICBpb2Muc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5UZXN0RnJhbWV3b3JrUHJvZHVjdFBhdGhTZXJ2aWNlLCB0eXBlc18yLlByb2R1Y3RUeXBlLlRlc3RGcmFtZXdvcmspO1xyXG4gICAgICAgIGlvYy5zZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b24odHlwZXNfMS5JUHJvZHVjdFBhdGhTZXJ2aWNlLCBwcm9kdWN0UGF0aF8xLlJlZmFjdG9yaW5nTGlicmFyeVByb2R1Y3RQYXRoU2VydmljZSwgdHlwZXNfMi5Qcm9kdWN0VHlwZS5SZWZhY3RvcmluZ0xpYnJhcnkpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTGludGVyKHByb2R1Y3QsIHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9ja091dHB1dENoYW5uZWwgPSBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JT3V0cHV0Q2hhbm5lbCwgY29uc3RhbnRzXzEuVEVTVF9PVVRQVVRfQ0hBTk5FTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxtID0gaW9jLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzMuSUxpbnRlck1hbmFnZXIpO1xyXG4gICAgICAgICAgICB5aWVsZCBsbS5zZXRBY3RpdmVMaW50ZXJzQXN5bmMoW3Byb2R1Y3RdLCByZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsbS5jcmVhdGVMaW50ZXIocHJvZHVjdCwgbW9ja091dHB1dENoYW5uZWwsIGlvYy5zZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHRlc3RMaW50ZXJJbldvcmtzcGFjZUZvbGRlcihwcm9kdWN0LCB3b3Jrc3BhY2VGb2xkZXJSZWxhdGl2ZVBhdGgsIG11c3RIYXZlRXJyb3JzKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZVRvTGludCA9IHBhdGguam9pbihtdWx0aXJvb3RQYXRoLCB3b3Jrc3BhY2VGb2xkZXJSZWxhdGl2ZVBhdGgsICdmaWxlLnB5Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbFRva2VuID0gbmV3IHZzY29kZV8xLkNhbmNlbGxhdGlvblRva2VuU291cmNlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50ID0geWllbGQgdnNjb2RlXzEud29ya3NwYWNlLm9wZW5UZXh0RG9jdW1lbnQoZmlsZVRvTGludCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IHlpZWxkIGNyZWF0ZUxpbnRlcihwcm9kdWN0KTtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZXMgPSB5aWVsZCBsaW50ZXIubGludChkb2N1bWVudCwgY2FuY2VsVG9rZW4udG9rZW4pO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBtdXN0SGF2ZUVycm9ycyA/ICdObyBlcnJvcnMgcmV0dXJuZWQgYnkgbGludGVyJyA6ICdFcnJvcnMgcmV0dXJuZWQgYnkgbGludGVyJztcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKG1lc3NhZ2VzLmxlbmd0aCA+IDAsIG11c3RIYXZlRXJyb3JzLCBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZW5hYmxlRGlzYWJsZVNldHRpbmcod29ya3NwYWNlRm9sZGVyLCBjb25maWdUYXJnZXQsIHNldHRpbmcsIHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gaW9jLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgICAgICAgICAgeWllbGQgY29uZmlnLnVwZGF0ZVNldHRpbmcoc2V0dGluZywgdmFsdWUsIHZzY29kZV8xLlVyaS5maWxlKHdvcmtzcGFjZUZvbGRlciksIGNvbmZpZ1RhcmdldCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0ZXN0KCdFbmFibGluZyBQeWxpbnQgaW4gcm9vdCBhbmQgYWxzbyBpbiBXb3Jrc3BhY2UsIHNob3VsZCByZXR1cm4gZXJyb3JzJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIHJ1blRlc3QodHlwZXNfMi5Qcm9kdWN0LnB5bGludCwgdHJ1ZSwgdHJ1ZSwgcHlsaW50U2V0dGluZyk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdFbmFibGluZyBQeWxpbnQgaW4gcm9vdCBhbmQgZGlzYWJsaW5nIGluIFdvcmtzcGFjZSwgc2hvdWxkIG5vdCByZXR1cm4gZXJyb3JzJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIHJ1blRlc3QodHlwZXNfMi5Qcm9kdWN0LnB5bGludCwgdHJ1ZSwgZmFsc2UsIHB5bGludFNldHRpbmcpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRGlzYWJsaW5nIFB5bGludCBpbiByb290IGFuZCBlbmFibGluZyBpbiBXb3Jrc3BhY2UsIHNob3VsZCByZXR1cm4gZXJyb3JzJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIHJ1blRlc3QodHlwZXNfMi5Qcm9kdWN0LnB5bGludCwgZmFsc2UsIHRydWUsIHB5bGludFNldHRpbmcpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRW5hYmxpbmcgRmxha2U4IGluIHJvb3QgYW5kIGFsc28gaW4gV29ya3NwYWNlLCBzaG91bGQgcmV0dXJuIGVycm9ycycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBydW5UZXN0KHR5cGVzXzIuUHJvZHVjdC5mbGFrZTgsIHRydWUsIHRydWUsIGZsYWtlOFNldHRpbmcpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRW5hYmxpbmcgRmxha2U4IGluIHJvb3QgYW5kIGRpc2FibGluZyBpbiBXb3Jrc3BhY2UsIHNob3VsZCBub3QgcmV0dXJuIGVycm9ycycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBydW5UZXN0KHR5cGVzXzIuUHJvZHVjdC5mbGFrZTgsIHRydWUsIGZhbHNlLCBmbGFrZThTZXR0aW5nKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Rpc2FibGluZyBGbGFrZTggaW4gcm9vdCBhbmQgZW5hYmxpbmcgaW4gV29ya3NwYWNlLCBzaG91bGQgcmV0dXJuIGVycm9ycycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBydW5UZXN0KHR5cGVzXzIuUHJvZHVjdC5mbGFrZTgsIGZhbHNlLCB0cnVlLCBmbGFrZThTZXR0aW5nKTtcclxuICAgIH0pKTtcclxuICAgIGZ1bmN0aW9uIHJ1blRlc3QocHJvZHVjdCwgZ2xvYmFsLCB3a3MsIHNldHRpbmcpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IHdrcyA/IHdrcyA6IGdsb2JhbDtcclxuICAgICAgICAgICAgeWllbGQgZW5hYmxlRGlzYWJsZVNldHRpbmcobXVsdGlyb290UGF0aCwgdnNjb2RlXzEuQ29uZmlndXJhdGlvblRhcmdldC5HbG9iYWwsIHNldHRpbmcsIGdsb2JhbCk7XHJcbiAgICAgICAgICAgIHlpZWxkIGVuYWJsZURpc2FibGVTZXR0aW5nKG11bHRpcm9vdFBhdGgsIHZzY29kZV8xLkNvbmZpZ3VyYXRpb25UYXJnZXQuV29ya3NwYWNlLCBzZXR0aW5nLCB3a3MpO1xyXG4gICAgICAgICAgICB5aWVsZCB0ZXN0TGludGVySW5Xb3Jrc3BhY2VGb2xkZXIocHJvZHVjdCwgJ3dvcmtzcGFjZTEnLCBleHBlY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW50Lm11bHRpcm9vdC50ZXN0LmpzLm1hcCJdfQ==