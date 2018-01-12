package com.kment.jsoup.springdata;

import com.kment.jsoup.entity.Portal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPortalSpringDataRepository extends JpaRepository<Portal, Integer> {
}
