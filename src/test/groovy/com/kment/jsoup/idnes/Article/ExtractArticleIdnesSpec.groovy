package com.kment.jsoup.idnes.Article

import com.kment.jsoup.extractor.ParseUrl
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest
class ExtractArticleIdnesSpec extends Specification {
    @Autowired
    ExtractArticleIdnes extractArticle
    @Autowired
    ParseUrl parseUrl
    String archivHTMLOld = "<div class=\"cell\">\n" +
            "\t\t<h3>\n" +
            "\t\t\t<a href=\"https://liberec.idnes.cz/olesnice-topici-se-dite-reka-jablonec-dsq-/liberec-zpravy.aspx?c=A150802_174210_liberec-zpravy_aba\">V potoce se topil roční chlapec. Policie vyšetřuje, jak se tam dostal</a>\n" +
            "\t\t</h3>\n" +
            "\t\t<div class=\"art-info\">\n" +
            "\t\t\t\n" +
            "\t\t\t<span class=\"time\">\n" +
            "    <span class=\"time-date\">2.8.2015</span>&nbsp;&nbsp;17:46\n" +
            "</span>\n" +
            "\t\t</div>\n" +
            "\t\t<div class=\"perex\">\n" +
            "\t\t\tV potoce ve Zlaté Olešnici na Jablonecku se dopoledne topil \n" +
            "třináctiměsíční chlapec. Záchranáři dítě letecky transportovali na \n" +
            "dětskou kliniku do Motola. Jak se dítě do vody dostalo, je...&nbsp;\n" +
            "\t\t\t<a href=\"https://liberec.idnes.cz/olesnice-topici-se-dite-reka-jablonec-dsq-/liberec-zpravy.aspx?c=A150802_174210_liberec-zpravy_aba\">\n" +
            "\t\t\t\tcelý článek\n" +
            "\t\t\t</a>\n" +
            "\t\t</div>\t\t\n" +
            "\n" +
            "\t</div>\n" +
            "</div>"

    String archivHTML = "<h1><a href=\"https://zpravy.idnes.cz/duma-podle-ruska-zinscenoval-chemicky-utok-londyn-syrie-pks-/zahranicni.aspx?c=A180413_175208_zahranicni_lre\" class=\"art-link\"> <h3> USA mají důkaz, že Asadova armáda v Dúmě použila chemické zbraně </h3> \n" +
            " <div class=\"art-img w230 mark-video w230\"> \n" +
            "  <img alt=\"Rozbombardované ulice města Dúmá nedaleko Damašku (25. února 2018)\" src=\"//1gr.cz/fotky/idnes/18/023/w230/AHA71a714_Damagedcarsand.jpg\" title=\"Rozbombardované ulice města Dúmá nedaleko Damašku (25. února 2018)\" width=\"230\" height=\"129\"> \n" +
            "  <span></span> \n" +
            " </div> </a> \n" +
            "<div class=\"art-info\"> \n" +
            " <span class=\"time\" datetime=\"2018-04-13T22:58:00\" id=\"time-0\"> aktualizováno&nbsp; 13. dubna 2018 </span> \n" +
            "</div> \n" +
            "<p class=\"perex\"> USA mají důkaz, že síly syrského prezidenta Bašára Asada použily chemické zbraně při útoku na Dúmu,... </p></h1>"

    def "get article"() {
        given:
        Document document = Jsoup.parse(archivHTML)
        Elements elements = document.select("h1")
        println elements.html()
        when:
        def result = extractArticle.getArticles(elements, null)
        then:
        result != null
    }

    def "get article old"() {
        given:
        Document document = Jsoup.parse(archivHTMLOld)
        Elements elements = document.select("div.cell")
        println elements.html()
        when:
        def result = extractArticle.getArticles(elements, null)
        then:
        result != null
    }
}
