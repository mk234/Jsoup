package com.kment.jsoup.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Portal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_portal")
    private long id;
    private String name;
    private String urlPortal;
    private Date lastCollection;
       public Portal() {
    }

    public Portal(String name, String urlPortal, Date lastCollection) {
        this.name = name;
        this.urlPortal = urlPortal;
        this.lastCollection = lastCollection;
    }
}
