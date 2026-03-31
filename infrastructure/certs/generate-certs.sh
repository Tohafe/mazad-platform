#!/bin/bash
#
# Certificate Generation Script for Mazad
# Creates a Root CA and signs server certificates with it
#
# Usage: ./generate-certs.sh [--force]
#   --force: Regenerate all certificates even if they exist
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERTS_DIR="${SCRIPT_DIR}/generated"
FORCE_REGENERATE="${1:-}"

# Certificate validity (days)
ROOT_CA_DAYS=3650  # 10 years
SERVER_CERT_DAYS=365  # 1 year

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create output directory
mkdir -p "${CERTS_DIR}"

# ============================================
# ROOT CA
# ============================================
generate_root_ca() {
    local CA_KEY="${CERTS_DIR}/mazad-root-ca.key"
    local CA_CERT="${CERTS_DIR}/mazad-root-ca.crt"

    if [[ -f "${CA_KEY}" && -f "${CA_CERT}" && "${FORCE_REGENERATE}" != "--force" ]]; then
        log_info "Root CA already exists. Skipping. (use --force to regenerate)"
        return 0
    fi

    log_info "Generating Root CA..."

    # Generate Root CA private key
    openssl genrsa -out "${CA_KEY}" 4096

    # Generate Root CA certificate
    openssl req -x509 -new -nodes \
        -key "${CA_KEY}" \
        -sha256 \
        -days ${ROOT_CA_DAYS} \
        -out "${CA_CERT}" \
        -subj "/C=MA/ST=Casablanca/L=Casablanca/O=Mazad/OU=DevOps/CN=Mazad Root CA"

    chmod 600 "${CA_KEY}"
    chmod 644 "${CA_CERT}"

    log_info "Root CA generated successfully!"
    log_info "  Key:  ${CA_KEY}"
    log_info "  Cert: ${CA_CERT}"
}

