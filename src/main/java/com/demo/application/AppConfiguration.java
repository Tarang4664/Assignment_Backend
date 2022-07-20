package com.demo.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;

/**
 * Created by Tarang on 04/10/18.
 */
/**
  Each Dropwizard application has its own subclass of the 
  Configuration class which specifies environment-specific parameters. 
  These parameters are specified in a YAML configuration file(properties.yml) 
  which is deserialized to an instance of your applications 
  configuration class and validated.
 */
public class AppConfiguration extends Configuration{

    @NotEmpty
    private String defaultName = "";

    @NotNull
    private MongoConfiguration mongo;

    @JsonProperty
    public String getDefaultName() {
        return defaultName;
    }

    @JsonProperty
    public void setDefaultName(String name) {
        this.defaultName = name;
    }

    @JsonProperty
    public MongoConfiguration getMongo() {
        return mongo;
    }
    @JsonProperty
    public void setMongo(MongoConfiguration mongo) {
        this.mongo = mongo;
    }
   ////////////////////////////////////////////////////////////////////////               
    
}
