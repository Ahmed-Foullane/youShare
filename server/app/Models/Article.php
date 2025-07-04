<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'category_id',
        'user_id',
        'likes',
        'image_id',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function image(){
        return $this->belongsTo(Image::class);
    }
    
    public function tags(){
        return $this->belongsToMany(Tag::class);
    }

    public function likes(){
        return $this->morphMany(Like::class, 'likeable');
    }
    
}