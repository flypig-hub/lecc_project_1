package com.rpgbank.service;

import com.rpgbank.entity.User;
import com.rpgbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Base service providing common operations for all services
 */
@Slf4j
@RequiredArgsConstructor
public abstract class BaseService<T, ID, R extends JpaRepository<T, ID>> {

    protected final R repository;

    /**
     * Find entity by ID with logging
     */
    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        log.debug("Finding {} with id: {}", getEntityClass().getSimpleName(), id);
        return repository.findById(id);
    }

    /**
     * Save entity with logging
     */
    @Transactional
    public T save(T entity) {
        log.debug("Saving {}: {}", getEntityClass().getSimpleName(), entity);
        return repository.save(entity);
    }

    /**
     * Update entity with logging
     */
    @Transactional
    public T update(T entity) {
        log.debug("Updating {}: {}", getEntityClass().getSimpleName(), entity);
        return repository.save(entity);
    }

    /**
     * Delete entity with logging
     */
    @Transactional
    public void deleteById(ID id) {
        log.debug("Deleting {} with id: {}", getEntityClass().getSimpleName(), id);
        repository.deleteById(id);
    }

    /**
     * Check if entity exists
     */
    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }

    /**
     * Find all entities with pagination
     */
    @Transactional(readOnly = true)
    public Page<T> findAll(Pageable pageable) {
        log.debug("Finding all {} with pagination: {}", getEntityClass().getSimpleName());
        return repository.findAll(pageable);
    }

    /**
     * Find entities by example with pagination
     */
    @Transactional(readOnly = true)
    public Page<T> findAllByExample(T example, Pageable pageable) {
        log.debug("Finding {} by example: {}", getEntityClass().getSimpleName());
        return repository.findAll(org.springframework.data.domain.Example.of(example), pageable);
    }

    /**
     * Count all entities
     */
    @Transactional(readOnly = true)
    public long count() {
        log.debug("Counting all {}", getEntityClass().getSimpleName());
        return repository.count();
    }

    /**
     * Get entity class name for logging
     */
    @SuppressWarnings("unchecked")
    private Class<T> getEntityClass() {
        try {
            // Get the generic type parameter from the anonymous class
            return (Class<T>) ((java.lang.reflect.ParameterizedType) getClass()
                    .getGenericSuperclass())
                    .getActualTypeArguments()[0];
        } catch (Exception e) {
            log.warn("Could not determine entity class type", e);
            return (Class<T>) Object.class;
        }
    }
}
