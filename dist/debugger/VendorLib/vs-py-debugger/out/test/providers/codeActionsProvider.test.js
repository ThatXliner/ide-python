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

const TypeMoq = require("typemoq");

const vscode_1 = require("vscode");

const codeActionsProvider_1 = require("../../client/providers/codeActionsProvider");

suite('CodeAction Provider', () => {
  let codeActionsProvider;
  let document;
  let range;
  let context;
  let token;
  setup(() => {
    codeActionsProvider = new codeActionsProvider_1.PythonCodeActionProvider();
    document = TypeMoq.Mock.ofType();
    range = TypeMoq.Mock.ofType();
    context = TypeMoq.Mock.ofType();
    token = TypeMoq.Mock.ofType();
  });
  test('Ensure it always returns a source.organizeImports CodeAction', () => __awaiter(void 0, void 0, void 0, function* () {
    const codeActions = yield codeActionsProvider.provideCodeActions(document.object, range.object, context.object, token.object);

    if (!codeActions) {
      throw Error(`codeActionsProvider.provideCodeActions did not return an array (it returned ${codeActions})`);
    }

    const organizeImportsCodeAction = codeActions.filter(codeAction => codeAction.kind === vscode_1.CodeActionKind.SourceOrganizeImports);
    chai_1.expect(organizeImportsCodeAction).to.have.length(1);
    chai_1.expect(organizeImportsCodeAction[0].kind).to.eq(vscode_1.CodeActionKind.SourceOrganizeImports);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGVBY3Rpb25zUHJvdmlkZXIudGVzdC5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwiY2hhaV8xIiwicmVxdWlyZSIsIlR5cGVNb3EiLCJ2c2NvZGVfMSIsImNvZGVBY3Rpb25zUHJvdmlkZXJfMSIsInN1aXRlIiwiY29kZUFjdGlvbnNQcm92aWRlciIsImRvY3VtZW50IiwicmFuZ2UiLCJjb250ZXh0IiwidG9rZW4iLCJzZXR1cCIsIlB5dGhvbkNvZGVBY3Rpb25Qcm92aWRlciIsIk1vY2siLCJvZlR5cGUiLCJ0ZXN0IiwiY29kZUFjdGlvbnMiLCJwcm92aWRlQ29kZUFjdGlvbnMiLCJvYmplY3QiLCJFcnJvciIsIm9yZ2FuaXplSW1wb3J0c0NvZGVBY3Rpb24iLCJmaWx0ZXIiLCJjb2RlQWN0aW9uIiwia2luZCIsIkNvZGVBY3Rpb25LaW5kIiwiU291cmNlT3JnYW5pemVJbXBvcnRzIiwiZXhwZWN0IiwidG8iLCJoYXZlIiwibGVuZ3RoIiwiZXEiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxR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QyxJQUFYLEtBQW9CcEIsUUFBUSxDQUFDcUIsY0FBVCxDQUF3QkMscUJBQTdFLENBQWxDO0FBQ0F6QixJQUFBQSxNQUFNLENBQUMwQixNQUFQLENBQWNOLHlCQUFkLEVBQXlDTyxFQUF6QyxDQUE0Q0MsSUFBNUMsQ0FBaURDLE1BQWpELENBQXdELENBQXhEO0FBQ0E3QixJQUFBQSxNQUFNLENBQUMwQixNQUFQLENBQWNOLHlCQUF5QixDQUFDLENBQUQsQ0FBekIsQ0FBNkJHLElBQTNDLEVBQWlESSxFQUFqRCxDQUFvREcsRUFBcEQsQ0FBdUQzQixRQUFRLENBQUNxQixjQUFULENBQXdCQyxxQkFBL0U7QUFDSCxHQVJtRixDQUFoRixDQUFKO0FBU0gsQ0F0QkksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBjaGFpXzEgPSByZXF1aXJlKFwiY2hhaVwiKTtcclxuY29uc3QgVHlwZU1vcSA9IHJlcXVpcmUoXCJ0eXBlbW9xXCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IGNvZGVBY3Rpb25zUHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvcHJvdmlkZXJzL2NvZGVBY3Rpb25zUHJvdmlkZXJcIik7XHJcbnN1aXRlKCdDb2RlQWN0aW9uIFByb3ZpZGVyJywgKCkgPT4ge1xyXG4gICAgbGV0IGNvZGVBY3Rpb25zUHJvdmlkZXI7XHJcbiAgICBsZXQgZG9jdW1lbnQ7XHJcbiAgICBsZXQgcmFuZ2U7XHJcbiAgICBsZXQgY29udGV4dDtcclxuICAgIGxldCB0b2tlbjtcclxuICAgIHNldHVwKCgpID0+IHtcclxuICAgICAgICBjb2RlQWN0aW9uc1Byb3ZpZGVyID0gbmV3IGNvZGVBY3Rpb25zUHJvdmlkZXJfMS5QeXRob25Db2RlQWN0aW9uUHJvdmlkZXIoKTtcclxuICAgICAgICBkb2N1bWVudCA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICByYW5nZSA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICBjb250ZXh0ID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgIHRva2VuID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgfSk7XHJcbiAgICB0ZXN0KCdFbnN1cmUgaXQgYWx3YXlzIHJldHVybnMgYSBzb3VyY2Uub3JnYW5pemVJbXBvcnRzIENvZGVBY3Rpb24nLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgY29kZUFjdGlvbnMgPSB5aWVsZCBjb2RlQWN0aW9uc1Byb3ZpZGVyLnByb3ZpZGVDb2RlQWN0aW9ucyhkb2N1bWVudC5vYmplY3QsIHJhbmdlLm9iamVjdCwgY29udGV4dC5vYmplY3QsIHRva2VuLm9iamVjdCk7XHJcbiAgICAgICAgaWYgKCFjb2RlQWN0aW9ucykge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgY29kZUFjdGlvbnNQcm92aWRlci5wcm92aWRlQ29kZUFjdGlvbnMgZGlkIG5vdCByZXR1cm4gYW4gYXJyYXkgKGl0IHJldHVybmVkICR7Y29kZUFjdGlvbnN9KWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBvcmdhbml6ZUltcG9ydHNDb2RlQWN0aW9uID0gY29kZUFjdGlvbnMuZmlsdGVyKGNvZGVBY3Rpb24gPT4gY29kZUFjdGlvbi5raW5kID09PSB2c2NvZGVfMS5Db2RlQWN0aW9uS2luZC5Tb3VyY2VPcmdhbml6ZUltcG9ydHMpO1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3Qob3JnYW5pemVJbXBvcnRzQ29kZUFjdGlvbikudG8uaGF2ZS5sZW5ndGgoMSk7XHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChvcmdhbml6ZUltcG9ydHNDb2RlQWN0aW9uWzBdLmtpbmQpLnRvLmVxKHZzY29kZV8xLkNvZGVBY3Rpb25LaW5kLlNvdXJjZU9yZ2FuaXplSW1wb3J0cyk7XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2RlQWN0aW9uc1Byb3ZpZGVyLnRlc3QuanMubWFwIl19