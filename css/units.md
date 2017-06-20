# Units

[data](https://github.com/mdn/data/blob/master/css/units.json) |
[schema](https://github.com/mdn/data/blob/master/css/units.schema.json)

Units are CSS units like `em` or `px`. Most of them are defined in the 
[CSS Values and Units specification](https://drafts.csswg.org/css-values/).

## Structure for units

A unit object looks like this:

```json
"ch": {
  "groups": [
    "CSS Units",
    "CSS Lengths"
  ],
  "status": "standard"
}
```

The 2 properties `groups` and `status` are required.
* `groups` (array of strings): CSS is organized in modules like "CSS Units" or "CSS Lengths". MDN organizes features in these groups as well.
* `status` (enum string): This is either `standard`, `nonstandard`, or `experimental` depending on the standardization status of the feature.