package com.kment.jsoup.idnes.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.idnes.NumberOfPagesIdnes;
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
public class ExtractCommentIdnes {
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        // System.out.println(urlComment);
        Document document = parseUrl.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }

    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPagesIdnes numberOfPage = new NumberOfPagesIdnes();
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
        ParseNameIdnes parseNameIdnes = new ParseNameIdnes();
        for (Element div : selectedDivs) {
            Element date = div.select(selectorDate).first();
            Element content = div.select(selectorContent).first();
            String name = div.select(selectorName).first().html();
            Document linkDoc = Jsoup.parse(name);
            Element link = linkDoc.select("a").first();
            String linkHref = link.attr("href");
            name = parseNameIdnes.regex(name);
            commentList.add(new Comment(name, content.text(), linkHref, idArticle, getCreatedDate(date)));
        }
        return commentList;

    }

    public Date getCreatedDate(Element dateElement) throws ParseException {
        String data = dateElement.text();
        if (data.contains(":")) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm");
            Date date = sdf.parse(data);
            return date;
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
            Date date = sdf.parse(data);
            return date;
        }
    }

}
