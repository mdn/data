# Properties

[data](https://github.com/mdn/data/blob/master/css/properties.json) |
[schema](https://github.com/mdn/data/blob/master/css/properties.schema.json)

In its core, CSS consists of [properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index).

## Structure for long-hand properties
A long-hand property might look like this:

```json
"background-color": {
  "syntax": "<color>",
  "media": "visual",
  "inherited": false,
  "animationType": "color",
  "percentages": "no",
  "groups": [
    "CSS Background and Borders"
  ],
  "initial": "transparent",
  "appliesto": "allElements",
  "computed": "computedColor",
  "order": "uniqueOrder",
  "alsoAppliesTo": [
    "::first-letter",
    "::first-line",
    "::placeholder"
  ],
  "status": "standard"
},
```
## Properties of a `Property` object

There are 11 required properties in this object:
* `syntax` (string): This is the formal syntax of the property and is usually given in the specification. It might contain references to [syntax data](https://github.com/mdn/data/blob/master/css/syntaxes.md).
For more information see also
[Value definition syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax)
on MDN and the [CSS Values and Units](https://www.w3.org/TR/css3-values/#value-defs) specification.
* `media` (string): The media groups like "all, visual" (multiple are comma separated).
* `inherited` (boolean): Whether or not the property is inherited. See [inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) for details.
* `animationType`(enum or array of property names):
  * If an enum (for long-hand properties), this is the animation type of the property.
  * If an array (for short-hand properties), these are the properties the animation type taken from.
* `percentages`(enum or array of property names):
  * If an enum (for long-hand properties), this is what the percentage of the property refers to.
  * If an array (for short-hand properties), these are the properties the percentages refer to.
* `groups` (array of unique strings with at least 1 entry): CSS is organized in modules like "CSS Fonts" or "CSS Animations". MDN organizes features in these groups as well.
* `initial`(string or array of property names):
  * If a string (for long-hand properties), this is the initial value of the property.
  * If an array (for short-hand properties), these are the properties the initial value is taken from.
* `appliesto`(enum): To which elements the property applies to. See the schema for [a list of enums](https://github.com/mdn/data/blob/master/css/syntaxes.schema.json#L153)
* `computed`(enum or array of property names):
  * If an enum (for long-hand properties), this is the computed value of the property. See the schema for [a list of enums](https://github.com/mdn/data/blob/master/css/syntaxes.schema.json#L87).
  * If an array (for short-hand properties), these are the properties the value computed from.
* `order`(enum): The canonical order. See the schema for [a list of enums](https://github.com/mdn/data/blob/master/css/syntaxes.schema.json#L234).
* `status` (enum): This is either `standard`, `nonstandard`, or `experimental` depending on the standardization status of the feature.

There are 2 more properties that are optional:
* `stacking` (boolean): Whether or not the property is creates a stacking context. See [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) for details.
* `alsoAppliesTo` (enum): To which elements the property also applies to. See the schema for [a list of enums](https://github.com/mdn/data/blob/master/css/syntaxes.schema.json#L222)

## Structure for short-hand properties
A short-hand property might look like this:

```json
"background": {
  "syntax": "[ <bg-layer> , ]* <final-bg-layer>",
  "media": "visual",
  "inherited": false,
  "animationType": [
    "background-color",
    "background-image",
    "background-clip",
    "background-position",
    "background-size",
    "background-repeat",
    "background-attachment"
  ],
  "percentages": [
    "background-position",
    "background-size"
  ],
  "groups": [
    "CSS Background and Borders"
  ],
  "initial": [
    "background-image",
    "background-position",
    "background-size",
    "background-repeat",
    "background-origin",
    "background-clip",
    "background-attachment",
    "background-color"
  ],
  "appliesto": "allElements",
  "computed": [
    "background-image",
    "background-position",
    "background-size",
    "background-repeat",
    "background-origin",
    "background-clip",
    "background-attachment",
    "background-color"
  ],
  "order": "orderOfAppearance",
  "alsoAppliesTo": [
    "::first-letter",
    "::first-line",
    "::placeholder"
  ],
  "status": "standard"
},
```