package com.example.eventservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final JWTVerifier verifier;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        this.verifier = JWT.require(algorithm).build();
    }

    public JwtUser verify(String token) {
        DecodedJWT jwt = verifier.verify(token);
        String email = jwt.getSubject();
        String role = jwt.getClaim("role").asString();
        String rollNumber = jwt.getClaim("rollNumber").asString();
        String facultyId = jwt.getClaim("facultyId").asString();
        return new JwtUser(email, role, rollNumber, facultyId);
    }
}
