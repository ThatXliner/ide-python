'use strict';

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
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

const vscode = require("vscode");

const telemetry_1 = require("../telemetry");

const constants_1 = require("../telemetry/constants");

const defProvider = require("./definitionProvider");

function activateGoToObjectDefinitionProvider(jediFactory) {
  const def = new PythonObjectDefinitionProvider(jediFactory);
  const commandRegistration = vscode.commands.registerCommand("python.goToPythonObject", () => def.goToObjectDefinition());
  return [def, commandRegistration];
}

exports.activateGoToObjectDefinitionProvider = activateGoToObjectDefinitionProvider;

class PythonObjectDefinitionProvider {
  constructor(jediFactory) {
    this._defProvider = new defProvider.PythonDefinitionProvider(jediFactory);
  }

  goToObjectDefinition() {
    return __awaiter(this, void 0, void 0, function* () {
      let pathDef = yield this.getObjectDefinition();

      if (typeof pathDef !== 'string' || pathDef.length === 0) {
        return;
      }

      let parts = pathDef.split('.');
      let source = '';
      let startColumn = 0;

      if (parts.length === 1) {
        source = `import ${parts[0]}`;
        startColumn = 'import '.length;
      } else {
        let mod = parts.shift();
        source = `from ${mod} import ${parts.join('.')}`;
        startColumn = `from ${mod} import `.length;
      }

      const range = new vscode.Range(0, startColumn, 0, source.length - 1);
      let doc = {
        fileName: 'test.py',
        lineAt: line => {
          return {
            text: source
          };
        },
        getWordRangeAtPosition: position => range,
        isDirty: true,
        getText: () => source
      };
      let tokenSource = new vscode.CancellationTokenSource();
      let defs = yield this._defProvider.provideDefinition(doc, range.start, tokenSource.token);

      if (defs === null) {
        yield vscode.window.showInformationMessage(`Definition not found for '${pathDef}'`);
        return;
      }

      let uri;
      let lineNumber;

      if (Array.isArray(defs) && defs.length > 0) {
        uri = defs[0].uri;
        lineNumber = defs[0].range.start.line;
      }

      if (!Array.isArray(defs) && defs.uri) {
        uri = defs.uri;
        lineNumber = defs.range.start.line;
      }

      if (uri) {
        let doc = yield vscode.workspace.openTextDocument(uri);
        yield vscode.window.showTextDocument(doc);
        yield vscode.commands.executeCommand('revealLine', {
          lineNumber: lineNumber,
          'at': 'top'
        });
      } else {
        yield vscode.window.showInformationMessage(`Definition not found for '${pathDef}'`);
      }
    });
  }

  intputValidation(value) {
    if (typeof value !== 'string') {
      return '';
    }

    value = value.trim();

    if (value.length === 0) {
      return '';
    }

    return null;
  }

  getObjectDefinition() {
    return __awaiter(this, void 0, void 0, function* () {
      let value = yield vscode.window.showInputBox({
        prompt: "Enter Object Path",
        validateInput: this.intputValidation
      });
      return value;
    });
  }

}

__decorate([telemetry_1.captureTelemetry(constants_1.GO_TO_OBJECT_DEFINITION)], PythonObjectDefinitionProvider.prototype, "goToObjectDefinition", null);

