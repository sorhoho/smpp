module.exports = {
  apps : [{
    name   : "smpp_worker",
    script : "./client2.js",
    instances: "max",	  
    exp_backoff_restart_delay: 100
  }]
}


