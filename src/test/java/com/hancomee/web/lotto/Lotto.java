package com.hancomee.web.lotto;

public class Lotto {

    public int id;
    public int bonus;
    public int[] nums;
    public String numbers;
    public String date;

    public Lotto(int id, String date, int... nums) {
        this.date = date;
        this.id = id;
        this.nums = new int[]{
                nums[0], nums[1], nums[2], nums[3], nums[4], nums[5],
        };
        numbers = LottoManager.toString(this.nums);
        bonus = nums[6];
    }

    public boolean equals(int...values) {
        int i = 0;
        for(int a : nums)
            if(values[i++] != a) return false;
        return true;
    }

    public int matched(int... numbers) {
        return LottoManager.matched(nums, numbers);
    }



    @Override
    public String toString() {
        return "[" + id + " / " + date + "] " + LottoManager.toString(nums) + " (" + bonus + ")";
    }


}
