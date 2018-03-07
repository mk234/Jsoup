package com.kment.jsoup.entity;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Comment {

    @Id
     @SequenceGenerator(name = "SQ_ID_COMMENT", sequenceName = "SQ_ID_COMMENT", allocationSize = 250)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_ID_COMMENT")
    @Column(name = "id_comment")
    private long id;
    @Column(name = "author")
    private String name;
    @Column(name = "text", columnDefinition = "TEXT")
    private String content;
    @Column(name = "author_url")
    private String linkHref;
    @Column(name = "id_article_article")
    private long idArticle;
    @Column(name = "created")
    private Date date;

    public long getIdArticle() {
        return idArticle;
    }

    public Comment() {
    }

    public Comment(String name, String content, String linkHref, long idArticle, Date date) {
        this.name = name;
        this.content = content;
        this.linkHref = linkHref;
        this.idArticle = idArticle;
        this.date = date;
    }

    public void setIdArticle(long idArticle) {
        this.idArticle = idArticle;
    }


    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
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

    public String getLinkHref() {
        return linkHref;
    }

    public void setLinkHref(String linkHref) {
        this.linkHref = linkHref;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
