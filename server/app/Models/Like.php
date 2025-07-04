<?php

namespace App\Models;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'likeable_id',
        'likeable_type'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function likeable(){
        return $this->morphTo();
    }

}
