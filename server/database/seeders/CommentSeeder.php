<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        // Get questions
        $questions = Question::all();
        
        // Get user IDs
        $userIds = User::where('role_id', 2)->pluck('id')->toArray();
        
        // Seed comments for each question
        foreach ($questions as $question) {
            // Each question will have 2-5 comments
            $commentCount = rand(2, 5);
            
            for ($i = 0; $i < $commentCount; $i++) {
                $isAccepted = false;
                
                // Make one comment accepted (for some questions)
                if ($i === 0 && rand(0, 1) === 1) {
                    $isAccepted = true;
                }
                
                Comment::create([
                    'content' => $this->getRandomComment($question->title),
                    'votes' => rand(-2, 15),
                    'is_accepted' => $isAccepted,
                    'question_id' => $question->id,
                    'user_id' => $userIds[array_rand($userIds)],
                ]);
            }
        }
    }
    
    private function getRandomComment($questionTitle)
    {
        $comments = [
            'I faced the same issue and solved it by using the Laravel documentation. Check out the authentication section, it explains everything step by step.',
            'This is a common problem. You need to make sure you\'re using the right approach for your specific use case. In my experience, it\'s better to keep it simple at first.',
            'I recommend checking out the official documentation first. It has all the information you need to get started.',
            'I\'ve been working with this for years and I think the best approach is to use a combination of techniques. First, understand the basics, then gradually implement more advanced features.',
            'Have you tried using the built-in functions? They\'re designed to handle these cases automatically.',
            'I had a similar problem and found that breaking it down into smaller components helped a lot. Try to isolate the issue and solve it step by step.',
            'This is more complex than it seems. I suggest studying the underlying principles before implementing a solution.',
            'I recently wrote a blog post about this exact topic. The key is to understand the trade-offs between different approaches.',
            'In my experience, the most efficient way to handle this is to use a library that specializes in this problem. No need to reinvent the wheel.',
            'Have you considered a different approach altogether? Sometimes thinking outside the box leads to better solutions.',
            'I think you\'re on the right track, but you might want to consider some edge cases that could cause problems later.',
            'This is a perfect use case for using design patterns. Specifically, you might want to look into the factory pattern or the strategy pattern.',
            'Make sure you\'re following best practices for security. This is especially important when dealing with user data.',
            'Performance could be an issue if you\'re handling large datasets. Consider optimizing your queries and using caching where appropriate.',
            'I\'ve found that testing is crucial for this kind of functionality. Make sure you have comprehensive tests covering all possible scenarios.',
            'Have you looked at how other frameworks handle this? Sometimes getting inspiration from different approaches can lead to better solutions.',
            'I suggest taking a step back and thinking about the user experience first. Technical implementation should follow user needs, not the other way around.',
            'Documentation is key here. Make sure you document your approach well, especially if others will need to maintain your code.',
            'I think your approach makes sense conceptually, but the implementation might be tricky. Start with a simple proof of concept before committing to a specific solution.',
            'This is a common challenge in software development. I recommend breaking it down into smaller, manageable tasks and tackling them one by one.'
        ];
        
        return $comments[array_rand($comments)];
    }
}
