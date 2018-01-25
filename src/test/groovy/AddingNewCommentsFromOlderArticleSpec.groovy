import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.entity.Comment
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle
import com.kment.jsoup.idnes.Comment.ExtractComment
import org.jsoup.nodes.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Shared
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class AddingNewCommentsFromOlderArticleSpec extends Specification {

    ParseFromFile parseFromFile = new ParseFromFile()
     Document articleWithThreeComments = parseFromFile.getDocumentFromFile("html/updating_comments_source/article_with_3_comments.htm")
     Document articleWithOneComments = parseFromFile.getDocumentFromFile("html/updating_comments_source/article_with_1_comment.htm")
     Document commentPageWithOneComment = parseFromFile.getDocumentFromFile("html/updating_comments_source/comment_page_with_1_comment.htm")
     Document commentPageWithThreeComments = parseFromFile.getDocumentFromFile("html/updating_comments_source/comment_page_with_3_comments.htm")
    @Autowired
    ExtractMetaFromArticle extractMetaFromArticle
    @Autowired
    ExtractComment extractComment

    def "number of article in one day"() {
        when:
        int number = extractMetaFromArticle.getNumburOfComment(articleWithThreeComments)

        then:
        number == 3
    }



    def "number of comments"() {
        when:
        List<Comment> commentEntityList = extractComment.findComments("", 0, commentPageWithOneComment)
        then:
        commentEntityList.size() == 1
    }


}
