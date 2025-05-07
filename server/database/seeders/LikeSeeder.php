<?php

namespace Database\Seeders;

use App\Models\Like;
use App\Models\User;
use App\Models\Article;
use App\Models\Question;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    public function run(): void
    {
        // Get data needed for seeding
        $users = User::where('role_id', 2)->get();
        $articles = Article::all();
        $questions = Question::all();
        $comments = Comment::all();
        
        // Create likes for articles
        foreach ($articles as $article) {
            // Get random users to like this article (between 0 and 8 users)
            $likerCount = min(rand(0, 8), count($users));
            $randomUsers = $users->random($likerCount);
            
            foreach ($randomUsers as $user) {
                Like::create([
                    'user_id' => $user->id,
                    'likeable_id' => $article->id,
                    'likeable_type' => 'App\\Models\\Article',
                ]);
            }
        }
        
        // Create likes for questions
        foreach ($questions as $question) {
            // Get random users to like this question (between 0 and 5 users)
            $likerCount = min(rand(0, 5), count($users));
            $randomUsers = $users->random($likerCount);
            
            foreach ($randomUsers as $user) {
                Like::create([
                    'user_id' => $user->id,
                    'likeable_id' => $question->id,
                    'likeable_type' => 'App\\Models\\Question',
                ]);
            }
        }
        
        // Create likes for comments
        foreach ($comments as $comment) {
            // Get random users to like this comment (between 0 and 3 users)
            $likerCount = min(rand(0, 3), count($users));
            $randomUsers = $users->random($likerCount);
            
            foreach ($randomUsers as $user) {
                Like::create([
                    'user_id' => $user->id,
                    'likeable_id' => $comment->id,
                    'likeable_type' => 'App\\Models\\Comment',
                ]);
            }
        }
    }
}
