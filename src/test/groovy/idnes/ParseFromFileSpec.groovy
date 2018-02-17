package idnes

import idnes.source.ParseFromFile
import org.jsoup.nodes.Document
import spock.lang.Specification

class ParseFromFileSpec extends Specification {

    ParseFromFile parseFromFile = new ParseFromFile()

    def "get document from local html page"() {
        when:
        Document document = parseFromFile.getDocumentFromFile("html_idnes/archiv_source/archiv_2.8.2015_strana1.htm")
        then:
        document != null
    }

}
