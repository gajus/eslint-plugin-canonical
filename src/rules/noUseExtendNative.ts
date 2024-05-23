/* eslint-disable no-prototype-builtins */
/**
 * @author https://github.com/dustinspecker/eslint-plugin-no-use-extend-native/blob/master/src/no-use-extend-native.js
 */
import isGetSetProp from 'is-get-set-prop';
import isJsType from 'is-js-type';
import isObjProp from 'is-obj-prop';
import isProtoPropOriginal  from 'is-proto-prop';
import { createRule } from '../utilities';

const isProtoProp = (jsType: string, propertyName: string) => {
  if (jsType === 'Object' && propertyName === 'groupBy') {
    return true;
  }

  return isProtoPropOriginal(jsType, propertyName);
};

/**
 * Return type of value of left or right
 *
 * @param {object} subject - left or right of node.object
 * @returns {string} - type of o
 */
const getType = (subject) => {
  const type = typeof subject.value;

  if (subject.regex) {
    return 'RegExp';
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Returns type of binary expression result
 *
 * @param {object} subject - node's object with a BinaryExpression type
 * @returns {string} - type of value produced
 */
const binaryExpressionProduces = (subject) => {
  const leftType =
    subject.left.type === 'BinaryExpression'
      ? binaryExpressionProduces(subject.left)
      : getType(subject.left);
  const rightType =
    subject.right.type === 'BinaryExpression'
      ? binaryExpressionProduces(subject.right)
      : getType(subject.right);

  const isRegExp = leftType === rightType && leftType === 'RegExp';
  if (leftType === 'String' || rightType === 'String' || isRegExp) {
    return 'String';
  }

  if (leftType === rightType) {
    return leftType;
  }

  return 'Unknown';
};

/**
 * Returns the JS type and property name
 *
 * @param {object} node - node to examine
 * @returns {object} - jsType and propertyName
 */
const getJsTypeAndPropertyName = (node) => {
  let jsType;
  let propertyName;

  switch (node.object.type) {
    case 'NewExpression':
      jsType = node.object.callee.name;
      break;
    case 'Literal':
      jsType = getType(node.object);
      break;
    case 'BinaryExpression':
      jsType = binaryExpressionProduces(node.object);
      break;
    case 'Identifier':
      if (node.property.name === 'prototype' && node.parent.property) {
        jsType = node.object.name;
        propertyName = node.parent.property.name;
      } else {
        jsType = node.object.name;
      }

      break;
    default:
      jsType = node.object.type.replace('Expression', '');
  }

  propertyName = propertyName || node.property.name || node.property.value;

  return {
    jsType,
    propertyName,
  };
};

const isUnkownGettSetterOrJsTypeExpressed = (
  jsType,
  propertyName,
  usageType,
) => {
  const isExpression =
    usageType === 'ExpressionStatement' || usageType === 'MemberExpression';

  return (
    isExpression &&
    !isGetSetProp(jsType, propertyName) &&
    !isProtoProp(jsType, propertyName) &&
    !isObjProp(jsType, propertyName)
  );
};

/**
 * Determine if a jsType's usage of propertyName is valid
 *
 * @param {string} jsType - the JS type to validate
 * @param {string} propertyName - the property name to validate usage of on jsType
 * @param {string} usageType - how propertyName is being used
 * @returns {boolean} - is the usage invalid?
 */
const isInvalid = (jsType, propertyName, usageType) => {
  if (
    typeof propertyName !== 'string' ||
    typeof jsType !== 'string' ||
    !isJsType(jsType)
  ) {
    return false;
  }

  const unknownGetterSetterOrjsTypeExpressed =
    isUnkownGettSetterOrJsTypeExpressed(jsType, propertyName, usageType);

  const isFunctionCall = usageType === 'CallExpression';
  const getterSetterCalledAsFunction =
    isFunctionCall && isGetSetProp(jsType, propertyName);

  const unknownjsTypeCalledAsFunction =
    isFunctionCall &&
    !isProtoProp(jsType, propertyName) &&
    !isObjProp(jsType, propertyName);

  return (
    unknownGetterSetterOrjsTypeExpressed ||
    getterSetterCalledAsFunction ||
    unknownjsTypeCalledAsFunction
  );
};

type Options = [];

type MessageIds = 'noExtendNative';

export default createRule<Options, MessageIds>({
  create(context) {
    return {
      MemberExpression(node) {
        if (node.computed && node.property.type === 'Identifier') {
          /**
           * handles cases like {}[i][j]
           * not enough information to identify type of variable in computed properties
           * so ignore false positives by not performing any checks
           */

          return;
        }

        const isArgumentToParent =
          node.parent?.hasOwnProperty('arguments') &&
          'arguments' in node.parent &&
          node.parent.arguments.includes(node);
        const usageType = isArgumentToParent ? node.type : node.parent?.type;

        const { propertyName, jsType } = getJsTypeAndPropertyName(node);

        if (
          isInvalid(jsType, propertyName, usageType) &&
          isInvalid('Function', propertyName, usageType)
        ) {
          context.report({
            messageId: 'noExtendNative',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: '',
      recommended: 'recommended',
    },
    messages: {
      noExtendNative: 'Avoid using extended native objects',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-use-extend-native',
});
