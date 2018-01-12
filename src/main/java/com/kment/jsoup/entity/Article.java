package com.kment.jsoup.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;

@Entity
public class Article {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private String url;
    private String created;
    private String LastCollection;
    private String keywords;

    public Article() {
    }

    public Article(long id, String name, String url, String created, String lastCollection, String keywords) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.created = created;
        LastCollection = lastCollection;
        this.keywords = keywords;
    }

    public Article(String name, String url, String created, String lastCollection, String keywords) {
        this.name = name;
        this.url = url;
        this.created = created;
        LastCollection = lastCollection;
        this.keywords = keywords;
    }

    @Override
    public String toString() {
        return "\nArticle{" +
                ", id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", created=" + created +
                ", LastCollection=" + LastCollection +
                ", keywords='" + keywords + '\'' +
                '}';
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

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getLastCollection() {
        return LastCollection;
    }

    public void setLastCollection(String lastCollection) {
        LastCollection = lastCollection;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
