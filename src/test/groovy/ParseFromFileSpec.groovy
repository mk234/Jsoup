import org.jsoup.nodes.Document
import spock.lang.Specification

class ParseFromFileSpec extends Specification {

    ParseFromFile parseFromFile = new ParseFromFile()

    def "get document from local html page"() {
        when:
        Document document = parseFromFile.getDocumentFromFile("html/archiv_source/test.txt")
        then:
        document != null
    }

}
