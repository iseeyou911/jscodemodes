# jscodemodes
Codemods for js

# bem-cn-react-16-explicitly-call.js <beta>
Explicit call of bem-cn class method (React 16 bug).

## Running
To run codemod you should to use jscodeshift https://github.com/facebook/jscodeshift

## Works for

### ConditionalExpression
```
className={ test ? consequent : alternate } -> className={ test ? consequent() : alternate() } null supported
```

### MemberExpression
```
className={ scope.cls } -> className={ scope.cls() }
```

### Identifier
```
className={ cls } -> className={ cls() }
```

### CallExpression

At the case explicit call will be added only if last function call doesn't have arguments)
```
//mix/state/is/has are working in a similar way
className={ cls.mix('anotherCls') } -> className={ cls.mix('anotherCls')() }
```

```
className={ cls({ ... }) } -> className={ cls({ ... })() }
```

## Known issues:

Codemod doesn't look for identifier type, and how it was initialized, so the codemod will modify all supported types of jsxExpressions for className attribute.
