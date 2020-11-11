// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const assert = require("assert");

const async_1 = require("../../../client/common/utils/async");

suite('Deferred', () => {
  test('Resolve', done => {
    const valueToSent = new Date().getTime();
    const def = async_1.createDeferred();
    def.promise.then(value => {
      assert.equal(value, valueToSent);
      assert.equal(def.resolved, true, 'resolved property value is not `true`');
    }).then(done).catch(done);
    assert.equal(def.resolved, false, 'Promise is resolved even when it should not be');
    assert.equal(def.rejected, false, 'Promise is rejected even when it should not be');
    assert.equal(def.completed, false, 'Promise is completed even when it should not be');
    def.resolve(valueToSent);
    assert.equal(def.resolved, true, 'Promise is not resolved even when it should not be');
    assert.equal(def.rejected, false, 'Promise is rejected even when it should not be');
    assert.equal(def.completed, true, 'Promise is not completed even when it should not be');
  });
  test('Reject', done => {
    const errorToSend = new Error('Something');
    const def = async_1.createDeferred();
    def.promise.then(value => {
      assert.fail(value, 'Error', 'Was expecting promise to get rejected, however it was resolved', '');
      done();
    }).catch(reason => {
      assert.equal(reason, errorToSend, 'Error received is not the same');
      done();
    }).catch(done);
    assert.equal(def.resolved, false, 'Promise is resolved even when it should not be');
    assert.equal(def.rejected, false, 'Promise is rejected even when it should not be');
    assert.equal(def.completed, false, 'Promise is completed even when it should not be');
    def.reject(errorToSend);
    assert.equal(def.resolved, false, 'Promise is resolved even when it should not be');
    assert.equal(def.rejected, true, 'Promise is not rejected even when it should not be');
    assert.equal(def.completed, true, 'Promise is not completed even when it should not be');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzeW5jLnVuaXQudGVzdC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImFzc2VydCIsInJlcXVpcmUiLCJhc3luY18xIiwic3VpdGUiLCJ0ZXN0IiwiZG9uZSIsInZhbHVlVG9TZW50IiwiRGF0ZSIsImdldFRpbWUiLCJkZWYiLCJjcmVhdGVEZWZlcnJlZCIsInByb21pc2UiLCJ0aGVuIiwiZXF1YWwiLCJyZXNvbHZlZCIsImNhdGNoIiwicmVqZWN0ZWQiLCJjb21wbGV0ZWQiLCJyZXNvbHZlIiwiZXJyb3JUb1NlbmQiLCJFcnJvciIsImZhaWwiLCJyZWFzb24iLCJyZWplY3QiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNQyxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLE1BQU1DLE9BQU8sR0FBR0QsT0FBTyxDQUFDLG9DQUFELENBQXZCOztBQUNBRSxLQUFLLENBQUMsVUFBRCxFQUFhLE1BQU07QUFDcEJDLEVBQUFBLElBQUksQ0FBQyxTQUFELEVBQVlDLElBQUksSUFBSTtBQUNwQixVQUFNQyxXQUFXLEdBQUcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQXBCO0FBQ0EsVUFBTUMsR0FBRyxHQUFHUCxPQUFPLENBQUNRLGNBQVIsRUFBWjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLE9BQUosQ0FBWUMsSUFBWixDQUFpQmIsS0FBSyxJQUFJO0FBQ3RCQyxNQUFBQSxNQUFNLENBQUNhLEtBQVAsQ0FBYWQsS0FBYixFQUFvQk8sV0FBcEI7QUFDQU4sTUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ0ssUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsdUNBQWpDO0FBQ0gsS0FIRCxFQUdHRixJQUhILENBR1FQLElBSFIsRUFHY1UsS0FIZCxDQUdvQlYsSUFIcEI7QUFJQUwsSUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ0ssUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsZ0RBQWxDO0FBQ0FkLElBQUFBLE1BQU0sQ0FBQ2EsS0FBUCxDQUFhSixHQUFHLENBQUNPLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLGdEQUFsQztBQUNBaEIsSUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ1EsU0FBakIsRUFBNEIsS0FBNUIsRUFBbUMsaURBQW5DO0FBQ0FSLElBQUFBLEdBQUcsQ0FBQ1MsT0FBSixDQUFZWixXQUFaO0FBQ0FOLElBQUFBLE1BQU0sQ0FBQ2EsS0FBUCxDQUFhSixHQUFHLENBQUNLLFFBQWpCLEVBQTJCLElBQTNCLEVBQWlDLG9EQUFqQztBQUNBZCxJQUFBQSxNQUFNLENBQUNhLEtBQVAsQ0FBYUosR0FBRyxDQUFDTyxRQUFqQixFQUEyQixLQUEzQixFQUFrQyxnREFBbEM7QUFDQWhCLElBQUFBLE1BQU0sQ0FBQ2EsS0FBUCxDQUFhSixHQUFHLENBQUNRLFNBQWpCLEVBQTRCLElBQTVCLEVBQWtDLHFEQUFsQztBQUNILEdBZEcsQ0FBSjtBQWVBYixFQUFBQSxJQUFJLENBQUMsUUFBRCxFQUFXQyxJQUFJLElBQUk7QUFDbkIsVUFBTWMsV0FBVyxHQUFHLElBQUlDLEtBQUosQ0FBVSxXQUFWLENBQXBCO0FBQ0EsVUFBTVgsR0FBRyxHQUFHUCxPQUFPLENBQUNRLGNBQVIsRUFBWjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLE9BQUosQ0FBWUMsSUFBWixDQUFpQmIsS0FBSyxJQUFJO0FBQ3RCQyxNQUFBQSxNQUFNLENBQUNxQixJQUFQLENBQVl0QixLQUFaLEVBQW1CLE9BQW5CLEVBQTRCLGdFQUE1QixFQUE4RixFQUE5RjtBQUNBTSxNQUFBQSxJQUFJO0FBQ1AsS0FIRCxFQUdHVSxLQUhILENBR1NPLE1BQU0sSUFBSTtBQUNmdEIsTUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFTLE1BQWIsRUFBcUJILFdBQXJCLEVBQWtDLGdDQUFsQztBQUNBZCxNQUFBQSxJQUFJO0FBQ1AsS0FORCxFQU1HVSxLQU5ILENBTVNWLElBTlQ7QUFPQUwsSUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ0ssUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsZ0RBQWxDO0FBQ0FkLElBQUFBLE1BQU0sQ0FBQ2EsS0FBUCxDQUFhSixHQUFHLENBQUNPLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLGdEQUFsQztBQUNBaEIsSUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ1EsU0FBakIsRUFBNEIsS0FBNUIsRUFBbUMsaURBQW5DO0FBQ0FSLElBQUFBLEdBQUcsQ0FBQ2MsTUFBSixDQUFXSixXQUFYO0FBQ0FuQixJQUFBQSxNQUFNLENBQUNhLEtBQVAsQ0FBYUosR0FBRyxDQUFDSyxRQUFqQixFQUEyQixLQUEzQixFQUFrQyxnREFBbEM7QUFDQWQsSUFBQUEsTUFBTSxDQUFDYSxLQUFQLENBQWFKLEdBQUcsQ0FBQ08sUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsb0RBQWpDO0FBQ0FoQixJQUFBQSxNQUFNLENBQUNhLEtBQVAsQ0FBYUosR0FBRyxDQUFDUSxTQUFqQixFQUE0QixJQUE1QixFQUFrQyxxREFBbEM7QUFDSCxHQWpCRyxDQUFKO0FBa0JILENBbENJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuY29uc3QgYXN5bmNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL3V0aWxzL2FzeW5jXCIpO1xyXG5zdWl0ZSgnRGVmZXJyZWQnLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdSZXNvbHZlJywgZG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVUb1NlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICBjb25zdCBkZWYgPSBhc3luY18xLmNyZWF0ZURlZmVycmVkKCk7XHJcbiAgICAgICAgZGVmLnByb21pc2UudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCh2YWx1ZSwgdmFsdWVUb1NlbnQpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnJlc29sdmVkLCB0cnVlLCAncmVzb2x2ZWQgcHJvcGVydHkgdmFsdWUgaXMgbm90IGB0cnVlYCcpO1xyXG4gICAgICAgIH0pLnRoZW4oZG9uZSkuY2F0Y2goZG9uZSk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5yZXNvbHZlZCwgZmFsc2UsICdQcm9taXNlIGlzIHJlc29sdmVkIGV2ZW4gd2hlbiBpdCBzaG91bGQgbm90IGJlJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5yZWplY3RlZCwgZmFsc2UsICdQcm9taXNlIGlzIHJlamVjdGVkIGV2ZW4gd2hlbiBpdCBzaG91bGQgbm90IGJlJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5jb21wbGV0ZWQsIGZhbHNlLCAnUHJvbWlzZSBpcyBjb21wbGV0ZWQgZXZlbiB3aGVuIGl0IHNob3VsZCBub3QgYmUnKTtcclxuICAgICAgICBkZWYucmVzb2x2ZSh2YWx1ZVRvU2VudCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5yZXNvbHZlZCwgdHJ1ZSwgJ1Byb21pc2UgaXMgbm90IHJlc29sdmVkIGV2ZW4gd2hlbiBpdCBzaG91bGQgbm90IGJlJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5yZWplY3RlZCwgZmFsc2UsICdQcm9taXNlIGlzIHJlamVjdGVkIGV2ZW4gd2hlbiBpdCBzaG91bGQgbm90IGJlJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5jb21wbGV0ZWQsIHRydWUsICdQcm9taXNlIGlzIG5vdCBjb21wbGV0ZWQgZXZlbiB3aGVuIGl0IHNob3VsZCBub3QgYmUnKTtcclxuICAgIH0pO1xyXG4gICAgdGVzdCgnUmVqZWN0JywgZG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JUb1NlbmQgPSBuZXcgRXJyb3IoJ1NvbWV0aGluZycpO1xyXG4gICAgICAgIGNvbnN0IGRlZiA9IGFzeW5jXzEuY3JlYXRlRGVmZXJyZWQoKTtcclxuICAgICAgICBkZWYucHJvbWlzZS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgYXNzZXJ0LmZhaWwodmFsdWUsICdFcnJvcicsICdXYXMgZXhwZWN0aW5nIHByb21pc2UgdG8gZ2V0IHJlamVjdGVkLCBob3dldmVyIGl0IHdhcyByZXNvbHZlZCcsICcnKTtcclxuICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgIH0pLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZWFzb24sIGVycm9yVG9TZW5kLCAnRXJyb3IgcmVjZWl2ZWQgaXMgbm90IHRoZSBzYW1lJyk7XHJcbiAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICB9KS5jYXRjaChkb25lKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnJlc29sdmVkLCBmYWxzZSwgJ1Byb21pc2UgaXMgcmVzb2x2ZWQgZXZlbiB3aGVuIGl0IHNob3VsZCBub3QgYmUnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnJlamVjdGVkLCBmYWxzZSwgJ1Byb21pc2UgaXMgcmVqZWN0ZWQgZXZlbiB3aGVuIGl0IHNob3VsZCBub3QgYmUnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLmNvbXBsZXRlZCwgZmFsc2UsICdQcm9taXNlIGlzIGNvbXBsZXRlZCBldmVuIHdoZW4gaXQgc2hvdWxkIG5vdCBiZScpO1xyXG4gICAgICAgIGRlZi5yZWplY3QoZXJyb3JUb1NlbmQpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChkZWYucmVzb2x2ZWQsIGZhbHNlLCAnUHJvbWlzZSBpcyByZXNvbHZlZCBldmVuIHdoZW4gaXQgc2hvdWxkIG5vdCBiZScpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChkZWYucmVqZWN0ZWQsIHRydWUsICdQcm9taXNlIGlzIG5vdCByZWplY3RlZCBldmVuIHdoZW4gaXQgc2hvdWxkIG5vdCBiZScpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChkZWYuY29tcGxldGVkLCB0cnVlLCAnUHJvbWlzZSBpcyBub3QgY29tcGxldGVkIGV2ZW4gd2hlbiBpdCBzaG91bGQgbm90IGJlJyk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzeW5jLnVuaXQudGVzdC5qcy5tYXAiXX0=