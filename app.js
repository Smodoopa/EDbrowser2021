const ENDPOINT = "http://158.69.166.144:8080/list";
var serverIPList, serverList = [], playerTotal = 0;

const loadServerIPs = () => fetch(ENDPOINT)
            .then(response => response.json())
            .then(data => {
                serverIPList = data.result.servers
            })
            .catch(error => {
                console.log(error);
            });

const loadServerList = () => Promise.all(serverIPList.map(url =>
        fetch('http://' + url).then(resp => resp.json())
        )).then(data => {
            serverList = data;
        }).catch(err => 
            console.log(err)
        );

const displayServerList = () => {
    serverList.sort((p1, p2) => (p1.numPlayers > p2.numPlayers) ? -1 : 1);
    let serverTable = '';
    serverList.map(server => {
        let tableRow = '<tr><td>' + server.name + '</td><td>' + server.hostPlayer + '</td><td>' + server.map + '</td><td>' + server.variant + '</td><td>' + server.numPlayers + '/' + server.maxPlayers + '</td></tr>';
        serverTable += tableRow;
    });
    $('.loading').hide();
    $('table').append(serverTable);
    $('.game-state-label').text(playerTotal + " Players / " + serverIPList.length + " Servers");
}

const reloadServerList = () => {
    serverIPList = [];
    serverList = [];
    playerTotal = 0;
    $('tbody').find("tr:gt(0)").remove();
    $('.loading').show();
    loadData();
}

const loadData = async() => {
    await loadServerIPs;
    console.log(serverIPList);
    await loadServerList;
    console.log(serverList);
    displayServerList();

    console.log("Here's everything. :)");
}

loadData();