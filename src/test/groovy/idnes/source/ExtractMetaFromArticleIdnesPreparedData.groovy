package idnes.source

import org.jsoup.nodes.Document

class ExtractMetaFromArticleIdnesPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()


    Document getArticleAsDocument() {
         return parseFromFile.getDocumentFromFile("html_idnes/article_source/article.htm")
    }

    def getKeywors() {
        return "Afghánistán, Írán, Španělsko, CNN, kuchyně, Světová banka"
    }

    def getAuthor() {
        return "Anna Barochová"
    }

    def getDescription() {
        return "Íránské ekonomice zatím stále přidušené sankcemi může pomoci netradiční surovina - šafrán. Vzácnému koření se v místním podnebí daří a íránská pole plodí ročně 90 procent jeho světové produkce. Červené tyčinky z drobných květin jsou nadějí i pro sousední Afghánistán, kde by šafrán mohl vymýtit nelegální opium."
    }

    def getNumberOfComments() {
        return 131
    }

    def getDate(){
        return "08/02/2015 20:49:00"
    }
}
