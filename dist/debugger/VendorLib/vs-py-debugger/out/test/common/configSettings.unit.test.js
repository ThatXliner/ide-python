// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chai_1 = require("chai");

const path = require("path");

const TypeMoq = require("typemoq"); // tslint:disable-next-line:no-require-imports


const untildify = require("untildify");

const configSettings_1 = require("../../client/common/configSettings");

const misc_1 = require("../../client/common/utils/misc"); // tslint:disable-next-line:max-func-body-length


suite('Python Settings', () => {
  let config;
  let expected;
  let settings;
  const CustomPythonSettings = class extends configSettings_1.PythonSettings {
    initialize() {
      misc_1.noop();
    }

  };
  setup(() => {
    config = TypeMoq.Mock.ofType(undefined, TypeMoq.MockBehavior.Strict);
    expected = new CustomPythonSettings();
    settings = new CustomPythonSettings();
  });

  function initializeConfig(sourceSettings) {
    // string settings
    for (const name of ['pythonPath', 'venvPath', 'condaPath', 'envFile']) {
      config.setup(c => c.get(name)).returns(() => sourceSettings[name]);
    }

    if (sourceSettings.jediEnabled) {
      config.setup(c => c.get('jediPath')).returns(() => sourceSettings.jediPath);
    }

    for (const name of ['venvFolders']) {
      config.setup(c => c.get(name)).returns(() => sourceSettings[name]);
    } // boolean settings


    for (const name of ['downloadLanguageServer', 'jediEnabled', 'autoUpdateLanguageServer']) {
      config.setup(c => c.get(name, true)).returns(() => sourceSettings[name]);
    }

    for (const name of ['disableInstallationCheck', 'globalModuleInstallation']) {
      config.setup(c => c.get(name)).returns(() => sourceSettings[name]);
    } // number settings


    if (sourceSettings.jediEnabled) {
      config.setup(c => c.get('jediMemoryLimit')).returns(() => sourceSettings.jediMemoryLimit);
    } // "any" settings
    // tslint:disable-next-line:no-any


    config.setup(c => c.get('devOptions')).returns(() => sourceSettings.devOptions); // complex settings

    config.setup(c => c.get('linting')).returns(() => sourceSettings.linting);
    config.setup(c => c.get('analysis')).returns(() => sourceSettings.analysis);
    config.setup(c => c.get('sortImports')).returns(() => sourceSettings.sortImports);
    config.setup(c => c.get('formatting')).returns(() => sourceSettings.formatting);
    config.setup(c => c.get('autoComplete')).returns(() => sourceSettings.autoComplete);
    config.setup(c => c.get('workspaceSymbols')).returns(() => sourceSettings.workspaceSymbols);
    config.setup(c => c.get('unitTest')).returns(() => sourceSettings.unitTest);
    config.setup(c => c.get('terminal')).returns(() => sourceSettings.terminal);
    config.setup(c => c.get('dataScience')).returns(() => sourceSettings.datascience);
  }

  test('condaPath updated', () => {
    expected.pythonPath = 'python3';
    expected.condaPath = 'spam';
    initializeConfig(expected);
    config.setup(c => c.get('condaPath')).returns(() => expected.condaPath).verifiable(TypeMoq.Times.once());
    settings.update(config.object);
    chai_1.expect(settings.condaPath).to.be.equal(expected.condaPath);
    config.verifyAll();
  });
  test('condaPath (relative to home) updated', () => {
    expected.pythonPath = 'python3';
    expected.condaPath = path.join('~', 'anaconda3', 'bin', 'conda');
    initializeConfig(expected);
    config.setup(c => c.get('condaPath')).returns(() => expected.condaPath).verifiable(TypeMoq.Times.once());
    settings.update(config.object);
    chai_1.expect(settings.condaPath).to.be.equal(untildify(expected.condaPath));
    config.verifyAll();
  });
  test('Formatter Paths and args', () => {
    expected.pythonPath = 'python3'; // tslint:disable-next-line:no-any

    expected.formatting = {
      autopep8Args: ['1', '2'],
      autopep8Path: 'one',
      blackArgs: ['3', '4'],
      blackPath: 'two',
      yapfArgs: ['5', '6'],
      yapfPath: 'three',
      provider: ''
    };
    expected.formatting.blackPath = 'spam';
    initializeConfig(expected);
    config.setup(c => c.get('formatting')).returns(() => expected.formatting).verifiable(TypeMoq.Times.once());
    settings.update(config.object);

    for (const key of Object.keys(expected.formatting)) {
      chai_1.expect(settings.formatting[key]).to.be.deep.equal(expected.formatting[key]);
    }

    config.verifyAll();
  });
  test('Formatter Paths (paths relative to home)', () => {
    expected.pythonPath = 'python3'; // tslint:disable-next-line:no-any

    expected.formatting = {
      autopep8Args: [],
      autopep8Path: path.join('~', 'one'),
      blackArgs: [],
      blackPath: path.join('~', 'two'),
      yapfArgs: [],
      yapfPath: path.join('~', 'three'),
      provider: ''
    };
    expected.formatting.blackPath = 'spam';
    initializeConfig(expected);
    config.setup(c => c.get('formatting')).returns(() => expected.formatting).verifiable(TypeMoq.Times.once());
    settings.update(config.object);

    for (const key of Object.keys(expected.formatting)) {
      if (!key.endsWith('path')) {
        continue;
      }

      const expectedPath = untildify(expected.formatting[key]);
      chai_1.expect(settings.formatting[key]).to.be.equal(expectedPath);
    }

    config.verifyAll();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ1NldHRpbmdzLnVuaXQudGVzdC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImNoYWlfMSIsInJlcXVpcmUiLCJwYXRoIiwiVHlwZU1vcSIsInVudGlsZGlmeSIsImNvbmZpZ1NldHRpbmdzXzEiLCJtaXNjXzEiLCJzdWl0ZSIsImNvbmZpZyIsImV4cGVjdGVkIiwic2V0dGluZ3MiLCJDdXN0b21QeXRob25TZXR0aW5ncyIsIlB5dGhvblNldHRpbmdzIiwiaW5pdGlhbGl6ZSIsIm5vb3AiLCJzZXR1cCIsIk1vY2siLCJvZlR5cGUiLCJ1bmRlZmluZWQiLCJNb2NrQmVoYXZpb3IiLCJTdHJpY3QiLCJpbml0aWFsaXplQ29uZmlnIiwic291cmNlU2V0dGluZ3MiLCJuYW1lIiwiYyIsImdldCIsInJldHVybnMiLCJqZWRpRW5hYmxlZCIsImplZGlQYXRoIiwiamVkaU1lbW9yeUxpbWl0IiwiZGV2T3B0aW9ucyIsImxpbnRpbmciLCJhbmFseXNpcyIsInNvcnRJbXBvcnRzIiwiZm9ybWF0dGluZyIsImF1dG9Db21wbGV0ZSIsIndvcmtzcGFjZVN5bWJvbHMiLCJ1bml0VGVzdCIsInRlcm1pbmFsIiwiZGF0YXNjaWVuY2UiLCJ0ZXN0IiwicHl0aG9uUGF0aCIsImNvbmRhUGF0aCIsInZlcmlmaWFibGUiLCJUaW1lcyIsIm9uY2UiLCJ1cGRhdGUiLCJvYmplY3QiLCJleHBlY3QiLCJ0byIsImJlIiwiZXF1YWwiLCJ2ZXJpZnlBbGwiLCJqb2luIiwiYXV0b3BlcDhBcmdzIiwiYXV0b3BlcDhQYXRoIiwiYmxhY2tBcmdzIiwiYmxhY2tQYXRoIiwieWFwZkFyZ3MiLCJ5YXBmUGF0aCIsInByb3ZpZGVyIiwia2V5Iiwia2V5cyIsImRlZXAiLCJlbmRzV2l0aCIsImV4cGVjdGVkUGF0aCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRC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TUMsWUFBWSxHQUFHN0QsU0FBUyxDQUFDSyxRQUFRLENBQUN5QixVQUFULENBQW9CMkIsR0FBcEIsQ0FBRCxDQUE5QjtBQUNBN0QsTUFBQUEsTUFBTSxDQUFDZ0QsTUFBUCxDQUFjdEMsUUFBUSxDQUFDd0IsVUFBVCxDQUFvQjJCLEdBQXBCLENBQWQsRUFBd0NaLEVBQXhDLENBQTJDQyxFQUEzQyxDQUE4Q0MsS0FBOUMsQ0FBb0RjLFlBQXBEO0FBQ0g7O0FBQ0R6RCxJQUFBQSxNQUFNLENBQUM0QyxTQUFQO0FBQ0gsR0F2QkcsQ0FBSjtBQXdCSCxDQWxJSSxDQUFMIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IFR5cGVNb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0c1xyXG5jb25zdCB1bnRpbGRpZnkgPSByZXF1aXJlKFwidW50aWxkaWZ5XCIpO1xyXG5jb25zdCBjb25maWdTZXR0aW5nc18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vY29uZmlnU2V0dGluZ3NcIik7XHJcbmNvbnN0IG1pc2NfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3V0aWxzL21pc2NcIik7XHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtZnVuYy1ib2R5LWxlbmd0aFxyXG5zdWl0ZSgnUHl0aG9uIFNldHRpbmdzJywgKCkgPT4ge1xyXG4gICAgbGV0IGNvbmZpZztcclxuICAgIGxldCBleHBlY3RlZDtcclxuICAgIGxldCBzZXR0aW5ncztcclxuICAgIGNvbnN0IEN1c3RvbVB5dGhvblNldHRpbmdzID0gY2xhc3MgZXh0ZW5kcyBjb25maWdTZXR0aW5nc18xLlB5dGhvblNldHRpbmdzIHtcclxuICAgICAgICBpbml0aWFsaXplKCkgeyBtaXNjXzEubm9vcCgpOyB9XHJcbiAgICB9O1xyXG4gICAgc2V0dXAoKCkgPT4ge1xyXG4gICAgICAgIGNvbmZpZyA9IFR5cGVNb3EuTW9jay5vZlR5cGUodW5kZWZpbmVkLCBUeXBlTW9xLk1vY2tCZWhhdmlvci5TdHJpY3QpO1xyXG4gICAgICAgIGV4cGVjdGVkID0gbmV3IEN1c3RvbVB5dGhvblNldHRpbmdzKCk7XHJcbiAgICAgICAgc2V0dGluZ3MgPSBuZXcgQ3VzdG9tUHl0aG9uU2V0dGluZ3MoKTtcclxuICAgIH0pO1xyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbmZpZyhzb3VyY2VTZXR0aW5ncykge1xyXG4gICAgICAgIC8vIHN0cmluZyBzZXR0aW5nc1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBbJ3B5dGhvblBhdGgnLCAndmVudlBhdGgnLCAnY29uZGFQYXRoJywgJ2VudkZpbGUnXSkge1xyXG4gICAgICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldChuYW1lKSlcclxuICAgICAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHNvdXJjZVNldHRpbmdzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNvdXJjZVNldHRpbmdzLmplZGlFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KCdqZWRpUGF0aCcpKVxyXG4gICAgICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3MuamVkaVBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgWyd2ZW52Rm9sZGVycyddKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KG5hbWUpKVxyXG4gICAgICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3NbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBib29sZWFuIHNldHRpbmdzXHJcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIFsnZG93bmxvYWRMYW5ndWFnZVNlcnZlcicsICdqZWRpRW5hYmxlZCcsICdhdXRvVXBkYXRlTGFuZ3VhZ2VTZXJ2ZXInXSkge1xyXG4gICAgICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldChuYW1lLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHNvdXJjZVNldHRpbmdzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIFsnZGlzYWJsZUluc3RhbGxhdGlvbkNoZWNrJywgJ2dsb2JhbE1vZHVsZUluc3RhbGxhdGlvbiddKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KG5hbWUpKVxyXG4gICAgICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3NbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBudW1iZXIgc2V0dGluZ3NcclxuICAgICAgICBpZiAoc291cmNlU2V0dGluZ3MuamVkaUVuYWJsZWQpIHtcclxuICAgICAgICAgICAgY29uZmlnLnNldHVwKGMgPT4gYy5nZXQoJ2plZGlNZW1vcnlMaW1pdCcpKVxyXG4gICAgICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3MuamVkaU1lbW9yeUxpbWl0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gXCJhbnlcIiBzZXR0aW5nc1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgnZGV2T3B0aW9ucycpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBzb3VyY2VTZXR0aW5ncy5kZXZPcHRpb25zKTtcclxuICAgICAgICAvLyBjb21wbGV4IHNldHRpbmdzXHJcbiAgICAgICAgY29uZmlnLnNldHVwKGMgPT4gYy5nZXQoJ2xpbnRpbmcnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3MubGludGluZyk7XHJcbiAgICAgICAgY29uZmlnLnNldHVwKGMgPT4gYy5nZXQoJ2FuYWx5c2lzJykpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHNvdXJjZVNldHRpbmdzLmFuYWx5c2lzKTtcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgnc29ydEltcG9ydHMnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3Muc29ydEltcG9ydHMpO1xyXG4gICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KCdmb3JtYXR0aW5nJykpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHNvdXJjZVNldHRpbmdzLmZvcm1hdHRpbmcpO1xyXG4gICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KCdhdXRvQ29tcGxldGUnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3MuYXV0b0NvbXBsZXRlKTtcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgnd29ya3NwYWNlU3ltYm9scycpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBzb3VyY2VTZXR0aW5ncy53b3Jrc3BhY2VTeW1ib2xzKTtcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgndW5pdFRlc3QnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gc291cmNlU2V0dGluZ3MudW5pdFRlc3QpO1xyXG4gICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KCd0ZXJtaW5hbCcpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBzb3VyY2VTZXR0aW5ncy50ZXJtaW5hbCk7XHJcbiAgICAgICAgY29uZmlnLnNldHVwKGMgPT4gYy5nZXQoJ2RhdGFTY2llbmNlJykpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHNvdXJjZVNldHRpbmdzLmRhdGFzY2llbmNlKTtcclxuICAgIH1cclxuICAgIHRlc3QoJ2NvbmRhUGF0aCB1cGRhdGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdGVkLnB5dGhvblBhdGggPSAncHl0aG9uMyc7XHJcbiAgICAgICAgZXhwZWN0ZWQuY29uZGFQYXRoID0gJ3NwYW0nO1xyXG4gICAgICAgIGluaXRpYWxpemVDb25maWcoZXhwZWN0ZWQpO1xyXG4gICAgICAgIGNvbmZpZy5zZXR1cChjID0+IGMuZ2V0KCdjb25kYVBhdGgnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gZXhwZWN0ZWQuY29uZGFQYXRoKVxyXG4gICAgICAgICAgICAudmVyaWZpYWJsZShUeXBlTW9xLlRpbWVzLm9uY2UoKSk7XHJcbiAgICAgICAgc2V0dGluZ3MudXBkYXRlKGNvbmZpZy5vYmplY3QpO1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3Qoc2V0dGluZ3MuY29uZGFQYXRoKS50by5iZS5lcXVhbChleHBlY3RlZC5jb25kYVBhdGgpO1xyXG4gICAgICAgIGNvbmZpZy52ZXJpZnlBbGwoKTtcclxuICAgIH0pO1xyXG4gICAgdGVzdCgnY29uZGFQYXRoIChyZWxhdGl2ZSB0byBob21lKSB1cGRhdGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdGVkLnB5dGhvblBhdGggPSAncHl0aG9uMyc7XHJcbiAgICAgICAgZXhwZWN0ZWQuY29uZGFQYXRoID0gcGF0aC5qb2luKCd+JywgJ2FuYWNvbmRhMycsICdiaW4nLCAnY29uZGEnKTtcclxuICAgICAgICBpbml0aWFsaXplQ29uZmlnKGV4cGVjdGVkKTtcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgnY29uZGFQYXRoJykpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IGV4cGVjdGVkLmNvbmRhUGF0aClcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUoVHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHNldHRpbmdzLnVwZGF0ZShjb25maWcub2JqZWN0KTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNldHRpbmdzLmNvbmRhUGF0aCkudG8uYmUuZXF1YWwodW50aWxkaWZ5KGV4cGVjdGVkLmNvbmRhUGF0aCkpO1xyXG4gICAgICAgIGNvbmZpZy52ZXJpZnlBbGwoKTtcclxuICAgIH0pO1xyXG4gICAgdGVzdCgnRm9ybWF0dGVyIFBhdGhzIGFuZCBhcmdzJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdGVkLnB5dGhvblBhdGggPSAncHl0aG9uMyc7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxyXG4gICAgICAgIGV4cGVjdGVkLmZvcm1hdHRpbmcgPSB7XHJcbiAgICAgICAgICAgIGF1dG9wZXA4QXJnczogWycxJywgJzInXSwgYXV0b3BlcDhQYXRoOiAnb25lJyxcclxuICAgICAgICAgICAgYmxhY2tBcmdzOiBbJzMnLCAnNCddLCBibGFja1BhdGg6ICd0d28nLFxyXG4gICAgICAgICAgICB5YXBmQXJnczogWyc1JywgJzYnXSwgeWFwZlBhdGg6ICd0aHJlZScsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZXhwZWN0ZWQuZm9ybWF0dGluZy5ibGFja1BhdGggPSAnc3BhbSc7XHJcbiAgICAgICAgaW5pdGlhbGl6ZUNvbmZpZyhleHBlY3RlZCk7XHJcbiAgICAgICAgY29uZmlnLnNldHVwKGMgPT4gYy5nZXQoJ2Zvcm1hdHRpbmcnKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gZXhwZWN0ZWQuZm9ybWF0dGluZylcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUoVHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHNldHRpbmdzLnVwZGF0ZShjb25maWcub2JqZWN0KTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhleHBlY3RlZC5mb3JtYXR0aW5nKSkge1xyXG4gICAgICAgICAgICBjaGFpXzEuZXhwZWN0KHNldHRpbmdzLmZvcm1hdHRpbmdba2V5XSkudG8uYmUuZGVlcC5lcXVhbChleHBlY3RlZC5mb3JtYXR0aW5nW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25maWcudmVyaWZ5QWxsKCk7XHJcbiAgICB9KTtcclxuICAgIHRlc3QoJ0Zvcm1hdHRlciBQYXRocyAocGF0aHMgcmVsYXRpdmUgdG8gaG9tZSknLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0ZWQucHl0aG9uUGF0aCA9ICdweXRob24zJztcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XHJcbiAgICAgICAgZXhwZWN0ZWQuZm9ybWF0dGluZyA9IHtcclxuICAgICAgICAgICAgYXV0b3BlcDhBcmdzOiBbXSwgYXV0b3BlcDhQYXRoOiBwYXRoLmpvaW4oJ34nLCAnb25lJyksXHJcbiAgICAgICAgICAgIGJsYWNrQXJnczogW10sIGJsYWNrUGF0aDogcGF0aC5qb2luKCd+JywgJ3R3bycpLFxyXG4gICAgICAgICAgICB5YXBmQXJnczogW10sIHlhcGZQYXRoOiBwYXRoLmpvaW4oJ34nLCAndGhyZWUnKSxcclxuICAgICAgICAgICAgcHJvdmlkZXI6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBleHBlY3RlZC5mb3JtYXR0aW5nLmJsYWNrUGF0aCA9ICdzcGFtJztcclxuICAgICAgICBpbml0aWFsaXplQ29uZmlnKGV4cGVjdGVkKTtcclxuICAgICAgICBjb25maWcuc2V0dXAoYyA9PiBjLmdldCgnZm9ybWF0dGluZycpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBleHBlY3RlZC5mb3JtYXR0aW5nKVxyXG4gICAgICAgICAgICAudmVyaWZpYWJsZShUeXBlTW9xLlRpbWVzLm9uY2UoKSk7XHJcbiAgICAgICAgc2V0dGluZ3MudXBkYXRlKGNvbmZpZy5vYmplY3QpO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGV4cGVjdGVkLmZvcm1hdHRpbmcpKSB7XHJcbiAgICAgICAgICAgIGlmICgha2V5LmVuZHNXaXRoKCdwYXRoJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IHVudGlsZGlmeShleHBlY3RlZC5mb3JtYXR0aW5nW2tleV0pO1xyXG4gICAgICAgICAgICBjaGFpXzEuZXhwZWN0KHNldHRpbmdzLmZvcm1hdHRpbmdba2V5XSkudG8uYmUuZXF1YWwoZXhwZWN0ZWRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uZmlnLnZlcmlmeUFsbCgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25maWdTZXR0aW5ncy51bml0LnRlc3QuanMubWFwIl19