import { WebPanel } from './webpanel';
import * as vscode from 'vscode';
import { getExtension } from './extension';

export class Commands {
    static readonly FIND_QUESTIONS = 'extension.documentationQA';
    static readonly FIND_WORKITEMS = 'extension.showAssociatedWorkItems';
    static readonly FIND_EXPERTS = 'extension.showAssociatedExperts';
    constructor(private readonly serverUrl: string, private context: vscode.ExtensionContext) { }
    registerCommands() {
        this.registerExpertsCommand();
        this.registerWorkItemsCommand();
        this.registerQuestionCommand();
    }
    private registerWorkItemsCommand() {
        const disposable = vscode.commands.registerCommand(Commands.FIND_WORKITEMS, () => {
            showFolderChoiceDialog()
                .then(chosenFolderUri => {
                    if (chosenFolderUri !== undefined) {
                        const cmd = new WorkItemRetrievalCommand(this.serverUrl, chosenFolderUri);
                        cmd.submit();
                    }
                });
        });
        this.context.subscriptions.push(disposable);
    }
    private registerExpertsCommand() {
        const disposable = vscode.commands.registerCommand(Commands.FIND_EXPERTS, () => {
            showFolderChoiceDialog()
                .then(chosenFolderUri => {
                    if (chosenFolderUri !== undefined) {
                        const cmd = new ExpertsRetrievalCommand(this.serverUrl, chosenFolderUri);
                        cmd.submit();
                    }
                });
        });
        this.context.subscriptions.push(disposable);
    }
    private registerQuestionCommand() {
        const cmd = vscode.commands.registerCommand(Commands.FIND_QUESTIONS, () => {
            const cmd = new DocumentationQuestionCommand(this.serverUrl);
            cmd.submit();
        });
        this.context.subscriptions.push(cmd);
    }
}

class WorkItemRetrievalCommand {
    private readonly panel: WebPanel | undefined;
    constructor(private readonly serverUrl: string, private readonly folderUri: string) {
        const extensionPath = this.getExtensionPath();
        if (extensionPath !== undefined) {
            this.panel = new WebPanel(extensionPath);
        }
    }

    private getExtensionPath() {
        let myExt = getExtension();
        return myExt?.extensionPath;
    }

    public submit() {
        this.panel?.panel.webview.postMessage({
            command: 'search',
            serverHost: this.serverUrl,
            resource: 'workItems',
            folderUri: this.folderUri,
        });
    }
}

class ExpertsRetrievalCommand {
    private readonly panel: WebPanel | undefined;
    constructor(private readonly serverUrl: string, private readonly folderUri: string) {
        const extensionPath = this.getExtensionPath();
        if (extensionPath !== undefined) {
            this.panel = new WebPanel(extensionPath);
        }
    }

    private getExtensionPath() {
        let myExt = getExtension();
        return myExt?.extensionPath;
    }

    public submit() {
        this.panel?.panel.webview.postMessage({
            command: 'search',
            serverHost: this.serverUrl,
            resource: 'experts',
            folderUri: this.folderUri,
        });
    }

}



export class DocumentationQuestionCommand {

    private readonly panel: WebPanel | undefined;
    constructor(readonly serverUrl: String) {
        const extensionPath = this.getExtensionPath();
        if (extensionPath !== undefined) {
            this.panel = new WebPanel(extensionPath);
        }
    }

    private getExtensionPath() {
        let myExt = getExtension();
        return myExt?.extensionPath;
    }

    public submit() {
        this.getSelectionInEditorWindow();
        this.panel?.panel.webview.postMessage({
            command: 'findDocumentation',
            serverHost: this.serverUrl,
            folderUri: this.getAleatoryFolder(),
            queryTerm: this.getSearchTerm()
        });
    }
    getSearchTerm() {
        return this.getSelectionInEditorWindow();
    }

    getAleatoryFolder() {
        // FIXME: at the moment this bares no real effect on what is retried, but is still useful :) 
        return getWorkspaceFolders()[0];
    }

    getSelectionInEditorWindow() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        const selectedTextInEditor = activeEditor.document.getText(activeEditor.selection);
        return selectedTextInEditor;
    }
}

export function getWorkspaceFolders() {
    let workspaceFolders: string[] = [];
    let folders = vscode.workspace.workspaceFolders;
    if (folders !== undefined) {
        folders.forEach(element => workspaceFolders.push(element.uri.toString()));
    }

    return workspaceFolders;
}


function showFolderChoiceDialog() {
    const folders = getWorkspaceFolders();

    return vscode.window.showQuickPick(folders, {
        canPickMany: false,
        placeHolder: 'Pick a folder to query for'
    });
}