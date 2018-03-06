package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Comment
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky
import lidovky.source.ExtractCommentLidovkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ExtractCommentSpec extends Specification {

    @Autowired
    ExtractCommentLidovky extractComment
    ExtractCommentLidovkyPreparedData preparedData = new ExtractCommentLidovkyPreparedData()

    def "number of comments"() {
        when:
        List<Comment> commentList = extractComment.findComments("", 0, preparedData.getCommentPageAsDocument())
        then:
        commentList.size() == preparedData.getNumberOfComments()
    }

    def "first comment"() {
        when:
        List<Comment> commentList = extractComment.findComments("", 0, preparedData.getCommentPageAsDocument())
        then:
        commentList.get(0).content <=> preparedData.getFirsComment()
    }


    def "last comment"() {
        when:
        List<Comment> commentList = extractComment.findComments("", 0, preparedData.getCommentPageAsDocument())
        then:
        commentList.get(commentList.size() - 1).content <=> preparedData.getLastComment()
    }


}
