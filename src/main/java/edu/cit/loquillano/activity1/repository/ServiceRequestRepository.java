package edu.cit.loquillano.activity1.repository;

import edu.cit.loquillano.activity1.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    // Only requests belonging to this user
    List<ServiceRequest> findByCreatedBy(String createdBy);

    // Only fetch a specific request IF it belongs to this user — enforces ownership at the query level
    Optional<ServiceRequest> findByIdAndCreatedBy(Long id, String createdBy);
}
