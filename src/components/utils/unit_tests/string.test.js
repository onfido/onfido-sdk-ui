/* global expect */
import {lowerCase} from "../string.js"

test('Uppercase string transforms to lowercase', () => {
    expect(lowerCase("UppERCASE")).toBe("uppercase")
});
