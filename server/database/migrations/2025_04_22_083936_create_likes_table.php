<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('likeable'); 
            $table->unique(['user_id', 'likeable_id', 'likeable_type']);
            $table->timestamps();
            $table->index(['likeable_id', 'likeable_type']);
        });
    }


    public function down()
    {
        Schema::dropIfExists('likes');
    }
};
