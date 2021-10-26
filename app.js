const ENDPOINT = "http://158.69.166.144:8080/list",
teamColorCodes = ['f8332d', '3c7ed4', 'green', 'gold', 'purple', 'yellow', 'brown', 'pink', 'white'],
teamNames = ["Red", "Blue", "Green", "Gold", "Purple", "Yellow", "Brown", "Pink"];
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
        fetch('http://' + url)
        .then(resp => resp.json())
        )).then(data => {
            serverList = data;
            for (var i = 0; i < serverList.length; i++) 
                serverList[i].mods.push(serverIPList[i]);
            
            serverList.sort((p1, p2) => (p1.numPlayers > p2.numPlayers) ? -1 : 1);
            console.log(data);
        }).catch(err => 
            console.log(err)
        );

const displayServerList = () => {
    let serverTable = '';
    serverList.map(server => {
        let tableRow = '<tr onclick = toggleModal(this)><td>' + server.name + '</td><td>' + server.hostPlayer + '</td><td>' + server.map + '</td><td>' + server.variant + '</td><td>' + server.numPlayers + '/' + server.maxPlayers + '</td></tr>';
        serverTable += tableRow;
    });
    $('.loading').hide();
    $('.footer').show();
    $('.server-table').append(serverTable);
    $('.game-state-label').text(playerTotal + " Players / " + serverIPList.length + " Servers");
}

const reloadServerList = () => {
    serverIPList = [];
    serverList = [];
    playerTotal = 0;
    $('tbody').find("tr:gt(0)").remove();
    $('.loading').show();
    $('.footer').hide();
    loadData();
}

const toggleModal = (listIndex) => {
    if ($('.server-modal').css('display') == "none") {
        $('.server-modal').css('display', 'flex');

        let playerTable = '',
        selectedServer = serverList[listIndex.rowIndex - 1],
        serverPlayers = serverList[listIndex.rowIndex - 1].players,
        sortedTeams = [];

            if (selectedServer.teams) {
                console.log("TEAM");
                let originalTeamScores = JSON.parse(JSON.stringify(selectedServer.teamScores));
                console.log(originalTeamScores);
                
                //Sorting Players of each Team.
                //Add sorted teams to the main array.
                for (var i = 0; i < 9; i++) {
                    let tempTeamArray = [];
                    serverPlayers.forEach(player => {
                        if (player.team == i) 
                            tempTeamArray.push(player);
                    })
                    tempTeamArray.sort((p1, p2) => (p1.score > p2.score) ? -1 : 1);
                    sortedTeams.push(tempTeamArray);
                }
                
                console.log(sortedTeams);
                
                for (var i = 0; i < 8; i++) {
                    let indexOfGreatest = originalTeamScores.indexOf(Math.max(...originalTeamScores));
                    console.log(indexOfGreatest);
                    sortedTeams[indexOfGreatest].forEach((player, index) => {
                            if (index == 0) playerTable += '<tr style="background-color:' + teamColorCodes[player.team] + '"><td>' + teamNames[player.team] + ' Team</td><td></td><td>' + selectedServer.teamScores[player.team] + '</td><td></td><td></td><td></td></tr>';

                             let tableRow = '<tr style="background-color:' + teamColorCodes[player.team] + '"><td>' + player.name + '</td><td>' + player.serviceTag + '</td><td>' + player.score + '</td><td>' + player.kills + '</td><td>' + player.deaths + '</td><td>' + player.assists + '</td></tr>';
                             
                             playerTable += tableRow;
                        });

                    originalTeamScores[indexOfGreatest] = -2;
                }

            } else {
                console.log("FFA");
                serverPlayers.sort((p1, p2) => (p1.score > p2.score) ? -1 : 1);
                serverPlayers.map(player => {
                 let tableRow = '<tr style="background-color:' + player.primaryColor + '"><td>' + player.name + '</td><td>' + player.serviceTag + '</td><td>' + player.score + '</td><td>' + player.kills + '</td><td>' + player.deaths + '</td><td>' + player.assists + '</td></tr>';
                 playerTable += tableRow;
                });
             }      

        $('.server-map-image').attr("src", selectedServer.mapFile + ".png");       
        $('.server-header').text(selectedServer.variant + ' on ' + selectedServer.map);
        $('.host').html(selectedServer.hostPlayer);
        $('.name').html(selectedServer.name);
        $('.ip').html(selectedServer.mods[0]);
        $('.status').html(selectedServer.status);

        $('.player-table').append(playerTable);

    } else {
        $('.server-modal').css('display', 'none');
        $('.server-modal > table > tbody').find("tr:gt(0)").remove();
    }
}



const loadData = async() => {
    await loadServerIPs();
    await loadServerList();
    displayServerList();

    console.log("Here's everything. :)");
}

loadData();