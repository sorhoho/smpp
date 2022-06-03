var smpp = require('smpp');
var session = smpp.connect({
	url: 'smpp://127.0.0.1:80',
	auto_enquire_link_period: 10000
});
session.bind_transceiver({
	system_id: 'test',
	password: '123456'
}, function(pdu) {
	if (pdu.command_status == 0) {
		// Successfully bound
		session.submit_sm({
			destination_addr: '66875067097',
			short_message: 'Hello!'
		}, function(pdu) {
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log(pdu.message_id);
			}
		});
	}
});

