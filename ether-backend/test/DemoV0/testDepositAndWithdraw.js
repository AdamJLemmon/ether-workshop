const DemoV0 = artifacts.require("./DemoV0.sol");

contract('DemoV0 Deposit and Withdraw', function(accounts) {
    const owner = accounts[0];
    const user = accounts[1];
    const userAmount = 100;

    // Despoit then withdraw
    it('should return the funds to the user', function() {
        let demo;

        // Deploy new deploy contract
        return DemoV0.new({ from: owner }).then((_demo) => {
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
            // Check withdraw successful
            return demo.userBalances.call(user);

        }).then((balance) => {
            console.log('User balance: ' + balance);
            assert(balance.toNumber() === 0, 'User balance not updated');
        });
    });
});
