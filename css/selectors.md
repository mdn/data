# Selectors

[data](https://github.com/mdn/data/blob/master/css/selectors.json) |
[schema](https://github.com/mdn/data/blob/master/css/selectors.schema.json)

[CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) define to which elements a set of CSS rules apply.

## Structure for selectors

A selector object looks like this:

```json
"General sibling selectors": {
  "syntax": "A ~ B",
  "groups": [
    "Combinators"
  ],
  "status": "standard"
}
```

The 3 properties `syntax`, `groups` and `status` are required.
* `syntax` (string): The syntax of the selector (e.g. `::after` with two colons indicating a pseudo-class or `A ~ B` indicating the combinator syntax).
* `groups` (array of strings): CSS is organized in modules like "CSS Units" or "CSS Lengths". MDN organizes features in these groups as well.
* `status` (enum string): This is either `standard`, `nonstandard`, or `experimental` depending on the standardization status of the feature.