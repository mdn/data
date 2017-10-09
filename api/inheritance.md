# Types

[data](https://github.com/mdn/data/blob/master/api/inheritance.json) |
[schema](https://github.com/mdn/data/blob/master/css/inheritance.schema.json)

The inheritance files defines, for each interface, the parent that they inherit properties and methods from, as well as the mixins that they implements.

## Structure for inheritance data of a specific name

The overall inheritance data is an object with one property per interface.
Each interface entry looks like the following example (E.g. for the DocumentFragment interface).

```json
"DocumentFragment": {
  "inherits": "Node",
  "implements": [
    "ParentNode",
    "LegacyQueryInterface"
  ]
}
```

The 2 properties are both required.
* `inherits` (a string): the name of the interface it inherits properties and methods from. If "", it means it doesn't inherit from any interface.
* `implements` (array of strings): the list of mixins it implements the methods and properties. The array can be empty.
