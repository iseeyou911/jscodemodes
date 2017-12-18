'use strict';

module.exports = function(file, api, options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const wrapIntoCallExpression = expression =>
        j.callExpression(
            expression,
            []
        );

    const memberExressionReplace = expression =>
        wrapIntoCallExpression(
            j.memberExpression(
                expression.object,
                expression.property,
            )
        );

    const identifierReplace = expression =>
        wrapIntoCallExpression(
            j.identifier(
                expression.name,
            )
        );

    const callExressionReplace = expression => {
        if (!expression.arguments.length) {
            return expression;
        }

        return wrapIntoCallExpression(
            j.callExpression(
                expression.callee,
                expression.arguments,
            )
        );
    };

    const conditionalExpresionReplace = expression => {
        expression.consequent = replaceByType(expression.consequent);
        expression.alternate = replaceByType(expression.alternate);

        return expression;
    };

    const replaceByType = expression => {
        switch (expression.type) {
            case 'ConditionalExpression':
                return conditionalExpresionReplace(expression);
            case 'Identifier':
                return identifierReplace(expression);
            case 'MemberExpression':
                return memberExressionReplace(expression);
            case 'CallExpression':
                return callExressionReplace(expression);
            default:
                console.warn('Parser for ' + expression.type + ' is not implemented');
                return expression;
        }
    };

    root
        .find(j.JSXExpressionContainer)
        .filter(({ parentPath, value }) =>
            parentPath.value.type === 'JSXAttribute' &&
            parentPath.value.name.name === 'className' &&
            (
                value.expression.type === 'ConditionalExpression' ||
                value.expression.type === 'MemberExpression' ||
                value.expression.type === 'Identifier' ||
                value.expression.type === 'CallExpression'
            )

        )
        .forEach(node => {
            const { expression } = node.value;
            node.value.expression = replaceByType(expression);
        });

    return root.toSource({
        quote: 'single',
        lineTerminator: '\n',
    });
};

