package com.demo.application;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.dropwizard.setup.Environment;

import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * MongoConfiguration gets the 'host' & 'port' from 'properties.yml' file to
 * established the connection with Mongo Database
 * */
public class MongoConfiguration {

	public static class Server {
		@JsonProperty("host")
		@NotNull @NotBlank
		private String host;
		
		@JsonProperty("port")
		@Min(1)
		private short port;

		public String getHost() {
			return host;
		}

		public void setHost(String host) {
			this.host = host;
		}

		public short getPort() {
			return port;
		}

		public void setPort(short port) {
			this.port = port;
		}
	}
	
	@JsonProperty("db")
	@NotNull @NotBlank
	private String db;
	
	@JsonProperty("servers")
	@NotNull @NotEmpty
	private List<Server> servers;

	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

	public List<Server> getServers() {
		return servers;
	}

	public void setServers(List<Server> servers) {
		this.servers = servers;
	}
	
	
}
