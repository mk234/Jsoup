package idnes.source

import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.springframework.stereotype.Component

@Component
class ParseFromFile {

    Document getDocumentFromFile(String path) {
        Document document
        ClassLoader classLoader = getClass().getClassLoader()
        File file = new File(classLoader.getResource(path).getFile())
        document = Jsoup.parse(file, "windows-1250")
        return document
    }

    Document getEmptyDocument() {
        Document document = Jsoup.parse("<HTML></HTML>")
    }


}
