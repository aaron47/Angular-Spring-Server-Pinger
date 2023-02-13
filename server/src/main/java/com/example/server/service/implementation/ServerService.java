package com.example.server.service.implementation;

import com.example.server.enumeration.Status;
import com.example.server.exception.ServerNotFoundException;
import com.example.server.model.Server;
import com.example.server.repository.ServerRepository;
import com.example.server.service.IServerService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Random;

import static java.lang.Boolean.TRUE;

@Service
@Transactional
@Slf4j
public class ServerService implements IServerService {

    private final ServerRepository serverRepository;

    @Autowired
    public ServerService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }


    @Override
    public Server create(Server server) {
        log.info("Creating new server: {}", server.getName());
        server.setImgUrl(setServerImgUrl());
        return serverRepository.save(server);
    }


    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server with IP address: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fetching {} servers", limit);
//        return serverRepository.findAll().subList(0, limit);
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Fetching server with ID: {}", id);
        return serverRepository.findById(id).orElseThrow(() -> new ServerNotFoundException("Server with ID " + id + " not found"));
    }

    @Override
    public Server update(Long id, Server server) {
        log.info("Updating server with ID: {}", id);
        return serverRepository.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server with ID: {}", id);
        serverRepository.deleteById(id);
        return TRUE;
    }

    private String setServerImgUrl() {
        String[] imageNames = { "server1.png", "server2.png", "server3.png", "server4.png" };
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/image/" + imageNames[new Random().nextInt(4)]).toUriString();
    }
}
