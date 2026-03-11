#!/bin/sh

until mc alias set myminio https://mazad-minio:9000 "$MINIO_USER" "$MINIO_PASSWORD" --insecure; do
  sleep 1
done


mc mb myminio/"$MINIO_BUCKET_NAME" --ignore-existing --insecure

mc anonymous set download myminio/"$MINIO_BUCKET_NAME" --insecure

if [ -f "/default-images/$AVATAR_NAME" ] && [ -f "/default-images/$AVATAR_THUMBNAIL_NAME" ]; then
  mc cp "/default-images/$AVATAR_NAME" myminio/"$MINIO_BUCKET_NAME" --insecure /
  mc cp "/default-images/$AVATAR_THUMBNAIL_NAME" myminio/"$MINIO_BUCKET_NAME" --insecure /
else
  echo "No default image path provided or one of the images not found"
fi

exit 0
