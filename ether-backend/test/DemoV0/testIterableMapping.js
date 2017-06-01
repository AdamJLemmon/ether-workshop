const Demo = artifacts.require("./Demo.sol");

contract('Demo Iterable Mapping', function(accounts) {

    // Add 2 key value pairs and retrieve them
    it("should return all key value pairs", function() {
        let demo;

        // Default test values
        const keys = [1, 2];
        const values = ['value1', 'value2'];

        // Deploy new deploy contract
        return Demo.new().then((_demo) => {
            demo = _demo;
            // Set first key
            return demo.setKeyValue(keys[0], values[0]);

        }).then(() => {
            // Set second key
            return demo.setKeyValue(keys[1], values[1]);

        }).then(() => {
            // Retrieve all key / values
            return demo.publishAllKeyValuePairs();

        // Returns the resulting transaction so will need to traverse the logs
        }).then((tx) => {
            let key, value;

            console.log('Quantity of Events Fired: ' + tx.logs.length);

            // There should have been two events fired
            assert(tx.logs.length === 2, 'Should have fired two events');

            // The events should match the keys and values set
            for (let i = 0; i <  tx.logs.length; i++) {
                key = tx.logs[i].args.key.toNumber();
                value = tx.logs[i].args.value.toString();

                console.log((i + 1) + '. ' + tx.logs[i].event + ': ' + ' key: ' + key + ' value: ' + value);

                assert(key === keys[i], 'Key did not match');
                assert(value === values[i], 'Value did not match');
            }

        });
    });
});
