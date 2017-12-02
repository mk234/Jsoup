import org.jsoup.nodes.Element;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

//@Entity
public class CommentEntity {

    //@Id
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
}
