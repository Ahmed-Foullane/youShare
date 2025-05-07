<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'PHP',
            'Laravel',
            'JavaScript',
            'Vue.js',
            'React',
            'Angular',
            'Node.js',
            'Python',
            'Django',
            'Flask',
            'Ruby',
            'Rails',
            'Java',
            'Spring',
            'C#',
            '.NET',
            'HTML',
            'CSS',
            'SQL',
            'MongoDB',
            'AWS',
            'DevOps',
            'Docker',
            'Kubernetes',
            'Git',
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(['name' => $tagName]);
        }
    }
}
