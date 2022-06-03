docker run -d --name nginx -p 80:80 -v /home/ubuntu/poc/nginx/nginx.conf:/etc/nginx/nginx.conf:ro --network mynetwork nginx
