#docker build -t smppnode .

docker run -d --name smpp_proxy_server --network mynetwork smppnode
