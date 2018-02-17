package com.kment.jsoup.idnes.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.NumberOfPages;
import com.kment.jsoup.idnes.ParseUrl;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Component
public class ExtractComment {
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }

    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPages numberOfPage = new NumberOfPages();
        String selectorContributions = "div#disc-list";
        int numberOfPages = numberOfPage.numberOfPagesComment(document);
        if (numberOfPages == 0) {
            return commentList;
        }
        String selectorContribution = "div.contribution";

        Element contributions = document.select(selectorContributions).first();
        Elements selectedDivs = contributions.select(selectorContribution);
        commentList.addAll(getCommentsFromElements(selectedDivs, idArticle));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            System.out.println(urlForNextPage);
            document = parseUrl.parse(urlForNextPage);
            contributions = document.select(selectorContributions).first();
            selectedDivs = contributions.select(selectorContribution);
            commentList.addAll(getCommentsFromElements(selectedDivs, idArticle));
        }


        return commentList;
    }

    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }


    private List<Comment> getCommentsFromElements(Elements selectedDivs, long idArticle) throws ParseException {
        List<Comment> commentList = new ArrayList<>();
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
            commentList.add(new Comment(name, content.text(), linkHref, idArticle, getCreatedDate(date)));
        }
        return commentList;

    }

    public Date getCreatedDate(Element dateElement) throws ParseException {
        System.out.println(dateElement.text());
        String data = dateElement.text();
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm");
        Date date = sdf.parse(data);
        System.out.println(date);
        return date;

    }

}
