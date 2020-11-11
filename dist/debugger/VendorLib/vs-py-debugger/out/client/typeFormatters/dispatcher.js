// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

class OnTypeFormattingDispatcher {
  constructor(providers) {
    this.providers = providers;
  }

  provideOnTypeFormattingEdits(document, position, ch, options, cancellationToken) {
    const provider = this.providers[ch];

    if (provider) {
      return provider.provideOnTypeFormattingEdits(document, position, ch, options, cancellationToken);
    }

    return [];
  }

  getTriggerCharacters() {
    const keys = Object.keys(this.providers);
    keys.sort(); // Make output deterministic

    const first = keys.shift();

    if (first) {
      return {
        first: first,
        more: keys
      };
    }

    return undefined;
  }

}

exports.OnTypeFormattingDispatcher = OnTypeFormattingDispatcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BhdGNoZXIuanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJPblR5cGVGb3JtYXR0aW5nRGlzcGF0Y2hlciIsImNvbnN0cnVjdG9yIiwicHJvdmlkZXJzIiwicHJvdmlkZU9uVHlwZUZvcm1hdHRpbmdFZGl0cyIsImRvY3VtZW50IiwicG9zaXRpb24iLCJjaCIsIm9wdGlvbnMiLCJjYW5jZWxsYXRpb25Ub2tlbiIsInByb3ZpZGVyIiwiZ2V0VHJpZ2dlckNoYXJhY3RlcnMiLCJrZXlzIiwic29ydCIsImZpcnN0Iiwic2hpZnQiLCJtb3JlIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsMEJBQU4sQ0FBaUM7QUFDN0JDLEVBQUFBLFdBQVcsQ0FBQ0MsU0FBRCxFQUFZO0FBQ25CLFNBQUtBLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0g7O0FBQ0RDLEVBQUFBLDRCQUE0QixDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUJDLEVBQXJCLEVBQXlCQyxPQUF6QixFQUFrQ0MsaUJBQWxDLEVBQXFEO0FBQzdFLFVBQU1DLFFBQVEsR0FBRyxLQUFLUCxTQUFMLENBQWVJLEVBQWYsQ0FBakI7O0FBQ0EsUUFBSUcsUUFBSixFQUFjO0FBQ1YsYUFBT0EsUUFBUSxDQUFDTiw0QkFBVCxDQUFzQ0MsUUFBdEMsRUFBZ0RDLFFBQWhELEVBQTBEQyxFQUExRCxFQUE4REMsT0FBOUQsRUFBdUVDLGlCQUF2RSxDQUFQO0FBQ0g7O0FBQ0QsV0FBTyxFQUFQO0FBQ0g7O0FBQ0RFLEVBQUFBLG9CQUFvQixHQUFHO0FBQ25CLFVBQU1DLElBQUksR0FBR2YsTUFBTSxDQUFDZSxJQUFQLENBQVksS0FBS1QsU0FBakIsQ0FBYjtBQUNBUyxJQUFBQSxJQUFJLENBQUNDLElBQUwsR0FGbUIsQ0FFTjs7QUFDYixVQUFNQyxLQUFLLEdBQUdGLElBQUksQ0FBQ0csS0FBTCxFQUFkOztBQUNBLFFBQUlELEtBQUosRUFBVztBQUNQLGFBQU87QUFDSEEsUUFBQUEsS0FBSyxFQUFFQSxLQURKO0FBRUhFLFFBQUFBLElBQUksRUFBRUo7QUFGSCxPQUFQO0FBSUg7O0FBQ0QsV0FBT0ssU0FBUDtBQUNIOztBQXRCNEI7O0FBd0JqQ2xCLE9BQU8sQ0FBQ0UsMEJBQVIsR0FBcUNBLDBCQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBPblR5cGVGb3JtYXR0aW5nRGlzcGF0Y2hlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm92aWRlcnMpIHtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycyA9IHByb3ZpZGVycztcclxuICAgIH1cclxuICAgIHByb3ZpZGVPblR5cGVGb3JtYXR0aW5nRWRpdHMoZG9jdW1lbnQsIHBvc2l0aW9uLCBjaCwgb3B0aW9ucywgY2FuY2VsbGF0aW9uVG9rZW4pIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMucHJvdmlkZXJzW2NoXTtcclxuICAgICAgICBpZiAocHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVyLnByb3ZpZGVPblR5cGVGb3JtYXR0aW5nRWRpdHMoZG9jdW1lbnQsIHBvc2l0aW9uLCBjaCwgb3B0aW9ucywgY2FuY2VsbGF0aW9uVG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbiAgICBnZXRUcmlnZ2VyQ2hhcmFjdGVycygpIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm92aWRlcnMpO1xyXG4gICAgICAgIGtleXMuc29ydCgpOyAvLyBNYWtlIG91dHB1dCBkZXRlcm1pbmlzdGljXHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSBrZXlzLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYgKGZpcnN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdDogZmlyc3QsXHJcbiAgICAgICAgICAgICAgICBtb3JlOiBrZXlzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PblR5cGVGb3JtYXR0aW5nRGlzcGF0Y2hlciA9IE9uVHlwZUZvcm1hdHRpbmdEaXNwYXRjaGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXNwYXRjaGVyLmpzLm1hcCJdfQ==