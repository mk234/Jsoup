import com.kment.jsoup.Application
import com.kment.jsoup.idnes.Comment
import com.kment.jsoup.idnes.CommentEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification
import spock.lang.Unroll

@SpringBootTest
class CommentTest extends Specification {


    Comment comment = new Comment()

    @Unroll
    def "regex for name"() {
        when:

        String result = comment.regex("<!--googleoff: all--> <a href=\"http://muj.idnes.cz/Profil.aspx?id=1184186\">P<i>97</i>e<i>91</i>t<i>81</i>r <i>34</i>H<i>35</i>a<i>81</i>r<i>26</i>i<i>24</i>p<i>92</i>r<i>11</i>a<i>46</i>s<i>55</i>a<i>64</i>d <i>28</i>H<i>50</i>a<i>97</i>j<i>97</i>i<i>53</i>č</a> <sup title=\"Rozlišovací značka diskutujících se stejným jménem\">8<i>49</i>3<i>31</i>0<i>77</i>4<i>50</i>7</sup> \n" +
                "<!--googleon: all-->")

        then:
        result == "Petr Hariprasad Hajič"
    }

    @Unroll
    def "number of comments"() {
        when:

        List<CommentEntity> commentEntityList = new ArrayList<>()
        commentEntityList = comment.findComments()

        then:
        commentEntityList.size() == 50
    }

    @Unroll
    def "first and last comment"() {
        when:
        List<CommentEntity> commentEntityList = new ArrayList<>()
        commentEntityList = comment.findComments()

        String firstComment = "Tak tohle by opravdu mohlo pomoci i v Avghánistánu a přilehlých regionech. Pokud by se šafrán uchytil v západních zemích, má opravdu šanci částečně vytlačit produkci drog pěstovaných na poli. Kdo jednou ochutnal třeba Indické cukrovinky s šafránem, tak mu naše připadají mdlé. Dá se to přidávat třeba do mléčné rýže, jogurtového nápoje, zmrzliny, mandlové hmoty, ale dává se i do slaných jídel. "
        String lastComment = "\n" +
                "\n" +
                "Může být, jak jsem psal, jen reaguji svým názorem a nechci napadat ani nic podobného.\n" +
                "\n" +
                "Jen z praxe vím, že ISO často neznamená zhola nic...\n" +
                "\n" +
                "bývalý zaměstnavatel, nadnárodní logistická společnost....mimochodem toho času třetí největší \"rejdařská\" společnost na světě se za mého působení ve firmě také hnala ta splněním standardu ISO...\n" +
                "\n" +
                "Čehož nakonec dosáhla a víte jak po získání certifikátu vypadaly její služby????\n" +
                "\n" +
                "Stály za úplně stejný exkrement jako bez ISO ;)\n" +
                "\n" +
                "Tabulky, normy a standardy jsou fajn možná papírově a na oko.... "
        then:
        commentEntityList.get(0).content.compareTo(firstComment)
        commentEntityList.get(commentEntityList.size()-1).content.compareTo(lastComment)


    }

    @Unroll
    def "number of pages"() {
        when:
        List<CommentEntity> commentEntityList = new ArrayList<>()
        commentEntityList = comment.findComments()

        then:
        comment.getNumberOfPages() == 3

    }

}
