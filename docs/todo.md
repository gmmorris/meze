# TODO

The following is a To Do list of open issues we wish to address in Meze's implementation:
1. eslint support. At the moment the React eslint rules have slight conflicts with the Meze's usage and that is unlikely to change as the APIs are slightly different. We need to figure out how to allow React and Meze to co exist in the same codebase.
2. Return value typing. In the same was as we provide PropType and ContextType validation we should provide ReturnType validation as, unlike React, we can't be sure that the return value is valid and it will help in self documenting code.
3. Support for all collections: Maps, Sets, WeakMaps, WeakSets. We currently support Object and Array as return value, we should support all Data Structures.
