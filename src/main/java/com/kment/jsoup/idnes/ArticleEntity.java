package com.kment.jsoup.idnes;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class ArticleEntity {

    @Id
    private int id;
    private String name;
    private String url;
    private Date created;
    private Date LastCollection;
    private String keywords;

    public ArticleEntity(int id, String name, String url, Date created, Date lastCollection, String keywords) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.created = created;
        LastCollection = lastCollection;
        this.keywords = keywords;
    }

    @Override
    public String toString() {
        return "ArticleEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", created=" + created +
                ", LastCollection=" + LastCollection +
                ", keywords='" + keywords + '\'' +
                '}';
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
        return LastCollection;
    }

    public void setLastCollection(Date lastCollection) {
        LastCollection = lastCollection;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
