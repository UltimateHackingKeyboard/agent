export function highlightProvider(): monaco.languages.IMonarchLanguage {
    return {
        keywords: [],

        typeKeywords: [],

        operators: [
            '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
            '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
            '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
            '%=', '<<=', '>>=', '>>>='
        ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*/^%]+/,

        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // identifiers and keywords
                [/[a-z_][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'keyword',
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }],
                [/\$[A-Za-z_][\w$]*/, 'type.identifier'],    // to show class names nicely

                // numbers
                [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
                [/\d+/, 'number'],
                [/true|false/, 'number'],

                // whitespace
                { include: '@whitespace' },

                // delimiters and operators
                [/[{}()[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],

                // delimiter: after number because of .\d floats
                [/[;,.]/, 'delimiter'],

                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'],    // non-teminated string
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

                // literalStrings
                [/'([^'\\]|\\.)*$/, 'string.invalid'],    // non-teminated string
                [/'/, { token: 'string.quote', bracket: '@open', next: '@literalString' }],
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],

            literalString: [
                [/[^\\']+/, 'string'],
                [/\\./, 'string.escape.invalid'],
                [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    };
}
