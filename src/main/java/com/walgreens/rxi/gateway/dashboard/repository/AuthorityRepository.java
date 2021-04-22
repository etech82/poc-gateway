package com.walgreens.rxi.gateway.dashboard.repository;

import com.walgreens.rxi.gateway.dashboard.domain.Authority;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

/**
 * Spring Data R2DBC repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends R2dbcRepository<Authority, String> {}
