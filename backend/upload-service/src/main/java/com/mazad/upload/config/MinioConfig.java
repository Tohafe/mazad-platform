package com.mazad.upload.config;

import io.minio.MinioClient;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;

@Configuration 
public class MinioConfig {

    @Value("${minio.url}")
    private String url;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.use-insecure-trust-manager:false}")
    private boolean useInsecureTrustManager;

    @Bean
    public MinioClient minioClient() {
        try {
            MinioClient.Builder builder = MinioClient.builder()
                    .endpoint(url)
                    .credentials(accessKey, secretKey);
            
            if (useInsecureTrustManager) {
                builder.httpClient(createInsecureHttpClient());
            }
            
            return builder.build();
        } catch (Exception e) {
            throw new RuntimeException("Error connecting to MinIO: " + e.getMessage());
        }
    }

    private OkHttpClient createInsecureHttpClient() throws Exception {
        TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                public void checkServerTrusted(X509Certificate[] certs, String authType) { }
            }
        };

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

        return new OkHttpClient.Builder()
                .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustAllCerts[0])
                .hostnameVerifier((hostname, session) -> true)
                .build();
    }
}