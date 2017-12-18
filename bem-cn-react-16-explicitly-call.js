'use strict';

module.exports = function(file, api, options) {
    const j = api.jscodeshift;
    const root = j(file.source);
    const ReactUtils = require('./utils/ReactUtils')(j);

    const memberExressionReplace = node =>
        j.callExpression(
            j.memberExpression(
                node.value.expression.object,
                node.value.expression.property,
            ),
            []
        );

    const callExressionReplace = node =>
        j.callExpression(
            j.callExpression(
                node.value.expression.callee,
                node.value.expression.arguments,
            ),
            []
        );

    const mutations = root
        .find(j.JSXExpressionContainer)
        .filter(({ parentPath, value }) =>
            parentPath.value.type === 'JSXAttribute' &&
            parentPath.value.name.name === 'className' &&
            (
                value.expression.type === 'MemberExpression' ||
                value.expression.type === 'CallExpression' &&
                value.expression.arguments.length > 0
            )
        )
        .forEach(node => {
            switch (node.value.expression.type) {
                case 'MemberExpression':
                    node.value.expression = memberExressionReplace(node);
                    break;
                case 'CallExpression':
                    node.value.expression = callExressionReplace(node);
                    break;
                default:
                    throw new Error('Bad type ' + node.value.type);
            }
        })

        return root.toSource({
            quote: 'single',
            lineTerminator: '\n',
        });

    return null;
};

