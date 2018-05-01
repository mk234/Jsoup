package portals

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Comment
import com.kment.jsoup.idnes.Comment.ExtractCommentIdnes
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky
import com.kment.jsoup.novinky.Comment.ExtractCommentNovinky
import idnes.source.ExtractCommentIdnesPreparedData
import lidovky.source.ExtractCommentLidovkyPreparedData
import novinky.source.ExtractCommentNovinkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification
import spock.lang.Unroll

@SpringBootTest(classes = Application.class)
class ExtractCommentSpec extends Specification {

    @Autowired
    ExtractCommentLidovky extractCommentLidovky
    @Autowired
    ExtractCommentNovinky extractCommentNovinky
    @Autowired
    ExtractCommentIdnes extractCommentIdnes

    @Unroll
    def "number of comments for #portalName"() {
        given:
        def extractor = this."extractComment${portalName}"
        when:
        List<Comment> commentList = extractor.findComments("", 0, instance.getCommentPageAsDocument())
        println instance.getCommentPageAsDocument()
        println commentList.toString()
        then:
        commentList.size() == instance.getNumberOfComments()
        where:
        portalName | instance
        "Lidovky"  | new ExtractCommentLidovkyPreparedData()
        "Idnes"    | new ExtractCommentIdnesPreparedData()
        "Novinky"  | new ExtractCommentNovinkyPreparedData()
    }

    @Unroll
    def "first comment for #portalName"() {
        given:
        def extractor = this."extractComment${portalName}"
        when:
        List<Comment> commentList = extractor.findComments("", 0, instance.getCommentPageAsDocument())
        then:
        commentList.get(0).getContent() == instance.getFirsComment()
        where:
        portalName | instance
        "Lidovky"  | new ExtractCommentLidovkyPreparedData()
        "Idnes"    | new ExtractCommentIdnesPreparedData()
    }

    @Unroll
    def "last comment for #portalName"() {
        given:
        def extractor = this."extractComment${portalName}"
        when:
        List<Comment> commentList = extractor.findComments("", 0, instance.getCommentPageAsDocument())
        then:
        commentList.get(commentList.size() - 1).getContent() == instance.getLastComment()
        where:
        portalName | instance
        "Lidovky"  | new ExtractCommentLidovkyPreparedData()
        "Idnes"    | new ExtractCommentIdnesPreparedData()
    }


}
