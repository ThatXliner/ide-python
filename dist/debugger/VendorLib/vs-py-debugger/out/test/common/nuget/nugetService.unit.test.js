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

const chai_1 = require("chai");

const semver_1 = require("semver");

const nugetService_1 = require("../../../client/common/nuget/nugetService");

suite('Nuget Service', () => {
  test('Identifying release versions', () => __awaiter(void 0, void 0, void 0, function* () {
    const service = new nugetService_1.NugetService();
    chai_1.expect(service.isReleaseVersion(semver_1.parse('0.1.1'))).to.be.equal(true, 'incorrect');
    chai_1.expect(service.isReleaseVersion(semver_1.parse('0.1.1-1'))).to.be.equal(false, 'incorrect');
    chai_1.expect(service.isReleaseVersion(semver_1.parse('0.1.1-release'))).to.be.equal(false, 'incorrect');
    chai_1.expect(service.isReleaseVersion(semver_1.parse('0.1.1-preview'))).to.be.equal(false, 'incorrect');
  }));
  test('Get package version', () => __awaiter(void 0, void 0, void 0, function* () {
    const service = new nugetService_1.NugetService();
    chai_1.expect(service.getVersionFromPackageFileName('Something-xyz.0.0.1.nupkg').compare(semver_1.parse('0.0.1'))).to.equal(0, 'incorrect');
    chai_1.expect(service.getVersionFromPackageFileName('Something-xyz.0.0.1.1234.nupkg').compare(semver_1.parse('0.0.1-1234'))).to.equal(0, 'incorrect');
    chai_1.expect(service.getVersionFromPackageFileName('Something-xyz.0.0.1-preview.nupkg').compare(semver_1.parse('0.0.1-preview'))).to.equal(0, 'incorrect');
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm51Z2V0U2VydmljZS51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImNoYWlfMSIsInJlcXVpcmUiLCJzZW12ZXJfMSIsIm51Z2V0U2VydmljZV8xIiwic3VpdGUiLCJ0ZXN0Iiwic2VydmljZSIsIk51Z2V0U2VydmljZSIsImV4cGVjdCIsImlzUmVsZWFzZVZlcnNpb24iLCJwYXJzZSIsInRvIiwiYmUiLCJlcXVhbCIsImdldFZlcnNpb25Gcm9tUGFja2FnZUZpbGVOYW1lIiwiY29tcGFyZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFNBQVMsR0FBSSxVQUFRLFNBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztBQUNyRixTQUFPLEtBQUtELENBQUMsS0FBS0EsQ0FBQyxHQUFHRSxPQUFULENBQU4sRUFBeUIsVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDdkQsYUFBU0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDTyxJQUFWLENBQWVGLEtBQWYsQ0FBRCxDQUFKO0FBQThCLE9BQXBDLENBQXFDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzNGLGFBQVNDLFFBQVQsQ0FBa0JKLEtBQWxCLEVBQXlCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJ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QUFDUSxLQUFULENBQWUsT0FBZixDQUEzRSxDQUFkLEVBQW1IQyxFQUFuSCxDQUFzSEUsS0FBdEgsQ0FBNEgsQ0FBNUgsRUFBK0gsV0FBL0g7QUFDQWIsSUFBQUEsTUFBTSxDQUFDUSxNQUFQLENBQWNGLE9BQU8sQ0FBQ1EsNkJBQVIsQ0FBc0MsZ0NBQXRDLEVBQXdFQyxPQUF4RSxDQUFnRmIsUUFBUSxDQUFDUSxLQUFULENBQWUsWUFBZixDQUFoRixDQUFkLEVBQTZIQyxFQUE3SCxDQUFnSUUsS0FBaEksQ0FBc0ksQ0FBdEksRUFBeUksV0FBekk7QUFDQWIsSUFBQUEsTUFBTSxDQUFDUSxNQUFQLENBQWNGLE9BQU8sQ0FBQ1EsNkJBQVIsQ0FBc0MsbUNBQXRDLEVBQTJFQyxPQUEzRSxDQUFtRmIsUUFBUSxDQUFDUSxLQUFULENBQWUsZUFBZixDQUFuRixDQUFkLEVBQW1JQyxFQUFuSSxDQUFzSUUsS0FBdEksQ0FBNEksQ0FBNUksRUFBK0ksV0FBL0k7QUFDSCxHQUwwQyxDQUF2QyxDQUFKO0FBTUgsQ0FkSSxDQUFMIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBzZW12ZXJfMSA9IHJlcXVpcmUoXCJzZW12ZXJcIik7XHJcbmNvbnN0IG51Z2V0U2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vbnVnZXQvbnVnZXRTZXJ2aWNlXCIpO1xyXG5zdWl0ZSgnTnVnZXQgU2VydmljZScsICgpID0+IHtcclxuICAgIHRlc3QoJ0lkZW50aWZ5aW5nIHJlbGVhc2UgdmVyc2lvbnMnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBudWdldFNlcnZpY2VfMS5OdWdldFNlcnZpY2UoKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNlcnZpY2UuaXNSZWxlYXNlVmVyc2lvbihzZW12ZXJfMS5wYXJzZSgnMC4xLjEnKSkpLnRvLmJlLmVxdWFsKHRydWUsICdpbmNvcnJlY3QnKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNlcnZpY2UuaXNSZWxlYXNlVmVyc2lvbihzZW12ZXJfMS5wYXJzZSgnMC4xLjEtMScpKSkudG8uYmUuZXF1YWwoZmFsc2UsICdpbmNvcnJlY3QnKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNlcnZpY2UuaXNSZWxlYXNlVmVyc2lvbihzZW12ZXJfMS5wYXJzZSgnMC4xLjEtcmVsZWFzZScpKSkudG8uYmUuZXF1YWwoZmFsc2UsICdpbmNvcnJlY3QnKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNlcnZpY2UuaXNSZWxlYXNlVmVyc2lvbihzZW12ZXJfMS5wYXJzZSgnMC4xLjEtcHJldmlldycpKSkudG8uYmUuZXF1YWwoZmFsc2UsICdpbmNvcnJlY3QnKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0dldCBwYWNrYWdlIHZlcnNpb24nLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBudWdldFNlcnZpY2VfMS5OdWdldFNlcnZpY2UoKTtcclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHNlcnZpY2UuZ2V0VmVyc2lvbkZyb21QYWNrYWdlRmlsZU5hbWUoJ1NvbWV0aGluZy14eXouMC4wLjEubnVwa2cnKS5jb21wYXJlKHNlbXZlcl8xLnBhcnNlKCcwLjAuMScpKSkudG8uZXF1YWwoMCwgJ2luY29ycmVjdCcpO1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3Qoc2VydmljZS5nZXRWZXJzaW9uRnJvbVBhY2thZ2VGaWxlTmFtZSgnU29tZXRoaW5nLXh5ei4wLjAuMS4xMjM0Lm51cGtnJykuY29tcGFyZShzZW12ZXJfMS5wYXJzZSgnMC4wLjEtMTIzNCcpKSkudG8uZXF1YWwoMCwgJ2luY29ycmVjdCcpO1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3Qoc2VydmljZS5nZXRWZXJzaW9uRnJvbVBhY2thZ2VGaWxlTmFtZSgnU29tZXRoaW5nLXh5ei4wLjAuMS1wcmV2aWV3Lm51cGtnJykuY29tcGFyZShzZW12ZXJfMS5wYXJzZSgnMC4wLjEtcHJldmlldycpKSkudG8uZXF1YWwoMCwgJ2luY29ycmVjdCcpO1xyXG4gICAgfSkpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVnZXRTZXJ2aWNlLnVuaXQudGVzdC5qcy5tYXAiXX0=