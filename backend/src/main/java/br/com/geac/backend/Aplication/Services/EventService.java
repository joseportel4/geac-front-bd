package br.com.geac.backend.Aplication.Services;

import br.com.geac.backend.Aplication.DTOs.Request.EventRequestDTO;
import br.com.geac.backend.Aplication.DTOs.Reponse.EventResponseDTO;
import br.com.geac.backend.Domain.Entities.Event;
import br.com.geac.backend.Domain.Entities.User;
import br.com.geac.backend.Repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    // private final UserRepository userRepository;

    @Transactional
    public EventResponseDTO createEvent(EventRequestDTO dto) {
        User organizer = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (organizer.getRole() == null || !organizer.getRole().name().equals("PROFESSOR")) {
            throw new AccessDeniedException("Apenas organizadores podem cadastrar eventos.");
        }
        Event event = new Event();
        event.setTitle(dto.title());
        event.setDescription(dto.description());
        event.setOnlineLink(dto.onlineLink());
        event.setStartTime(dto.startTime());
        event.setEndTime(dto.endTime());
        event.setWorkloadHours(dto.workloadHours());
        event.setMaxCapacity(dto.maxCapacity());
        event.setCategoryId(dto.categoryId());
        event.setLocationId(dto.locationId());
        event.setOrganizer(organizer);
        event.setStatus("ACTIVE");
        Event saved = eventRepository.save(event);
        return new EventResponseDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getDescription(),
            saved.getOnlineLink(),
            saved.getStartTime(),
            saved.getEndTime(),
            saved.getWorkloadHours(),
            saved.getMaxCapacity(),
            saved.getStatus(),
            saved.getCreatedAt(),
            saved.getCategoryId(),
            saved.getLocationId(),
            organizer.getName(),
            organizer.getEmail()
        );
    }
}
