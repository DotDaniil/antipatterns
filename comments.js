// Antipattern: Comments
// ------------------------------------------------------------------------------------
{
    // Maybe is a recursive closure
    // if x and f are defined this will calculate f(x)
    // and return new instance of functional object
    const m = (x) => (f) => m(x && f ? f(x) : null);

    // So we can define a chain of value transformations
    m(5)((x) => x * 2)((x) => ++x)(console.log);
}
// ------------------------------------------------------------------------------------
// Resolution: Code should be read "as book".
// Refactor the code so the comments may be removed
// If your code has comments - maybe it's better to refactor it and drop the comments.
// Code should be written with KISS (Keep it simple stupid).
{
    const maybe = (value) => ({
        map(fn) {
            if (value && fn) return maybe(fn(value));
            return maybe(null);
        }
    });

    maybe(5)
        .map((x) => x * 2)
        .map((x) => ++x)
        .map(console.log);
// - It's just an example of the code refactoring "in place".
// - It may be  better to use the other approach;
}
// ------------------------------------------------------------------------------------
