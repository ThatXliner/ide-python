"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTERPRETER_LOCATOR_SERVICE = 'IInterpreterLocatorService';
exports.WINDOWS_REGISTRY_SERVICE = 'WindowsRegistryService';
exports.CONDA_ENV_FILE_SERVICE = 'CondaEnvFileService';
exports.CONDA_ENV_SERVICE = 'CondaEnvService';
exports.CURRENT_PATH_SERVICE = 'CurrentPathService';
exports.KNOWN_PATH_SERVICE = 'KnownPathsService';
exports.GLOBAL_VIRTUAL_ENV_SERVICE = 'VirtualEnvService';
exports.WORKSPACE_VIRTUAL_ENV_SERVICE = 'WorkspaceVirtualEnvService';
exports.PIPENV_SERVICE = 'PipEnvService';
exports.IInterpreterVersionService = Symbol('IInterpreterVersionService');
exports.IKnownSearchPathsForInterpreters = Symbol('IKnownSearchPathsForInterpreters');
exports.IVirtualEnvironmentsSearchPathProvider = Symbol('IVirtualEnvironmentsSearchPathProvider');
exports.IInterpreterLocatorService = Symbol('IInterpreterLocatorService');
exports.ICondaService = Symbol('ICondaService');
var InterpreterType;

(function (InterpreterType) {
  InterpreterType["Unknown"] = "Unknown";
  InterpreterType["Conda"] = "Conda";
  InterpreterType["VirtualEnv"] = "VirtualEnv";
  InterpreterType["PipEnv"] = "PipEnv";
  InterpreterType["Pyenv"] = "Pyenv";
  InterpreterType["Venv"] = "Venv";
})(InterpreterType = exports.InterpreterType || (exports.InterpreterType = {}));

