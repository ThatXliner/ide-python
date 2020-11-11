"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
}); // tslint:disable:no-unused-variable

const assert = require("assert");

const TypeMoq = require("typemoq");

const platformData_1 = require("../../client/activation/platformData");

const testDataWinMac = [{
  isWindows: true,
  is64Bit: true,
  expectedName: 'win-x64'
}, {
  isWindows: true,
  is64Bit: false,
  expectedName: 'win-x86'
}, {
  isWindows: false,
  is64Bit: true,
  expectedName: 'osx-x64'
}];
const testDataLinux = [{
  name: 'centos',
  expectedName: 'linux-x64'
}, {
  name: 'debian',
  expectedName: 'linux-x64'
}, {
  name: 'fedora',
  expectedName: 'linux-x64'
}, {
  name: 'ol',
  expectedName: 'linux-x64'
}, {
  name: 'opensuse',
  expectedName: 'linux-x64'
}, {
  name: 'rhel',
  expectedName: 'linux-x64'
}, {
  name: 'ubuntu',
  expectedName: 'linux-x64'
}];
const testDataModuleName = [{
  isWindows: true,
  isMac: false,
  isLinux: false,
  expectedName: platformData_1.PlatformLSExecutables.Windows
}, {
  isWindows: false,
  isMac: true,
  isLinux: false,
  expectedName: platformData_1.PlatformLSExecutables.MacOS
}, {
  isWindows: false,
  isMac: false,
  isLinux: true,
  expectedName: platformData_1.PlatformLSExecutables.Linux
}]; // tslint:disable-next-line:max-func-body-length

