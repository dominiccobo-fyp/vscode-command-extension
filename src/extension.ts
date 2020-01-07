import * as vscode from 'vscode';
import WebSocket = require('ws');
import process = require('process');
const { spawn } = require('child_process');
import * as request from 'request-promise-native';
import { EventEmitter } from 'events';

export function activate(context: vscode.ExtensionContext) {
    
    const client = new LocalClient();
    const queryDispatcher = new QueryDispatcher(client, context);
    const healthProbe = new HealthProbe(client);
    healthProbe.getEventEmitter().on(HealthProbe.READY, () => {
        // TODO: do something on ready...
        vscode.window.showInformationMessage('Connected to local client', );
    });

    healthProbe.getEventEmitter().on(HealthProbe.DOWN, () => {
        // TODO: do something on ready...
        vscode.window.showWarningMessage('Disconnected from local client.');
    });
    updateServerCache();
}

async function updateServerCache() {
    
}

function getConnectorConfiguration() {
    var workspaceConfig = vscode.workspace.getConfiguration('vscode-context-command');
    let connectorIp = workspaceConfig.get('connectorIP');
    let connnectorPort = workspaceConfig.get('connectorPort');
    return `${connectorIp}:${connnectorPort}`;
}


class LocalClient {

    static port: number = 30241;

    constructor() {
        this.start();
    }

    private async start() {
        this.startUpJavaServer();
    }

    async startUpJavaServer() {
        var myExt = getExtension();
        var myExtDir = myExt?.extensionPath;
        var runCommand = 'java';
        var spawnArgs = ['-jar', `${myExtDir}/server.jar`, `--axon.axonserver.servers=${getConnectorConfiguration()}`, `--server.port=${LocalClient.port}`];

        const server = spawn(runCommand, spawnArgs);

        this.connectStardardOut(server);
        this.connectStandardError(server);
        this.registerProcessCloseHandler(server);
    }

    private registerProcessCloseHandler(server: any) {
        server.on('close', (code: any) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    private connectStandardError(server: any) {
        server.stderr.on('data', (data: any) => {
            console.error(`${data}`);
        });
    }

    private connectStardardOut(server: any) {
        server.stdout.on('data', (data: any) => {
            console.log(`${data}`);
        });
    }

    getLocalServerUrl() {
        return `localhost:${LocalClient.port}`;
    }
}

class HealthProbe {

    private eventEmitter: EventEmitter = new EventEmitter();
    public static READY: string = 'READY';
    public static DOWN: string = 'DOWN';
    private currentStatus: string = 'DOWN';

    constructor(private client: LocalClient) {
        this.start() ;
    }

    private start() {
        this.startServerLivenessCheck();
    }


    public getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }


    private startServerLivenessCheck() {
        setInterval(() => {
            this.isServerUp()
            .then(res => {
                let newStatus = '';
                if (res) { newStatus = HealthProbe.READY; }
                else { newStatus = HealthProbe.DOWN; }
    
                if (newStatus !== this.currentStatus) {
                    this.eventEmitter.emit(newStatus);
                    this.currentStatus = newStatus;
                }
            });
        }, 3000);
    }

    private async isServerUp() {
        let returnValue = false;
        let url = this.client.getLocalServerUrl();

        try {
            let response = await request.get({ uri: `http://${url}/actuator/health` });
            if (this.isResponseHealthy(response)) {
                return true;
            }
        }
        catch(err) {
            return false;
        }
        return false;
    }

    private isResponseHealthy(response: string) {
        const body = JSON.parse(response);
        return body.status === 'UP';
    }

}


function getExtension() {
    var allExtensions = vscode.extensions;
    var myExt = allExtensions.getExtension('dominiccobo.vscode-context-command');
    return myExt;
}



function getWorkspaceFolders() {

    let listOfAllFoldersWithUri = '<ul></ul>';
    let folders = vscode.workspace.workspaceFolders;
    if (folders !== undefined) {
        folders.forEach(element => {
            listOfAllFoldersWithUri += `<li>${element.name} - ${element.uri}</li>`;
        });
    }

    return listOfAllFoldersWithUri;
}

class QueryDispatcher {

    constructor(private client: LocalClient, private context: vscode.ExtensionContext) {
        this.registerCommands(context); 
    }

    registerCommands(context: vscode.ExtensionContext) {
        let disposable = vscode.commands.registerCommand('extension.contextCommands', () => {
            vscode.window.showQuickPick(['Work Items', 'Experts'], {
                canPickMany: false,
                placeHolder: 'Pick one'
            }).then((chosenTopic) => {
                vscode.window.showInputBox({ prompt: 'Input the upstream' }).then(chosenUpstream => {
                    this.getItemsByTopic(chosenTopic, chosenUpstream);
                }, (err) => {
                    console.error(err);
                });
            }, (f) => {
                console.log(f);
                vscode.window.showErrorMessage(`Could not retrieve ${f}`);
            });
        });
        context.subscriptions.push(disposable);
    }

    getItemsByTopic(topic: String | undefined, upstream: string | undefined) {
        switch (topic) {
            case 'Work Items':
                return this.getWorkItems(upstream);
            case 'Experts':
                return this.getExperts(upstream);
        }
    }

    getExperts(upstream: string | undefined) {
        let title = 'Experts';
        let path = 'experts';
        this.submitContextQuery(title, upstream, path);
    }

    getWorkItems(upstream: string | undefined) {
        let title = 'Work Items';
        let path = 'workItems';
        this.submitContextQuery(title, upstream, path);
    }

    submitContextQuery(title: string, upstream: string | undefined, url: string) {
        let panel = vscode.window.createWebviewPanel('markdown.preview', title, vscode.ViewColumn.Two, { enableFindWidget: true });
        panel.webview.html = `<h1>${title}</h1>`;
    
        let gitContext = {
            gitContext: {
                remotes: {
                    "remote": upstream
                }
            }
        };
    
        const ws = new WebSocket(`ws://${this.client.getLocalServerUrl()}/${url}`);
        ws.on('open', () => {
            ws.send(JSON.stringify(gitContext));
        });
    
        ws.on('message', (markdownResponse: string) => {
            console.log(markdownResponse);
    
            panel.webview.html += markdownResponse;
        });
    
        ws.on('error', (err) => {
            console.log(`Something went wrong whilst submitting the context query: ${err}`);
        });
    }

}

export function deactivate() {
}
