package com.demo.core;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author Tarang
 * @since 20/07/2022
 * */
public class CommonResponse {
	
	public final static Response success(int status, Object object){
		
		return Response
				.ok(status)
				.entity(object)
				.type(MediaType.APPLICATION_JSON)
				.build();
	}

	public final static Response error(int status,Object object){
		
		switch(status) {
        case 409 :
        	return Response
    				.status(Response.Status.CONFLICT)
                    .entity(object)
                    .type(MediaType.APPLICATION_JSON)
                    .build(); 
          
        case 401 :
        	return Response
        			.status(Response.Status.UNAUTHORIZED)
        			.entity(object)
        			.type(MediaType.APPLICATION_JSON)
        			.build();
        	
        case 502 :
        	 return Response
                     .status(Response.Status.BAD_GATEWAY)
                     .entity(object)
                     .type(MediaType.APPLICATION_JSON)
                     .build();
        case 500 :
       	 return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(object)
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        
        default :
        	return Response
    				.status(Response.Status.GATEWAY_TIMEOUT)
                    .entity(object)
                    .type(MediaType.APPLICATION_JSON)
                    .build();
     }
				
		
	}
	
}
