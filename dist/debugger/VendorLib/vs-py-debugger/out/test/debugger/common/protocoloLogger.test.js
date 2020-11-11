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
});

const stream_1 = require("stream");

const TypeMoq = require("typemoq");

const protocolLogger_1 = require("../../../client/debugger/debugAdapter/Common/protocolLogger"); // tslint:disable-next-line:max-func-body-length


suite('Debugging - Protocol Logger', () => {
  let protocolLogger;
  setup(() => {
    protocolLogger = new protocolLogger_1.ProtocolLogger();
  });
  test('Ensure messages are buffered untill logger is provided', () => __awaiter(void 0, void 0, void 0, function* () {
    const inputStream = new stream_1.PassThrough();
    const outputStream = new stream_1.PassThrough();
    protocolLogger.connect(inputStream, outputStream);
    inputStream.write('A');
    outputStream.write('1');
    inputStream.write('B');
    inputStream.write('C');
    outputStream.write('2');
    outputStream.write('3');
    const logger = TypeMoq.Mock.ofType();
    protocolLogger.setup(logger.object);
    logger.verify(l => l.verbose('From Client:'), TypeMoq.Times.exactly(3));
    logger.verify(l => l.verbose('To Client:'), TypeMoq.Times.exactly(3));
    const expectedLogFileContents = ['A', '1', 'B', 'C', '2', '3'];

    for (const expectedContent of expectedLogFileContents) {
      logger.verify(l => l.verbose(expectedContent), TypeMoq.Times.once());
    }
  }));
  test('Ensure messages are are logged as they arrive', () => __awaiter(void 0, void 0, void 0, function* () {
    const inputStream = new stream_1.PassThrough();
    const outputStream = new stream_1.PassThrough();
    protocolLogger.connect(inputStream, outputStream);
    inputStream.write('A');
    outputStream.write('1');
    const logger = TypeMoq.Mock.ofType();
    protocolLogger.setup(logger.object);
    inputStream.write('B');
    inputStream.write('C');
    outputStream.write('2');
    outputStream.write('3');
    logger.verify(l => l.verbose('From Client:'), TypeMoq.Times.exactly(3));
    logger.verify(l => l.verbose('To Client:'), TypeMoq.Times.exactly(3));
    const expectedLogFileContents = ['A', '1', 'B', 'C', '2', '3'];

    for (const expectedContent of expectedLogFileContents) {
      logger.verify(l => l.verbose(expectedContent), TypeMoq.Times.once());
    }
  }));
  test('Ensure nothing is logged once logging is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const inputStream = new stream_1.PassThrough();
    const outputStream = new stream_1.PassThrough();
    protocolLogger.connect(inputStream, outputStream);
    const logger = TypeMoq.Mock.ofType();
    protocolLogger.setup(logger.object);
    inputStream.write('A');
    outputStream.write('1');
    protocolLogger.dispose();
    inputStream.write('B');
    inputStream.write('C');
    outputStream.write('2');
    outputStream.write('3');
    logger.verify(l => l.verbose('From Client:'), TypeMoq.Times.exactly(1));
    logger.verify(l => l.verbose('To Client:'), TypeMoq.Times.exactly(1));
    const expectedLogFileContents = ['A', '1'];
    const notExpectedLogFileContents = ['B', 'C', '2', '3'];

    for (const expectedContent of expectedLogFileContents) {
      logger.verify(l => l.verbose(expectedContent), TypeMoq.Times.once());
    }

    for (const notExpectedContent of notExpectedLogFileContents) {
      logger.verify(l => l.verbose(notExpectedContent), TypeMoq.Times.never());
    }
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3RvY29sb0xvZ2dlci50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJzdHJlYW1fMSIsInJlcXVpcmUiLCJUeXBlTW9xIiwicHJvdG9jb2xMb2dnZXJfMSIsInN1aXRlIiwicHJvdG9jb2xMb2dnZXIiLCJzZXR1cCIsIlByb3RvY29sTG9nZ2VyIiwidGVzdCIsImlucHV0U3RyZWFtIiwiUGFzc1Rocm91Z2giLCJvdXRwdXRTdHJlYW0iLCJjb25uZWN0Iiwid3JpdGUiLCJsb2dnZXIiLCJNb2NrIiwib2ZUeXBlIiwib2JqZWN0IiwidmVyaWZ5IiwibCIsInZlcmJvc2UiLCJUaW1lcyIsImV4YWN0bHkiLCJleHBlY3RlZExvZ0ZpbGVDb250ZW50cyIsImV4cGVjdGVkQ29udGVudCIsIm9uY2UiLCJkaXNwb3NlIiwibm90RXhwZWN0ZWRMb2dGaWxlQ29udGVudHMiLCJub3RFeHBlY3RlZENvbnRlbnQiLCJuZXZlciJdLCJtYXBwaW5ncyI6IkFBQUEsYSxDQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFD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QUFjSSxJQUFkLEVBQS9DO0FBQ0g7O0FBQ0QsU0FBSyxNQUFNRyxrQkFBWCxJQUFpQ0QsMEJBQWpDLEVBQTZEO0FBQ3pEYixNQUFBQSxNQUFNLENBQUNJLE1BQVAsQ0FBY0MsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLE9BQUYsQ0FBVVEsa0JBQVYsQ0FBbkIsRUFBa0QxQixPQUFPLENBQUNtQixLQUFSLENBQWNRLEtBQWQsRUFBbEQ7QUFDSDtBQUNKLEdBdkJ3RSxDQUFyRSxDQUFKO0FBd0JILENBbkVJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBzdHJlYW1fMSA9IHJlcXVpcmUoXCJzdHJlYW1cIik7XHJcbmNvbnN0IFR5cGVNb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuY29uc3QgcHJvdG9jb2xMb2dnZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvZGVidWdnZXIvZGVidWdBZGFwdGVyL0NvbW1vbi9wcm90b2NvbExvZ2dlclwiKTtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbnN1aXRlKCdEZWJ1Z2dpbmcgLSBQcm90b2NvbCBMb2dnZXInLCAoKSA9PiB7XHJcbiAgICBsZXQgcHJvdG9jb2xMb2dnZXI7XHJcbiAgICBzZXR1cCgoKSA9PiB7XHJcbiAgICAgICAgcHJvdG9jb2xMb2dnZXIgPSBuZXcgcHJvdG9jb2xMb2dnZXJfMS5Qcm90b2NvbExvZ2dlcigpO1xyXG4gICAgfSk7XHJcbiAgICB0ZXN0KCdFbnN1cmUgbWVzc2FnZXMgYXJlIGJ1ZmZlcmVkIHVudGlsbCBsb2dnZXIgaXMgcHJvdmlkZWQnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXRTdHJlYW0gPSBuZXcgc3RyZWFtXzEuUGFzc1Rocm91Z2goKTtcclxuICAgICAgICBjb25zdCBvdXRwdXRTdHJlYW0gPSBuZXcgc3RyZWFtXzEuUGFzc1Rocm91Z2goKTtcclxuICAgICAgICBwcm90b2NvbExvZ2dlci5jb25uZWN0KGlucHV0U3RyZWFtLCBvdXRwdXRTdHJlYW0pO1xyXG4gICAgICAgIGlucHV0U3RyZWFtLndyaXRlKCdBJyk7XHJcbiAgICAgICAgb3V0cHV0U3RyZWFtLndyaXRlKCcxJyk7XHJcbiAgICAgICAgaW5wdXRTdHJlYW0ud3JpdGUoJ0InKTtcclxuICAgICAgICBpbnB1dFN0cmVhbS53cml0ZSgnQycpO1xyXG4gICAgICAgIG91dHB1dFN0cmVhbS53cml0ZSgnMicpO1xyXG4gICAgICAgIG91dHB1dFN0cmVhbS53cml0ZSgnMycpO1xyXG4gICAgICAgIGNvbnN0IGxvZ2dlciA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBwcm90b2NvbExvZ2dlci5zZXR1cChsb2dnZXIub2JqZWN0KTtcclxuICAgICAgICBsb2dnZXIudmVyaWZ5KGwgPT4gbC52ZXJib3NlKCdGcm9tIENsaWVudDonKSwgVHlwZU1vcS5UaW1lcy5leGFjdGx5KDMpKTtcclxuICAgICAgICBsb2dnZXIudmVyaWZ5KGwgPT4gbC52ZXJib3NlKCdUbyBDbGllbnQ6JyksIFR5cGVNb3EuVGltZXMuZXhhY3RseSgzKSk7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRMb2dGaWxlQ29udGVudHMgPSBbJ0EnLCAnMScsICdCJywgJ0MnLCAnMicsICczJ107XHJcbiAgICAgICAgZm9yIChjb25zdCBleHBlY3RlZENvbnRlbnQgb2YgZXhwZWN0ZWRMb2dGaWxlQ29udGVudHMpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLnZlcmlmeShsID0+IGwudmVyYm9zZShleHBlY3RlZENvbnRlbnQpLCBUeXBlTW9xLlRpbWVzLm9uY2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRW5zdXJlIG1lc3NhZ2VzIGFyZSBhcmUgbG9nZ2VkIGFzIHRoZXkgYXJyaXZlJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGlucHV0U3RyZWFtID0gbmV3IHN0cmVhbV8xLlBhc3NUaHJvdWdoKCk7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0U3RyZWFtID0gbmV3IHN0cmVhbV8xLlBhc3NUaHJvdWdoKCk7XHJcbiAgICAgICAgcHJvdG9jb2xMb2dnZXIuY29ubmVjdChpbnB1dFN0cmVhbSwgb3V0cHV0U3RyZWFtKTtcclxuICAgICAgICBpbnB1dFN0cmVhbS53cml0ZSgnQScpO1xyXG4gICAgICAgIG91dHB1dFN0cmVhbS53cml0ZSgnMScpO1xyXG4gICAgICAgIGNvbnN0IGxvZ2dlciA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBwcm90b2NvbExvZ2dlci5zZXR1cChsb2dnZXIub2JqZWN0KTtcclxuICAgICAgICBpbnB1dFN0cmVhbS53cml0ZSgnQicpO1xyXG4gICAgICAgIGlucHV0U3RyZWFtLndyaXRlKCdDJyk7XHJcbiAgICAgICAgb3V0cHV0U3RyZWFtLndyaXRlKCcyJyk7XHJcbiAgICAgICAgb3V0cHV0U3RyZWFtLndyaXRlKCczJyk7XHJcbiAgICAgICAgbG9nZ2VyLnZlcmlmeShsID0+IGwudmVyYm9zZSgnRnJvbSBDbGllbnQ6JyksIFR5cGVNb3EuVGltZXMuZXhhY3RseSgzKSk7XHJcbiAgICAgICAgbG9nZ2VyLnZlcmlmeShsID0+IGwudmVyYm9zZSgnVG8gQ2xpZW50OicpLCBUeXBlTW9xLlRpbWVzLmV4YWN0bHkoMykpO1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTG9nRmlsZUNvbnRlbnRzID0gWydBJywgJzEnLCAnQicsICdDJywgJzInLCAnMyddO1xyXG4gICAgICAgIGZvciAoY29uc3QgZXhwZWN0ZWRDb250ZW50IG9mIGV4cGVjdGVkTG9nRmlsZUNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci52ZXJpZnkobCA9PiBsLnZlcmJvc2UoZXhwZWN0ZWRDb250ZW50KSwgVHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0Vuc3VyZSBub3RoaW5nIGlzIGxvZ2dlZCBvbmNlIGxvZ2dpbmcgaXMgZGlzYWJsZWQnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXRTdHJlYW0gPSBuZXcgc3RyZWFtXzEuUGFzc1Rocm91Z2goKTtcclxuICAgICAgICBjb25zdCBvdXRwdXRTdHJlYW0gPSBuZXcgc3RyZWFtXzEuUGFzc1Rocm91Z2goKTtcclxuICAgICAgICBwcm90b2NvbExvZ2dlci5jb25uZWN0KGlucHV0U3RyZWFtLCBvdXRwdXRTdHJlYW0pO1xyXG4gICAgICAgIGNvbnN0IGxvZ2dlciA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBwcm90b2NvbExvZ2dlci5zZXR1cChsb2dnZXIub2JqZWN0KTtcclxuICAgICAgICBpbnB1dFN0cmVhbS53cml0ZSgnQScpO1xyXG4gICAgICAgIG91dHB1dFN0cmVhbS53cml0ZSgnMScpO1xyXG4gICAgICAgIHByb3RvY29sTG9nZ2VyLmRpc3Bvc2UoKTtcclxuICAgICAgICBpbnB1dFN0cmVhbS53cml0ZSgnQicpO1xyXG4gICAgICAgIGlucHV0U3RyZWFtLndyaXRlKCdDJyk7XHJcbiAgICAgICAgb3V0cHV0U3RyZWFtLndyaXRlKCcyJyk7XHJcbiAgICAgICAgb3V0cHV0U3RyZWFtLndyaXRlKCczJyk7XHJcbiAgICAgICAgbG9nZ2VyLnZlcmlmeShsID0+IGwudmVyYm9zZSgnRnJvbSBDbGllbnQ6JyksIFR5cGVNb3EuVGltZXMuZXhhY3RseSgxKSk7XHJcbiAgICAgICAgbG9nZ2VyLnZlcmlmeShsID0+IGwudmVyYm9zZSgnVG8gQ2xpZW50OicpLCBUeXBlTW9xLlRpbWVzLmV4YWN0bHkoMSkpO1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTG9nRmlsZUNvbnRlbnRzID0gWydBJywgJzEnXTtcclxuICAgICAgICBjb25zdCBub3RFeHBlY3RlZExvZ0ZpbGVDb250ZW50cyA9IFsnQicsICdDJywgJzInLCAnMyddO1xyXG4gICAgICAgIGZvciAoY29uc3QgZXhwZWN0ZWRDb250ZW50IG9mIGV4cGVjdGVkTG9nRmlsZUNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci52ZXJpZnkobCA9PiBsLnZlcmJvc2UoZXhwZWN0ZWRDb250ZW50KSwgVHlwZU1vcS5UaW1lcy5vbmNlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG5vdEV4cGVjdGVkQ29udGVudCBvZiBub3RFeHBlY3RlZExvZ0ZpbGVDb250ZW50cykge1xyXG4gICAgICAgICAgICBsb2dnZXIudmVyaWZ5KGwgPT4gbC52ZXJib3NlKG5vdEV4cGVjdGVkQ29udGVudCksIFR5cGVNb3EuVGltZXMubmV2ZXIoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJvdG9jb2xvTG9nZ2VyLnRlc3QuanMubWFwIl19