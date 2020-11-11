"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chai_1 = require("chai");

const vscode_1 = require("vscode");

const configSettings_1 = require("../../../client/common/configSettings");

const types_1 = require("../../../client/common/types");

const initialize_1 = require("../../initialize");

const serviceRegistry_1 = require("../../unittests/serviceRegistry"); // tslint:disable-next-line:max-func-body-length


suite('Configuration Service', () => {
  let ioc;
  suiteSetup(initialize_1.initialize);
  setup(() => {
    ioc = new serviceRegistry_1.UnitTestIocContainer();
    ioc.registerCommonTypes();
  });
  teardown(() => ioc.dispose());
  test('Ensure same instance of settings return', () => {
    const workspaceUri = vscode_1.workspace.workspaceFolders[0].uri;
    const settings = ioc.serviceContainer.get(types_1.IConfigurationService).getSettings(workspaceUri);
    const instanceIsSame = settings === configSettings_1.PythonSettings.getInstance(workspaceUri);
    chai_1.expect(instanceIsSame).to.be.equal(true, 'Incorrect settings');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UudGVzdC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImNoYWlfMSIsInJlcXVpcmUiLCJ2c2NvZGVfMSIsImNvbmZpZ1NldHRpbmdzXzEiLCJ0eXBlc18xIiwiaW5pdGlhbGl6ZV8xIiwic2VydmljZVJlZ2lzdHJ5XzEiLCJzdWl0ZSIsImlvYyIsInN1aXRlU2V0dXAiLCJpbml0aWFsaXplIiwic2V0dXAiLCJVbml0VGVzdElvY0NvbnRhaW5lciIsInJlZ2lzdGVyQ29tbW9uVHlwZXMiLCJ0ZWFyZG93biIsImRpc3Bvc2UiLCJ0ZXN0Iiwid29ya3NwYWNlVXJpIiwid29ya3NwYWNlIiwid29ya3NwYWNlRm9sZGVycyIsInVyaSIsInNldHRpbmdzIiwic2VydmljZUNvbnRhaW5lciIsImdldCIsIklDb25maWd1cmF0aW9uU2VydmljZSIsImdldFNldHRpbmdzIiwiaW5zdGFuY2VJc1NhbWUiLCJQeXRob25TZXR0aW5ncyIsImdldEluc3RhbmNlIiwiZXhwZWN0IiwidG8iLCJiZSIsImVxdWFsIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNQyxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQXRCOztBQUNBLE1BQU1DLFFBQVEsR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBeEI7O0FBQ0EsTUFBTUUsZ0JBQWdCLEdBQUdGLE9BQU8sQ0FBQyx1Q0FBRCxDQUFoQzs7QUFDQSxNQUFNRyxPQUFPLEdBQUdILE9BQU8sQ0FBQyw4QkFBRCxDQUF2Qjs7QUFDQSxNQUFNSSxZQUFZLEdBQUdKLE9BQU8sQ0FBQyxrQkFBRCxDQUE1Qjs7QUFDQSxNQUFNSyxpQkFBaUIsR0FBR0wsT0FBTyxDQUFDLGlDQUFELENBQWpDLEMsQ0FDQTs7O0FBQ0FNLEtBQUssQ0FBQyx1QkFBRCxFQUEwQixNQUFNO0FBQ2pDLE1BQUlDLEdBQUo7QUFDQUMsRUFBQUEsVUFBVSxDQUFDSixZQUFZLENBQUNLLFVBQWQsQ0FBVjtBQUNBQyxFQUFBQSxLQUFLLENBQUMsTUFBTTtBQUNSSCxJQUFBQSxHQUFHLEdBQUcsSUFBSUYsaUJBQWlCLENBQUNNLG9CQUF0QixFQUFOO0FBQ0FKLElBQUFBLEdBQUcsQ0FBQ0ssbUJBQUo7QUFDSCxHQUhJLENBQUw7QUFJQUMsRUFBQUEsUUFBUSxDQUFDLE1BQU1OLEdBQUcsQ0FBQ08sT0FBSixFQUFQLENBQVI7QUFDQUMsRUFBQUEsSUFBSSxDQUFDLHlDQUFELEVBQTRDLE1BQU07QUFDbEQsVUFBTUMsWUFBWSxHQUFHZixRQUFRLENBQUNnQixTQUFULENBQW1CQyxnQkFBbkIsQ0FBb0MsQ0FBcEMsRUFBdUNDLEdBQTVEO0FBQ0EsVUFBTUMsUUFBUSxHQUFHYixHQUFHLENBQUNjLGdCQUFKLENBQXFCQyxHQUFyQixDQUF5Qm5CLE9BQU8sQ0FBQ29CLHFCQUFqQyxFQUF3REMsV0FBeEQsQ0FBb0VSLFlBQXBFLENBQWpCO0FBQ0EsVUFBTVMsY0FBYyxHQUFHTCxRQUFRLEtBQUtsQixnQkFBZ0IsQ0FBQ3dCLGNBQWpCLENBQWdDQyxXQUFoQyxDQUE0Q1gsWUFBNUMsQ0FBcEM7QUFDQWpCLElBQUFBLE1BQU0sQ0FBQzZCLE1BQVAsQ0FBY0gsY0FBZCxFQUE4QkksRUFBOUIsQ0FBaUNDLEVBQWpDLENBQW9DQyxLQUFwQyxDQUEwQyxJQUExQyxFQUFnRCxvQkFBaEQ7QUFDSCxHQUxHLENBQUo7QUFNSCxDQWRJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBjaGFpXzEgPSByZXF1aXJlKFwiY2hhaVwiKTtcclxuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xyXG5jb25zdCBjb25maWdTZXR0aW5nc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vY29uZmlnU2V0dGluZ3NcIik7XHJcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2xpZW50L2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgaW5pdGlhbGl6ZV8xID0gcmVxdWlyZShcIi4uLy4uL2luaXRpYWxpemVcIik7XHJcbmNvbnN0IHNlcnZpY2VSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4uLy4uL3VuaXR0ZXN0cy9zZXJ2aWNlUmVnaXN0cnlcIik7XHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtZnVuYy1ib2R5LWxlbmd0aFxyXG5zdWl0ZSgnQ29uZmlndXJhdGlvbiBTZXJ2aWNlJywgKCkgPT4ge1xyXG4gICAgbGV0IGlvYztcclxuICAgIHN1aXRlU2V0dXAoaW5pdGlhbGl6ZV8xLmluaXRpYWxpemUpO1xyXG4gICAgc2V0dXAoKCkgPT4ge1xyXG4gICAgICAgIGlvYyA9IG5ldyBzZXJ2aWNlUmVnaXN0cnlfMS5Vbml0VGVzdElvY0NvbnRhaW5lcigpO1xyXG4gICAgICAgIGlvYy5yZWdpc3RlckNvbW1vblR5cGVzKCk7XHJcbiAgICB9KTtcclxuICAgIHRlYXJkb3duKCgpID0+IGlvYy5kaXNwb3NlKCkpO1xyXG4gICAgdGVzdCgnRW5zdXJlIHNhbWUgaW5zdGFuY2Ugb2Ygc2V0dGluZ3MgcmV0dXJuJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZVVyaSA9IHZzY29kZV8xLndvcmtzcGFjZS53b3Jrc3BhY2VGb2xkZXJzWzBdLnVyaTtcclxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGlvYy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklDb25maWd1cmF0aW9uU2VydmljZSkuZ2V0U2V0dGluZ3Mod29ya3NwYWNlVXJpKTtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZUlzU2FtZSA9IHNldHRpbmdzID09PSBjb25maWdTZXR0aW5nc18xLlB5dGhvblNldHRpbmdzLmdldEluc3RhbmNlKHdvcmtzcGFjZVVyaSk7XHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChpbnN0YW5jZUlzU2FtZSkudG8uYmUuZXF1YWwodHJ1ZSwgJ0luY29ycmVjdCBzZXR0aW5ncycpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXJ2aWNlLnRlc3QuanMubWFwIl19