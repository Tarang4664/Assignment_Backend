package com.demo.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.Request;
import com.amazonaws.Response;
import com.amazonaws.metrics.RequestMetricCollector;
import com.codahale.metrics.MetricRegistry;

public class S3RequestMetricCollector extends RequestMetricCollector{
	
	 private static final Logger LOG = LoggerFactory.getLogger(S3RequestMetricCollector.class);

	    private final MetricRegistry metricRegistry;

	    public S3RequestMetricCollector(MetricRegistry metricRegistry) {
	        this.metricRegistry = metricRegistry;
	    }

	    @Override
	    public void collectMetrics(Request<?> request, Response<?> response) {
	        LOG.info("AWS:" + request.getAWSRequestMetrics());
	    }	

}
