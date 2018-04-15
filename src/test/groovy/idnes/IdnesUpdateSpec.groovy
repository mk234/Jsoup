package idnes

import com.kment.jsoup.Application
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class IdnesUpdateSpec extends Specification {

//    @Autowired
//    IArticleSpringDataRepository articleSpringDataRepository
////    @Autowired
////    IdnesRun idnesRun
//    @Autowired
//    ICommentSpringDataRepository commentSpringDataRepository
////    @Autowired
//    IdnesUpdate idnesUpdate

    /* @Rollback
     def "find new comment"() {
         given:
         int sizeArticleList = articleSpringDataRepository.findAll().size()
         int sizeCommentList = commentSpringDataRepository.findAll().size()
         when:
         idnesUpdate.updateIdnes(1)
         int sizeArticleListAfter = articleSpringDataRepository.findAll().size()
         int sizeCommentListAfter = commentSpringDataRepository.findAll().size()
         then:
         sizeArticleList <= sizeArticleListAfter
         sizeCommentListAfter >= sizeCommentList
     }*/
}
