const ENDPOINT = "http://158.69.166.144:8080/list";
var serverIPList, serverList = [], playerTotal = 0;

const loadServerList = async () => {
    const response = await fetch(ENDPOINT);
    const data = await response.json();
    serverIPList = data.result.servers;

    serverIPList.forEach(serverIP => {
        fetch('http://' + serverIP)
                .then(response => response.json())
                .then(data => {
                    playerTotal += data.numPlayers
                    serverList.push(data);
                })
                .catch(error => {
                    console.log(error)
                })
        });

        serverList.sort((p1, p2) => (p1.numPlayers > p2.numPlayers) ? -1 : 1);
        console.log(serverList);


/*
    for (var i = 0; i < serverIPList.length; i++) {
        const response = await fetch('http://' + serverIPList[i]);
        const server = await response.json();
        playerTotal += server.numPlayers;
        serverList.push(server);
        //displayServer(server);
    }

    */

};

const displayServerList = () => {
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

const displayServer = (server) => {
    let tableRow = '<tr><td>' + server.name + '</td><td>' + server.hostPlayer + '</td><td>' + server.map + '</td><td>' + server.variant + '</td><td>' + server.numPlayers + '/' + server.maxPlayers + '</td></tr>';
    $('table').append(tableRow);
    $('.game-state-label').text(playerTotal + " Players / " + serverIPList.length + " Servers");
}

const loadData = async() => {
    await loadServerList();
    await displayServerList();
    console.log("Welcome. :) :)");
}

loadData();