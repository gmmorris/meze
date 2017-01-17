# TODO

The following is a To Do list of open issues we wish to address in Meze's implementation:

1. eslint support. At the moment the React eslint rules have slight conflicts with the Meze's usage and that is unlikely to change as the APIs are slightly different. We need to figure out how to allow React and Meze to co exist in the same codebase.

2. Better value typing. Currently location of prop validation is limited to prop, context and child context as hard coded values in React's PropTypes module. This makes typing for composition typing very unmaintainable. Might have to import their code into our own codebase and carry over the license.

3. Support for other collections and types: Maps, Sets, WeakMaps, WeakSets & Observable. We currently support Object and Array as return value, we should support all Data Structures. This behaviour should be plugable so that it can be expanded by developers using Meze.
