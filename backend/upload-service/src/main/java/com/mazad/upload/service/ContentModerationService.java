package com.mazad.upload.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import java.security.cert.CertificateException;
import tools.jackson.databind.ObjectMapper;
import java.security.cert.X509Certificate;
import tools.jackson.databind.JsonNode;
import java.io.InputStream;
import java.io.IOException;
import javax.net.ssl.*;
import okhttp3.*;


@Service
public class ContentModerationService {

    @Value("${sightengine.api.user:}")
    private String apiUser;

    @Value("${sightengine.api.secret:}")
    private String apiSecret;

    private final ObjectMapper mapper = new ObjectMapper();

    private final OkHttpClient client = createClient();

    private OkHttpClient createClient() {
        try {
            final TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
                    @Override
                    public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[]{}; }
                }
            };

            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
            return new OkHttpClient.Builder()
                    .sslSocketFactory(sslSocketFactory, (X509TrustManager)trustAllCerts[0])
                    .hostnameVerifier((hostname, session) -> true) 
                    .build();
        } catch (Exception e) {
            System.err.println("WARNING: Failed to build unsafe SSL client. Using default.");
            return new OkHttpClient();
        }
    }
    
    public void moderateImage(MultipartFile file){
        if (apiUser == null || apiUser.isEmpty() || apiSecret == null || apiSecret.isEmpty()) {
            return; 
        }

        RequestBody streamBody = new RequestBody() {
            @Override
            public MediaType contentType() {
                return MediaType.parse(file.getContentType());
            }

            @Override
            public void writeTo(okio.BufferedSink sink) throws IOException {
                try (InputStream in = file.getInputStream()) {
                    sink.writeAll(okio.Okio.source(in));
                }
            }
        };


        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("models", "nudity-2.0,wad")
                .addFormDataPart("api_user", apiUser)
                .addFormDataPart("api_secret", apiSecret)
                .addFormDataPart("media", file.getOriginalFilename(), streamBody) 
                .build();

        Request request = new Request.Builder()
            .url("https://api.sightengine.com/1.0/check.json")
            .post(requestBody) 
            .build();

        try (Response response = client.newCall(request).execute()) {
            
            if (!response.isSuccessful()) {
                System.err.println("WARNING: Sightengine API failed (HTTP " + response.code() + ").");
                return;
            }

            JsonNode root = mapper.readTree(response.body().string());

            if ("success".equals(root.path("status").asString())) {
                
                double alcohol = root.path("alcohol").asDouble(0);
                double drugs = root.path("drugs").asDouble(0);
                double weapon = root.path("weapon").asDouble(0);

                JsonNode nudity = root.path("nudity");
                double sexual = nudity.path("sexual_activity").asDouble(0);

                System.out.println("AI Scores -> Weapon: " + weapon + " | Drugs: " + drugs + " | Alcohol: " + alcohol + " | Sexual: " + sexual);
                
                if (alcohol > 0.6) throw new IllegalArgumentException("Image rejected: Alcohol detected.");
                if (drugs > 0.6) throw new IllegalArgumentException("Image rejected: Drugs detected.");
                if (weapon > 0.6) throw new IllegalArgumentException("Image rejected: Weapons detected.");
                if (sexual > 0.6) throw new IllegalArgumentException("Image rejected: Inappropriate content detected.");
            }


        } catch (IOException e) {
                System.err.println("WARNING: Network error connecting to Sightengine. the messge: " + e.getMessage());
                return;
        }


    }

}


