<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\User;
use App\Models\Image;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Get data needed for seeding
        $userIds = User::where('role_id', 2)->pluck('id')->toArray();
        
        // Get question image IDs (images 7, 8, 9 from ImageSeeder)
        $questionImageIds = Image::skip(6)->take(3)->pluck('id')->toArray();
        
        $tags = Tag::all();
        
        $questions = [
            [
                'title' => 'How to implement authentication in Laravel?',
                'description' => 'I\'m new to Laravel and I\'m trying to implement user authentication. I\'ve read the documentation but I\'m still confused about how to set it up properly. Can someone explain the process step by step or point me to a good tutorial?',
                'votes' => 8,
            ],
            [
                'title' => 'Best practices for React state management',
                'description' => 'I\'m working on a medium-sized React application and I\'m trying to decide on the best approach for state management. Should I use Context API, Redux, MobX, or something else? What are the pros and cons of each approach?',
                'votes' => 15,
            ],
            [
                'title' => 'How to fix "Cannot read property of undefined" error in JavaScript?',
                'description' => 'I keep getting the error "Cannot read property \'X\' of undefined" in my JavaScript code. I\'ve tried using if statements to check if the object exists before accessing its properties, but I still get the error sometimes. What\'s the best way to handle this?',
                'votes' => 12,
            ],
            [
                'title' => 'Difference between REST and GraphQL',
                'description' => 'I\'ve been using REST APIs for a while, but I\'ve heard a lot about GraphQL recently. What are the main differences between REST and GraphQL, and when should I use one over the other?',
                'votes' => 20,
            ],
            [
                'title' => 'How to deploy a Laravel application on AWS?',
                'description' => 'I\'ve developed a Laravel application locally and now I want to deploy it on AWS. What\'s the best way to do this? Should I use EC2, Elastic Beanstalk, or something else? How do I set up the environment, database, and other requirements?',
                'votes' => 10,
            ],
            [
                'title' => 'Best resources to learn Python for data science',
                'description' => 'I want to learn Python specifically for data science and machine learning. What are the best resources (books, courses, tutorials) to get started? I have some programming experience but I\'m new to Python and data science.',
                'votes' => 18,
            ],
            [
                'title' => 'How to optimize database queries in Laravel?',
                'description' => 'My Laravel application is becoming slow as the database grows. I\'m particularly concerned about N+1 query problems. What are some best practices for optimizing database queries in Laravel?',
                'votes' => 14,
            ],
            [
                'title' => 'Understanding async/await in JavaScript',
                'description' => 'I\'m trying to understand async/await in JavaScript but I\'m finding it confusing. How does it work under the hood? How is it different from Promises? Can someone explain with simple examples?',
                'votes' => 25,
            ],
            [
                'title' => 'How to create a responsive navbar with CSS?',
                'description' => 'I\'m trying to create a responsive navbar that collapses into a hamburger menu on mobile devices. I\'ve tried using media queries and JavaScript, but I\'m not getting the result I want. Can someone provide a simple example of how to do this correctly?',
                'votes' => 7,
            ],
            [
                'title' => 'Best practices for Git workflow in a team',
                'description' => 'I\'m working in a team of 5 developers and we\'re using Git for version control. What\'s the best Git workflow for our team? Should we use feature branches, GitFlow, or something else? How do we handle code reviews and merges?',
                'votes' => 22,
            ],
            [
                'title' => 'How to set up CI/CD pipeline for a Laravel project?',
                'description' => 'I want to set up a continuous integration and continuous deployment pipeline for my Laravel project. I\'m considering using GitHub Actions or Jenkins. What\'s the best approach and how do I set it up?',
                'votes' => 16,
            ],
            [
                'title' => 'Best way to handle file uploads in Laravel',
                'description' => 'I need to implement file uploads in my Laravel application. What\'s the best way to handle this? Should I store files in the public folder or use cloud storage like AWS S3? How do I validate and secure file uploads?',
                'votes' => 9,
            ]
        ];
        
        foreach ($questions as $index => $questionData) {
            // Assign a random user as the asker
            $questionData['user_id'] = $userIds[array_rand($userIds)];
            
            // Assign an image (if available)
            if (count($questionImageIds) > 0) {
                $questionData['image_id'] = $questionImageIds[$index % count($questionImageIds)];
            }
            
            // Create the question
            $question = Question::create($questionData);
            
            // Attach random tags to the question (1-3 tags per question)
            $randomTagCount = min(rand(1, 3), count($tags));
            $randomTags = $tags->random($randomTagCount);
            $question->tags()->attach($randomTags->pluck('id')->toArray());
        }
    }
}
