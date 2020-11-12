# GenderMag Recorders Assistant Style Guide

## Formatting : 
  - Line length (column limit)
    - Column limit is 80 characters. Any line exceeding said limit must be wrapped.
  - Line wrapping
    - Lines preferably should be broken at a higher syntactic level.
    - The syntactic levels(from highest to lowest): assignment, division, function call, parameters, number constant.
    - Each continuation line must be indented at least +4 from the original line.
  - Semi colons
    - Semicolons are required immediately at the end of their respective lines.
  - Curly brackets/braces
    - Required by all control structures. The first statement of a non-empty block must begin on its own line.
    - Be concise, empty blocks can be closed immediately after opening.
    - No line break before opening brace
    - Line breaks after opening and closing brace, and before closing brace.
    
## Naming and Comments: 
  - Naming 
    - Method and package names are written in lowerCamelCase, private methods end with _
    - Class, interface, record, typedef, and enum names are written in UpperCamelCase.
    - Constant names use all uppercase words separated by underscores.
    - Method names are typically verbs / verb phrases
  - Function header comments
    - Function name, description, and parameters need to be listed before each function.
  - File header comments
    - File name, functions, and descriptions need to be listed at the top of each file.
  - Comments in general
    - Block comments should be on the same level as the rest of the code
    - Subsequent lines must be aligned with *
    - Parameter name comments are preferred to be included with a “=”
  - File naming convention
    - All lowercase and can include underscores and dashes. 
    - Name is an overly simplified version of the task the function performs
    
## Other general:
  - CSS alphabetical order
    - All statements in CSS files must be included in alphabetical order
