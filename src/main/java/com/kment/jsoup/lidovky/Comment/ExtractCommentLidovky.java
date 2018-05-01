package com.kment.jsoup.lidovky.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.ExtractMeta;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.lidovky.NumberOfPagesLidovky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Component
public class ExtractCommentLidovky {
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }

    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPagesLidovky numberOfPage = new NumberOfPagesLidovky();
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
        for (Element div : selectedDivs) {
            String name = div.select("span.name").first().text();
            Date date = getCreatedDate(div.select("span").set(1, div));
            String content = div.select("td.right").first().select("p").set(1, div).text();
            commentList.add(new Comment(name, content, "", idArticle, date));
        }
        return commentList;

    }


    public Date getCreatedDate(Element dateElement) throws ParseException {
        ExtractMeta extractMeta = new ExtractMeta();
        return extractMeta.getCreatedDate(dateElement);
    }

}
