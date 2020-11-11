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
}); // tslint:disable:max-func-body-length no-any

const chai_1 = require("chai");

const path = require("path");

const TypeMoq = require("typemoq");

const types_1 = require("../../client/common/platform/types");

const types_2 = require("../../client/common/types");

const KnownPathsService_1 = require("../../client/interpreter/locators/services/KnownPathsService");

suite('Interpreters Known Paths', () => {
  let serviceContainer;
  let currentProcess;
  let platformService;
  let pathUtils;
  let knownSearchPaths;
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    serviceContainer = TypeMoq.Mock.ofType();
    currentProcess = TypeMoq.Mock.ofType();
    platformService = TypeMoq.Mock.ofType();
    pathUtils = TypeMoq.Mock.ofType();
    serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_2.ICurrentProcess), TypeMoq.It.isAny())).returns(() => currentProcess.object);
    serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_1.IPlatformService), TypeMoq.It.isAny())).returns(() => platformService.object);
    serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_2.IPathUtils), TypeMoq.It.isAny())).returns(() => pathUtils.object);
    knownSearchPaths = new KnownPathsService_1.KnownSearchPathsForInterpreters(serviceContainer.object);
  }));
  test('Ensure known list of paths are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const pathDelimiter = 'X';
    const pathsInPATHVar = [path.join('a', 'b', 'c'), '', path.join('1', '2'), '3'];
    pathUtils.setup(p => p.delimiter).returns(() => pathDelimiter);
    platformService.setup(p => p.isWindows).returns(() => true);
    platformService.setup(p => p.pathVariableName).returns(() => 'PATH');
    currentProcess.setup(p => p.env).returns(() => {
      return {
        PATH: pathsInPATHVar.join(pathDelimiter)
      };
    });
    const expectedPaths = [...pathsInPATHVar].filter(item => item.length > 0);
    const paths = knownSearchPaths.getSearchPaths();
    chai_1.expect(paths).to.deep.equal(expectedPaths);
  }));
  test('Ensure known list of paths are returned on non-windows', () => __awaiter(void 0, void 0, void 0, function* () {
    const homeDir = '/users/peter Smith';
    const pathDelimiter = 'X';
    pathUtils.setup(p => p.delimiter).returns(() => pathDelimiter);
    pathUtils.setup(p => p.home).returns(() => homeDir);
    platformService.setup(p => p.isWindows).returns(() => false);
    platformService.setup(p => p.pathVariableName).returns(() => 'PATH');
    currentProcess.setup(p => p.env).returns(() => {
      return {
        PATH: ''
      };
    });
    const expectedPaths = [];
    ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/sbin'].forEach(p => {
      expectedPaths.push(p);
      expectedPaths.push(path.join(homeDir, p));
    });
    expectedPaths.push(path.join(homeDir, 'anaconda', 'bin'));
    expectedPaths.push(path.join(homeDir, 'python', 'bin'));
    const paths = knownSearchPaths.getSearchPaths();
    chai_1.expect(paths).to.deep.equal(expectedPaths);
  }));
  test('Ensure PATH variable and known list of paths are merged on non-windows', () => __awaiter(void 0, void 0, void 0, function* () {
    const homeDir = '/users/peter Smith';
    const pathDelimiter = 'X';
    const pathsInPATHVar = [path.join('a', 'b', 'c'), '', path.join('1', '2'), '3'];
    pathUtils.setup(p => p.delimiter).returns(() => pathDelimiter);
    pathUtils.setup(p => p.home).returns(() => homeDir);
    platformService.setup(p => p.isWindows).returns(() => false);
    platformService.setup(p => p.pathVariableName).returns(() => 'PATH');
    currentProcess.setup(p => p.env).returns(() => {
      return {
        PATH: pathsInPATHVar.join(pathDelimiter)
      };
    });
    const expectedPaths = [...pathsInPATHVar].filter(item => item.length > 0);
    ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/sbin'].forEach(p => {
      expectedPaths.push(p);
      expectedPaths.push(path.join(homeDir, p));
    });
    expectedPaths.push(path.join(homeDir, 'anaconda', 'bin'));
    expectedPaths.push(path.join(homeDir, 'python', 'bin'));
    const paths = knownSearchPaths.getSearchPaths();
    chai_1.expect(paths).to.deep.equal(expectedPaths);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtub3duUGF0aFNlcnZpY2UudW5pdC50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJjaGFpXzEiLCJyZXF1aXJlIiwicGF0aCIsIlR5cGVNb3EiLCJ0eXBlc18xIiwidHlwZXNfMiIsIktub3duUGF0aHNTZXJ2aWNlXzEiLCJzdWl0ZSIsInNlcnZpY2VDb250YWluZXIiLCJjdXJyZW50UHJvY2VzcyIsInBsYXRmb3JtU2VydmljZSIsInBhdGhVdGlscyIsImtub3duU2VhcmNoUGF0aHMiLCJzZXR1cCIsIk1vY2siLCJvZlR5cGUiLCJjIiwiZ2V0IiwiSXQiLCJpc1ZhbHVlIiwiSUN1cnJlbnRQcm9jZXNzIiwiaXNBbnkiLCJyZXR1cm5zIiwib2JqZWN0IiwiSVBsYXRmb3JtU2VydmljZSIsIklQYXRoVXRpbHMiLCJLbm93blNlYXJjaFBhdGhzRm9ySW50ZXJwcmV0ZXJzIiwidGVzdCIsInBhdGhEZWxpbWl0ZXIiLCJwYXRoc0luUEFUSFZhciIsImpvaW4iLCJwIiwiZGVsaW1pdGVyIiwiaXNXaW5kb3dzIiwicGF0aFZhcmlhYmxlTmFtZSIsImVudiIsIlBBVEgiLCJleHBlY3RlZFBhdGhzIiwiZmlsdGVyIiwiaXRlbSIsImxlbmd0aCIsInBhdGhzIiwiZ2V0U2VhcmNoUGF0aHMiLCJleHBlY3QiLCJ0byIsImRlZXAiLCJlcXVhbCIsImhvbWVEaXIiLCJob21lIiwiZm9yRWFjaCIsInB1c2giXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFsQixFQUF5QjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CSyxLQUFuQixDQUFELENBQUo7QUFBa0MsT0FBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDOUYsYUFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFyQixHQUFzQyxJQUFJTixDQUFKLENBQU0sVUFBVUcsT0FBVixFQUFtQjtBQUFFQSxRQUFBQSxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFQO0FBQXdCLE9BQW5ELEVBQXFETyxJQUFyRCxDQUEwRFIsU0FBMUQsRUFBcUVLLFFBQXJFLENBQXRDO0FBQXVIOztBQUMvSUgsSUFBQUEsSUFBSSxDQUFDLENBQUNOLFNBQVMsR0FBR0EsU0FBUyxDQUFDYSxLQUFWLENBQWdCaEIsT0FBaEIsRUFBeUJDLFVBQVUsSUFBSSxFQUF2QyxDQUFiLEVBQXlEUyxJQUF6RCxFQUFELENBQUo7QUFDSCxHQUxNLENBQVA7QUFNSCxDQVBEOztBQVFBTyxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVYLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDLEUsQ0FDQTs7QUFDQSxNQUFNWSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQXRCOztBQUNBLE1BQU1DLElBQUksR0FBR0QsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsTUFBTUUsT0FBTyxHQUFHRixPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxNQUFNRyxPQUFPLEdBQUdILE9BQU8sQ0FBQyxvQ0FBRCxDQUF2Qjs7QUFDQSxNQUFNSSxPQUFPLEdBQUdKLE9BQU8sQ0FBQywyQkFBRCxDQUF2Qjs7QUFDQSxNQUFNSyxtQkFBbUIsR0FBR0wsT0FBTyxDQUFDLDhEQUFELENBQW5DOztBQUNBTSxLQUFLLENBQUMsMEJBQUQsRUFBNkIsTUFBTTtBQUNwQyxNQUFJQyxnQkFBSjtBQUNBLE1BQUlDLGNBQUo7QUFDQSxNQUFJQyxlQUFKO0FBQ0EsTUFBSUMsU0FBSjtBQUNBLE1BQUlDLGdCQUFKO0FBQ0FDLEVBQUFBLEtBQUssQ0FBQyxNQUFNbEMsU0FBUyxTQUFPLEtBQUssQ0FBWixFQUFlLEtBQUssQ0FBcEIsRUFBdUIsYUFBYTtBQUNyRDZCLElBQUFBLGdCQUFnQixHQUFHTCxPQUFPLENBQUNXLElBQVIsQ0FBYUMsTUFBYixFQUFuQjtBQUNBTixJQUFBQSxjQUFjLEdBQUdOLE9BQU8sQ0FBQ1csSUFBUixDQUFhQyxNQUFiLEVBQWpCO0FBQ0FMLElBQUFBLGVBQWUsR0FBR1AsT0FBTyxDQUFDVyxJQUFSLENBQWFDLE1BQWIsRUFBbEI7QUFDQUosSUFBQUEsU0FBUyxHQUFHUixPQUFPLENBQUNXLElBQVIsQ0FBYUMsTUFBYixFQUFaO0FBQ0FQLElBQUFBLGdCQUFnQixDQUFDSyxLQUFqQixDQUF1QkcsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEdBQUYsQ0FBTWQsT0FBTyxDQUFDZSxFQUFSLENBQVdDLE9BQVgsQ0FBbUJkLE9BQU8sQ0FBQ2UsZUFBM0IsQ0FBTixFQUFtRGpCLE9BQU8sQ0FBQ2UsRUFBUixDQUFXRyxLQUFYLEVBQW5ELENBQTVCLEVBQW9HQyxPQUFwRyxDQUE0RyxNQUFNYixjQUFjLENBQUNjLE1BQWpJO0FBQ0FmLElBQUFBLGdCQUFnQixDQUFDSyxLQUFqQixDQUF1QkcsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEdBQUYsQ0FBTWQsT0FBTyxDQUFDZSxFQUFSLENBQVdDLE9BQVgsQ0FBbUJmLE9BQU8sQ0FBQ29CLGdCQUEzQixDQUFOLEVBQW9EckIsT0FBTyxDQUFDZSxFQUFSLENBQVdHLEtBQVgsRUFBcEQsQ0FBNUIsRUFBcUdDLE9BQXJHLENBQTZHLE1BQU1aLGVBQWUsQ0FBQ2EsTUFBbkk7QUFDQWYsSUFBQUEsZ0JBQWdCLENBQUNLLEtBQWpCLENBQXVCRyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsR0FBRixDQUFNZCxPQUFPLENBQUNlLEVBQVIsQ0FBV0MsT0FBWCxDQUFtQmQsT0FBTyxDQUFDb0IsVUFBM0IsQ0FBTixFQUE4Q3RCLE9BQU8sQ0FBQ2UsRUFBUixDQUFXRyxLQUFYLEVBQTlDLENBQTVCLEVBQStGQyxPQUEvRixDQUF1RyxNQUFNWCxTQUFTLENBQUNZLE1BQXZIO0FBQ0FYLElBQUFBLGdCQUFnQixHQUFHLElBQUlOLG1CQUFtQixDQUFDb0IsK0JBQXhCLENBQXdEbEIsZ0JBQWdCLENBQUNlLE1BQXpFLENBQW5CO0FBQ0gsR0FUb0IsQ0FBaEIsQ0FBTDtBQVVBSSxFQUFBQSxJQUFJLENBQUMseUNBQUQsRUFBNEMsTUFBTWhELFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDL0YsVUFBTWlELGFBQWEsR0FBRyxHQUF0QjtBQUNBLFVBQU1DLGNBQWMsR0FBRyxDQUFDM0IsSUFBSSxDQUFDNEIsSUFBTCxDQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLENBQUQsRUFBMkIsRUFBM0IsRUFBK0I1QixJQUFJLENBQUM0QixJQUFMLENBQVUsR0FBVixFQUFlLEdBQWYsQ0FBL0IsRUFBb0QsR0FBcEQsQ0FBdkI7QUFDQW5CLElBQUFBLFNBQVMsQ0FBQ0UsS0FBVixDQUFnQmtCLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxTQUF2QixFQUFrQ1YsT0FBbEMsQ0FBMEMsTUFBTU0sYUFBaEQ7QUFDQWxCLElBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0JrQixDQUFDLElBQUlBLENBQUMsQ0FBQ0UsU0FBN0IsRUFBd0NYLE9BQXhDLENBQWdELE1BQU0sSUFBdEQ7QUFDQVosSUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmtCLENBQUMsSUFBSUEsQ0FBQyxDQUFDRyxnQkFBN0IsRUFBK0NaLE9BQS9DLENBQXVELE1BQU0sTUFBN0Q7QUFDQWIsSUFBQUEsY0FBYyxDQUFDSSxLQUFmLENBQXFCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNJLEdBQTVCLEVBQWlDYixPQUFqQyxDQUF5QyxNQUFNO0FBQzNDLGFBQU87QUFBRWMsUUFBQUEsSUFBSSxFQUFFUCxjQUFjLENBQUNDLElBQWYsQ0FBb0JGLGFBQXBCO0FBQVIsT0FBUDtBQUNILEtBRkQ7QUFHQSxVQUFNUyxhQUFhLEdBQUcsQ0FBQyxHQUFHUixjQUFKLEVBQW9CUyxNQUFwQixDQUEyQkMsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE1BQUwsR0FBYyxDQUFqRCxDQUF0QjtBQUNBLFVBQU1DLEtBQUssR0FBRzdCLGdCQUFnQixDQUFDOEIsY0FBakIsRUFBZDtBQUNBMUMsSUFBQUEsTUFBTSxDQUFDMkMsTUFBUCxDQUFjRixLQUFkLEVBQXFCRyxFQUFyQixDQUF3QkMsSUFBeEIsQ0FBNkJDLEtBQTdCLENBQW1DVCxhQUFuQztBQUNILEdBWjhELENBQTNELENBQUo7QUFhQVYsRUFBQUEsSUFBSSxDQUFDLHdEQUFELEVBQTJELE1BQU1oRCxTQUFTLFNBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQzlHLFVBQU1vRSxPQUFPLEdBQUcsb0JBQWhCO0FBQ0EsVUFBTW5CLGFBQWEsR0FBRyxHQUF0QjtBQUNBakIsSUFBQUEsU0FBUyxDQUFDRSxLQUFWLENBQWdCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFNBQXZCLEVBQWtDVixPQUFsQyxDQUEwQyxNQUFNTSxhQUFoRDtBQUNBakIsSUFBQUEsU0FBUyxDQUFDRSxLQUFWLENBQWdCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNpQixJQUF2QixFQUE2QjFCLE9BQTdCLENBQXFDLE1BQU15QixPQUEzQztBQUNBckMsSUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmtCLENBQUMsSUFBSUEsQ0FBQyxDQUFDRSxTQUE3QixFQUF3Q1gsT0FBeEMsQ0FBZ0QsTUFBTSxLQUF0RDtBQUNBWixJQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNHLGdCQUE3QixFQUErQ1osT0FBL0MsQ0FBdUQsTUFBTSxNQUE3RDtBQUNBYixJQUFBQSxjQUFjLENBQUNJLEtBQWYsQ0FBcUJrQixDQUFDLElBQUlBLENBQUMsQ0FBQ0ksR0FBNUIsRUFBaUNiLE9BQWpDLENBQXlDLE1BQU07QUFDM0MsYUFBTztBQUFFYyxRQUFBQSxJQUFJLEVBQUU7QUFBUixPQUFQO0FBQ0gsS0FGRDtBQUdBLFVBQU1DLGFBQWEsR0FBRyxFQUF0QjtBQUNBLEtBQUMsZ0JBQUQsRUFBbUIsVUFBbkIsRUFBK0IsTUFBL0IsRUFBdUMsV0FBdkMsRUFBb0QsT0FBcEQsRUFBNkQsaUJBQTdELEVBQ0tZLE9BREwsQ0FDYWxCLENBQUMsSUFBSTtBQUNkTSxNQUFBQSxhQUFhLENBQUNhLElBQWQsQ0FBbUJuQixDQUFuQjtBQUNBTSxNQUFBQSxhQUFhLENBQUNhLElBQWQsQ0FBbUJoRCxJQUFJLENBQUM0QixJQUFMLENBQVVpQixPQUFWLEVBQW1CaEIsQ0FBbkIsQ0FBbkI7QUFDSCxLQUpEO0FBS0FNLElBQUFBLGFBQWEsQ0FBQ2EsSUFBZCxDQUFtQmhELElBQUksQ0FBQzRCLElBQUwsQ0FBVWlCLE9BQVYsRUFBbUIsVUFBbkIsRUFBK0IsS0FBL0IsQ0FBbkI7QUFDQVYsSUFBQUEsYUFBYSxDQUFDYSxJQUFkLENBQW1CaEQsSUFBSSxDQUFDNEIsSUFBTCxDQUFVaUIsT0FBVixFQUFtQixRQUFuQixFQUE2QixLQUE3QixDQUFuQjtBQUNBLFVBQU1OLEtBQUssR0FBRzdCLGdCQUFnQixDQUFDOEIsY0FBakIsRUFBZDtBQUNBMUMsSUFBQUEsTUFBTSxDQUFDMkMsTUFBUCxDQUFjRixLQUFkLEVBQXFCRyxFQUFyQixDQUF3QkMsSUFBeEIsQ0FBNkJDLEtBQTdCLENBQW1DVCxhQUFuQztBQUNILEdBcEI2RSxDQUExRSxDQUFKO0FBcUJBVixFQUFBQSxJQUFJLENBQUMsd0VBQUQsRUFBMkUsTUFBTWhELFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDOUgsVUFBTW9FLE9BQU8sR0FBRyxvQkFBaEI7QUFDQSxVQUFNbkIsYUFBYSxHQUFHLEdBQXRCO0FBQ0EsVUFBTUMsY0FBYyxHQUFHLENBQUMzQixJQUFJLENBQUM0QixJQUFMLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsQ0FBRCxFQUEyQixFQUEzQixFQUErQjVCLElBQUksQ0FBQzRCLElBQUwsQ0FBVSxHQUFWLEVBQWUsR0FBZixDQUEvQixFQUFvRCxHQUFwRCxDQUF2QjtBQUNBbkIsSUFBQUEsU0FBUyxDQUFDRSxLQUFWLENBQWdCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFNBQXZCLEVBQWtDVixPQUFsQyxDQUEwQyxNQUFNTSxhQUFoRDtBQUNBakIsSUFBQUEsU0FBUyxDQUFDRSxLQUFWLENBQWdCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNpQixJQUF2QixFQUE2QjFCLE9BQTdCLENBQXFDLE1BQU15QixPQUEzQztBQUNBckMsSUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmtCLENBQUMsSUFBSUEsQ0FBQyxDQUFDRSxTQUE3QixFQUF3Q1gsT0FBeEMsQ0FBZ0QsTUFBTSxLQUF0RDtBQUNBWixJQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNHLGdCQUE3QixFQUErQ1osT0FBL0MsQ0FBdUQsTUFBTSxNQUE3RDtBQUNBYixJQUFBQSxjQUFjLENBQUNJLEtBQWYsQ0FBcUJrQixDQUFDLElBQUlBLENBQUMsQ0FBQ0ksR0FBNUIsRUFBaUNiLE9BQWpDLENBQXlDLE1BQU07QUFDM0MsYUFBTztBQUFFYyxRQUFBQSxJQUFJLEVBQUVQLGNBQWMsQ0FBQ0MsSUFBZixDQUFvQkYsYUFBcEI7QUFBUixPQUFQO0FBQ0gsS0FGRDtBQUdBLFVBQU1TLGFBQWEsR0FBRyxDQUFDLEdBQUdSLGNBQUosRUFBb0JTLE1BQXBCLENBQTJCQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsTUFBTCxHQUFjLENBQWpELENBQXRCO0FBQ0EsS0FBQyxnQkFBRCxFQUFtQixVQUFuQixFQUErQixNQUEvQixFQUF1QyxXQUF2QyxFQUFvRCxPQUFwRCxFQUE2RCxpQkFBN0QsRUFDS1MsT0FETCxDQUNhbEIsQ0FBQyxJQUFJO0FBQ2RNLE1BQUFBLGFBQWEsQ0FBQ2EsSUFBZCxDQUFtQm5CLENBQW5CO0FBQ0FNLE1BQUFBLGFBQWEsQ0FBQ2EsSUFBZCxDQUFtQmhELElBQUksQ0FBQzRCLElBQUwsQ0FBVWlCLE9BQVYsRUFBbUJoQixDQUFuQixDQUFuQjtBQUNILEtBSkQ7QUFLQU0sSUFBQUEsYUFBYSxDQUFDYSxJQUFkLENBQW1CaEQsSUFBSSxDQUFDNEIsSUFBTCxDQUFVaUIsT0FBVixFQUFtQixVQUFuQixFQUErQixLQUEvQixDQUFuQjtBQUNBVixJQUFBQSxhQUFhLENBQUNhLElBQWQsQ0FBbUJoRCxJQUFJLENBQUM0QixJQUFMLENBQVVpQixPQUFWLEVBQW1CLFFBQW5CLEVBQTZCLEtBQTdCLENBQW5CO0FBQ0EsVUFBTU4sS0FBSyxHQUFHN0IsZ0JBQWdCLENBQUM4QixjQUFqQixFQUFkO0FBQ0ExQyxJQUFBQSxNQUFNLENBQUMyQyxNQUFQLENBQWNGLEtBQWQsRUFBcUJHLEVBQXJCLENBQXdCQyxJQUF4QixDQUE2QkMsS0FBN0IsQ0FBbUNULGFBQW5DO0FBQ0gsR0FyQjZGLENBQTFGLENBQUo7QUFzQkgsQ0F4RUksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtZnVuYy1ib2R5LWxlbmd0aCBuby1hbnlcclxuY29uc3QgY2hhaV8xID0gcmVxdWlyZShcImNoYWlcIik7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3QgVHlwZU1vcSA9IHJlcXVpcmUoXCJ0eXBlbW9xXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vcGxhdGZvcm0vdHlwZXNcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgS25vd25QYXRoc1NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvaW50ZXJwcmV0ZXIvbG9jYXRvcnMvc2VydmljZXMvS25vd25QYXRoc1NlcnZpY2VcIik7XHJcbnN1aXRlKCdJbnRlcnByZXRlcnMgS25vd24gUGF0aHMnLCAoKSA9PiB7XHJcbiAgICBsZXQgc2VydmljZUNvbnRhaW5lcjtcclxuICAgIGxldCBjdXJyZW50UHJvY2VzcztcclxuICAgIGxldCBwbGF0Zm9ybVNlcnZpY2U7XHJcbiAgICBsZXQgcGF0aFV0aWxzO1xyXG4gICAgbGV0IGtub3duU2VhcmNoUGF0aHM7XHJcbiAgICBzZXR1cCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgc2VydmljZUNvbnRhaW5lciA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBjdXJyZW50UHJvY2VzcyA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBwbGF0Zm9ybVNlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgcGF0aFV0aWxzID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgIHNlcnZpY2VDb250YWluZXIuc2V0dXAoYyA9PiBjLmdldChUeXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMi5JQ3VycmVudFByb2Nlc3MpLCBUeXBlTW9xLkl0LmlzQW55KCkpKS5yZXR1cm5zKCgpID0+IGN1cnJlbnRQcm9jZXNzLm9iamVjdCk7XHJcbiAgICAgICAgc2VydmljZUNvbnRhaW5lci5zZXR1cChjID0+IGMuZ2V0KFR5cGVNb3EuSXQuaXNWYWx1ZSh0eXBlc18xLklQbGF0Zm9ybVNlcnZpY2UpLCBUeXBlTW9xLkl0LmlzQW55KCkpKS5yZXR1cm5zKCgpID0+IHBsYXRmb3JtU2VydmljZS5vYmplY3QpO1xyXG4gICAgICAgIHNlcnZpY2VDb250YWluZXIuc2V0dXAoYyA9PiBjLmdldChUeXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMi5JUGF0aFV0aWxzKSwgVHlwZU1vcS5JdC5pc0FueSgpKSkucmV0dXJucygoKSA9PiBwYXRoVXRpbHMub2JqZWN0KTtcclxuICAgICAgICBrbm93blNlYXJjaFBhdGhzID0gbmV3IEtub3duUGF0aHNTZXJ2aWNlXzEuS25vd25TZWFyY2hQYXRoc0ZvckludGVycHJldGVycyhzZXJ2aWNlQ29udGFpbmVyLm9iamVjdCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdFbnN1cmUga25vd24gbGlzdCBvZiBwYXRocyBhcmUgcmV0dXJuZWQnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aERlbGltaXRlciA9ICdYJztcclxuICAgICAgICBjb25zdCBwYXRoc0luUEFUSFZhciA9IFtwYXRoLmpvaW4oJ2EnLCAnYicsICdjJyksICcnLCBwYXRoLmpvaW4oJzEnLCAnMicpLCAnMyddO1xyXG4gICAgICAgIHBhdGhVdGlscy5zZXR1cChwID0+IHAuZGVsaW1pdGVyKS5yZXR1cm5zKCgpID0+IHBhdGhEZWxpbWl0ZXIpO1xyXG4gICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cChwID0+IHAuaXNXaW5kb3dzKS5yZXR1cm5zKCgpID0+IHRydWUpO1xyXG4gICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cChwID0+IHAucGF0aFZhcmlhYmxlTmFtZSkucmV0dXJucygoKSA9PiAnUEFUSCcpO1xyXG4gICAgICAgIGN1cnJlbnRQcm9jZXNzLnNldHVwKHAgPT4gcC5lbnYpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4geyBQQVRIOiBwYXRoc0luUEFUSFZhci5qb2luKHBhdGhEZWxpbWl0ZXIpIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRQYXRocyA9IFsuLi5wYXRoc0luUEFUSFZhcl0uZmlsdGVyKGl0ZW0gPT4gaXRlbS5sZW5ndGggPiAwKTtcclxuICAgICAgICBjb25zdCBwYXRocyA9IGtub3duU2VhcmNoUGF0aHMuZ2V0U2VhcmNoUGF0aHMoKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHBhdGhzKS50by5kZWVwLmVxdWFsKGV4cGVjdGVkUGF0aHMpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRW5zdXJlIGtub3duIGxpc3Qgb2YgcGF0aHMgYXJlIHJldHVybmVkIG9uIG5vbi13aW5kb3dzJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGhvbWVEaXIgPSAnL3VzZXJzL3BldGVyIFNtaXRoJztcclxuICAgICAgICBjb25zdCBwYXRoRGVsaW1pdGVyID0gJ1gnO1xyXG4gICAgICAgIHBhdGhVdGlscy5zZXR1cChwID0+IHAuZGVsaW1pdGVyKS5yZXR1cm5zKCgpID0+IHBhdGhEZWxpbWl0ZXIpO1xyXG4gICAgICAgIHBhdGhVdGlscy5zZXR1cChwID0+IHAuaG9tZSkucmV0dXJucygoKSA9PiBob21lRGlyKTtcclxuICAgICAgICBwbGF0Zm9ybVNlcnZpY2Uuc2V0dXAocCA9PiBwLmlzV2luZG93cykucmV0dXJucygoKSA9PiBmYWxzZSk7XHJcbiAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHAgPT4gcC5wYXRoVmFyaWFibGVOYW1lKS5yZXR1cm5zKCgpID0+ICdQQVRIJyk7XHJcbiAgICAgICAgY3VycmVudFByb2Nlc3Muc2V0dXAocCA9PiBwLmVudikucmV0dXJucygoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IFBBVEg6ICcnIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRQYXRocyA9IFtdO1xyXG4gICAgICAgIFsnL3Vzci9sb2NhbC9iaW4nLCAnL3Vzci9iaW4nLCAnL2JpbicsICcvdXNyL3NiaW4nLCAnL3NiaW4nLCAnL3Vzci9sb2NhbC9zYmluJ11cclxuICAgICAgICAgICAgLmZvckVhY2gocCA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkUGF0aHMucHVzaChwKTtcclxuICAgICAgICAgICAgZXhwZWN0ZWRQYXRocy5wdXNoKHBhdGguam9pbihob21lRGlyLCBwKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0ZWRQYXRocy5wdXNoKHBhdGguam9pbihob21lRGlyLCAnYW5hY29uZGEnLCAnYmluJykpO1xyXG4gICAgICAgIGV4cGVjdGVkUGF0aHMucHVzaChwYXRoLmpvaW4oaG9tZURpciwgJ3B5dGhvbicsICdiaW4nKSk7XHJcbiAgICAgICAgY29uc3QgcGF0aHMgPSBrbm93blNlYXJjaFBhdGhzLmdldFNlYXJjaFBhdGhzKCk7XHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChwYXRocykudG8uZGVlcC5lcXVhbChleHBlY3RlZFBhdGhzKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBQQVRIIHZhcmlhYmxlIGFuZCBrbm93biBsaXN0IG9mIHBhdGhzIGFyZSBtZXJnZWQgb24gbm9uLXdpbmRvd3MnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgaG9tZURpciA9ICcvdXNlcnMvcGV0ZXIgU21pdGgnO1xyXG4gICAgICAgIGNvbnN0IHBhdGhEZWxpbWl0ZXIgPSAnWCc7XHJcbiAgICAgICAgY29uc3QgcGF0aHNJblBBVEhWYXIgPSBbcGF0aC5qb2luKCdhJywgJ2InLCAnYycpLCAnJywgcGF0aC5qb2luKCcxJywgJzInKSwgJzMnXTtcclxuICAgICAgICBwYXRoVXRpbHMuc2V0dXAocCA9PiBwLmRlbGltaXRlcikucmV0dXJucygoKSA9PiBwYXRoRGVsaW1pdGVyKTtcclxuICAgICAgICBwYXRoVXRpbHMuc2V0dXAocCA9PiBwLmhvbWUpLnJldHVybnMoKCkgPT4gaG9tZURpcik7XHJcbiAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHAgPT4gcC5pc1dpbmRvd3MpLnJldHVybnMoKCkgPT4gZmFsc2UpO1xyXG4gICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cChwID0+IHAucGF0aFZhcmlhYmxlTmFtZSkucmV0dXJucygoKSA9PiAnUEFUSCcpO1xyXG4gICAgICAgIGN1cnJlbnRQcm9jZXNzLnNldHVwKHAgPT4gcC5lbnYpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4geyBQQVRIOiBwYXRoc0luUEFUSFZhci5qb2luKHBhdGhEZWxpbWl0ZXIpIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRQYXRocyA9IFsuLi5wYXRoc0luUEFUSFZhcl0uZmlsdGVyKGl0ZW0gPT4gaXRlbS5sZW5ndGggPiAwKTtcclxuICAgICAgICBbJy91c3IvbG9jYWwvYmluJywgJy91c3IvYmluJywgJy9iaW4nLCAnL3Vzci9zYmluJywgJy9zYmluJywgJy91c3IvbG9jYWwvc2JpbiddXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3RlZFBhdGhzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkUGF0aHMucHVzaChwYXRoLmpvaW4oaG9tZURpciwgcCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGV4cGVjdGVkUGF0aHMucHVzaChwYXRoLmpvaW4oaG9tZURpciwgJ2FuYWNvbmRhJywgJ2JpbicpKTtcclxuICAgICAgICBleHBlY3RlZFBhdGhzLnB1c2gocGF0aC5qb2luKGhvbWVEaXIsICdweXRob24nLCAnYmluJykpO1xyXG4gICAgICAgIGNvbnN0IHBhdGhzID0ga25vd25TZWFyY2hQYXRocy5nZXRTZWFyY2hQYXRocygpO1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3QocGF0aHMpLnRvLmRlZXAuZXF1YWwoZXhwZWN0ZWRQYXRocyk7XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1rbm93blBhdGhTZXJ2aWNlLnVuaXQudGVzdC5qcy5tYXAiXX0=