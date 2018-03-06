package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.entity.Comment
import com.kment.jsoup.lidovky.LidovkyRun
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import com.kment.jsoup.springdata.ICommentSpringDataRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class LidovkyRunSpec extends Specification {

    @Autowired
    LidovkyRun lidovkyRun
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository


    @Rollback
    def "extract comment from one specific article and save them and read them from db"() {
        given:
        List<Article> articleList = articleSpringDataRepository.findAll()
        int sizeArticleList = articleList.size()
        List<Comment> commentList = commentSpringDataRepository.findAll()
        int sizeCommentList = commentList.size()
        when:
        lidovkyRun.saveOneArticleWithComments("https://www.lidovky.cz/americke-prezidentske-volby-pod-vlivem-ruska-vysledna-zprava-republikanu-vyjde-v-patek-g6d-/zpravy-svet.aspx?c=A180201_213723_ln_zahranici_ele")
        articleList = articleSpringDataRepository.findAll()
        int sizeArticleListAfter = articleList.size()
        commentList = commentSpringDataRepository.findAll()
        int sizeCommentListAfter = commentList.size()
        then:
        sizeArticleList + 1 == sizeArticleListAfter
        sizeCommentList < sizeCommentListAfter
    }
}