exports.IInterpreterService = Symbol('IInterpreterService');
exports.IInterpreterDisplay = Symbol('IInterpreterDisplay');
exports.IShebangCodeLensProvider = Symbol('IShebangCodeLensProvider');
exports.IInterpreterHelper = Symbol('IInterpreterHelper');
exports.IPipEnvService = Symbol('IPipEnvService');
exports.IInterpreterLocatorHelper = Symbol('IInterpreterLocatorHelper');
exports.IInterpreterWatcher = Symbol('IInterpreterWatcher');
exports.IInterpreterWatcherBuilder = Symbol('IInterpreterWatcherBuilder');
exports.InterpreterLocatorProgressHandler = Symbol('InterpreterLocatorProgressHandler');
exports.IInterpreterLocatorProgressService = Symbol('IInterpreterLocatorProgressService');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWN0cy5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIklOVEVSUFJFVEVSX0xPQ0FUT1JfU0VSVklDRSIsIldJTkRPV1NfUkVHSVNUUllfU0VSVklDRSIsIkNPTkRBX0VOVl9GSUxFX1NFUlZJQ0UiLCJDT05EQV9FTlZfU0VSVklDRSIsIkNVUlJFTlRfUEFUSF9TRVJWSUNFIiwiS05PV05fUEFUSF9TRVJWSUNFIiwiR0xPQkFMX1ZJUlRVQUxfRU5WX1NFUlZJQ0UiLCJXT1JLU1BBQ0VfVklSVFVBTF9FTlZfU0VSVklDRSIsIlBJUEVOVl9TRVJWSUNFIiwiSUludGVycHJldGVyVmVyc2lvblNlcnZpY2UiLCJTeW1ib2wiLCJJS25vd25TZWFyY2hQYXRoc0ZvckludGVycHJldGVycyIsIklWaXJ0dWFsRW52aXJvbm1lbnRzU2VhcmNoUGF0aFByb3ZpZGVyIiwiSUludGVycHJldGVyTG9jYXRvclNlcnZpY2UiLCJJQ29uZGFTZXJ2aWNlIiwiSW50ZXJwcmV0ZXJUeXBlIiwiSUludGVycHJldGVyU2VydmljZSIsIklJbnRlcnByZXRlckRpc3BsYXkiLCJJU2hlYmFuZ0NvZGVMZW5zUHJvdmlkZXIiLCJJSW50ZXJwcmV0ZXJIZWxwZXIiLCJJUGlwRW52U2VydmljZSIsIklJbnRlcnByZXRlckxvY2F0b3JIZWxwZXIiLCJJSW50ZXJwcmV0ZXJXYXRjaGVyIiwiSUludGVycHJldGVyV2F0Y2hlckJ1aWxkZXIiLCJJbnRlcnByZXRlckxvY2F0b3JQcm9ncmVzc0hhbmRsZXIiLCJJSW50ZXJwcmV0ZXJMb2NhdG9yUHJvZ3Jlc3NTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBRCxPQUFPLENBQUNFLDJCQUFSLEdBQXNDLDRCQUF0QztBQUNBRixPQUFPLENBQUNHLHdCQUFSLEdBQW1DLHdCQUFuQztBQUNBSCxPQUFPLENBQUNJLHNCQUFSLEdBQWlDLHFCQUFqQztBQUNBSixPQUFPLENBQUNLLGlCQUFSLEdBQTRCLGlCQUE1QjtBQUNBTCxPQUFPLENBQUNNLG9CQUFSLEdBQStCLG9CQUEvQjtBQUNBTixPQUFPLENBQUNPLGtCQUFSLEdBQTZCLG1CQUE3QjtBQUNBUCxPQUFPLENBQUNRLDBCQUFSLEdBQXFDLG1CQUFyQztBQUNBUixPQUFPLENBQUNTLDZCQUFSLEdBQXdDLDRCQUF4QztBQUNBVCxPQUFPLENBQUNVLGNBQVIsR0FBeUIsZUFBekI7QUFDQVYsT0FBTyxDQUFDVywwQkFBUixHQUFxQ0MsTUFBTSxDQUFDLDRCQUFELENBQTNDO0FBQ0FaLE9BQU8sQ0FBQ2EsZ0NBQVIsR0FBMkNELE1BQU0sQ0FBQyxrQ0FBRCxDQUFqRDtBQUNBWixPQUFPLENBQUNjLHNDQUFSLEdBQWlERixNQUFNLENBQUMsd0NBQUQsQ0FBdkQ7QUFDQVosT0FBTyxDQUFDZSwwQkFBUixHQUFxQ0gsTUFBTSxDQUFDLDRCQUFELENBQTNDO0FBQ0FaLE9BQU8sQ0FBQ2dCLGFBQVIsR0FBd0JKLE1BQU0sQ0FBQyxlQUFELENBQTlCO0FBQ0EsSUFBSUssZUFBSjs7QUFDQSxDQUFDLFVBQVVBLGVBQVYsRUFBMkI7QUFDeEJBLEVBQUFBLGVBQWUsQ0FBQyxTQUFELENBQWYsR0FBNkIsU0FBN0I7QUFDQUEsRUFBQUEsZUFBZSxDQUFDLE9BQUQsQ0FBZixHQUEyQixPQUEzQjtBQUNBQSxFQUFBQSxlQUFlLENBQUMsWUFBRCxDQUFmLEdBQWdDLFlBQWhDO0FBQ0FBLEVBQUFBLGVBQWUsQ0FBQyxRQUFELENBQWYsR0FBNEIsUUFBNUI7QUFDQUEsRUFBQUEsZUFBZSxDQUFDLE9BQUQsQ0FBZixHQUEyQixPQUEzQjtBQUNBQSxFQUFBQSxlQUFlLENBQUMsTUFBRCxDQUFmLEdBQTBCLE1BQTFCO0FBQ0gsQ0FQRCxFQU9HQSxlQUFlLEdBQUdqQixPQUFPLENBQUNpQixlQUFSLEtBQTRCakIsT0FBTyxDQUFDaUIsZUFBUixHQUEwQixFQUF0RCxDQVByQjs7QUFRQWpCLE9BQU8sQ0FBQ2tCLG1CQUFSLEdBQThCTixNQUFNLENBQUMscUJBQUQsQ0FBcEM7QUFDQVosT0FBTyxDQUFDbUIsbUJBQVIsR0FBOEJQLE1BQU0sQ0FBQyxxQkFBRCxDQUFwQztBQUNBWixPQUFPLENBQUNvQix3QkFBUixHQUFtQ1IsTUFBTSxDQUFDLDBCQUFELENBQXpDO0FBQ0FaLE9BQU8sQ0FBQ3FCLGtCQUFSLEdBQTZCVCxNQUFNLENBQUMsb0JBQUQsQ0FBbkM7QUFDQVosT0FBTyxDQUFDc0IsY0FBUixHQUF5QlYsTUFBTSxDQUFDLGdCQUFELENBQS9CO0FBQ0FaLE9BQU8sQ0FBQ3VCLHlCQUFSLEdBQW9DWCxNQUFNLENBQUMsMkJBQUQsQ0FBMUM7QUFDQVosT0FBTyxDQUFDd0IsbUJBQVIsR0FBOEJaLE1BQU0sQ0FBQyxxQkFBRCxDQUFwQztBQUNBWixPQUFPLENBQUN5QiwwQkFBUixHQUFxQ2IsTUFBTSxDQUFDLDRCQUFELENBQTNDO0FBQ0FaLE9BQU8sQ0FBQzBCLGlDQUFSLEdBQTRDZCxNQUFNLENBQUMsbUNBQUQsQ0FBbEQ7QUFDQVosT0FBTyxDQUFDMkIsa0NBQVIsR0FBNkNmLE1BQU0sQ0FBQyxvQ0FBRCxDQUFuRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuSU5URVJQUkVURVJfTE9DQVRPUl9TRVJWSUNFID0gJ0lJbnRlcnByZXRlckxvY2F0b3JTZXJ2aWNlJztcclxuZXhwb3J0cy5XSU5ET1dTX1JFR0lTVFJZX1NFUlZJQ0UgPSAnV2luZG93c1JlZ2lzdHJ5U2VydmljZSc7XHJcbmV4cG9ydHMuQ09OREFfRU5WX0ZJTEVfU0VSVklDRSA9ICdDb25kYUVudkZpbGVTZXJ2aWNlJztcclxuZXhwb3J0cy5DT05EQV9FTlZfU0VSVklDRSA9ICdDb25kYUVudlNlcnZpY2UnO1xyXG5leHBvcnRzLkNVUlJFTlRfUEFUSF9TRVJWSUNFID0gJ0N1cnJlbnRQYXRoU2VydmljZSc7XHJcbmV4cG9ydHMuS05PV05fUEFUSF9TRVJWSUNFID0gJ0tub3duUGF0aHNTZXJ2aWNlJztcclxuZXhwb3J0cy5HTE9CQUxfVklSVFVBTF9FTlZfU0VSVklDRSA9ICdWaXJ0dWFsRW52U2VydmljZSc7XHJcbmV4cG9ydHMuV09SS1NQQUNFX1ZJUlRVQUxfRU5WX1NFUlZJQ0UgPSAnV29ya3NwYWNlVmlydHVhbEVudlNlcnZpY2UnO1xyXG5leHBvcnRzLlBJUEVOVl9TRVJWSUNFID0gJ1BpcEVudlNlcnZpY2UnO1xyXG5leHBvcnRzLklJbnRlcnByZXRlclZlcnNpb25TZXJ2aWNlID0gU3ltYm9sKCdJSW50ZXJwcmV0ZXJWZXJzaW9uU2VydmljZScpO1xyXG5leHBvcnRzLklLbm93blNlYXJjaFBhdGhzRm9ySW50ZXJwcmV0ZXJzID0gU3ltYm9sKCdJS25vd25TZWFyY2hQYXRoc0ZvckludGVycHJldGVycycpO1xyXG5leHBvcnRzLklWaXJ0dWFsRW52aXJvbm1lbnRzU2VhcmNoUGF0aFByb3ZpZGVyID0gU3ltYm9sKCdJVmlydHVhbEVudmlyb25tZW50c1NlYXJjaFBhdGhQcm92aWRlcicpO1xyXG5leHBvcnRzLklJbnRlcnByZXRlckxvY2F0b3JTZXJ2aWNlID0gU3ltYm9sKCdJSW50ZXJwcmV0ZXJMb2NhdG9yU2VydmljZScpO1xyXG5leHBvcnRzLklDb25kYVNlcnZpY2UgPSBTeW1ib2woJ0lDb25kYVNlcnZpY2UnKTtcclxudmFyIEludGVycHJldGVyVHlwZTtcclxuKGZ1bmN0aW9uIChJbnRlcnByZXRlclR5cGUpIHtcclxuICAgIEludGVycHJldGVyVHlwZVtcIlVua25vd25cIl0gPSBcIlVua25vd25cIjtcclxuICAgIEludGVycHJldGVyVHlwZVtcIkNvbmRhXCJdID0gXCJDb25kYVwiO1xyXG4gICAgSW50ZXJwcmV0ZXJUeXBlW1wiVmlydHVhbEVudlwiXSA9IFwiVmlydHVhbEVudlwiO1xyXG4gICAgSW50ZXJwcmV0ZXJUeXBlW1wiUGlwRW52XCJdID0gXCJQaXBFbnZcIjtcclxuICAgIEludGVycHJldGVyVHlwZVtcIlB5ZW52XCJdID0gXCJQeWVudlwiO1xyXG4gICAgSW50ZXJwcmV0ZXJUeXBlW1wiVmVudlwiXSA9IFwiVmVudlwiO1xyXG59KShJbnRlcnByZXRlclR5cGUgPSBleHBvcnRzLkludGVycHJldGVyVHlwZSB8fCAoZXhwb3J0cy5JbnRlcnByZXRlclR5cGUgPSB7fSkpO1xyXG5leHBvcnRzLklJbnRlcnByZXRlclNlcnZpY2UgPSBTeW1ib2woJ0lJbnRlcnByZXRlclNlcnZpY2UnKTtcclxuZXhwb3J0cy5JSW50ZXJwcmV0ZXJEaXNwbGF5ID0gU3ltYm9sKCdJSW50ZXJwcmV0ZXJEaXNwbGF5Jyk7XHJcbmV4cG9ydHMuSVNoZWJhbmdDb2RlTGVuc1Byb3ZpZGVyID0gU3ltYm9sKCdJU2hlYmFuZ0NvZGVMZW5zUHJvdmlkZXInKTtcclxuZXhwb3J0cy5JSW50ZXJwcmV0ZXJIZWxwZXIgPSBTeW1ib2woJ0lJbnRlcnByZXRlckhlbHBlcicpO1xyXG5leHBvcnRzLklQaXBFbnZTZXJ2aWNlID0gU3ltYm9sKCdJUGlwRW52U2VydmljZScpO1xyXG5leHBvcnRzLklJbnRlcnByZXRlckxvY2F0b3JIZWxwZXIgPSBTeW1ib2woJ0lJbnRlcnByZXRlckxvY2F0b3JIZWxwZXInKTtcclxuZXhwb3J0cy5JSW50ZXJwcmV0ZXJXYXRjaGVyID0gU3ltYm9sKCdJSW50ZXJwcmV0ZXJXYXRjaGVyJyk7XHJcbmV4cG9ydHMuSUludGVycHJldGVyV2F0Y2hlckJ1aWxkZXIgPSBTeW1ib2woJ0lJbnRlcnByZXRlcldhdGNoZXJCdWlsZGVyJyk7XHJcbmV4cG9ydHMuSW50ZXJwcmV0ZXJMb2NhdG9yUHJvZ3Jlc3NIYW5kbGVyID0gU3ltYm9sKCdJbnRlcnByZXRlckxvY2F0b3JQcm9ncmVzc0hhbmRsZXInKTtcclxuZXhwb3J0cy5JSW50ZXJwcmV0ZXJMb2NhdG9yUHJvZ3Jlc3NTZXJ2aWNlID0gU3ltYm9sKCdJSW50ZXJwcmV0ZXJMb2NhdG9yUHJvZ3Jlc3NTZXJ2aWNlJyk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnRyYWN0cy5qcy5tYXAiXX0=