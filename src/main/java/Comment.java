import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


public class Comment {





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

        Element pages = contributions.select("table.nav-n4.ico").first();
        Element pageCount = pages.select("td.tac").first();


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
            name = regex(name);
            commentList.add(new CommentEntity(name, linkHref, date.text(), content.text()));


        }


        urlString = urlString.concat("&strana=2");
        doc = Jsoup.connect(urlString).get();

    }
}
