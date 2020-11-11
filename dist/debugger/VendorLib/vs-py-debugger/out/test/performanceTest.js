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
/*
Comparing performance metrics is not easy (the metrics can and always get skewed).
One approach is to run the tests multile times and gather multiple sample data.
For Extension activation times, we load both extensions x times, and re-load the window y times in each x load.
I.e. capture averages by giving the extensions sufficient time to warm up.
This block of code merely launches the tests by using either the dev or release version of the extension,
and spawning the tests (mimic user starting tests from command line), this way we can run tests multiple times.
*/
// tslint:disable:no-console no-require-imports no-var-requires

const child_process_1 = require("child_process");

const download = require("download");

const fs = require("fs-extra");

const path = require("path");

const request = require("request");

const constants_1 = require("../client/common/constants");

const NamedRegexp = require('named-js-regexp');

const StreamZip = require('node-stream-zip');

const del = require('del');

const tmpFolder = path.join(constants_1.EXTENSION_ROOT_DIR, 'tmp');
const publishedExtensionPath = path.join(tmpFolder, 'ext', 'testReleaseExtensionsFolder');
const logFilesPath = path.join(tmpFolder, 'test', 'logs');
var Version;

(function (Version) {
  Version[Version["Dev"] = 0] = "Dev";
  Version[Version["Release"] = 1] = "Release";
})(Version || (Version = {}));

class TestRunner {
  start() {
    return __awaiter(this, void 0, void 0, function* () {
      yield del([path.join(tmpFolder, '**')]);
      yield this.extractLatestExtension(publishedExtensionPath);
      const timesToLoadEachVersion = 2;
      const devLogFiles = [];
      const releaseLogFiles = [];
      const languageServerLogFiles = [];

      for (let i = 0; i < timesToLoadEachVersion; i += 1) {
        yield this.enableLanguageServer(false);
        const devLogFile = path.join(logFilesPath, `dev_loadtimes${i}.txt`);
        console.log(`Start Performance Tests: Counter ${i}, for Dev version with Jedi`);
        yield this.capturePerfTimes(Version.Dev, devLogFile);
        devLogFiles.push(devLogFile);
        const releaseLogFile = path.join(logFilesPath, `release_loadtimes${i}.txt`);
        console.log(`Start Performance Tests: Counter ${i}, for Release version with Jedi`);
        yield this.capturePerfTimes(Version.Release, releaseLogFile);
        releaseLogFiles.push(releaseLogFile); // Language server.

        yield this.enableLanguageServer(true);
        const languageServerLogFile = path.join(logFilesPath, `languageServer_loadtimes${i}.txt`);
        console.log(`Start Performance Tests: Counter ${i}, for Release version with Language Server`);
        yield this.capturePerfTimes(Version.Release, languageServerLogFile);
        languageServerLogFiles.push(languageServerLogFile);
      }

      console.log('Compare Performance Results');
      yield this.runPerfTest(devLogFiles, releaseLogFiles, languageServerLogFiles);
    });
  }

  enableLanguageServer(enable) {
    return __awaiter(this, void 0, void 0, function* () {
      const settings = `{ "python.jediEnabled": ${!enable} }`;
      yield fs.writeFile(path.join(constants_1.EXTENSION_ROOT_DIR, 'src', 'test', 'performance', 'settings.json'), settings);
    });
  }

  capturePerfTimes(version, logFile) {
    return __awaiter(this, void 0, void 0, function* () {
      const releaseVersion = yield this.getReleaseVersion();
      const devVersion = yield this.getDevVersion();
      yield fs.ensureDir(path.dirname(logFile));
      const env = {
        ACTIVATION_TIMES_LOG_FILE_PATH: logFile,
        ACTIVATION_TIMES_EXT_VERSION: version === Version.Release ? releaseVersion : devVersion,
        CODE_EXTENSIONS_PATH: version === Version.Release ? publishedExtensionPath : constants_1.EXTENSION_ROOT_DIR
      };
      yield this.launchTest(env);
    });
  }

