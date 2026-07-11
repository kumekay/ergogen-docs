---
sidebar_position: 2
---

# Preprocessing

Ergogen does a separate preprocessor pass on the config before starting to interpret it.
This consists of the following steps:

- **Unnesting**: any object key containing dots (as in, `.`s) will be unnested. This allows the use of the so called "dot notation". For example, `nested.key.definition: value` will turn into `{nested: {key: {definition: value}}}` in the preprocessed config object.


- **Inheritance**: the `$extends` key can be used in any declaration to inherit values from another declaration. Extension happens according to the following rules:
    - if the new value is `undefined`, the old value will be used as a default;
    - if both values are defined (and have the same type), the new one will override the old;
    - if both values have different types, the new value will take precedence;
    - if the new value is `$unset`, the resulting value will be `undefined`, regardless of previous type;
    - for arrays or objects, extension is called for each child element recursively.

  The actual value of the `$extends` key should be the full absolute path of the declaration we wish to inherit from (using the above mentioned, nested "dot notation" if necessary). For example:

    ```yaml
    top:
        parent:
            a: 1
            b: 2
    child:
        $extends: top.parent
        c: 3
    ```

  This declaration will lead to `child` containing all three letter keys: `{a: 1, b: 2, c: 3}`.


- **Parameterization**: allows regex replacements within declarations. Take the following declaration as a starting point:

    ```yaml
    top:
        value: placeholder
        double_value: placeholder * 2
        $params: [placeholder]
        $args: [3]
    ```

  In this case, every occurrence of the value "placeholder" will be replaced with "3", which allows us to define it only once and still use it in multiple places (kind of like a pseudo-variable).


- **Skipping**: the `$skip` key can be used anywhere to, well, skip (or "comment out" entire declarations). It can also be useful when combining inheritance and parameterization. For example:

    ```yaml
    grandparent:
        a: placeholder1
        b: placeholder2
        $params: [placeholder1, placeholder2]
    parent:
        $extends: grandparent
        $args: [value1]
        $skip: true
    child:
        $extends: parent
        $args: [,value2]
        $skip: false
    ```

  Here, the grandparent defines two different parameters, but only the child knows both arguments that should be substituted. This would lead to an error at the parent's level, because it has two parameters, and only one argument. But, assuming that this is just an intermediary abstract declaration and we wouldn't want to use it anyway, we can just declare `$skip: true`. Note that `$skip` is inherited through `$extends` like any other field, so the child has to declare `$skip: false` to opt back in &ndash; otherwise it would be silently skipped along with its parent.

The result of the preprocessor is just a plain JSON object.
One thing to keep in mind for later, though, is how numbers are handled. For example, the value `3 * 2` is a string as far as the preprocessor is concerned, and it stays a string in the preprocessed config. But whenever a field is expected to contain a number, Ergogen tries to interpret such strings as mathematical formulas, and calculates their results.
This syntax also works with variables, which we can use to define units (see below).

Otherwise, we can begin with the actual keyboard-related layout...