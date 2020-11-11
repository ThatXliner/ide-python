// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable:no-require-imports no-var-requires

var UnicodeCategory;

(function (UnicodeCategory) {
  UnicodeCategory[UnicodeCategory["Unknown"] = 0] = "Unknown";
  UnicodeCategory[UnicodeCategory["UppercaseLetter"] = 1] = "UppercaseLetter";
  UnicodeCategory[UnicodeCategory["LowercaseLetter"] = 2] = "LowercaseLetter";
  UnicodeCategory[UnicodeCategory["TitlecaseLetter"] = 3] = "TitlecaseLetter";
  UnicodeCategory[UnicodeCategory["ModifierLetter"] = 4] = "ModifierLetter";
  UnicodeCategory[UnicodeCategory["OtherLetter"] = 5] = "OtherLetter";
  UnicodeCategory[UnicodeCategory["LetterNumber"] = 6] = "LetterNumber";
  UnicodeCategory[UnicodeCategory["NonSpacingMark"] = 7] = "NonSpacingMark";
  UnicodeCategory[UnicodeCategory["SpacingCombiningMark"] = 8] = "SpacingCombiningMark";
  UnicodeCategory[UnicodeCategory["DecimalDigitNumber"] = 9] = "DecimalDigitNumber";
  UnicodeCategory[UnicodeCategory["ConnectorPunctuation"] = 10] = "ConnectorPunctuation";
})(UnicodeCategory = exports.UnicodeCategory || (exports.UnicodeCategory = {}));

function getUnicodeCategory(ch) {
  const unicodeLu = require('unicode/category/Lu');

  const unicodeLl = require('unicode/category/Ll');

  const unicodeLt = require('unicode/category/Lt');

  const unicodeLo = require('unicode/category/Lo');

  const unicodeLm = require('unicode/category/Lm');

  const unicodeNl = require('unicode/category/Nl');

  const unicodeMn = require('unicode/category/Mn');

  const unicodeMc = require('unicode/category/Mc');

  const unicodeNd = require('unicode/category/Nd');

  const unicodePc = require('unicode/category/Pc');

  if (unicodeLu[ch]) {
    return UnicodeCategory.UppercaseLetter;
  }

  if (unicodeLl[ch]) {
    return UnicodeCategory.LowercaseLetter;
  }

  if (unicodeLt[ch]) {
    return UnicodeCategory.TitlecaseLetter;
  }

  if (unicodeLo[ch]) {
    return UnicodeCategory.OtherLetter;
  }

  if (unicodeLm[ch]) {
    return UnicodeCategory.ModifierLetter;
  }

  if (unicodeNl[ch]) {
    return UnicodeCategory.LetterNumber;
  }

  if (unicodeMn[ch]) {
    return UnicodeCategory.NonSpacingMark;
  }

  if (unicodeMc[ch]) {
    return UnicodeCategory.SpacingCombiningMark;
  }

  if (unicodeNd[ch]) {
    return UnicodeCategory.DecimalDigitNumber;
  }

  if (unicodePc[ch]) {
    return UnicodeCategory.ConnectorPunctuation;
  }

  return UnicodeCategory.Unknown;
}

