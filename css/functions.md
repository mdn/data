# Functions

[data](https://github.com/mdn/data/blob/main/css/functions.json) |
[schema](https://github.com/mdn/data/blob/main/css/functions.schema.json)

[CSS value functions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions) are statements that invoke special data processing or calculations to return a CSS value for a CSS property. CSS value functions represent more complex data types and they may take some input arguments to calculate the return value.

The value syntax starts with the **name of the function**, followed by a left parenthesis (. Next up are the argument(s), and the function is finished off with a closing parenthesis ).

Functions can take multiple arguments, which are formatted similarly to CSS property values. Whitespace is allowed, but they are optional inside the parentheses. In some functional notations multiple arguments are separated by commas, while others use spaces.

```javascript
selector {
  property: function([argument]? [, argument]!);
}
```

For more information about the formal grammar of CSS syntaxes, see [CSS value functions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions).
