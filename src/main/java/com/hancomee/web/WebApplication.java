package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.hancomee.web.servlet.filter.ResourceDisposition;
import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Properties;

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

    @Autowired
    WorkConfig workConfig;

    @Bean
    public FilterRegistrationBean filter_attachment() {
        FilterRegistrationBean bean = new FilterRegistrationBean(new ResourceDisposition());
        bean.addUrlPatterns("/local/*", "/workdata/*");
        return bean;
    }

    @Bean("workConfig")
    public WorkConfig workConfig() throws Exception {
        return new WorkConfig();
    }

    @Bean
    public NativeDB db() throws Exception {
        return new NativeDB("jdbc:mariadb://" + workConfig.ip + ":3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/workdata/**").addResourceLocations("file:" + workConfig.path);
        registry.addResourceHandler("/images/**").addResourceLocations("file:D:/images/");
        registry.addResourceHandler("/wr/**").addResourceLocations("file:D:/work-resources/");
    }

    public static class WorkConfig {

        public Properties prop;
        public String ip;
        public String path;

        private WorkConfig() throws IOException {
            Properties prop = new Properties();
            prop.load(Files.newInputStream(Paths.get("D:/dbip.txt")));
            ip = prop.getProperty("ip");
            path = prop.getProperty("path");

            if(!path.endsWith("/")) path += "/";
        }
    }
}

