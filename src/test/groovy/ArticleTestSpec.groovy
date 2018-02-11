package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.idnes.Article.ExtractArticle
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle
import com.kment.jsoup.idnes.ParseUrl
import org.jsoup.nodes.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Shared
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ArticleTestSpec extends Specification {
// 117 artiklu v https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes
/*
vseobecne
parse name a url, url for next page, create url, datum tvorba, vcerejsi datum

clanek
nacist clanek
klicova slova, popis, autor, pocet clanku, datum


komentare
nacist vsechny stranky komentaru
pocet na prvni a posledni strane komentaru

komentar
vyselektovat spravne datum, autora, text



updatovani
ulozeni testovaciho dne do db
nacteni do dokumentu ulozeny archiv ze dne

 */
    @Autowired
    ExtractMetaFromArticle extractMetaFromArticle
    @Autowired
    ExtractArticle extractArticle
    @Shared
    Document document
    @Shared
    Document documentArticle
    @Shared
    String url = "https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes"
    @Shared
    String articleUrl = "https://zpravy.idnes.cz/safran-produkce-iran-afghanistan-d44-/zahranicni.aspx?c=A150730_143206_zahranicni_aba"


    def setupSpec() {
        ParseUrl parseUrl = new ParseUrl()
        document = parseUrl.parse(url)
        documentArticle = parseUrl.parse(articleUrl)
    }

    def "number of article in one day"() {
        when:
        List<Article> articleList = extractArticle.findArticles(url)
        then:
        articleList.size() == 117
    }

    def "get keywords from page"() {
        when:
        String keywords = extractMetaFromArticle.getKeywors(documentArticle)
        then:
        keywords.equals("Írán")
    }

    def "get author from article"() {
        when:
        String author = extractMetaFromArticle.getAuthor(documentArticle)
        then:
        author.equals("Anna Barochová")
    }

    def "get description from article"() {
        when:
        String description = extractMetaFromArticle.getDescription(documentArticle)
        then:
        description.equals("Íránské ekonomice zatím stále přidušené sankcemi může pomoci netradiční surovina - šafrán. Vzácnému koření se v místním podnebí daří a íránská pole plodí ročně 90 procent jeho světové produkce. Červené tyčinky z drobných květin jsou nadějí i pro sousední Afghánistán, kde by šafrán mohl vymýtit nelegální opium.")
    }

    def "get number of comment page to one specific article"() {
        when:
        int number = extractMetaFromArticle.getNumburOfComment(documentArticle)
        then:
        number == 131
    }

}
