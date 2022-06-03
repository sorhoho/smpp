var smpp = require('smpp');
var amqp = require('amqplib/callback_api');


try {

amqp.connect('amqp://rabbitmq', function(error, connection) {
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
	    result=sendsms(mobile,textmessage);
	    console.log(result);
	
            setTimeout(function() {
                console.log(" [x] Done");
                 //if (result) { channel.ack(msg); }
	        channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        }); // consume end
     

    });  // create channel end
});  // connec end

}    catch (error) {
  console.error(error); }


function sendsms(msisdn,txtmsg) 
{

// var result = false;

var session = smpp.connect({
        url: 'smpp://10.0.2.15:2700',
        auto_enquire_link_period: 10000
});



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
				console.log("Sent to SMPP Provider");
				console.log(pdu.message_id); 
			}
		});
	}  
});

// return result;
}