exports.PythonObjectDefinitionProvider = PythonObjectDefinitionProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdERlZmluaXRpb25Qcm92aWRlci5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsInZzY29kZSIsInJlcXVpcmUiLCJ0ZWxlbWV0cnlfMSIsImNvbnN0YW50c18xIiwiZGVmUHJvdmlkZXIiLCJhY3RpdmF0ZUdvVG9PYmplY3REZWZpbml0aW9uUHJvdmlkZXIiLCJqZWRpRmFjdG9yeSIsImRlZiIsIlB5dGhvbk9iamVjdERlZmluaXRpb25Qcm92aWRlciIsImNvbW1hbmRSZWdpc3RyYXRpb24iLCJjb21tYW5kcyIsInJlZ2lzdGVyQ29tbWFuZCIsImdvVG9PYmplY3REZWZpbml0aW9uIiwiY29uc3RydWN0b3IiLCJfZGVmUHJvdmlkZXIiLCJQeXRob25EZWZpbml0aW9uUHJvdmlkZXIiLCJwYXRoRGVmIiwiZ2V0T2JqZWN0RGVmaW5pdGlvbiIsInBhcnRzIiwic3BsaXQiLCJzb3VyY2UiLCJzdGFydENvbHVtbiIsIm1vZCIsInNoaWZ0Iiwiam9pbiIsInJhbmdlIiwiUmFuZ2UiLCJkb2MiLCJmaWxlTmFtZSIsImxpbmVBdCIsImxpbmUiLCJ0ZXh0IiwiZ2V0V29yZFJhbmdlQXRQb3NpdGlvbiIsInBvc2l0aW9uIiwiaXNEaXJ0eSIsImdldFRleHQiLCJ0b2tlblNvdXJjZSIsIkNhbmNlbGxhdGlvblRva2VuU291cmNlIiwiZGVmcyIsInByb3ZpZGVEZWZpbml0aW9uIiwic3RhcnQiLCJ0b2tlbiIsIndpbmRvdyIsInNob3dJbmZvcm1hdGlvbk1lc3NhZ2UiLCJ1cmkiLCJsaW5lTnVtYmVyIiwiQXJyYXkiLCJpc0FycmF5Iiwid29ya3NwYWNlIiwib3BlblRleHREb2N1bWVudCIsInNob3dUZXh0RG9jdW1lbnQiLCJleGVjdXRlQ29tbWFuZCIsImludHB1dFZhbGlkYXRpb24iLCJ0cmltIiwic2hvd0lucHV0Qm94IiwicHJvbXB0IiwidmFsaWRhdGVJbnB1dCIsImNhcHR1cmVUZWxlbWV0cnkiLCJHT19UT19PQkpFQ1RfREVGSU5JVElPTiIsInByb3RvdHlwZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsVUFBVSxHQUFJLFVBQVEsU0FBS0EsVUFBZCxJQUE2QixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ25GLE1BQUlDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFsQjtBQUFBLE1BQTBCQyxDQUFDLEdBQUdILENBQUMsR0FBRyxDQUFKLEdBQVFILE1BQVIsR0FBaUJFLElBQUksS0FBSyxJQUFULEdBQWdCQSxJQUFJLEdBQUdLLE1BQU0sQ0FBQ0Msd0JBQVAsQ0FBZ0NSLE1BQWhDLEVBQXdDQyxHQUF4QyxDQUF2QixHQUFzRUMsSUFBckg7QUFBQSxNQUEySE8sQ0FBM0g7QUFDQSxNQUFJLE9BQU9DLE9BQVAsS0FBbUIsUUFBbkIsSUFBK0IsT0FBT0EsT0FBTyxDQUFDQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxDQUFDLEdBQUdJLE9BQU8sQ0FBQ0MsUUFBUixDQUFpQlosVUFBakIsRUFBNkJDLE1BQTdCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsSUFBMUMsQ0FBSixDQUEzRSxLQUNLLEtBQUssSUFBSVUsQ0FBQyxHQUFHYixVQUFVLENBQUNNLE1BQVgsR0FBb0IsQ0FBakMsRUFBb0NPLENBQUMsSUFBSSxDQUF6QyxF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SVMsS0FBSyxHQUFHLE1BQU1VLE1BQU0sQ0FBQzBDLE1BQVAsQ0FBY1ksWUFBZCxDQUEyQjtBQUFFQyxRQUFBQSxNQUFNLEVBQUUsbUJBQVY7QUFBK0JDLFFBQUFBLGFBQWEsRUFBRSxLQUFLSjtBQUFuRCxPQUEzQixDQUFsQjtBQUNBLGFBQU85RCxLQUFQO0FBQ0gsS0FIZSxDQUFoQjtBQUlIOztBQXpFZ0M7O0FBMkVyQ3pCLFVBQVUsQ0FBQyxDQUNQcUMsV0FBVyxDQUFDdUQsZ0JBQVosQ0FBNkJ0RCxXQUFXLENBQUN1RCx1QkFBekMsQ0FETyxDQUFELEVBRVBsRCw4QkFBOEIsQ0FBQ21ELFNBRnhCLEVBRW1DLHNCQUZuQyxFQUUyRCxJQUYzRCxDQUFWOztBQUdBNUQsT0FBTyxDQUFDUyw4QkFBUixHQUF5Q0EsOEJBQXpDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHZzY29kZSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IHRlbGVtZXRyeV8xID0gcmVxdWlyZShcIi4uL3RlbGVtZXRyeVwiKTtcclxuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vdGVsZW1ldHJ5L2NvbnN0YW50c1wiKTtcclxuY29uc3QgZGVmUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9kZWZpbml0aW9uUHJvdmlkZXJcIik7XHJcbmZ1bmN0aW9uIGFjdGl2YXRlR29Ub09iamVjdERlZmluaXRpb25Qcm92aWRlcihqZWRpRmFjdG9yeSkge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IFB5dGhvbk9iamVjdERlZmluaXRpb25Qcm92aWRlcihqZWRpRmFjdG9yeSk7XHJcbiAgICBjb25zdCBjb21tYW5kUmVnaXN0cmF0aW9uID0gdnNjb2RlLmNvbW1hbmRzLnJlZ2lzdGVyQ29tbWFuZChcInB5dGhvbi5nb1RvUHl0aG9uT2JqZWN0XCIsICgpID0+IGRlZi5nb1RvT2JqZWN0RGVmaW5pdGlvbigpKTtcclxuICAgIHJldHVybiBbZGVmLCBjb21tYW5kUmVnaXN0cmF0aW9uXTtcclxufVxyXG5leHBvcnRzLmFjdGl2YXRlR29Ub09iamVjdERlZmluaXRpb25Qcm92aWRlciA9IGFjdGl2YXRlR29Ub09iamVjdERlZmluaXRpb25Qcm92aWRlcjtcclxuY2xhc3MgUHl0aG9uT2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGplZGlGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5fZGVmUHJvdmlkZXIgPSBuZXcgZGVmUHJvdmlkZXIuUHl0aG9uRGVmaW5pdGlvblByb3ZpZGVyKGplZGlGYWN0b3J5KTtcclxuICAgIH1cclxuICAgIGdvVG9PYmplY3REZWZpbml0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoRGVmID0geWllbGQgdGhpcy5nZXRPYmplY3REZWZpbml0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGF0aERlZiAhPT0gJ3N0cmluZycgfHwgcGF0aERlZi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcGFydHMgPSBwYXRoRGVmLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICAgIGxldCBzb3VyY2UgPSAnJztcclxuICAgICAgICAgICAgbGV0IHN0YXJ0Q29sdW1uID0gMDtcclxuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgc291cmNlID0gYGltcG9ydCAke3BhcnRzWzBdfWA7XHJcbiAgICAgICAgICAgICAgICBzdGFydENvbHVtbiA9ICdpbXBvcnQgJy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kID0gcGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IGBmcm9tICR7bW9kfSBpbXBvcnQgJHtwYXJ0cy5qb2luKCcuJyl9YDtcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uID0gYGZyb20gJHttb2R9IGltcG9ydCBgLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IG5ldyB2c2NvZGUuUmFuZ2UoMCwgc3RhcnRDb2x1bW4sIDAsIHNvdXJjZS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgbGV0IGRvYyA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAndGVzdC5weScsXHJcbiAgICAgICAgICAgICAgICBsaW5lQXQ6IChsaW5lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdGV4dDogc291cmNlIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0V29yZFJhbmdlQXRQb3NpdGlvbjogKHBvc2l0aW9uKSA9PiByYW5nZSxcclxuICAgICAgICAgICAgICAgIGlzRGlydHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBnZXRUZXh0OiAoKSA9PiBzb3VyY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHRva2VuU291cmNlID0gbmV3IHZzY29kZS5DYW5jZWxsYXRpb25Ub2tlblNvdXJjZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGVmcyA9IHlpZWxkIHRoaXMuX2RlZlByb3ZpZGVyLnByb3ZpZGVEZWZpbml0aW9uKGRvYywgcmFuZ2Uuc3RhcnQsIHRva2VuU291cmNlLnRva2VuKTtcclxuICAgICAgICAgICAgaWYgKGRlZnMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHZzY29kZS53aW5kb3cuc2hvd0luZm9ybWF0aW9uTWVzc2FnZShgRGVmaW5pdGlvbiBub3QgZm91bmQgZm9yICcke3BhdGhEZWZ9J2ApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB1cmk7XHJcbiAgICAgICAgICAgIGxldCBsaW5lTnVtYmVyO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZzKSAmJiBkZWZzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IGRlZnNbMF0udXJpO1xyXG4gICAgICAgICAgICAgICAgbGluZU51bWJlciA9IGRlZnNbMF0ucmFuZ2Uuc3RhcnQubGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGVmcykgJiYgZGVmcy51cmkpIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IGRlZnMudXJpO1xyXG4gICAgICAgICAgICAgICAgbGluZU51bWJlciA9IGRlZnMucmFuZ2Uuc3RhcnQubGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXJpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9jID0geWllbGQgdnNjb2RlLndvcmtzcGFjZS5vcGVuVGV4dERvY3VtZW50KHVyaSk7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCB2c2NvZGUud2luZG93LnNob3dUZXh0RG9jdW1lbnQoZG9jKTtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHZzY29kZS5jb21tYW5kcy5leGVjdXRlQ29tbWFuZCgncmV2ZWFsTGluZScsIHsgbGluZU51bWJlcjogbGluZU51bWJlciwgJ2F0JzogJ3RvcCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCB2c2NvZGUud2luZG93LnNob3dJbmZvcm1hdGlvbk1lc3NhZ2UoYERlZmluaXRpb24gbm90IGZvdW5kIGZvciAnJHtwYXRoRGVmfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaW50cHV0VmFsaWRhdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgZ2V0T2JqZWN0RGVmaW5pdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB5aWVsZCB2c2NvZGUud2luZG93LnNob3dJbnB1dEJveCh7IHByb21wdDogXCJFbnRlciBPYmplY3QgUGF0aFwiLCB2YWxpZGF0ZUlucHV0OiB0aGlzLmludHB1dFZhbGlkYXRpb24gfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIHRlbGVtZXRyeV8xLmNhcHR1cmVUZWxlbWV0cnkoY29uc3RhbnRzXzEuR09fVE9fT0JKRUNUX0RFRklOSVRJT04pXHJcbl0sIFB5dGhvbk9iamVjdERlZmluaXRpb25Qcm92aWRlci5wcm90b3R5cGUsIFwiZ29Ub09iamVjdERlZmluaXRpb25cIiwgbnVsbCk7XHJcbmV4cG9ydHMuUHl0aG9uT2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyID0gUHl0aG9uT2JqZWN0RGVmaW5pdGlvblByb3ZpZGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYmplY3REZWZpbml0aW9uUHJvdmlkZXIuanMubWFwIl19