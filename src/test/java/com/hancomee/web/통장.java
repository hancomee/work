package com.hancomee.web;

import org.junit.Test;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import static com.hancomee.web.controller.db.SqlUtil.*;

public class 통장 {


    @Test
    public void copy() throws Exception {

        String str = "SELECT this.*, customer.*\n" +
                "            FROM hancomee_work this\n" +
                "            INNER JOIN hancomee_customer customer ON this.customer_id = customer.id\n" +
                "            LEFT OUTER JOIN hancomee_workitem item ON this.id = item.work_id\n" +
                "            [INNER JOIN hancomee_workmemo memo ON work.id = memo.work_id {?memo}]\n" +
                "            [INNER JOIN hancomee_workfile_ref ref ON ref.work_id = this.id {?ref}]\n" +
                "            [INNER JOIN hancomee_workfile wfile1 ON ref.id = wfile1.id {?ref}]\n" +
                "            [INNER JOIN hancomee_workfile_print print ON print.item_id = item.id {?print}]\n" +
                "            [INNER JOIN hancomee_workfile wfile3 ON print.id = wfile3.id {?print}]\n" +
                "            WHERE this.state = {state:int}\n" +
                "            [AND this.title LIKE {title:%_%}]\n" +
                "            [AND wfile3.original_name LIKE {print:%_%}]\n" +
                "            [AND wfile1.original_name LIKE {ref:%_%}]\n" +
                "            [AND customer.name LIKE {customerName:%_%}]\n" +
                "            [AND item.subject LIKE {itemSubject:%_%}]\n" +
                "            [AND memo.value LIKE {memo:%_%}]\n" +
                "            [AND this.datetime BETWEEN {st:st} AND {et:et}]\n" +
                "            GROUP BY this.id;";

        Function<Map<String, Object>, String> fun = parser(str);
        Map<String, Object> values = createMap("state", 1, "memo", "뚠'%따", "st", new Date().getTime(), "et", new Date().getTime());
        out(fun.apply(values));
    }




    private static void out(Object obj) {
        System.out.println(obj);
    }

}