  runPerfTest(devLogFiles, releaseLogFiles, languageServerLogFiles) {
    return __awaiter(this, void 0, void 0, function* () {
      const env = {
        ACTIVATION_TIMES_DEV_LOG_FILE_PATHS: JSON.stringify(devLogFiles),
        ACTIVATION_TIMES_RELEASE_LOG_FILE_PATHS: JSON.stringify(releaseLogFiles),
        ACTIVATION_TIMES_DEV_LANGUAGE_SERVER_LOG_FILE_PATHS: JSON.stringify(languageServerLogFiles)
      };
      yield this.launchTest(env);
    });
  }

  launchTest(customEnvVars) {
    return __awaiter(this, void 0, void 0, function* () {
      yield new Promise((resolve, reject) => {
        const env = Object.assign({
          TEST_FILES_SUFFIX: 'perf.test',
          CODE_TESTS_WORKSPACE: path.join(constants_1.EXTENSION_ROOT_DIR, 'src', 'test', 'performance')
        }, process.env, customEnvVars);
        const proc = child_process_1.spawn('node', [path.join(__dirname, 'standardTest.js')], {
          cwd: constants_1.EXTENSION_ROOT_DIR,
          env
        });
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
        proc.on('error', reject);
        proc.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(`Failed with code ${code}.`);
          }
        });
      });
    });
  }

  extractLatestExtension(targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
      const extensionFile = yield this.downloadExtension();
      yield this.unzip(extensionFile, targetDir);
    });
  }

  getReleaseVersion() {
    return __awaiter(this, void 0, void 0, function* () {
      const url = `https://marketplace.visualstudio.com/items?itemName=${constants_1.PVSC_EXTENSION_ID}`;
      const content = yield new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (response.statusCode === 200) {
            return resolve(body);
          }

          reject(`Status code of ${response.statusCode} received.`);
        });
      });
      const re = NamedRegexp('"version"\S?:\S?"(:<version>\\d{4}\\.\\d{1,2}\\.\\d{1,2})"', 'g');
      const matches = re.exec(content);
      return matches.groups().version;
    });
  }

  getDevVersion() {
    return __awaiter(this, void 0, void 0, function* () {
      // tslint:disable-next-line:non-literal-require
      return require(path.join(constants_1.EXTENSION_ROOT_DIR, 'package.json')).version;
    });
  }

  unzip(zipFile, targetFolder) {
    return __awaiter(this, void 0, void 0, function* () {
      yield fs.ensureDir(targetFolder);
      return new Promise((resolve, reject) => {
        const zip = new StreamZip({
          file: zipFile,
          storeEntries: true
        });
        zip.on('ready', () => __awaiter(this, void 0, void 0, function* () {
          zip.extract('extension', targetFolder, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }

            zip.close();
          });
        }));
      });
    });
  }

  downloadExtension() {
    return __awaiter(this, void 0, void 0, function* () {
      const version = yield this.getReleaseVersion();
      const url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ms-python/vsextensions/python/${version}/vspackage`;
      const destination = path.join(__dirname, `extension${version}.zip`);

      if (yield fs.pathExists(destination)) {
        return destination;
      }

      yield download(url, path.dirname(destination), {
        filename: path.basename(destination)
      });
      return destination;
    });
  }

}

new TestRunner().start().catch(ex => console.error('Error in running Performance Tests', ex));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcmZvcm1hbmNlVGVzdC5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwiY2hpbGRfcHJvY2Vzc18xIiwicmVxdWlyZSIsImRvd25sb2FkIiwiZnMiLCJwYXRoIiwicmVxdWVzdCIsImNvbnN0YW50c18xIiwiTmFtZWRSZWdleHAiLCJTdHJlYW1aaXAiLCJkZWwiLCJ0bXBGb2xkZXIiLCJqb2luIiwiRVhURU5TSU9OX1JPT1RfRElSIiwicHVibGlzaGVkRXh0ZW5zaW9uUGF0aCIsImxvZ0ZpbGVzUGF0aCIsIlZlcnNpb24iLCJUZXN0UnVubmVyIiwic3RhcnQiLCJleHRyYWN0TGF0ZXN0RXh0ZW5zaW9uIiwidGltZXNUb0xvYWRFYWNoVmVyc2lvbiIsImRldkxvZ0ZpbGVzIiwicmVsZWFzZUxvZ0ZpbGVzIiwibGFuZ3VhZ2VTZXJ2ZXJMb2dGaWxlcyIsImkiLCJlbmFibGVMYW5ndWFnZVNlcnZlciIsImRldkxvZ0ZpbGUiLCJjb25zb2xlIiwibG9nIiwiY2FwdHVyZVBlcmZUaW1lcyIsIkRldiIsInB1c2giLCJyZWxlYXNlTG9nRmlsZSIsIlJlbGVhc2UiLCJsYW5ndWFnZVNlcnZlckxvZ0ZpbGUiLCJydW5QZXJmVGVzdCIsImVuYWJsZSIsInNldHRpbmdzIiwid3JpdGVGaWxlIiwidmVyc2lvbiIsImxvZ0ZpbGUiLCJyZWxlYXNlVmVyc2lvbiIsImdldFJlbGVhc2VWZXJzaW9uIiwiZGV2VmVyc2lvbiIsImdldERldlZlcnNpb24iLCJlbnN1cmVEaXIiLCJkaXJuYW1lIiwiZW52IiwiQUNUSVZBVElPTl9USU1FU19MT0dfRklMRV9QQVRIIiwiQUNUSVZBVElPTl9USU1FU19FWFRfVkVSU0lPTiIsIkNPREVfRVhURU5TSU9OU19QQVRIIiwibGF1bmNoVGVzdCIsIkFDVElWQVRJT05fVElNRVNfREVWX0xPR19GSUxFX1BBVEhTIiwiSlNPTiIsInN0cmluZ2lmeSIsIkFDVElWQVRJT05fVElNRVNfUkVMRUFTRV9MT0dfRklMRV9QQVRIUyIsIkFDVElWQVRJT05fVElNRVNfREVWX0xBTkdVQUdFX1NFUlZFUl9MT0dfRklMRV9QQVRIUyIsImN1c3RvbUVudlZhcnMiLCJhc3NpZ24iLCJURVNUX0ZJTEVTX1NVRkZJWCIsIkNPREVfVEVTVFNfV09SS1NQQUNFIiwicHJvY2VzcyIsInByb2MiLCJzcGF3biIsIl9fZGlybmFtZSIsImN3ZCIsInN0ZG91dCIsInBpcGUiLCJzdGRlcnIiLCJvbiIsImNvZGUiLCJ0YXJnZXREaXIiLCJleHRlbnNpb25GaWxlIiwiZG93bmxvYWRFeHRlbnNpb24iLCJ1bnppcCIsInVybCIsIlBWU0NfRVhURU5TSU9OX0lEIiwiY29udGVudCIsImVycm9yIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsInJlIiwibWF0Y2hlcyIsImV4ZWMiLCJncm91cHMiLCJ6aXBGaWxlIiwidGFyZ2V0Rm9sZGVyIiwiemlwIiwiZmlsZSIsInN0b3JlRW50cmllcyIsImV4dHJhY3QiLCJlcnIiLCJjbG9zZSIsImRlc3RpbmF0aW9uIiwicGF0aEV4aXN0cyIsImZpbGVuYW1lIiwiYmFzZW5hbWUiLCJjYXRjaCIsImV4Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFT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O0FBQ1Y7O0FBQ0RzRyxZQUFBQSxHQUFHLENBQUNLLEtBQUo7QUFDSCxXQVJEO0FBU0gsU0FWOEIsQ0FBL0I7QUFXSCxPQWhCTSxDQUFQO0FBaUJILEtBbkJlLENBQWhCO0FBb0JIOztBQUNEcEIsRUFBQUEsaUJBQWlCLEdBQUc7QUFDaEIsV0FBTzdGLFNBQVMsQ0FBQyxJQUFELEVBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ2hELFlBQU0yRCxPQUFPLEdBQUcsTUFBTSxLQUFLRyxpQkFBTCxFQUF0QjtBQUNBLFlBQU1pQyxHQUFHLEdBQUksc0dBQXFHcEMsT0FBUSxZQUExSDtBQUNBLFlBQU11RCxXQUFXLEdBQUd6RixJQUFJLENBQUNPLElBQUwsQ0FBVW9ELFNBQVYsRUFBc0IsWUFBV3pCLE9BQVEsTUFBekMsQ0FBcEI7O0FBQ0EsVUFBSSxNQUFNbkMsRUFBRSxDQUFDMkYsVUFBSCxDQUFjRCxXQUFkLENBQVYsRUFBc0M7QUFDbEMsZUFBT0EsV0FBUDtBQUNIOztBQUNELFlBQU0zRixRQUFRLENBQUN3RSxHQUFELEVBQU10RSxJQUFJLENBQUN5QyxPQUFMLENBQWFnRCxXQUFiLENBQU4sRUFBaUM7QUFBRUUsUUFBQUEsUUFBUSxFQUFFM0YsSUFBSSxDQUFDNEYsUUFBTCxDQUFjSCxXQUFkO0FBQVosT0FBakMsQ0FBZDtBQUNBLGFBQU9BLFdBQVA7QUFDSCxLQVRlLENBQWhCO0FBVUg7O0FBOUlZOztBQWdKakIsSUFBSTdFLFVBQUosR0FBaUJDLEtBQWpCLEdBQXlCZ0YsS0FBekIsQ0FBK0JDLEVBQUUsSUFBSXhFLE9BQU8sQ0FBQ21ELEtBQVIsQ0FBYyxvQ0FBZCxFQUFvRHFCLEVBQXBELENBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qXHJcbkNvbXBhcmluZyBwZXJmb3JtYW5jZSBtZXRyaWNzIGlzIG5vdCBlYXN5ICh0aGUgbWV0cmljcyBjYW4gYW5kIGFsd2F5cyBnZXQgc2tld2VkKS5cclxuT25lIGFwcHJvYWNoIGlzIHRvIHJ1biB0aGUgdGVzdHMgbXVsdGlsZSB0aW1lcyBhbmQgZ2F0aGVyIG11bHRpcGxlIHNhbXBsZSBkYXRhLlxyXG5Gb3IgRXh0ZW5zaW9uIGFjdGl2YXRpb24gdGltZXMsIHdlIGxvYWQgYm90aCBleHRlbnNpb25zIHggdGltZXMsIGFuZCByZS1sb2FkIHRoZSB3aW5kb3cgeSB0aW1lcyBpbiBlYWNoIHggbG9hZC5cclxuSS5lLiBjYXB0dXJlIGF2ZXJhZ2VzIGJ5IGdpdmluZyB0aGUgZXh0ZW5zaW9ucyBzdWZmaWNpZW50IHRpbWUgdG8gd2FybSB1cC5cclxuVGhpcyBibG9jayBvZiBjb2RlIG1lcmVseSBsYXVuY2hlcyB0aGUgdGVzdHMgYnkgdXNpbmcgZWl0aGVyIHRoZSBkZXYgb3IgcmVsZWFzZSB2ZXJzaW9uIG9mIHRoZSBleHRlbnNpb24sXHJcbmFuZCBzcGF3bmluZyB0aGUgdGVzdHMgKG1pbWljIHVzZXIgc3RhcnRpbmcgdGVzdHMgZnJvbSBjb21tYW5kIGxpbmUpLCB0aGlzIHdheSB3ZSBjYW4gcnVuIHRlc3RzIG11bHRpcGxlIHRpbWVzLlxyXG4qL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlIG5vLXJlcXVpcmUtaW1wb3J0cyBuby12YXItcmVxdWlyZXNcclxuY29uc3QgY2hpbGRfcHJvY2Vzc18xID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XHJcbmNvbnN0IGRvd25sb2FkID0gcmVxdWlyZShcImRvd25sb2FkXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmcy1leHRyYVwiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NsaWVudC9jb21tb24vY29uc3RhbnRzXCIpO1xyXG5jb25zdCBOYW1lZFJlZ2V4cCA9IHJlcXVpcmUoJ25hbWVkLWpzLXJlZ2V4cCcpO1xyXG5jb25zdCBTdHJlYW1aaXAgPSByZXF1aXJlKCdub2RlLXN0cmVhbS16aXAnKTtcclxuY29uc3QgZGVsID0gcmVxdWlyZSgnZGVsJyk7XHJcbmNvbnN0IHRtcEZvbGRlciA9IHBhdGguam9pbihjb25zdGFudHNfMS5FWFRFTlNJT05fUk9PVF9ESVIsICd0bXAnKTtcclxuY29uc3QgcHVibGlzaGVkRXh0ZW5zaW9uUGF0aCA9IHBhdGguam9pbih0bXBGb2xkZXIsICdleHQnLCAndGVzdFJlbGVhc2VFeHRlbnNpb25zRm9sZGVyJyk7XHJcbmNvbnN0IGxvZ0ZpbGVzUGF0aCA9IHBhdGguam9pbih0bXBGb2xkZXIsICd0ZXN0JywgJ2xvZ3MnKTtcclxudmFyIFZlcnNpb247XHJcbihmdW5jdGlvbiAoVmVyc2lvbikge1xyXG4gICAgVmVyc2lvbltWZXJzaW9uW1wiRGV2XCJdID0gMF0gPSBcIkRldlwiO1xyXG4gICAgVmVyc2lvbltWZXJzaW9uW1wiUmVsZWFzZVwiXSA9IDFdID0gXCJSZWxlYXNlXCI7XHJcbn0pKFZlcnNpb24gfHwgKFZlcnNpb24gPSB7fSkpO1xyXG5jbGFzcyBUZXN0UnVubmVyIHtcclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGRlbChbcGF0aC5qb2luKHRtcEZvbGRlciwgJyoqJyldKTtcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5leHRyYWN0TGF0ZXN0RXh0ZW5zaW9uKHB1Ymxpc2hlZEV4dGVuc2lvblBhdGgpO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lc1RvTG9hZEVhY2hWZXJzaW9uID0gMjtcclxuICAgICAgICAgICAgY29uc3QgZGV2TG9nRmlsZXMgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgcmVsZWFzZUxvZ0ZpbGVzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IGxhbmd1YWdlU2VydmVyTG9nRmlsZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lc1RvTG9hZEVhY2hWZXJzaW9uOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuZW5hYmxlTGFuZ3VhZ2VTZXJ2ZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGV2TG9nRmlsZSA9IHBhdGguam9pbihsb2dGaWxlc1BhdGgsIGBkZXZfbG9hZHRpbWVzJHtpfS50eHRgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTdGFydCBQZXJmb3JtYW5jZSBUZXN0czogQ291bnRlciAke2l9LCBmb3IgRGV2IHZlcnNpb24gd2l0aCBKZWRpYCk7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmNhcHR1cmVQZXJmVGltZXMoVmVyc2lvbi5EZXYsIGRldkxvZ0ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgZGV2TG9nRmlsZXMucHVzaChkZXZMb2dGaWxlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGVhc2VMb2dGaWxlID0gcGF0aC5qb2luKGxvZ0ZpbGVzUGF0aCwgYHJlbGVhc2VfbG9hZHRpbWVzJHtpfS50eHRgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTdGFydCBQZXJmb3JtYW5jZSBUZXN0czogQ291bnRlciAke2l9LCBmb3IgUmVsZWFzZSB2ZXJzaW9uIHdpdGggSmVkaWApO1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5jYXB0dXJlUGVyZlRpbWVzKFZlcnNpb24uUmVsZWFzZSwgcmVsZWFzZUxvZ0ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgcmVsZWFzZUxvZ0ZpbGVzLnB1c2gocmVsZWFzZUxvZ0ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gTGFuZ3VhZ2Ugc2VydmVyLlxyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5lbmFibGVMYW5ndWFnZVNlcnZlcih0cnVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhbmd1YWdlU2VydmVyTG9nRmlsZSA9IHBhdGguam9pbihsb2dGaWxlc1BhdGgsIGBsYW5ndWFnZVNlcnZlcl9sb2FkdGltZXMke2l9LnR4dGApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFN0YXJ0IFBlcmZvcm1hbmNlIFRlc3RzOiBDb3VudGVyICR7aX0sIGZvciBSZWxlYXNlIHZlcnNpb24gd2l0aCBMYW5ndWFnZSBTZXJ2ZXJgKTtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuY2FwdHVyZVBlcmZUaW1lcyhWZXJzaW9uLlJlbGVhc2UsIGxhbmd1YWdlU2VydmVyTG9nRmlsZSk7XHJcbiAgICAgICAgICAgICAgICBsYW5ndWFnZVNlcnZlckxvZ0ZpbGVzLnB1c2gobGFuZ3VhZ2VTZXJ2ZXJMb2dGaWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29tcGFyZSBQZXJmb3JtYW5jZSBSZXN1bHRzJyk7XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMucnVuUGVyZlRlc3QoZGV2TG9nRmlsZXMsIHJlbGVhc2VMb2dGaWxlcywgbGFuZ3VhZ2VTZXJ2ZXJMb2dGaWxlcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbmFibGVMYW5ndWFnZVNlcnZlcihlbmFibGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGB7IFwicHl0aG9uLmplZGlFbmFibGVkXCI6ICR7IWVuYWJsZX0gfWA7XHJcbiAgICAgICAgICAgIHlpZWxkIGZzLndyaXRlRmlsZShwYXRoLmpvaW4oY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCAnc3JjJywgJ3Rlc3QnLCAncGVyZm9ybWFuY2UnLCAnc2V0dGluZ3MuanNvbicpLCBzZXR0aW5ncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXB0dXJlUGVyZlRpbWVzKHZlcnNpb24sIGxvZ0ZpbGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxlYXNlVmVyc2lvbiA9IHlpZWxkIHRoaXMuZ2V0UmVsZWFzZVZlcnNpb24oKTtcclxuICAgICAgICAgICAgY29uc3QgZGV2VmVyc2lvbiA9IHlpZWxkIHRoaXMuZ2V0RGV2VmVyc2lvbigpO1xyXG4gICAgICAgICAgICB5aWVsZCBmcy5lbnN1cmVEaXIocGF0aC5kaXJuYW1lKGxvZ0ZpbGUpKTtcclxuICAgICAgICAgICAgY29uc3QgZW52ID0ge1xyXG4gICAgICAgICAgICAgICAgQUNUSVZBVElPTl9USU1FU19MT0dfRklMRV9QQVRIOiBsb2dGaWxlLFxyXG4gICAgICAgICAgICAgICAgQUNUSVZBVElPTl9USU1FU19FWFRfVkVSU0lPTjogdmVyc2lvbiA9PT0gVmVyc2lvbi5SZWxlYXNlID8gcmVsZWFzZVZlcnNpb24gOiBkZXZWZXJzaW9uLFxyXG4gICAgICAgICAgICAgICAgQ09ERV9FWFRFTlNJT05TX1BBVEg6IHZlcnNpb24gPT09IFZlcnNpb24uUmVsZWFzZSA/IHB1Ymxpc2hlZEV4dGVuc2lvblBhdGggOiBjb25zdGFudHNfMS5FWFRFTlNJT05fUk9PVF9ESVJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5sYXVuY2hUZXN0KGVudik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBydW5QZXJmVGVzdChkZXZMb2dGaWxlcywgcmVsZWFzZUxvZ0ZpbGVzLCBsYW5ndWFnZVNlcnZlckxvZ0ZpbGVzKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgZW52ID0ge1xyXG4gICAgICAgICAgICAgICAgQUNUSVZBVElPTl9USU1FU19ERVZfTE9HX0ZJTEVfUEFUSFM6IEpTT04uc3RyaW5naWZ5KGRldkxvZ0ZpbGVzKSxcclxuICAgICAgICAgICAgICAgIEFDVElWQVRJT05fVElNRVNfUkVMRUFTRV9MT0dfRklMRV9QQVRIUzogSlNPTi5zdHJpbmdpZnkocmVsZWFzZUxvZ0ZpbGVzKSxcclxuICAgICAgICAgICAgICAgIEFDVElWQVRJT05fVElNRVNfREVWX0xBTkdVQUdFX1NFUlZFUl9MT0dfRklMRV9QQVRIUzogSlNPTi5zdHJpbmdpZnkobGFuZ3VhZ2VTZXJ2ZXJMb2dGaWxlcylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5sYXVuY2hUZXN0KGVudik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsYXVuY2hUZXN0KGN1c3RvbUVudlZhcnMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnYgPSBPYmplY3QuYXNzaWduKHsgVEVTVF9GSUxFU19TVUZGSVg6ICdwZXJmLnRlc3QnLCBDT0RFX1RFU1RTX1dPUktTUEFDRTogcGF0aC5qb2luKGNvbnN0YW50c18xLkVYVEVOU0lPTl9ST09UX0RJUiwgJ3NyYycsICd0ZXN0JywgJ3BlcmZvcm1hbmNlJykgfSwgcHJvY2Vzcy5lbnYsIGN1c3RvbUVudlZhcnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvYyA9IGNoaWxkX3Byb2Nlc3NfMS5zcGF3bignbm9kZScsIFtwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3RhbmRhcmRUZXN0LmpzJyldLCB7IGN3ZDogY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCBlbnYgfSk7XHJcbiAgICAgICAgICAgICAgICBwcm9jLnN0ZG91dC5waXBlKHByb2Nlc3Muc3Rkb3V0KTtcclxuICAgICAgICAgICAgICAgIHByb2Muc3RkZXJyLnBpcGUocHJvY2Vzcy5zdGRlcnIpO1xyXG4gICAgICAgICAgICAgICAgcHJvYy5vbignZXJyb3InLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgcHJvYy5vbignY2xvc2UnLCBjb2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoYEZhaWxlZCB3aXRoIGNvZGUgJHtjb2RlfS5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBleHRyYWN0TGF0ZXN0RXh0ZW5zaW9uKHRhcmdldERpcikge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbkZpbGUgPSB5aWVsZCB0aGlzLmRvd25sb2FkRXh0ZW5zaW9uKCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMudW56aXAoZXh0ZW5zaW9uRmlsZSwgdGFyZ2V0RGlyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldFJlbGVhc2VWZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL21hcmtldHBsYWNlLnZpc3VhbHN0dWRpby5jb20vaXRlbXM/aXRlbU5hbWU9JHtjb25zdGFudHNfMS5QVlNDX0VYVEVOU0lPTl9JRH1gO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0geWllbGQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdCh1cmwsIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoYm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChgU3RhdHVzIGNvZGUgb2YgJHtyZXNwb25zZS5zdGF0dXNDb2RlfSByZWNlaXZlZC5gKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgcmUgPSBOYW1lZFJlZ2V4cCgnXCJ2ZXJzaW9uXCJcXFM/OlxcUz9cIig6PHZlcnNpb24+XFxcXGR7NH1cXFxcLlxcXFxkezEsMn1cXFxcLlxcXFxkezEsMn0pXCInLCAnZycpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gcmUuZXhlYyhjb250ZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXMuZ3JvdXBzKCkudmVyc2lvbjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldERldlZlcnNpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1saXRlcmFsLXJlcXVpcmVcclxuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUocGF0aC5qb2luKGNvbnN0YW50c18xLkVYVEVOU0lPTl9ST09UX0RJUiwgJ3BhY2thZ2UuanNvbicpKS52ZXJzaW9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdW56aXAoemlwRmlsZSwgdGFyZ2V0Rm9sZGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgeWllbGQgZnMuZW5zdXJlRGlyKHRhcmdldEZvbGRlcik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB6aXAgPSBuZXcgU3RyZWFtWmlwKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlOiB6aXBGaWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlRW50cmllczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB6aXAub24oJ3JlYWR5JywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHppcC5leHRyYWN0KCdleHRlbnNpb24nLCB0YXJnZXRGb2xkZXIsIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHppcC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRvd25sb2FkRXh0ZW5zaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSB5aWVsZCB0aGlzLmdldFJlbGVhc2VWZXJzaW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL21hcmtldHBsYWNlLnZpc3VhbHN0dWRpby5jb20vX2FwaXMvcHVibGljL2dhbGxlcnkvcHVibGlzaGVycy9tcy1weXRob24vdnNleHRlbnNpb25zL3B5dGhvbi8ke3ZlcnNpb259L3ZzcGFja2FnZWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gcGF0aC5qb2luKF9fZGlybmFtZSwgYGV4dGVuc2lvbiR7dmVyc2lvbn0uemlwYCk7XHJcbiAgICAgICAgICAgIGlmICh5aWVsZCBmcy5wYXRoRXhpc3RzKGRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHlpZWxkIGRvd25sb2FkKHVybCwgcGF0aC5kaXJuYW1lKGRlc3RpbmF0aW9uKSwgeyBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZShkZXN0aW5hdGlvbikgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5uZXcgVGVzdFJ1bm5lcigpLnN0YXJ0KCkuY2F0Y2goZXggPT4gY29uc29sZS5lcnJvcignRXJyb3IgaW4gcnVubmluZyBQZXJmb3JtYW5jZSBUZXN0cycsIGV4KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBlcmZvcm1hbmNlVGVzdC5qcy5tYXAiXX0=