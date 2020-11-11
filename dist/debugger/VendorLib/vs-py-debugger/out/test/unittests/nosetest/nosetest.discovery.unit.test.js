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
}); // tslint:disable-next-line:max-func-body-length

const chai_1 = require("chai");

const chaipromise = require("chai-as-promised");

const typeMoq = require("typemoq");

const constants_1 = require("../../../client/unittests/common/constants");

const types_1 = require("../../../client/unittests/common/types");

const discoveryService_1 = require("../../../client/unittests/nosetest/services/discoveryService");

const types_2 = require("../../../client/unittests/types");

chai_1.use(chaipromise);
suite('Unit Tests - nose - Discovery', () => {
  let discoveryService;
  let argsService;
  let testParser;
  let runner;
  setup(() => {
    const serviceContainer = typeMoq.Mock.ofType();
    argsService = typeMoq.Mock.ofType();
    testParser = typeMoq.Mock.ofType();
    runner = typeMoq.Mock.ofType();
    serviceContainer.setup(s => s.get(typeMoq.It.isValue(types_2.IArgumentsService), typeMoq.It.isAny())).returns(() => argsService.object);
    serviceContainer.setup(s => s.get(typeMoq.It.isValue(types_1.ITestRunner), typeMoq.It.isAny())).returns(() => runner.object);
    discoveryService = new discoveryService_1.TestDiscoveryService(serviceContainer.object, testParser.object);
  });
  test('Ensure discovery is invoked with the right args', () => __awaiter(void 0, void 0, void 0, function* () {
    const args = [];
    const runOutput = 'xyz';
    const tests = {
      summary: {
        errors: 1,
        failures: 0,
        passed: 0,
        skipped: 0
      },
      testFiles: [],
      testFunctions: [],
      testSuites: [],
      rootTestFolders: [],
      testFolders: []
    };
    argsService.setup(a => a.filterArguments(typeMoq.It.isValue(args), typeMoq.It.isValue(types_2.TestFilter.discovery))).returns(() => []).verifiable(typeMoq.Times.once());
    runner.setup(r => r.run(typeMoq.It.isValue(constants_1.NOSETEST_PROVIDER), typeMoq.It.isAny())).callback((_, opts) => {
      chai_1.expect(opts.args).to.include('--collect-only');
      chai_1.expect(opts.args).to.include('-vvv');
    }).returns(() => Promise.resolve(runOutput)).verifiable(typeMoq.Times.once());
    testParser.setup(t => t.parse(typeMoq.It.isValue(runOutput), typeMoq.It.isAny())).returns(() => tests).verifiable(typeMoq.Times.once());
    const options = typeMoq.Mock.ofType();
    const token = typeMoq.Mock.ofType();
    options.setup(o => o.args).returns(() => args);
    options.setup(o => o.token).returns(() => token.object);
    token.setup(t => t.isCancellationRequested).returns(() => false);
    const result = yield discoveryService.discoverTests(options.object);
    chai_1.expect(result).to.be.equal(tests);
    argsService.verifyAll();
    runner.verifyAll();
    testParser.verifyAll();
  }));
  test('Ensure discovery is cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
    const args = [];
    const runOutput = 'xyz';
    const tests = {
      summary: {
        errors: 1,
        failures: 0,
        passed: 0,
        skipped: 0
      },
      testFiles: [],
      testFunctions: [],
      testSuites: [],
      rootTestFolders: [],
      testFolders: []
    };
    argsService.setup(a => a.filterArguments(typeMoq.It.isValue(args), typeMoq.It.isValue(types_2.TestFilter.discovery))).returns(() => []).verifiable(typeMoq.Times.once());
    runner.setup(r => r.run(typeMoq.It.isValue(constants_1.NOSETEST_PROVIDER), typeMoq.It.isAny())).callback((_, opts) => {
      chai_1.expect(opts.args).to.include('--collect-only');
      chai_1.expect(opts.args).to.include('-vvv');
    }).returns(() => Promise.resolve(runOutput)).verifiable(typeMoq.Times.once());
    testParser.setup(t => t.parse(typeMoq.It.isAny(), typeMoq.It.isAny())).returns(() => tests).verifiable(typeMoq.Times.never());
    const options = typeMoq.Mock.ofType();
    const token = typeMoq.Mock.ofType();
    token.setup(t => t.isCancellationRequested).returns(() => true).verifiable(typeMoq.Times.once());
    options.setup(o => o.args).returns(() => args);
    options.setup(o => o.token).returns(() => token.object);
    const promise = discoveryService.discoverTests(options.object);
    yield chai_1.expect(promise).to.eventually.be.rejectedWith('cancelled');
    argsService.verifyAll();
    runner.verifyAll();
    testParser.verifyAll();
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vc2V0ZXN0LmRpc2NvdmVyeS51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImNoYWlfMSIsInJlcXVpcmUiLCJjaGFpcHJvbWlzZSIsInR5cGVNb3EiLCJjb25zdGFudHNfMSIsInR5cGVzXzEiLCJkaXNjb3ZlcnlTZXJ2aWNlXzEiLCJ0eXBlc18yIiwidXNlIiwic3VpdGUiLCJkaXNjb3ZlcnlTZXJ2aWNlIiwiYXJnc1NlcnZpY2UiLCJ0ZXN0UGFyc2VyIiwicnVubmVyIiwic2V0dXAiLCJzZXJ2aWNlQ29udGFpbmVyIiwiTW9jayIsIm9mVHlwZSIsInMiLCJnZXQiLCJJdCIsImlzVmFsdWUiLCJJQXJndW1lbnRzU2VydmljZSIsImlzQW55IiwicmV0dXJucyIsIm9iamVjdCIsIklUZXN0UnVubmVyIiwiVGVzdERpc2NvdmVyeVNlcnZpY2UiLCJ0ZXN0IiwiYXJncyIsInJ1bk91dHB1dCIsInRlc3RzIiwic3VtbWFyeSIsImVycm9ycyIsImZhaWx1cmVzIiwicGFzc2VkIiwic2tpcHBlZCIsInRlc3RGaWxlcyIsInRlc3RGdW5jdGlvbnMiLCJ0ZXN0U3VpdGVzIiwicm9vdFRlc3RGb2xkZXJzIiwidGVzdEZvbGRlcnMiLCJhIiwiZmlsdGVyQXJndW1lbnRzIiwiVGVzdEZpbHRlciIsImRpc2NvdmVyeSIsInZlcmlmaWFibGUiLCJUaW1lcyIsIm9uY2UiLCJyIiwicnVuIiwiTk9TRVRFU1RfUFJPVklERVIiLCJjYWxsYmFjayIsIl8iLCJvcHRzIiwiZXhwZWN0IiwidG8iLCJpbmNsdWRlIiwidCIsInBhcnNlIiwib3B0aW9ucyIsInRva2VuIiwibyIsImlzQ2FuY2VsbGF0aW9uUmVxdWVzdGVkIiwiZGlzY292ZXJUZXN0cyIsImJlIiwiZXF1YWwiLCJ2ZXJpZnlBbGwiLCJuZXZlciIsInByb21pc2UiLCJldmVudHVhbGx5IiwicmVqZWN0ZWRXaXRoIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzlGLGFBQVNGLElBQVQsQ0FBY0ksTUFBZCxFQUFzQjtBQUFFQSxNQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY1QsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBckIsR0FBc0MsSUFBSU4sQ0FBSixDQUFNLFVBQVVHLE9BQVYsRUFBbUI7QUFBRUEsUUFBQUEsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtB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Q0E0QyxJQUFBQSxLQUFLLENBQUMvQyxLQUFOLENBQVk0QyxDQUFDLElBQUlBLENBQUMsQ0FBQ0ssdUJBQW5CLEVBQ0t2QyxPQURMLENBQ2EsTUFBTSxJQURuQixFQUVLc0IsVUFGTCxDQUVnQjNDLE9BQU8sQ0FBQzRDLEtBQVIsQ0FBY0MsSUFBZCxFQUZoQjtBQUdBWSxJQUFBQSxPQUFPLENBQUM5QyxLQUFSLENBQWNnRCxDQUFDLElBQUlBLENBQUMsQ0FBQ2pDLElBQXJCLEVBQTJCTCxPQUEzQixDQUFtQyxNQUFNSyxJQUF6QztBQUNBK0IsSUFBQUEsT0FBTyxDQUFDOUMsS0FBUixDQUFjZ0QsQ0FBQyxJQUFJQSxDQUFDLENBQUNELEtBQXJCLEVBQTRCckMsT0FBNUIsQ0FBb0MsTUFBTXFDLEtBQUssQ0FBQ3BDLE1BQWhEO0FBQ0EsVUFBTTRDLE9BQU8sR0FBRzNELGdCQUFnQixDQUFDc0QsYUFBakIsQ0FBK0JKLE9BQU8sQ0FBQ25DLE1BQXZDLENBQWhCO0FBQ0EsVUFBTXpCLE1BQU0sQ0FBQ3VELE1BQVAsQ0FBY2MsT0FBZCxFQUF1QmIsRUFBdkIsQ0FBMEJjLFVBQTFCLENBQXFDTCxFQUFyQyxDQUF3Q00sWUFBeEMsQ0FBcUQsV0FBckQsQ0FBTjtBQUNBNUQsSUFBQUEsV0FBVyxDQUFDd0QsU0FBWjtBQUNBdEQsSUFBQUEsTUFBTSxDQUFDc0QsU0FBUDtBQUNBdkQsSUFBQUEsVUFBVSxDQUFDdUQsU0FBWDtBQUNILEdBakNvRCxDQUFqRCxDQUFKO0FBa0NILENBbkZJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBjaGFpcHJvbWlzZSA9IHJlcXVpcmUoXCJjaGFpLWFzLXByb21pc2VkXCIpO1xyXG5jb25zdCB0eXBlTW9xID0gcmVxdWlyZShcInR5cGVtb3FcIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC91bml0dGVzdHMvY29tbW9uL2NvbnN0YW50c1wiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvdW5pdHRlc3RzL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgZGlzY292ZXJ5U2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC91bml0dGVzdHMvbm9zZXRlc3Qvc2VydmljZXMvZGlzY292ZXJ5U2VydmljZVwiKTtcclxuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvdW5pdHRlc3RzL3R5cGVzXCIpO1xyXG5jaGFpXzEudXNlKGNoYWlwcm9taXNlKTtcclxuc3VpdGUoJ1VuaXQgVGVzdHMgLSBub3NlIC0gRGlzY292ZXJ5JywgKCkgPT4ge1xyXG4gICAgbGV0IGRpc2NvdmVyeVNlcnZpY2U7XHJcbiAgICBsZXQgYXJnc1NlcnZpY2U7XHJcbiAgICBsZXQgdGVzdFBhcnNlcjtcclxuICAgIGxldCBydW5uZXI7XHJcbiAgICBzZXR1cCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lciA9IHR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBhcmdzU2VydmljZSA9IHR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICB0ZXN0UGFyc2VyID0gdHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgIHJ1bm5lciA9IHR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBzZXJ2aWNlQ29udGFpbmVyLnNldHVwKHMgPT4gcy5nZXQodHlwZU1vcS5JdC5pc1ZhbHVlKHR5cGVzXzIuSUFyZ3VtZW50c1NlcnZpY2UpLCB0eXBlTW9xLkl0LmlzQW55KCkpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBhcmdzU2VydmljZS5vYmplY3QpO1xyXG4gICAgICAgIHNlcnZpY2VDb250YWluZXIuc2V0dXAocyA9PiBzLmdldCh0eXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMS5JVGVzdFJ1bm5lciksIHR5cGVNb3EuSXQuaXNBbnkoKSkpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHJ1bm5lci5vYmplY3QpO1xyXG4gICAgICAgIGRpc2NvdmVyeVNlcnZpY2UgPSBuZXcgZGlzY292ZXJ5U2VydmljZV8xLlRlc3REaXNjb3ZlcnlTZXJ2aWNlKHNlcnZpY2VDb250YWluZXIub2JqZWN0LCB0ZXN0UGFyc2VyLm9iamVjdCk7XHJcbiAgICB9KTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBkaXNjb3ZlcnkgaXMgaW52b2tlZCB3aXRoIHRoZSByaWdodCBhcmdzJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgICAgICBjb25zdCBydW5PdXRwdXQgPSAneHl6JztcclxuICAgICAgICBjb25zdCB0ZXN0cyA9IHtcclxuICAgICAgICAgICAgc3VtbWFyeTogeyBlcnJvcnM6IDEsIGZhaWx1cmVzOiAwLCBwYXNzZWQ6IDAsIHNraXBwZWQ6IDAgfSxcclxuICAgICAgICAgICAgdGVzdEZpbGVzOiBbXSwgdGVzdEZ1bmN0aW9uczogW10sIHRlc3RTdWl0ZXM6IFtdLFxyXG4gICAgICAgICAgICByb290VGVzdEZvbGRlcnM6IFtdLCB0ZXN0Rm9sZGVyczogW11cclxuICAgICAgICB9O1xyXG4gICAgICAgIGFyZ3NTZXJ2aWNlLnNldHVwKGEgPT4gYS5maWx0ZXJBcmd1bWVudHModHlwZU1vcS5JdC5pc1ZhbHVlKGFyZ3MpLCB0eXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMi5UZXN0RmlsdGVyLmRpc2NvdmVyeSkpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBbXSlcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUodHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHJ1bm5lci5zZXR1cChyID0+IHIucnVuKHR5cGVNb3EuSXQuaXNWYWx1ZShjb25zdGFudHNfMS5OT1NFVEVTVF9QUk9WSURFUiksIHR5cGVNb3EuSXQuaXNBbnkoKSkpXHJcbiAgICAgICAgICAgIC5jYWxsYmFjaygoXywgb3B0cykgPT4ge1xyXG4gICAgICAgICAgICBjaGFpXzEuZXhwZWN0KG9wdHMuYXJncykudG8uaW5jbHVkZSgnLS1jb2xsZWN0LW9ubHknKTtcclxuICAgICAgICAgICAgY2hhaV8xLmV4cGVjdChvcHRzLmFyZ3MpLnRvLmluY2x1ZGUoJy12dnYnKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBQcm9taXNlLnJlc29sdmUocnVuT3V0cHV0KSlcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUodHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHRlc3RQYXJzZXIuc2V0dXAodCA9PiB0LnBhcnNlKHR5cGVNb3EuSXQuaXNWYWx1ZShydW5PdXRwdXQpLCB0eXBlTW9xLkl0LmlzQW55KCkpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiB0ZXN0cylcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUodHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0eXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0eXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgb3B0aW9ucy5zZXR1cChvID0+IG8uYXJncykucmV0dXJucygoKSA9PiBhcmdzKTtcclxuICAgICAgICBvcHRpb25zLnNldHVwKG8gPT4gby50b2tlbikucmV0dXJucygoKSA9PiB0b2tlbi5vYmplY3QpO1xyXG4gICAgICAgIHRva2VuLnNldHVwKHQgPT4gdC5pc0NhbmNlbGxhdGlvblJlcXVlc3RlZClcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gZmFsc2UpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHlpZWxkIGRpc2NvdmVyeVNlcnZpY2UuZGlzY292ZXJUZXN0cyhvcHRpb25zLm9iamVjdCk7XHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChyZXN1bHQpLnRvLmJlLmVxdWFsKHRlc3RzKTtcclxuICAgICAgICBhcmdzU2VydmljZS52ZXJpZnlBbGwoKTtcclxuICAgICAgICBydW5uZXIudmVyaWZ5QWxsKCk7XHJcbiAgICAgICAgdGVzdFBhcnNlci52ZXJpZnlBbGwoKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBkaXNjb3ZlcnkgaXMgY2FuY2VsbGVkJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgICAgICBjb25zdCBydW5PdXRwdXQgPSAneHl6JztcclxuICAgICAgICBjb25zdCB0ZXN0cyA9IHtcclxuICAgICAgICAgICAgc3VtbWFyeTogeyBlcnJvcnM6IDEsIGZhaWx1cmVzOiAwLCBwYXNzZWQ6IDAsIHNraXBwZWQ6IDAgfSxcclxuICAgICAgICAgICAgdGVzdEZpbGVzOiBbXSwgdGVzdEZ1bmN0aW9uczogW10sIHRlc3RTdWl0ZXM6IFtdLFxyXG4gICAgICAgICAgICByb290VGVzdEZvbGRlcnM6IFtdLCB0ZXN0Rm9sZGVyczogW11cclxuICAgICAgICB9O1xyXG4gICAgICAgIGFyZ3NTZXJ2aWNlLnNldHVwKGEgPT4gYS5maWx0ZXJBcmd1bWVudHModHlwZU1vcS5JdC5pc1ZhbHVlKGFyZ3MpLCB0eXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMi5UZXN0RmlsdGVyLmRpc2NvdmVyeSkpKVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBbXSlcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUodHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHJ1bm5lci5zZXR1cChyID0+IHIucnVuKHR5cGVNb3EuSXQuaXNWYWx1ZShjb25zdGFudHNfMS5OT1NFVEVTVF9QUk9WSURFUiksIHR5cGVNb3EuSXQuaXNBbnkoKSkpXHJcbiAgICAgICAgICAgIC5jYWxsYmFjaygoXywgb3B0cykgPT4ge1xyXG4gICAgICAgICAgICBjaGFpXzEuZXhwZWN0KG9wdHMuYXJncykudG8uaW5jbHVkZSgnLS1jb2xsZWN0LW9ubHknKTtcclxuICAgICAgICAgICAgY2hhaV8xLmV4cGVjdChvcHRzLmFyZ3MpLnRvLmluY2x1ZGUoJy12dnYnKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAucmV0dXJucygoKSA9PiBQcm9taXNlLnJlc29sdmUocnVuT3V0cHV0KSlcclxuICAgICAgICAgICAgLnZlcmlmaWFibGUodHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIHRlc3RQYXJzZXIuc2V0dXAodCA9PiB0LnBhcnNlKHR5cGVNb3EuSXQuaXNBbnkoKSwgdHlwZU1vcS5JdC5pc0FueSgpKSlcclxuICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gdGVzdHMpXHJcbiAgICAgICAgICAgIC52ZXJpZmlhYmxlKHR5cGVNb3EuVGltZXMubmV2ZXIoKSk7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICB0b2tlbi5zZXR1cCh0ID0+IHQuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQpXHJcbiAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHRydWUpXHJcbiAgICAgICAgICAgIC52ZXJpZmlhYmxlKHR5cGVNb3EuVGltZXMub25jZSgpKTtcclxuICAgICAgICBvcHRpb25zLnNldHVwKG8gPT4gby5hcmdzKS5yZXR1cm5zKCgpID0+IGFyZ3MpO1xyXG4gICAgICAgIG9wdGlvbnMuc2V0dXAobyA9PiBvLnRva2VuKS5yZXR1cm5zKCgpID0+IHRva2VuLm9iamVjdCk7XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGRpc2NvdmVyeVNlcnZpY2UuZGlzY292ZXJUZXN0cyhvcHRpb25zLm9iamVjdCk7XHJcbiAgICAgICAgeWllbGQgY2hhaV8xLmV4cGVjdChwcm9taXNlKS50by5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgYXJnc1NlcnZpY2UudmVyaWZ5QWxsKCk7XHJcbiAgICAgICAgcnVubmVyLnZlcmlmeUFsbCgpO1xyXG4gICAgICAgIHRlc3RQYXJzZXIudmVyaWZ5QWxsKCk7XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub3NldGVzdC5kaXNjb3ZlcnkudW5pdC50ZXN0LmpzLm1hcCJdfQ==