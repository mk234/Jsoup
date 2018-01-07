package com.kment.jsoup.idnes;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NumberOfPages {
    public int numberOfPages(Document document, String selectorContributions) {
        Element contributions = document.select(selectorContributions).first();

        int numberOfPages = 0;
        Element pages = contributions.select("table.nav-n4.ico").first();
        Element pageCount = pages.select("td.tac").first();
        List<Integer> pageNumber = new ArrayList<>();
        Pattern p = Pattern.compile("-?\\d+");
        Matcher m = p.matcher(pageCount.text());
        while (m.find()) {
            pageNumber.add(Integer.parseInt(m.group()));
            numberOfPages++;
        }
        return numberOfPages;
    }
}
