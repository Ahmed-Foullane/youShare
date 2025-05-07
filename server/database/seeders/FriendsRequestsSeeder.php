<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FriendsRequestsSeeder extends Seeder
{
    public function run(): void
    {
        // Get student users
        $users = User::where('role_id', 2)->get();
        
        if (count($users) < 2) {
            return;
        }
        
        // Create pending friend requests
        for ($i = 0; $i < 8; $i++) {
            // Randomly select two users
            $randomUsers = $users->random(2);
            $sender = $randomUsers[0];
            $receiver = $randomUsers[1];
            
            // Make sure they're not the same user
            if ($sender->id === $receiver->id) {
                continue;
            }
            
            // Check if these users are already friends
            $alreadyFriends = DB::table('friends')
                ->where('user_id', $sender->id)
                ->where('friend_id', $receiver->id)
                ->exists();
            
            if ($alreadyFriends) {
                continue;
            }
            
            // Check if a friend request already exists between these users
            $requestExists = DB::table('friends_requests')
                ->where(function ($query) use ($sender, $receiver) {
                    $query->where('user_id', $sender->id)
                          ->where('friend_id', $receiver->id);
                })
                ->orWhere(function ($query) use ($sender, $receiver) {
                    $query->where('user_id', $receiver->id)
                          ->where('friend_id', $sender->id);
                })
                ->exists();
            
            if ($requestExists) {
                continue;
            }
            
            // Create a friend request
            DB::table('friends_requests')->insert([
                'user_id' => $sender->id,
                'friend_id' => $receiver->id,
                'request_type' => 'sent',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Mirror the request for the receiver
            DB::table('friends_requests')->insert([
                'user_id' => $receiver->id,
                'friend_id' => $sender->id,
                'request_type' => 'received',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
