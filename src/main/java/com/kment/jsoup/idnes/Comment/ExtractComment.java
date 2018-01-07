package com.kment.jsoup.idnes.Comment;

import com.kment.jsoup.idnes.ParseUrl;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


@Component
public class ExtractComment {

    public List<CommentEntity> findComments(String url) throws IOException, ParseException {
        List<CommentEntity> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(url);
        NumberOfPages numberOfPage = new NumberOfPages();
        int numberOfPages = numberOfPage.numberOfPages(document);


        String selectorContributions = "div#disc-list";
        String selectorContribution = "div.contribution";

        Element contributions = document.select(selectorContributions).first();
        Elements selectedDivs = contributions.select(selectorContribution);
        commentList.addAll(getComments(selectedDivs));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrl.parse(urlForNextPage);
            contributions = document.select(selectorContributions).first();
            selectedDivs = contributions.select(selectorContribution);
            commentList.addAll(getComments(selectedDivs));
        }


        return commentList;
    }

    private String getDocumentForNextPage(String url, int i) {
        return url + "&razeni=vlakno&strana=" + i;
    }


    private List<CommentEntity> getComments(Elements selectedDivs) throws ParseException {
        List<CommentEntity> commentList = new ArrayList<>();
        String selectorName = "h4.name";
        String selectorDate = "div.date.hover";
        String selectorContent = "div.user-text";
        ParseName parseName = new ParseName();
        for (Element div : selectedDivs) {
            Element date = div.select(selectorDate).first();
            Element content = div.select(selectorContent).first();
            String name = div.select(selectorName).first().html();
            Document linkDoc = Jsoup.parse(name);
            Element link = linkDoc.select("a").first();
            String linkHref = link.attr("href");
            name = parseName.regex(name);
            commentList.add(new CommentEntity(name, linkHref, date.text(), content.text()));
        }
        return commentList;

    }


}
