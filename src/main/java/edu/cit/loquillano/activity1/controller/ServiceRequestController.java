package edu.cit.loquillano.activity1.controller;

import edu.cit.loquillano.activity1.model.ServiceRequest;
import edu.cit.loquillano.activity1.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService service;

    // POST /api/requests — create a new request owned by the authenticated user
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ServiceRequest request, Authentication authentication) {
        String username = authentication.getName();
        ServiceRequest saved = service.create(request, username);
        return ResponseEntity.ok(saved);
    }

    // GET /api/requests — list only the authenticated user's own requests
    @GetMapping
    public ResponseEntity<?> getAll(Authentication authentication) {
        String username = authentication.getName();
        List<ServiceRequest> requests = service.getAllForUser(username);
        return ResponseEntity.ok(requests);
    }

    // GET /api/requests/{id} — only if it belongs to the authenticated user
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        return service.getByIdForUser(id, username)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Service request not found"));
    }

    // PUT /api/requests/{id} — only if it belongs to the authenticated user
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestBody ServiceRequest updated,
                                     Authentication authentication) {
        String username = authentication.getName();
        return service.updateForUser(id, updated, username)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Service request not found"));
    }

    // DELETE /api/requests/{id} — only if it belongs to the authenticated user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        boolean deleted = service.deleteForUser(id, username);

        if (deleted) {
            return ResponseEntity.ok("Service request deleted");
        } else {
            return ResponseEntity.status(404).body("Service request not found");
        }
    }
}
