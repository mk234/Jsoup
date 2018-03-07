package com.kment.jsoup.entity;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrlPortal() {
        return urlPortal;
    }

    public void setUrlPortal(String urlPortal) {
        this.urlPortal = urlPortal;
    }

    public Date getLastCollection() {
        return lastCollection;
    }

    public void setLastCollection(Date lastCollection) {
        this.lastCollection = lastCollection;
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
}
