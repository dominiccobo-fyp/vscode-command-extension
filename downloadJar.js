const request = require("request-promise-native");
const fs = require("fs");
const process = require("process");

let azureAPIEnvVarKey = 'AZURE_ARTIFACTS_ENV_ACCESS_TOKEN';
const azureApiKey = process.env[azureAPIEnvVarKey];
if(azureApiKey === undefined) {
    console.log(`Please set Artifact API Env Var:  '${azureAPIEnvVarKey}'`);
    process.exit(-1);
}

const serverVersion = "0.7.0";

let repositoryEnvVarKey = 'PROJECT_MAVEN_REPOSITORY';
const repositoryUrl = process.env[repositoryEnvVarKey];
if(repositoryUrl === undefined) {
    console.log(`Please set Repository URL Env Var:  '${repositoryEnvVarKey}'`);
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
    return `${repositoryUrl}/${groupIdAsPath}/${artifact}/${version}/${artifact}-${version}.jar`;
}

function transformGroupToPath(group) {
    return String(group).split('.').join('/');
}