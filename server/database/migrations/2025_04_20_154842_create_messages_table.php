<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->boolean('is_read')->default(false);
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('receiver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('messages');
    }
};