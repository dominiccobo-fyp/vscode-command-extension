import * as vscode from 'vscode';
import * as request from 'request-promise-native';
import {EventEmitter} from 'events';
import {WebPanel} from "./webpanel";


const {spawn} = require('child_process');

export function activate(context: vscode.ExtensionContext) {

    const client = new LocalClient();
    const queryDispatcher = new QueryDispatcher(client, context);
    const healthProbe = new HealthProbe(client);
    healthProbe.getEventEmitter().on(HealthProbe.READY, () => {
        // TODO: do something on ready...
        vscode.window.showInformationMessage('Connected to local client',);
    });

    healthProbe.getEventEmitter().on(HealthProbe.DOWN, () => {
        // TODO: do something on ready...
        vscode.window.showWarningMessage('Disconnected from local client.');
    });

    onServerReady(healthProbe, client);
}


function getConnectorConfiguration() {
    var workspaceConfig = vscode.workspace.getConfiguration('vscode-context-command');
    let connectorIp = workspaceConfig.get('connectorIP');
    let connnectorPort = workspaceConfig.get('connectorPort');
    return `${connectorIp}:${connnectorPort}`;
}

function onServerReady(healthProbe: HealthProbe, localClient: LocalClient) {
    healthProbe.getEventEmitter().on(HealthProbe.READY, () => {
        updateServerCache(healthProbe, localClient);
    });
}

function updateServerCache(healthProbe: HealthProbe, localClient: LocalClient) {
    let uriOfFoldersInWorkspace = getWorkspaceFolders();

    request.put({
        uri: `http://${localClient.getLocalServerUrl()}/workspace/cache/upstream`,
        body: {
            "folderUris": uriOfFoldersInWorkspace
        },
        json: true
    });
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
        this.start();
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
                    if (res) {
                        newStatus = HealthProbe.READY;
                    } else {
                        newStatus = HealthProbe.DOWN;
                    }

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
            let response = await request.get({uri: `http://${url}/actuator/health`});
            if (this.isResponseHealthy(response)) {
                return true;
            }
        } catch (err) {
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
    let workspaceFolders: string[] = [];
    let folders = vscode.workspace.workspaceFolders;
    if (folders !== undefined) {
        folders.forEach(element => workspaceFolders.push(element.uri.toString()));
    }

    return workspaceFolders;
}

class QueryDispatcher {

    constructor(private client: LocalClient, private context: vscode.ExtensionContext) {
        this.registerCommands(context);
    }

    registerCommands(context: vscode.ExtensionContext) {
        let disposable = vscode.commands.registerCommand('extension.contextCommands', () => {

            let dialog = this.showQueryTopicDialog();
            dialog.then((topic) => {
                let workspaceFolders = getWorkspaceFolders();
                if ((workspaceFolders.length === 1)) {
                    console.log(`Retrieving ${topic} for ${workspaceFolders}`);
                    this.getItemsByTopic(topic, workspaceFolders[0]);
                } else {
                    this.showFolderChoiceDialog().then(folder => {
                        console.log(`Retrieving ${topic} for ${folder}`);
                        this.getItemsByTopic(topic, folder);
                    });
                }
            });
        });
        context.subscriptions.push(disposable);
    }

    getItemsByTopic(topic: String | undefined, folderUri: string | undefined) {
        switch (topic) {
            case 'Work Items':
                return this.getWorkItems(folderUri);
            case 'Experts':
                return this.getExperts(folderUri);
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

    async showQueryTopicDialog() {
        return vscode.window.showQuickPick(['Work Items', 'Experts'], {
            canPickMany: false,
            placeHolder: 'Pick one'
        });
    }

    showFolderChoiceDialog() {
        const folders = getWorkspaceFolders();

        return vscode.window.showQuickPick(folders, {
            canPickMany: false,
            placeHolder: 'Pick a folder to query for'
        });
    }

    submitContextQuery(title: string, folderUri: string | undefined, resource: string) {
        let myExt = getExtension();
        let myExtDir = myExt?.extensionPath;
        if (myExtDir !== undefined) {
            let panel = new WebPanel(myExtDir);
            let url = `localhost:${LocalClient.port}`;
            panel.panel.webview.postMessage(
                {
                    command: 'search',
                    serverHost: url,
                    resource: resource,
                    folderUri: folderUri
                }
            );
        }
    }

}

export function deactivate() {
}
