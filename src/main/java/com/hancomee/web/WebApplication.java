package com.hancomee.web;

import com.hancomee.web.servlet.filter.ResourceDisposition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@ComponentScan({"com.hancomee"})
@SpringBootApplication
@RequestMapping
public class WebApplication extends SpringBootServletInitializer implements WebMvcConfigurer {


    // WEB-INF 배포를 위해서 반드시 필요함
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(WebApplication.class);
    }


    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public FilterRegistrationBean filter_attachment() {
        FilterRegistrationBean bean = new FilterRegistrationBean(new ResourceDisposition());
        bean.addUrlPatterns("/local/*", "/workdata/*");
        return bean;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/workdata/**").addResourceLocations("file:D:/work/");
    }
}

