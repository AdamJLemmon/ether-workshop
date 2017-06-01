const Demo = artifacts.require("./Demo.sol");

contract('Demo Active Deposit and Withdraw', function(accounts) {
    const owner = accounts[0];
    const user = accounts[1];
    const userAmount = 100;

    // Despoit then withdraw while state active
    it('should return throw invalid JUMP on withdraw', function() {
        let demo;

        // Deploy new deploy contract
        return Demo.new({ from: owner }).then((_demo) => {
            demo = _demo;
            return demo.deposit({
                from: user,
                value: userAmount
            });

        }).then(() => {
            // Check deposit successful
            return demo.userBalances.call(user);

        }).then((balance) => {
            console.log('User balance: ' + balance);
            assert(balance.toNumber() === 100, 'User balance not updated');

            // Withdraw entire balance from contract
            return demo.withdrawBalance({ from: user });

        }).then(() => {
            assert(false, 'Withdraw did not throw invalid JUMP')

        }).catch(function(error){
            console.log(error);
			// Error msg should contain invalid JUMP
			if(error.toString().indexOf('invalid JUMP') == -1) {
				assert(false, error.toString());
			}
		});
    });
});
