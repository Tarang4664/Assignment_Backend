package com.demo.health;

import java.io.IOException;
import java.net.UnknownHostException;
import com.demo.core.CommonResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import com.mongodb.ServerAddress;
/**
 * @author Tarang
 * @since 20/07/2022
 * */
@Path("/status")
public class StatusResource {
	
	@Path("/server")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response serverStatus(){
		
		return Response.ok(200).entity("{\"Success\": \"Server is running\"}").build();
	}
	
	
	
//	@Path("/mongo")//if mongodb is not connected then server will throw 500
//	@GET
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response mongoStatus() throws UnknownHostException{
//		
////		Builder o = MongoClientOptions.builder().connectTimeout(3000);  
////		MongoClient mongo = new MongoClient(new ServerAddress("localhost", 27017), o.build());    
//
//		try 
//		{			
//		  mongo.getAddress();
//		} catch (Exception e) {
//			
//			return CommonResponse.error(500, "{\"error\": \"MongoDB is not connected\"}");
//		}finally{
//			mongo.close();
//		}
//		return Response.ok(200).entity("{\"Success\": \"MongoDB is running\"}").build();
//	}

}
