<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_path',
    ];

    public function user(){
        return $this->hasOne(User::class, 'profile_image_id');
    }

    public function questions(){
        return $this->hasMany(Question::class);
    }

    public function articles(){
        return $this->hasMany(Article::class);
    }
}