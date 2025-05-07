<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FriendsSeeder extends Seeder
{
    public function run(): void
    {
        // Get student users
        $users = User::where('role_id', 2)->get();
        
        if (count($users) < 2) {
            return;
        }
        
        // Create friend relationships
        foreach ($users as $user) {
            // Each user will have 1-3 friends
            $friendCount = rand(1, 3);
            
            // Get random users to be friends with (excluding the current user)
            $potentialFriends = $users->where('id', '!=', $user->id)->shuffle()->take($friendCount);
            
            foreach ($potentialFriends as $friend) {
                // Check if this friendship already exists
                $existingFriendship = DB::table('friends')
                    ->where(function ($query) use ($user, $friend) {
                        $query->where('user_id', $user->id)
                              ->where('friend_id', $friend->id);
                    })
                    ->orWhere(function ($query) use ($user, $friend) {
                        $query->where('user_id', $friend->id)
                              ->where('friend_id', $user->id);
                    })
                    ->exists();
                
                if (!$existingFriendship) {
                    // Create a bidirectional friendship (both users are friends with each other)
                    DB::table('friends')->insert([
                        'user_id' => $user->id,
                        'friend_id' => $friend->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    
                    DB::table('friends')->insert([
                        'user_id' => $friend->id,
                        'friend_id' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
