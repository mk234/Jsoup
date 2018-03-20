package novinky.source

import org.jsoup.nodes.Document

class ExtractCommentNovinkyPreparedData {

    novinky.source.ParseFromFile parseFromFile = new novinky.source.ParseFromFile()


    Document getCommentPageAsDocument() {
        return parseFromFile.getDocumentFromFile("html_novinky/comments_source/discussion_one_page.htm", "UTF-8")
    }

    def getNumberOfComments() {
        return 3
    }


    def getFirsComment() {
        return "To je tak, když někdo z druhé strany republiky tady dělá chytrého a přitom se nepodíval dál, než za humna."
    }

    def getLastComment() {
        return "Jen se podívejte na tu fotku!? Uzoulinká silnička bez možnosti úniku,strmé stoupání,žádný pruh pro velepomalá a přetížená vozidla...to nemluvím o nějakém vysoce odolném podloží (beton) aby nebyl roletovitý efekt. Prostě takhle se stavěla Autobahn za Německa. Vlastně ani se tak tehdy nestavělo.Co je nejhorší není žádná objízdná trasa,....tedy ona je již 80 let hotová ,ale žabičkáři protestují.A Sosanům s Kapšem se to náramě hodí."
    }

}
