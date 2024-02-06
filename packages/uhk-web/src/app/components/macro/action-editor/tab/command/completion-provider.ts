import { retrieveUhkGrammar, buildUhkParser, ParserBuilder, Parser, Suggestion } from 'naive-autocompletion-parser'
import {} from '@materia-ui/ngx-monaco-editor';

import { LogService, } from 'uhk-common';


export class CustomCompletionProvider implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.\\@( \\$".split("");

    private parser: Parser | undefined;

    constructor( private logService: LogService ) {
        this.parser = undefined;

        // TODO: here, pass the actual reference-manual.md (from correct repository/tag) body into the buildUhkParser
        retrieveUhkGrammar().then ( grammarText => {
            this.parser = buildUhkParser(grammarText);
        });
    }

    provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
        token: monaco.CancellationToken
    ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
        // Your logic to provide completion items based on the model, position, and context
        // This function should return a CompletionList object
        // Example:
        const suggestions: monaco.languages.CompletionItem[] = [
            {
                label: 'exampleCompletion',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'exampleCompletion',
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column - 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                }
            }
        ];

        const lineNumber = position.lineNumber;
        const column = position.column;

        // Get the current line text up until the cursor position
        const lineText = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: column
        });

        if (this.parser) {
            let nelaSuggestions: Suggestion[] = [];
            try {
                nelaSuggestions = this.parser.complete(lineText, "BODY");
            } catch (e) {
                this.logService.error(e);
            }
            let monacoSuggestions: monaco.languages.CompletionItem[] = nelaSuggestions.map (it => {
                return {
                    label: it.suggestion,
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: it.suggestion,
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column - it.overlap,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    }
                }
            })
            return {
                suggestions: monacoSuggestions
            }
        } else {
            return {
                suggestions: []
            }
        }
    }
}