# ============================================
# SERVER CERTIFICATE
# ============================================
generate_server_cert() {
    local SERVER_NAME="$1"
    local DOMAINS="$2"  # Comma-separated list: localhost,mazad.local,192.168.1.100

    local CA_KEY="${CERTS_DIR}/mazad-root-ca.key"
    local CA_CERT="${CERTS_DIR}/mazad-root-ca.crt"
    local SERVER_KEY="${CERTS_DIR}/${SERVER_NAME}.key"
    local SERVER_CSR="${CERTS_DIR}/${SERVER_NAME}.csr"
    local SERVER_CERT="${CERTS_DIR}/${SERVER_NAME}.crt"
    local SERVER_EXT="${CERTS_DIR}/${SERVER_NAME}.ext"

    if [[ -f "${SERVER_KEY}" && -f "${SERVER_CERT}" && "${FORCE_REGENERATE}" != "--force" ]]; then
        log_info "Certificate for ${SERVER_NAME} already exists. Skipping."
        return 0
    fi

    log_info "Generating certificate for ${SERVER_NAME}..."

    # Generate server private key
    openssl genrsa -out "${SERVER_KEY}" 2048

    # Generate CSR (Certificate Signing Request)
    openssl req -new \
        -key "${SERVER_KEY}" \
        -out "${SERVER_CSR}" \
        -subj "/C=MA/ST=Casablanca/L=Casablanca/O=Mazad/OU=Backend/CN=${SERVER_NAME}"

    # Create extensions file for SAN (Subject Alternative Names)
    cat > "${SERVER_EXT}" << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
EOF

    # Add DNS and IP entries
    local i=1
    local ip_i=1
    IFS=',' read -ra DOMAIN_ARRAY <<< "${DOMAINS}"
    for domain in "${DOMAIN_ARRAY[@]}"; do
        domain=$(echo "${domain}" | xargs)  # trim whitespace
        if [[ "${domain}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "IP.${ip_i} = ${domain}" >> "${SERVER_EXT}"
            ((ip_i++))
        else
            echo "DNS.${i} = ${domain}" >> "${SERVER_EXT}"
            ((i++))
        fi
    done

    # Sign the certificate with Root CA
    openssl x509 -req \
        -in "${SERVER_CSR}" \
        -CA "${CA_CERT}" \
        -CAkey "${CA_KEY}" \
        -CAcreateserial \
        -out "${SERVER_CERT}" \
        -days ${SERVER_CERT_DAYS} \
        -sha256 \
        -extfile "${SERVER_EXT}"

    # Cleanup CSR and ext files
    rm -f "${SERVER_CSR}" "${SERVER_EXT}"

    chmod 600 "${SERVER_KEY}"
    chmod 644 "${SERVER_CERT}"

    log_info "Certificate for ${SERVER_NAME} generated successfully!"
}

# ============================================
# PKCS12 KEYSTORE (for Java/Spring Boot)
# ============================================
generate_pkcs12_keystore() {
    local SERVER_NAME="$1"
    local KEYSTORE_PASSWORD="$2"

    local SERVER_KEY="${CERTS_DIR}/${SERVER_NAME}.key"
    local SERVER_CERT="${CERTS_DIR}/${SERVER_NAME}.crt"
    local CA_CERT="${CERTS_DIR}/mazad-root-ca.crt"
    local KEYSTORE="${CERTS_DIR}/${SERVER_NAME}.p12"

    if [[ -f "${KEYSTORE}" && "${FORCE_REGENERATE}" != "--force" ]]; then
        log_info "Keystore for ${SERVER_NAME} already exists. Skipping."
        return 0
    fi

    if [[ ! -f "${SERVER_KEY}" || ! -f "${SERVER_CERT}" ]]; then
        log_error "Certificate for ${SERVER_NAME} not found. Generate it first."
        return 1
    fi

    log_info "Creating PKCS12 keystore for ${SERVER_NAME}..."

    # Create PKCS12 with private key, certificate, and CA chain
    openssl pkcs12 -export \
        -in "${SERVER_CERT}" \
        -inkey "${SERVER_KEY}" \
        -out "${KEYSTORE}" \
        -name "${SERVER_NAME}" \
        -CAfile "${CA_CERT}" \
        -caname "Mazad Root CA" \
        -chain \
        -password "pass:${KEYSTORE_PASSWORD}"

    chmod 600 "${KEYSTORE}"
    log_info "Keystore created: ${KEYSTORE} (includes private key, certificate, and CA chain)"
}

# ============================================
# TRUSTSTORE (for Java services to trust Root CA)
# ============================================
generate_truststore() {
    local TRUSTSTORE_PASSWORD="$1"
    local CA_CERT="${CERTS_DIR}/mazad-root-ca.crt"
    local TRUSTSTORE="${CERTS_DIR}/mazad-truststore.p12"

    if [[ -f "${TRUSTSTORE}" && "${FORCE_REGENERATE}" != "--force" ]]; then
        log_info "Truststore already exists. Skipping."
        return 0
    fi

    log_info "Creating truststore with Root CA..."

    # Create PKCS12 truststore with the Root CA
    keytool -importcert \
        -storetype PKCS12 \
        -keystore "${TRUSTSTORE}" \
        -storepass "${TRUSTSTORE_PASSWORD}" \
        -alias "mazad-root-ca" \
        -file "${CA_CERT}" \
        -noprompt 2>/dev/null || {
        # Fallback if keytool not available - use openssl
        openssl pkcs12 -export \
            -nokeys \
            -in "${CA_CERT}" \
            -out "${TRUSTSTORE}" \
            -password "pass:${TRUSTSTORE_PASSWORD}" \
            -name "mazad-root-ca"
    }

    chmod 600 "${TRUSTSTORE}"
    log_info "Truststore created: ${TRUSTSTORE}"
}

# ============================================
# MAIN
# ============================================
main() {
    log_info "=== Mazad Certificate Generator ==="
    
    # Check if openssl is installed
    if ! command -v openssl &> /dev/null; then
        log_error "OpenSSL is not installed. Please install it first."
        exit 1
    fi


    # Keystore password (used for all Java keystores)
    if [[ -z "$SSL_KEYSTORE_PASSWORD" ]]; then
        log_error "SSL_KEYSTORE_PASSWORD environment variable is not set!"
        exit 1
    fi
    KEYSTORE_PASSWORD="$SSL_KEYSTORE_PASSWORD"

    # Generate Root CA
    generate_root_ca

    # Generate Nginx certificate
    generate_server_cert "nginx" "localhost,mazad.local,127.0.0.1"

    # Generate Gateway certificate (for internal TLS)
    generate_server_cert "gateway" "mazad-gateway,mazad-gateway-c,localhost,127.0.0.1"
    generate_pkcs12_keystore "gateway" "${KEYSTORE_PASSWORD}"

    # Generate certificates for all microservices
    log_info "Generating microservice certificates..."

    # Items Service
    generate_server_cert "items-service" "items-service,item-service-c,localhost,127.0.0.1"
    generate_pkcs12_keystore "items-service" "${KEYSTORE_PASSWORD}"

    # Auth Service
    generate_server_cert "auth-service" "auth-service,localhost,127.0.0.1"
    generate_pkcs12_keystore "auth-service" "${KEYSTORE_PASSWORD}"

    # User Service
    generate_server_cert "user-service" "user-service,localhost,127.0.0.1"
    generate_pkcs12_keystore "user-service" "${KEYSTORE_PASSWORD}"

    # Bidding Service
    generate_server_cert "bidding-service" "bidding-service,localhost,127.0.0.1"
    generate_pkcs12_keystore "bidding-service" "${KEYSTORE_PASSWORD}"

    # Chat Service
    generate_server_cert "chat-service" "chat-service,chat-service-c,localhost,127.0.0.1"
    generate_pkcs12_keystore "chat-service" "${KEYSTORE_PASSWORD}"

    # Notification Service
    generate_server_cert "notification-service" "notification-service,notification-service-c,localhost,127.0.0.1"
    generate_pkcs12_keystore "notification-service" "${KEYSTORE_PASSWORD}"

    # Upload Service
    generate_server_cert "upload-service" "upload-service,upload-service-c,localhost,127.0.0.1"
    generate_pkcs12_keystore "upload-service" "${KEYSTORE_PASSWORD}"

    # MinIO Service
    generate_server_cert "minio" "minio,mazad-minio,localhost,127.0.0.1"

    # Generate truststore for services to trust our Root CA
    generate_truststore "${KEYSTORE_PASSWORD}"

    log_info "=== Certificate generation complete ==="
    echo ""
    log_info "To trust these certificates in your browser:"
    echo "  1. Import '${CERTS_DIR}/mazad-root-ca.crt' as a trusted CA"
    echo "  2. On Linux: sudo cp ${CERTS_DIR}/mazad-root-ca.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates"
    echo "  3. On macOS: sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${CERTS_DIR}/mazad-root-ca.crt"
    echo "  4. On Windows: Import the .crt file via certmgr.msc → Trusted Root Certification Authorities"
    echo ""
}

main "$@"
