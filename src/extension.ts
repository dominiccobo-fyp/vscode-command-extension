import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.contextCommands', () => {
		vscode.window.showQuickPick(['Work Items', 'Experts'], {canPickMany: false, placeHolder: 'Pick one'}).then((s) => {
			console.log(`User selected ${s}`);
			fetchContextRequest(s);
		}, (f) => {
			console.log(f);
			vscode.window.showErrorMessage(`Could not retrieve ${f}`)
		});
	});
	context.subscriptions.push(disposable);
}
function getWorkspaceFolders() {

	let listOfAllFoldersWithUri = '<ul></ul>'
	let folders = vscode.workspace.workspaceFolders;
	if(folders !== undefined) {
		folders.forEach(element => {
			listOfAllFoldersWithUri += `<li>${element.name} - ${element.uri}</li>`
		});
	}

	return listOfAllFoldersWithUri;
}

function getWorkItems() {
	
	let workItems = [
		{
			'title': 'Test',
			'body': 'This is a comment on an issue\ntest'
		},
		{
			'title': 'Test ABC',
			'body': 'This is a comment on another issue\ntest'
		},
		{
			'title': 'Test',
			'body': 'This is a comment on an issue\ntest'
		}
	]
	return workItems;
}

function fetchContextRequest(topic: string) {
	let panel = vscode.window.createWebviewPanel('markdown.preview', `My ${topic}`, vscode.ViewColumn.Two, {enableFindWidget: true});

	if(topic === 'Work Items') {
		panel.webview.html = `<h1> ${topic}</h1> ${formatWorkItems(getWorkItems())}`
	}
	else {
		panel.webview.html = '<h1>Unknown topic</h1>'
	}

}

function formatWorkItems(workItems: [any]) {
	let formattedDisplay = '';
	workItems.forEach(element => {
		formattedDisplay += `<h2>${element.title}</h2> <div>${element.body}</div>`
	});
	return formattedDisplay;
}

export function deactivate() {}
