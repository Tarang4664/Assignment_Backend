package com.demo.core;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
/**
 * @author Tarang
 * @since 20/07/2022
 * */
public class JsonData {
	
	private final String Name;
	private final int Price;
	
	
	@JsonCreator
	
	public JsonData(@JsonProperty("Name")String Name,@JsonProperty("Price")int price){
		
		this.Name = Name;
		this.Price =price;
		
	}


	public String getName() {
		return Name;
	}


	public int getPrice() {
		return Price;
	}
	
	

}
