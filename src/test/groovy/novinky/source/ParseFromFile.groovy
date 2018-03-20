package novinky.source

import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.springframework.stereotype.Component

@Component
class ParseFromFile {

    Document 'getDocumentFromFile'(String path, String charset) {
        Document document
        ClassLoader classLoader = getClass().getClassLoader()
        File file = new File(classLoader.getResource(path).getFile())
        document = Jsoup.parse(file, charset)
        return document
    }
}
