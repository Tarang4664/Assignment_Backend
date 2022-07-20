package com.demo.application;

import io.dropwizard.setup.Environment;

import org.hibernate.validator.constraints.NotEmpty;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.demo.health.S3HealthCheck;
import com.fasterxml.jackson.annotation.JsonProperty;

public class S3ClientConfiguration {
	
	@NotEmpty
    @JsonProperty
    private String accessKey;

    @NotEmpty
    @JsonProperty
    private String secretKey;

    @JsonProperty
    private int connectionTimeout = ClientConfiguration.DEFAULT_CONNECTION_TIMEOUT;

    @JsonProperty
    private int socketTimeout = ClientConfiguration.DEFAULT_SOCKET_TIMEOUT;

    @JsonProperty
    private int maxConnections = ClientConfiguration.DEFAULT_MAX_CONNECTIONS;

    @JsonProperty
    private Protocol protocol = Protocol.HTTPS;

    @JsonProperty
    private boolean useGzip = ClientConfiguration.DEFAULT_USE_GZIP;


    public AmazonS3 build(Environment environment) {
        S3CredentialsProvider credentialsProvider = new S3CredentialsProvider(new BasicAWSCredentials(accessKey, secretKey));
        ClientConfiguration clientConfiguration = createClientConfiguration();
        S3RequestMetricCollector requestMetricCollector = new S3RequestMetricCollector(environment.metrics());
        AmazonS3Client s3Client = new AmazonS3Client(credentialsProvider, clientConfiguration, requestMetricCollector);

        environment.healthChecks().register("s3-client", new S3HealthCheck(s3Client));
        return s3Client;
    }

    private ClientConfiguration createClientConfiguration() {
        ClientConfiguration clientConfiguration = new ClientConfiguration()
                .withConnectionTimeout(connectionTimeout)
                .withSocketTimeout(socketTimeout)
                .withMaxConnections(maxConnections)
                .withProtocol(protocol)
                .withGzip(useGzip);

        return clientConfiguration;
    }

}
