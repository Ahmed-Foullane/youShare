<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    
    public function run()
    {
        $adminRole = Role::find(1);
        
        if (!$adminRole) {
            $adminRole = Role::create([
                'id' => 1,
                'name' => 'Admin',
            ]);
        }
        
        if (!User::where('email', 'admin@youshare.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@youshare.com',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'is_active' => true,
                'last_login_at' => now(),
                'score' => 0,
            ]);
            
            $this->command->info('Admin user created: admin@youshare.com / admin123');
        } else {
            $this->command->info('Admin user already exists');
        }
    }
}
