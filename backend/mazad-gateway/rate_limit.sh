
while [ 1 ]; do
  curl localhost:8080/api/v1/items -s -o /dev/null -w "%{http_code}"
  echo -n " "
  curl localhost:8080/api/v1/items -s -o /dev/null -w "%{http_code}"
  sleep 1
  echo ""
done