package com.demo.resource;
import com.demo.core.CommonResponse;
import com.demo.core.JsonData;
//import com.easyaccounting.core.CronSchedular;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.sun.el.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

import javax.mail.internet.AddressException;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;



/**
 * Created Tarang 20/07/2022
 */
@Path("/api/fm/v0/users")

public class UserResource{
	



	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserData(){
		
		//JSON parser object to parse read file
        JSONParser jsonParser = new JSONParser();
        List employeeList = null;
        try (FileReader reader = new FileReader("employees.json"))
        {
            //Read JSON file
            Object obj = jsonParser.parse(reader);
 
             employeeList = (JSONArray) obj;
            System.out.println(employeeList);
          
 
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (org.json.simple.parser.ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return CommonResponse.success(200, employeeList);

		
	}
	
	
	 
	 @SuppressWarnings({ "unchecked", "rawtypes" })
	 @POST
	 @Produces(MediaType.APPLICATION_JSON)
		public Response update(JsonData jsonData){
		//JSON parser object to parse read file
	        JSONParser jsonParser = new JSONParser();
	        JSONArray  employeeList = new JSONArray();
	        JSONObject jsonObject = null;
		 try (FileReader reader = new FileReader("employees.json"))
	        {
	            //Read JSON file
	            Object obj = jsonParser.parse(reader);
	             
	            employeeList.addAll((Collection) obj);
	            System.out.println(employeeList);
	             
	            for (int i=0; i < employeeList.size(); i++){
	                jsonObject = (JSONObject) employeeList.get(i);
	                if(jsonObject.get("Name").equals(jsonData.getName())) {
	                    jsonObject.put("Price", jsonData.getPrice());
	                }
	            
	            }

	            try (FileWriter file = new FileWriter("employees.json")) {
	                //We can write any JSONArray or JSONObject instance to the file
	                file.write(employeeList.toJSONString()); 
	                file.flush();
	     
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	 
	        } catch (FileNotFoundException e) {
	            e.printStackTrace();
	        } catch (IOException e) {
	            e.printStackTrace();
	        } catch (org.json.simple.parser.ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		 
		 return CommonResponse.success(200, employeeList);
		 
	 }
	 
	 
	 
	
}

		