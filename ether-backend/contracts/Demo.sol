pragma solidity ^0.4.6;

// Base circuit breaker demo

/// @title Demo Version 1 - Upgraded to inclue circuit breaker
/// @author Adam Lemmon - <adamjlemmon@gmail.com>
contract Demo {
	/*
	* Storage
	*/
	address private owner;

	enum State { active, inactive }
	State public state = State.active;

	// Iterable Mapping
	// Map key => index of its value
	mapping(uint=>uint) public keyToIndexMap;
	string[] public values;
	uint[] public keys;

	mapping (address => uint) public userBalances;

	/*
	* Modifiers
	*/
	modifier onlyOwner {
		if(msg.sender != owner) throw;
		_;
	}

	/// @dev In case of circuit breaker continue to allow method to function
	modifier enableOnInactive {
		if (state != State.inactive) throw;
		_;
	}

	/// @dev Disable method if circuit breaker set
	modifier haltOnInactive {
		if (state == State.inactive) throw;
		_;
	}

	/*
	* Events
	*/
	event PublishAllKeyValuePairs(uint key, string value);

	/// @dev Contract constructor
	function Demo() {
		owner = msg.sender;
	}

	/*
	* External
	*/
	/// @dev Deposit from external address
	function deposit()
		external
		payable
		haltOnInactive
	{
	    userBalances[msg.sender] += msg.value;
	}

	/// @dev Secure withdraw from external address only on inactive
	function withdrawBalance()
		external
		enableOnInactive
	{
	    uint amount = userBalances[msg.sender];

		if (amount <= 0) throw;

		// Zero the balance before sending
		userBalances[msg.sender] = 0;

		if (!msg.sender.send(amount)) { throw; }
	}

	/*
	* Public
	*/
	/// @dev Set a key's value by appending key and value to arrays
	/// and update mapping with new value's index
	function setKeyValue(uint key, string value) public {
		keyToIndexMap[key] = values.length;
		keys.push(key);
		values.push(value);
	}

	/// @dev Toggle the circuit breaker to
	/// enable / disable functionality
	function setState(uint _state)
		public
		onlyOwner
	{
		state = State(_state);
	}

	/// @dev Iterate over an entire mapping
	/// publishing each key / value pair
	function publishAllKeyValuePairs() public {
		for (var i = 0; i < keys.length; i++) {
			uint valueIndex = keyToIndexMap[keys[i]];
			string value = values[valueIndex];

			PublishAllKeyValuePairs(keys[i], value);
		}
	}
}
