package com.kment.jsoup.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_comment")
    private int id;
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

    public void setIdArticle(long idArticle) {
        this.idArticle = idArticle;
    }

    public Comment(String name, String linkHref, String date, String content) throws ParseException {
        this.name = name;
        this.linkHref = linkHref;
        DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy hh:mm");
        Date dates = dateFormat.parse(date);
        long time = dates.getTime();
        new Timestamp(time);
        this.content = content;
    }

    public Comment(String name, String content, String linkHref, long idArticle, Date date) {
        this.name = name;
        this.content = content;
        this.linkHref = linkHref;
        this.idArticle = idArticle;
        this.date = date;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "name='" + name + '\'' +
                ", linkHref='" + linkHref + '\'' +
                ", date='" + date + '\'' +
                ", content='" + content + '\'' +
                '}' + "\n";
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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
