package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.DataAccess;
import com.boosteel.nativedb.core.anno.SQLString;
import com.boosteel.nativedb.core.anno.Selector;
import com.boosteel.nativedb.core.support.RepositoryConfig;
import com.boosteel.util.IAccess;
import com.boosteel.util.support.MapAccess;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLTimeoutException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Pattern;

import static com.boosteel.nativedb.core.DataConverter.data_by_dType;

public class TTEST {

    private NativeDB db; // = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");

    @Test
    public void copy() throws Exception {

        String url = "https://blogattach.naver.net/c356df6c7f2127fbd43859695cbac0bd194bb557f7/MjAyMDA3MTdfMTYw/MDAxNTk0OTUzNDI5MTY0.Nwm6udpYu96oEsomtt7g4X6aGlA_4eCSdAt8V6kohGQg.D0Jp6KrcoSUBZHU0fkFjQH7sPpM8cikvVkzejyJzgGAg.JPEG/스크린샷_노군꼬치.jpg?type=attachment";
        int pos = url.lastIndexOf("/");
        out(url.substring(pos));

    }


    public void 합계계산() {
        db.doWork(s -> {

            Statement stmt1 = s.createStatement(),
                    stmt3 = s.createStatement(),
                    stmt4 = s.createStatement();

            try (ResultSet rs = stmt1.executeQuery("SELECT id, uuid FROM hancomee_work")) {

                while (rs.next()) {

                    String id = rs.getString("id"),
                            uuid = rs.getString("uuid");

                    compute(stmt3, stmt4, id, uuid);
                }
            }


        });
    }

    private void compute(Statement s, Statement s2, String id, String uuid) throws Exception {

        int work_itemLen = 0, work_vat = 0, work_total = 0,
                count, price, vat, total, itemId;

        try (ResultSet rs = s.executeQuery(
                "SELECT id, count, price, vat, total FROM hancomee_workitem WHERE work_id = " + id)) {
            while (rs.next()) {

                /*
                 *  ① vat가 기입되어 있을 경우 :
                 *     (count * price) / 10 = vat
                 *     (count * price) + vat = total
                 *
                 *  ② vat가 기입되어 있지 않을 경우 :
                 *     (count * price) = total
                 *
                 */
                itemId = rs.getInt("id");
                count = rs.getInt("count");
                price = rs.getInt("price");

                vat = (count * price) / 10;
                total = (count * price) + vat;

                s2.executeUpdate("UPDATE hancomee_workitem " +
                        "SET vat = " + vat + ", total = " + total + " WHERE id = " + itemId);

                work_itemLen++;
                work_vat += vat;
                work_total += total;

            }
        }

        s2.executeUpdate("UPDATE hancomee_work SET vat = " + work_vat +
                ", total = " + work_total + ", item_len = " + work_itemLen + " WHERE id = " + id);
        /*if(work_total > 0 && work_vat > 0) {
            out("\n\n\n" + id + " / " + uuid + "\n------------------------");
            out(price + "\t" + vat + "\t" + total);
            out(work_itemLen + "\t" + work_vat + "\t" + work_total);
        }*/

    }

    interface SQL {
        @Selector("#select.work")
        List<Map<String, Object>> list(Map<String, Object> map);

        @SQLString("#state.work")
        String state(Map<String, Object> map);

        @SQLString("#count.work")
        String count(Map<String, Object> map);
    }


    public String query(List<String> ids) {
        List whens = new ArrayList();
        int i = 0;
        for (String id : ids) {
            whens.add("WHEN " + id + " THEN " + i++ + " \n");
        }

        return "UPDATE hancomee_workitem\n" +
                "SET priority = CASE id \n" +
                String.join("", whens) +
                "ELSE priority\n" +
                "END\n" +
                "WHERE id IN(" + String.join(", ", ids) + ")";
    }

    private static void out(Object obj) {
        System.out.println(obj);
    }

}
