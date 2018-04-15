package idnes

import com.kment.jsoup.Application
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class IdnesRunSpec extends Specification {

//    @Autowired
//    IdnesRun idnesRun
//    @Autowired
//    IArticleSpringDataRepository articleSpringDataRepository
//    @Autowired
//    ICommentSpringDataRepository commentSpringDataRepository

/*
    @Rollback
    def "extract comment from one specific article and save them and read them from db"() {
        given:
        List<Article> articleList = articleSpringDataRepository.findAll()
        int sizeArticleList = articleList.size()
        List<Comment> commentList = commentSpringDataRepository.findAll()
        int sizeCommentList = commentList.size()
        when:
        idnesRun.saveOneArticleWithComments("https://zpravy.idnes.cz/safran-produkce-iran-afghanistan-d44-/zahranicni.aspx?c=A150730_143206_zahranicni_aba")
        articleList = articleSpringDataRepository.findAll()
        int sizeArticleListAfter = articleList.size()
        commentList = commentSpringDataRepository.findAll()
        int sizeCommentListAfter = commentList.size()
        then:
        sizeArticleList+1 == sizeArticleListAfter
        sizeCommentList < sizeCommentListAfter
     }
*/
}
