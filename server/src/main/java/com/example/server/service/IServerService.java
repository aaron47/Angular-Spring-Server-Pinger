package com.example.server.service;

import com.example.server.model.Server;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Collection;

public interface IServerService {
    Server create(Server server);

    Server ping(String ipAddress) throws IOException;

    Collection<Server> list(int limit);

    Server get(Long id);

    Server update(Long id, Server server);

    Boolean delete(Long id);
}
