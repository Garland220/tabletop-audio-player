kill -9 `cat process.pid`
sleep 1
nohup node server.js &>> logs/server.log &
echo $! > process.pid
