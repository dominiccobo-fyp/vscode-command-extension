let currentPage = 0;
let currentServerHost;
let currentResource;
let currentIdentifier;

// noinspection JSUnresolvedFunction
const vscode = acquireVsCodeApi();
// noinspection JSUnresolvedVariable,JSUnresolvedFunction
const converter = new showdown.Converter();

window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.command) {
        case 'search':
            let serverHost = message.serverHost;
            let resource = message.resource;
            let folderUri = message.folderUri;
            return startFetch(serverHost, resource, folderUri);
    }
});

let startFetch = function(serverHost, resource, folderUri) {
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

let getContent = function(serverHost, resource, identifier) {
    $('#page').text(currentPage);
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
                    data.forEach(item => {
                        $('#content').append(`<h1>${item.expertName}</h1>`);
                        $('#content').append('<h2>Contact Details</h2>')
                        item.contactDetails.forEach(detail=> {
                            $('#content').append(`<p>${detail.meansName}: ${detail.details}</p>`);
                        });
                        $('#content').append('<h2>Expertise</h2>')
                        item.expertTopics.forEach(topic => {
                            $('#content').append(`<p>${topic.topicName}: ${topic.description}</p>`);
                        });
                    });
                    break;
                }
                case 'workItems': {

                    data.forEach(item => {
                        $('#content').append(`<h1>${item.title}</h1>`);
                        $('#content').append(`<div>${converter.makeHtml(item.body)}</div>`);
                    });
                    break;
                }
            }
        }
    });
};

$(window).scroll(function () {
    if ($(document).height() - $(this).height() === $(this).scrollTop()) {
        getContent(currentServerHost, currentResource, currentIdentifier);
    }
});
