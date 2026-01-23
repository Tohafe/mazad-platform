
while [ 1 ]; do
  curl localhost:8080/api/v1/items -H "X-API-KEY: c0221589-ca50-4518-9182-615460a3b241" -s -o /dev/null -w "%{http_code}"
  echo -n " "
  curl localhost:8080/api/v1/items -H "X-API-KEY: c0221589-ca50-4518-9182-615460a3b241" -s -o /dev/null -w "%{http_code}"
  sleep 1
  echo ""
done