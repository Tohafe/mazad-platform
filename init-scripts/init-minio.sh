#!/bin/sh
# scripts/init-minio.sh


echo "Attempting to connect to MinIO..."


until mc alias set myminio http://mazad-minio:9000 "$MINIO_USER" "$MINIO_PASSWORD"; do
  echo "...MinIO is not ready yet. Retrying in 1s..."
  sleep 1
done

echo "Connected! Setting up buckets..."


mc mb myminio/mazad-uploads --ignore-existing


echo "Setting policy to public..."
mc anonymous set download myminio/mazad-uploads

echo "MinIO setup complete. Exiting."
exit 0
