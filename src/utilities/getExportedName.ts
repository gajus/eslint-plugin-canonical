import { type TSESTree } from '@typescript-eslint/utils';

const getNodeName = (node, matchCallExpression) => {
  if (node.type === 'Identifier') {
    return node.name;
  }

  if (node.id && node.id.type === 'Identifier') {
    return node.id.name;
  }

  if (
    matchCallExpression &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier'
  ) {
    return node.callee.name;
  }

  return null;
};

export const getExportedName = (
  programNode: TSESTree.Program,
  matchCallExpression: boolean,
) => {
  for (const node of programNode.body) {
    // export default ...
    if (node.type === 'ExportDefaultDeclaration') {
      return getNodeName(node.declaration, matchCallExpression);
    }

    // module.exports = ...
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'AssignmentExpression' &&
      node.expression.left.type === 'MemberExpression' &&
      node.expression.left.object.type === 'Identifier' &&
      node.expression.left.object.name === 'module' &&
      node.expression.left.property.type === 'Identifier' &&
      node.expression.left.property.name === 'exports'
    ) {
      return getNodeName(node.expression.right, matchCallExpression);
    }
  }

  return null;
};
