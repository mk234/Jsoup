package com.kment.jsoup.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_article")
    private long id;
    private String name;
    private String url;
    private Date created;
    private Date lastCollection;
    private String keywords;
    @Column(name = "id_portal_pkey")
    private long idPortal;

    public Article() {
    }

    public Article(String name, String url, Date created, Date lastCollection, String keywords, long idPortal) {
        this.name = name;
        this.url = url;
        this.created = created;
        this.lastCollection = lastCollection;
        this.keywords = keywords;
        this.idPortal = idPortal;
    }

    public Article(String name, String url, String created, String kastCollection, String keywords) {
        this.name = name;
        this.url = url;
        this.lastCollection = lastCollection;
        this.keywords = keywords;
        this.idPortal = idPortal;
    }

    @Override
    public String toString() {
        return "\nArticle{" +
                ", id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", created=" + created +
                ", lastCollection=" + lastCollection +
                ", keywords='" + keywords + '\'' +
                '}';
    }

    public void setLastCollection(Date lastCollection) {
        this.lastCollection = lastCollection;
    }

    public long getIdPortal() {
        return idPortal;
    }

    public void setIdPortal(long idPortal) {
        this.idPortal = idPortal;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getLastCollection() {
        return lastCollection;
    }

    public void setLastCollection(java.sql.Date lastCollection) {
        this.lastCollection = lastCollection;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
