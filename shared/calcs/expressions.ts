import currency from 'currency.js';

const operators: {
  [operator: string]:
    | {
        func: (x: currency, y: currency) => currency;
        priority: number;
      }
    | undefined;
} = {
  '+': {
    func: (x, y) => x.add(y),
    priority: 1,
  },
  '-': {
    func: (x, y) => x.subtract(y),
    priority: 1,
  },
  '*': {
    func: (x, y) => x.multiply(y),
    priority: 2,
  },
  '/': {
    func: (x, y) => x.divide(y),
    priority: 2,
  },
};

function tokenize(expression: string): string[] {
  const parts = expression.match(/(?:-?\$?[\d.]+)|[-+*/]|[(]|[)]|\s+/g);
  if (!parts || parts.join('') !== expression) {
    throw new Error("couldn't parse expression");
  }

  // remove all whitespace
  return parts.map((p) => p.trim()).filter((p) => !!p);
}

/**
 * Shunting yard algorithm: converts infix expression to postfix expression (reverse Polish notation)
 * https://github.com/poteat/shunting-yard-typescript
 */
function shuntingYard(tokens: string[]): string[] {
  const top = (stack: string[]): string => stack[stack.length - 1];

  const output = new Array<string>();
  const operatorStack = new Array<string>();

  for (const token of tokens) {
    if (operators[token] !== undefined) {
      while (
        operatorStack.length > 0 &&
        top(operatorStack) !== '(' &&
        operators[top(operatorStack)!]!.priority >= operators[token]!.priority
      ) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length > 0 && top(operatorStack) !== '(') {
        output.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && top(operatorStack) === '(') {
        operatorStack.pop();
      } else {
        throw new Error('Parentheses mismatch');
      }
    } else {
      output.push(token);
    }
  }

  // Remaining items
  while (operatorStack.length > 0) {
    const operator = top(operatorStack);
    if (operator === '(') {
      throw new Error('Parentheses mismatch');
    } else {
      output.push(operatorStack.pop()!);
    }
  }

  return output;
}

const parseExpression = (expression: string): string[] => {
  const tokens = tokenize(expression);
  return shuntingYard(tokens);
};

const evalExpression = (tokens: string[]): string => {
  if (!tokens) {
    return '0';
  }
  if (tokens.length === 1) {
    return currency(tokens[0]).format();
  }

  const stack = new Array<currency>();

  for (const token of tokens) {
    const op = operators[token];

    if (op !== undefined) {
      const right = stack.pop()!;
      const left = stack.pop()!;
      stack.push(op.func(left, right));
    } else {
      stack.push(currency(token));
    }
  }

  if (stack.length > 1) {
    throw new Error('Insufficient operators');
  }

  return stack[0].format();
};

const stringifyExpression = (tokens: string[]): string => {
  if (!tokens) {
    return '0';
  }
  if (tokens.length === 1) {
    return tokens[0];
  }
  const stack: string[] = [];
  const result: string[] = [];

  for (const token of tokens) {
    const op = operators[token];
    if (op !== undefined) {
      let right = result.pop()!;
      const rightPriority = operators[stack.pop()!]?.priority || 100;
      if (rightPriority < op.priority || (rightPriority === op.priority && ['/', '-'].includes(token))) {
        right = `(${right})`;
      }

      let left = result.pop()!;
      const leftPriority = operators[stack.pop()!]?.priority || 100;
      if (leftPriority < op.priority) {
        left = `(${left})`;
      }

      result.push(`${left} ${token} ${right}`);
      stack.push(token);
    } else {
      result.push(currency(token).format());
      stack.push('');
    }
  }

  if (result.length === 1) {
    return result[0];
  } else {
    throw new Error('Invalid expression');
  }
};

export const rpn = {
  parse: parseExpression,
  eval: evalExpression,
  stringify: stringifyExpression,
};
