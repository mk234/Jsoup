package com.kment.jsoup.idnes;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Component
public class Comment {

private int numberOfPages = 0;



    String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        name = Jsoup.parse(name).text();
        name = name.substring(0, name.lastIndexOf(" "));
        return name;
    }


    ArrayList<CommentEntity> findComments() throws IOException, ParseException {


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

        List<Integer> pageNumber = new ArrayList<Integer>();
        Pattern p = Pattern.compile("-?\\d+");
        Matcher m = p.matcher(pageCount.text());
        while (m.find()) {
            pageNumber.add(Integer.parseInt(m.group()));
            numberOfPages++;
        }

    return (ArrayList<CommentEntity>) commentList;
    }

    public int getNumberOfPages() {
        return numberOfPages;
    }

    public void setNumberOfPages(int numberOfPages) {
        this.numberOfPages = numberOfPages;
    }
}
