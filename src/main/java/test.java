import jdk.nashorn.internal.runtime.regexp.joni.Regex;
import org.apache.commons.lang3.text.WordUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class test {


    public static void main(String[] args) throws IOException {

      String str ="M<i>50</i>i<i>79</i>c<i>77</i>h<i>85</i>a<i>79</i>l <i>77</i>S<i>82</i>l<i>23</i>a<i>73</i>v<i>91</i>í<i>40</i>č<i>85</i>e<i>92</i>k";

        str = str.replaceAll("(?<=<i>).*?(?=</i>)", "");
        str = Jsoup.parse(str).text();
        System.out.println(str);
         }



        public static void komenty() throws IOException {
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
