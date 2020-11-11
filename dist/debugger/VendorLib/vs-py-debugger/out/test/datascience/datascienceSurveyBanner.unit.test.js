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
}); // tslint:disable:no-any max-func-body-length

const chai_1 = require("chai");

const typemoq = require("typemoq");

const dataScienceSurveyBanner_1 = require("../../client/datascience/dataScienceSurveyBanner");

suite('Data Science Survey Banner', () => {
  let appShell;
  let browser;
  const targetUri = 'https://microsoft.com';
  const message = 'Can you please take 2 minutes to tell us how the Python Data Science features are working for you?';
  const yes = 'Yes, take survey now';
  const no = 'No, thanks';
  setup(() => {
    appShell = typemoq.Mock.ofType();
    browser = typemoq.Mock.ofType();
  });
  test('Data science banner should be enabled after we hit our command execution count', () => __awaiter(void 0, void 0, void 0, function* () {
    const enabledValue = true;
    const attemptCounter = 1000;
    const testBanner = preparePopup(attemptCounter, enabledValue, 0, appShell.object, browser.object, targetUri);
    const expectedUri = targetUri;
    let receivedUri = '';
    browser.setup(b => b.launch(typemoq.It.is(a => {
      receivedUri = a;
      return a === expectedUri;
    }))).verifiable(typemoq.Times.once());
    yield testBanner.launchSurvey(); // This is technically not necessary, but it gives
    // better output than the .verifyAll messages do.

    chai_1.expect(receivedUri).is.equal(expectedUri, 'Uri given to launch mock is incorrect.'); // verify that the calls expected were indeed made.

    browser.verifyAll();
    browser.reset();
  }));
  test('Do not show data science banner when it is disabled', () => {
    appShell.setup(a => a.showInformationMessage(typemoq.It.isValue(message), typemoq.It.isValue(yes), typemoq.It.isValue(no))).verifiable(typemoq.Times.never());
    const enabledValue = false;
    const attemptCounter = 0;
    const testBanner = preparePopup(attemptCounter, enabledValue, 0, appShell.object, browser.object, targetUri);
    testBanner.showBanner().ignoreErrors();
  });
  test('Do not show data science banner if we have not hit our command count', () => {
    appShell.setup(a => a.showInformationMessage(typemoq.It.isValue(message), typemoq.It.isValue(yes), typemoq.It.isValue(no))).verifiable(typemoq.Times.never());
    const enabledValue = true;
    const attemptCounter = 100;
    const testBanner = preparePopup(attemptCounter, enabledValue, 1000, appShell.object, browser.object, targetUri);
    testBanner.showBanner().ignoreErrors();
  });
});

