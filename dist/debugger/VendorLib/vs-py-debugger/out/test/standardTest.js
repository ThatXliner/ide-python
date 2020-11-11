"use strict"; // tslint:disable:no-console no-require-imports no-var-requires

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

process.env.CODE_TESTS_WORKSPACE = process.env.CODE_TESTS_WORKSPACE ? process.env.CODE_TESTS_WORKSPACE : path.join(__dirname, '..', '..', 'src', 'test');
process.env.IS_CI_SERVER_TEST_DEBUGGER = '';
process.env.VSC_PYTHON_CI_TEST = '1';

function start() {
  console.log('*'.repeat(100));
  console.log('Start Standard tests');

  require('../../node_modules/vscode/bin/test');
}

start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YW5kYXJkVGVzdC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsInBhdGgiLCJyZXF1aXJlIiwicHJvY2VzcyIsImVudiIsIkNPREVfVEVTVFNfV09SS1NQQUNFIiwiam9pbiIsIl9fZGlybmFtZSIsIklTX0NJX1NFUlZFUl9URVNUX0RFQlVHR0VSIiwiVlNDX1BZVEhPTl9DSV9URVNUIiwic3RhcnQiLCJjb25zb2xlIiwibG9nIiwicmVwZWF0Il0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsSUFBSSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLG9CQUFaLEdBQW1DRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsb0JBQVosR0FBbUNGLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxvQkFBL0MsR0FBc0VKLElBQUksQ0FBQ0ssSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQXdDLE1BQXhDLENBQXpHO0FBQ0FKLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSSwwQkFBWixHQUF5QyxFQUF6QztBQUNBTCxPQUFPLENBQUNDLEdBQVIsQ0FBWUssa0JBQVosR0FBaUMsR0FBakM7O0FBQ0EsU0FBU0MsS0FBVCxHQUFpQjtBQUNiQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxJQUFJQyxNQUFKLENBQVcsR0FBWCxDQUFaO0FBQ0FGLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFaOztBQUNBVixFQUFBQSxPQUFPLENBQUMsb0NBQUQsQ0FBUDtBQUNIOztBQUNEUSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgbm8tcmVxdWlyZS1pbXBvcnRzIG5vLXZhci1yZXF1aXJlc1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxucHJvY2Vzcy5lbnYuQ09ERV9URVNUU19XT1JLU1BBQ0UgPSBwcm9jZXNzLmVudi5DT0RFX1RFU1RTX1dPUktTUEFDRSA/IHByb2Nlc3MuZW52LkNPREVfVEVTVFNfV09SS1NQQUNFIDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ3NyYycsICd0ZXN0Jyk7XHJcbnByb2Nlc3MuZW52LklTX0NJX1NFUlZFUl9URVNUX0RFQlVHR0VSID0gJyc7XHJcbnByb2Nlc3MuZW52LlZTQ19QWVRIT05fQ0lfVEVTVCA9ICcxJztcclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnKicucmVwZWF0KDEwMCkpO1xyXG4gICAgY29uc29sZS5sb2coJ1N0YXJ0IFN0YW5kYXJkIHRlc3RzJyk7XHJcbiAgICByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdnNjb2RlL2Jpbi90ZXN0Jyk7XHJcbn1cclxuc3RhcnQoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhbmRhcmRUZXN0LmpzLm1hcCJdfQ==