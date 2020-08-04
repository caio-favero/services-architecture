const queueName = 'slaUpdate'
const open = require('amqplib').connect('amqp://localhost')

// Publisher
open
  .then(conn => conn.createChannel())
  .then(ch => {
    return ch.assertQueue(queueName)
      .then(ok => {
        return ch.sendToQueue(queueName, Buffer.from('something to do'))
      })
  })
  .catch(console.warn)

// Consumer
open
  .then(conn => conn.createChannel())
  .then(ch => {
    return ch.assertQueue(queueName).then(ok => {
      return ch.consume(queueName, msg => {
        if (msg !== null) {
          console.log(msg.content.toString())
          ch.ack(msg)
        }
      })
    })
  })
  .catch(console.warn)
