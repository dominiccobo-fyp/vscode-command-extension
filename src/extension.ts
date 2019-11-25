import * as vscode from 'vscode';
import WebSocket = require('ws');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.contextCommands', () => {

        vscode.window.showQuickPick(['Work Items', 'Experts'], {
            canPickMany: false,
            placeHolder: 'Pick one'
        }).then((chosenTopic) => {
            vscode.window.showInputBox({prompt: 'Input the upstream'}).then(chosenUpstream => {
                    getItemsByTopic(chosenTopic, chosenUpstream)
                },
                (err) => {
                    console.error(err);
                });
        }, (f) => {
            console.log(f);
            vscode.window.showErrorMessage(`Could not retrieve ${f}`)
        });
    });
    context.subscriptions.push(disposable);
}

function getWorkspaceFolders() {

    let listOfAllFoldersWithUri = '<ul></ul>';
    let folders = vscode.workspace.workspaceFolders;
    if (folders !== undefined) {
        folders.forEach(element => {
            listOfAllFoldersWithUri += `<li>${element.name} - ${element.uri}</li>`
        });
    }

    return listOfAllFoldersWithUri;
}

function getItemsByTopic(topic: String | undefined, upstream: string | undefined) {
    switch (topic) {
        case 'Work Items':
            return getWorkItems(upstream);
        case 'Experts':
            return getExperts(upstream);
    }
}

function getExperts(upstream: string | undefined) {
    let title = 'Experts';
    let path = 'experts';
    submitContextQuery(title, upstream, path);
}

function getWorkItems(upstream: string | undefined) {
    let title = 'Work Items';
    let path = 'workItems';
    submitContextQuery(title, upstream, path);
}

function submitContextQuery(title: string, upstream: string | undefined, url: string) {
    let panel = vscode.window.createWebviewPanel('markdown.preview', title, vscode.ViewColumn.Two, {enableFindWidget: true});
    panel.webview.html = `<h1>${title}</h1>`;

    let gitContext = {
        gitContext: {
            remotes: {
                "remote": upstream
            }
        }
    };

    const ws = new WebSocket(`ws://localhost:8081/${url}`);
    ws.on('open', () => {
        ws.send(JSON.stringify(gitContext));
    });

    ws.on('message', (markdownResponse: string) => {
        console.log(markdownResponse);

        panel.webview.html += markdownResponse;
    });

    ws.on('error', (err) => {
        console.log(`Something went wrong whilst submitting the context query: ${err}`)
    });
}

export function deactivate() {
}
