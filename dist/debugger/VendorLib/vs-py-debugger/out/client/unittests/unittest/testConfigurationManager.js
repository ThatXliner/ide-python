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

const types_1 = require("../../common/types");

const testConfigurationManager_1 = require("../common/managers/testConfigurationManager");

class ConfigurationManager extends testConfigurationManager_1.TestConfigurationManager {
  constructor(workspace, serviceContainer) {
    super(workspace, types_1.Product.unittest, serviceContainer);
  }

  requiresUserToConfigure(_wkspace) {
    return __awaiter(this, void 0, void 0, function* () {
      return true;
    });
  }

  configure(wkspace) {
    return __awaiter(this, void 0, void 0, function* () {
      const args = ['-v'];
      const subDirs = yield this.getTestDirs(wkspace.fsPath);
      const testDir = yield this.selectTestDir(wkspace.fsPath, subDirs);
      args.push('-s');

      if (typeof testDir === 'string' && testDir !== '.') {
        args.push(`./${testDir}`);
      } else {
        args.push('.');
      }

      const testfilePattern = yield this.selectTestFilePattern();
      args.push('-p');

      if (typeof testfilePattern === 'string') {
        args.push(testfilePattern);
      } else {
        args.push('test*.py');
      }

      yield this.testConfigSettingsService.updateTestArgs(wkspace.fsPath, types_1.Product.unittest, args);
    });
  }

}

exports.ConfigurationManager = ConfigurationManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RDb25maWd1cmF0aW9uTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidHlwZXNfMSIsInJlcXVpcmUiLCJ0ZXN0Q29uZmlndXJhdGlvbk1hbmFnZXJfMSIsIkNvbmZpZ3VyYXRpb25NYW5hZ2VyIiwiVGVzdENvbmZpZ3VyYXRpb25NYW5hZ2VyIiwiY29uc3RydWN0b3IiLCJ3b3Jrc3BhY2UiLCJzZXJ2aWNlQ29udGFpbmVyIiwiUHJvZHVjdCIsInVuaXR0ZXN0IiwicmVxdWlyZXNVc2VyVG9Db25maWd1cmUiLCJfd2tzcGFjZSIsImNvbmZpZ3VyZSIsIndrc3BhY2UiLCJhcmdzIiwic3ViRGlycyIsImdldFRlc3REaXJzIiwiZnNQYXRoIiwidGVzdERpciIsInNlbGVjdFRlc3REaXIiLCJwdXNoIiwidGVzdGZpbGVQYXR0ZXJuIiwic2VsZWN0VGVzdEZpbGVQYXR0ZXJuIiwidGVzdENvbmZpZ1NldHRpbmdzU2VydmljZSIsInVwZGF0ZVRlc3RBcmdzIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxR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T0FBT0MsZUFBUCxLQUEyQixRQUEvQixFQUF5QztBQUNyQ1AsUUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVVDLGVBQVY7QUFDSCxPQUZELE1BR0s7QUFDRFAsUUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVUsVUFBVjtBQUNIOztBQUNELFlBQU0sS0FBS0cseUJBQUwsQ0FBK0JDLGNBQS9CLENBQThDWCxPQUFPLENBQUNJLE1BQXRELEVBQThEakIsT0FBTyxDQUFDUSxPQUFSLENBQWdCQyxRQUE5RSxFQUF3RkssSUFBeEYsQ0FBTjtBQUNILEtBcEJlLENBQWhCO0FBcUJIOztBQS9Ca0Y7O0FBaUN2RmYsT0FBTyxDQUFDSSxvQkFBUixHQUErQkEsb0JBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IHRlc3RDb25maWd1cmF0aW9uTWFuYWdlcl8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi9tYW5hZ2Vycy90ZXN0Q29uZmlndXJhdGlvbk1hbmFnZXJcIik7XHJcbmNsYXNzIENvbmZpZ3VyYXRpb25NYW5hZ2VyIGV4dGVuZHMgdGVzdENvbmZpZ3VyYXRpb25NYW5hZ2VyXzEuVGVzdENvbmZpZ3VyYXRpb25NYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHdvcmtzcGFjZSwgc2VydmljZUNvbnRhaW5lcikge1xyXG4gICAgICAgIHN1cGVyKHdvcmtzcGFjZSwgdHlwZXNfMS5Qcm9kdWN0LnVuaXR0ZXN0LCBzZXJ2aWNlQ29udGFpbmVyKTtcclxuICAgIH1cclxuICAgIHJlcXVpcmVzVXNlclRvQ29uZmlndXJlKF93a3NwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25maWd1cmUod2tzcGFjZSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBbJy12J107XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YkRpcnMgPSB5aWVsZCB0aGlzLmdldFRlc3REaXJzKHdrc3BhY2UuZnNQYXRoKTtcclxuICAgICAgICAgICAgY29uc3QgdGVzdERpciA9IHlpZWxkIHRoaXMuc2VsZWN0VGVzdERpcih3a3NwYWNlLmZzUGF0aCwgc3ViRGlycyk7XHJcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnLXMnKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZXN0RGlyID09PSAnc3RyaW5nJyAmJiB0ZXN0RGlyICE9PSAnLicpIHtcclxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChgLi8ke3Rlc3REaXJ9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goJy4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB0ZXN0ZmlsZVBhdHRlcm4gPSB5aWVsZCB0aGlzLnNlbGVjdFRlc3RGaWxlUGF0dGVybigpO1xyXG4gICAgICAgICAgICBhcmdzLnB1c2goJy1wJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGVzdGZpbGVQYXR0ZXJuID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHRlc3RmaWxlUGF0dGVybik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goJ3Rlc3QqLnB5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeWllbGQgdGhpcy50ZXN0Q29uZmlnU2V0dGluZ3NTZXJ2aWNlLnVwZGF0ZVRlc3RBcmdzKHdrc3BhY2UuZnNQYXRoLCB0eXBlc18xLlByb2R1Y3QudW5pdHRlc3QsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQ29uZmlndXJhdGlvbk1hbmFnZXIgPSBDb25maWd1cmF0aW9uTWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGVzdENvbmZpZ3VyYXRpb25NYW5hZ2VyLmpzLm1hcCJdfQ==