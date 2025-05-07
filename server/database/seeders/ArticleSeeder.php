<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use App\Models\Category;
use App\Models\Image;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Get data needed for seeding
        $userIds = User::where('role_id', 2)->pluck('id')->toArray();
        $categoryIds = Category::pluck('id')->toArray();
        
        // Get article image IDs (images 4, 5, 6 from ImageSeeder)
        $articleImageIds = Image::skip(3)->take(3)->pluck('id')->toArray();
        
        $tags = Tag::all();
        
        $articles = [
            [
                'title' => 'Getting Started with Laravel 10',
                'content' => 'Laravel is a web application framework with expressive, elegant syntax. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, and caching. In this article, we will explore the new features of Laravel 10 and how to get started with it.',
                'category_id' => $categoryIds[0] ?? 1, // Web Development
                'likes' => 25,
            ],
            [
                'title' => 'React vs Vue: Which One Should You Choose?',
                'content' => 'Both React and Vue are powerful JavaScript frameworks for building user interfaces. React, developed by Facebook, has a larger community and more job opportunities. Vue, on the other hand, is easier to learn and has better documentation. In this article, we will compare these two frameworks in terms of performance, learning curve, community support, and job market.',
                'category_id' => $categoryIds[0] ?? 1, // Web Development
                'likes' => 18,
            ],
            [
                'title' => 'Introduction to Machine Learning with Python',
                'content' => 'Machine Learning is a field of study that gives computers the ability to learn without being explicitly programmed. Python has become the most popular language for machine learning due to its simple syntax and powerful libraries. In this article, we will introduce the basics of machine learning and implement a simple classification algorithm using scikit-learn.',
                'category_id' => $categoryIds[2] ?? 3, // Data Science
                'likes' => 32,
            ],
            [
                'title' => 'Docker for Beginners',
                'content' => 'Docker is a platform for developing, shipping, and running applications in containers. Containers allow developers to package an application with all of its dependencies into a standardized unit for software development. In this tutorial, we will learn how to create a Docker container for a simple web application.',
                'category_id' => $categoryIds[3] ?? 4, // DevOps
                'likes' => 15,
            ],
            [
                'title' => 'Building Your First Mobile App with Flutter',
                'content' => 'Flutter is Google\'s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. In this article, we will build a simple mobile app using Flutter and Dart, and deploy it to both Android and iOS platforms.',
                'category_id' => $categoryIds[1] ?? 2, // Mobile Development
                'likes' => 22,
            ],
            [
                'title' => 'Understanding Web Security Basics',
                'content' => 'Web security is crucial for protecting user data and preventing unauthorized access to your applications. In this article, we will cover the basics of web security, including HTTPS, CORS, XSS, CSRF, and SQL injection attacks, and how to prevent them in your web applications.',
                'category_id' => $categoryIds[4] ?? 5, // Security
                'likes' => 28,
            ],
            [
                'title' => 'Getting Started with Blockchain Development',
                'content' => 'Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping. In this article, we will introduce the basics of blockchain development and build a simple blockchain application using Ethereum and Solidity.',
                'category_id' => $categoryIds[5] ?? 6, // Blockchain
                'likes' => 12,
            ],
            [
                'title' => 'CSS Grid vs Flexbox: When to Use Each',
                'content' => 'CSS Grid and Flexbox are powerful layout systems that can help you create complex designs with ease. While Flexbox is designed for one-dimensional layouts, Grid is designed for two-dimensional layouts. In this article, we will explore the differences between these two systems and when to use each.',
                'category_id' => $categoryIds[0] ?? 1, // Web Development
                'likes' => 20,
            ],
            [
                'title' => 'Modern JavaScript: ES6 and Beyond',
                'content' => 'JavaScript has evolved significantly in recent years, with the introduction of ES6 (ECMAScript 2015) and subsequent versions bringing many new features and improvements. In this article, we will explore the key features of modern JavaScript, including arrow functions, destructuring, async/await, and more.',
                'category_id' => $categoryIds[0] ?? 1, // Web Development
                'likes' => 30,
            ],
            [
                'title' => 'Preparing for Technical Interviews',
                'content' => 'Technical interviews can be challenging, but with the right preparation, you can increase your chances of success. In this article, we will provide tips and strategies for preparing for technical interviews, including how to solve coding problems, answer behavioral questions, and make a good impression on the interviewer.',
                'category_id' => $categoryIds[8] ?? 9, // Career Development
                'likes' => 40,
            ]
        ];
        
        foreach ($articles as $index => $articleData) {
            // Assign a random user as the author
            $articleData['user_id'] = $userIds[array_rand($userIds)];
            
            // Assign an image (if available)
            if (count($articleImageIds) > 0) {
                $articleData['image_id'] = $articleImageIds[$index % count($articleImageIds)];
            }
            
            // Create the article
            $article = Article::create($articleData);
            
            // Attach random tags to the article (2-4 tags per article)
            $randomTagCount = min(rand(2, 4), count($tags));
            $randomTags = $tags->random($randomTagCount);
            $article->tags()->attach($randomTags->pluck('id')->toArray());
        }
    }
}
