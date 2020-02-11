import { EventEmitter } from 'events';
import * as request from 'request-promise-native';
import * as vscode from 'vscode';
import { WebPanel } from './webpanel';
import { spawn } from 'child_process';
import { Commands, getWorkspaceFolders } from './Commands';


export function activate(context: vscode.ExtensionContext) {

    const client = new LocalClient();
    new Commands(`localhost:${LocalClient.port}`, context).registerCommands();
    const healthProbe = new HealthProbe(client);
    healthProbe.getEventEmitter().on(HealthProbe.READY, () => {
        // TODO: do something on ready...
        vscode.window.showInformationMessage('Connected to local client');
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

export class LocalClient {
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
            if(code === 1) {
                vscode.window.showWarningMessage("Server was already running. Using existing instance.");
            }
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
            let response = await request.get({ uri: `http://${url}/actuator/health` });
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


export function getExtension() {
    var allExtensions = vscode.extensions;
    var myExt = allExtensions.getExtension('dominiccobo.vscode-context-command');
    return myExt;
}

export function deactivate() {
}
