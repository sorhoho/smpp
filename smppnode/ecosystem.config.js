module.exports = {
  apps : [{
    name   : "publisher",
    script : "./fastify.js",
    instances: 1,	  
    exp_backoff_restart_delay: 100
  },{
    name   : "smppserver",
    script : "./server_41.js",
    instances: 2,
    exp_backoff_restart_delay: 100
  }]
}


