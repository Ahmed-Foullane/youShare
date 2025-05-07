<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Image;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get student role ID (should be 2 based on RoleSeeder)
        $studentRoleId = 2;
        
        // Get profile image IDs (first 4 images from our ImageSeeder are for profiles)
        $profileImageIds = Image::take(4)->pluck('id')->toArray();
        
        $users = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2022',
                'profile_image_id' => $profileImageIds[0] ?? null,
                'score' => 120
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2022',
                'profile_image_id' => $profileImageIds[1] ?? null,
                'score' => 85
            ],
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Hassan',
                'email' => 'ahmed.hassan@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2023',
                'profile_image_id' => $profileImageIds[2] ?? null,
                'score' => 65
            ],
            [
                'first_name' => 'Sara',
                'last_name' => 'Johnson',
                'email' => 'sara.johnson@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2023',
                'profile_image_id' => $profileImageIds[3] ?? null,
                'score' => 110
            ],
            [
                'first_name' => 'Mohamed',
                'last_name' => 'Ali',
                'email' => 'mohamed.ali@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2023',
                'profile_image_id' => null,
                'score' => 75
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Zahra',
                'email' => 'fatima.zahra@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2024',
                'profile_image_id' => null,
                'score' => 45
            ],
            [
                'first_name' => 'Alex',
                'last_name' => 'Chen',
                'email' => 'alex.chen@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2024',
                'profile_image_id' => null,
                'score' => 90
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Garcia',
                'email' => 'maria.garcia@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2024',
                'profile_image_id' => null,
                'score' => 70
            ],
            [
                'first_name' => 'Karim',
                'last_name' => 'Benzema',
                'email' => 'karim.benzema@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2022',
                'profile_image_id' => null,
                'score' => 95
            ],
            [
                'first_name' => 'Sophia',
                'last_name' => 'Martinez',
                'email' => 'sophia.martinez@youshare.com',
                'password' => Hash::make('password'),
                'role_id' => $studentRoleId,
                'promotion_year' => '2023',
                'profile_image_id' => null,
                'score' => 55
            ],
        ];

        foreach ($users as $userData) {
            if (!User::where('email', $userData['email'])->exists()) {
                User::create($userData);
            }
        }
    }
}
