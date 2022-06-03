var smpp = require('smpp');
var session = smpp.connect({
	url: 'smpp://127.0.0.1:2700',
	auto_enquire_link_period: 10000
});




var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;
            var mobile = JSON.parse(msg.content.toString()).msisdn
	    var textmessage = JSON.parse(msg.content.toString()).text
	    //var mobile = '668848484848';
	    //var textmessage ='hellow sorawit';	
            console.log(" [x] Received %s", mobile + textmessage);
	    sendsms(mobile,textmessage);
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});



function sendsms(msisdn,txtmsg) 
{

session.bind_transceiver({
	system_id: 'test',
	password: '123456'
}, function(pdu) {
	if (pdu.command_status == 0) {
		// Successfully bound
		session.submit_sm({
			destination_addr: msisdn,
			short_message: txtmsg
		}, function(pdu) {
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log(pdu.message_id);
			}
		});
	}
});
}
