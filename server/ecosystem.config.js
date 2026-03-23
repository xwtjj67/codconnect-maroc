module.exports = {
  apps: [{
    name: "codconnect-api",
    script: "server.js",
    cwd: "/var/www/codconnect/server",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "500M",
    env: {
      NODE_ENV: "production",
      PORT: 3001,
    },
    error_file: "/var/log/pm2/codconnect-error.log",
    out_file: "/var/log/pm2/codconnect-out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
  }],
};
