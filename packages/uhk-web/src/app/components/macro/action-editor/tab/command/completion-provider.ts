import { retrieveUhkGrammar, buildUhkParser, ParserBuilder, Parser, Suggestion } from 'naive-autocompletion-parser';
import {} from '@materia-ui/ngx-monaco-editor';
import { LogService, } from 'uhk-common';

export class CustomCompletionProvider implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.\\@( \\$".split("");

    private parser: Parser | undefined;
    private identifierCharPattern = /[a-zA-Z]/;

    constructor( private logService: LogService ) {
        this.parser = undefined;

        // TODO: here, pass the actual reference-manual.md (from correct repository/tag) body into the buildUhkParser
        retrieveUhkGrammar().then ( grammarText => {
            this.parser = buildUhkParser(grammarText);
        });
    }

    guessKind(t: string): monaco.languages.CompletionItemKind {
        if (this.identifierCharPattern.test(t[0])) {
            return monaco.languages.CompletionItemKind.Text;
        } else if (t[0] == '<' && t[t.length-1] == '>') {
            return monaco.languages.CompletionItemKind.Property;
        } else {
            return monaco.languages.CompletionItemKind.Module;

        }
    }

    provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
        token: monaco.CancellationToken
    ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
        const lineNumber = position.lineNumber;
        const column = position.column;

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
                let kind = this.guessKind(it.suggestion);
                return {
                    label: it.suggestion,
                    kind: kind,
                    insertText: it.suggestion,
                    range: {
                        startLineNumber: lineNumber,
                        startColumn: column - it.overlap,
                        endLineNumber: lineNumber,
                        endColumn: column
                    }
                };
            });
            return {
                suggestions: monacoSuggestions
            };
        } else {
            return {
                suggestions: []
            };
        }
    }
}
