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
}); // tslint:disable:no-any max-func-body-length

const chai_1 = require("chai");

const inversify_1 = require("inversify");

const path = require("path");

const TypeMoq = require("typemoq");

const vscode_1 = require("vscode");

const types_1 = require("../../client/common/application/types");

require("../../client/common/extensions");

const types_2 = require("../../client/common/platform/types");

const types_3 = require("../../client/common/types");

const contracts_1 = require("../../client/interpreter/contracts");

const container_1 = require("../../client/ioc/container");

const serviceManager_1 = require("../../client/ioc/serviceManager");

const bandit_1 = require("../../client/linters/bandit");

const flake8_1 = require("../../client/linters/flake8");

const linterManager_1 = require("../../client/linters/linterManager");

const mypy_1 = require("../../client/linters/mypy");

const pep8_1 = require("../../client/linters/pep8");

const prospector_1 = require("../../client/linters/prospector");

const pydocstyle_1 = require("../../client/linters/pydocstyle");

const pylama_1 = require("../../client/linters/pylama");

const pylint_1 = require("../../client/linters/pylint");

const types_4 = require("../../client/linters/types");

const initialize_1 = require("../initialize");

suite('Linting - Arguments', () => {
  [undefined, path.join('users', 'dev_user')].forEach(workspaceUri => {
    [vscode_1.Uri.file(path.join('users', 'dev_user', 'development path to', 'one.py')), vscode_1.Uri.file(path.join('users', 'dev_user', 'development', 'one.py'))].forEach(fileUri => {
      suite(`File path ${fileUri.fsPath.indexOf(' ') > 0 ? 'with' : 'without'} spaces and ${workspaceUri ? 'without' : 'with'} a workspace`, () => {
        let interpreterService;
        let engine;
        let configService;
        let docManager;
        let settings;
        let lm;
        let serviceContainer;
        let document;
        let outputChannel;
        let workspaceService;
        const cancellationToken = new vscode_1.CancellationTokenSource().token;
        suiteSetup(initialize_1.initialize);
        setup(() => __awaiter(void 0, void 0, void 0, function* () {
          const cont = new inversify_1.Container();
          const serviceManager = new serviceManager_1.ServiceManager(cont);
          serviceContainer = new container_1.ServiceContainer(cont);
          outputChannel = TypeMoq.Mock.ofType();
          const fs = TypeMoq.Mock.ofType();
          fs.setup(x => x.fileExists(TypeMoq.It.isAny())).returns(() => new Promise((resolve, reject) => resolve(true)));
          fs.setup(x => x.arePathsSame(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => true);
          serviceManager.addSingletonInstance(types_2.IFileSystem, fs.object);
          serviceManager.addSingletonInstance(types_3.IOutputChannel, outputChannel.object);
          interpreterService = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(contracts_1.IInterpreterService, interpreterService.object);
          engine = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(types_4.ILintingEngine, engine.object);
          docManager = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(types_1.IDocumentManager, docManager.object);
          const lintSettings = TypeMoq.Mock.ofType();
          lintSettings.setup(x => x.enabled).returns(() => true);
          lintSettings.setup(x => x.lintOnSave).returns(() => true);
          settings = TypeMoq.Mock.ofType();
          settings.setup(x => x.linting).returns(() => lintSettings.object);
          configService = TypeMoq.Mock.ofType();
          configService.setup(x => x.getSettings(TypeMoq.It.isAny())).returns(() => settings.object);
          serviceManager.addSingletonInstance(types_3.IConfigurationService, configService.object);
          const workspaceFolder = workspaceUri ? {
            uri: vscode_1.Uri.file(workspaceUri),
            index: 0,
            name: ''
          } : undefined;
          workspaceService = TypeMoq.Mock.ofType();
          workspaceService.setup(w => w.getWorkspaceFolder(TypeMoq.It.isAny())).returns(() => workspaceFolder);
          serviceManager.addSingletonInstance(types_1.IWorkspaceService, workspaceService.object);
          const logger = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(types_3.ILogger, logger.object);
          const installer = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(types_3.IInstaller, installer.object);
          const platformService = TypeMoq.Mock.ofType();
          serviceManager.addSingletonInstance(types_2.IPlatformService, platformService.object);
          lm = new linterManager_1.LinterManager(serviceContainer, workspaceService.object);
          serviceManager.addSingletonInstance(types_4.ILinterManager, lm);
          document = TypeMoq.Mock.ofType();
        }));

        function testLinter(linter, expectedArgs) {
          return __awaiter(this, void 0, void 0, function* () {
            document.setup(d => d.uri).returns(() => fileUri);
            let invoked = false;

            linter.run = (args, doc, token) => {
              chai_1.expect(args).to.deep.equal(expectedArgs);
              invoked = true;
              return Promise.resolve([]);
            };

            yield linter.lint(document.object, cancellationToken);
            chai_1.expect(invoked).to.be.equal(true, 'method not invoked');
          });
        }

        test('Flake8', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new flake8_1.Flake8(outputChannel.object, serviceContainer);
          const expectedArgs = ['--format=%(row)d,%(col)d,%(code).1s,%(code)s:%(text)s', fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('Pep8', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new pep8_1.Pep8(outputChannel.object, serviceContainer);
          const expectedArgs = ['--format=%(row)d,%(col)d,%(code).1s,%(code)s:%(text)s', fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('Prospector', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new prospector_1.Prospector(outputChannel.object, serviceContainer);
          const expectedPath = workspaceUri ? fileUri.fsPath.substring(workspaceUri.length + 2) : path.basename(fileUri.fsPath);
          const expectedArgs = ['--absolute-paths', '--output-format=json', expectedPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('Pylama', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new pylama_1.PyLama(outputChannel.object, serviceContainer);
          const expectedArgs = ['--format=parsable', fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('MyPy', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new mypy_1.MyPy(outputChannel.object, serviceContainer);
          const expectedArgs = [fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('Pydocstyle', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new pydocstyle_1.PyDocStyle(outputChannel.object, serviceContainer);
          const expectedArgs = [fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
        test('Pylint', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new pylint_1.Pylint(outputChannel.object, serviceContainer);
          document.setup(d => d.uri).returns(() => fileUri);
          let invoked = false;

          linter.run = (args, doc, token) => {
            chai_1.expect(args[args.length - 1]).to.equal(fileUri.fsPath);
            invoked = true;
            return Promise.resolve([]);
          };

          yield linter.lint(document.object, cancellationToken);
          chai_1.expect(invoked).to.be.equal(true, 'method not invoked');
        }));
        test('Bandit', () => __awaiter(void 0, void 0, void 0, function* () {
          const linter = new bandit_1.Bandit(outputChannel.object, serviceContainer);
          const expectedArgs = ['-f', 'custom', '--msg-template', '{line},0,{severity},{test_id}:{msg}', '-n', '-1', fileUri.fsPath];
          yield testLinter(linter, expectedArgs);
        }));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnQuYXJncy50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJjaGFpXzEiLCJyZXF1aXJlIiwiaW52ZXJzaWZ5XzEiLCJwYXRoIiwiVHlwZU1vcSIsInZzY29kZV8xIiwidHlwZXNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwiY29udHJhY3RzXzEiLCJjb250YWluZXJfMSIsInNlcnZpY2VNYW5hZ2VyXzEiLCJiYW5kaXRfMSIsImZsYWtlOF8xIiwibGludGVyTWFuYWdlcl8xIiwibXlweV8xIiwicGVwOF8xIiwicHJvc3BlY3Rvcl8xIiwicHlkb2NzdHlsZV8xIiwicHlsYW1hXzEiLCJweWxpbnRfMSIsInR5cGVzXzQiLCJpbml0aWFsaXplXzEiLCJzdWl0ZSIsInVuZGVmaW5lZCIsImpvaW4iLCJmb3JFYWNoIiwid29ya3NwYWNlVXJpIiwiVXJpIiwiZmlsZSIsImZpbGVVcmkiLCJmc1BhdGgiLCJpbmRleE9mIiwiaW50ZXJwcmV0ZXJTZXJ2aWNlIiwiZW5naW5lIiwiY29uZmlnU2VydmljZSIsImRvY01hbmFnZXIiLCJzZXR0aW5ncyIsImxtIiwic2VydmljZUNvbnRhaW5lciIsImRvY3VtZW50Iiwib3V0cHV0Q2hhbm5lbCIsIndvcmtzcGFjZVNlcnZpY2UiLCJjYW5jZWxsYXRpb25Ub2tlbiIsIkNhbmNlbGxhdGlvblRva2VuU291cmNlIiwidG9rZW4iLCJzdWl0ZVNldHVwIiwiaW5pdGlhbGl6ZSIsInNldHVwIiwiY29udCIsIkNvbnRhaW5lciIsInNlcnZpY2VNYW5hZ2VyIiwiU2VydmljZU1hbmFnZXIiLCJTZXJ2aWNlQ29udGFpbmVyIiwiTW9jayIsIm9mVHlwZSIsImZzIiwieCIsImZpbGVFeGlzdHMiLCJJdCIsImlzQW55IiwicmV0dXJucyIsImFyZVBhdGhzU2FtZSIsImlzQW55U3RyaW5nIiwiYWRkU2luZ2xldG9uSW5zdGFuY2UiLCJJRmlsZVN5c3RlbSIsIm9iamVjdCIsIklPdXRwdXRDaGFubmVsIiwiSUludGVycHJldGVyU2VydmljZSIsIklMaW50aW5nRW5naW5lIiwiSURvY3VtZW50TWFuYWdlciIsImxpbnRTZXR0aW5ncyIsImVuYWJsZWQiLCJsaW50T25TYXZlIiwibGludGluZyIsImdldFNldHRpbmdzIiwiSUNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwid29ya3NwYWNlRm9sZGVyIiwidXJpIiwiaW5kZXgiLCJuYW1lIiwidyIsImdldFdvcmtzcGFjZUZvbGRlciIsIklXb3Jrc3BhY2VTZXJ2aWNlIiwibG9nZ2VyIiwiSUxvZ2dlciIsImluc3RhbGxlciIsIklJbnN0YWxsZXIiLCJwbGF0Zm9ybVNlcnZpY2UiLCJJUGxhdGZvcm1TZXJ2aWNlIiwiTGludGVyTWFuYWdlciIsIklMaW50ZXJNYW5hZ2VyIiwidGVzdExpbnRlciIsImxpbnRlciIsImV4cGVjdGVkQXJncyIsImQiLCJpbnZva2VkIiwicnVuIiwiYXJncyIsImRvYyIsImV4cGVjdCIsInRvIiwiZGVlcCIsImVxdWFsIiwibGludCIsImJlIiwidGVzdCIsIkZsYWtlOCIsIlBlcDgiLCJQcm9zcGVjdG9yIiwiZXhwZWN0ZWRQYXRoIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwiYmFzZW5hbWUiLCJQeUxhbWEiLCJNeVB5IiwiUHlEb2NTdHlsZSIsIlB5bGludCIsIkJhbmRpdCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFNBQVMsR0FBSSxVQUFRLFNBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztBQUNyRixTQUFPLEtBQUtELENB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O0FBcUhILENBdEhJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gdHNsaW50OmRpc2FibGU6bm8tYW55IG1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3QgVHlwZU1vcSA9IHJlcXVpcmUoXCJ0eXBlbW9xXCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2NvbW1vbi9hcHBsaWNhdGlvbi90eXBlc1wiKTtcclxucmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vZXh0ZW5zaW9uc1wiKTtcclxuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3BsYXRmb3JtL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IGNvbnRyYWN0c18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pbnRlcnByZXRlci9jb250cmFjdHNcIik7XHJcbmNvbnN0IGNvbnRhaW5lcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2MvY29udGFpbmVyXCIpO1xyXG5jb25zdCBzZXJ2aWNlTWFuYWdlcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2Mvc2VydmljZU1hbmFnZXJcIik7XHJcbmNvbnN0IGJhbmRpdF8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL2JhbmRpdFwiKTtcclxuY29uc3QgZmxha2U4XzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2xpbnRlcnMvZmxha2U4XCIpO1xyXG5jb25zdCBsaW50ZXJNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2xpbnRlcnMvbGludGVyTWFuYWdlclwiKTtcclxuY29uc3QgbXlweV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL215cHlcIik7XHJcbmNvbnN0IHBlcDhfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvbGludGVycy9wZXA4XCIpO1xyXG5jb25zdCBwcm9zcGVjdG9yXzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2xpbnRlcnMvcHJvc3BlY3RvclwiKTtcclxuY29uc3QgcHlkb2NzdHlsZV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL3B5ZG9jc3R5bGVcIik7XHJcbmNvbnN0IHB5bGFtYV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL3B5bGFtYVwiKTtcclxuY29uc3QgcHlsaW50XzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2xpbnRlcnMvcHlsaW50XCIpO1xyXG5jb25zdCB0eXBlc180ID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL3R5cGVzXCIpO1xyXG5jb25zdCBpbml0aWFsaXplXzEgPSByZXF1aXJlKFwiLi4vaW5pdGlhbGl6ZVwiKTtcclxuc3VpdGUoJ0xpbnRpbmcgLSBBcmd1bWVudHMnLCAoKSA9PiB7XHJcbiAgICBbdW5kZWZpbmVkLCBwYXRoLmpvaW4oJ3VzZXJzJywgJ2Rldl91c2VyJyldLmZvckVhY2god29ya3NwYWNlVXJpID0+IHtcclxuICAgICAgICBbdnNjb2RlXzEuVXJpLmZpbGUocGF0aC5qb2luKCd1c2VycycsICdkZXZfdXNlcicsICdkZXZlbG9wbWVudCBwYXRoIHRvJywgJ29uZS5weScpKSwgdnNjb2RlXzEuVXJpLmZpbGUocGF0aC5qb2luKCd1c2VycycsICdkZXZfdXNlcicsICdkZXZlbG9wbWVudCcsICdvbmUucHknKSldLmZvckVhY2goZmlsZVVyaSA9PiB7XHJcbiAgICAgICAgICAgIHN1aXRlKGBGaWxlIHBhdGggJHtmaWxlVXJpLmZzUGF0aC5pbmRleE9mKCcgJykgPiAwID8gJ3dpdGgnIDogJ3dpdGhvdXQnfSBzcGFjZXMgYW5kICR7d29ya3NwYWNlVXJpID8gJ3dpdGhvdXQnIDogJ3dpdGgnfSBhIHdvcmtzcGFjZWAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnByZXRlclNlcnZpY2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbmZpZ1NlcnZpY2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9jTWFuYWdlcjtcclxuICAgICAgICAgICAgICAgIGxldCBzZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIGxldCBsbTtcclxuICAgICAgICAgICAgICAgIGxldCBzZXJ2aWNlQ29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvY3VtZW50O1xyXG4gICAgICAgICAgICAgICAgbGV0IG91dHB1dENoYW5uZWw7XHJcbiAgICAgICAgICAgICAgICBsZXQgd29ya3NwYWNlU2VydmljZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbmNlbGxhdGlvblRva2VuID0gbmV3IHZzY29kZV8xLkNhbmNlbGxhdGlvblRva2VuU291cmNlKCkudG9rZW47XHJcbiAgICAgICAgICAgICAgICBzdWl0ZVNldHVwKGluaXRpYWxpemVfMS5pbml0aWFsaXplKTtcclxuICAgICAgICAgICAgICAgIHNldHVwKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ID0gbmV3IGludmVyc2lmeV8xLkNvbnRhaW5lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZpY2VNYW5hZ2VyID0gbmV3IHNlcnZpY2VNYW5hZ2VyXzEuU2VydmljZU1hbmFnZXIoY29udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUNvbnRhaW5lciA9IG5ldyBjb250YWluZXJfMS5TZXJ2aWNlQ29udGFpbmVyKGNvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dENoYW5uZWwgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnMgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnMuc2V0dXAoeCA9PiB4LmZpbGVFeGlzdHMoVHlwZU1vcS5JdC5pc0FueSgpKSkucmV0dXJucygoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKHRydWUpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnMuc2V0dXAoeCA9PiB4LmFyZVBhdGhzU2FtZShUeXBlTW9xLkl0LmlzQW55U3RyaW5nKCksIFR5cGVNb3EuSXQuaXNBbnlTdHJpbmcoKSkpLnJldHVybnMoKCkgPT4gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uSW5zdGFuY2UodHlwZXNfMi5JRmlsZVN5c3RlbSwgZnMub2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b25JbnN0YW5jZSh0eXBlc18zLklPdXRwdXRDaGFubmVsLCBvdXRwdXRDaGFubmVsLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXJTZXJ2aWNlID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKGNvbnRyYWN0c18xLklJbnRlcnByZXRlclNlcnZpY2UsIGludGVycHJldGVyU2VydmljZS5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZSA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b25JbnN0YW5jZSh0eXBlc180LklMaW50aW5nRW5naW5lLCBlbmdpbmUub2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBkb2NNYW5hZ2VyID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzEuSURvY3VtZW50TWFuYWdlciwgZG9jTWFuYWdlci5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRTZXR0aW5ncyA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBsaW50U2V0dGluZ3Muc2V0dXAoeCA9PiB4LmVuYWJsZWQpLnJldHVybnMoKCkgPT4gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGludFNldHRpbmdzLnNldHVwKHggPT4geC5saW50T25TYXZlKS5yZXR1cm5zKCgpID0+IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnNldHVwKHggPT4geC5saW50aW5nKS5yZXR1cm5zKCgpID0+IGxpbnRTZXR0aW5ncy5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnU2VydmljZS5zZXR1cCh4ID0+IHguZ2V0U2V0dGluZ3MoVHlwZU1vcS5JdC5pc0FueSgpKSkucmV0dXJucygoKSA9PiBzZXR0aW5ncy5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzMuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlLCBjb25maWdTZXJ2aWNlLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ya3NwYWNlRm9sZGVyID0gd29ya3NwYWNlVXJpID8geyB1cmk6IHZzY29kZV8xLlVyaS5maWxlKHdvcmtzcGFjZVVyaSksIGluZGV4OiAwLCBuYW1lOiAnJyB9IDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZVNlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlU2VydmljZS5zZXR1cCh3ID0+IHcuZ2V0V29ya3NwYWNlRm9sZGVyKFR5cGVNb3EuSXQuaXNBbnkoKSkpLnJldHVybnMoKCkgPT4gd29ya3NwYWNlRm9sZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b25JbnN0YW5jZSh0eXBlc18xLklXb3Jrc3BhY2VTZXJ2aWNlLCB3b3Jrc3BhY2VTZXJ2aWNlLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9nZ2VyID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzMuSUxvZ2dlciwgbG9nZ2VyLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFsbGVyID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzMuSUluc3RhbGxlciwgaW5zdGFsbGVyLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGxhdGZvcm1TZXJ2aWNlID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzIuSVBsYXRmb3JtU2VydmljZSwgcGxhdGZvcm1TZXJ2aWNlLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG0gPSBuZXcgbGludGVyTWFuYWdlcl8xLkxpbnRlck1hbmFnZXIoc2VydmljZUNvbnRhaW5lciwgd29ya3NwYWNlU2VydmljZS5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzQuSUxpbnRlck1hbmFnZXIsIGxtKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudCA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3RMaW50ZXIobGludGVyLCBleHBlY3RlZEFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5zZXR1cChkID0+IGQudXJpKS5yZXR1cm5zKCgpID0+IGZpbGVVcmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52b2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW50ZXIucnVuID0gKGFyZ3MsIGRvYywgdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlfMS5leHBlY3QoYXJncykudG8uZGVlcC5lcXVhbChleHBlY3RlZEFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52b2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgbGludGVyLmxpbnQoZG9jdW1lbnQub2JqZWN0LCBjYW5jZWxsYXRpb25Ub2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlfMS5leHBlY3QoaW52b2tlZCkudG8uYmUuZXF1YWwodHJ1ZSwgJ21ldGhvZCBub3QgaW52b2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGVzdCgnRmxha2U4JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBmbGFrZThfMS5GbGFrZTgob3V0cHV0Q2hhbm5lbC5vYmplY3QsIHNlcnZpY2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFsnLS1mb3JtYXQ9JShyb3cpZCwlKGNvbClkLCUoY29kZSkuMXMsJShjb2RlKXM6JSh0ZXh0KXMnLCBmaWxlVXJpLmZzUGF0aF07XHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGVzdExpbnRlcihsaW50ZXIsIGV4cGVjdGVkQXJncyk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB0ZXN0KCdQZXA4JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBwZXA4XzEuUGVwOChvdXRwdXRDaGFubmVsLm9iamVjdCwgc2VydmljZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRBcmdzID0gWyctLWZvcm1hdD0lKHJvdylkLCUoY29sKWQsJShjb2RlKS4xcywlKGNvZGUpczolKHRleHQpcycsIGZpbGVVcmkuZnNQYXRoXTtcclxuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0ZXN0TGludGVyKGxpbnRlciwgZXhwZWN0ZWRBcmdzKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIHRlc3QoJ1Byb3NwZWN0b3InLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGludGVyID0gbmV3IHByb3NwZWN0b3JfMS5Qcm9zcGVjdG9yKG91dHB1dENoYW5uZWwub2JqZWN0LCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBlY3RlZFBhdGggPSB3b3Jrc3BhY2VVcmkgPyBmaWxlVXJpLmZzUGF0aC5zdWJzdHJpbmcod29ya3NwYWNlVXJpLmxlbmd0aCArIDIpIDogcGF0aC5iYXNlbmFtZShmaWxlVXJpLmZzUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRBcmdzID0gWyctLWFic29sdXRlLXBhdGhzJywgJy0tb3V0cHV0LWZvcm1hdD1qc29uJywgZXhwZWN0ZWRQYXRoXTtcclxuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0ZXN0TGludGVyKGxpbnRlciwgZXhwZWN0ZWRBcmdzKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIHRlc3QoJ1B5bGFtYScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBuZXcgcHlsYW1hXzEuUHlMYW1hKG91dHB1dENoYW5uZWwub2JqZWN0LCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBlY3RlZEFyZ3MgPSBbJy0tZm9ybWF0PXBhcnNhYmxlJywgZmlsZVVyaS5mc1BhdGhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRlc3RMaW50ZXIobGludGVyLCBleHBlY3RlZEFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgdGVzdCgnTXlQeScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBuZXcgbXlweV8xLk15UHkob3V0cHV0Q2hhbm5lbC5vYmplY3QsIHNlcnZpY2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFtmaWxlVXJpLmZzUGF0aF07XHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGVzdExpbnRlcihsaW50ZXIsIGV4cGVjdGVkQXJncyk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB0ZXN0KCdQeWRvY3N0eWxlJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBweWRvY3N0eWxlXzEuUHlEb2NTdHlsZShvdXRwdXRDaGFubmVsLm9iamVjdCwgc2VydmljZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRBcmdzID0gW2ZpbGVVcmkuZnNQYXRoXTtcclxuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0ZXN0TGludGVyKGxpbnRlciwgZXhwZWN0ZWRBcmdzKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIHRlc3QoJ1B5bGludCcsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBuZXcgcHlsaW50XzEuUHlsaW50KG91dHB1dENoYW5uZWwub2JqZWN0LCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5zZXR1cChkID0+IGQudXJpKS5yZXR1cm5zKCgpID0+IGZpbGVVcmkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnZva2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGludGVyLnJ1biA9IChhcmdzLCBkb2MsIHRva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlfMS5leHBlY3QoYXJnc1thcmdzLmxlbmd0aCAtIDFdKS50by5lcXVhbChmaWxlVXJpLmZzUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9rZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGxpbnRlci5saW50KGRvY3VtZW50Lm9iamVjdCwgY2FuY2VsbGF0aW9uVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYWlfMS5leHBlY3QoaW52b2tlZCkudG8uYmUuZXF1YWwodHJ1ZSwgJ21ldGhvZCBub3QgaW52b2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgdGVzdCgnQmFuZGl0JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBiYW5kaXRfMS5CYW5kaXQob3V0cHV0Q2hhbm5lbC5vYmplY3QsIHNlcnZpY2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFsnLWYnLCAnY3VzdG9tJywgJy0tbXNnLXRlbXBsYXRlJywgJ3tsaW5lfSwwLHtzZXZlcml0eX0se3Rlc3RfaWR9Onttc2d9JywgJy1uJywgJy0xJywgZmlsZVVyaS5mc1BhdGhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRlc3RMaW50ZXIobGludGVyLCBleHBlY3RlZEFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGludC5hcmdzLnRlc3QuanMubWFwIl19