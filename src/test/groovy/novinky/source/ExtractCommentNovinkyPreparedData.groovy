package novinky.source

import org.jsoup.nodes.Document

class ExtractCommentNovinkyPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()


    Document getCommentPageAsDocument() {
        return parseFromFile.getDocumentFromFile("html_novinky/comments_source/discussion_one_page.html")
    }

    def getNumberOfComments() {
        return 0
    }


    def getFirsComment() {
        return "Josef Andrle, Ždánov.............................................. ČR leží uprostřed Evropy, je proto velmi výhodné přes nás létat, a ČR je ještě velice benevolentní, nejen k povolení letů přes nás, ale v cenách - máme nejlevnější ceny přeletu - informace ze zdrojů dokumentárního pořadu v TV. A naší vádě je to jedno, hlavně že \"kapají\" penízky, omezí to až nějaká letadla na nás spadnou, dříve ne, uvidíte.Prostě máme ve vládě lidi, co chtějí jen peníze, rozum je jim na hony vzdálený!"
    }

    def getLastComment() {
        return "Venku je krásně, všechno kvete a včelky mají napilno, ale někdy si říkám, když je 23 stupnu v dubnu a slunce, kolik bude asi v červenci :))"
    }

}
