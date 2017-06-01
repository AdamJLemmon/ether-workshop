const jayson = require('jayson');
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider("http://localhost:8545")
);
console.log('Web3 is connected: ' + web3.isConnected());

// Load the contract artifacts
const demoArtifacts = require('../build/contracts/Demo.json');

/*
* External API
*/
/// @dev TODO
const exposedApi = {
    /// @dev TODO deposit...
    deposit: function(params, callback) {
		let account = params['account']
		let amount = params['amount']

		// Load the demo
        loadContract(demoArtifacts).then(demo => {
            // Deposit the specified amount
            return demo.deposit({
                from: account,
                value: amount
            });

        }).then(res => {
			callback(null, res);
        }).catch(error => {
			console.log(error);
			callback(error, null);
        });
    },

	/// @dev TODO Set the state...
    setState: function(params, callback) {
		let state = params['state'];

        loadContract(demoArtifacts).then(demo => {

            // Deposit the specified amount
            return demo.setState(
				state,
				{ from: web3.eth.accounts[0] }
			);

        }).then(res => {
            callback(null, res);

        }).catch(error => {
			console.log(error);
			callback(error, null);
        });
    },

    /// @dev TODO Withdraw...
    withdraw: function(params, callback) {
		let account = params['account'];

        loadContract(demoArtifacts).then(demo => {
            return demo.withdrawBalance({ from: account });

		}).then(res => {
            callback(null, res);

        }).catch(error => {
			console.log(error);
			callback(error, null);
        });
    },
}

/*
* JSON RPC Server
*/
/// @dev TODO
const server = jayson.server(exposedApi);
const serverPort = 7777;
server.http().listen(serverPort);
console.log('Blockchain API Server Listening on: ' + serverPort);

/*
* Helpers
*/
/// @dev TODO
function loadContract(contractArtifacts) {
    // Detect current network in order to grab address if deployed
    return detectNetwork().then(network => {
        let address = contractArtifacts.networks[network].address;
        let abi = contractArtifacts.abi;

        return web3.eth.contract(abi).at(address);
    });
}

/// @dev TODO
function detectNetwork() {
    return new Promise((accept, reject) => {
        web3.version.getNetwork((err, res) => {
            accept(res.toString());
        });
    });
}


/*
* Test API Methods
*/
// exposedApi.deposit({
// 	'amount': 100,
// 	'account': web3.eth.accounts[0]
// });
// exposedApi.setState(1);
// exposedApi.withdrawBalance(web3.eth.accounts[0]);
