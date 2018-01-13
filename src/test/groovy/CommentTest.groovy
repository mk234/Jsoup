import com.kment.jsoup.Application
import com.kment.jsoup.entity.Comment
import com.kment.jsoup.idnes.Comment.ExtractComment
import com.kment.jsoup.idnes.Comment.ParseName
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

@SpringBootTest
@ContextConfiguration(classes = Application)
class CommentTest extends Specification {
    // Comment Comment = new Comment()
    // ParseName parseName = new ParseName()
// 117 artiklu v https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes
// zadny komentar  https://rungo.idnes.cz/sto-kliku-denne-a-zavody-na-100-metru-zvlada-american-ve-100-letech-pbn-/behani.aspx?c=A150801_204413_behani_Pil
    // pro testovani https://ekonomika.idnes.cz/diskuse.aspx?iddiskuse=A150731_2180917_ekonomika_nio&razeni=vlakno&strana=8 je tam prazdne jmeno
    // zakazane komentare https://zpravy.idnes.cz/soud-nenavistne-vyroky-rasismus-xenofobie-banga-podmineny-trest-vyhruzky-1bt-/krimi.aspx?c=A180109_172752_domaci_bja

    @Autowired
    ParseName parseName
    @Autowired
    ExtractComment comment

    def "regex for name"() {
        when:
        String result = parseName.regex("<!--googleoff: all--> <a href=\\\"http://muj.idnes.cz/Profil.aspx?id=1184186\\\">P<i>97</i>e<i>91</i>t<i>81</i>r <i>34</i>H<i>35</i>a<i>81</i>r<i>26</i>i<i>24</i>p<i>92</i>r<i>11</i>a<i>46</i>s<i>55</i>a<i>64</i>d <i>28</i>H<i>50</i>a<i>97</i>j<i>97</i>i<i>53</i>č</a> <sup title=\\\"Rozlišovací značka diskutujících se stejným jménem\\\">8<i>49</i>3<i>31</i>0<i>77</i>4<i>50</i>7</sup> \\n\" +\n" +
                "                \"<!--googleon: all-->\"")
        then:
        result == "Petr Hariprasad Hajič 83047 \\n\" +"
    }


    def "number of comments"() {
        when:

        List<Comment> commentEntityList = new ArrayList<>()
        commentEntityList = comment.findComments()

        then:
        commentEntityList.size() == 50
    }


    def "first and last comment"() {
        when:
        List<Comment> commentEntityList = new ArrayList<>()
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
        commentEntityList.get(commentEntityList.size() - 1).content.compareTo(lastComment)


    }


    def "number of pages"() {
        when:
        List<Comment> commentEntityList = new ArrayList<>()
        commentEntityList = comment.findComments()

        then:
        comment.getNumberOfPages() == 3

    }

}
