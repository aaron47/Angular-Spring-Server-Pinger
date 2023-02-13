package com.example.server;

import com.example.server.model.Server;
import com.example.server.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

import static com.example.server.enumeration.Status.SERVER_DOWN;
import static com.example.server.enumeration.Status.SERVER_UP;

@SpringBootApplication
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ServerRepository serverRepository) {
        return args -> {
            serverRepository.save(new Server(null, "192.168.1.160", "Ubuntu Linux", "16gb", "PC", "http://localhost:8080/server/image/server1.png", SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.58", "Fedora Linux", "32gb", "PC", "http://localhost:8080/server/image/server2.png", SERVER_DOWN));
            serverRepository.save(new Server(null, "192.168.1.21", "Debian Linux", "64gb", "PC", "http://localhost:8080/server/image/server3.png", SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.14", "CentOS", "128gb", "PC", "http://localhost:8080/server/image/server4.png", SERVER_DOWN));
            serverRepository.save(new Server(null, "208.67.220.220", "OpenDNS", "256gb", "PC", "http://localhost:8080/server/image/server3.png", SERVER_UP));
            serverRepository.save(new Server(null, "1.1.1.1", "Cloudflare", "512gb", "PC", "http://localhost:8080/server/image/server4.png", SERVER_DOWN));
            serverRepository.save(new Server(null, "8.8.8.8", "Google DNS", "1024gb", "PC", "http://localhost:8080/server/image/server2.png", SERVER_UP));
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:4200"));
        corsConfig.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type", "Accept", "Authorization", "Jwt-Token", "Origin, Accept", "X-Requested-With", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfig.setExposedHeaders(
                Arrays.asList(
                        "Origin",
                        "Content-Type",
                        "Accept",
                        "Jwt-Token",
                        "Authorization",
                        "Access-Control-Allow-Origin",
                        "Access-Control-Allow-Origin",
                        "Access-Control-Allow-Credentials",
                        "Filename"
                )
        );
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsFilter(source);
    }
}
