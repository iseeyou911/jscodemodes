# jscodemodes
Codemods for js

## bem-cn-react-16-explicitly-call.js <beta>
Explicit call of bem-cn class method (React 16 bug).

Works for\
ConditionalExpression (className={ test ? consequent : alternate })\
MemberExpression (className={ scope.cls })\
Identifier (className={ cls } )\
CallExpression (className={ cls({ ... })/cls.mix('anotherCls') }, at the case explicit call will be added only if last function call doesn't have arguments)\

Known issues:\
Codemod doesn't look for identifier type, and how it was initialized, so the codemod will modify all supported types of jsxExpressions for className attribute.
