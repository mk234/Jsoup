import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class test {


    public static void main(String[] args) throws IOException {
        String urlString = "https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A171104_145133_zahranicni_fka";
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
      //  String selectorName = "h4.name";
        String selectorDate = "div.date.hover";
        String selectorContent = "div.user-text";
        for (Element div : selectedDivs) {
           // Element name = div.select(selectorName).first();
            Element date = div.select(selectorDate).first();
            Element content = div.select(selectorContent).first();
           // System.out.println(name.text());
            System.out.println(date.text());
            System.out.println(content.text());
            System.out.println("=====================================");

        }
    }}
