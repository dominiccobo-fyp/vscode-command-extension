import * as vscode from 'vscode';
import WebSocket = require('ws');

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.contextCommands', () => {
		vscode.window.showQuickPick(['Work Items'], {canPickMany: false, placeHolder: 'Pick one'}).then((s) => {
			vscode.window.showInputBox({prompt: 'Input the upstream'}).then(upstream => {
				getWorkItems(s, upstream);
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
	if(folders !== undefined) {
		folders.forEach(element => {
			listOfAllFoldersWithUri += `<li>${element.name} - ${element.uri}</li>`
		});
	}

	return listOfAllFoldersWithUri;
}

function getWorkItems(topic: string | undefined, upstream: string | undefined) {

	const ws = new WebSocket('ws://localhost:8081/workItems');
	let workItems: WorkItem[] = [];
	let panel = vscode.window.createWebviewPanel('markdown.preview', `My ${topic}`, vscode.ViewColumn.Two, {enableFindWidget: true});
	panel.webview.html = `<h1> ${topic}</h1>`
	
	var sampleContext = {
        gitContext: {
            remotes: {
                "remote": upstream
            }
        }
    };

	ws.on('open', () => {
		ws.send(JSON.stringify(sampleContext));
	});
	
	ws.on('message', (data: string) => {
		let result = JSON.parse(data);
	 	panel.webview.html += `<h2>${result.title}</h2> <div>${result.body}</div>`
	});

	ws.on('error', (err) => {
		// TODO; handle error...
	});
}

class WorkItem {
    constructor(title: string, body: string) {}
}

export function deactivate() {}
