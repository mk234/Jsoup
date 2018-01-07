package com.kment.jsoup.idnes.Comment;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String linkHref;
    private String date;
    private String content;

     CommentEntity(String name, String linkHref, String date, String content) throws ParseException {
        this.name = name;
        this.linkHref = linkHref;
        DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy hh:mm");
        Date dates = dateFormat.parse(date);
        long time = dates.getTime();
        new Timestamp(time);
        this.content = content;
    }

    @Override
    public String toString() {
        return "CommentEntity{" +
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
