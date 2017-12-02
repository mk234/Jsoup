import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


public class Comment {


   /* public static void main(String[] args) throws IOException, ParseException {
           komenty();
    }*/


     String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        name = Jsoup.parse(name).text();
        name = name.substring(0, name.lastIndexOf(" "));
        return name;
    }


     void komenty() throws IOException, ParseException {
        String urlString = "https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A150730_143206_zahranicni_aba";
        Document doc = Jsoup.connect(urlString).get();
        List<CommentEntity> commentList = new ArrayList<CommentEntity>();

        String selectorContributions = "div#disc-list";
        String selectorContribution = "div.contribution";

        Element contributions = doc.select(selectorContributions).first();

        Elements selectedDivs = contributions.select(selectorContribution);

        String selectorName = "h4.name";
        String selectorDate = "div.date.hover";
        String selectorContent = "div.user-text";
        for (Element div : selectedDivs) {
            Element date = div.select(selectorDate).first();
            Element content = div.select(selectorContent).first();
            String name = div.select(selectorName).first().html();
            Document linkDoc = Jsoup.parse(name);
            Element link = linkDoc.select("a").first();
            String linkHref = link.attr("href");
            System.out.println(name);
            name = regex(name);
            commentList.add(new CommentEntity(name, linkHref, date.text(), content.text()));
         /*   System.out.println(name);
            System.out.println(linkHref);
            System.out.println(date.text());
            System.out.println(content.text());
            System.out.println("=====================================");
        */}
        System.out.println(commentList.toString());
    }
}
