const smpp = require('smpp');

const users = {
  "test": "123456" // - Test
}



async function SendQueue(msisdn,message)
{

const co = require('co');
const amqp = require('amqplib');

co(function* () {
  // connection errors are handled in the co .catch handler
  const conn = yield amqp.connect('amqp://localhost');

  // try catch will throw any errors from the yielding the following promises to the co .catch handler
  try {
    const q = 'hello';
    const msg = 'Hello World!';

    // use a confirm channel so we can check the message is sent OK.
    const channel = yield conn.createConfirmChannel();

    yield channel.assertQueue(q,{durable: true});

    channel.sendToQueue(q, Buffer.from(msg));

    // if message has been nacked, this will result in an error (rejected promise);
    yield channel.waitForConfirms();

    console.log(" [x] Sent '%s'", msg);

    channel.close();
  }
  catch (e) {
    throw e;
  }
  finally {
    conn.close();
  }

}).catch(err => {
  console.warn('Error:', err);
});


}





//var amqp = require('amqplib/callback_api');


// var amqp = require('amqp-connection-manager');

// Create a new connection manager
//var connection = amqp.connect(['amqp://localhost']);


function SendQueue9(msisdn,message)
{

//var amqp = require('amqp-connection-manager');

// Create a new connection manager
var connection = amqp.connect(['amqp://localhost:5672']);

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
var channelWrapper = connection.createChannel({
    json: true,
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue('rxQueueName', {durable: true});
    }
});

// Send some messages to the queue.  If we're not currently connected, these will be queued up in memory
// until we connect.  Note that `sendToQueue()` and `publish()` return a Promise which is fulfilled or rejected
// when the message is actually sent (or not sent.)
channelWrapper.sendToQueue('rxQueueName', {hello: 'world'})
.then(function() {
  	channelWrapper.close();
        connection.close();
    return console.log("Message was sent!  Hooray!");
}).catch(function(err) {
    return console.log("Message was rejected...  Boo!");
})



}

async function SendQueue1(msisdn,message)
{
const rabbit = require('amqplib');
const QUEUE_NAME = 'square';
const EXCHANGE_TYPE = 'direct';
const EXCHANGE_NAME = 'main';
const KEY = 'myKey';
const number = '5'
connection = rabbit.connect('amqp://localhost:5672');
connection.then(async (conn)=>{
   const channel = await conn.createChannel();
   await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
   await channel.assertQueue(QUEUE_NAME);
   channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, KEY);
   channel.sendToQueue(QUEUE_NAME, Buffer.from(number))
       }).then(connection.close);
}



function SendQueue2(msisdn,message)
{

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }



var queue = 'task_queue';
var msg = process.argv.slice(2).join(' ') || "Hello World!";

channel.assertQueue(queue, {
  durable: true
});
channel.sendToQueue(queue, Buffer.from(message), {
  persistent: true
});
console.log(" [x] Sent '%s'", message);

});
 //  setTimeout(function() {
 //   connection.end();
 //   process.exit()
 // }, 10000);
});
}






const server = smpp.createServer(function(session) {

  session.on('bind_transceiver', function(pdu) {
    session.pause();
    var usercheck = (users[pdu.system_id] !== undefined) && (users[pdu.system_id] == pdu.password);
    if(!usercheck){
      session.send(pdu.response({
        command_status: smpp.ESME_RBINDFAIL
      }));
      session.close();
      console.error('Connection Error: ', pdu.system_id, "\n");
      return;
    }
    console.info('Connected: ', pdu.system_id, "\n");
    session.send(pdu.response({
      system_id: pdu.system_id
    }));
    session.resume();
  });

  session.on('submit_sm', function(pdu){
    var time = Math.floor(new Date() / 1000);
    var number = pdu.destination_addr + "";
    let msgid = Date.now()+""; // - Message ID
    var deliverable = true; // - Message is deliverable

    if(!deliverable){
      session.send(pdu.response({
        command_status: smpp.ESME_RINVDSTADR
      }));
      console.error('- SMS Error -');
      console.error('Sender: ', pdu.source_addr);
      console.error('Receiver: ', pdu.destination_addr);
      console.error('Message: ', pdu.short_message.message);
      console.log("- - -\n");
      return false;
    }
    console.log('- SMS Received -');
    console.log('ID: ', msgid);
    console.log('Sender: ', pdu.source_addr);
    console.log('Receiver: ', pdu.destination_addr);
    console.log('Message: ', pdu.short_message.message);
    console.log("- - -\n");
    // SendQueue(pdu.destination_addr,pdu.short_message.message); 



    session.send(pdu.response({
      sequence_number: pdu.sequence_number,
      message_id: msgid
    }));
    SendQueue(pdu.destination_addr,pdu.short_message.message);


    session.deliver_sm({
      command_id: 4,
      command_status: '',
      sequence_number: pdu.sequence_number,
      service_type: '',
      source_addr_ton: '',
      source_addr_npi: '',
      source_addr: "source",
      dest_addr_ton: 1,
      dest_addr_npi: 1,
      destination_addr: "dest",
      esm_class: 4,
      protocol_id: 1,
      priority_flag: 1,
      schedule_delivery_time: '',
      validity_period:'',
      registered_delivery: 1,
      replace_if_present_flag:'',
      sm_default_msg_id: '',
      short_message: {
      	message: 'id:'          + msgid
              + ' sub:'         + '001'
              + ' dlvrd:'       + (deliverable ? '001'     : '000'    )
              + ' submit date:' + time
              + ' done date:'   + time
              + ' stat:'        + (deliverable ? 'DELIVRD' : 'UNDELIV')
              + ' err:'         + (deliverable ? '000'     : '001'    )
              + ' text:'        + pdu.short_message.message.substr(0,20)
      }
    });
       //  et
   //SendQueue(pdu.destination_addr,pdu.short_message.message);
  });

  session.on('unbind', function(pdu){
    session.send(pdu.response());
    session.close();
  });

  session.on('enquire_link', function(pdu){
    session.send(pdu.response());
  });

  session.on('error', function(pdu){
    console.log("error");
    console.log(pdu);
  });
  
});
server.listen(2775);
