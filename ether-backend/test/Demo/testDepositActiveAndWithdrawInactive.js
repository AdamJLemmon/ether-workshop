const Demo = artifacts.require("./Demo.sol");

contract('Demo Active Deposit and Inactive Withdraw', function(accounts) {
    const owner = accounts[0];
    const user = accounts[1];
    const userAmount = 100;

    // Despoit then withdraw while state active
    it('should return funds to user on withdraw', function() {
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
            // Set state to inactive, enabling withdrawls
            return demo.setState(1, { from: owner });

        }).then(() => {
            // Withdraw entire balance from contract
            return demo.withdrawBalance({ from: user });

        }).then(() => {
            return demo.userBalances.call(user);

        }).then((balance) => {
            console.log('User balance: ' + balance);
            assert(balance.toNumber() === 0, 'User balance not updated');

		});
    });
});
