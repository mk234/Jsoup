package com.kment.jsoup.springdata;

import com.kment.jsoup.entity.Portal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface IPortalSpringDataRepository extends JpaRepository<Portal, Integer> {

    @Query("select p from Portal p where p.name = ?1")
    List<Portal> findByName(String name);

    @Query("select p from Portal p where p.name = ?1 and p.lastCollection = ?2")
    List<Portal> findByLastCollectionAndName(String name, Date date);
}
