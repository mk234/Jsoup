package novinky.source

import org.jsoup.nodes.Document

class NumberOfPagesNovinkyPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()

    Document getDocumentForArchive() {
        return parseFromFile.getDocumentFromFile("html_novinky/archiv_source/archive_page1.htm")
    }

    def getNumberOFPagesInArchive() {
        return 4
    }

    def getSelectorContent() {
        return "div#content"
    }

    Document getDocumentForComment() {
        return parseFromFile.getDocumentFromFile("html_novinky/comments_source/discussion_page1.html")
    }

    def getNumberOfPagesInArticle() {
        return 0
    }

}
