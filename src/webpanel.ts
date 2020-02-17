import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "fs";

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
        this.panel = vscode.window.createWebviewPanel('angular', title, vscode.ViewColumn.Two, {
            enableFindWidget: true,
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(webAppPath)]
        });
        this.panel.webview.html = this.formulateWebViewContent();
        this.panel.webview.onDidReceiveMessage(
            message => {
                if (message.hasOwnProperty('notification')) {
                    vscode.window.showInformationMessage(message.notification.message);
                }
            }
        )
    }

    getScriptPath(scriptFile: string) {
        return vscode.Uri.file(
            path.join(this.extensionPath, 'web', scriptFile)
        );
    }

    formulateWebViewContent() {

        // path to dist folder
        const appDistPath = path.join(this.extensionPath, 'web');
        const appDistPathUri = vscode.Uri.file(appDistPath);

        // path as uri
        const baseUri = this.panel.webview.asWebviewUri(appDistPathUri);

        // get path to index.html file from dist folder
        const indexPath = path.join(appDistPath, 'index.html');

        // read index file from file system
        let indexHtml = fs.readFileSync(indexPath, { encoding: 'utf8' });

        // update the base URI tag
        indexHtml = indexHtml.replace('<base href="/">', `<base href="${String(baseUri)}/">`);
        return indexHtml;


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
