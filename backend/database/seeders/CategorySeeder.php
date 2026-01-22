<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Category::insert([
            ['name' => 'Smartphones', 'slug' => 'smartphones'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
            ['name' => 'Featured', 'slug' => 'featured'],
            ['name' => 'New Arrivals', 'slug' => 'new-arrivals'],
        ]);
    }
}
