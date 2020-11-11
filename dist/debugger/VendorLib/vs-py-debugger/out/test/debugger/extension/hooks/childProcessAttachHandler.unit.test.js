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
}); // tslint:disable:no-any

const ts_mockito_1 = require("ts-mockito");

const childProcessAttachHandler_1 = require("../../../../client/debugger/extension/hooks/childProcessAttachHandler");

const childProcessAttachService_1 = require("../../../../client/debugger/extension/hooks/childProcessAttachService");

const constants_1 = require("../../../../client/debugger/extension/hooks/constants");

suite('Debug - Child Process', () => {
  test('Do not attach to child process if event is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
    const attachService = ts_mockito_1.mock(childProcessAttachService_1.ChildProcessAttachService);
    const handler = new childProcessAttachHandler_1.ChildProcessAttachEventHandler(ts_mockito_1.instance(attachService));
    const body = {};
    yield handler.handleCustomEvent({
      event: 'abc',
      body,
      session: {}
    });
    ts_mockito_1.verify(attachService.attach(body)).never();
  }));
  test('Do not attach to child process if event is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
    const attachService = ts_mockito_1.mock(childProcessAttachService_1.ChildProcessAttachService);
    const handler = new childProcessAttachHandler_1.ChildProcessAttachEventHandler(ts_mockito_1.instance(attachService));
    const body = {};
    yield handler.handleCustomEvent({
      event: constants_1.PTVSDEvents.ChildProcessLaunched,
      body,
      session: {}
    });
    ts_mockito_1.verify(attachService.attach(body)).once();
  }));
  test('Exceptions are not bubbled up if data is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
    const attachService = ts_mockito_1.mock(childProcessAttachService_1.ChildProcessAttachService);
    const handler = new childProcessAttachHandler_1.ChildProcessAttachEventHandler(ts_mockito_1.instance(attachService));
    yield handler.handleCustomEvent(undefined);
  }));
  test('Exceptions are not bubbled up if exceptions are thrown', () => __awaiter(void 0, void 0, void 0, function* () {
    const attachService = ts_mockito_1.mock(childProcessAttachService_1.ChildProcessAttachService);
    const handler = new childProcessAttachHandler_1.ChildProcessAttachEventHandler(ts_mockito_1.instance(attachService));
    const body = {};
    ts_mockito_1.when(attachService.attach(body)).thenThrow(new Error('Kaboom'));
    yield handler.handleCustomEvent({
      event: constants_1.PTVSDEvents.ChildProcessLaunched,
      body,
      session: {}
    });
    ts_mockito_1.verify(attachService.attach(body)).once();
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoaWxkUHJvY2Vzc0F0dGFjaEhhbmRsZXIudW5pdC50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ0c19tb2NraXRvXzEiLCJyZXF1aXJlIiwiY2hpbGRQcm9jZXNzQXR0YWNoSGFuZGxlcl8xIiwiY2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZV8xIiwiY29uc3RhbnRzXzEiLCJzdWl0ZSIsInRlc3QiLCJhdHRhY2hTZXJ2aWNlIiwibW9jayIsIkNoaWxkUHJvY2Vzc0F0dGFjaFNlcnZpY2UiLCJoYW5kbGVyIiwiQ2hpbGRQcm9jZXNzQXR0YWNoRXZlbnRIYW5kbGVyIiwiaW5zdGFuY2UiLCJib2R5IiwiaGFuZGxlQ3VzdG9tRXZlbnQiLCJldmVudCIsInNlc3Npb24iLCJ2ZXJpZnkiLCJhdHRhY2giLCJuZXZlciIsIlBUVlNERXZlbnRzIiwiQ2hpbGRQcm9jZXNzTGF1bmNoZWQiLCJvbmNlIiwidW5kZWZpbmVkIiwid2hlbiIsInRoZW5UaHJvdyIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVB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QSxZQUFZLENBQUN3QixJQUFiLENBQWtCakIsYUFBYSxDQUFDVyxNQUFkLENBQXFCTCxJQUFyQixDQUFsQixFQUE4Q1ksU0FBOUMsQ0FBd0QsSUFBSUMsS0FBSixDQUFVLFFBQVYsQ0FBeEQ7QUFDQSxVQUFNaEIsT0FBTyxDQUFDSSxpQkFBUixDQUEwQjtBQUFFQyxNQUFBQSxLQUFLLEVBQUVYLFdBQVcsQ0FBQ2dCLFdBQVosQ0FBd0JDLG9CQUFqQztBQUF1RFIsTUFBQUEsSUFBdkQ7QUFBNkRHLE1BQUFBLE9BQU8sRUFBRTtBQUF0RSxLQUExQixDQUFOO0FBQ0FoQixJQUFBQSxZQUFZLENBQUNpQixNQUFiLENBQW9CVixhQUFhLENBQUNXLE1BQWQsQ0FBcUJMLElBQXJCLENBQXBCLEVBQWdEUyxJQUFoRDtBQUNILEdBUDZFLENBQTFFLENBQUo7QUFRSCxDQTVCSSxDQUFMIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLWFueVxyXG5jb25zdCB0c19tb2NraXRvXzEgPSByZXF1aXJlKFwidHMtbW9ja2l0b1wiKTtcclxuY29uc3QgY2hpbGRQcm9jZXNzQXR0YWNoSGFuZGxlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL2NsaWVudC9kZWJ1Z2dlci9leHRlbnNpb24vaG9va3MvY2hpbGRQcm9jZXNzQXR0YWNoSGFuZGxlclwiKTtcclxuY29uc3QgY2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL2NsaWVudC9kZWJ1Z2dlci9leHRlbnNpb24vaG9va3MvY2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZVwiKTtcclxuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vY2xpZW50L2RlYnVnZ2VyL2V4dGVuc2lvbi9ob29rcy9jb25zdGFudHNcIik7XHJcbnN1aXRlKCdEZWJ1ZyAtIENoaWxkIFByb2Nlc3MnLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdEbyBub3QgYXR0YWNoIHRvIGNoaWxkIHByb2Nlc3MgaWYgZXZlbnQgaXMgaW52YWxpZCcsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBhdHRhY2hTZXJ2aWNlID0gdHNfbW9ja2l0b18xLm1vY2soY2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZV8xLkNoaWxkUHJvY2Vzc0F0dGFjaFNlcnZpY2UpO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgY2hpbGRQcm9jZXNzQXR0YWNoSGFuZGxlcl8xLkNoaWxkUHJvY2Vzc0F0dGFjaEV2ZW50SGFuZGxlcih0c19tb2NraXRvXzEuaW5zdGFuY2UoYXR0YWNoU2VydmljZSkpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSB7fTtcclxuICAgICAgICB5aWVsZCBoYW5kbGVyLmhhbmRsZUN1c3RvbUV2ZW50KHsgZXZlbnQ6ICdhYmMnLCBib2R5LCBzZXNzaW9uOiB7fSB9KTtcclxuICAgICAgICB0c19tb2NraXRvXzEudmVyaWZ5KGF0dGFjaFNlcnZpY2UuYXR0YWNoKGJvZHkpKS5uZXZlcigpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRG8gbm90IGF0dGFjaCB0byBjaGlsZCBwcm9jZXNzIGlmIGV2ZW50IGlzIGludmFsaWQnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgYXR0YWNoU2VydmljZSA9IHRzX21vY2tpdG9fMS5tb2NrKGNoaWxkUHJvY2Vzc0F0dGFjaFNlcnZpY2VfMS5DaGlsZFByb2Nlc3NBdHRhY2hTZXJ2aWNlKTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGNoaWxkUHJvY2Vzc0F0dGFjaEhhbmRsZXJfMS5DaGlsZFByb2Nlc3NBdHRhY2hFdmVudEhhbmRsZXIodHNfbW9ja2l0b18xLmluc3RhbmNlKGF0dGFjaFNlcnZpY2UpKTtcclxuICAgICAgICBjb25zdCBib2R5ID0ge307XHJcbiAgICAgICAgeWllbGQgaGFuZGxlci5oYW5kbGVDdXN0b21FdmVudCh7IGV2ZW50OiBjb25zdGFudHNfMS5QVFZTREV2ZW50cy5DaGlsZFByb2Nlc3NMYXVuY2hlZCwgYm9keSwgc2Vzc2lvbjoge30gfSk7XHJcbiAgICAgICAgdHNfbW9ja2l0b18xLnZlcmlmeShhdHRhY2hTZXJ2aWNlLmF0dGFjaChib2R5KSkub25jZSgpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRXhjZXB0aW9ucyBhcmUgbm90IGJ1YmJsZWQgdXAgaWYgZGF0YSBpcyBpbnZhbGlkJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaFNlcnZpY2UgPSB0c19tb2NraXRvXzEubW9jayhjaGlsZFByb2Nlc3NBdHRhY2hTZXJ2aWNlXzEuQ2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBjaGlsZFByb2Nlc3NBdHRhY2hIYW5kbGVyXzEuQ2hpbGRQcm9jZXNzQXR0YWNoRXZlbnRIYW5kbGVyKHRzX21vY2tpdG9fMS5pbnN0YW5jZShhdHRhY2hTZXJ2aWNlKSk7XHJcbiAgICAgICAgeWllbGQgaGFuZGxlci5oYW5kbGVDdXN0b21FdmVudCh1bmRlZmluZWQpO1xyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRXhjZXB0aW9ucyBhcmUgbm90IGJ1YmJsZWQgdXAgaWYgZXhjZXB0aW9ucyBhcmUgdGhyb3duJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaFNlcnZpY2UgPSB0c19tb2NraXRvXzEubW9jayhjaGlsZFByb2Nlc3NBdHRhY2hTZXJ2aWNlXzEuQ2hpbGRQcm9jZXNzQXR0YWNoU2VydmljZSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBjaGlsZFByb2Nlc3NBdHRhY2hIYW5kbGVyXzEuQ2hpbGRQcm9jZXNzQXR0YWNoRXZlbnRIYW5kbGVyKHRzX21vY2tpdG9fMS5pbnN0YW5jZShhdHRhY2hTZXJ2aWNlKSk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IHt9O1xyXG4gICAgICAgIHRzX21vY2tpdG9fMS53aGVuKGF0dGFjaFNlcnZpY2UuYXR0YWNoKGJvZHkpKS50aGVuVGhyb3cobmV3IEVycm9yKCdLYWJvb20nKSk7XHJcbiAgICAgICAgeWllbGQgaGFuZGxlci5oYW5kbGVDdXN0b21FdmVudCh7IGV2ZW50OiBjb25zdGFudHNfMS5QVFZTREV2ZW50cy5DaGlsZFByb2Nlc3NMYXVuY2hlZCwgYm9keSwgc2Vzc2lvbjoge30gfSk7XHJcbiAgICAgICAgdHNfbW9ja2l0b18xLnZlcmlmeShhdHRhY2hTZXJ2aWNlLmF0dGFjaChib2R5KSkub25jZSgpO1xyXG4gICAgfSkpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hpbGRQcm9jZXNzQXR0YWNoSGFuZGxlci51bml0LnRlc3QuanMubWFwIl19