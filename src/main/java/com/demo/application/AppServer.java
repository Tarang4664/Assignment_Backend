package com.demo.application;


import com.demo.health.MongoHealthCheck;
import com.demo.health.StatusResource;
import com.demo.health.TemplateHealthCheck;
import com.demo.resource.UserResource;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
//import com.squareup.okhttp.OkHttpClient;
//import com.squareup.okhttp.Request;
//import com.squareup.okhttp.Response;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthFactory;
import io.dropwizard.auth.ChainedAuthFactory;
import io.dropwizard.auth.basic.BasicAuthFactory;
import io.dropwizard.auth.oauth.OAuthFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;

import java.io.IOException;
import java.util.EnumSet;

/**
 * Created by Tarang on 20/07/2022.
 
 */

/**
 * Combined with our projects Configuration subclass, its Application subclass
 * forms the core of our Dropwizard application. The Application class pulls
 * together the various bundles and commands which provide basic functionality.
 * 
 * As you can see, AppServer is parameterized with the application�s
 * configuration type, AppConfiguration. An initialize method is used to
 * configure aspects of the application required before the application is run,
 * like bundles, configuration source providers, etc. Also, we have added a
 * 'static main method', which will be our applications entry point.
 */

public class AppServer extends Application<AppConfiguration> {

	public static void main(String[] args) throws Exception {

		new AppServer().run(args);

	}

	@Override
	public String getName() {
		return "hello-world";
	}

	@Override
	public void initialize(Bootstrap<AppConfiguration> bootstrap) {

		bootstrap.addBundle(new AssetsBundle("/assets/api-docs", "/api-docs", "swagger.json", "api-docs"));
	}

	@Override
	public void run(AppConfiguration configuration, Environment environment) {

		Injector injector = createInjector(configuration);
		environment.healthChecks().register("template", injector.getInstance(TemplateHealthCheck.class));
		environment.jersey().register(injector.getInstance(UserResource.class));
		

		environment.jersey().register(MultiPartFeature.class);



		FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
		cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,OPTIONS,PUT,DELETE");
		cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
		cors.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
		cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM,
				"Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
		cors.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");
		cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
	}

	private Injector createInjector(final AppConfiguration configuration) {
		return Guice.createInjector(new MongoModule(configuration.getMongo()), new AbstractModule() {
			@Override
			protected void configure() {
				bind(AppConfiguration.class).toInstance(configuration);
			}
		});
	}

}
