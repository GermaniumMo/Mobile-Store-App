<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Brand::insert([
            ['name' => 'Apple', 'logo' => 'https://logo.clearbit.com/apple.com'],
            ['name' => 'Samsung', 'logo' => 'https://logo.clearbit.com/samsung.com'],
            ['name' => 'Xiaomi', 'logo' => 'https://logo.clearbit.com/mi.com'],
            ['name' => 'Google', 'logo' => 'https://logo.clearbit.com/google.com'],
            ['name' => 'OnePlus', 'logo' => 'https://logo.clearbit.com/oneplus.com'],
        ]);
    }
}
