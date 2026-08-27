package edu.cit.loquillano.activity1.service;

import edu.cit.loquillano.activity1.model.ServiceRequest;
import edu.cit.loquillano.activity1.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository repository;

    // CREATE — createdBy comes from the authenticated username, set by the controller
    public ServiceRequest create(ServiceRequest request, String username) {
        request.setCreatedBy(username);
        return repository.save(request);
    }

    // READ ALL — only this user's own requests
    public List<ServiceRequest> getAllForUser(String username) {
        return repository.findByCreatedBy(username);
    }

    // READ ONE — only if it belongs to this user
    public Optional<ServiceRequest> getByIdForUser(Long id, String username) {
        return repository.findByIdAndCreatedBy(id, username);
    }

    // UPDATE — only if the existing request belongs to this user
    public Optional<ServiceRequest> updateForUser(Long id, ServiceRequest updated, String username) {
        return repository.findByIdAndCreatedBy(id, username).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setCategory(updated.getCategory());
            // dateCreated and createdBy are never overwritten by client input
            return repository.save(existing);
        });
    }

    // DELETE — only if it belongs to this user. Returns true if deleted, false if not found/not owned.
    public boolean deleteForUser(Long id, String username) {
        return repository.findByIdAndCreatedBy(id, username).map(existing -> {
            repository.delete(existing);
            return true;
        }).orElse(false);
    }
}
