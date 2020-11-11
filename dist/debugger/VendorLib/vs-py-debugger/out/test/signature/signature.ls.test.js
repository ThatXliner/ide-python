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

const assert = require("assert");

const path = require("path");

const vscode = require("vscode");

const common_1 = require("../common");

const constants_1 = require("../constants");

const initialize_1 = require("../initialize");

const serviceRegistry_1 = require("../unittests/serviceRegistry");

const autoCompPath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'pythonFiles', 'signature');

class SignatureHelpResult {
  constructor(line, index, signaturesCount, activeParameter, parameterName) {
    this.line = line;
    this.index = index;
    this.signaturesCount = signaturesCount;
    this.activeParameter = activeParameter;
    this.parameterName = parameterName;
  }

} // tslint:disable-next-line:max-func-body-length


suite('Signatures (Language Server)', () => {
  let isPython2;
  let ioc;
  suiteSetup(function () {
    return __awaiter(this, void 0, void 0, function* () {
      if (!constants_1.IsLanguageServerTest()) {
        // tslint:disable-next-line:no-invalid-this
        this.skip();
      }

      yield initialize_1.initialize();
      initializeDI();
      isPython2 = (yield ioc.getPythonMajorVersion(common_1.rootWorkspaceUri)) === 2;
    });
  });
  setup(initialize_1.initializeTest);
  suiteTeardown(initialize_1.closeActiveWindows);
  teardown(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initialize_1.closeActiveWindows();
    ioc.dispose();
  }));

  function initializeDI() {
    ioc = new serviceRegistry_1.UnitTestIocContainer();
    ioc.registerCommonTypes();
    ioc.registerVariableTypes();
    ioc.registerProcessTypes();
  }

  test('For ctor', () => __awaiter(void 0, void 0, void 0, function* () {
    const expected = [new SignatureHelpResult(5, 11, 1, -1, null), new SignatureHelpResult(5, 12, 1, 0, 'name'), new SignatureHelpResult(5, 13, 1, 0, 'name'), new SignatureHelpResult(5, 14, 1, 0, 'name'), new SignatureHelpResult(5, 15, 1, 0, 'name'), new SignatureHelpResult(5, 16, 1, 0, 'name'), new SignatureHelpResult(5, 17, 1, 0, 'name'), new SignatureHelpResult(5, 18, 1, 1, 'age'), new SignatureHelpResult(5, 19, 1, 1, 'age'), new SignatureHelpResult(5, 20, 1, -1, null)];
    const document = yield openDocument(path.join(autoCompPath, 'classCtor.py'));

    for (let i = 0; i < expected.length; i += 1) {
      yield checkSignature(expected[i], document.uri, i);
    }
  }));
  test('For intrinsic', () => __awaiter(void 0, void 0, void 0, function* () {
    const expected = [new SignatureHelpResult(0, 0, 1, -1, null), new SignatureHelpResult(0, 1, 1, -1, null), new SignatureHelpResult(0, 2, 1, -1, null), new SignatureHelpResult(0, 3, 1, -1, null), new SignatureHelpResult(0, 4, 1, -1, null), new SignatureHelpResult(0, 5, 1, -1, null), new SignatureHelpResult(0, 6, 1, 0, 'start'), new SignatureHelpResult(0, 7, 1, 0, 'start'), new SignatureHelpResult(0, 8, 1, 1, 'stop'), new SignatureHelpResult(0, 9, 1, 1, 'stop'), new SignatureHelpResult(0, 10, 1, 1, 'stop'), new SignatureHelpResult(0, 11, 1, 2, 'step')];
    const document = yield openDocument(path.join(autoCompPath, 'basicSig.py'));

    for (let i = 0; i < expected.length; i += 1) {
      yield checkSignature(expected[i], document.uri, i);
    }
  }));
  test('For ellipsis', function () {
    return __awaiter(this, void 0, void 0, function* () {
      if (isPython2) {
        // tslint:disable-next-line:no-invalid-this
        this.skip();
        return;
      }

      const expected = [new SignatureHelpResult(0, 5, 1, -1, null), new SignatureHelpResult(0, 6, 1, 0, 'value'), new SignatureHelpResult(0, 7, 1, 0, 'value'), new SignatureHelpResult(0, 8, 1, 1, '...'), new SignatureHelpResult(0, 9, 1, 1, '...'), new SignatureHelpResult(0, 10, 1, 1, '...'), new SignatureHelpResult(0, 11, 1, 2, 'sep'), new SignatureHelpResult(0, 12, 1, 2, 'sep')];
      const document = yield openDocument(path.join(autoCompPath, 'ellipsis.py'));

      for (let i = 0; i < expected.length; i += 1) {
        yield checkSignature(expected[i], document.uri, i);
      }
    });
  });
  test('For pow', () => __awaiter(void 0, void 0, void 0, function* () {
    let expected;

    if (isPython2) {
      expected = new SignatureHelpResult(0, 4, 1, 0, 'x');
    } else {
      expected = new SignatureHelpResult(0, 4, 1, 0, null);
    }

    const document = yield openDocument(path.join(autoCompPath, 'noSigPy3.py'));
    yield checkSignature(expected, document.uri, 0);
  }));
});

