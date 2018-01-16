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
    @Column(columnDefinition = "TEXT")
    private String keywords;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "id_portal_pkey")
    private long idPortal;
    private int numberOfComments;
    private String author;

    public Article() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getNumberOfComments() {
        return numberOfComments;
    }

    public void setNumberOfComments(int numberOfComments) {
        this.numberOfComments = numberOfComments;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Article(String name, String url, Date created, Date lastCollection, String keywords, String description, long idPortal, int numberOfComments, String author) {
        this.name = name;
        this.url = url;
        this.created = created;
        this.lastCollection = lastCollection;
        this.keywords = keywords;
        this.description = description;
        this.idPortal = idPortal;
        this.numberOfComments = numberOfComments;
        this.author = author;
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
