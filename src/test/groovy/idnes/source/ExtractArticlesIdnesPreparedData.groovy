package idnes.source

class ExtractArticlesIdnesPreparedData {

    ParseFromFile parseFromFile = new ParseFromFile()

    String getUrlForArchive() {
        return "https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes"
    }

    int getNumberOfArticlesInArchive() {
        return 117
    }


}
