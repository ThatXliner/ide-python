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

Object.defineProperty(exports, "__esModule", {
  value: true
});

const inversify_1 = require("inversify");

const types_1 = require("../../../ioc/types");

const types_2 = require("../../types");

const OptionsWithArguments = ['-c', '-k', '-m', '-o', '-p', '-r', '-W', '--assert', '--basetemp', '--capture', '--color', '--confcutdir', '--cov', '--cov-config', '--cov-fail-under', '--cov-report', '--deselect', '--dist', '--doctest-glob', '--doctest-report', '--durations', '--ignore', '--import-mode', '--junit-prefix', '--junit-xml', '--last-failed-no-failures', '--lfnf', '--log-cli-date-format', '--log-cli-format', '--log-cli-level', '--log-date-format', '--log-file', '--log-file-date-format', '--log-file-format', '--log-file-level', '--log-format', '--log-level', '--maxfail', '--override-ini', '--pastebin', '--pdbcls', '--pythonwarnings', '--result-log', '--rootdir', '--show-capture', '--tb', '--verbosity', '--max-slave-restart', '--numprocesses', '--rsyncdir', '--rsyncignore', '--tx'];
const OptionsWithoutArguments = ['--cache-clear', '--cache-show', '--collect-in-virtualenv', '--collect-only', '--continue-on-collection-errors', '--cov-append', '--cov-branch', '--debug', '--disable-pytest-warnings', '--disable-warnings', '--doctest-continue-on-failure', '--doctest-ignore-import-errors', '--doctest-modules', '--exitfirst', '--failed-first', '--ff', '--fixtures', '--fixtures-per-test', '--force-sugar', '--full-trace', '--funcargs', '--help', '--keep-duplicates', '--last-failed', '--lf', '--markers', '--new-first', '--nf', '--no-cov', '--no-cov-on-fail', '--no-print-logs', '--noconftest', '--old-summary', '--pdb', '--pyargs', '-PyTest, Unittest-pyargs', '--quiet', '--runxfail', '--setup-only', '--setup-plan', '--setup-show', '--showlocals', '--strict', '--trace-config', '--verbose', '--version', '-h', '-l', '-q', '-s', '-v', '-x', '--boxed', '--forked', '--looponfail', '--trace', '--tx', '-d'];
let ArgumentsService = class ArgumentsService {
  constructor(serviceContainer) {
    this.helper = serviceContainer.get(types_2.IArgumentsHelper);
  }

  getKnownOptions() {
    return {
      withArgs: OptionsWithArguments,
      withoutArgs: OptionsWithoutArguments
    };
  }

  getOptionValue(args, option) {
    return this.helper.getOptionValues(args, option);
  }

  filterArguments(args, argumentToRemoveOrFilter) {
    const optionsWithoutArgsToRemove = [];
    const optionsWithArgsToRemove = []; // Positional arguments in pytest are test directories and files.
    // So if we want to run a specific test, then remove positional args.

    let removePositionalArgs = false;

    if (Array.isArray(argumentToRemoveOrFilter)) {
      argumentToRemoveOrFilter.forEach(item => {
        if (OptionsWithArguments.indexOf(item) >= 0) {
          optionsWithArgsToRemove.push(item);
        }

        if (OptionsWithoutArguments.indexOf(item) >= 0) {
          optionsWithoutArgsToRemove.push(item);
        }
      });
    } else {
      switch (argumentToRemoveOrFilter) {
        case types_2.TestFilter.removeTests:
          {
            optionsWithoutArgsToRemove.push(...['--lf', '--last-failed', '--ff', '--failed-first', '--nf', '--new-first']);
            optionsWithArgsToRemove.push(...['-k', '-m', '--lfnf', '--last-failed-no-failures']);
            removePositionalArgs = true;
            break;
          }

        case types_2.TestFilter.discovery:
          {
            optionsWithoutArgsToRemove.push(...['-x', '--exitfirst', '--fixtures', '--funcargs', '--fixtures-per-test', '--pdb', '--lf', '--last-failed', '--ff', '--failed-first', '--nf', '--new-first', '--cache-show', '-v', '--verbose', '-q', '-quiet', '-l', '--showlocals', '--no-print-logs', '--debug', '--setup-only', '--setup-show', '--setup-plan', '--trace']);
            optionsWithArgsToRemove.push(...['-m', '--maxfail', '--pdbcls', '--capture', '--lfnf', '--last-failed-no-failures', '--verbosity', '-r', '--tb', '--rootdir', '--show-capture', '--durations', '--junit-xml', '--junit-prefix', '--result-log', '-W', '--pythonwarnings', '--log-*']);
            removePositionalArgs = true;
            break;
          }

        case types_2.TestFilter.debugAll:
        case types_2.TestFilter.runAll:
          {
            optionsWithoutArgsToRemove.push(...['--collect-only', '--trace']);
            break;
          }

        case types_2.TestFilter.debugSpecific:
        case types_2.TestFilter.runSpecific:
          {
            optionsWithoutArgsToRemove.push(...['--collect-only', '--lf', '--last-failed', '--ff', '--failed-first', '--nf', '--new-first', '--trace']);
            optionsWithArgsToRemove.push(...['-k', '-m', '--lfnf', '--last-failed-no-failures']);
            removePositionalArgs = true;
            break;
          }

        default:
          {
            throw new Error(`Unsupported Filter '${argumentToRemoveOrFilter}'`);
          }
      }
    }

    let filteredArgs = args.slice();

    if (removePositionalArgs) {
      const positionalArgs = this.helper.getPositionalArguments(filteredArgs, OptionsWithArguments, OptionsWithoutArguments);
      filteredArgs = filteredArgs.filter(item => positionalArgs.indexOf(item) === -1);
    }

    return this.helper.filterArguments(filteredArgs, optionsWithArgsToRemove, optionsWithoutArgsToRemove);
  }

  getTestFolders(args) {
    const testDirs = this.helper.getOptionValues(args, '--rootdir');

    if (typeof testDirs === 'string') {
      return [testDirs];
    }

    if (Array.isArray(testDirs) && testDirs.length > 0) {
      return testDirs;
    }

    const positionalArgs = this.helper.getPositionalArguments(args, OptionsWithArguments, OptionsWithoutArguments); // Positional args in pytest are files or directories.
    // Remove files from the args, and what's left are test directories.
    // If users enter test modules/methods, then its not supported.

    return positionalArgs.filter(arg => !arg.toUpperCase().endsWith('.PY'));
  }

};
ArgumentsService = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer))], ArgumentsService);
exports.ArgumentsService = ArgumentsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFyZ3NTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiZXhwb3J0cyIsInZhbHVlIiwiaW52ZXJzaWZ5XzEiLCJyZXF1aXJlIiwidHlwZXNfMSIsInR5cGVzXzIiLCJPcHRpb25zV2l0aEFyZ3VtZW50cyIsIk9wdGlvbnNXaXRob3V0QXJndW1lbnRzIiwiQXJndW1lbnRzU2VydmljZSIsImNvbnN0cnVjdG9yIiwic2VydmljZUNvbnRhaW5lciIsImhlbHBlciIsImdldCIsIklBcmd1bWVudHNIZWxwZXIiLCJnZXRLbm93bk9wdGlvbnMiLCJ3aXRoQXJncyIsIndpdGhvdXRBcmdzIiwiZ2V0T3B0aW9uVmFsdWUiLCJhcmdzIiwib3B0aW9uIiwiZ2V0T3B0aW9uVmFsdWVzIiwiZmlsdGVyQXJndW1lbnRzIiwiYXJndW1lbnRUb1JlbW92ZU9yRmlsdGVyIiwib3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUiLCJvcHRpb25zV2l0aEFyZ3NUb1JlbW92ZSIsInJlbW92ZVBvc2l0aW9uYWxBcmdzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIml0ZW0iLCJpbmRleE9mIiwicHVzaCIsIlRlc3RGaWx0ZXIiLCJyZW1vdmVUZXN0cyIsImRpc2NvdmVyeSIsImRlYnVnQWxsIiwicnVuQWxsIiwiZGVidWdTcGVjaWZpYyIsInJ1blNwZWNpZmljIiwiRXJyb3IiLCJmaWx0ZXJlZEFyZ3MiLCJzbGljZSIsInBvc2l0aW9uYWxBcmdzIiwiZ2V0UG9zaXRpb25hbEFyZ3VtZW50cyIsImZpbHRlciIsImdldFRlc3RGb2xkZXJzIiwidGVzdERpcnMiLCJhcmciLCJ0b1VwcGVyQ2FzZSIsImVuZHNXaXRoIiwiaW5qZWN0YWJsZSIsImluamVjdCIsIklTZXJ2aWNlQ29udGFpbmVyIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsVUFBVSxHQUFJLFVBQVEsU0FBS0EsVUFBZCxJQUE2QixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ25GLE1BQUlDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFsQjtBQUFBLE1BQTBCQyxDQUFDLEdBQUdILENBQUMsR0FBRyxDQUFKLEdBQVFILE1BQVIsR0FBaUJFLElBQUksS0FBSyxJQUFULEdBQWdCQSxJQUFJLEdBQUdLLE1BQU0sQ0FBQ0Msd0JBQVAsQ0FBZ0NSLE1BQWhDLEVBQXdDQyxHQUF4QyxDQUF2QixHQUFzRUMsSUFBckg7QUFBQSxNQUEySE8sQ0FBM0g7QUFDQSxNQUFJLE9BQU9DLE9BQVAsS0FBbUIsUUFBbkIsSUFBK0IsT0FBT0EsT0FBTyxDQUFDQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxDQUFDLEdBQUdJLE9BQU8sQ0FBQ0MsUUFBUixDQUFpQlosVUFBakIsRUFBNkJDLE1BQTdCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsSUFBMUMsQ0FBSixDQUEzRSxLQUNLLEtBQUssSUFBSVUsQ0FBQyxHQUFHYixVQUFVLENBQUNNLE1BQVgsR0FBb0IsQ0FBakMsRUFBb0NPLENBQUMsSUFBSSxDQUF6QyxFQUE0Q0EsQ0FBQyxFQUE3QyxFQUFpRCxJQUFJSCxDQUFDLEdBQUdWLFVBQVUsQ0FBQ2EsQ0FBRCxDQUFsQixFQUF1Qk4sQ0FBQyxHQUFHLENBQUNILENBQUMsR0FBRyxDQUFKLEdBQVFNLENBQUMsQ0FBQ0gsQ0FBRCxDQUFULEdBQWVILENBQUMsR0FBRyxDQUFKLEdBQVFNLENBQUMsQ0FBQ1QsTUFBRCxFQUFTQyxHQUFULEVBQWNLLENBQWQsQ0FBVCxHQUE0QkcsQ0FBQyxDQUFDVCxNQUFELEVBQVNDLEdBQVQs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RCxNQUFaLENBQW1CL0MsT0FBTyxDQUFDZ0QsaUJBQTNCLENBQUosQ0FGbUIsQ0FBRCxFQUcxQjVDLGdCQUgwQixDQUE3QjtBQUlBUixPQUFPLENBQUNRLGdCQUFSLEdBQTJCQSxnQkFBM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW9jL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uLy4uL3R5cGVzXCIpO1xyXG5jb25zdCBPcHRpb25zV2l0aEFyZ3VtZW50cyA9IFsnLWMnLCAnLWsnLCAnLW0nLCAnLW8nLCAnLXAnLCAnLXInLCAnLVcnLFxyXG4gICAgJy0tYXNzZXJ0JywgJy0tYmFzZXRlbXAnLCAnLS1jYXB0dXJlJywgJy0tY29sb3InLCAnLS1jb25mY3V0ZGlyJyxcclxuICAgICctLWNvdicsICctLWNvdi1jb25maWcnLCAnLS1jb3YtZmFpbC11bmRlcicsICctLWNvdi1yZXBvcnQnLFxyXG4gICAgJy0tZGVzZWxlY3QnLCAnLS1kaXN0JywgJy0tZG9jdGVzdC1nbG9iJyxcclxuICAgICctLWRvY3Rlc3QtcmVwb3J0JywgJy0tZHVyYXRpb25zJywgJy0taWdub3JlJywgJy0taW1wb3J0LW1vZGUnLFxyXG4gICAgJy0tanVuaXQtcHJlZml4JywgJy0tanVuaXQteG1sJywgJy0tbGFzdC1mYWlsZWQtbm8tZmFpbHVyZXMnLFxyXG4gICAgJy0tbGZuZicsICctLWxvZy1jbGktZGF0ZS1mb3JtYXQnLCAnLS1sb2ctY2xpLWZvcm1hdCcsXHJcbiAgICAnLS1sb2ctY2xpLWxldmVsJywgJy0tbG9nLWRhdGUtZm9ybWF0JywgJy0tbG9nLWZpbGUnLFxyXG4gICAgJy0tbG9nLWZpbGUtZGF0ZS1mb3JtYXQnLCAnLS1sb2ctZmlsZS1mb3JtYXQnLCAnLS1sb2ctZmlsZS1sZXZlbCcsXHJcbiAgICAnLS1sb2ctZm9ybWF0JywgJy0tbG9nLWxldmVsJywgJy0tbWF4ZmFpbCcsICctLW92ZXJyaWRlLWluaScsXHJcbiAgICAnLS1wYXN0ZWJpbicsICctLXBkYmNscycsICctLXB5dGhvbndhcm5pbmdzJywgJy0tcmVzdWx0LWxvZycsXHJcbiAgICAnLS1yb290ZGlyJywgJy0tc2hvdy1jYXB0dXJlJywgJy0tdGInLCAnLS12ZXJib3NpdHknLCAnLS1tYXgtc2xhdmUtcmVzdGFydCcsXHJcbiAgICAnLS1udW1wcm9jZXNzZXMnLCAnLS1yc3luY2RpcicsICctLXJzeW5jaWdub3JlJywgJy0tdHgnXTtcclxuY29uc3QgT3B0aW9uc1dpdGhvdXRBcmd1bWVudHMgPSBbJy0tY2FjaGUtY2xlYXInLCAnLS1jYWNoZS1zaG93JywgJy0tY29sbGVjdC1pbi12aXJ0dWFsZW52JyxcclxuICAgICctLWNvbGxlY3Qtb25seScsICctLWNvbnRpbnVlLW9uLWNvbGxlY3Rpb24tZXJyb3JzJyxcclxuICAgICctLWNvdi1hcHBlbmQnLCAnLS1jb3YtYnJhbmNoJywgJy0tZGVidWcnLCAnLS1kaXNhYmxlLXB5dGVzdC13YXJuaW5ncycsXHJcbiAgICAnLS1kaXNhYmxlLXdhcm5pbmdzJywgJy0tZG9jdGVzdC1jb250aW51ZS1vbi1mYWlsdXJlJywgJy0tZG9jdGVzdC1pZ25vcmUtaW1wb3J0LWVycm9ycycsXHJcbiAgICAnLS1kb2N0ZXN0LW1vZHVsZXMnLCAnLS1leGl0Zmlyc3QnLCAnLS1mYWlsZWQtZmlyc3QnLCAnLS1mZicsICctLWZpeHR1cmVzJyxcclxuICAgICctLWZpeHR1cmVzLXBlci10ZXN0JywgJy0tZm9yY2Utc3VnYXInLCAnLS1mdWxsLXRyYWNlJywgJy0tZnVuY2FyZ3MnLCAnLS1oZWxwJyxcclxuICAgICctLWtlZXAtZHVwbGljYXRlcycsICctLWxhc3QtZmFpbGVkJywgJy0tbGYnLCAnLS1tYXJrZXJzJywgJy0tbmV3LWZpcnN0JywgJy0tbmYnLFxyXG4gICAgJy0tbm8tY292JywgJy0tbm8tY292LW9uLWZhaWwnLFxyXG4gICAgJy0tbm8tcHJpbnQtbG9ncycsICctLW5vY29uZnRlc3QnLCAnLS1vbGQtc3VtbWFyeScsICctLXBkYicsICctLXB5YXJncycsICctUHlUZXN0LCBVbml0dGVzdC1weWFyZ3MnLFxyXG4gICAgJy0tcXVpZXQnLCAnLS1ydW54ZmFpbCcsICctLXNldHVwLW9ubHknLCAnLS1zZXR1cC1wbGFuJywgJy0tc2V0dXAtc2hvdycsICctLXNob3dsb2NhbHMnLFxyXG4gICAgJy0tc3RyaWN0JywgJy0tdHJhY2UtY29uZmlnJywgJy0tdmVyYm9zZScsICctLXZlcnNpb24nLCAnLWgnLCAnLWwnLCAnLXEnLCAnLXMnLCAnLXYnLCAnLXgnLFxyXG4gICAgJy0tYm94ZWQnLCAnLS1mb3JrZWQnLCAnLS1sb29wb25mYWlsJywgJy0tdHJhY2UnLCAnLS10eCcsICctZCddO1xyXG5sZXQgQXJndW1lbnRzU2VydmljZSA9IGNsYXNzIEFyZ3VtZW50c1NlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuaGVscGVyID0gc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JQXJndW1lbnRzSGVscGVyKTtcclxuICAgIH1cclxuICAgIGdldEtub3duT3B0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aXRoQXJnczogT3B0aW9uc1dpdGhBcmd1bWVudHMsXHJcbiAgICAgICAgICAgIHdpdGhvdXRBcmdzOiBPcHRpb25zV2l0aG91dEFyZ3VtZW50c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBnZXRPcHRpb25WYWx1ZShhcmdzLCBvcHRpb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXIuZ2V0T3B0aW9uVmFsdWVzKGFyZ3MsIG9wdGlvbik7XHJcbiAgICB9XHJcbiAgICBmaWx0ZXJBcmd1bWVudHMoYXJncywgYXJndW1lbnRUb1JlbW92ZU9yRmlsdGVyKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUgPSBbXTtcclxuICAgICAgICBjb25zdCBvcHRpb25zV2l0aEFyZ3NUb1JlbW92ZSA9IFtdO1xyXG4gICAgICAgIC8vIFBvc2l0aW9uYWwgYXJndW1lbnRzIGluIHB5dGVzdCBhcmUgdGVzdCBkaXJlY3RvcmllcyBhbmQgZmlsZXMuXHJcbiAgICAgICAgLy8gU28gaWYgd2Ugd2FudCB0byBydW4gYSBzcGVjaWZpYyB0ZXN0LCB0aGVuIHJlbW92ZSBwb3NpdGlvbmFsIGFyZ3MuXHJcbiAgICAgICAgbGV0IHJlbW92ZVBvc2l0aW9uYWxBcmdzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJndW1lbnRUb1JlbW92ZU9yRmlsdGVyKSkge1xyXG4gICAgICAgICAgICBhcmd1bWVudFRvUmVtb3ZlT3JGaWx0ZXIuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChPcHRpb25zV2l0aEFyZ3VtZW50cy5pbmRleE9mKGl0ZW0pID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zV2l0aEFyZ3NUb1JlbW92ZS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKE9wdGlvbnNXaXRob3V0QXJndW1lbnRzLmluZGV4T2YoaXRlbSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNXaXRob3V0QXJnc1RvUmVtb3ZlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3dpdGNoIChhcmd1bWVudFRvUmVtb3ZlT3JGaWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5UZXN0RmlsdGVyLnJlbW92ZVRlc3RzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUucHVzaCguLi5bXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWxmJywgJy0tbGFzdC1mYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS1mZicsICctLWZhaWxlZC1maXJzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLW5mJywgJy0tbmV3LWZpcnN0J1xyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNXaXRoQXJnc1RvUmVtb3ZlLnB1c2goLi4uW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLWsnLCAnLW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS1sZm5mJywgJy0tbGFzdC1mYWlsZWQtbm8tZmFpbHVyZXMnXHJcbiAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlUG9zaXRpb25hbEFyZ3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlc3RGaWx0ZXIuZGlzY292ZXJ5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUucHVzaCguLi5bXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcteCcsICctLWV4aXRmaXJzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWZpeHR1cmVzJywgJy0tZnVuY2FyZ3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS1maXh0dXJlcy1wZXItdGVzdCcsICctLXBkYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWxmJywgJy0tbGFzdC1mYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS1mZicsICctLWZhaWxlZC1maXJzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLW5mJywgJy0tbmV3LWZpcnN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tY2FjaGUtc2hvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctdicsICctLXZlcmJvc2UnLCAnLXEnLCAnLXF1aWV0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy1sJywgJy0tc2hvd2xvY2FscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLW5vLXByaW50LWxvZ3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLXNldHVwLW9ubHknLCAnLS1zZXR1cC1zaG93JywgJy0tc2V0dXAtcGxhbicsICctLXRyYWNlJ1xyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNXaXRoQXJnc1RvUmVtb3ZlLnB1c2goLi4uW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLW0nLCAnLS1tYXhmYWlsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tcGRiY2xzJywgJy0tY2FwdHVyZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWxmbmYnLCAnLS1sYXN0LWZhaWxlZC1uby1mYWlsdXJlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLXZlcmJvc2l0eScsICctcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLXRiJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tcm9vdGRpcicsICctLXNob3ctY2FwdHVyZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWR1cmF0aW9ucycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWp1bml0LXhtbCcsICctLWp1bml0LXByZWZpeCcsICctLXJlc3VsdC1sb2cnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLVcnLCAnLS1weXRob253YXJuaW5ncycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWxvZy0qJ1xyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZVBvc2l0aW9uYWxBcmdzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5UZXN0RmlsdGVyLmRlYnVnQWxsOlxyXG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlc3RGaWx0ZXIucnVuQWxsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUucHVzaCguLi5bJy0tY29sbGVjdC1vbmx5JywgJy0tdHJhY2UnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzXzIuVGVzdEZpbHRlci5kZWJ1Z1NwZWNpZmljOlxyXG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlc3RGaWx0ZXIucnVuU3BlY2lmaWM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zV2l0aG91dEFyZ3NUb1JlbW92ZS5wdXNoKC4uLltcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tY29sbGVjdC1vbmx5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tbGYnLCAnLS1sYXN0LWZhaWxlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctLWZmJywgJy0tZmFpbGVkLWZpcnN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tbmYnLCAnLS1uZXctZmlyc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLS10cmFjZSdcclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zV2l0aEFyZ3NUb1JlbW92ZS5wdXNoKC4uLltcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy1rJywgJy1tJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy0tbGZuZicsICctLWxhc3QtZmFpbGVkLW5vLWZhaWx1cmVzJ1xyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZVBvc2l0aW9uYWxBcmdzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIEZpbHRlciAnJHthcmd1bWVudFRvUmVtb3ZlT3JGaWx0ZXJ9J2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWx0ZXJlZEFyZ3MgPSBhcmdzLnNsaWNlKCk7XHJcbiAgICAgICAgaWYgKHJlbW92ZVBvc2l0aW9uYWxBcmdzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uYWxBcmdzID0gdGhpcy5oZWxwZXIuZ2V0UG9zaXRpb25hbEFyZ3VtZW50cyhmaWx0ZXJlZEFyZ3MsIE9wdGlvbnNXaXRoQXJndW1lbnRzLCBPcHRpb25zV2l0aG91dEFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkQXJncyA9IGZpbHRlcmVkQXJncy5maWx0ZXIoaXRlbSA9PiBwb3NpdGlvbmFsQXJncy5pbmRleE9mKGl0ZW0pID09PSAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmhlbHBlci5maWx0ZXJBcmd1bWVudHMoZmlsdGVyZWRBcmdzLCBvcHRpb25zV2l0aEFyZ3NUb1JlbW92ZSwgb3B0aW9uc1dpdGhvdXRBcmdzVG9SZW1vdmUpO1xyXG4gICAgfVxyXG4gICAgZ2V0VGVzdEZvbGRlcnMoYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlc3REaXJzID0gdGhpcy5oZWxwZXIuZ2V0T3B0aW9uVmFsdWVzKGFyZ3MsICctLXJvb3RkaXInKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRlc3REaXJzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gW3Rlc3REaXJzXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGVzdERpcnMpICYmIHRlc3REaXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRlc3REaXJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwb3NpdGlvbmFsQXJncyA9IHRoaXMuaGVscGVyLmdldFBvc2l0aW9uYWxBcmd1bWVudHMoYXJncywgT3B0aW9uc1dpdGhBcmd1bWVudHMsIE9wdGlvbnNXaXRob3V0QXJndW1lbnRzKTtcclxuICAgICAgICAvLyBQb3NpdGlvbmFsIGFyZ3MgaW4gcHl0ZXN0IGFyZSBmaWxlcyBvciBkaXJlY3Rvcmllcy5cclxuICAgICAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYXJncywgYW5kIHdoYXQncyBsZWZ0IGFyZSB0ZXN0IGRpcmVjdG9yaWVzLlxyXG4gICAgICAgIC8vIElmIHVzZXJzIGVudGVyIHRlc3QgbW9kdWxlcy9tZXRob2RzLCB0aGVuIGl0cyBub3Qgc3VwcG9ydGVkLlxyXG4gICAgICAgIHJldHVybiBwb3NpdGlvbmFsQXJncy5maWx0ZXIoYXJnID0+ICFhcmcudG9VcHBlckNhc2UoKS5lbmRzV2l0aCgnLlBZJykpO1xyXG4gICAgfVxyXG59O1xyXG5Bcmd1bWVudHNTZXJ2aWNlID0gX19kZWNvcmF0ZShbXHJcbiAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXHJcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklTZXJ2aWNlQ29udGFpbmVyKSlcclxuXSwgQXJndW1lbnRzU2VydmljZSk7XHJcbmV4cG9ydHMuQXJndW1lbnRzU2VydmljZSA9IEFyZ3VtZW50c1NlcnZpY2U7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFyZ3NTZXJ2aWNlLmpzLm1hcCJdfQ==