exports.getUnicodeCategory = getUnicodeCategory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuaWNvZGUuanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJVbmljb2RlQ2F0ZWdvcnkiLCJnZXRVbmljb2RlQ2F0ZWdvcnkiLCJjaCIsInVuaWNvZGVMdSIsInJlcXVpcmUiLCJ1bmljb2RlTGwiLCJ1bmljb2RlTHQiLCJ1bmljb2RlTG8iLCJ1bmljb2RlTG0iLCJ1bmljb2RlTmwiLCJ1bmljb2RlTW4iLCJ1bmljb2RlTWMiLCJ1bmljb2RlTmQiLCJ1bmljb2RlUGMiLCJVcHBlcmNhc2VMZXR0ZXIiLCJMb3dlcmNhc2VMZXR0ZXIiLCJUaXRsZWNhc2VMZXR0ZXIiLCJPdGhlckxldHRlciIsIk1vZGlmaWVyTGV0dGVyIiwiTGV0dGVyTnVtYmVyIiwiTm9uU3BhY2luZ01hcmsiLCJTcGFjaW5nQ29tYmluaW5nTWFyayIsIkRlY2ltYWxEaWdpdE51bWJlciIsIkNvbm5lY3RvclB1bmN0dWF0aW9uIiwiVW5rbm93biJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDLEUsQ0FDQTs7QUFDQSxJQUFJQyxlQUFKOztBQUNBLENBQUMsVUFBVUEsZUFBVixFQUEyQjtBQUN4QkEsRUFBQUEsZUFBZSxDQUFDQSxlQUFlLENBQUMsU0FBRCxDQUFmLEdBQTZCLENBQTlCLENBQWYsR0FBa0QsU0FBbEQ7QUFDQUEsRUFBQUEsZUFBZSxDQUFDQSxlQUFlLENBQUMsaUJBQUQsQ0FBZixHQUFxQyxDQUF0QyxDQUFmLEdBQTBELGlCQUExRDtBQUNBQSxFQUFBQSxlQUFlLENBQUNBLGVBQWUsQ0FBQyxpQkFBRCxDQUFmLEdBQXFDLENBQXRDLENBQWYsR0FBMEQsaUJBQTFEO0FBQ0FBLEVBQUFBLGVBQWUsQ0FBQ0EsZUFBZSxDQUFDLGlCQUFELENBQWYsR0FBcUMsQ0FBdEMsQ0FBZixHQUEwRCxpQkFBMUQ7QUFDQUEsRUFBQUEsZUFBZSxDQUFDQSxlQUFlLENBQUMsZ0JBQUQsQ0FBZixHQUFvQyxDQUFyQyxDQUFmLEdBQXlELGdCQUF6RDtBQUNBQSxFQUFBQSxlQUFlLENBQUNBLGVBQWUsQ0FBQyxhQUFELENBQWYsR0FBaUMsQ0FBbEMsQ0FBZixHQUFzRCxhQUF0RDtBQUNBQSxFQUFBQSxlQUFlLENBQUNBLGVBQWUsQ0FBQyxjQUFELENBQWYsR0FBa0MsQ0FBbkMsQ0FBZixHQUF1RCxjQUF2RDtBQUNBQSxFQUFBQSxlQUFlLENBQUNBLGVBQWUsQ0FBQyxnQkFBRCxDQUFmLEdBQW9DLENBQXJDLENBQWYsR0FBeUQsZ0JBQXpEO0FBQ0FBLEVBQUFBLGVBQWUsQ0FBQ0EsZUFBZSxDQUFDLHNCQUFELENBQWYsR0FBMEMsQ0FBM0MsQ0FBZixHQUErRCxzQkFBL0Q7QUFDQUEsRUFBQUEsZUFBZSxDQUFDQSxlQUFlLENBQUMsb0JBQUQsQ0FBZixHQUF3QyxDQUF6QyxDQUFmLEdBQTZELG9CQUE3RDtBQUNBQSxFQUFBQSxlQUFlLENBQUNBLGVBQWUsQ0FBQyxzQkFBRCxDQUFmLEdBQTBDLEVBQTNDLENBQWYsR0FBZ0Usc0JBQWhFO0FBQ0gsQ0FaRCxFQVlHQSxlQUFlLEdBQUdGLE9BQU8sQ0FBQ0UsZUFBUixLQUE0QkYsT0FBTyxDQUFDRSxlQUFSLEdBQTBCLEVBQXRELENBWnJCOztBQWFBLFNBQVNDLGtCQUFULENBQTRCQyxFQUE1QixFQUFnQztBQUM1QixRQUFNQyxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNRSxTQUFTLEdBQUdGLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNRyxTQUFTLEdBQUdILE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNSSxTQUFTLEdBQUdKLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNSyxTQUFTLEdBQUdMLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNTSxTQUFTLEdBQUdOLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNTyxTQUFTLEdBQUdQLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNUSxTQUFTLEdBQUdSLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxRQUFNUyxTQUFTLEdBQUdULE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFDQSxNQUFJRCxTQUFTLENBQUNELEVBQUQsQ0FBYixFQUFtQjtBQUNmLFdBQU9GLGVBQWUsQ0FBQ2MsZUFBdkI7QUFDSDs7QUFDRCxNQUFJVCxTQUFTLENBQUNILEVBQUQsQ0FBYixFQUFtQjtBQUNmLFdBQU9GLGVBQWUsQ0FBQ2UsZUFBdkI7QUFDSDs7QUFDRCxNQUFJVCxTQUFTLENBQUNKLEVBQUQsQ0FBYixFQUFtQjtBQUNmLFdBQU9GLGVBQWUsQ0FBQ2dCLGVBQXZCO0FBQ0g7O0FBQ0QsTUFBSVQsU0FBUyxDQUFDTCxFQUFELENBQWIsRUFBbUI7QUFDZixXQUFPRixlQUFlLENBQUNpQixXQUF2QjtBQUNIOztBQUNELE1BQUlULFNBQVMsQ0FBQ04sRUFBRCxDQUFiLEVBQW1CO0FBQ2YsV0FBT0YsZUFBZSxDQUFDa0IsY0FBdkI7QUFDSDs7QUFDRCxNQUFJVCxTQUFTLENBQUNQLEVBQUQsQ0FBYixFQUFtQjtBQUNmLFdBQU9GLGVBQWUsQ0FBQ21CLFlBQXZCO0FBQ0g7O0FBQ0QsTUFBSVQsU0FBUyxDQUFDUixFQUFELENBQWIsRUFBbUI7QUFDZixXQUFPRixlQUFlLENBQUNvQixjQUF2QjtBQUNIOztBQUNELE1BQUlULFNBQVMsQ0FBQ1QsRUFBRCxDQUFiLEVBQW1CO0FBQ2YsV0FBT0YsZUFBZSxDQUFDcUIsb0JBQXZCO0FBQ0g7O0FBQ0QsTUFBSVQsU0FBUyxDQUFDVixFQUFELENBQWIsRUFBbUI7QUFDZixXQUFPRixlQUFlLENBQUNzQixrQkFBdkI7QUFDSDs7QUFDRCxNQUFJVCxTQUFTLENBQUNYLEVBQUQsQ0FBYixFQUFtQjtBQUNmLFdBQU9GLGVBQWUsQ0FBQ3VCLG9CQUF2QjtBQUNIOztBQUNELFNBQU92QixlQUFlLENBQUN3QixPQUF2QjtBQUNIOztBQUNEMUIsT0FBTyxDQUFDRyxrQkFBUixHQUE2QkEsa0JBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0cyBuby12YXItcmVxdWlyZXNcclxudmFyIFVuaWNvZGVDYXRlZ29yeTtcclxuKGZ1bmN0aW9uIChVbmljb2RlQ2F0ZWdvcnkpIHtcclxuICAgIFVuaWNvZGVDYXRlZ29yeVtVbmljb2RlQ2F0ZWdvcnlbXCJVbmtub3duXCJdID0gMF0gPSBcIlVua25vd25cIjtcclxuICAgIFVuaWNvZGVDYXRlZ29yeVtVbmljb2RlQ2F0ZWdvcnlbXCJVcHBlcmNhc2VMZXR0ZXJcIl0gPSAxXSA9IFwiVXBwZXJjYXNlTGV0dGVyXCI7XHJcbiAgICBVbmljb2RlQ2F0ZWdvcnlbVW5pY29kZUNhdGVnb3J5W1wiTG93ZXJjYXNlTGV0dGVyXCJdID0gMl0gPSBcIkxvd2VyY2FzZUxldHRlclwiO1xyXG4gICAgVW5pY29kZUNhdGVnb3J5W1VuaWNvZGVDYXRlZ29yeVtcIlRpdGxlY2FzZUxldHRlclwiXSA9IDNdID0gXCJUaXRsZWNhc2VMZXR0ZXJcIjtcclxuICAgIFVuaWNvZGVDYXRlZ29yeVtVbmljb2RlQ2F0ZWdvcnlbXCJNb2RpZmllckxldHRlclwiXSA9IDRdID0gXCJNb2RpZmllckxldHRlclwiO1xyXG4gICAgVW5pY29kZUNhdGVnb3J5W1VuaWNvZGVDYXRlZ29yeVtcIk90aGVyTGV0dGVyXCJdID0gNV0gPSBcIk90aGVyTGV0dGVyXCI7XHJcbiAgICBVbmljb2RlQ2F0ZWdvcnlbVW5pY29kZUNhdGVnb3J5W1wiTGV0dGVyTnVtYmVyXCJdID0gNl0gPSBcIkxldHRlck51bWJlclwiO1xyXG4gICAgVW5pY29kZUNhdGVnb3J5W1VuaWNvZGVDYXRlZ29yeVtcIk5vblNwYWNpbmdNYXJrXCJdID0gN10gPSBcIk5vblNwYWNpbmdNYXJrXCI7XHJcbiAgICBVbmljb2RlQ2F0ZWdvcnlbVW5pY29kZUNhdGVnb3J5W1wiU3BhY2luZ0NvbWJpbmluZ01hcmtcIl0gPSA4XSA9IFwiU3BhY2luZ0NvbWJpbmluZ01hcmtcIjtcclxuICAgIFVuaWNvZGVDYXRlZ29yeVtVbmljb2RlQ2F0ZWdvcnlbXCJEZWNpbWFsRGlnaXROdW1iZXJcIl0gPSA5XSA9IFwiRGVjaW1hbERpZ2l0TnVtYmVyXCI7XHJcbiAgICBVbmljb2RlQ2F0ZWdvcnlbVW5pY29kZUNhdGVnb3J5W1wiQ29ubmVjdG9yUHVuY3R1YXRpb25cIl0gPSAxMF0gPSBcIkNvbm5lY3RvclB1bmN0dWF0aW9uXCI7XHJcbn0pKFVuaWNvZGVDYXRlZ29yeSA9IGV4cG9ydHMuVW5pY29kZUNhdGVnb3J5IHx8IChleHBvcnRzLlVuaWNvZGVDYXRlZ29yeSA9IHt9KSk7XHJcbmZ1bmN0aW9uIGdldFVuaWNvZGVDYXRlZ29yeShjaCkge1xyXG4gICAgY29uc3QgdW5pY29kZUx1ID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9MdScpO1xyXG4gICAgY29uc3QgdW5pY29kZUxsID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9MbCcpO1xyXG4gICAgY29uc3QgdW5pY29kZUx0ID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9MdCcpO1xyXG4gICAgY29uc3QgdW5pY29kZUxvID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9MbycpO1xyXG4gICAgY29uc3QgdW5pY29kZUxtID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9MbScpO1xyXG4gICAgY29uc3QgdW5pY29kZU5sID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9ObCcpO1xyXG4gICAgY29uc3QgdW5pY29kZU1uID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9NbicpO1xyXG4gICAgY29uc3QgdW5pY29kZU1jID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9NYycpO1xyXG4gICAgY29uc3QgdW5pY29kZU5kID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9OZCcpO1xyXG4gICAgY29uc3QgdW5pY29kZVBjID0gcmVxdWlyZSgndW5pY29kZS9jYXRlZ29yeS9QYycpO1xyXG4gICAgaWYgKHVuaWNvZGVMdVtjaF0pIHtcclxuICAgICAgICByZXR1cm4gVW5pY29kZUNhdGVnb3J5LlVwcGVyY2FzZUxldHRlcjtcclxuICAgIH1cclxuICAgIGlmICh1bmljb2RlTGxbY2hdKSB7XHJcbiAgICAgICAgcmV0dXJuIFVuaWNvZGVDYXRlZ29yeS5Mb3dlcmNhc2VMZXR0ZXI7XHJcbiAgICB9XHJcbiAgICBpZiAodW5pY29kZUx0W2NoXSkge1xyXG4gICAgICAgIHJldHVybiBVbmljb2RlQ2F0ZWdvcnkuVGl0bGVjYXNlTGV0dGVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHVuaWNvZGVMb1tjaF0pIHtcclxuICAgICAgICByZXR1cm4gVW5pY29kZUNhdGVnb3J5Lk90aGVyTGV0dGVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHVuaWNvZGVMbVtjaF0pIHtcclxuICAgICAgICByZXR1cm4gVW5pY29kZUNhdGVnb3J5Lk1vZGlmaWVyTGV0dGVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHVuaWNvZGVObFtjaF0pIHtcclxuICAgICAgICByZXR1cm4gVW5pY29kZUNhdGVnb3J5LkxldHRlck51bWJlcjtcclxuICAgIH1cclxuICAgIGlmICh1bmljb2RlTW5bY2hdKSB7XHJcbiAgICAgICAgcmV0dXJuIFVuaWNvZGVDYXRlZ29yeS5Ob25TcGFjaW5nTWFyaztcclxuICAgIH1cclxuICAgIGlmICh1bmljb2RlTWNbY2hdKSB7XHJcbiAgICAgICAgcmV0dXJuIFVuaWNvZGVDYXRlZ29yeS5TcGFjaW5nQ29tYmluaW5nTWFyaztcclxuICAgIH1cclxuICAgIGlmICh1bmljb2RlTmRbY2hdKSB7XHJcbiAgICAgICAgcmV0dXJuIFVuaWNvZGVDYXRlZ29yeS5EZWNpbWFsRGlnaXROdW1iZXI7XHJcbiAgICB9XHJcbiAgICBpZiAodW5pY29kZVBjW2NoXSkge1xyXG4gICAgICAgIHJldHVybiBVbmljb2RlQ2F0ZWdvcnkuQ29ubmVjdG9yUHVuY3R1YXRpb247XHJcbiAgICB9XHJcbiAgICByZXR1cm4gVW5pY29kZUNhdGVnb3J5LlVua25vd247XHJcbn1cclxuZXhwb3J0cy5nZXRVbmljb2RlQ2F0ZWdvcnkgPSBnZXRVbmljb2RlQ2F0ZWdvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVuaWNvZGUuanMubWFwIl19