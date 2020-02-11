let currentPage = 0;
let currentServerHost;
let currentResource;
let currentIdentifier;

// noinspection JSUnresolvedFunction
const vscode = acquireVsCodeApi();
// noinspection JSUnresolvedVariable,JSUnresolvedFunction
const converter = new showdown.Converter();

window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.command) {
        case 'search':
            const serverHost = message.serverHost;
            const resource = message.resource;
            const folderUri = message.folderUri;
            return startFetch(serverHost, resource, folderUri);

        case 'findDocumentation': {
            const serverHost = message.serverHost;
            const folderUri = message.folderUri;
            const queryTerm = message.queryTerm;
            return startDocumentationRetrieval(serverHost, folderUri, queryTerm);
        }
    }
});

const startDocumentationRetrieval = function (serverHost, folderUri, queryTerm) {
    const url = `http://${serverHost}/documentation?uri=${folderUri}&query="${queryTerm}"`;
    currentServerHost = serverHost;
    currentResource = 'documentation';
    console.log(url);
    $.getJSON({
        url: url,
        success: (data, status) => {
            currentIdentifier = data.identifier;
            console.log(currentIdentifier);
            setTimeout(() => {
                getContent(serverHost, 'documentation', currentIdentifier);
            }, 2000);
        },
        error: (error) => {
            console.log(error);
        },
    });
};


const startFetch = function (serverHost, resource, folderUri) {
    const url = `http://${serverHost}/${resource}?uri=${folderUri}`;
    currentServerHost = serverHost;
    currentResource = resource;
    console.log(url);
    $.getJSON({
        url: url,
        success: (data, status) => {
            let identifier = data.identifier;
            currentIdentifier = identifier;
            setTimeout(() => {
                getContent(serverHost, resource, identifier);
            }, 2000);

        },
        error: (error) =>  {
            console.log(error);
        }
    });
};

$('#page').text(currentPage);
const getContent = function (serverHost, resource, identifier) {
    const url = `http://${serverHost}/${resource}/${identifier}?page=${currentPage}`;
    $.getJSON({
        url: url,
        success: (data, status) => {
            if(data.length > 0) {
                currentPage++;
            }
            $('#content').hide();
            $('#content').show();
            switch (resource) {
                case 'experts': {
                    displayExpertsResults(data);
                    break;
                }
                case 'workItems': {
                    displayWorkItemsResults(data);
                    break;
                }
                case 'documentation': {
                    displayDocumentationResults(data);
                    break;
                }
            }
        },
    });
};

$(window).scroll(function () {
    if ($(document).height() - $(this).height() === $(this).scrollTop()) {
        getContent(currentServerHost, currentResource, currentIdentifier);
    }
});

function displayExpertsResults(data) {
    data.forEach(item => {
        $('#content').append(`<h1>${item.expertName}</h1>`);
        $('#content').append('<h2>Contact Details</h2>');
        item.contactDetails.forEach(detail => {
            $('#content').append(`<p>${detail.meansName}: ${detail.details}</p>`);
        });
        $('#content').append('<h2>Expertise</h2>');
        item.expertTopics.forEach(topic => {
            $('#content').append(`<p>${topic.topicName}: ${topic.description}</p>`);
        });
    });
}

function displayWorkItemsResults(data) {
    data.forEach(item => {
        $('#content').append(`<h1>${item.title}</h1>`);
        $('#content').append(`<div>${converter.makeHtml(item.body)}</div>`);
    });
}

function displayDocumentationResults(data) {
    data.forEach((item) => {
        $('#content').append(`<h1><a href="${item.link}">${item.title}</a></h1>`);
        $('#content').append(`<div>${item.content.replace(/\n/g, '<br/>')}</div>`);
    });
}