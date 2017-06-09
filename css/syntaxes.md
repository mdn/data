# Syntaxes

[data](https://github.com/mdn/data/blob/master/css/syntaxes.json) |
[schema](https://github.com/mdn/data/blob/master/css/syntaxes.schema.json)

[CSS basic data types](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types) define the kinds of values (keywords and units) accepted by CSS properties and functions.

There are used, for example, for property syntaxes:
```json
"background-attachment": {
  "syntax": "<attachment>#"
}
```

## Structure for syntaxes
_(update if #41 gets merged)_

Simple values:

```json
{
  "attachment": "scroll | fixed | local"
}
```
Values referencing 
[CSS types](https://github.com/mdn/data/blob/master/css/types.md):

```json
{
  "alpha-value": "<number> | <percentage>"
}
```

Values referencing other syntaxes:

```json
{
  "shape-radius": "<length-percentage> | closest-side | farthest-side",
  "length-percentage": "<length> | <percentage>" 
}
```