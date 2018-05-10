package portals

import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.springframework.stereotype.Component

@Component
class ParseFromFile {

    Document getDocumentFromFile(String path) {
        Document document
        URL resource = ClassLoader.getSystemResource(path)
        String configPath = URLDecoder.decode(resource.getFile(), "UTF-8")
        File file = new File(configPath)
        document = Jsoup.parse(file, "windows-1250")
        return document
    }

    Document getEmptyDocument() {
        Document document = Jsoup.parse("<HTML></HTML>")
    }
}
