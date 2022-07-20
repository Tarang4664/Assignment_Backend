package com.demo.application;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProviderChain;
import com.amazonaws.auth.BasicAWSCredentials;

public class S3CredentialsProvider extends AWSCredentialsProviderChain{
	
	private final BasicAWSCredentials credentials;

    public S3CredentialsProvider(BasicAWSCredentials credentials) {
        this.credentials = credentials;
    }

    @Override
    public AWSCredentials getCredentials() {
        return credentials;
    }

    @Override
    public void refresh() {

    }

}
