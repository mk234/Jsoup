package lidovky.source

import org.jsoup.nodes.Document
import portals.ParseFromFile

class NumberOfPagesLidovkyPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()

    Document getDocumentForArchive() {
        return parseFromFile.getDocumentFromFile("html_lidovky/archiv_source/archive_page1.htm")
    }

    def getNumberOFPagesInArchive() {
        return 1
    }

    def getSelectorContent() {
        return "div#content"
    }

    Document getDocumentForComment() {
        return parseFromFile.getDocumentFromFile("html_lidovky/comments_source/discussion_page1.htm")
    }

    def getNumberOfPagesInArticle() {
        return 2
    }

}
