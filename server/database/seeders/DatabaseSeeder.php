<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            ImageSeeder::class,
            TagSeeder::class,
            UserSeeder::class,
            ArticleSeeder::class,
            QuestionSeeder::class,
            CommentSeeder::class,
            LikeSeeder::class,
            FriendsSeeder::class,
            FriendsRequestsSeeder::class,
        ]);
    }
}
