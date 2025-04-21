<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'promotion_year',
        'profile_image_id',
        'score',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function role(){
        return $this->belongsTo(Role::class);
    }

    public function profileImage(){
        return $this->belongsTo(Image::class, 'profile_image_id');
    }

    public function questions(){
        return $this->hasMany(Question::class);
    }

    public function articles(){
        return $this->hasMany(Article::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    public function sentMessages(){
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(){
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function searches(){
        return $this->hasMany(Search::class);
    }
}