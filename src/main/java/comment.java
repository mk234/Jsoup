import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class comment {


    public static void main(String[] args) throws IOException {
        komenty();
    }


    private static String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        name = Jsoup.parse(name).text();
        name = name.substring(0, name.lastIndexOf(" "));
        return name;
    }

    private static void komenty() throws IOException {
        String urlString = "https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A150730_143206_zahranicni_aba";
        Document doc = Jsoup.connect(urlString).get();

        String selectorContributions = "div#disc-list";
        String selectorContribution = "div.contribution";
        //String selectorContribution = "div.msgBoxOut";

        Element contributions = doc.select(selectorContributions).first();
        //Element contributions = doc.getElementById("contributions");

        Elements selectedDivs = contributions.select(selectorContribution);
       /* // vypsání vybraných div
        for (Element div : selectedDivs) {
            System.out.println(div);
        }

        // vypsání textu vybraných div
        for (Element div : selectedDivs) {
            System.out.println(div.text());
        }*/

        // vyhledání elementů v rozsahu jiného elementu
        String selectorName = "h4.name";
        String selectorDate = "div.date.hover";
        String selectorContent = "div.user-text";
        for (Element div : selectedDivs) {
            //  Element name = div.select(selectorName).first();
            Element date = div.select(selectorDate).first();
            Element content = div.select(selectorContent).first();
            String name = div.select(selectorName).first().html();
            name = regex(name);
            System.out.println(name);
            System.out.println(date.text());
            System.out.println(content.text());
            System.out.println("=====================================");
        }
    }
}