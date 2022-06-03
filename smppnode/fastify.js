const fastify = require('fastify')()

fastify.register(require('fastify-amqp'), {
  // the default value is amqp
  protocol: 'amqp',
  hostname: 'rabbitmq',
  // the default value is 5672
  port: 5672,
  // the default value is guest
  username: 'guest',
  // the default value is guest
  password: 'guest',
  // the default value is empty
  vhost: ''
})

// /:params

fastify.get('/:params', function (request, reply) {
  const channel = this.amqp.channel

  const queue = 'hello'
  // const msg = 'Hello world'

  console.log(request.query.msisdn)
  console.log(request.query.text)
  
  let payloadAsString = JSON.stringify(request.query);

  channel.assertQueue(queue, {
    durable: false
  })
  
  channel.sendToQueue(queue, Buffer.from(payloadAsString))
  reply.send(' [x] Sent ')
})

fastify.listen(3000, err => {
  if (err) throw err
})

