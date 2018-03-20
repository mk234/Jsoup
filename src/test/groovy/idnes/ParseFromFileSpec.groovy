package idnes

import idnes.source.ParseFromFile
import org.jsoup.nodes.Document
import spock.lang.Specification

class ParseFromFileSpec extends Specification {

    ParseFromFile parseFromFile = new ParseFromFile()

    def "get document from local html page"() {
        when:
        Document document = parseFromFile.getDocumentFromFile("html_idnes/archiv_source/archive_page1.htm")
        then:
        document != null
    }

}
