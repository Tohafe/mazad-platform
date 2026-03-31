#!/bin/bash

USER1='{"username": "Amine_88", "email": "amine.dev@gmail.com", "password": "Password.123"}'
USER2='{"username": "FatimaZ", "email": "fatima.z@gmail.com", "password": "Password.123"}'
USER3='{"username": "Youssef_M", "email": "youssef.m@gmail.com", "password": "Password.123"}'
USER4='{"username": "Sara.Ali", "email": "sara.ali.99@gmail.com", "password": "Password.123"}'
USER5='{"username": "KarimTech", "email": "karim.tech@gmail.com", "password": "Password.123"}'
USER6='{"username": "Nadia_Art", "email": "nadia.art@gmail.com", "password": "Password.123"}'

USERS=("$USER1" "$USER2" "$USER3" "$USER4" "$USER5" "$USER6")

echo "Registering Users..."

for i in {0..5}; do
  PAYLOAD="${USERS[$i]}"
  RESPONSE=$(curl -k -s -X POST https://localhost:8443/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")
  tokens+=("$(echo "$RESPONSE" | jq -r .accessToken)")
done

echo "Creating 4 items per category..."

chmod +x generate_item.sh

for category_id in {1..13}; do
  for i in {1..4}; do
    RANDOM_TOKEN=${tokens[$RANDOM % ${#tokens[@]}]}

    ITEM=$(./generate_item.sh "$category_id")

    curl -k -s -X POST https://localhost:8443/api/v1/items \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $RANDOM_TOKEN" \
      -d "$ITEM" > /dev/null
  done
done

