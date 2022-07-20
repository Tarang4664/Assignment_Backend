package com.demo.health;

import com.codahale.metrics.health.HealthCheck;
import com.demo.application.AppConfiguration;
import com.google.inject.Inject;

/**
 * Created by anurag on 06/04/15.
 */
public class TemplateHealthCheck extends HealthCheck{

    @Inject
    public TemplateHealthCheck(AppConfiguration configuration)
    {

    }

    @Override
    protected Result check() throws Exception {
        return Result.healthy();
    }
}
