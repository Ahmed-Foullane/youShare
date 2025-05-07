<?php

namespace Database\Seeders;

use App\Models\Image;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            'https://picsum.photos/id/237/800/600', // Profile image 1
            'https://picsum.photos/id/238/800/600', // Profile image 2
            'https://picsum.photos/id/239/800/600', // Profile image 3
            'https://picsum.photos/id/240/800/600', // Article image 1
            'https://picsum.photos/id/241/800/600', // Article image 2
            'https://picsum.photos/id/242/800/600', // Article image 3
            'https://picsum.photos/id/243/800/600', // Question image 1
            'https://picsum.photos/id/244/800/600', // Question image 2
            'https://picsum.photos/id/245/800/600', // Question image 3
            'https://picsum.photos/id/246/800/600', // Profile image 4
        ];

        foreach ($images as $filePath) {
            if (!Image::where('file_path', $filePath)->exists()) {
                Image::create(['file_path' => $filePath]);
            }
        }
    }
}