function preparePopup(commandCounter, enabledValue, commandThreshold, appShell, browser, targetUri) {
  const myfactory = typemoq.Mock.ofType();
  const enabledValState = typemoq.Mock.ofType();
  const attemptCountState = typemoq.Mock.ofType();
  enabledValState.setup(a => a.updateValue(typemoq.It.isValue(true))).returns(() => {
    enabledValue = true;
    return Promise.resolve();
  });
  enabledValState.setup(a => a.updateValue(typemoq.It.isValue(false))).returns(() => {
    enabledValue = false;
    return Promise.resolve();
  });
  attemptCountState.setup(a => a.updateValue(typemoq.It.isAnyNumber())).returns(() => {
    commandCounter += 1;
    return Promise.resolve();
  });
  enabledValState.setup(a => a.value).returns(() => enabledValue);
  attemptCountState.setup(a => a.value).returns(() => commandCounter);
  myfactory.setup(a => a.createGlobalPersistentState(typemoq.It.isValue(dataScienceSurveyBanner_1.DSSurveyStateKeys.ShowBanner), typemoq.It.isValue(true))).returns(() => {
    return enabledValState.object;
  });
  myfactory.setup(a => a.createGlobalPersistentState(typemoq.It.isValue(dataScienceSurveyBanner_1.DSSurveyStateKeys.ShowBanner), typemoq.It.isValue(false))).returns(() => {
    return enabledValState.object;
  });
  myfactory.setup(a => a.createGlobalPersistentState(typemoq.It.isValue(dataScienceSurveyBanner_1.DSSurveyStateKeys.ShowAttemptCounter), typemoq.It.isAnyNumber())).returns(() => {
    return attemptCountState.object;
  });
  return new dataScienceSurveyBanner_1.DataScienceSurveyBanner(appShell, myfactory.object, browser, commandThreshold, targetUri);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzY2llbmNlU3VydmV5QmFubmVyLnVuaXQudGVzdC5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwiY2hhaV8xIiwicmVxdWlyZSIsInR5cGVtb3EiLCJkYXRhU2NpZW5jZVN1cnZleUJhbm5lcl8xIiwic3VpdGUiLCJhcHBTaGVsbCIsImJyb3dzZXIiLCJ0YXJnZXRVcmkiLCJtZXNzYWdlIiwieWVzIiwibm8iLCJzZXR1cCIsIk1vY2siLCJvZlR5cGUiLCJ0ZXN0IiwiZW5hYmxlZFZhbHVlIiwiYXR0ZW1wdENvdW50ZXIiLCJ0ZXN0QmFubmVyIiwicHJlcGFyZVBvcHVwIiwib2JqZWN0IiwiZXhwZWN0ZWRVcmkiLCJyZWNlaXZlZFVyaSIsImIiLCJsYXVuY2giLCJJdCIsImlzIiwiYSIsInZlcmlmaWFibGUiLCJUaW1lcyIsIm9uY2UiLCJsYXVuY2hTdXJ2ZXkiLCJleHBlY3QiLCJlcXVhbCIsInZlcmlmeUFsbCIsInJlc2V0Iiwic2hvd0luZm9ybWF0aW9uTWVzc2FnZSIsImlzVmFsdWUiLCJuZXZlciIsInNob3dCYW5uZXIiLCJpZ25vcmVFcnJvcnMiLCJjb21tYW5kQ291bnRlciIsImNvbW1hbmRUaHJlc2hvbGQiLCJteWZhY3RvcnkiLCJlbmFibGVkVmFsU3RhdGUiLCJhdHRlbXB0Q291bnRTdGF0ZSIsInVwZGF0ZVZhbHVlIiwicmV0dXJucyIsImlzQW55TnVtYmVyIiwiY3JlYXRlR2xvYmFsUGVyc2lzdGVudFN0YXRlIiwiRFNTdXJ2ZXlTdGF0ZUtleXMiLCJTaG93QmFubmVyIiwiU2hvd0F0dGVtcHRDb3VudGVy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QUFYLEVBQWxILENBQXJCLEVBQWtLRCxPQUFsSyxDQUEwSyxNQUFNO0FBQzVLLFdBQU9GLGlCQUFpQixDQUFDekIsTUFBekI7QUFDSCxHQUZEO0FBR0EsU0FBTyxJQUFJaEIseUJBQXlCLENBQUNpRCx1QkFBOUIsQ0FBc0QvQyxRQUF0RCxFQUFnRXFDLFNBQVMsQ0FBQ3ZCLE1BQTFFLEVBQWtGYixPQUFsRixFQUEyRm1DLGdCQUEzRixFQUE2R2xDLFNBQTdHLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbWF4LWZ1bmMtYm9keS1sZW5ndGhcclxuY29uc3QgY2hhaV8xID0gcmVxdWlyZShcImNoYWlcIik7XHJcbmNvbnN0IHR5cGVtb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuY29uc3QgZGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvZGF0YXNjaWVuY2UvZGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXJcIik7XHJcbnN1aXRlKCdEYXRhIFNjaWVuY2UgU3VydmV5IEJhbm5lcicsICgpID0+IHtcclxuICAgIGxldCBhcHBTaGVsbDtcclxuICAgIGxldCBicm93c2VyO1xyXG4gICAgY29uc3QgdGFyZ2V0VXJpID0gJ2h0dHBzOi8vbWljcm9zb2Z0LmNvbSc7XHJcbiAgICBjb25zdCBtZXNzYWdlID0gJ0NhbiB5b3UgcGxlYXNlIHRha2UgMiBtaW51dGVzIHRvIHRlbGwgdXMgaG93IHRoZSBQeXRob24gRGF0YSBTY2llbmNlIGZlYXR1cmVzIGFyZSB3b3JraW5nIGZvciB5b3U/JztcclxuICAgIGNvbnN0IHllcyA9ICdZZXMsIHRha2Ugc3VydmV5IG5vdyc7XHJcbiAgICBjb25zdCBubyA9ICdObywgdGhhbmtzJztcclxuICAgIHNldHVwKCgpID0+IHtcclxuICAgICAgICBhcHBTaGVsbCA9IHR5cGVtb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBicm93c2VyID0gdHlwZW1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgfSk7XHJcbiAgICB0ZXN0KCdEYXRhIHNjaWVuY2UgYmFubmVyIHNob3VsZCBiZSBlbmFibGVkIGFmdGVyIHdlIGhpdCBvdXIgY29tbWFuZCBleGVjdXRpb24gY291bnQnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgZW5hYmxlZFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBhdHRlbXB0Q291bnRlciA9IDEwMDA7XHJcbiAgICAgICAgY29uc3QgdGVzdEJhbm5lciA9IHByZXBhcmVQb3B1cChhdHRlbXB0Q291bnRlciwgZW5hYmxlZFZhbHVlLCAwLCBhcHBTaGVsbC5vYmplY3QsIGJyb3dzZXIub2JqZWN0LCB0YXJnZXRVcmkpO1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVXJpID0gdGFyZ2V0VXJpO1xyXG4gICAgICAgIGxldCByZWNlaXZlZFVyaSA9ICcnO1xyXG4gICAgICAgIGJyb3dzZXIuc2V0dXAoYiA9PiBiLmxhdW5jaCh0eXBlbW9xLkl0LmlzKChhKSA9PiB7XHJcbiAgICAgICAgICAgIHJlY2VpdmVkVXJpID0gYTtcclxuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGV4cGVjdGVkVXJpO1xyXG4gICAgICAgIH0pKSkudmVyaWZpYWJsZSh0eXBlbW9xLlRpbWVzLm9uY2UoKSk7XHJcbiAgICAgICAgeWllbGQgdGVzdEJhbm5lci5sYXVuY2hTdXJ2ZXkoKTtcclxuICAgICAgICAvLyBUaGlzIGlzIHRlY2huaWNhbGx5IG5vdCBuZWNlc3NhcnksIGJ1dCBpdCBnaXZlc1xyXG4gICAgICAgIC8vIGJldHRlciBvdXRwdXQgdGhhbiB0aGUgLnZlcmlmeUFsbCBtZXNzYWdlcyBkby5cclxuICAgICAgICBjaGFpXzEuZXhwZWN0KHJlY2VpdmVkVXJpKS5pcy5lcXVhbChleHBlY3RlZFVyaSwgJ1VyaSBnaXZlbiB0byBsYXVuY2ggbW9jayBpcyBpbmNvcnJlY3QuJyk7XHJcbiAgICAgICAgLy8gdmVyaWZ5IHRoYXQgdGhlIGNhbGxzIGV4cGVjdGVkIHdlcmUgaW5kZWVkIG1hZGUuXHJcbiAgICAgICAgYnJvd3Nlci52ZXJpZnlBbGwoKTtcclxuICAgICAgICBicm93c2VyLnJlc2V0KCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdEbyBub3Qgc2hvdyBkYXRhIHNjaWVuY2UgYmFubmVyIHdoZW4gaXQgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgYXBwU2hlbGwuc2V0dXAoYSA9PiBhLnNob3dJbmZvcm1hdGlvbk1lc3NhZ2UodHlwZW1vcS5JdC5pc1ZhbHVlKG1lc3NhZ2UpLCB0eXBlbW9xLkl0LmlzVmFsdWUoeWVzKSwgdHlwZW1vcS5JdC5pc1ZhbHVlKG5vKSkpXHJcbiAgICAgICAgICAgIC52ZXJpZmlhYmxlKHR5cGVtb3EuVGltZXMubmV2ZXIoKSk7XHJcbiAgICAgICAgY29uc3QgZW5hYmxlZFZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgYXR0ZW1wdENvdW50ZXIgPSAwO1xyXG4gICAgICAgIGNvbnN0IHRlc3RCYW5uZXIgPSBwcmVwYXJlUG9wdXAoYXR0ZW1wdENvdW50ZXIsIGVuYWJsZWRWYWx1ZSwgMCwgYXBwU2hlbGwub2JqZWN0LCBicm93c2VyLm9iamVjdCwgdGFyZ2V0VXJpKTtcclxuICAgICAgICB0ZXN0QmFubmVyLnNob3dCYW5uZXIoKS5pZ25vcmVFcnJvcnMoKTtcclxuICAgIH0pO1xyXG4gICAgdGVzdCgnRG8gbm90IHNob3cgZGF0YSBzY2llbmNlIGJhbm5lciBpZiB3ZSBoYXZlIG5vdCBoaXQgb3VyIGNvbW1hbmQgY291bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgYXBwU2hlbGwuc2V0dXAoYSA9PiBhLnNob3dJbmZvcm1hdGlvbk1lc3NhZ2UodHlwZW1vcS5JdC5pc1ZhbHVlKG1lc3NhZ2UpLCB0eXBlbW9xLkl0LmlzVmFsdWUoeWVzKSwgdHlwZW1vcS5JdC5pc1ZhbHVlKG5vKSkpXHJcbiAgICAgICAgICAgIC52ZXJpZmlhYmxlKHR5cGVtb3EuVGltZXMubmV2ZXIoKSk7XHJcbiAgICAgICAgY29uc3QgZW5hYmxlZFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBhdHRlbXB0Q291bnRlciA9IDEwMDtcclxuICAgICAgICBjb25zdCB0ZXN0QmFubmVyID0gcHJlcGFyZVBvcHVwKGF0dGVtcHRDb3VudGVyLCBlbmFibGVkVmFsdWUsIDEwMDAsIGFwcFNoZWxsLm9iamVjdCwgYnJvd3Nlci5vYmplY3QsIHRhcmdldFVyaSk7XHJcbiAgICAgICAgdGVzdEJhbm5lci5zaG93QmFubmVyKCkuaWdub3JlRXJyb3JzKCk7XHJcbiAgICB9KTtcclxufSk7XHJcbmZ1bmN0aW9uIHByZXBhcmVQb3B1cChjb21tYW5kQ291bnRlciwgZW5hYmxlZFZhbHVlLCBjb21tYW5kVGhyZXNob2xkLCBhcHBTaGVsbCwgYnJvd3NlciwgdGFyZ2V0VXJpKSB7XHJcbiAgICBjb25zdCBteWZhY3RvcnkgPSB0eXBlbW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICBjb25zdCBlbmFibGVkVmFsU3RhdGUgPSB0eXBlbW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICBjb25zdCBhdHRlbXB0Q291bnRTdGF0ZSA9IHR5cGVtb3EuTW9jay5vZlR5cGUoKTtcclxuICAgIGVuYWJsZWRWYWxTdGF0ZS5zZXR1cChhID0+IGEudXBkYXRlVmFsdWUodHlwZW1vcS5JdC5pc1ZhbHVlKHRydWUpKSkucmV0dXJucygoKSA9PiB7XHJcbiAgICAgICAgZW5hYmxlZFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICAgIGVuYWJsZWRWYWxTdGF0ZS5zZXR1cChhID0+IGEudXBkYXRlVmFsdWUodHlwZW1vcS5JdC5pc1ZhbHVlKGZhbHNlKSkpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgIGVuYWJsZWRWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0pO1xyXG4gICAgYXR0ZW1wdENvdW50U3RhdGUuc2V0dXAoYSA9PiBhLnVwZGF0ZVZhbHVlKHR5cGVtb3EuSXQuaXNBbnlOdW1iZXIoKSkpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgIGNvbW1hbmRDb3VudGVyICs9IDE7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBlbmFibGVkVmFsU3RhdGUuc2V0dXAoYSA9PiBhLnZhbHVlKS5yZXR1cm5zKCgpID0+IGVuYWJsZWRWYWx1ZSk7XHJcbiAgICBhdHRlbXB0Q291bnRTdGF0ZS5zZXR1cChhID0+IGEudmFsdWUpLnJldHVybnMoKCkgPT4gY29tbWFuZENvdW50ZXIpO1xyXG4gICAgbXlmYWN0b3J5LnNldHVwKGEgPT4gYS5jcmVhdGVHbG9iYWxQZXJzaXN0ZW50U3RhdGUodHlwZW1vcS5JdC5pc1ZhbHVlKGRhdGFTY2llbmNlU3VydmV5QmFubmVyXzEuRFNTdXJ2ZXlTdGF0ZUtleXMuU2hvd0Jhbm5lciksIHR5cGVtb3EuSXQuaXNWYWx1ZSh0cnVlKSkpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBlbmFibGVkVmFsU3RhdGUub2JqZWN0O1xyXG4gICAgfSk7XHJcbiAgICBteWZhY3Rvcnkuc2V0dXAoYSA9PiBhLmNyZWF0ZUdsb2JhbFBlcnNpc3RlbnRTdGF0ZSh0eXBlbW9xLkl0LmlzVmFsdWUoZGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXJfMS5EU1N1cnZleVN0YXRlS2V5cy5TaG93QmFubmVyKSwgdHlwZW1vcS5JdC5pc1ZhbHVlKGZhbHNlKSkpLnJldHVybnMoKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBlbmFibGVkVmFsU3RhdGUub2JqZWN0O1xyXG4gICAgfSk7XHJcbiAgICBteWZhY3Rvcnkuc2V0dXAoYSA9PiBhLmNyZWF0ZUdsb2JhbFBlcnNpc3RlbnRTdGF0ZSh0eXBlbW9xLkl0LmlzVmFsdWUoZGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXJfMS5EU1N1cnZleVN0YXRlS2V5cy5TaG93QXR0ZW1wdENvdW50ZXIpLCB0eXBlbW9xLkl0LmlzQW55TnVtYmVyKCkpKS5yZXR1cm5zKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gYXR0ZW1wdENvdW50U3RhdGUub2JqZWN0O1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV3IGRhdGFTY2llbmNlU3VydmV5QmFubmVyXzEuRGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXIoYXBwU2hlbGwsIG15ZmFjdG9yeS5vYmplY3QsIGJyb3dzZXIsIGNvbW1hbmRUaHJlc2hvbGQsIHRhcmdldFVyaSk7XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YXNjaWVuY2VTdXJ2ZXlCYW5uZXIudW5pdC50ZXN0LmpzLm1hcCJdfQ==