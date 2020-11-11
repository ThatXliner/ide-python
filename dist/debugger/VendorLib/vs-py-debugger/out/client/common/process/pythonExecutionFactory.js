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

const types_1 = require("../../ioc/types");

const types_2 = require("../types");

const pythonProcess_1 = require("./pythonProcess");

const types_3 = require("./types");

let PythonExecutionFactory = class PythonExecutionFactory {
  constructor(serviceContainer) {
    this.serviceContainer = serviceContainer;
    this.processServiceFactory = serviceContainer.get(types_3.IProcessServiceFactory);
    this.configService = serviceContainer.get(types_2.IConfigurationService);
  }

  create(options) {
    return __awaiter(this, void 0, void 0, function* () {
      const pythonPath = options.pythonPath ? options.pythonPath : this.configService.getSettings(options.resource).pythonPath;
      const processService = yield this.processServiceFactory.create(options.resource);
      return new pythonProcess_1.PythonExecutionService(this.serviceContainer, processService, pythonPath);
    });
  }

};
PythonExecutionFactory = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer))], PythonExecutionFactory);
exports.PythonExecutionFactory = PythonExecutionFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInR5cGVzXzEiLCJ0eXBlc18yIiwicHl0aG9uUHJvY2Vzc18xIiwidHlwZXNfMyIsIlB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkiLCJjb25zdHJ1Y3RvciIsInNlcnZpY2VDb250YWluZXIiLCJwcm9jZXNzU2VydmljZUZhY3RvcnkiLCJnZXQiLCJJUHJvY2Vzc1NlcnZpY2VGYWN0b3J5IiwiY29uZmlnU2VydmljZSIsIklDb25maWd1cmF0aW9uU2VydmljZSIsImNyZWF0ZSIsIm9wdGlvbnMiLCJweXRob25QYXRoIiwiZ2V0U2V0dGluZ3MiLCJyZXNvdXJjZSIsInByb2Nlc3NTZXJ2aWNlIiwiUHl0aG9uRXhlY3V0aW9uU2VydmljZSIsImluamVjdGFibGUiLCJpbmplY3QiLCJJU2VydmljZUNvbnRhaW5lciJdLCJtYXBwaW5ncyI6IkFBQUEsYSxDQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsVUFBVSxHQUFJLFVBQVEsU0FBS0EsVUFBZCxJQUE2QixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FB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QUdELE9BQU8sQ0FBQ0MsVUFBUixHQUFxQkQsT0FBTyxDQUFDQyxVQUE3QixHQUEwQyxLQUFLSixhQUFMLENBQW1CSyxXQUFuQixDQUErQkYsT0FBTyxDQUFDRyxRQUF2QyxFQUFpREYsVUFBOUc7QUFDQSxZQUFNRyxjQUFjLEdBQUcsTUFBTSxLQUFLVixxQkFBTCxDQUEyQkssTUFBM0IsQ0FBa0NDLE9BQU8sQ0FBQ0csUUFBMUMsQ0FBN0I7QUFDQSxhQUFPLElBQUlkLGVBQWUsQ0FBQ2dCLHNCQUFwQixDQUEyQyxLQUFLWixnQkFBaEQsRUFBa0VXLGNBQWxFLEVBQWtGSCxVQUFsRixDQUFQO0FBQ0gsS0FKZSxDQUFoQjtBQUtIOztBQVpxRCxDQUExRDtBQWNBVixzQkFBc0IsR0FBRzVDLFVBQVUsQ0FBQyxDQUNoQ3NDLFdBQVcsQ0FBQ3FCLFVBQVosRUFEZ0MsRUFFaEMzQyxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDc0IsTUFBWixDQUFtQnBCLE9BQU8sQ0FBQ3FCLGlCQUEzQixDQUFKLENBRnlCLENBQUQsRUFHaENqQixzQkFIZ0MsQ0FBbkM7QUFJQVAsT0FBTyxDQUFDTyxzQkFBUixHQUFpQ0Esc0JBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vaW9jL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL3R5cGVzXCIpO1xyXG5jb25zdCBweXRob25Qcm9jZXNzXzEgPSByZXF1aXJlKFwiLi9weXRob25Qcm9jZXNzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XHJcbmxldCBQeXRob25FeGVjdXRpb25GYWN0b3J5ID0gY2xhc3MgUHl0aG9uRXhlY3V0aW9uRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlQ29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyID0gc2VydmljZUNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnByb2Nlc3NTZXJ2aWNlRmFjdG9yeSA9IHNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzMuSVByb2Nlc3NTZXJ2aWNlRmFjdG9yeSk7XHJcbiAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlID0gc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JQ29uZmlndXJhdGlvblNlcnZpY2UpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBweXRob25QYXRoID0gb3B0aW9ucy5weXRob25QYXRoID8gb3B0aW9ucy5weXRob25QYXRoIDogdGhpcy5jb25maWdTZXJ2aWNlLmdldFNldHRpbmdzKG9wdGlvbnMucmVzb3VyY2UpLnB5dGhvblBhdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NTZXJ2aWNlID0geWllbGQgdGhpcy5wcm9jZXNzU2VydmljZUZhY3RvcnkuY3JlYXRlKG9wdGlvbnMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IHB5dGhvblByb2Nlc3NfMS5QeXRob25FeGVjdXRpb25TZXJ2aWNlKHRoaXMuc2VydmljZUNvbnRhaW5lciwgcHJvY2Vzc1NlcnZpY2UsIHB5dGhvblBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5QeXRob25FeGVjdXRpb25GYWN0b3J5ID0gX19kZWNvcmF0ZShbXHJcbiAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXHJcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklTZXJ2aWNlQ29udGFpbmVyKSlcclxuXSwgUHl0aG9uRXhlY3V0aW9uRmFjdG9yeSk7XHJcbmV4cG9ydHMuUHl0aG9uRXhlY3V0aW9uRmFjdG9yeSA9IFB5dGhvbkV4ZWN1dGlvbkZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkuanMubWFwIl19