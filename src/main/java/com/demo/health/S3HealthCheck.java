package com.demo.health;

import java.util.List;

import javax.annotation.Nullable;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;
import com.codahale.metrics.health.HealthCheck;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.FluentIterable;

public class S3HealthCheck extends HealthCheck{
	
	private final AmazonS3Client s3Client;

    public S3HealthCheck(AmazonS3Client s3Client) {

        this.s3Client = s3Client;
    }

    @Override
    protected Result check() throws Exception {

        try {
            Result result;
            List<Bucket> buckets = s3Client.listBuckets();
            if (buckets.isEmpty()) {
                result = Result.healthy("No buckets available!");
            } else {
                List<String> bucketNames = FluentIterable.from(buckets)
                        .transform(new Function<Bucket, String>() {
                            @Nullable
                            @Override
                            public String apply(Bucket input) {
                                return input.getName();
                            }
                        }).toList();

                String bucketMessage = Joiner.on(", ").join(bucketNames);
                result = Result.healthy("Buckets: " + bucketMessage);
            }
            return result;
        } catch (AmazonClientException e) {
            return Result.unhealthy(e);
        }
    }

}
