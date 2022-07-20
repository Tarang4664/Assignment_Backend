package com.demo.health;

import com.codahale.metrics.health.HealthCheck;
import com.google.inject.Inject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientException;

/**
 * @author Tushar 
 * @since 13/07/2016.
 */

/**
 * Checks the health status of MongoDB . 
 * To check status, go to:"http://localhost:8081/healthcheck"
 * */
public class MongoHealthCheck extends HealthCheck{
	 private final MongoClient mongoClient;

	    @Inject
	    public MongoHealthCheck(MongoClient mongoClient) {
	        super();
	        this.mongoClient = mongoClient;
	    }

	    /**
	     * Checks if the system database, which exists in all MongoDB instances can be reached.
	     * @return A Result object
	     * @throws Exception
	     */
	    @Override
	    protected Result check() throws Exception {

	        try {
	            mongoClient.getDB("system").getStats();
	        }
	        catch(MongoClientException ex) {
	            return Result.unhealthy(ex.getMessage());
	        }
	        return Result.healthy();
	    }


}
