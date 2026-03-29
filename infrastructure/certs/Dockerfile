# Dockerfile for Mazad certificate generation
FROM eclipse-temurin:21-jdk-jammy

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /certs
COPY generate-certs.sh ./
RUN chmod +x generate-certs.sh

# Entrypoint for manual use (override in Makefile)
ENTRYPOINT ["/certs/generate-certs.sh"]
