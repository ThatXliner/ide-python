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
});

const assert = require("assert");

const inversify_1 = require("inversify");

const typeMoq = require("typemoq");

const service_1 = require("../../client/common/configuration/service");

const types_1 = require("../../client/common/types");

const EnumEx = require("../../client/common/utils/enum");

const container_1 = require("../../client/ioc/container");

const serviceManager_1 = require("../../client/ioc/serviceManager");

const types_2 = require("../../client/ioc/types");

const linterManager_1 = require("../../client/linters/linterManager");

const initialize_1 = require("../initialize"); // tslint:disable-next-line:max-func-body-length


suite('Linting - Manager', () => {
  let lm;
  let configService;
  let settings;
  suiteSetup(initialize_1.initialize);
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    const cont = new inversify_1.Container();
    const serviceManager = new serviceManager_1.ServiceManager(cont);
    const serviceContainer = new container_1.ServiceContainer(cont);
    serviceManager.addSingletonInstance(types_2.IServiceContainer, serviceContainer);
    serviceManager.addSingleton(types_1.IConfigurationService, service_1.ConfigurationService);
    configService = serviceManager.get(types_1.IConfigurationService);
    settings = configService.getSettings();
    const workspaceService = typeMoq.Mock.ofType();
    lm = new linterManager_1.LinterManager(serviceContainer, workspaceService.object);
    yield lm.setActiveLintersAsync([types_1.Product.pylint]);
    yield lm.enableLintingAsync(true);
  }));
  test('Ensure product is set in Execution Info', () => __awaiter(void 0, void 0, void 0, function* () {
    [types_1.Product.bandit, types_1.Product.flake8, types_1.Product.mypy, types_1.Product.pep8, types_1.Product.pydocstyle, types_1.Product.pylama, types_1.Product.pylint].forEach(product => {
      const execInfo = lm.getLinterInfo(product).getExecutionInfo([]);
      assert.equal(execInfo.product, product, `Incorrect information for ${product}`);
    });
  }));
  test('Ensure executable is set in Execution Info', () => __awaiter(void 0, void 0, void 0, function* () {
    [types_1.Product.bandit, types_1.Product.flake8, types_1.Product.mypy, types_1.Product.pep8, types_1.Product.pydocstyle, types_1.Product.pylama, types_1.Product.pylint].forEach(product => {
      const info = lm.getLinterInfo(product);
      const execInfo = info.getExecutionInfo([]);
      const execPath = settings.linting[info.pathSettingName];
      assert.equal(execInfo.execPath, execPath, `Incorrect executable paths for product ${info.id}`);
    });
  }));
  test('Ensure correct setting names are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    [types_1.Product.bandit, types_1.Product.flake8, types_1.Product.mypy, types_1.Product.pep8, types_1.Product.pydocstyle, types_1.Product.pylama, types_1.Product.pylint].forEach(product => {
      const linter = lm.getLinterInfo(product);
      const expected = {
        argsName: `${linter.id}Args`,
        pathName: `${linter.id}Path`,
        enabledName: `${linter.id}Enabled`
      };
      assert.equal(linter.argsSettingName, expected.argsName, `Incorrect args settings for product ${linter.id}`);
      assert.equal(linter.pathSettingName, expected.pathName, `Incorrect path settings for product ${linter.id}`);
      assert.equal(linter.enabledSettingName, expected.enabledName, `Incorrect enabled settings for product ${linter.id}`);
    });
  }));
  test('Ensure linter id match product', () => __awaiter(void 0, void 0, void 0, function* () {
    const ids = ['bandit', 'flake8', 'mypy', 'pep8', 'prospector', 'pydocstyle', 'pylama', 'pylint'];
    const products = [types_1.Product.bandit, types_1.Product.flake8, types_1.Product.mypy, types_1.Product.pep8, types_1.Product.prospector, types_1.Product.pydocstyle, types_1.Product.pylama, types_1.Product.pylint];

    for (let i = 0; i < products.length; i += 1) {
      const linter = lm.getLinterInfo(products[i]);
      assert.equal(linter.id, ids[i], `Id ${ids[i]} does not match product ${products[i]}`);
    }
  }));
  test('Enable/disable linting', () => __awaiter(void 0, void 0, void 0, function* () {
    yield lm.enableLintingAsync(false);
    assert.equal(yield lm.isLintingEnabled(true), false, 'Linting not disabled');
    yield lm.enableLintingAsync(true);
    assert.equal(yield lm.isLintingEnabled(true), true, 'Linting not enabled');
  }));
  test('Set single linter', () => __awaiter(void 0, void 0, void 0, function* () {
    for (const linter of lm.getAllLinterInfos()) {
      yield lm.setActiveLintersAsync([linter.product]);
      const selected = yield lm.getActiveLinters(true);
      assert.notEqual(selected.length, 0, 'Current linter is undefined');
      assert.equal(linter.id, selected[0].id, `Selected linter ${selected} does not match requested ${linter.id}`);
    }
  }));
  test('Set multiple linters', () => __awaiter(void 0, void 0, void 0, function* () {
    yield lm.setActiveLintersAsync([types_1.Product.flake8, types_1.Product.pydocstyle]);
    const selected = yield lm.getActiveLinters(true);
    assert.equal(selected.length, 2, 'Selected linters lengths does not match');
    assert.equal(types_1.Product.flake8, selected[0].product, `Selected linter ${selected[0].id} does not match requested 'flake8'`);
    assert.equal(types_1.Product.pydocstyle, selected[1].product, `Selected linter ${selected[1].id} does not match requested 'pydocstyle'`);
  }));
  test('Try setting unsupported linter', () => __awaiter(void 0, void 0, void 0, function* () {
    const before = yield lm.getActiveLinters(true);
    assert.notEqual(before, undefined, 'Current/before linter is undefined');
    yield lm.setActiveLintersAsync([types_1.Product.nosetest]);
    const after = yield lm.getActiveLinters(true);
    assert.notEqual(after, undefined, 'Current/after linter is undefined');
    assert.equal(after[0].id, before[0].id, 'Should not be able to set unsupported linter');
  }));
  test('Pylint configuration file watch', () => __awaiter(void 0, void 0, void 0, function* () {
    const pylint = lm.getLinterInfo(types_1.Product.pylint);
    assert.equal(pylint.configFileNames.length, 2, 'Pylint configuration file count is incorrect.');
    assert.notEqual(pylint.configFileNames.indexOf('pylintrc'), -1, 'Pylint configuration files miss pylintrc.');
    assert.notEqual(pylint.configFileNames.indexOf('.pylintrc'), -1, 'Pylint configuration files miss .pylintrc.');
  }));
  EnumEx.getValues(types_1.Product).forEach(product => {
    const linterIdMapping = new Map();
    linterIdMapping.set(types_1.Product.bandit, 'bandit');
    linterIdMapping.set(types_1.Product.flake8, 'flake8');
    linterIdMapping.set(types_1.Product.mypy, 'mypy');
    linterIdMapping.set(types_1.Product.pep8, 'pep8');
    linterIdMapping.set(types_1.Product.prospector, 'prospector');
    linterIdMapping.set(types_1.Product.pydocstyle, 'pydocstyle');
    linterIdMapping.set(types_1.Product.pylama, 'pylama');
    linterIdMapping.set(types_1.Product.pylint, 'pylint');

    if (linterIdMapping.has(product)) {
      return;
    }

    test(`Ensure translation of ids throws exceptions for unknown linters (${product})`, () => __awaiter(void 0, void 0, void 0, function* () {
      assert.throws(() => lm.getLinterInfo(product));
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnQubWFuYWdlci50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJhc3NlcnQiLCJyZXF1aXJlIiwiaW52ZXJzaWZ5XzEiLCJ0eXBlTW9xIiwic2VydmljZV8xIiwidHlwZXNfMSIsIkVudW1FeCIsImNvbnRhaW5lcl8xIiwic2VydmljZU1hbmFnZXJfMSIsInR5cGVzXzIiLCJsaW50ZXJNYW5hZ2VyXzEiLCJpbml0aWFsaXplXzEiLCJzdWl0ZSIsImxtIiwiY29uZmlnU2VydmljZSIsInNldHRpbmdzIiwic3VpdGVTZXR1cCIsImluaXRpYWxpemUiLCJzZXR1cCIsImNvbnQiLCJDb250YWluZXIiLCJzZXJ2aWNlTWFuYWdlciIsIlNlcnZpY2VNYW5hZ2VyIiwic2VydmljZUNvbnRhaW5lciIsIlNlcnZpY2VDb250YWluZXIiLCJhZGRTaW5nbGV0b25JbnN0YW5jZSIsIklTZXJ2aWNlQ29udGFpbmVyIiwiYWRkU2luZ2xldG9uIiwiSUNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwiQ29uZmlndXJhdGlvblNlcnZpY2UiLCJnZXQiLCJnZXRTZXR0aW5ncyIsIndvcmtzcGFjZVNlcnZpY2UiLCJNb2NrIiwib2ZUeXBlIiwiTGludGVyTWFuYWdlciIsIm9iamVjdCIsInNldEFjdGl2ZUxpbnRlcnNBc3luYyIsIlByb2R1Y3QiLCJweWxpbnQiLCJlbmFibGVMaW50aW5nQXN5bmMiLCJ0ZXN0IiwiYmFuZGl0IiwiZmxha2U4IiwibXlweSIsInBlcDgiLCJweWRvY3N0eWxlIiwicHlsYW1hIiwiZm9yRWFjaCIsInByb2R1Y3QiLCJleGVjSW5mbyIsImdldExpbnRlckluZm8iLCJnZXRFeGVjdXRpb25JbmZvIiwiZXF1YWwiLCJpbmZvIiwiZXhlY1BhdGgiLCJsaW50aW5nIiwicGF0aFNldHRpbmdOYW1lIiwiaWQiLCJsaW50ZXIiLCJleHBlY3RlZCIsImFyZ3NOYW1lIiwicGF0aE5hbWUiLCJlbmFibGVkTmFtZSIsImFyZ3NTZXR0aW5nTmFtZSIsImVuYWJsZWRTZXR0aW5nTmFtZSIsImlkcyIsInByb2R1Y3RzIiwicHJvc3BlY3RvciIsImkiLCJsZW5ndGgiLCJpc0xpbnRpbmdFbmFibGVkIiwiZ2V0QWxsTGludGVySW5mb3MiLCJzZWxlY3RlZCIsImdldEFjdGl2ZUxpbnRlcnMiLCJub3RFcXVhbCIsImJlZm9yZSIsInVuZGVmaW5lZCIsIm5vc2V0ZXN0IiwiYWZ0ZXIiLCJjb25maWdGaWxlTmFtZXMiLCJpbmRleE9mIiwiZ2V0VmFsdWVzIiwibGludGVySWRNYXBwaW5nIiwiTWFwIiwic2V0IiwiaGFzIiwidGhyb3dzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFB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QUFDc0MsYUFBSCxDQUFpQkYsT0FBakIsQ0FBcEI7QUFDSCxLQUZtRyxDQUFoRyxDQUFKO0FBR0gsR0FoQkQ7QUFpQkgsQ0E1R0ksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHR5cGVNb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuY29uc3Qgc2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vY29uZmlndXJhdGlvbi9zZXJ2aWNlXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IEVudW1FeCA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3V0aWxzL2VudW1cIik7XHJcbmNvbnN0IGNvbnRhaW5lcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2MvY29udGFpbmVyXCIpO1xyXG5jb25zdCBzZXJ2aWNlTWFuYWdlcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9pb2Mvc2VydmljZU1hbmFnZXJcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2lvYy90eXBlc1wiKTtcclxuY29uc3QgbGludGVyTWFuYWdlcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9saW50ZXJzL2xpbnRlck1hbmFnZXJcIik7XHJcbmNvbnN0IGluaXRpYWxpemVfMSA9IHJlcXVpcmUoXCIuLi9pbml0aWFsaXplXCIpO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWZ1bmMtYm9keS1sZW5ndGhcclxuc3VpdGUoJ0xpbnRpbmcgLSBNYW5hZ2VyJywgKCkgPT4ge1xyXG4gICAgbGV0IGxtO1xyXG4gICAgbGV0IGNvbmZpZ1NlcnZpY2U7XHJcbiAgICBsZXQgc2V0dGluZ3M7XHJcbiAgICBzdWl0ZVNldHVwKGluaXRpYWxpemVfMS5pbml0aWFsaXplKTtcclxuICAgIHNldHVwKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBjb250ID0gbmV3IGludmVyc2lmeV8xLkNvbnRhaW5lcigpO1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VNYW5hZ2VyID0gbmV3IHNlcnZpY2VNYW5hZ2VyXzEuU2VydmljZU1hbmFnZXIoY29udCk7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lciA9IG5ldyBjb250YWluZXJfMS5TZXJ2aWNlQ29udGFpbmVyKGNvbnQpO1xyXG4gICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbkluc3RhbmNlKHR5cGVzXzIuSVNlcnZpY2VDb250YWluZXIsIHNlcnZpY2VDb250YWluZXIpO1xyXG4gICAgICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18xLklDb25maWd1cmF0aW9uU2VydmljZSwgc2VydmljZV8xLkNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgICAgICBjb25maWdTZXJ2aWNlID0gc2VydmljZU1hbmFnZXIuZ2V0KHR5cGVzXzEuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcclxuICAgICAgICBzZXR0aW5ncyA9IGNvbmZpZ1NlcnZpY2UuZ2V0U2V0dGluZ3MoKTtcclxuICAgICAgICBjb25zdCB3b3Jrc3BhY2VTZXJ2aWNlID0gdHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgIGxtID0gbmV3IGxpbnRlck1hbmFnZXJfMS5MaW50ZXJNYW5hZ2VyKHNlcnZpY2VDb250YWluZXIsIHdvcmtzcGFjZVNlcnZpY2Uub2JqZWN0KTtcclxuICAgICAgICB5aWVsZCBsbS5zZXRBY3RpdmVMaW50ZXJzQXN5bmMoW3R5cGVzXzEuUHJvZHVjdC5weWxpbnRdKTtcclxuICAgICAgICB5aWVsZCBsbS5lbmFibGVMaW50aW5nQXN5bmModHJ1ZSk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdFbnN1cmUgcHJvZHVjdCBpcyBzZXQgaW4gRXhlY3V0aW9uIEluZm8nLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgW3R5cGVzXzEuUHJvZHVjdC5iYW5kaXQsIHR5cGVzXzEuUHJvZHVjdC5mbGFrZTgsIHR5cGVzXzEuUHJvZHVjdC5teXB5LCB0eXBlc18xLlByb2R1Y3QucGVwOCxcclxuICAgICAgICAgICAgdHlwZXNfMS5Qcm9kdWN0LnB5ZG9jc3R5bGUsIHR5cGVzXzEuUHJvZHVjdC5weWxhbWEsIHR5cGVzXzEuUHJvZHVjdC5weWxpbnRdLmZvckVhY2gocHJvZHVjdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNJbmZvID0gbG0uZ2V0TGludGVySW5mbyhwcm9kdWN0KS5nZXRFeGVjdXRpb25JbmZvKFtdKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGV4ZWNJbmZvLnByb2R1Y3QsIHByb2R1Y3QsIGBJbmNvcnJlY3QgaW5mb3JtYXRpb24gZm9yICR7cHJvZHVjdH1gKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBleGVjdXRhYmxlIGlzIHNldCBpbiBFeGVjdXRpb24gSW5mbycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBbdHlwZXNfMS5Qcm9kdWN0LmJhbmRpdCwgdHlwZXNfMS5Qcm9kdWN0LmZsYWtlOCwgdHlwZXNfMS5Qcm9kdWN0Lm15cHksIHR5cGVzXzEuUHJvZHVjdC5wZXA4LFxyXG4gICAgICAgICAgICB0eXBlc18xLlByb2R1Y3QucHlkb2NzdHlsZSwgdHlwZXNfMS5Qcm9kdWN0LnB5bGFtYSwgdHlwZXNfMS5Qcm9kdWN0LnB5bGludF0uZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IGxtLmdldExpbnRlckluZm8ocHJvZHVjdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNJbmZvID0gaW5mby5nZXRFeGVjdXRpb25JbmZvKFtdKTtcclxuICAgICAgICAgICAgY29uc3QgZXhlY1BhdGggPSBzZXR0aW5ncy5saW50aW5nW2luZm8ucGF0aFNldHRpbmdOYW1lXTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGV4ZWNJbmZvLmV4ZWNQYXRoLCBleGVjUGF0aCwgYEluY29ycmVjdCBleGVjdXRhYmxlIHBhdGhzIGZvciBwcm9kdWN0ICR7aW5mby5pZH1gKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBjb3JyZWN0IHNldHRpbmcgbmFtZXMgYXJlIHJldHVybmVkJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIFt0eXBlc18xLlByb2R1Y3QuYmFuZGl0LCB0eXBlc18xLlByb2R1Y3QuZmxha2U4LCB0eXBlc18xLlByb2R1Y3QubXlweSwgdHlwZXNfMS5Qcm9kdWN0LnBlcDgsXHJcbiAgICAgICAgICAgIHR5cGVzXzEuUHJvZHVjdC5weWRvY3N0eWxlLCB0eXBlc18xLlByb2R1Y3QucHlsYW1hLCB0eXBlc18xLlByb2R1Y3QucHlsaW50XS5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBsbS5nZXRMaW50ZXJJbmZvKHByb2R1Y3QpO1xyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IHtcclxuICAgICAgICAgICAgICAgIGFyZ3NOYW1lOiBgJHtsaW50ZXIuaWR9QXJnc2AsXHJcbiAgICAgICAgICAgICAgICBwYXRoTmFtZTogYCR7bGludGVyLmlkfVBhdGhgLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZE5hbWU6IGAke2xpbnRlci5pZH1FbmFibGVkYFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobGludGVyLmFyZ3NTZXR0aW5nTmFtZSwgZXhwZWN0ZWQuYXJnc05hbWUsIGBJbmNvcnJlY3QgYXJncyBzZXR0aW5ncyBmb3IgcHJvZHVjdCAke2xpbnRlci5pZH1gKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpbnRlci5wYXRoU2V0dGluZ05hbWUsIGV4cGVjdGVkLnBhdGhOYW1lLCBgSW5jb3JyZWN0IHBhdGggc2V0dGluZ3MgZm9yIHByb2R1Y3QgJHtsaW50ZXIuaWR9YCk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaW50ZXIuZW5hYmxlZFNldHRpbmdOYW1lLCBleHBlY3RlZC5lbmFibGVkTmFtZSwgYEluY29ycmVjdCBlbmFibGVkIHNldHRpbmdzIGZvciBwcm9kdWN0ICR7bGludGVyLmlkfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRW5zdXJlIGxpbnRlciBpZCBtYXRjaCBwcm9kdWN0JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGlkcyA9IFsnYmFuZGl0JywgJ2ZsYWtlOCcsICdteXB5JywgJ3BlcDgnLCAncHJvc3BlY3RvcicsICdweWRvY3N0eWxlJywgJ3B5bGFtYScsICdweWxpbnQnXTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IFt0eXBlc18xLlByb2R1Y3QuYmFuZGl0LCB0eXBlc18xLlByb2R1Y3QuZmxha2U4LCB0eXBlc18xLlByb2R1Y3QubXlweSwgdHlwZXNfMS5Qcm9kdWN0LnBlcDgsIHR5cGVzXzEuUHJvZHVjdC5wcm9zcGVjdG9yLCB0eXBlc18xLlByb2R1Y3QucHlkb2NzdHlsZSwgdHlwZXNfMS5Qcm9kdWN0LnB5bGFtYSwgdHlwZXNfMS5Qcm9kdWN0LnB5bGludF07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBsbS5nZXRMaW50ZXJJbmZvKHByb2R1Y3RzW2ldKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpbnRlci5pZCwgaWRzW2ldLCBgSWQgJHtpZHNbaV19IGRvZXMgbm90IG1hdGNoIHByb2R1Y3QgJHtwcm9kdWN0c1tpXX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdFbmFibGUvZGlzYWJsZSBsaW50aW5nJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHlpZWxkIGxtLmVuYWJsZUxpbnRpbmdBc3luYyhmYWxzZSk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHlpZWxkIGxtLmlzTGludGluZ0VuYWJsZWQodHJ1ZSksIGZhbHNlLCAnTGludGluZyBub3QgZGlzYWJsZWQnKTtcclxuICAgICAgICB5aWVsZCBsbS5lbmFibGVMaW50aW5nQXN5bmModHJ1ZSk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHlpZWxkIGxtLmlzTGludGluZ0VuYWJsZWQodHJ1ZSksIHRydWUsICdMaW50aW5nIG5vdCBlbmFibGVkJyk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdTZXQgc2luZ2xlIGxpbnRlcicsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGxpbnRlciBvZiBsbS5nZXRBbGxMaW50ZXJJbmZvcygpKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGxtLnNldEFjdGl2ZUxpbnRlcnNBc3luYyhbbGludGVyLnByb2R1Y3RdKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB5aWVsZCBsbS5nZXRBY3RpdmVMaW50ZXJzKHRydWUpO1xyXG4gICAgICAgICAgICBhc3NlcnQubm90RXF1YWwoc2VsZWN0ZWQubGVuZ3RoLCAwLCAnQ3VycmVudCBsaW50ZXIgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaW50ZXIuaWQsIHNlbGVjdGVkWzBdLmlkLCBgU2VsZWN0ZWQgbGludGVyICR7c2VsZWN0ZWR9IGRvZXMgbm90IG1hdGNoIHJlcXVlc3RlZCAke2xpbnRlci5pZH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdTZXQgbXVsdGlwbGUgbGludGVycycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBsbS5zZXRBY3RpdmVMaW50ZXJzQXN5bmMoW3R5cGVzXzEuUHJvZHVjdC5mbGFrZTgsIHR5cGVzXzEuUHJvZHVjdC5weWRvY3N0eWxlXSk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB5aWVsZCBsbS5nZXRBY3RpdmVMaW50ZXJzKHRydWUpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChzZWxlY3RlZC5sZW5ndGgsIDIsICdTZWxlY3RlZCBsaW50ZXJzIGxlbmd0aHMgZG9lcyBub3QgbWF0Y2gnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodHlwZXNfMS5Qcm9kdWN0LmZsYWtlOCwgc2VsZWN0ZWRbMF0ucHJvZHVjdCwgYFNlbGVjdGVkIGxpbnRlciAke3NlbGVjdGVkWzBdLmlkfSBkb2VzIG5vdCBtYXRjaCByZXF1ZXN0ZWQgJ2ZsYWtlOCdgKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodHlwZXNfMS5Qcm9kdWN0LnB5ZG9jc3R5bGUsIHNlbGVjdGVkWzFdLnByb2R1Y3QsIGBTZWxlY3RlZCBsaW50ZXIgJHtzZWxlY3RlZFsxXS5pZH0gZG9lcyBub3QgbWF0Y2ggcmVxdWVzdGVkICdweWRvY3N0eWxlJ2ApO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnVHJ5IHNldHRpbmcgdW5zdXBwb3J0ZWQgbGludGVyJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHlpZWxkIGxtLmdldEFjdGl2ZUxpbnRlcnModHJ1ZSk7XHJcbiAgICAgICAgYXNzZXJ0Lm5vdEVxdWFsKGJlZm9yZSwgdW5kZWZpbmVkLCAnQ3VycmVudC9iZWZvcmUgbGludGVyIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIHlpZWxkIGxtLnNldEFjdGl2ZUxpbnRlcnNBc3luYyhbdHlwZXNfMS5Qcm9kdWN0Lm5vc2V0ZXN0XSk7XHJcbiAgICAgICAgY29uc3QgYWZ0ZXIgPSB5aWVsZCBsbS5nZXRBY3RpdmVMaW50ZXJzKHRydWUpO1xyXG4gICAgICAgIGFzc2VydC5ub3RFcXVhbChhZnRlciwgdW5kZWZpbmVkLCAnQ3VycmVudC9hZnRlciBsaW50ZXIgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGFmdGVyWzBdLmlkLCBiZWZvcmVbMF0uaWQsICdTaG91bGQgbm90IGJlIGFibGUgdG8gc2V0IHVuc3VwcG9ydGVkIGxpbnRlcicpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnUHlsaW50IGNvbmZpZ3VyYXRpb24gZmlsZSB3YXRjaCcsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBweWxpbnQgPSBsbS5nZXRMaW50ZXJJbmZvKHR5cGVzXzEuUHJvZHVjdC5weWxpbnQpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChweWxpbnQuY29uZmlnRmlsZU5hbWVzLmxlbmd0aCwgMiwgJ1B5bGludCBjb25maWd1cmF0aW9uIGZpbGUgY291bnQgaXMgaW5jb3JyZWN0LicpO1xyXG4gICAgICAgIGFzc2VydC5ub3RFcXVhbChweWxpbnQuY29uZmlnRmlsZU5hbWVzLmluZGV4T2YoJ3B5bGludHJjJyksIC0xLCAnUHlsaW50IGNvbmZpZ3VyYXRpb24gZmlsZXMgbWlzcyBweWxpbnRyYy4nKTtcclxuICAgICAgICBhc3NlcnQubm90RXF1YWwocHlsaW50LmNvbmZpZ0ZpbGVOYW1lcy5pbmRleE9mKCcucHlsaW50cmMnKSwgLTEsICdQeWxpbnQgY29uZmlndXJhdGlvbiBmaWxlcyBtaXNzIC5weWxpbnRyYy4nKTtcclxuICAgIH0pKTtcclxuICAgIEVudW1FeC5nZXRWYWx1ZXModHlwZXNfMS5Qcm9kdWN0KS5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxpbnRlcklkTWFwcGluZyA9IG5ldyBNYXAoKTtcclxuICAgICAgICBsaW50ZXJJZE1hcHBpbmcuc2V0KHR5cGVzXzEuUHJvZHVjdC5iYW5kaXQsICdiYW5kaXQnKTtcclxuICAgICAgICBsaW50ZXJJZE1hcHBpbmcuc2V0KHR5cGVzXzEuUHJvZHVjdC5mbGFrZTgsICdmbGFrZTgnKTtcclxuICAgICAgICBsaW50ZXJJZE1hcHBpbmcuc2V0KHR5cGVzXzEuUHJvZHVjdC5teXB5LCAnbXlweScpO1xyXG4gICAgICAgIGxpbnRlcklkTWFwcGluZy5zZXQodHlwZXNfMS5Qcm9kdWN0LnBlcDgsICdwZXA4Jyk7XHJcbiAgICAgICAgbGludGVySWRNYXBwaW5nLnNldCh0eXBlc18xLlByb2R1Y3QucHJvc3BlY3RvciwgJ3Byb3NwZWN0b3InKTtcclxuICAgICAgICBsaW50ZXJJZE1hcHBpbmcuc2V0KHR5cGVzXzEuUHJvZHVjdC5weWRvY3N0eWxlLCAncHlkb2NzdHlsZScpO1xyXG4gICAgICAgIGxpbnRlcklkTWFwcGluZy5zZXQodHlwZXNfMS5Qcm9kdWN0LnB5bGFtYSwgJ3B5bGFtYScpO1xyXG4gICAgICAgIGxpbnRlcklkTWFwcGluZy5zZXQodHlwZXNfMS5Qcm9kdWN0LnB5bGludCwgJ3B5bGludCcpO1xyXG4gICAgICAgIGlmIChsaW50ZXJJZE1hcHBpbmcuaGFzKHByb2R1Y3QpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVzdChgRW5zdXJlIHRyYW5zbGF0aW9uIG9mIGlkcyB0aHJvd3MgZXhjZXB0aW9ucyBmb3IgdW5rbm93biBsaW50ZXJzICgke3Byb2R1Y3R9KWAsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LnRocm93cygoKSA9PiBsbS5nZXRMaW50ZXJJbmZvKHByb2R1Y3QpKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnQubWFuYWdlci50ZXN0LmpzLm1hcCJdfQ==