suite('Activation - platform data', () => {
  test('Name and hash (Windows/Mac)', () => __awaiter(void 0, void 0, void 0, function* () {
    for (const t of testDataWinMac) {
      const platformService = TypeMoq.Mock.ofType();
      platformService.setup(x => x.isWindows).returns(() => t.isWindows);
      platformService.setup(x => x.isMac).returns(() => !t.isWindows);
      platformService.setup(x => x.is64bit).returns(() => t.is64Bit);
      const fs = TypeMoq.Mock.ofType();
      const pd = new platformData_1.PlatformData(platformService.object, fs.object);
      const actual = yield pd.getPlatformName();
      assert.equal(actual, t.expectedName, `${actual} does not match ${t.expectedName}`);
      const actualHash = yield pd.getExpectedHash();
      assert.equal(actualHash, t.expectedName, `${actual} hash not match ${t.expectedName}`);
    }
  }));
  test('Name and hash (Linux)', () => __awaiter(void 0, void 0, void 0, function* () {
    for (const t of testDataLinux) {
      const platformService = TypeMoq.Mock.ofType();
      platformService.setup(x => x.isWindows).returns(() => false);
      platformService.setup(x => x.isMac).returns(() => false);
      platformService.setup(x => x.isLinux).returns(() => true);
      platformService.setup(x => x.is64bit).returns(() => true);
      const fs = TypeMoq.Mock.ofType();
      fs.setup(x => x.readFile(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(`NAME="name"\nID=${t.name}\nID_LIKE=debian`));
      const pd = new platformData_1.PlatformData(platformService.object, fs.object);
      const actual = yield pd.getPlatformName();
      assert.equal(actual, t.expectedName, `${actual} does not match ${t.expectedName}`);
      const actualHash = yield pd.getExpectedHash();
      assert.equal(actual, t.expectedName, `${actual} hash not match ${t.expectedName}`);
    }
  }));
  test('Module name', () => __awaiter(void 0, void 0, void 0, function* () {
    for (const t of testDataModuleName) {
      const platformService = TypeMoq.Mock.ofType();
      platformService.setup(x => x.isWindows).returns(() => t.isWindows);
      platformService.setup(x => x.isLinux).returns(() => t.isLinux);
      platformService.setup(x => x.isMac).returns(() => t.isMac);
      const fs = TypeMoq.Mock.ofType();
      const pd = new platformData_1.PlatformData(platformService.object, fs.object);
      const actual = pd.getEngineExecutableName();
      assert.equal(actual, t.expectedName, `${actual} does not match ${t.expectedName}`);
    }
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYXRmb3JtRGF0YS51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImFzc2VydCIsInJlcXVpcmUiLCJUeXBlTW9xIiwicGxhdGZvcm1EYXRhXzEiLCJ0ZXN0RGF0YVdpbk1hYyIsImlzV2luZG93cyIsImlzNjRCaXQiLCJleHBlY3RlZE5hbWUiLCJ0ZXN0RGF0YUxpbnV4IiwibmFtZSIsInRlc3REYXRhTW9kdWxlTmFtZSIsImlzTWFjIiwiaXNMaW51eCIsIlBsYXRmb3JtTFNFeGVjdXRhYmxlcyIsIldpbmRvd3MiLCJNYWNPUyIsIkxpbnV4Iiwic3VpdGUiLCJ0ZXN0IiwidCIsInBsYXRmb3JtU2VydmljZSIsIk1vY2siLCJvZlR5cGUiLCJzZXR1cCIsIngiLCJyZXR1cm5zIiwiaXM2NGJpdCIsImZzIiwicGQiLCJQbGF0Zm9ybURhdGEiLCJvYmplY3QiLCJhY3R1YWwiLCJnZXRQbGF0Zm9ybU5hbWUiLCJlcXVhbCIsImFjdHVhbEhhc2giLCJnZXRFeHBlY3RlZEhhc2giLCJyZWFkRmlsZSIsIkl0IiwiaXNBbnlTdHJpbmciLCJnZXRFbmdpbmVFeGVjdXRhYmxlTmFtZSJdLCJtYXBwaW5ncyI6IkFBQUEsYSxDQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFV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QUFiLEVBQXFCWixDQUFDLENBQUNaLFlBQXZCLEVBQXNDLEdBQUV3QixNQUFPLG1CQUFrQlosQ0FBQyxDQUFDWixZQUFhLEVBQWhGO0FBQ0g7QUFDSixHQVhrQyxDQUEvQixDQUFKO0FBWUgsQ0EzQ0ksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZVxyXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xyXG5jb25zdCBUeXBlTW9xID0gcmVxdWlyZShcInR5cGVtb3FcIik7XHJcbmNvbnN0IHBsYXRmb3JtRGF0YV8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9hY3RpdmF0aW9uL3BsYXRmb3JtRGF0YVwiKTtcclxuY29uc3QgdGVzdERhdGFXaW5NYWMgPSBbXHJcbiAgICB7IGlzV2luZG93czogdHJ1ZSwgaXM2NEJpdDogdHJ1ZSwgZXhwZWN0ZWROYW1lOiAnd2luLXg2NCcgfSxcclxuICAgIHsgaXNXaW5kb3dzOiB0cnVlLCBpczY0Qml0OiBmYWxzZSwgZXhwZWN0ZWROYW1lOiAnd2luLXg4NicgfSxcclxuICAgIHsgaXNXaW5kb3dzOiBmYWxzZSwgaXM2NEJpdDogdHJ1ZSwgZXhwZWN0ZWROYW1lOiAnb3N4LXg2NCcgfVxyXG5dO1xyXG5jb25zdCB0ZXN0RGF0YUxpbnV4ID0gW1xyXG4gICAgeyBuYW1lOiAnY2VudG9zJywgZXhwZWN0ZWROYW1lOiAnbGludXgteDY0JyB9LFxyXG4gICAgeyBuYW1lOiAnZGViaWFuJywgZXhwZWN0ZWROYW1lOiAnbGludXgteDY0JyB9LFxyXG4gICAgeyBuYW1lOiAnZmVkb3JhJywgZXhwZWN0ZWROYW1lOiAnbGludXgteDY0JyB9LFxyXG4gICAgeyBuYW1lOiAnb2wnLCBleHBlY3RlZE5hbWU6ICdsaW51eC14NjQnIH0sXHJcbiAgICB7IG5hbWU6ICdvcGVuc3VzZScsIGV4cGVjdGVkTmFtZTogJ2xpbnV4LXg2NCcgfSxcclxuICAgIHsgbmFtZTogJ3JoZWwnLCBleHBlY3RlZE5hbWU6ICdsaW51eC14NjQnIH0sXHJcbiAgICB7IG5hbWU6ICd1YnVudHUnLCBleHBlY3RlZE5hbWU6ICdsaW51eC14NjQnIH1cclxuXTtcclxuY29uc3QgdGVzdERhdGFNb2R1bGVOYW1lID0gW1xyXG4gICAgeyBpc1dpbmRvd3M6IHRydWUsIGlzTWFjOiBmYWxzZSwgaXNMaW51eDogZmFsc2UsIGV4cGVjdGVkTmFtZTogcGxhdGZvcm1EYXRhXzEuUGxhdGZvcm1MU0V4ZWN1dGFibGVzLldpbmRvd3MgfSxcclxuICAgIHsgaXNXaW5kb3dzOiBmYWxzZSwgaXNNYWM6IHRydWUsIGlzTGludXg6IGZhbHNlLCBleHBlY3RlZE5hbWU6IHBsYXRmb3JtRGF0YV8xLlBsYXRmb3JtTFNFeGVjdXRhYmxlcy5NYWNPUyB9LFxyXG4gICAgeyBpc1dpbmRvd3M6IGZhbHNlLCBpc01hYzogZmFsc2UsIGlzTGludXg6IHRydWUsIGV4cGVjdGVkTmFtZTogcGxhdGZvcm1EYXRhXzEuUGxhdGZvcm1MU0V4ZWN1dGFibGVzLkxpbnV4IH1cclxuXTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbnN1aXRlKCdBY3RpdmF0aW9uIC0gcGxhdGZvcm0gZGF0YScsICgpID0+IHtcclxuICAgIHRlc3QoJ05hbWUgYW5kIGhhc2ggKFdpbmRvd3MvTWFjKScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdGVzdERhdGFXaW5NYWMpIHtcclxuICAgICAgICAgICAgY29uc3QgcGxhdGZvcm1TZXJ2aWNlID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICBwbGF0Zm9ybVNlcnZpY2Uuc2V0dXAoeCA9PiB4LmlzV2luZG93cykucmV0dXJucygoKSA9PiB0LmlzV2luZG93cyk7XHJcbiAgICAgICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cCh4ID0+IHguaXNNYWMpLnJldHVybnMoKCkgPT4gIXQuaXNXaW5kb3dzKTtcclxuICAgICAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHggPT4geC5pczY0Yml0KS5yZXR1cm5zKCgpID0+IHQuaXM2NEJpdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZzID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBwZCA9IG5ldyBwbGF0Zm9ybURhdGFfMS5QbGF0Zm9ybURhdGEocGxhdGZvcm1TZXJ2aWNlLm9iamVjdCwgZnMub2JqZWN0KTtcclxuICAgICAgICAgICAgY29uc3QgYWN0dWFsID0geWllbGQgcGQuZ2V0UGxhdGZvcm1OYW1lKCk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChhY3R1YWwsIHQuZXhwZWN0ZWROYW1lLCBgJHthY3R1YWx9IGRvZXMgbm90IG1hdGNoICR7dC5leHBlY3RlZE5hbWV9YCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdHVhbEhhc2ggPSB5aWVsZCBwZC5nZXRFeHBlY3RlZEhhc2goKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGFjdHVhbEhhc2gsIHQuZXhwZWN0ZWROYW1lLCBgJHthY3R1YWx9IGhhc2ggbm90IG1hdGNoICR7dC5leHBlY3RlZE5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnTmFtZSBhbmQgaGFzaCAoTGludXgpJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0ZXN0RGF0YUxpbnV4KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtU2VydmljZSA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHggPT4geC5pc1dpbmRvd3MpLnJldHVybnMoKCkgPT4gZmFsc2UpO1xyXG4gICAgICAgICAgICBwbGF0Zm9ybVNlcnZpY2Uuc2V0dXAoeCA9PiB4LmlzTWFjKS5yZXR1cm5zKCgpID0+IGZhbHNlKTtcclxuICAgICAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHggPT4geC5pc0xpbnV4KS5yZXR1cm5zKCgpID0+IHRydWUpO1xyXG4gICAgICAgICAgICBwbGF0Zm9ybVNlcnZpY2Uuc2V0dXAoeCA9PiB4LmlzNjRiaXQpLnJldHVybnMoKCkgPT4gdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZzID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICBmcy5zZXR1cCh4ID0+IHgucmVhZEZpbGUoVHlwZU1vcS5JdC5pc0FueVN0cmluZygpKSkucmV0dXJucygoKSA9PiBQcm9taXNlLnJlc29sdmUoYE5BTUU9XCJuYW1lXCJcXG5JRD0ke3QubmFtZX1cXG5JRF9MSUtFPWRlYmlhbmApKTtcclxuICAgICAgICAgICAgY29uc3QgcGQgPSBuZXcgcGxhdGZvcm1EYXRhXzEuUGxhdGZvcm1EYXRhKHBsYXRmb3JtU2VydmljZS5vYmplY3QsIGZzLm9iamVjdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9IHlpZWxkIHBkLmdldFBsYXRmb3JtTmFtZSgpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoYWN0dWFsLCB0LmV4cGVjdGVkTmFtZSwgYCR7YWN0dWFsfSBkb2VzIG5vdCBtYXRjaCAke3QuZXhwZWN0ZWROYW1lfWApO1xyXG4gICAgICAgICAgICBjb25zdCBhY3R1YWxIYXNoID0geWllbGQgcGQuZ2V0RXhwZWN0ZWRIYXNoKCk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChhY3R1YWwsIHQuZXhwZWN0ZWROYW1lLCBgJHthY3R1YWx9IGhhc2ggbm90IG1hdGNoICR7dC5leHBlY3RlZE5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnTW9kdWxlIG5hbWUnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHRlc3REYXRhTW9kdWxlTmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF0Zm9ybVNlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cCh4ID0+IHguaXNXaW5kb3dzKS5yZXR1cm5zKCgpID0+IHQuaXNXaW5kb3dzKTtcclxuICAgICAgICAgICAgcGxhdGZvcm1TZXJ2aWNlLnNldHVwKHggPT4geC5pc0xpbnV4KS5yZXR1cm5zKCgpID0+IHQuaXNMaW51eCk7XHJcbiAgICAgICAgICAgIHBsYXRmb3JtU2VydmljZS5zZXR1cCh4ID0+IHguaXNNYWMpLnJldHVybnMoKCkgPT4gdC5pc01hYyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZzID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBwZCA9IG5ldyBwbGF0Zm9ybURhdGFfMS5QbGF0Zm9ybURhdGEocGxhdGZvcm1TZXJ2aWNlLm9iamVjdCwgZnMub2JqZWN0KTtcclxuICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gcGQuZ2V0RW5naW5lRXhlY3V0YWJsZU5hbWUoKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGFjdHVhbCwgdC5leHBlY3RlZE5hbWUsIGAke2FjdHVhbH0gZG9lcyBub3QgbWF0Y2ggJHt0LmV4cGVjdGVkTmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wbGF0Zm9ybURhdGEudW5pdC50ZXN0LmpzLm1hcCJdfQ==