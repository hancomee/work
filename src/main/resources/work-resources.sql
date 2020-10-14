
//path datetime uploadtime user content filename filetype filesize source favorite blind down
# select
SELECT this.*
            FROM work_resources this
            WHERE 1
            [AND this.content REGEXP :content]
            [AND this.user LIKE :%user%]
            [AND this.path LIKE :path%]
            [AND this.favorite >= :favorite]
            [AND this.blind = :blind]
            [AND this.down = :down];


/*

 GROUP BY work.id 를 쓰게 되면 행이 나뉘게 된다.
 GROUP BY는 아마도 결과를 행으로 그룹화시키는 역할을 하는 것 같다.

 */
# count
SELECT count(this.id)
            FROM work_resources this
            WHERE 1
            [AND this.content REGEXP :content]
            [AND this.user LIKE :%user%]
            [AND this.path LIKE :path%]
            [AND this.favorite >= :favorite]
            [AND this.blind = :blind]
            [AND this.down = :down];

