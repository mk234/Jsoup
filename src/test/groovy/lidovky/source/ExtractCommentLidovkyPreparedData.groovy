package lidovky.source

import org.jsoup.nodes.Document
import portals.ParseFromFile

class ExtractCommentLidovkyPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()


    Document getCommentPageAsDocument() {
        return parseFromFile.getDocumentFromFile("html_lidovky/comments_source/discussion_one_page.htm")
    }

    def getNumberOfComments() {
        return 8
    }


    def getFirsComment() {
        return "Pane Konvičný, zapomněl jste na Marii Terezii..."
    }

    def getLastComment() {
        return "Českou Poštu si strčte do análů. Je to přežitek, který nahradily soukromé firmy a jsou levnější, rychlejší a spolehlivější."
    }

}
