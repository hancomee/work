package com.hancomee.web.lotto.numbers;

import com.hancomee.web.lotto.LottoManager;
import com.hancomee.web.lotto.Lotto;
import org.junit.Before;
import org.junit.Test;

import java.text.DecimalFormat;
import java.util.*;

import static java.lang.System.arraycopy;

public class Repeater extends LottoManager {

    int[] result = new int[45];

    @Before
    public void before() throws Exception {
        int i = 45;
        while (i-- > 0)
            result[i] = 0;
    }


    @Test
    public void run() throws Exception {

        //out(loop());
        repeat();

    }


    /*
     *  1회 부터 마지막까지 죄다 돌려본다.
     *
     */
    @Test
    public void matcher() throws Exception {

        List<Lotto> list = list();
        int size = list.size();
        Random random = new Random(111719212225l);

        while (size-- > 0) {
            Lotto ln = list.get(size);
            matcher(random, ln);
        }

        int[] v = null;

        while (temp-- > 0) {
            v = random(random);
        }

        matched(v);
        out("\n" + toString(v));

    }

    long total = 1, temp = 0;
    DecimalFormat f = new DecimalFormat("###,###");

    public void matcher(Random random, Lotto target) throws Exception {
        long count = 1;
        while (matched(target.nums, random(random)) != 6) {
            count++;
            total++;
        }
        temp = count - temp;
        if (temp < 0) temp *= -1;
        out(target.id + "\t" + f.format(count) + " / " + f.format(total) + " == " + temp);
    }



    /*
     *
     */
    public void repeat() throws Exception {
        Map<String, NC> map = new HashMap<>();
        int[] orig, target;
        String nums;

        List<Lotto> list = list();
        int p = 0, p2, size = list.size();

        for (; p < size; p++) {
            orig = list.get(p).nums;
            out(p + " / " + (p + 1));

            for (p2 = p + 1; p2 < size; p2++) {
                nums = "";
                target = list.get(p2).nums;
                for (int b = 0; b < 6; b++) {
                    if (target[b] == orig[b])
                        nums += " " + target[b];
                }
                if (!nums.isEmpty()) {
                    nums = nums.substring(1);
                    NC item = map.get(nums);
                    if (item == null)
                        item = new NC(nums).addId(list.get(p2).id);
                    else item.up(list.get(p2).id);
                    map.put(nums, item);
                }
            }
        }

        Set<NC> set = new TreeSet<>(map.values());
        for (NC c : set)
            out(c);
    }


    class NC implements Comparable<NC> {
        Set<Integer> duplicated = new HashSet<>();
        String nums;
        int count = 1;

        NC(String nums) {
            this.nums = nums;
        }

        NC up(int id) {
            if (duplicated.add(id)) count++;
            return this;
        }

        NC addId(int id) {
            duplicated.add(id);
            return this;
        }

        @Override
        public int compareTo(NC o) {
            return o.count - count;
        }

        @Override
        public String toString() {
            return "[" + count + "] " + nums;
        }
    }


    /*
     *  loop만큼 돌려서 제일 많이 나온 수를 뽑아낸다.
     */
    public String loop() throws Exception {

        Map<String, C> map = new HashMap<>();
        int i = 8145060;
        C ii, iii = ii = null;
        String l;
        while (i-- > 0) {
            l = toString(safeRandom());
            if ((ii = map.get(l)) != null) ii.count++;
            else map.put(l, new C(safeRandom()));
        }

        Set<C> set = new TreeSet<>(map.values());
        i = 0;
        for (C c : set) {
            if (i == 0) ii = c;
            else if (i == 1) iii = c;
            else break;
            i++;
        }

        out(ii.count + ") " + toString(ii.nums) + "   " +
                iii.count + ") " + toString(iii.nums));

        if (ii.count == iii.count)
            return loop();

        out(ii.count + ") " + toString(ii.nums));
        return toString(ii.nums);
    }

    class C implements Comparable<C> {
        int[] nums;
        int count;

        C(int[] nums) {
            this.nums = nums;
        }

        @Override
        public int compareTo(C o) {
            return o.count - count;
        }
    }




}
