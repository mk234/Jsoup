package idnes.source

import org.jsoup.nodes.Document

import javax.xml.bind.Element

class ExtractCommentIdnesPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()


    Document getCommentPageAsDocument() {
        return parseFromFile.getDocumentFromFile("html_idnes/comments_source/discussion_one_page.htm")
    }

    def getNumberOfComments() {
        return 24
    }


    def getFirsComment() {
        return "Tam na vozovce musela být olejová skvrna, jinak to není možné, aby se stala tato nehoda. Audi, BMW, Ferrari, Maserati, Aston Martin a jiné sportovní speciály, to jsou tak skvělé auta. Můžete řezat v 250 km/h, téměř pravoúhlé zatáčky a ta auta prostě sedí. Jak říkám, musela tam být pořádná olejová skvrna do které najel.8-o"
    }

    def getLastComment() {
        return "Tak hlavně že nikoho nezabil a už ani nezabije. "
    }

  }
