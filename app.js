const ENDPOINT = "http://158.69.166.144:8080/list";
var serverIPList, serverList = [], playerTotal = 0;

const loadServerList = async () => {
    await fetch(ENDPOINT)
            .then(response => response.json())
            .then(data => {
                serverIPList = data.result.servers
            })
            .catch(error => {
                console.log(error);
            });

    await serverIPList.forEach(serverIP => {
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
};

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
    await loadServerList();
    setTimeout(() => {
        displayServerList();
}, 2000);
    console.log("Welcome. :) :) :) :) :)");
}

loadData();