package com.hancomee.web.lotto;

import java.util.HashSet;
import java.util.Set;

public class LottoNum implements Comparable<LottoNum> {

    private int[] values;
    private String s;
    private int count = 0;
    private Set<Integer> ids = new HashSet<>();
    private Set<Integer> matchedId = new HashSet<>();

    public LottoNum(int... values) {
        this.values = values;
    }

    public int[] values() {
        return values;
    }

    public int count() {
        return count;
    }

    public Set<Integer> matched() {
        return matchedId;
    }

    public String matchedStr() {
        String[] values = new String[matchedId.size()];
        int i = 0;
        for(Integer v : matchedId)
            values[i++] = v.toString();
        return String.join(", ", values);
    }

    public int count(Lotto lottoNum) {

        if(!ids.add(lottoNum.id)) return count;

        int[] nums = lottoNum.nums;
        for(int i : values) {
            boolean flag = false;
            for(int n : nums) {
                if(n == i) flag = true;
            }
            if(!flag) return count;
        }
        matchedId.add(lottoNum.id);
        count++;
        return count;
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LottoNum lottoN = (LottoNum) o;
        return hashCode() == lottoN.hashCode();
    }

    @Override
    public int compareTo(LottoNum o) {
        if(o.count == count) return -1;
        return o.count - count;
    }

    @Override
    public String toString() {
        if (this.s == null) {
            this.s = toString(values);
        }
        return this.s;
    }

    public static final String toString(int... values) {
        String[] s = new String[values.length];
        int i = 0;
        for (int v : values) s[i++] = Integer.toString(v);
        return String.join(" ", s);
    }
}
