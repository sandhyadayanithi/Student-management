package com.example.studentservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationMs;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.verifier = JWT.require(algorithm).build();
        this.expirationMs = expirationMs;
    }

    public String generateStudentToken(String email, String rollNumber) {
        long now = System.currentTimeMillis();
        return JWT.create()
                .withSubject(email)
                .withClaim("role", "student")
                .withClaim("rollNumber", rollNumber)
                .withIssuedAt(new Date(now))
                .withExpiresAt(new Date(now + expirationMs))
                .sign(algorithm);
    }

    public JwtUser verify(String token) {
        DecodedJWT jwt = verifier.verify(token);
        String email = jwt.getSubject();
        String role = jwt.getClaim("role").asString();
        String rollNumber = jwt.getClaim("rollNumber").asString();
        return new JwtUser(email, role, rollNumber);
    }
}
