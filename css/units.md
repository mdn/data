# Units

[data](https://github.com/mdn/data/blob/main/css/units.json) |
[schema](https://github.com/mdn/data/blob/main/css/units.schema.json)

Units are CSS units like `em` or `px`. Most of them are defined in the
[CSS Values and Units specification](https://drafts.csswg.org/css-values/).

## Structure for units

A unit object looks like this:

```json
"ch": {
  "groups": [
    "CSS Values and Units"
  ],
  "status": "standard"
}
```

The 2 properties are both required.

* `groups` (array of strings): CSS is organized in modules like "CSS Values and Units". MDN organizes features in these groups as well — `groups` should contain the name of the module(s) the unit is defined in.
* `status` (enum string): This is either `standard`, `nonstandard`, `experimental` or `obsolete` depending on the standardization status of the feature.
