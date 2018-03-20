package lidovky.source

import org.jsoup.nodes.Document

class ExtractMetaFromArticleLidovkyPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()


    Document getArticleAsDocument() {
        return parseFromFile.getDocumentFromFile("html_lidovky/article_source/article.htm")
    }

    def getKeywors() {
        return "Zahraničí"
    }

    def getAuthor() {
        return "ČTK"
    }

    def getDescription() {
        return "Zpráva republikánských kongresmanů o vyšetřování údajného ruského vlivu na americké prezidentské volby bude zveřejněna v pátek. Oznámil to ve čtvrtek podle agentury Reuters zástupce Bílého domu. Podle něj se očekává, že zprávu zveřejní výbor pro kontrolu činnosti tajných služeb Sněmovny reprezentantů, který už s jejím zveřejněním dříve vyslovil souhlas."
    }

    def getNumberOfComments() {
        return 35
    }

    def getDate() {
        return "02/01/2018 21:45"
    }
}
