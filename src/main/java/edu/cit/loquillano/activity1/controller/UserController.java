package edu.cit.loquillano.activity1.controller;

import edu.cit.loquillano.activity1.model.User;
import edu.cit.loquillano.activity1.security.JwtUtil;
import edu.cit.loquillano.activity1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = userService.register(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.login(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername()
        ));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body("User not found");
        }

        return ResponseEntity.ok(user);
    }
}