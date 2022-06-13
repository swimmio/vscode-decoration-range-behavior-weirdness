import * as vscode from "vscode";

export default class DecorationProvider implements vscode.Disposable {
    private readonly watDecorationType: vscode.TextEditorDecorationType;
    private activeEditor?: vscode.TextEditor;
    private disposable: vscode.Disposable;
    private timeout?: NodeJS.Timer;

    constructor(private readonly context: vscode.ExtensionContext) {
        this.watDecorationType = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        this.activeEditor = vscode.window.activeTextEditor;

        this.disposable = vscode.Disposable.from(
            this.watDecorationType,
            vscode.window.onDidChangeActiveTextEditor(editor => {
                this.activeEditor = editor;
                if (editor) {
                    this.triggerUpdateDecorations();
                }
            }, this),
            vscode.workspace.onDidChangeTextDocument(event => {
                if (this.activeEditor && event.document === this.activeEditor.document) {
                    this.triggerUpdateDecorations(true);
                }
            }, this)
        );

        if (this.activeEditor) {
            this.triggerUpdateDecorations();
        }
    }

    dispose() {
        this.disposable.dispose();
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }

    updateDecorations() {
        if (!this.activeEditor) {
            return;
        }

        const text = this.activeEditor.document.getText();
        const watDecorations: vscode.DecorationOptions[] = [];

        const regexp1 = /WAT1/g;
        let match;
        while ((match = regexp1.exec(text))) {
            const line = this.activeEditor.document.lineAt(this.activeEditor.document.positionAt(match.index));
            const range = line.range.with({end: line.range.end.with({character: 0})});

            const hoverMessage = new vscode.MarkdownString('[WAT1?!?!](command:vscode-decoration-range-behavior-weirdness.wat)');
            hoverMessage.isTrusted = true;

            const decoration: vscode.DecorationOptions = {
                range,
                hoverMessage,
            };

            decoration.renderOptions = {
                before: {
                    contentIconPath: vscode.Uri.joinPath(this.context.extensionUri, 'assets/star.svg'),
                }
            };

            watDecorations.push(decoration);
        }

        const regexp2 = /WAT2/g;
        while ((match = regexp2.exec(text))) {
            const line = this.activeEditor.document.lineAt(this.activeEditor.document.positionAt(match.index));
            const range = line.range.with(line.range.start.with({character: line.firstNonWhitespaceCharacterIndex}), line.range.end.with({character: line.firstNonWhitespaceCharacterIndex}));

            const hoverMessage = new vscode.MarkdownString('[WAT2?!?!](command:vscode-decoration-range-behavior-weirdness.wat)');
            hoverMessage.isTrusted = true;

            const decoration: vscode.DecorationOptions = {
                range,
                hoverMessage,
            };

            decoration.renderOptions = {
                before: {
                    contentIconPath: vscode.Uri.joinPath(this.context.extensionUri, 'assets/star.svg'),
                }
            };

            watDecorations.push(decoration);
        }

        this.activeEditor.setDecorations(this.watDecorationType, watDecorations);
    }

    triggerUpdateDecorations(throttle = false) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (throttle) {
            this.timeout = setTimeout(this.updateDecorations.bind(this), 500);
        } else {
            this.updateDecorations();
        }
    }
}