function openDocument(documentPath) {
  return __awaiter(this, void 0, void 0, function* () {
    const document = yield vscode.workspace.openTextDocument(documentPath);
    yield vscode.window.showTextDocument(document);
    return document;
  });
}

function checkSignature(expected, uri, caseIndex) {
  return __awaiter(this, void 0, void 0, function* () {
    const position = new vscode.Position(expected.line, expected.index);
    const actual = yield vscode.commands.executeCommand('vscode.executeSignatureHelpProvider', uri, position);
    assert.equal(actual.signatures.length, expected.signaturesCount, `Signature count does not match, case ${caseIndex}`);

    if (expected.signaturesCount > 0) {
      assert.equal(actual.activeParameter, expected.activeParameter, `Parameter index does not match, case ${caseIndex}`);

      if (expected.parameterName) {
        const parameter = actual.signatures[0].parameters[expected.activeParameter];
        assert.equal(parameter.label, expected.parameterName, `Parameter name is incorrect, case ${caseIndex}`);
      }
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ25hdHVyZS5scy50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJhc3NlcnQiLCJyZXF1aXJlIiwicGF0aCIsInZzY29kZSIsImNvbW1vbl8xIiwiY29uc3RhbnRzXzEiLCJpbml0aWFsaXplXzEiLCJzZXJ2aWNlUmVnaXN0cnlfMSIsImF1dG9Db21wUGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJTaWduYXR1cmVIZWxwUmVzdWx0IiwiY29uc3RydWN0b3IiLCJsaW5lIiwiaW5kZXgiLCJzaWduYXR1cmVzQ291bnQiLCJhY3RpdmVQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJOYW1lIiwic3VpdGUiLCJpc1B5dGhvbjIiLCJpb2MiLCJzdWl0ZVNldHVwIiwiSXNMYW5ndWFnZVNlcnZlclRlc3QiLCJza2lwIiwiaW5pdGlhbGl6ZSIsImluaXRpYWxpemVESSIsImdldFB5dGhvbk1ham9yVmVyc2lvbiIsInJvb3RXb3Jrc3BhY2VVcmkiLCJzZXR1cCIsImluaXRpYWxpemVUZXN0Iiwic3VpdGVUZWFyZG93biIsImNsb3NlQWN0aXZlV2luZG93cyIsInRlYXJkb3duIiwiZGlzcG9zZSIsIlVuaXRUZXN0SW9jQ29udGFpbmVyIiwicmVnaXN0ZXJDb21tb25UeXBlcyIsInJlZ2lzdGVyVmFyaWFibGVUeXBlcyIsInJlZ2lzdGVyUHJvY2Vzc1R5cGVzIiwidGVzdCIsImV4cGVjdGVkIiwiZG9jdW1lbnQiLCJvcGVuRG9jdW1lbnQiLCJpIiwibGVuZ3RoIiwiY2hlY2tTaWduYXR1cmUiLCJ1cmkiLCJkb2N1bWVudFBhdGgiLCJ3b3Jrc3BhY2UiLCJvcGVuVGV4dERvY3VtZW50Iiwid2luZG93Iiwic2hvd1RleHREb2N1bWVudCIsImNhc2VJbmRleCIsInBvc2l0aW9uIiwiUG9zaXRpb24iLCJhY3R1YWwiLCJjb21tYW5kcyIsImV4ZWN1dGVDb21tYW5kIiwiZXF1YWwiLCJzaWduYXR1cmVzIiwicGFyYW1ldGVyIiwicGFyYW1ldGVycyIsImxhYmVsIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFsQixFQUF5QjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CSyxLQUFuQixDQUFELENBQUo7QUFBa0MsT0FBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDOUYsYUFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFyQixHQUFzQyxJQUFJTixDQUFKLENBQU0sVUFBVUcsT0FB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O0FBQ0EsVUFBSVosUUFBUSxDQUFDdEIsYUFBYixFQUE0QjtBQUN4QixjQUFNMEMsU0FBUyxHQUFHTCxNQUFNLENBQUNJLFVBQVAsQ0FBa0IsQ0FBbEIsRUFBcUJFLFVBQXJCLENBQWdDckIsUUFBUSxDQUFDdkIsZUFBekMsQ0FBbEI7QUFDQWhCLFFBQUFBLE1BQU0sQ0FBQ3lELEtBQVAsQ0FBYUUsU0FBUyxDQUFDRSxLQUF2QixFQUE4QnRCLFFBQVEsQ0FBQ3RCLGFBQXZDLEVBQXVELHFDQUFvQ2tDLFNBQVUsRUFBckc7QUFDSDtBQUNKO0FBQ0osR0FYZSxDQUFoQjtBQVlIIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCB2c2NvZGUgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xyXG5jb25zdCBjb21tb25fMSA9IHJlcXVpcmUoXCIuLi9jb21tb25cIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcclxuY29uc3QgaW5pdGlhbGl6ZV8xID0gcmVxdWlyZShcIi4uL2luaXRpYWxpemVcIik7XHJcbmNvbnN0IHNlcnZpY2VSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4uL3VuaXR0ZXN0cy9zZXJ2aWNlUmVnaXN0cnlcIik7XHJcbmNvbnN0IGF1dG9Db21wUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdzcmMnLCAndGVzdCcsICdweXRob25GaWxlcycsICdzaWduYXR1cmUnKTtcclxuY2xhc3MgU2lnbmF0dXJlSGVscFJlc3VsdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaW5lLCBpbmRleCwgc2lnbmF0dXJlc0NvdW50LCBhY3RpdmVQYXJhbWV0ZXIsIHBhcmFtZXRlck5hbWUpIHtcclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLnNpZ25hdHVyZXNDb3VudCA9IHNpZ25hdHVyZXNDb3VudDtcclxuICAgICAgICB0aGlzLmFjdGl2ZVBhcmFtZXRlciA9IGFjdGl2ZVBhcmFtZXRlcjtcclxuICAgICAgICB0aGlzLnBhcmFtZXRlck5hbWUgPSBwYXJhbWV0ZXJOYW1lO1xyXG4gICAgfVxyXG59XHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtZnVuYy1ib2R5LWxlbmd0aFxyXG5zdWl0ZSgnU2lnbmF0dXJlcyAoTGFuZ3VhZ2UgU2VydmVyKScsICgpID0+IHtcclxuICAgIGxldCBpc1B5dGhvbjI7XHJcbiAgICBsZXQgaW9jO1xyXG4gICAgc3VpdGVTZXR1cChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgaWYgKCFjb25zdGFudHNfMS5Jc0xhbmd1YWdlU2VydmVyVGVzdCgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW52YWxpZC10aGlzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCBpbml0aWFsaXplXzEuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICBpbml0aWFsaXplREkoKTtcclxuICAgICAgICAgICAgaXNQeXRob24yID0gKHlpZWxkIGlvYy5nZXRQeXRob25NYWpvclZlcnNpb24oY29tbW9uXzEucm9vdFdvcmtzcGFjZVVyaSkpID09PSAyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBzZXR1cChpbml0aWFsaXplXzEuaW5pdGlhbGl6ZVRlc3QpO1xyXG4gICAgc3VpdGVUZWFyZG93bihpbml0aWFsaXplXzEuY2xvc2VBY3RpdmVXaW5kb3dzKTtcclxuICAgIHRlYXJkb3duKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB5aWVsZCBpbml0aWFsaXplXzEuY2xvc2VBY3RpdmVXaW5kb3dzKCk7XHJcbiAgICAgICAgaW9jLmRpc3Bvc2UoKTtcclxuICAgIH0pKTtcclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVESSgpIHtcclxuICAgICAgICBpb2MgPSBuZXcgc2VydmljZVJlZ2lzdHJ5XzEuVW5pdFRlc3RJb2NDb250YWluZXIoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJDb21tb25UeXBlcygpO1xyXG4gICAgICAgIGlvYy5yZWdpc3RlclZhcmlhYmxlVHlwZXMoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJQcm9jZXNzVHlwZXMoKTtcclxuICAgIH1cclxuICAgIHRlc3QoJ0ZvciBjdG9yJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkID0gW1xyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAxMSwgMSwgLTEsIG51bGwpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAxMiwgMSwgMCwgJ25hbWUnKSxcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoNSwgMTMsIDEsIDAsICduYW1lJyksXHJcbiAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDUsIDE0LCAxLCAwLCAnbmFtZScpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAxNSwgMSwgMCwgJ25hbWUnKSxcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoNSwgMTYsIDEsIDAsICduYW1lJyksXHJcbiAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDUsIDE3LCAxLCAwLCAnbmFtZScpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAxOCwgMSwgMSwgJ2FnZScpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAxOSwgMSwgMSwgJ2FnZScpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCg1LCAyMCwgMSwgLTEsIG51bGwpXHJcbiAgICAgICAgXTtcclxuICAgICAgICBjb25zdCBkb2N1bWVudCA9IHlpZWxkIG9wZW5Eb2N1bWVudChwYXRoLmpvaW4oYXV0b0NvbXBQYXRoLCAnY2xhc3NDdG9yLnB5JykpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwZWN0ZWQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgeWllbGQgY2hlY2tTaWduYXR1cmUoZXhwZWN0ZWRbaV0sIGRvY3VtZW50LnVyaSwgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG4gICAgdGVzdCgnRm9yIGludHJpbnNpYycsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgMCwgMSwgLTEsIG51bGwpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCAxLCAxLCAtMSwgbnVsbCksXHJcbiAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDIsIDEsIC0xLCBudWxsKSxcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgMywgMSwgLTEsIG51bGwpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCA0LCAxLCAtMSwgbnVsbCksXHJcbiAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDUsIDEsIC0xLCBudWxsKSxcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgNiwgMSwgMCwgJ3N0YXJ0JyksXHJcbiAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDcsIDEsIDAsICdzdGFydCcpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCA4LCAxLCAxLCAnc3RvcCcpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCA5LCAxLCAxLCAnc3RvcCcpLFxyXG4gICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCAxMCwgMSwgMSwgJ3N0b3AnKSxcclxuICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgMTEsIDEsIDIsICdzdGVwJylcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50ID0geWllbGQgb3BlbkRvY3VtZW50KHBhdGguam9pbihhdXRvQ29tcFBhdGgsICdiYXNpY1NpZy5weScpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cGVjdGVkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGNoZWNrU2lnbmF0dXJlKGV4cGVjdGVkW2ldLCBkb2N1bWVudC51cmksIGkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ0ZvciBlbGxpcHNpcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBpZiAoaXNQeXRob24yKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW52YWxpZC10aGlzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcclxuICAgICAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDUsIDEsIC0xLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDYsIDEsIDAsICd2YWx1ZScpLFxyXG4gICAgICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgNywgMSwgMCwgJ3ZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCA4LCAxLCAxLCAnLi4uJyksXHJcbiAgICAgICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCA5LCAxLCAxLCAnLi4uJyksXHJcbiAgICAgICAgICAgICAgICBuZXcgU2lnbmF0dXJlSGVscFJlc3VsdCgwLCAxMCwgMSwgMSwgJy4uLicpLFxyXG4gICAgICAgICAgICAgICAgbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgMTEsIDEsIDIsICdzZXAnKSxcclxuICAgICAgICAgICAgICAgIG5ldyBTaWduYXR1cmVIZWxwUmVzdWx0KDAsIDEyLCAxLCAyLCAnc2VwJylcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgZG9jdW1lbnQgPSB5aWVsZCBvcGVuRG9jdW1lbnQocGF0aC5qb2luKGF1dG9Db21wUGF0aCwgJ2VsbGlwc2lzLnB5JykpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cGVjdGVkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGVja1NpZ25hdHVyZShleHBlY3RlZFtpXSwgZG9jdW1lbnQudXJpLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB0ZXN0KCdGb3IgcG93JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBleHBlY3RlZDtcclxuICAgICAgICBpZiAoaXNQeXRob24yKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkID0gbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgNCwgMSwgMCwgJ3gnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkID0gbmV3IFNpZ25hdHVyZUhlbHBSZXN1bHQoMCwgNCwgMSwgMCwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50ID0geWllbGQgb3BlbkRvY3VtZW50KHBhdGguam9pbihhdXRvQ29tcFBhdGgsICdub1NpZ1B5My5weScpKTtcclxuICAgICAgICB5aWVsZCBjaGVja1NpZ25hdHVyZShleHBlY3RlZCwgZG9jdW1lbnQudXJpLCAwKTtcclxuICAgIH0pKTtcclxufSk7XHJcbmZ1bmN0aW9uIG9wZW5Eb2N1bWVudChkb2N1bWVudFBhdGgpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgZG9jdW1lbnQgPSB5aWVsZCB2c2NvZGUud29ya3NwYWNlLm9wZW5UZXh0RG9jdW1lbnQoZG9jdW1lbnRQYXRoKTtcclxuICAgICAgICB5aWVsZCB2c2NvZGUud2luZG93LnNob3dUZXh0RG9jdW1lbnQoZG9jdW1lbnQpO1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudDtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU2lnbmF0dXJlKGV4cGVjdGVkLCB1cmksIGNhc2VJbmRleCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyB2c2NvZGUuUG9zaXRpb24oZXhwZWN0ZWQubGluZSwgZXhwZWN0ZWQuaW5kZXgpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IHlpZWxkIHZzY29kZS5jb21tYW5kcy5leGVjdXRlQ29tbWFuZCgndnNjb2RlLmV4ZWN1dGVTaWduYXR1cmVIZWxwUHJvdmlkZXInLCB1cmksIHBvc2l0aW9uKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoYWN0dWFsLnNpZ25hdHVyZXMubGVuZ3RoLCBleHBlY3RlZC5zaWduYXR1cmVzQ291bnQsIGBTaWduYXR1cmUgY291bnQgZG9lcyBub3QgbWF0Y2gsIGNhc2UgJHtjYXNlSW5kZXh9YCk7XHJcbiAgICAgICAgaWYgKGV4cGVjdGVkLnNpZ25hdHVyZXNDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGFjdHVhbC5hY3RpdmVQYXJhbWV0ZXIsIGV4cGVjdGVkLmFjdGl2ZVBhcmFtZXRlciwgYFBhcmFtZXRlciBpbmRleCBkb2VzIG5vdCBtYXRjaCwgY2FzZSAke2Nhc2VJbmRleH1gKTtcclxuICAgICAgICAgICAgaWYgKGV4cGVjdGVkLnBhcmFtZXRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IGFjdHVhbC5zaWduYXR1cmVzWzBdLnBhcmFtZXRlcnNbZXhwZWN0ZWQuYWN0aXZlUGFyYW1ldGVyXTtcclxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChwYXJhbWV0ZXIubGFiZWwsIGV4cGVjdGVkLnBhcmFtZXRlck5hbWUsIGBQYXJhbWV0ZXIgbmFtZSBpcyBpbmNvcnJlY3QsIGNhc2UgJHtjYXNlSW5kZXh9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYXR1cmUubHMudGVzdC5qcy5tYXAiXX0=