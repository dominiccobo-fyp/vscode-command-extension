const request = require("request-promise-native");
const fs = require("fs");
const process = require("process");

let azureAPIEnvVarKey = 'AZURE_ARTIFACTS_ENV_ACCESS_TOKEN';
let azureApiKey = process.env['AZURE_ARTIFACTS_ENV_ACCESS_TOKEN'];
if(azureApiKey === undefined) {
    console.log(`Please set Artifact API Env Var:  '${azureAPIEnvVarKey}'`);
    process.exit(-1);
}

let serverBuildVerEnvVarKey = 'SERVER_BUILD_VERSION';
let serverVersion = process.env[serverBuildVerEnvVarKey];
if(serverVersion === undefined) {
    console.log(`Please set desired version env var : ${serverBuildVerEnvVarKey}`);
    process.exit(-1);
}

fetchArtifact(azureApiKey, serverVersion);

function fetchArtifact(artifactApiKey, version) {
    let defaultAzureUsername = "AZURE_ARTIFACTS";
    let url = getAzureMavenResourceUrl('com.dominiccobo.fyp', 'context-lang-server', version);
    console.log(`Downloading ${url}`);

    request
        .get(url)
        .auth(defaultAzureUsername, artifactApiKey, true)
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(fs.createWriteStream('server.jar'));
}

function getAzureMavenResourceUrl(groupId, artifact, version) {
    let groupIdAsPath = transformGroupToPath(groupId); 
    return `https://pkgs.dev.azure.com/1422016/_packaging/1422016/maven/v1/${groupIdAsPath}/${artifact}/${version}/${artifact}-${version}.jar`;
}

function transformGroupToPath(group) {
    return String(group).split('.').join('/');
}