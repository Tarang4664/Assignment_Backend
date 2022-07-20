package com.demo.application;

import java.net.UnknownHostException;

import com.google.common.collect.ImmutableList;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

import org.jongo.Jongo;

import javax.inject.Singleton;

/**
 * MongoModule class is use to check and activate the connection using
   MongoClient.
   Jongo is established the connection with collections in MongoDB 
 * */
public class MongoModule extends AbstractModule {

	private MongoConfiguration configuration;
	
	public MongoModule(MongoConfiguration configuration) {
		this.configuration = configuration;
	}

	@Override
	protected void configure() {
	}

	@Provides @Singleton
	public MongoClient provideMongoClient()  {
		ImmutableList.Builder<ServerAddress> addresses = ImmutableList.builder();
		for (MongoConfiguration.Server server : configuration.getServers()) {
			try {
				addresses.add(new ServerAddress(server.getHost(), server.getPort()));
			} catch (UnknownHostException e){
				e.printStackTrace();
			}
		}
		return new MongoClient(addresses.build());
	}

	@Provides @Singleton
	public Jongo provideJongo(MongoClient mongo) {
		return new Jongo(mongo.getDB(configuration.getDb()));		
	}
	
	@Provides @Singleton
	public DB provideDB(MongoClient mongo) {
		return mongo.getDB(configuration.getDb());
		
	}
}
