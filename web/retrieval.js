let currentPage = 0;
let currentServerHost;
let currentResource;
let currentIdentifier;

// noinspection JSUnresolvedFunction
const vscode = acquireVsCodeApi();

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
            data.forEach(item => {
                $('#content').append(`<h1>${item.title}</h1>`);
                $('#content').append(`<p>${item.body}</p>`);
            });
        }
    });
};

$(window).scroll(function () {
    if ($(document).height() - $(this).height() === $(this).scrollTop()) {
        getContent(currentServerHost, currentResource, currentIdentifier);
    }
});
