import * as vscode from "vscode";
import * as path from "path";

export class WebPanel {
    panel!: vscode.WebviewPanel;

    constructor(
        private extensionPath: string
    )
    {
        const webAppPath = path.join(extensionPath, "web");
        this.createWebPanel("Results", webAppPath);
    }

    private createWebPanel(title: string, webAppPath: string) {
        this.panel = vscode.window.createWebviewPanel('markdown.preview', title, vscode.ViewColumn.Two, {
            enableFindWidget: true,
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(webAppPath)]
        });
        this.panel.webview.html = this.formulateWebViewContent();
    }

    formulateWebViewContent() {

        const scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, 'web', 'retrieval.js')
        );

        // And the uri we use to load this script in the webview
        const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Results</title>
            </head>
            <body>
                <div id="content"></div>
                <h2 id="page"></h2>
            </body>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"></script>
            <script type="text/javascript" src="${scriptUri}" nonce="${this.getNonce()}"></script>
        </html>`;
    }

    getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
