package idnes.source

class ExtractArticlesIdnesPreparedData {


    String getUrlForArchive() {
        return "https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes"
    }

    int getNumberOfArticlesInArchive() {
        return 117
    }


}
